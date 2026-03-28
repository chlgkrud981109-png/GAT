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

    // Load data from localStorage
    let matchup = JSON.parse(localStorage.getItem('currentMatchup')) || { base: null, competitor: null };

    function getBadgeHtml(product) {
        if (product && product.isPriceCaution) {
            return `<div class="price-caution"><i data-lucide="alert-triangle" style="width:14px; height:14px;"></i> 가격 주의</div>`;
        }
        return '';
    }

    function renderComparison() {
        if (!matchup || !matchup.base) {
            window.location.href = 'index.html';
            return;
        }

        const { base, competitor } = matchup;
        const onImgError = "this.onerror=null;this.src='https://images.placeholder.com/400x400?text=No+Image';";

        // Render Base
        const baseTitle = base.name || (base.rawName || base.title || "").replace(/<b>/g, '').replace(/<\/b>/g, '');
        baseProductCard.innerHTML = `
            <div style="position:relative; width:100%;">
                ${getBadgeHtml(base)}
                <img src="${base.image}" alt="${baseTitle}" class="compare-img" onerror="${onImgError}">
                <div class="compare-brand">${base.brand || '알 수 없음'}</div>
                <div class="compare-title">${baseTitle}</div>
                <div class="compare-price">${base.price || '정보 없음'}</div>
                <div style="display:flex; gap:0.5rem; justify-content:center; width:100%;">
                    <button class="btn btn-primary" style="flex:1; padding:0.8rem 1rem;" onclick="window.open('${base.url}', '_blank')">최저가 방문</button>
                    <!-- Empty placeholder to match competitor's grid -->
                    <div style="width:45px; display:none;"></div>
                </div>
            </div>
        `;

        // Render Competitor (or Empty State)
        if (!competitor) {
            competitorSlot.innerHTML = `
                <div class="empty-slot" onclick="window.openSearchModal()">
                    <i data-lucide="plus-circle" style="width:40px; height:40px; margin-bottom:1rem; color:var(--accent-primary);"></i>
                    <span style="font-weight:600; color:var(--text-secondary);">비교할 상품을 추가하세요</span>
                    <button class="btn btn-outline" style="margin-top:1rem; pointer-events:none;">상품 추가</button>
                </div>
            `;
            specsTable.innerHTML = `<tbody><tr class="category-row"><th colspan="3">제품 상세 비교표</th></tr><tr><td colspan="3" style="text-align:center; padding:3rem; color:var(--text-secondary);">비교할 두 번째 제품을 추가하면<br>상세 명세 분석표가 나타납니다.</td></tr></tbody>`;
        } else {
            const compTitle = competitor.name || (competitor.rawName || competitor.title || "").replace(/<b>/g, '').replace(/<\/b>/g, '');
            competitorSlot.innerHTML = `
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

            // Specs Table Rendering
            const specKeys = ['브랜드/제조사', '메모리 (RAM)', '저장용량', '네트워크', '쇼핑몰'];
            const specLabels = {
                '브랜드/제조사': '제조사',
                '메모리 (RAM)': 'RAM',
                '저장용량': '저장소',
                '네트워크': '네트워크',
                '쇼핑몰': '판매처'
            };

            let tableHTML = `<tbody><tr class="category-row"><th colspan="3">제품 상세 비교표</th></tr>`;
            specKeys.forEach(key => {
                const bVal = base.specs ? (base.specs[key] || '-') : '-';
                const cVal = competitor.specs ? (competitor.specs[key] || '-') : '-';
                tableHTML += `
                    <tr>
                        <td class="spec-label" style="width:20%;">${specLabels[key] || key}</td>
                        <td class="spec-value" style="width:40%; text-align:center;">${bVal}</td>
                        <td class="spec-value" style="width:40%; text-align:center;">${cVal}</td>
                    </tr>
                `;
            });

            tableHTML += `
                <tr class="category-row"><th colspan="3">AI 특징 분석</th></tr>
                <tr>
                    <td class="spec-label">추천 포인트</td>
                    <td class="spec-value" style="font-size:0.9rem;">✅ ${base.brand}의 강점<br>✅ 검증된 스테디셀러</td>
                    <td class="spec-value" style="font-size:0.9rem;">✅ ${competitor.brand}의 대안<br>✅ 뛰어난 가성비</td>
                </tr>
            </tbody>`;
            specsTable.innerHTML = tableHTML;
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
                    if(words.length > 5) {
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
                <img src="${p.image}" alt="${p.name || ""}" onerror="this.src='https://via.placeholder.com/50'">
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
        if(!product) return;

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
            specs: parseSpecs(product.rawName || product.name, product.brand)
        };

        localStorage.setItem('currentMatchup', JSON.stringify(matchup));
        searchModal.classList.add('hidden');
        renderComparison();
    };

    // Save Logic
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (!matchup || !matchup.base || !matchup.competitor) {
                alert("비교할 두 상품이 모두 있어야 저장 가능합니다.");
                return;
            }

            const savedList = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
            const bName = (matchup.base.name || "").split(' ')[0];
            const cName = (matchup.competitor.name || "").split(' ')[0];

            const newSave = {
                id: Date.now(),
                title: `${bName} vs ${cName}`,
                date: new Date().toLocaleDateString('ko-KR').replace(/\s/g, '').slice(0, -1),
                items: [matchup.base, matchup.competitor]
            };

            savedList.unshift(newSave);
            localStorage.setItem('savedComparisons', JSON.stringify(savedList));
            showToast('보관함에 저장되었습니다!');
        });
    }

    function showToast(msg) {
        toast.innerText = msg;
        toast.classList.remove('hidden');
        toast.classList.add('visible');
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000);
    }

    function parseSpecs(name, brand) {
        const specs = { '브랜드/제조사': brand, '쇼핑몰': '네이버 최저가' };
        const lowerName = (name || "").toLowerCase();
        const ramMatch = name.match(/(\d{1,2}GB?)\s*(ram|메모리)?/i);
        if (ramMatch) specs['메모리 (RAM)'] = ramMatch[1].toUpperCase();
        const storageMatch = name.match(/(\d{3}GB|1TB|2TB)/i);
        if (storageMatch) specs['저장용량'] = storageMatch[1].toUpperCase();
        if (lowerName.includes('5g')) specs['네트워크'] = '5G 지원';
        return specs;
    }

    renderComparison();
});
