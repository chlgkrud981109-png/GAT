document.addEventListener('DOMContentLoaded', () => {
    const baseProductCard = document.getElementById('baseProductCard');
    const competitorSlot = document.getElementById('competitorSlot');
    const specsTable = document.getElementById('specsTable');
    const saveBtn = document.getElementById('saveComparisonBtn');
    const toast = document.getElementById('toast');

    // Modal elements
    const searchModal = document.getElementById('searchModal');
    const modalSearchInput = document.getElementById('modalSearchInput');
    const modalSearchResults = document.getElementById('modalSearchResults');
    const closeSearchModal = document.getElementById('closeSearchModal');

    // Load data from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const baseParam = urlParams.get('base');
    const compParam = urlParams.get('comp');

    let matchup = { base: null, competitor: null };
    let isSavePerformed = false;
    let pendingUrl = null;

    async function fetchProductData(keyword) {
        try {
            const res = await fetch(`/api/searchProducts?keyword=${encodeURIComponent(keyword)}&display=1`);
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                const item = data.items[0];
                const lprice = parseInt(item.lprice) || 0;
                return {
                    id: item.productId || Math.random().toString(),
                    name: (item.title || "").replace(/<b>/g, '').replace(/<\/b>/g, ''),
                    rawName: (item.title || "").replace(/<b>/g, '').replace(/<\/b>/g, ''),
                    brand: item.brand || item.mallName || '',
                    category: item.category || '',
                    image: item.image,
                    price: lprice.toLocaleString() + '원',
                    priceVal: lprice,
                    url: item.link,
                    isPriceCaution: false,
                    specs: parseSpecs(item.title, item.brand, item.category)
                };
            }
        } catch (e) {
            console.error("Failed to fetch product:", keyword, e);
        }
        return null;
    }

    async function initializeMatchup() {
        if (baseParam || compParam) {
            // Skeleton mode ON
            document.getElementById('comparisonView').innerHTML = `
                <div style="padding: 2rem; display:flex; gap:1rem;">
                   <div class="skeleton" style="flex:1; height:400px; border-radius:12px;"></div>
                   <div class="skeleton" style="flex:1; height:400px; border-radius:12px;"></div>
                </div>
            `;
            
            if (baseParam) matchup.base = await fetchProductData(baseParam);
            if (compParam) matchup.competitor = await fetchProductData(compParam);
            
            // Re-fetch DOM elements if overwritten
            document.getElementById('comparisonView').innerHTML = `
            <div class="save-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <button class="btn btn-outline" onclick="window.location.href='index.html'">
                    <i data-lucide="arrow-left"></i> 뒤로가기
                </button>
                <div style="display:flex; gap:0.5rem;">
                    <button class="btn btn-outline" id="copyLinkBtn">
                        <i data-lucide="link"></i> 링크 복사
                    </button>
                    <button class="btn btn-shiny" id="saveComparisonBtn">
                        <i data-lucide="bookmark"></i> 현재 비교 저장하기
                    </button>
                </div>
            </div>
            <div class="comparison-container glass-panel">
                <div class="compare-header" id="compareHeader">
                    <div class="compare-card" id="baseProductCard"></div>
                    <div class="vs-badge">VS</div>
                    <div class="compare-card" id="competitorSlot"></div>
                </div>
                <div class="specs-table-container">
                    <table class="specs-table" id="specsTable"></table>
                </div>
                <div id="aiSummarySection"></div>
            </div>`;
            
            lucide.createIcons();
            
            // Re-bind listeners for new DOM
            document.getElementById('saveComparisonBtn').addEventListener('click', () => {
                saveCurrentMatchup(() => showToast('보관함에 저장되었습니다!'));
            });
            document.getElementById('copyLinkBtn').addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('링크가 복사되었습니다!');
                });
            });

            renderComparison();
        } else {
            matchup = JSON.parse(localStorage.getItem('currentMatchup')) || { base: null, competitor: null };
            renderComparison();
        }
    }

    const originalPresetId = localStorage.getItem('loadedPresetId'); // 원본 프리셋 ID (보관함에서 왔을 경우)
    let initialMatchupStr = JSON.stringify(matchup);


    // Exit Modal Elements
    const exitModal = document.getElementById('exitConfirmModal');
    const saveAndExitBtn = document.getElementById('saveAndExitBtn');
    const exitWithoutSaveBtn = document.getElementById('exitWithoutSaveBtn');
    const cancelExitBtn = document.getElementById('cancelExitBtn');

    function isDirty() {
        if (isSavePerformed) return false;
        return JSON.stringify(matchup) !== initialMatchupStr;
    }

    // Intercept all navigation links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && !link.target && !link.href.startsWith('javascript:') && !link.href.includes('#')) {
            if (isDirty()) {
                e.preventDefault();
                pendingUrl = link.href;
                exitModal.classList.remove('hidden');
            }
        }
    });

    // Browser-level navigation guard
    window.addEventListener('beforeunload', (e) => {
        if (isDirty()) {
            e.preventDefault();
            e.returnValue = ''; // Standard way to trigger browser confirmation
        }
    });

    function saveCurrentMatchup(callback) {
        if (!matchup.base || !matchup.competitor) {
            alert("비교할 두 상품이 모두 있어야 저장 가능합니다.");
            return;
        }

        const savedList = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
        const bName = (matchup.base.name || "").split(' ')[0];
        const cName = (matchup.competitor.name || "").split(' ')[0];
        const title = `${bName} vs ${cName}`;
        const date = new Date().toLocaleDateString('ko-KR').replace(/\s/g, '').slice(0, -1);

        if (originalPresetId) {
            // Overwrite existing preset
            const index = savedList.findIndex(item => String(item.id) === String(originalPresetId));
            if (index !== -1) {
                savedList[index] = {
                    ...savedList[index],
                    title: title,
                    date: date,
                    items: [matchup.base, matchup.competitor]
                };
            } else {
                // Should not happen, but fallback to new save
                savedList.unshift({ id: Date.now(), title, date, items: [matchup.base, matchup.competitor] });
            }
        } else {
            // Save as new preset
            savedList.unshift({ id: Date.now(), title, date, items: [matchup.base, matchup.competitor] });
        }

        localStorage.setItem('savedComparisons', JSON.stringify(savedList));
        isSavePerformed = true;
        if (callback) callback();
    }

    // Exit Modal Handlers
    if (saveAndExitBtn) {
        saveAndExitBtn.onclick = () => {
            saveCurrentMatchup(() => {
                if (pendingUrl) window.location.href = pendingUrl;
                else exitModal.classList.add('hidden');
            });
        };
    }

    if (exitWithoutSaveBtn) {
        exitWithoutSaveBtn.onclick = () => {
            isSavePerformed = true; // Mark as "ignore changes"
            if (pendingUrl) window.location.href = pendingUrl;
            else exitModal.classList.add('hidden');
        };
    }

    if (cancelExitBtn) {
        cancelExitBtn.onclick = () => {
            exitModal.classList.add('hidden');
            pendingUrl = null;
        };
    }

    // Detailed Category Config for AI Analysis
    const CATEGORY_CONFIG = {
        '스마트폰': {
            keys: ['프로세서', '메모리', '저장용량', '화면크기', '배터리'],
            labels: ['CPU/AP', 'RAM', '저장소', '디스플레이', '배터리']
        },
        '노트북': {
            keys: ['프로세서', '메모리', '저장용량', '그래픽', '화면크기'],
            labels: ['CPU', 'RAM', 'SSD/HDD', 'GPU', '화면']
        },
        '모니터': {
            keys: ['화면크기', '해상도', '주사율', '패널종류', '입력단자'],
            labels: ['크기', '해상도', '주사율', '패널', '포트']
        },
        '냉장고': {
            keys: ['용량', '도어수', '에너지효율', '냉각방식', '소음'],
            labels: ['전체용량', '도어타입', '에너지등급', '냉각방식', '소음수준']
        },
        '의류': {
            keys: ['소재', '세탁방법', '핏', '계절감', '제조국'],
            labels: ['주요소재', '세탁방법', '실루엣/핏', '계절감', '원산지']
        },
        'default': {
            keys: ['브랜드/제조사', '카테고리', '무게/크기', '쇼핑몰'],
            labels: ['제조사', '분류', '규격/무게', '판매처']
        }
    };

    function getCategoryType(categoryStr = "") {
        const fullCat = categoryStr.toLowerCase();
        if (fullCat.includes('스마트폰') || fullCat.includes('휴대폰')) return '스마트폰';
        if (fullCat.includes('노트북') || fullCat.includes('pc')) return '노트북';
        if (fullCat.includes('모니터')) return '모니터';
        if (fullCat.includes('냉장고') || fullCat.includes('김치냉장고')) return '냉장고';
        if (fullCat.includes('의류') || fullCat.includes('옷') || fullCat.includes('패션')) return '의류';
        return 'default';
    }

    function parseSpecs(name, brand, categoryPath) {
        const specs = { '브랜드/제조사': { value: brand || '알 수 없음', isAi: false }, '쇼핑몰': { value: '네이버 최저가', isAi: false } };
        const lowerName = (name || "").toLowerCase();
        const catType = getCategoryType(categoryPath);

        // Advanced Regex Extractors
        const extractors = {
            '프로세서': [/i[3579]-?\d+[\w\d]*/i, /m[123]-?(pro|max|ultra)?/i, /라이젠\s?[3579]-?\d+/i, /snapdragon\s?\d/i, /a\d{2}/i],
            '메모리': [/(\d{1,2}(gb|g))\s*(ram|메모리)?/i, /(\d{1,2}GB)/i],
            '저장용량': [/(\d{3}(gb|g)|1tb|2tb)\s*(ssd|hdd|저장)?/i, /(\d{3,4}GB)/i],
            '화면크기': [/(\d{2,3}인치|\d{2,3}cm|\d{2,3}\.?\d?형)/i, /(\d{2}\s?(inch|cm))/i],
            '해상도': [/(\d{3,4}x\d{3,4}|fhd|qhd|uhd|4k)/i],
            '용량': [/(\d{3,4}리터|\d{3,4}l)/i],
            '에너지효율': [/(\d등급|에너지효율\d위)/i],
            '소재': [/(면|폴리|나일론|울|캐시미어|린넨|코튼)\s?\d{0,3}%?/i],
            '배터리': [/(\d{4,5}mah)/i]
        };

        // Try to extract known attributes
        Object.entries(extractors).forEach(([key, patterns]) => {
            for (const pat of patterns) {
                const match = name.match(pat);
                if (match) {
                    specs[key] = { value: match[0].toUpperCase(), isAi: false };
                    break;
                }
            }
        });

        // AI Inference Logic (Guess based on context)
        if (catType === '스마트폰') {
            if (!specs['프로세서']) specs['프로세서'] = { value: name.includes('iPhone') ? 'Apple A-Series' : 'Qualcomm/Exynos', isAi: true };
            if (!specs['메모리']) specs['메모리'] = { value: '제조사 확인 필요 (8GB-12GB 추정)', isAi: true };
        } else if (catType === '의류') {
            if (!specs['세탁방법']) specs['세탁방법'] = { value: name.includes('패딩') ? '드라이클리닝 권장' : '기계 세탁 가능', isAi: true };
            if (!specs['소재'] && name.includes('티셔츠')) specs['소재'] = { value: '면 100% 추정', isAi: true };
        } else if (catType === '냉장고') {
            if (!specs['에너지효율']) specs['에너지효율'] = { value: '등급 확인 필요 (1-3등급 추정)', isAi: true };
        }

        return specs;
    }

    function getBadgeHtml(product) {
        if (product && product.isPriceCaution) {
            return `<div class="price-caution"><i data-lucide="alert-triangle" style="width:14px; height:14px;"></i> 가격 주의</div>`;
        }
        // 기본 특징 배지 (인기상품, 최저가 등)
        const isPopular = product && (parseInt(product.reviewCount) > 500 || (product.rating && parseFloat(product.rating) > 4.8));
        if (isPopular) {
            return `<div class="price-caution" style="background:var(--accent-success);"><i data-lucide="award" style="width:14px; height:14px;"></i> 인기상품</div>`;
        }
        return '';
    }

    function renderComparison() {
        if (!matchup || !matchup.base) {
            window.location.href = 'index.html';
            return;
        }

        const { base, competitor } = matchup;
        const onImgError = "this.onerror=null;this.src='https://placehold.co/400x400?text=No+Image';this.insertAdjacentHTML('afterend','<img src=\'https://ui-avatars.com/api/?name=V&background=random\' style=\'display:none;\' onerror=\'this.parentElement.querySelector(\".compare-img\").src=this.src\'>');";

        // Render Base
        const baseTitle = base.name || (base.rawName || base.title || "").replace(/<b>/g, '').replace(/<\/b>/g, '');
        const baseCardWrapper = document.getElementById('baseProductCard');
        if(baseCardWrapper) {
            baseCardWrapper.innerHTML = `
                <div style="position:relative; width:100%;">
                    ${getBadgeHtml(base)}
                    <img src="${base.image}" alt="${baseTitle}" class="compare-img" onerror="${onImgError}">
                    <div class="compare-brand">${base.brand || '알 수 없음'}</div>
                    <div class="compare-title">${baseTitle}</div>
                    <div class="compare-price">${base.price || '정보 없음'}</div>
                    <div style="display:flex; gap:0.5rem; justify-content:center; width:100%;">
                        <button class="btn btn-primary" style="flex:1; padding:0.8rem 1rem;" onclick="window.open('${base.url}', '_blank')">최저가 방문</button>
                        <div style="width:45px; display:none;"></div>
                    </div>
                </div>
            `;
        }

        // Render Competitor (or Empty State)
        const compSlotWrapper = document.getElementById('competitorSlot');
        const specsTableWrapper = document.getElementById('specsTable');

        if (!competitor) {
            if(compSlotWrapper) compSlotWrapper.innerHTML = `
                <div class="empty-slot" onclick="window.openSearchModal()">
                    <i data-lucide="plus-circle" style="width:40px; height:40px; margin-bottom:1rem; color:var(--accent-primary);"></i>
                    <span style="font-weight:600; color:var(--text-secondary);">비교할 상품을 추가하세요</span>
                    <button class="btn btn-outline" style="margin-top:1rem; pointer-events:none;">상품 추가</button>
                </div>
            `;
            if(specsTableWrapper) specsTableWrapper.innerHTML = `<tbody><tr class="category-row"><th colspan="3">제품 상세 비교표</th></tr><tr><td colspan="3" style="text-align:center; padding:3rem; color:var(--text-secondary);">비교할 두 번째 제품을 추가하면<br>상세 명세 분석표가 나타납니다.</td></tr></tbody>`;
        } else {
            const compTitle = competitor.name || (competitor.rawName || competitor.title || "").replace(/<b>/g, '').replace(/<\/b>/g, '');
            if(compSlotWrapper) compSlotWrapper.innerHTML = `
                <div style="position:relative; width:100%;">
                    ${getBadgeHtml(competitor)}
                    <img src="${competitor.image}" alt="${compTitle}" class="compare-img" onerror="${onImgError}">
                    <div class="compare-brand">${competitor.brand || '알 수 없음'}</div>
                    <div class="compare-title">${compTitle}</div>
                    <div class="compare-price">${competitor.price || '정보 없음'}</div>
                    <div style="display:flex; gap:0.5rem; justify-content:center; width:100%;">
                        <button class="btn btn-shiny" style="flex:1; padding:0.8rem 1rem;" onclick="window.open('${competitor.url}', '_blank')">최저가 방문</button>
                        <button class="btn btn-outline" style="width:45px; padding:0.8rem 0;" onclick="window.openSearchModal()" title="다른 상품과 비교">
                            <i data-lucide="refresh-cw"></i>
                        </button>
                    </div>
                </div>
            `;

            // Specs Table Rendering (Ddynamic by Category)
            const catType = getCategoryType(base.category);
            const config = CATEGORY_CONFIG[catType] || CATEGORY_CONFIG['default'];

            let tableHTML = `<tbody><tr class="category-row"><th colspan="3">AI 제품 상세 비교표</th></tr>`;

            // Data for Rule-based summary
            const summaryContext = { basePrice: base.priceVal, compPrice: competitor.priceVal, wins: { base: [], comp: [] } };

            config.keys.forEach((key, idx) => {
                const label = config.labels[idx];

                // Hybrid Handling: Support both old (string) and new ({value, isAi}) formats
                const getValObj = (p, k) => {
                    const s = p.specs ? p.specs[k] : null;
                    if (!s) return { value: '-', isAi: false };
                    if (typeof s === 'string') return { value: s, isAi: false };
                    return s;
                };

                const bSpec = getValObj(base, key);
                const cSpec = getValObj(competitor, key);
                
                // Visualization Progress Bar Logic
                let bBar = '', cBar = '';
                const parseNum = (str) => {
                    const match = String(str).match(/[\d,.]+/);
                    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
                };
                
                const numKeyPatterns = ['저장용량', '화면크기', '메모리', '용량', '배터리', '주사율'];
                if (numKeyPatterns.includes(key)) {
                    const bNum = parseNum(bSpec.value);
                    const cNum = parseNum(cSpec.value);
                    if (bNum > 0 || cNum > 0) {
                        const mx = Math.max(bNum, cNum) || 1;
                        let bPct = (bNum / mx) * 100;
                        let cPct = (cNum / mx) * 100;
                        if(bNum > cNum) summaryContext.wins.base.push(key);
                        else if(cNum > bNum) summaryContext.wins.comp.push(key);
                        
                        bBar = `<div class="spec-bar-wrapper"><div class="spec-bar-fill" style="width:${bPct}%"></div></div>`;
                        cBar = `<div class="spec-bar-wrapper"><div class="spec-bar-fill comp" style="width:${cPct}%"></div></div>`;
                    }
                }

                tableHTML += `
                    <tr>
                        <td class="spec-label" style="width:20%;">${label}</td>
                        <td class="spec-value ${bSpec.isAi ? 'spec-value-ai' : ''}" style="width:40%; text-align:center;">
                            ${bSpec.value || '-'} ${bSpec.isAi ? '<i class="ai-sparkle">✨</i>' : ''}
                            ${bBar}
                        </td>
                        <td class="spec-value ${cSpec.isAi ? 'spec-value-ai' : ''}" style="width:40%; text-align:center;">
                            ${cSpec.value || '-'} ${cSpec.isAi ? '<i class="ai-sparkle">✨</i>' : ''}
                            ${cBar}
                        </td>
                    </tr>
                `;
            });

            tableHTML += `
                <tr class="category-row"><th colspan="3">AI 특징 분석</th></tr>
                <tr>
                    <td class="spec-label">추천 포인트</td>
                    <td class="spec-value" style="font-size:0.9rem;">✅ ${base.brand}의 강점<br>✅ 검증된 인기상품</td>
                    <td class="spec-value" style="font-size:0.9rem;">✅ ${competitor.brand}의 대안<br>✅ 뛰어난 경쟁력</td>
                </tr>
            </tbody>`;

            const specsTableWrapper = document.getElementById('specsTable');
            if(specsTableWrapper) specsTableWrapper.innerHTML = tableHTML;
            
            // Generate zero-cost Rule-based Text
            function generateAISummary(baseName, compName, context) {
                const diff = context.compPrice - context.basePrice;
                const absDiff = Math.abs(diff).toLocaleString();
                let priceText = '';
                if(diff > 0) priceText = `가격 측면에서는 <strong>${baseName}</strong> 제품이 ${compName} 대비 약 <strong>${absDiff}원 저렴</strong>하여 가성비가 뛰어납니다.`;
                else if(diff < 0) priceText = `현재 최저가를 기준으로 <strong>${compName}</strong> 제품이 ${baseName}보다 <strong>${absDiff}원 더 저렴</strong>한 이점을 제공합니다.`;
                else priceText = `두 제품의 최저 가격대가 비슷하게 형성되어 있어, 성능 측면의 비교가 더욱 중요합니다.`;
                
                let specWinText = '';
                if(context.wins.base.length > 0) specWinText += ` <strong>${baseName}</strong>은(는) ${context.wins.base.map(k=>`'${k}'`).join(', ')} 등의 사양에서 수치적으로 우위에 있습니다.`;
                if(context.wins.comp.length > 0) specWinText += ` 반면 <strong>${compName}</strong>은(는) ${context.wins.comp.map(k=>`'${k}'`).join(', ')} 측면에서 더 높은 스펙을 보여주어 사용자 경험을 향상시킬 수 있습니다.`;
                else if (context.wins.base.length === 0 && context.wins.comp.length === 0) specWinText += ` 브랜드 선호도나 AS 등 추가적인 요소를 기준으로 선택하는 것을 추천합니다.`;
                
                return `
                <article class="ai-summary-article">
                    <h3><i data-lucide="sparkles" style="width:20px;"></i> AI 통합 분석: ${baseName} VS ${compName}</h3>
                    <p>
                        소비자들이 가장 많이 고민하는 <strong>${baseName.split(' ')[0]}</strong>과(와) <strong>${compName.split(' ')[0]}</strong> 모델의 데이터 기반 심층 비교 결과입니다. 
                        <br><br>
                        ${priceText} ${specWinText}
                        <br><br>
                        자신의 실사용 목적(예: 휴대성, 작업 환경, 예산)에 맞춰 두 기기 중 객관적으로 더 적합한 모델을 스마트하게 선택하시기 바랍니다.
                    </p>
                </article>`;
            }

            const aiSection = document.getElementById('aiSummarySection');
            if(aiSection) {
                aiSection.innerHTML = generateAISummary(baseTitle, compTitle, summaryContext);
            }

            // AI Notice Bar (Remove existing one first to prevent duplicates)
            const existingNotice = document.querySelector('.ai-notice-bar');
            if (existingNotice) existingNotice.remove();

            const noticeHTML = `
                <div class="ai-notice-bar" style="margin-top:1rem;">
                    <i data-lucide="info" style="width:14px; height:14px; flex-shrink:0;"></i>
                    <span>해당 정보는 공식 정보 부재 시 데이터를 종합 분석한 결과이며, 실제 사양과 다를 수 있습니다.</span>
                </div>
            `;
            if(specsTableWrapper) specsTableWrapper.insertAdjacentHTML('afterend', noticeHTML);
        }

        lucide.createIcons();
    }

    // Modal Search Functions (Synchronized with app.js logic)
    window.openSearchModal = () => {
        searchModal.classList.remove('hidden');
        modalSearchInput.value = '';
        modalSearchResults.innerHTML = '<div class="empty-state" style="padding: 2rem;"><p style="color: var(--text-secondary);">비교할 제품명을 입력하세요.</p></div>';
        modalSearchInput.focus();
    };

    closeSearchModal.onclick = (e) => {
        e.stopPropagation();
        searchModal.classList.add('hidden');
    }

    // Modal bubbling fix
    if (searchModal) {
        searchModal.querySelector('.modal-content').addEventListener('click', e => e.stopPropagation());
    }

    let typingTimer;
    modalSearchInput.oninput = (e) => {
        clearTimeout(typingTimer);
        const query = e.target.value.trim();
        if (query.length < 2) return;
        typingTimer = setTimeout(() => window.modalSearch(query), 500);
    };

    window.modalSearch = async (keyword) => {
        modalSearchResults.innerHTML = '<div style="padding:2rem; text-align:center;"><div class="loading-spinner"></div></div>';
        try {
            const res = await fetch(`/api/searchProducts?keyword=${encodeURIComponent(keyword)}&display=8`);
            const data = await res.json();

            if (data && data.items && data.items.length > 0) {
                // Average price for caution flagging
                const prices = data.items.map(i => parseInt(i.lprice) || 0).filter(p => p > 0);
                const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

                window.modalProducts = data.items.map(item => {
                    const lprice = parseInt(item.lprice) || 0;
                    const rawName = item.name || (item.title || "");
                    const cleanName = rawName.replace(/<b>/g, '').replace(/<\/b>/g, '').trim();

                    let parsedName = cleanName.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
                    const words = parsedName.split(/\s+/);
                    if (words.length > 5) {
                        parsedName = words.slice(0, 5).join(' ') + '...';
                    }

                    return {
                        uid: `m-${Date.now()}-${Math.random()}`,
                        name: parsedName,
                        rawName: cleanName,
                        brand: item.brand || item.mallName || '알 수 없음',
                        category: item.category || '',
                        image: item.image || '',
                        lprice: lprice,
                        priceFormatted: lprice.toLocaleString() + '원',
                        link: item.link || '#',
                        isPriceCaution: avgPrice > 0 && lprice < (avgPrice * 0.5)
                    };
                });
                renderModalResults(window.modalProducts);
            } else {
                modalSearchResults.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--text-secondary);">검색 결과가 없습니다.</div>';
            }
        } catch (e) {
            console.error(e);
            modalSearchResults.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--error);">오류가 발생했습니다.</div>';
        }
    };

    function renderModalResults(products) {
        modalSearchResults.innerHTML = products.map(p => `
            <div class="modal-result-card" onclick="window.selectCompetitor('${p.uid}')" style="position:relative;">
                ${p.isPriceCaution ? `<div class="price-caution" style="transform: scale(0.7); top: -5px; right: -5px;"><i data-lucide="alert-triangle"></i> 가격 주의</div>` : ''}
                <img src="${p.image}" alt="${p.name || ""}" onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                <div class="info">
                    <div class="name">${p.name || ""}</div>
                    <div class="price">${p.priceFormatted}</div>
                </div>
                <i data-lucide="plus-circle" style="width:18px; color:var(--accent-primary);"></i>
            </div>
        `).join('');
        lucide.createIcons();
    }

    window.selectCompetitor = (uid) => {
        const product = (window.modalProducts || []).find(p => p.uid === uid);
        if (!product) return;

        const baseCategory = matchup.base ? matchup.base.category : '';
        const compCategory = product.category || '';

        // Category Validation logic (Simple match of the first category level)
        if (baseCategory && compCategory) {
            const baseCatMain = baseCategory.split('>')[0].trim();
            const compCatMain = compCategory.split('>')[0].trim();
            if (baseCatMain !== compCatMain) {
                alert("같은 카테고리의 상품이 아니므로 비교하기 어렵습니다. 다시 검색해주세요.");
                modalSearchInput.value = '';
                modalSearchResults.innerHTML = '<div class="empty-state" style="padding: 2rem;"><p style="color: var(--text-secondary);">비교할 제품명을 입력하세요.</p></div>';
                return;
            }
        }

        matchup.competitor = {
            id: product.uid,
            name: product.name,
            rawName: product.rawName || product.name,
            brand: product.brand,
            category: product.category,
            image: product.image,
            price: product.priceFormatted,
            priceVal: product.lprice,
            url: product.link,
            isPriceCaution: product.isPriceCaution,
            specs: parseSpecs(product.rawName || product.name, product.brand, product.category)
        };

        localStorage.setItem('currentMatchup', JSON.stringify(matchup));
        searchModal.classList.add('hidden');
        renderComparison();
    };

    // Save Logic
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveCurrentMatchup(() => showToast('보관함에 저장되었습니다!'));
        });
    }

    function showToast(msg) {
        if(toast) {
            toast.innerText = msg;
            toast.classList.remove('hidden');
            toast.classList.add('visible');
            setTimeout(() => {
                toast.classList.remove('visible');
                setTimeout(() => toast.classList.add('hidden'), 300);
            }, 3000);
        }
    }

    // Initialization branch: Start by checking URL
    initializeMatchup();
});
