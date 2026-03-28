document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const productGrid = document.getElementById('productGrid');
    const categoryTags = document.querySelectorAll('.tag');
    const welcomeSection = document.getElementById('welcomeSection');
    const selectionArea = document.getElementById('selectionArea');
    const resetBtn = document.getElementById('resetBtn');
    const dynamicKeyword = document.getElementById('dynamicKeyword');

    // Modal elements
    const searchModal = document.getElementById('searchModal');
    const modalSearchInput = document.getElementById('modalSearchInput');
    const modalSearchResults = document.getElementById('modalSearchResults');
    const closeSearchModal = document.getElementById('closeSearchModal');
    const premiumModal = document.getElementById('premiumModal');
    const closePremiumModal = document.getElementById('closePremiumModal');

    // Add back button to selection area dynamically if not exists
    if (selectionArea) {
        const header = selectionArea.querySelector('.section-header');
        if (header && !document.getElementById('backToMainBtn')) {
            const backBtn = document.createElement('button');
            backBtn.id = 'backToMainBtn';
            backBtn.className = 'btn btn-icon btn-outline';
            backBtn.style.marginRight = '1rem';
            backBtn.innerHTML = '<i data-lucide="arrow-left"></i> 뒤로가기';
            backBtn.addEventListener('click', () => {
                selectionArea.classList.add('hidden');
                if (welcomeSection) welcomeSection.classList.remove('hidden');
                searchInput.value = '';
                productGrid.innerHTML = '';
            });
            header.insertBefore(backBtn, header.firstChild);
        }
    }

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
            const rawTitle = item.name || item.title || "";
            // Phase 3 Data Parsing: Keep only Brand + Model name by taking the first 2-3 significant words 
            // and removing extraneous promotional text in brackets etc.
            let cleanTitle = rawTitle.replace(/<b>/g, '').replace(/<\/b>/g, '')
                                     .replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
            
            // Group by the first 2-3 significant words to cluster similar products from different sellers.
            const words = cleanTitle.split(/\s+/);
            const groupKey = words.slice(0, Math.min(words.length, 3)).join(' ');
            
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });

        return Object.values(groups).map(group => {
            // Antigravity Item Winner Logic:
            // Calculate a score for each item to pick the reliable 'Winner' representative for the group.
            // Score = (1 / Price * 1000) + (ReviewCount * 0.5) + (Rating * 10)
            const getScore = (item) => {
                const price = parseInt(item.lprice) || Infinity;
                if (price === Infinity) return -1;
                const reviews = parseInt(item.reviewCount) || 0;
                const rating = parseFloat(item.rating) || 0;
                return (1000000 / price) + (reviews * 0.5) + (rating * 10);
            };

            const winner = group.reduce((prev, curr) => {
                return getScore(curr) > getScore(prev) ? curr : prev;
            });

            // Find absolute lowest price in group for display purposes, even if it's not the winner
            const lowestPriceItem = group.reduce((prev, curr) => {
                const prevPrice = parseInt(prev.lprice) || Infinity;
                const currPrice = parseInt(curr.lprice) || Infinity;
                return currPrice < prevPrice ? curr : prev;
            });

            const lprice = parseInt(lowestPriceItem.lprice) || 0;
            // Price Caution: If lowest price is suspiciously lower than the winner's or global average
            const winnerPrice = parseInt(winner.lprice) || 0;
            const isCaution = (globalAvg > 0 && lprice < (globalAvg * 0.5)) || (lprice < winnerPrice * 0.6);

            // Parse title for cleaner display
            const rawWinnerTitle = (winner.name || winner.title || "").replace(/<b>/g, '').replace(/<\/b>/g, '');
            let parsedName = rawWinnerTitle.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
            const words = parsedName.split(/\s+/);
            // If the name is too long, try to truncate to sensible brand + product name
            if(words.length > 5) {
               parsedName = words.slice(0, 5).join(' ') + '...';
            }

            return {
                uid: winner.id || winner.productId || Math.random().toString(36).substr(2, 9),
                name: parsedName,
                rawName: rawWinnerTitle, // Keep raw if needed for specs
                brand: winner.brand || winner.maker || '브랜드 정보 없음',
                category: winner.category || '',
                image: winner.image,
                lprice: lprice, // Show lowest price found in group
                priceVal: lprice,
                priceFormatted: lprice.toLocaleString() + '원',
                link: winner.link, // Lead to winner's link
                isPriceCaution: isCaution,
                rating: winner.rating || '0.0',
                reviewCount: winner.reviewCount || 0,
                allSellers: group.length > 1 ? group.map(s => ({
                    mallName: s.mallName,
                    price: parseInt(s.lprice) || Infinity,
                    link: s.link
                })).sort((a,b) => a.price - b.price) : null
            };
        });
    }

    const renderProducts = (products) => {
        productGrid.innerHTML = products.map(product => `
            <div class="product-card-list" onclick="window.selectProduct('${product.uid}')">
                ${product.isPriceCaution ? `<div class="price-caution" style="position:absolute; top:1rem; right:1rem;"><i data-lucide="alert-triangle" style="width:12px; height:12px;"></i> 가격 주의</div>` : ''}
                <div class="product-image-wrap">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/100'">
                </div>
                <div class="product-info" style="flex:1; padding-right: 2rem;">
                    <div class="product-brand">${product.brand}</div>
                    <h3 class="product-name" style="margin-bottom:0.25rem;">${product.name}</h3>
                    <div class="product-price" style="font-size:1.2rem;">${product.priceFormatted} <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:normal;">최저가</span></div>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; font-size:0.85rem; color:var(--text-secondary);">
                        <div style="display:flex; align-items:center; gap:0.25rem;">
                            <i data-lucide="star" style="width:14px; height:14px; color:gold; fill:gold;"></i>
                            <span>${product.rating}</span>
                            <span>(${product.reviewCount})</span>
                        </div>
                        ${product.allSellers ? `<div class="seller-badge">묶음 ${product.allSellers.length}개 판매처</div>` : ''}
                    </div>
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
            name: product.name,
            rawName: product.rawName || product.name,
            brand: product.brand,
            category: product.category,
            image: product.image,
            price: product.priceFormatted,
            priceVal: product.priceVal || (parseInt(product.lprice) || 0),
            url: product.link,
            isPriceCaution: product.isPriceCaution || false,
            specs: parseSpecs(product.rawName || product.name, product.brand)
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

    // Fix event bubbling for modals
    if (searchModal) {
        searchModal.querySelector('.modal-content').addEventListener('click', e => e.stopPropagation());
    }
    if (premiumModal) {
        premiumModal.querySelector('.modal-content').addEventListener('click', e => e.stopPropagation());
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

    // --- Dynamic Hero Keyword Animation ---
    if (dynamicKeyword) {
        const keywords = ["아이폰 16", "갤럭시 S24", "맥북 에어", "다이슨 청소기", "에어팟 프로"];
        let keywordIndex = 0;

        function animateKeyword() {
            dynamicKeyword.style.opacity = 0;
            
            setTimeout(() => {
                keywordIndex = (keywordIndex + 1) % keywords.length;
                dynamicKeyword.textContent = keywords[keywordIndex];
                dynamicKeyword.style.opacity = 1;
            }, 400); // Wait for fade out to complete (0.4s matching CSS transition)
        }

        setInterval(animateKeyword, 3000); // 3 seconds interval
    }

    lucide.createIcons();
});
