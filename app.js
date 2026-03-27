document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const productGrid = document.getElementById('productGrid');
    const categoryTags = document.querySelectorAll('.tag');
    const welcomeSection = document.getElementById('welcomeSection');
    const selectionArea = document.getElementById('selectionArea');
    const resetBtn = document.getElementById('resetBtn');

    // Modal elements
    const searchModal = document.getElementById('searchModal');
    const modalSearchInput = document.getElementById('modalSearchInput');
    const modalSearchResults = document.getElementById('modalSearchResults');
    const closeSearchModal = document.getElementById('closeSearchModal');
    const premiumModal = document.getElementById('premiumModal');
    const closePremiumModal = document.getElementById('closePremiumModal');

    let currentCategory = 'all';
    let dynamicProducts = [];

    // --- Search & Filtering ---
    const performSearch = async () => {
        const keyword = searchInput.value.trim();
        const queryCategory = keyword ? 'all' : currentCategory;
        
        productGrid.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>최저가 정보를 가져오는 중...</p></div>';
        
        // Safety check for welcomeSection
        if (welcomeSection) {
            welcomeSection.classList.add('hidden');
        }
        
        if (selectionArea) {
            selectionArea.classList.remove('hidden');
        }

        try {
            const url = `/api/searchProducts?category=${queryCategory}&keyword=${encodeURIComponent(keyword)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                // Calculate global average price for the search results to detect outliers
                const prices = data.items.map(i => parseInt(i.lprice) || 0).filter(p => p > 0);
                const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
                
                const grouped = groupProducts(data.items, avgPrice);
                dynamicProducts = grouped;
                renderProducts(grouped);
            } else {
                productGrid.innerHTML = '<p class="empty-state">검색 결과가 없습니다. 다른 키워드로 시도해 보세요.</p>';
            }
        } catch (error) {
            console.error('Search error:', error);
            productGrid.innerHTML = '<p class="empty-state">데이터를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.</p>';
        }
    };

    function groupProducts(items, globalAvg) {
        const groups = {};
        items.forEach(item => {
            const rawTitle = item.title || "";
            const cleanTitle = rawTitle.replace(/<b>/g, '').replace(/<\/b>/g, '').trim();
            const groupKey = cleanTitle.split(' ').slice(0, 3).join(' ');
            
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });

        return Object.values(groups).map(group => {
            const winner = group.reduce((prev, curr) => {
                const prevPrice = parseInt(prev.lprice) || Infinity;
                const currPrice = parseInt(curr.lprice) || Infinity;
                return currPrice < prevPrice ? curr : prev;
            });

            const lprice = parseInt(winner.lprice) || 0;
            // Price Caution: If price is less than 50% of the global average for this search
            const isCaution = globalAvg > 0 && lprice < (globalAvg * 0.5);

            return {
                uid: winner.productId || Math.random().toString(36).substr(2, 9),
                name: (winner.title || "").replace(/<b>/g, '').replace(/<\/b>/g, ''),
                brand: winner.brand || winner.mallName || '브랜드 정보 없음',
                image: winner.image,
                lprice: winner.lprice,
                priceVal: lprice,
                priceFormatted: lprice.toLocaleString() + '원',
                link: winner.link,
                isPriceCaution: isCaution,
                allSellers: group.length > 1 ? group.map(s => ({
                    mallName: s.mallName,
                    price: s.lprice,
                    link: s.link
                })) : null
            };
        });
    }

    const renderProducts = (products) => {
        productGrid.innerHTML = products.map(product => `
            <div class="product-card glass-panel" onclick="window.selectProduct('${product.uid}')">
                ${product.isPriceCaution ? `<div class="price-caution" style="top:5px; right:5px;"><i data-lucide="alert-triangle" style="width:12px; height:12px;"></i> 가격 주의</div>` : ''}
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/200'">
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${product.priceFormatted}</div>
                    ${product.allSellers ? `<div class="seller-badge">외 ${product.allSellers.length}개 판매처</div>` : ''}
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    };

    // Category selection
    categoryTags.forEach(tag => {
        tag.addEventListener('click', () => {
            categoryTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentCategory = tag.dataset.category;
            searchInput.value = '';
            performSearch();
        });
    });

    // Category Card Clicks (V2 support)
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.dataset.category;
            searchInput.value = '';
            performSearch();
        });
    });

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    if(resetBtn) {
        resetBtn.addEventListener('click', () => location.reload());
    }

    // --- Core Interaction: One-Click Redirect ---
    window.selectProduct = async function(uid, isModal = false) {
        const targetList = isModal ? window.modalProducts : dynamicProducts;
        const product = (targetList || []).find(p => p.uid === uid);
        if(!product) return;

        const baseProduct = {
            id: product.uid,
            name: (product.name || "").replace(/<b>/g, '').replace(/<\/b>/g, ''),
            brand: product.brand,
            image: product.image,
            price: product.priceFormatted,
            priceVal: product.priceVal || (parseInt(product.lprice) || 0),
            url: product.link,
            isPriceCaution: product.isPriceCaution || false,
            specs: parseSpecs(product.name, product.brand)
        };

        const currentMatchup = JSON.parse(localStorage.getItem('currentMatchup')) || { base: null, competitor: null };
        
        // If we are selecting a competitor from a modal in compare.html, this part usually wouldn't be called from app.js,
        // but for safety, we handle it.
        const matchup = { base: baseProduct, competitor: null };
        localStorage.setItem('currentMatchup', JSON.stringify(matchup));
        
        if (isModal && searchModal) searchModal.classList.add('hidden');
        window.location.href = 'compare.html';
    };

    // --- Modal Search Functions ---
    window.openSearchModal = () => {
        if(searchModal) {
            searchModal.classList.remove('hidden');
            modalSearchInput.focus();
        }
    };

    if(closeSearchModal) {
        closeSearchModal.addEventListener('click', () => {
            searchModal.classList.add('hidden');
        });
    }

    window.modalSearch = async (keyword) => {
        if (!keyword) return;
        modalSearchResults.innerHTML = '<div class="loading-spinner"></div>';
        
        try {
            const res = await fetch(`/api/searchProducts?keyword=${encodeURIComponent(keyword)}&display=8`);
            const data = await res.json();
            
            if (data.items && data.items.length > 0) {
                const prices = data.items.map(i => parseInt(i.lprice) || 0).filter(p => p > 0);
                const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

                window.modalProducts = data.items.map(item => {
                    const lprice = parseInt(item.lprice) || 0;
                    return {
                        uid: item.productId || Math.random().toString(),
                        name: (item.title || "").replace(/<b>/g, '').replace(/<\/b>/g, ''),
                        brand: item.brand || item.mallName || '',
                        image: item.image,
                        lprice: item.lprice,
                        priceVal: lprice,
                        priceFormatted: lprice.toLocaleString() + '원',
                        link: item.link,
                        isPriceCaution: avgPrice > 0 && lprice < (avgPrice * 0.5)
                    };
                });
                
                modalSearchResults.innerHTML = window.modalProducts.map(p => `
                    <div class="modal-result-card" onclick="window.selectProduct('${p.uid}', true)" style="position:relative;">
                        ${p.isPriceCaution ? `<div class="price-caution" style="transform: scale(0.7); top: -5px; right: -5px;"><i data-lucide="alert-triangle" style="width:10px; height:10px;"></i> 가격 주의</div>` : ''}
                        <img src="${p.image}" alt="${p.name}">
                        <div class="info">
                            <div class="name">${p.name}</div>
                            <div class="price">${p.priceFormatted}</div>
                        </div>
                    </div>
                `).join('');
                lucide.createIcons();
            } else {
                modalSearchResults.innerHTML = '<p class="empty-state">결과 없음</p>';
            }
        } catch (e) {
            modalSearchResults.innerHTML = '<p class="empty-state">에러</p>';
        }
    };

    if(modalSearchInput) {
        let typingTimer;
        modalSearchInput.addEventListener('input', (e) => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => window.modalSearch(e.target.value), 500);
        });
    }

    if(closePremiumModal) {
        closePremiumModal.addEventListener('click', () => {
            premiumModal.classList.add('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === searchModal) searchModal.classList.add('hidden');
        if (e.target === premiumModal) premiumModal.classList.add('hidden');
    });

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

    lucide.createIcons();
});
