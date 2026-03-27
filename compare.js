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

    function renderComparison() {
        if (!matchup || !matchup.base) {
            // No base product, go back to main
            window.location.href = 'index.html';
            return;
        }

        const { base, competitor } = matchup;
        const onImgError = "this.onerror=null;this.src='https://images.placeholder.com/400x400?text=No+Image';";

        // Render Base (Title safety)
        const baseTitle = base.name || (base.title || "");
        baseProductCard.innerHTML = `
            <img src="${base.image}" alt="${baseTitle}" class="compare-img" onerror="${onImgError}">
            <div class="compare-brand">${base.brand || '알 수 없음'}</div>
            <div class="compare-title">${baseTitle}</div>
            <div class="compare-price">${base.price || '정보 없음'}</div>
            <button class="btn btn-primary" onclick="window.open('${base.url}', '_blank')">최저가 방문</button>
        `;

        // Render Competitor (Title safety & Empty State)
        if (!competitor) {
            competitorSlot.innerHTML = `
                <div class="empty-slot" onclick="window.openSearchModal()">
                    <i data-lucide="plus-circle" style="width:40px; height:40px; margin-bottom:1rem; color:var(--accent-primary);"></i>
                    <span style="font-weight:600; color:var(--text-secondary);">비교할 상품을 추가하세요</span>
                    <button class="btn btn-outline" style="margin-top:1rem; pointer-events:none;">상품 선택하기</button>
                </div>
            `;
            specsTable.innerHTML = `<tbody><tr class="category-row"><th colspan="3">1:1 라이벌 명세 대조</th></tr><tr><td colspan="3" style="text-align:center; padding:3rem; color:var(--text-secondary);">비교할 두 번째 제품을 추가하면<br>상세 명세 분석표가 나타납니다.</td></tr></tbody>`;
        } else {
            const compTitle = competitor.name || (competitor.title || "");
            competitorSlot.innerHTML = `
                <div style="position:relative; width:100%;">
                    <img src="${competitor.image}" alt="${compTitle}" class="compare-img" onerror="${onImgError}">
                    <div class="compare-brand">${competitor.brand || '알 수 없음'}</div>
                    <div class="compare-title">${compTitle}</div>
                    <div class="compare-price">${competitor.price || '정보 없음'}</div>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-shiny" style="flex:1;" onclick="window.open('${competitor.url}', '_blank')">최저가 방문</button>
                        <button class="btn btn-outline" style="width:45px;" onclick="window.openSearchModal()" title="다른 상품과 비교">
                            <i data-lucide="refresh-cw"></i>
                        </button>
                    </div>
                </div>
            `;

            // Specs Table
            const specKeys = ['브랜드/제조사', '메모리 (RAM)', '저장용량', '네트워크', '쇼핑몰'];
            const specLabels = {
                '브랜드/제조사': '제조사',
                '메모리 (RAM)': 'RAM',
                '저장용량': '저장소',
                '네트워크': '네트워크',
                '쇼핑몰': '판매처'
            };

            let tableHTML = `<tbody><tr class="category-row"><th colspan="3">1:1 라이벌 명세 대조</th></tr>`;

            specKeys.forEach(key => {
                const bVal = base.specs[key] || '-';
                const cVal = (competitor.specs && competitor.specs[key]) ? competitor.specs[key] : '-';
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

    // Modal Operations
    window.openSearchModal = () => {
        searchModal.classList.remove('hidden');
        modalSearchInput.value = '';
        modalSearchResults.innerHTML = '<div class="empty-state" style="padding: 2rem;"><p style="color: var(--text-secondary);">비교할 제품명을 입력하세요.</p></div>';
        modalSearchInput.focus();
    };

    closeSearchModal.onclick = () => searchModal.classList.add('hidden');
    window.onclick = (e) => { if(e.target === searchModal) searchModal.classList.add('hidden'); };

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
                window.modalProducts = data.items.map(item => {
                    const rawName = item.name || (item.title || "");
                    const cleanName = rawName.replace(/<b>/g, '').replace(/<\/b>/g, '');
                    return {
                        uid: `m-${Date.now()}-${Math.random()}`,
                        name: cleanName,
                        brand: item.brand || item.mallName || '알 수 없음',
                        image: item.image || '',
                        lprice: item.lprice || 0,
                        priceFormatted: (item.lprice ? parseInt(item.lprice).toLocaleString() : '0') + '원',
                        link: item.link || '#'
                    };
                });
                renderModalResults(window.modalProducts);
            } else {
                modalSearchResults.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--text-secondary);">검색 결과가 없습니다.</div>';
            }
        } catch (e) {
            modalSearchResults.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--error);">오류가 발생했습니다.</div>';
        }
    };

    function renderModalResults(products) {
        modalSearchResults.innerHTML = products.map(p => `
            <div class="modal-result-card" onclick="window.selectCompetitor('${p.uid}')">
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
        const product = window.modalProducts.find(p => p.uid === uid);
        if(!product) return;

        matchup.competitor = {
            id: product.uid,
            name: product.name,
            brand: product.brand,
            image: product.image,
            price: product.priceFormatted,
            priceVal: product.lprice,
            url: product.link,
            specs: parseSpecs(product.name, product.brand)
        };

        localStorage.setItem('currentMatchup', JSON.stringify(matchup));
        searchModal.classList.add('hidden');
        renderComparison();
    };

    // Save Logic (User request object structure)
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (!matchup || !matchup.base || !matchup.competitor) {
                alert("비교할 두 상품이 모두 있어야 저장 가능합니다.");
                return;
            }

            const savedList = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
            
            const bName = matchup.base.name || (matchup.base.title || "");
            const cName = matchup.competitor.name || (matchup.competitor.title || "");

            const newSave = {
                id: Date.now(),
                title: `${bName.split(' ')[0]} vs ${cName.split(' ')[0]}`,
                date: new Date().toLocaleDateString('ko-KR').replace(/\s/g, '').slice(0, -1), // "2026.03.28"
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

    // Helper: Specs Parser (Simplified version if not shared)
    function parseSpecs(name, brand) {
        const specs = { '브랜드/제조사': brand, '쇼핑몰': '네이버 최저가' };
        const lowerName = name.toLowerCase();
        
        const ramMatch = name.match(/(\d{1,2}GB?)\s*(ram|메모리)?/i);
        if (ramMatch) specs['메모리 (RAM)'] = ramMatch[1].toUpperCase();
        
        const storageMatch = name.match(/(\d{3}GB|1TB|2TB)/i);
        if (storageMatch) specs['저장용량'] = storageMatch[1].toUpperCase();
        
        if (lowerName.includes('5g')) specs['네트워크'] = '5G 지원';
        
        return specs;
    }

    renderComparison();
});
