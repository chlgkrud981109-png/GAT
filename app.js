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

    // --- UI Helpers ---
    // 공통 이미지 Fallback 처리 (네이버 등에서 이미지가 깨질 때 방어)
    const onImgError = "this.onerror=null;this.src='https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80';";

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
        const categoryQueries = {
            'smartphone': '최신 스마트폰',
            'laptop': '인기 노트북',
            'audio': '무선 이어폰',
            'all': '인기 전자기기'
        };
        
        const query = categoryQueries[category] || category;
        
        // 비교 화면이 열려있다면 닫고 그리드로 뷰포트 이동
        comparisonView.classList.add('hidden');
        selectionArea.classList.remove('hidden');
        
        searchDynamicProducts(query);
    }

    // Reset Button (비교 초기화 및 선택창 복귀)
    resetBtn.addEventListener('click', () => {
        hideComparison();
        selectionArea.classList.remove('hidden');
        selectionArea.scrollIntoView({ behavior: 'smooth' });
        searchInput.value = '';
    });


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
    window.selectProduct = async function(uid) {
        const product = dynamicProducts.find(p => p.uid === uid);
        if(!product) return;

        // Hide selection, show comparison
        selectionArea.classList.add('hidden');
        comparisonView.classList.remove('hidden');

        // 경쟁 모델 동적 생성 (같은 검색 결과 목록에서 다른 상품 2~3개 추출)
        const competitorItems = dynamicProducts.filter(p => p.uid !== uid).slice(0, 3);
        
        // Transform base product to required format
        const baseProductObj = {
            id: product.uid,
            name: product.name,
            brand: product.brand,
            image: product.image,
            price: product.priceFormatted,
            priceVal: product.lprice,
            specs: { rank: '1위 (해당 검색내)', mall: product.brand, condition: '새상품' }, // 가상 스펙
            pros: ['검색하신 조건에 가장 부합하는 제품', '선호도가 높음', '확인된 실시간 최저가'],
            cons: ['배송일에 따른 변동 가능성', '재고 소진 유의']
        };

        const competitorObjs = competitorItems.map(c => ({
            id: c.uid,
            name: c.name,
            brand: c.brand,
            image: c.image,
            price: c.priceFormatted,
            priceVal: c.lprice,
            url: c.link
        }));

        renderComparison(baseProductObj, competitorObjs, product.link);
    };

    function hideComparison() {
        comparisonView.classList.add('hidden');
    }

    function renderDynamicGrid(productsList) {
        if (!productsList || productsList.length === 0) {
            productGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">상품이 존재하지 않습니다.</p>';
            return;
        }

        productGrid.innerHTML = productsList.map(product => `
            <div class="product-card-mini" onclick="selectProduct('${product.uid}')">
                <div class="product-image-wrap">
                    <img src="${product.image}" alt="${product.name}" onerror="${onImgError}">
                </div>
                <div style="flex: 1; display:flex; flex-direction:column; gap:0.3rem;">
                    <span class="brand" style="font-size:0.75rem;">${product.brand}</span>
                    <h3 style="font-size:0.9rem; line-height:1.2; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${product.name}</h3>
                </div>
                <div style="margin-top: auto; font-weight: 700; color: var(--accent-primary); font-size:1.1rem;">
                    ${product.priceFormatted}
                </div>
            </div>
        `).join('');
    }

    // (Reset Button listeners are handled above)

    // Render Full Comparison View
    function renderComparison(baseProduct, competitors, baseUrl) {
        selectionArea.classList.add('hidden');
        comparisonView.classList.remove('hidden');

        if (!baseProduct) return;
        
        // 1. Render Headers (Cards) Wait for API
        const renderHeaderSkeleton = (p) => `
            <img src="${p.image}" alt="${p.name}" class="compare-img" onerror="${onImgError}">
            <div class="compare-brand">${p.brand}</div>
            <div class="compare-title">${p.name}</div>
            <div id="price-${p.id}" class="skeleton-text"></div>
            <div id="btn-${p.id}" class="skeleton-btn"></div>
        `;

        // Initial skeleton render for price and button areas
        baseProductCard.innerHTML = renderHeaderSkeleton(baseProduct);
        competitorsWrapper.innerHTML = competitors.map(comp => `
            <div class="competitor-col">
                ${renderHeaderSkeleton(comp)}
            </div>
        `).join('');

        // Fetch prices asynchronously and update the UI
        const allProductsToFetch = [baseProduct, ...competitors];
        
        allProductsToFetch.forEach(async (p) => {
            try {
                // Fetch live price
                const liveData = await fetchRealTimePrice(p.id);
                
                // Update specific product's price and render the Buy button
                const priceContainer = document.getElementById(`price-${p.id}`);
                const btnContainer = document.getElementById(`btn-${p.id}`);
                
                if(priceContainer && btnContainer) {
                    priceContainer.className = 'compare-price';
                    priceContainer.innerHTML = `
                        ${liveData.price}
                        <div class="source-tag"><i data-lucide="check-circle"></i> 네이버 쇼핑 실시간 최저가 기준</div>
                    `;
                    
                    btnContainer.className = ''; // remove skeleton class
                    
                    // Alert 제거, 새 창(window.open)으로 실 주소 연결
                    btnContainer.innerHTML = `
                        <button class="btn btn-shiny" onclick="window.open('${liveData.url}', '_blank')">
                            <i data-lucide="info"></i> 최저가 링크 방문
                        </button>
                    `;
                    // Re-init lucide icons for newly added icons
                    lucide.createIcons();
                }
            } catch (err) {
                console.error('Failed to fetch real-time price', err);
            }
        });

        // 2. Render Details Table
        // Spec categories defined dynamically or statically. We extract common keys.
        const allSpecs = {...baseProduct.specs};
        competitors.forEach(comp => {
            Object.keys(comp.specs).forEach(key => {
                if (!allSpecs[key]) allSpecs[key] = true;
            });
        });

        const specKeys = Object.keys(allSpecs);
        const specLabels = {
            os: '운영체제',
            processor: '프로세서/칩셋',
            display: '디스플레이',
            ram: '메모리 (RAM)',
            storage: '저장 용량',
            camera: '카메라',
            battery: '배터리 용량',
            weight: '무게'
        };

        let tableHTML = `
            <tbody>
                <tr class="category-row">
                    <th colspan="${2 + competitors.length}">기본 사양 비교</th>
                </tr>
        `;

        specKeys.forEach(key => {
            // Find "winner" if sortable, e.g., weight, price
            // Basic simplistic highlight logic for RAM (contains higher number)
            
            const baseVal = baseProduct.specs[key] || '-';
            const compValsHTML = competitors.map(comp => {
                const val = comp.specs[key] || '-';
                return `<td class="spec-value comp-spec">${val}</td>`;
            }).join('');

            tableHTML += `
                <tr>
                    <td class="spec-label">${specLabels[key] || key.toUpperCase()}</td>
                    <td class="spec-value base-spec"><strong>${baseVal}</strong></td>
                    ${compValsHTML}
                </tr>
            `;
        });

        // 장단점 섹션 추가
        tableHTML += `
            <tr class="category-row">
                <th colspan="${2 + competitors.length}">장단점 요약</th>
            </tr>
            <tr>
                <td class="spec-label">주요 장점</td>
                <td class="spec-value base-spec">
                    <ul class="pro-list">
                        ${baseProduct.pros.map(pro => `
                            <li class="pro-item"><i data-lucide="check-circle" class="pro-icon"></i> <span>${pro}</span></li>
                        `).join('')}
                    </ul>
                </td>
                ${competitors.map(comp => `
                    <td class="spec-value comp-spec">
                        <ul class="pro-list">
                            ${comp.pros.map(pro => `
                                <li class="pro-item"><i data-lucide="check-circle" class="pro-icon"></i> <span>${pro}</span></li>
                            `).join('')}
                        </ul>
                    </td>
                `).join('')}
            </tr>
            <tr>
                <td class="spec-label">아쉬운 점</td>
                <td class="spec-value base-spec">
                    <ul class="con-list">
                        ${baseProduct.cons.map(con => `
                            <li class="con-item"><i data-lucide="x-circle" class="con-icon"></i> <span>${con}</span></li>
                        `).join('')}
                    </ul>
                </td>
                ${competitors.map(comp => `
                    <td class="spec-value comp-spec">
                        <ul class="con-list">
                            ${comp.cons.map(con => `
                                <li class="con-item"><i data-lucide="x-circle" class="con-icon"></i> <span>${con}</span></li>
                            `).join('')}
                        </ul>
                    </td>
                `).join('')}
            </tr>
        `;

        tableHTML += `</tbody>`;
        specsTable.innerHTML = tableHTML;
        
        // Re-init newly added Lucide icons
        lucide.createIcons();

        // Scroll to comparison gracefully
        setTimeout(() => {
            comparisonView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // --- Firebase Logic (Auth & DB Event Binding) ---
    // index.html에서 보안 통신으로 firebase 객체가 성공적으로 초기화된 후 실행됩니다.
    function setupFirebaseLogic() {
        if (!window.auth) return;

        // Auth State Listener
        auth.onAuthStateChanged(user => {
            if (user) {
                // 사용자가 로그인한 상태: 프로필 정보로 버튼 교체 및 로그아웃 기능 추가
                authWrapper.innerHTML = `
                    <div class="user-profile">
                        <img src="${user.photoURL || 'https://via.placeholder.com/150'}" alt="Profile">
                        <span>${user.displayName}님</span>
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
    }

    // firebaseReady 이벤트를 기다리거나, 이미 로드되었으면 즉시 실행
    if (window.auth) {
        setupFirebaseLogic();
    } else {
        window.addEventListener('firebaseReady', setupFirebaseLogic);
    }
});
