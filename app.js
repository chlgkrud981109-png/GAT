// --- Fake Database for Legacy Fallbacks ---
const productsDB = [
    {
        id: 'iphone15pro',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        category: 'smartphone',
        price: '₩1,550,000',
        priceVal: 1550000,
        image: 'https://images.unsplash.com/photo-1696446700622-df7f5b3fc0ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        competitors: ['galaxys24ultra', 'pixel8pro'], // IDs of competitors
        specs: {
            display: '6.1인치 Super Retina XDR (120Hz)',
            processor: 'A17 Pro',
            ram: '8GB',
            camera: '48MP 메인 + 12MP 울트라와이드 + 12MP 망원 (3x)',
            battery: '3,274 mAh',
            weight: '187g',
            os: 'iOS 17'
        },
        pros: ['업계 최고 수준의 성능 (A17 Pro)', '티타늄 소재로 가벼워진 무게', '우수한 동영상 촬영 품질'],
        cons: ['다소 비싼 가격', '배터리 타임이 아쉬움']
    },
    {
        id: 'galaxys24ultra',
        name: 'Galaxy S24 Ultra',
        brand: 'Samsung',
        category: 'smartphone',
        price: '₩1,698,000',
        priceVal: 1698000,
        image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', // Proxy image
        rating: 4.7,
        competitors: ['iphone15pro', 'pixel8pro'],
        specs: {
            display: '6.8인치 Dynamic AMOLED 2X (120Hz)',
            processor: 'Snapdragon 8 Gen 3 for Galaxy',
            ram: '12GB',
            camera: '200MP 메인 + 50MP 망원 (5x) + 10MP 망원 (3x) + 12MP 초광각',
            battery: '5,000 mAh',
            weight: '232g',
            os: 'Android 14 (One UI 6.1)'
        },
        pros: ['내장 S-펜 지원', '압도적인 카메라 줌 성능', '강력한 온디바이스 AI 기능'],
        cons: ['무겁고 두꺼운 디자인', '높은 출고가']
    },
    {
        id: 'pixel8pro',
        name: 'Pixel 8 Pro',
        brand: 'Google',
        category: 'smartphone',
        price: '₩1,350,000',
        priceVal: 1350000,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', // Proxy image
        rating: 4.5,
        competitors: ['iphone15pro', 'galaxys24ultra'],
        specs: {
            display: '6.7인치 LTPO OLED (120Hz)',
            processor: 'Google Tensor G3',
            ram: '12GB',
            camera: '50MP 메인 + 48MP 울트라와이드 + 48MP 망원 (5x)',
            battery: '5,050 mAh',
            weight: '213g',
            os: 'Android 14'
        },
        pros: ['뛰어난 사진 품질과 AI 보정', '7년 OS 업데이트 지원', '클린한 안드로이드 경험'],
        cons: ['경쟁사 대비 낮은 게이밍 성능', '국내 정식 발매 미지원']
    },
    {
        id: 'macbookairm3',
        name: 'MacBook Air 15" (M3)',
        brand: 'Apple',
        category: 'laptop',
        price: '₩1,890,000',
        priceVal: 1890000,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        competitors: ['galaxybook4pro', 'gram15'],
        specs: {
            display: '15.3인치 Liquid Retina (2880 x 1864)',
            processor: 'Apple M3 (8코어 CPU, 10코어 GPU)',
            ram: '8GB ~ 24GB',
            storage: '256GB ~ 2TB SSD',
            battery: '최대 18시간',
            weight: '1.51kg',
            os: 'macOS'
        },
        pros: ['압도적인 전성비와 배터리 타임', '팬리스 설계로 무소음', '아름답고 견고한 알루미늄 바디'],
        cons: ['무거운 게임 불가', '포트 확장성 부족']
    },
    {
        id: 'galaxybook4pro',
        name: 'Galaxy Book 4 Pro 16"',
        brand: 'Samsung',
        category: 'laptop',
        price: '₩2,150,000',
        priceVal: 2150000,
        image: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', // Proxy
        rating: 4.6,
        competitors: ['macbookairm3', 'gram15'],
        specs: {
            display: '16인치 Dynamic AMOLED 2X (2880 x 1800, 120Hz 터치)',
            processor: 'Intel Core Ultra 7 155H',
            ram: '16GB ~ 32GB',
            storage: '512GB ~ 1TB NVMe',
            battery: '76Wh',
            weight: '1.56kg',
            os: 'Windows 11 Home'
        },
        pros: ['선명한 AMOLED 터치 디스플레이', '강력한 NPU AI 성능', '갤럭시 생태계 연동'],
        cons: ['고부하 작업 시 발열 및 소음', '조금 아쉬운 배터리 타임']
    },
    {
        id: 'gram15',
        name: 'LG 그램 15',
        brand: 'LG',
        category: 'laptop',
        price: '₩1,780,000',
        priceVal: 1780000,
        image: 'https://images.unsplash.com/photo-1531297122539-5692b6982e08?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', // Proxy
        rating: 4.5,
        competitors: ['macbookairm3', 'galaxybook4pro'],
        specs: {
            display: '15.6인치 FHD IPS (1920 x 1080)',
            processor: 'Intel Core Ultra 5',
            ram: '16GB',
            storage: '256GB + 확장 슬롯',
            battery: '72Wh',
            weight: '0.99kg',
            os: 'Windows 11 Home'
        },
        pros: ['경쟁 불가한 독보적인 가벼움 (990g)', '숫자 키패드 포함', 'SSD 등 확장성 비교적 좋음'],
        cons: ['상대적으로 낮은 디스플레이 해상도', '내구성이 다소 약하게 느껴짐']
    }
];

// --- Dynamic State ---
let dynamicProducts = []; // 네이버에서 실시간으로 긁어온 상품 목록 저장용

// --- Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Selectors
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const selectionArea = document.getElementById('selectionArea');
    const productGrid = document.getElementById('productGrid');
    const comparisonView = document.getElementById('comparisonView');
    const resetBtn = document.getElementById('resetBtn');
    
    const tags = document.querySelectorAll('.tag');
    const categoryCards = document.querySelectorAll('.category-card'); // V2 Cards
    
    // Elements to populate during comparison
    const baseProductCard = document.getElementById('baseProductCard');
    const competitorsWrapper = document.getElementById('competitorsWrapper');
    const specsTable = document.getElementById('specsTable');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const authWrapper = document.getElementById('authWrapper');

    // --- State ---
    let currentCategory = 'all';
    let fixedProduct = null;      // Step 1: 고정된 기준 상품
    let competitorProduct = null; // Step 2: 비교 상대 상품
    
    // --- UI Helpers ---
    // 공통 이미지 Fallback 처리 (네이버 등에서 이미지가 깨질 때 방어)
    const onImgError = "this.onerror=null;this.src='https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80';";

    // --- Selectors ---
    const competitorSlot = document.getElementById('competitorSlot');
    const premiumModal = document.getElementById('premiumModal');
    const closePremiumModal = document.getElementById('closePremiumModal');
    
    // Modal Search Selectors
    const searchModal = document.getElementById('searchModal');
    const closeSearchModal = document.getElementById('closeSearchModal');
    const modalSearchInput = document.getElementById('modalSearchInput');
    const modalSearchResults = document.getElementById('modalSearchResults');

    // --- Event Listeners ---
    
    // Tag Filtering (Legacy & Fallback)
    tags.forEach(tag => {
        tag.addEventListener('click', (e) => handleCategorySelection(e.target.dataset.category, e.target));
    });

    // V2 Category Cards Filtering
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const selectedCategory = card.dataset.category;
            // Scroll past hero
            selectionArea.scrollIntoView({ behavior: 'smooth' });
            handleCategorySelection(selectedCategory, null);
        });
    });

    function handleCategorySelection(category, targetElement) {
        if (targetElement) {
            tags.forEach(t => t.classList.remove('active'));
            targetElement.classList.add('active');
        }
        currentCategory = category;
        
        // 카테고리 클릭 시 실시간 네이버 API 기반 자동 검색 수행
        const categoryKeywords = {
            'smartphone': ['아이폰', '갤럭시', '스마트폰', 'Z플립', '아이패드'],
            'laptop': ['맥북', '그램', '노트북', '게이밍 노트북', '레노버'],
            'audio': ['에어팟', '버즈', '소니 헤드폰', '마샬 스피커'],
            'kitchen': ['네스프레소', '발뮤다', '에어프라이어', '식기세척기'],
            'home': ['로봇청소기', '다이슨', '건조기', '공기청정기'],
            'fashion': ['나이키 스니커즈', '뉴발란스', '우영미', '아디다스 삼바'],
            'all': ['인기 전자기기', '최신 스마트폰', '인기 노트북', '무선 이어폰']
        };
        
        let query;
        if (categoryKeywords[category]) {
            const keywords = categoryKeywords[category];
            query = keywords[Math.floor(Math.random() * keywords.length)]; // Pick a random keyword
        } else {
            query = category;
        }
        
        // 비교 화면이 열려있다면 닫고 그리드로 뷰포트 이동
        comparisonView.classList.add('hidden');
        selectionArea.classList.remove('hidden');
        
        searchDynamicProducts(query);
    }

    // Reset Button (비교 초기화 및 선택창 복귀)
    resetBtn.addEventListener('click', () => {
        fixedProduct = null;
        competitorProduct = null;
        hideComparison();
        selectionArea.classList.remove('hidden');
        selectionArea.scrollIntoView({ behavior: 'smooth' });
        searchInput.value = '';
    });

    closeSearchModal.addEventListener('click', () => {
        searchModal.classList.add('hidden');
    });

    // Modal Search Typing Event
    let modalTypingTimer;
    modalSearchInput.addEventListener('input', (e) => {
        clearTimeout(modalTypingTimer);
        const query = e.target.value.trim();
        if (query.length < 2) {
            modalSearchResults.innerHTML = '<div class="empty-state" style="padding: 2rem;"><p style="color: var(--text-secondary);">2글자 이상 입력하세요.</p></div>';
            return;
        }
        
        modalTypingTimer = setTimeout(() => {
            window.modalSearch(query);
        }, 500);
    });

    // Modal Search Enter Key
    modalSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim();
            if (query) window.modalSearch(query);
        }
    });

    window.onclick = (event) => {
        if (event.target == premiumModal) {
            premiumModal.classList.add('hidden');
        }
        if (event.target == searchModal) {
            searchModal.classList.add('hidden');
        }
    };


    // --- Functions ---
    // Simulate real-time API call OR real call (e.g. Coupang Price API)
    async function fetchRealTimePrice(productId) {
        
        // --- [Cloudflare Pages API 로직] ---
        // 하드코딩된 API 키를 완전히 삭제하고, Cloudflare 서버 함수(Functions)를 통해 우회 통신합니다.
        try {
            const product = productsDB.find(p => p.id === productId);
            
            // Cloudflare Pages Environment 내부의 함수 라우팅 URL (자동으로 매핑됨)
            const response = await fetch(`/api/getNaverProduct?keyword=${encodeURIComponent(product.name)}`);
            const data = await response.json();
            
            if (data.success) {
                return {
                    price: data.priceFormatted,
                    priceVal: data.priceVal,
                    url: data.productUrl
                };
            }
        } catch (error) {
            console.error("Cloudflare API 통신 실패:", error);
        }
        // ---------------------------------------

        return new Promise(resolve => {
            // 아래 코드는 API 호출이 실패할 경우를 대비한 보험용 동작입니다.
            setTimeout(() => {
                const product = productsDB.find(p => p.id === productId);
                if (product) {
                    // Slight random price fluctuation for realism
                    const mockDiscount = Math.floor(Math.random() * 5 + 2); // 2% to 6% discount
                    const discountedPrice = Math.floor(product.priceVal * (1 - (mockDiscount / 100)));
                    const formattedPrice = '₩' + discountedPrice.toLocaleString();
                    resolve({ price: formattedPrice, priceVal: discountedPrice });
                } else {
                    resolve({ price: '₩???,???', priceVal: 0 });
                }
            }, 1500);
        });
    }

    // --- Initial Load (Popular Tech) ---
    async function loadInitialDynamicData() {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-secondary);">
                <i data-lucide="loader-2" class="spin" style="width: 32px; height: 32px; margin-bottom: 1rem; color: var(--accent-primary);"></i>
                <p>실시간 인기 상품을 불러오는 중입니다...</p>
            </div>
        `;
        lucide.createIcons();

        try {
            // Promise.all로 3개의 인기 키워드 동시 검색
            const queries = ['아이폰 16', '갤럭시 S24', 'M3 맥북 에어', '에어팟 프로'];
            const fetchPromises = queries.map(q => fetch(`/api/searchProducts?keyword=${encodeURIComponent(q)}&display=4`).then(r => r.json()));
            
            const results = await Promise.all(fetchPromises);
            dynamicProducts = [];
            
            results.forEach(res => {
                if (res.success && res.items) {
                    dynamicProducts.push(...res.items);
                }
            });

            // 임시 ID (중복 방지용) 부여
            dynamicProducts.forEach((p, index) => { p.uid = `dyn_${index}`; });
            renderDynamicGrid(dynamicProducts);
        } catch (error) {
            console.error("초기 실시간 상품 로드 실패:", error);
            productGrid.innerHTML = `<p style="text-align:center;width:100%;">로컬 테스트 환경이거나 API를 불러올 수 없습니다.</p>`;
        }
    }

    // --- Search Action ---
    async function searchDynamicProducts(query) {
        if (!query.trim()) return;

        // Firestore DB에 검색기록 로깅 기능 (popular searches 구축용)
        if (window.db) {
            try {
                // 사용자가 로그인했다면 userId 함께 저장, 아니면 익명
                const userId = (window.auth && window.auth.currentUser) ? window.auth.currentUser.uid : 'anonymous';
                db.collection("search_history").add({
                    keyword: query.trim(),
                    userId: userId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(err => console.warn("Search log omitted:", err));
            } catch (e) { console.warn("Firestore logging skipped"); }
        }

        // UI 상태 전환: 검색 결과창 노출, 기존 비교창 숨김
        comparisonView.classList.add('hidden');
        selectionArea.classList.remove('hidden');

        selectionArea.scrollIntoView({ behavior: 'smooth' });
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-secondary);">
                <i data-lucide="search" class="spin" style="width: 32px; height: 32px; margin-bottom: 1rem; color: var(--accent-primary);"></i>
                <p>'${query}' 검색 중입니다...</p>
            </div>
        `;
        lucide.createIcons();

        try {
            const res = await fetch(`/api/searchProducts?keyword=${encodeURIComponent(query)}&display=16`);
            const data = await res.json();
            
            if (data.success && data.items.length > 0) {
                dynamicProducts = data.items;
                dynamicProducts.forEach((p, index) => { p.uid = `dyn_search_${index}`; });
                renderDynamicGrid(dynamicProducts);
            } else {
                if (!data.success) {
                    console.error("===== 네이버 API 로드 실패 (Search) =====");
                    console.error("Error:", data.error);
                    console.error("Details:", data.details);
                    productGrid.innerHTML = `<p style="text-align:center;width:100%; color:var(--error);">서버 통신 실패: 콘솔(F12)을 확인하세요.</p>`;
                } else {
                    productGrid.innerHTML = `<p style="text-align:center;width:100%; color:var(--text-secondary);">검색 결과가 없습니다.</p>`;
                }
            }
        } catch (error) {
            console.error("검색 치명적 실패:", error);
            productGrid.innerHTML = `<p style="text-align:center;width:100%; color:var(--error);">검색 중 치명적인 오류가 발생했습니다. 콘솔을 확인하세요.</p>`;
        }
    }

    // Search Execution Listeners
    document.getElementById('searchBtn').addEventListener('click', () => {
        searchDynamicProducts(searchInput.value);
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchDynamicProducts(searchInput.value);
        }
    });

    // Run Initial Load
    loadInitialDynamicData();

    // --- Core Logic ---
    window.selectProduct = async function(uid, isModal = false) {
        // 모달에서 선택한 경우와 메인 그리드에서 선택한 경우 구분하여 검색 결과에서 찾기
        const targetList = isModal ? window.modalProducts : dynamicProducts;
        const product = (targetList || []).find(p => p.uid === uid);
        if(!product) return;

        // Step 1: 기준 상품이 없으면 첫 번째 슬롯에 고정
        if (!fixedProduct) {
            fixedProduct = {
                id: product.uid,
                name: product.name,
                brand: product.brand,
                image: product.image,
                price: product.priceFormatted,
                priceVal: product.lprice,
                url: product.link,
                specs: parseSpecs(product.name, product.brand)
            };
        } 
        // Step 2: 기준 상품이 있고 비교 대상이 없으면 두 번째 슬롯에 지명
        else if (!competitorProduct) {
            if (fixedProduct.id === product.uid) {
                alert("자기 자신과 비교할 수 없습니다. 다른 상품을 선택해주세요!");
                return;
            }
            competitorProduct = {
                id: product.uid,
                name: product.name,
                brand: product.brand,
                image: product.image,
                price: product.priceFormatted,
                priceVal: product.lprice,
                url: product.link,
                specs: parseSpecs(product.name, product.brand)
            };
            // 2단계 상품 지명 후 모달 닫기
            if (isModal) searchModal.classList.add('hidden');
        }
        else {
            showPremiumPopup();
            return;
        }

        // UI 전환: 선택 화면 숨기고 비교 화면 노출
        selectionArea.classList.add('hidden');
        comparisonView.classList.remove('hidden');

        // 스크롤 이동 전 렌더링
        renderComparison();
    };

    // --- Modal Search Functions ---
    window.openSearchModal = () => {
        searchModal.classList.remove('hidden');
        modalSearchInput.value = '';
        modalSearchResults.innerHTML = '<div class="empty-state" style="padding: 2rem;"><p style="color: var(--text-secondary);">비교할 상품명을 입력하세요.</p></div>';
        modalSearchInput.focus();
    };

    window.modalSearch = async function(keyword) {
        if (!keyword) return;
        modalSearchResults.innerHTML = '<div style="padding:2rem; text-align:center;"><div class="loading-spinner"></div></div>';
        
        try {
            const response = await fetch(`/api/searchProducts?keyword=${encodeURIComponent(keyword)}&display=10`);
            const data = await response.json();
            
            // data 자체가 없거나 items가 없을 경우 방어
            if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                window.modalProducts = data.items.map(item => {
                    // item.name 또는 item.title이 없을 경우를 대비해 빈 문자열 처리 및 replace 에러 방지
                    const rawName = item.name || item.title || '';
                    const cleanName = rawName.replace(/<b>/g, '').replace(/<\/b>/g, '');
                    
                    return {
                        uid: `m-${item.id || item.productId || Math.random()}`,
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
        } catch (error) {
            console.error("Modal Search Error:", error);
            modalSearchResults.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--accent-error);">오류가 발생했습니다. 다시 시도해주세요.</div>';
        }
    }

    function renderModalResults(products) {
        modalSearchResults.innerHTML = products.map(p => `
            <div class="modal-result-card" onclick="selectProduct('${p.uid}', true)">
                <img src="${p.image}" alt="${p.name}" onerror="${onImgError}">
                <div class="info">
                    <div class="name">${p.name}</div>
                    <div class="price">${p.priceFormatted}</div>
                </div>
                <i data-lucide="plus-circle" style="width:18px; color:var(--accent-primary);"></i>
            </div>
        `).join('');
        lucide.createIcons();
    }

    function showPremiumPopup() {
        premiumModal.classList.remove('hidden');
    }

    // 스펙 동적 추출기 (상품명 분석)
    const parseSpecs = (name, mallName) => {
        const specs = { '쇼핑몰': mallName, '상태': '새상품' };
        const lowerName = name.toLowerCase();
        
        if (lowerName.includes('apple') || lowerName.includes('아이폰') || lowerName.includes('맥북') || lowerName.includes('에어팟')) specs['브랜드/제조사'] = 'Apple';
        else if (lowerName.includes('삼성') || lowerName.includes('갤럭시')) specs['브랜드/제조사'] = '삼성전자';
        else if (lowerName.includes('lg') || lowerName.includes('그램') || lowerName.includes('스탠바이미')) specs['브랜드/제조사'] = 'LG전자';
        else specs['브랜드/제조사'] = '기타/미상';
        
        const ramMatch = name.match(/(\d{1,2}GB?)\s*(ram|메모리)?/i);
        if (ramMatch && !lowerName.includes('ssd')) specs['메모리 (RAM)'] = ramMatch[1].toUpperCase();
        
        const storageMatch = name.match(/(\d{3}GB|1TB|2TB)/i);
        if (storageMatch) specs['저장용량'] = storageMatch[1].toUpperCase();
        
        if (lowerName.includes('5g')) specs['네트워크'] = '5G 지원';
        else if (lowerName.includes('근거리') || lowerName.includes('블루투스')) specs['네트워크'] = '연동 특화';
        
        return specs;
    };

    function hideComparison() {
        comparisonView.classList.add('hidden');
    }

    function groupProducts(products) {
        const groups = {};
        products.forEach(p => {
            // Grouping Key: Brand + Normalized model name (first 3 words)
            const normalizedName = p.name.replace(/[\[\]\(\)]/g, '').trim();
            const words = normalizedName.split(/\s+/);
            const modelKey = words.slice(0, 3).join(' ').toLowerCase();
            const key = (p.brand || 'unknown').toLowerCase() + "|" + modelKey;
            
            if (!groups[key]) {
                groups[key] = { winner: p, others: [] };
            } else {
                // Winner Criteria: Lowest Price
                if (p.lprice < groups[key].winner.lprice) {
                    groups[key].others.push(groups[key].winner);
                    groups[key].winner = p;
                } else {
                    groups[key].others.push(p);
                }
            }
        });
        return Object.values(groups);
    }

    function renderDynamicGrid(productsList) {
        if (!productsList || productsList.length === 0) {
            productGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">상품이 존재하지 않습니다.</p>';
            return;
        }

        const grouped = groupProducts(productsList);

        productGrid.innerHTML = grouped.map(group => {
            const product = group.winner;
            const hasOthers = group.others.length > 0;
            
            return `
                <div class="product-card-mini" onclick="selectProduct('${product.uid}')">
                    <div class="winner-badge" style="position:absolute; top:0.5rem; right:0.5rem; background:var(--accent-primary); color:white; font-size:0.7rem; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700; z-index:5;">ITEM WINNER</div>
                    <div class="product-image-wrap">
                        <img src="${product.image}" alt="${product.name}" onerror="${onImgError}">
                    </div>
                    <div style="flex: 1; display:flex; flex-direction:column; gap:0.3rem;">
                        <span class="brand" style="font-size:0.75rem;">${product.brand || '제조사 미상'}</span>
                        <h3 style="font-size:0.9rem; line-height:1.2; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${product.name}</h3>
                    </div>
                    <div style="margin-top: auto;">
                        <div style="font-weight: 700; color: var(--accent-primary); font-size:1.1rem;">
                            ${product.priceFormatted}
                        </div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.2rem;">
                            판매처: ${product.mallName}
                        </div>
                        ${hasOthers ? `
                            <div class="other-sellers-toggle" onclick="event.stopPropagation(); window.toggleOtherSellers('${product.uid}')" style="margin-top:0.5rem; font-size:0.8rem; color:var(--accent-primary); font-weight:600; text-decoration:underline; cursor:pointer;">
                                외 ${group.others.length}개 판매처 더보기
                            </div>
                            <div id="others-${product.uid}" class="other-sellers-list hidden" style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid #eee; display:flex; flex-direction:column; gap:0.4rem;">
                                ${group.others.slice(0, 3).map(o => `
                                    <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
                                        <span style="color:var(--text-secondary);">${o.mallName}</span>
                                        <span style="font-weight:600;">₩${o.lprice.toLocaleString()}</span>
                                    </div>
                                `).join('')}
                                ${group.others.length > 3 ? `<div style="font-size:0.7rem; color:var(--text-muted); text-align:right;">...외 추가 판매처 있음</div>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    window.toggleOtherSellers = (uid) => {
        const el = document.getElementById(`others-${uid}`);
        if(el) el.classList.toggle('hidden');
    };

    // (Reset Button listeners are handled above)

    // Render Matchup View (Step 1 & 2)
    function renderComparison() {
        if (!fixedProduct) return;

        // 1. 좌측 (기준 상품) 렌더링
        baseProductCard.innerHTML = `
            <img src="${fixedProduct.image}" alt="${fixedProduct.name}" class="compare-img" onerror="${onImgError}">
            <div class="compare-brand">${fixedProduct.brand}</div>
            <div class="compare-title">${fixedProduct.name}</div>
            <div class="compare-price">${fixedProduct.price}</div>
            <button class="btn btn-primary" onclick="window.open('${fixedProduct.url}', '_blank')">최저가 방문</button>
        `;

        // 2. 우측 (비교 대기 or 지명 상품) 렌더링
        if (!competitorProduct) {
            competitorSlot.innerHTML = `
                <div class="empty-slot" onclick="window.openSearchModal()">
                    <i data-lucide="plus-circle"></i>
                    <span>비교할 상품 검색하기</span>
                </div>
            `;
            
            // 상세 스펙 테이블 - 대기 모드
            specsTable.innerHTML = `
                <tbody>
                    <tr class="category-row">
                        <th colspan="2">비교할 대상을 선택해주세요</th>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align:center; padding: 3rem; color:var(--text-secondary);">
                            우측의 [+] 버튼을 눌러 비교할 상품을 검색하고 지명해주세요.
                        </td>
                    </tr>
                </tbody>
            `;
        } else {
            competitorSlot.innerHTML = `
                <div style="position:relative; width:100%;">
                    <i data-lucide="trash-2" class="remove-slot" onclick="window.removeCompetitor()"></i>
                    <img src="${competitorProduct.image}" alt="${competitorProduct.name}" class="compare-img" onerror="${onImgError}">
                    <div class="compare-brand">${competitorProduct.brand}</div>
                    <div class="compare-title">${competitorProduct.name}</div>
                    <div class="compare-price">${competitorProduct.price}</div>
                    <button class="btn btn-shiny" onclick="window.open('${competitorProduct.url}', '_blank')">최저가 방문</button>
                </div>
            `;

            // 3. 1:1 명세 비교표 렌더링
            const specKeys = ['브랜드/제조사', '메모리 (RAM)', '저장용량', '네트워크', '쇼핑몰'];
            const specLabels = {
                '브랜드/제조사': '제조사',
                '메모리 (RAM)': 'RAM',
                '저장용량': '저장소',
                '네트워크': '네트워크',
                '쇼핑몰': '판매처'
            };

            let tableHTML = `
                <tbody>
                    <tr class="category-row">
                        <th colspan="3">1:1 라이벌 명세 대조</th>
                    </tr>
            `;

            specKeys.forEach(key => {
                const baseVal = fixedProduct.specs[key] || '-';
                const compVal = competitorProduct.specs[key] || '-';
                
                tableHTML += `
                    <tr>
                        <td class="spec-label" style="width:20%;">${specLabels[key] || key}</td>
                        <td class="spec-value" style="width:40%; text-align:center;">${baseVal}</td>
                        <td class="spec-value" style="width:40%; text-align:center;">${compVal}</td>
                    </tr>
                `;
            });

            // 장단점 (Mock)
            tableHTML += `
                <tr class="category-row">
                    <th colspan="3">AI 특징 분석</th>
                </tr>
                <tr>
                    <td class="spec-label">추천 포인트</td>
                    <td class="spec-value" style="font-size:0.9rem;">
                        ✅ ${fixedProduct.brand}의 정체성이 돋보이는 디자인<br>
                        ✅ 실사용자 선호도가 높은 스테디셀러
                    </td>
                    <td class="spec-value" style="font-size:0.9rem;">
                        ✅ 동급 대비 뛰어난 가성비와 퍼포먼스<br>
                        ✅ 해당 카테고리의 강력한 대항마
                    </td>
                </tr>
            </tbody>`;
            
            specsTable.innerHTML = tableHTML;
        }

        lucide.createIcons();

        // Scroll to comparison
        setTimeout(() => {
            comparisonView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    window.removeCompetitor = () => {
        competitorProduct = null;
        renderComparison();
    };

    window.scrollToSearch = () => {
        selectionArea.classList.remove('hidden');
        selectionArea.scrollIntoView({ behavior: 'smooth' });
        searchInput.focus();
    };

    // --- Firebase Logic (Auth & DB Event Binding) ---
    // index.html에서 보안 통신으로 firebase 객체가 성공적으로 초기화된 후 실행됩니다.
    function setupFirebaseLogic() {
        if (!window.auth) return;

        // Auth State Listener
        auth.onAuthStateChanged(user => {
            if (user) {
                // 사용자가 로그인한 상태: 프로필 정보로 버튼 교체 및 로그아웃 기능 추가
                authWrapper.innerHTML = `
                    <div class="user-profile" style="position:relative; display:flex; align-items:center; gap:0.5rem; cursor:pointer;" onclick="var menu = document.getElementById('logoutMenu'); menu.style.display = menu.style.display === 'none' ? 'block' : 'none';">
                        <img src="${user.photoURL || 'https://via.placeholder.com/150'}" alt="Profile" style="width:32px; height:32px; border-radius:50%;">
                        <span style="color:var(--text); font-weight:500;">${user.displayName}</span>
                        <div id="logoutMenu" style="display:none; position:absolute; top:110%; right:0; background:var(--bg-surface); padding:0.5rem; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); border:1px solid var(--glass-border); min-width:140px; z-index:1000;">
                            <button onclick="window.auth.signOut().then(()=>window.location.reload())" style="width:100%; text-align:left; padding:0.5rem; font-size:0.9rem; color:var(--accent-danger); border-radius:4px; display:inline-flex; align-items:center;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> 
                                로그아웃
                            </button>
                        </div>
                    </div>
                `;
                
                // Firestore에 최초 접속 시 유저 데이터 병합 (Upsert) - Schema 구현의 일부
                if (window.db) {
                    db.collection("users").doc(user.uid).set({
                        email: user.email,
                        displayName: user.displayName,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true }).catch(err => console.error("Firestore user save error:", err));
                }

            } else {
                // 로그아웃 상태
                authWrapper.innerHTML = `
                    <button class="btn btn-primary" id="googleLoginBtn">
                        <i data-lucide="log-in" style="width: 16px; height: 16px;"></i> 구글 로그인
                    </button>
                `;
                lucide.createIcons();

                // 로그인 버튼 다시 바인딩
                document.getElementById('googleLoginBtn').addEventListener('click', () => {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    auth.signInWithPopup(provider).catch(error => {
                        console.error('Login Failed', error);
                        alert('로그인에 실패하였습니다.');
                    });
                });
            }
        });

        // 초기 구글 로그인 클릭 바인딩
        const initialLoginBtn = document.getElementById('googleLoginBtn');
        if (initialLoginBtn) {
            initialLoginBtn.addEventListener('click', () => {
                const provider = new firebase.auth.GoogleAuthProvider();
                auth.signInWithPopup(provider).catch(error => {
                    console.error('Login Failed', error);
                    alert('로그인에 실패하였습니다. 콘솔과 네트워크 상태를 확인해주세요.');
                });
            });
        }
        
        // 메인 페이지 인기 검색어 로드
        fetchTopSearchesForMain();
        
        // 동적 히어로 타이틀 실행
        startDynamicTitle();
    }
    
    // 동적 타이틀 로직 (당근마켓형)
    function startDynamicTitle() {
        const el = document.getElementById('dynamicKeyword');
        if(!el) return;
        const keywords = ["아이폰 16", "M3 맥북", "에어팟 프로", "다이슨"];
        let currentIndex = 0;
        
        setInterval(() => {
            el.style.opacity = 0;
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % keywords.length;
                el.innerText = keywords[currentIndex];
                el.style.opacity = 1;
            }, 400); // fade out duration
        }, 3000); // 3 seconds interval
    }

    async function fetchTopSearchesForMain() {
        if (!window.db) return;
        const container = document.getElementById('mainTrendingSearches');
        if (!container) return;
        
        try {
            const snapshot = await db.collection("search_history")
                .orderBy("timestamp", "desc")
                .limit(100)
                .get();
                
            const counts = {};
            snapshot.forEach(doc => {
                const kw = (doc.data().keyword || "").toLowerCase();
                if (kw) counts[kw] = (counts[kw] || 0) + 1;
            });
            
            const top5 = Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
                
            if (top5.length === 0) {
                container.innerHTML = '<span style="font-size:0.85rem; color:var(--text-secondary);">데이터 수집 중</span>';
                return;
            }
            
            container.innerHTML = top5.map((item, idx) => `
                <button class="tag" style="padding: 0.2rem 0.8rem; font-size: 0.85rem; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-sm);" onclick="document.getElementById('searchInput').value='${item[0]}'; document.getElementById('searchBtn').click();">
                    <strong style="color:var(--accent-primary); margin-right:4px;">${idx+1}</strong> ${item[0]}
                </button>
            `).join('');
            
        } catch (e) {
            console.error("메인 트렌딩 검색어 로드 실패:", e);
            container.innerHTML = '';
        }
    }

    // firebaseReady 이벤트를 기다리거나, 이미 로드되었으면 즉시 실행
    if (window.auth) {
        setupFirebaseLogic();
    } else {
        window.addEventListener('firebaseReady', setupFirebaseLogic);
    }
});
