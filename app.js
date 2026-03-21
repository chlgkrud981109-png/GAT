// --- Mock Database ---
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
    
    // Elements to populate during comparison
    const baseProductCard = document.getElementById('baseProductCard');
    const competitorsWrapper = document.getElementById('competitorsWrapper');
    const specsTable = document.getElementById('specsTable');

    // --- State ---
    let currentCategory = 'all';

    // --- Event Listeners ---
    
    // Tag Filtering
    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            tags.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            
            // If selection area is visible, re-render
            if (!selectionArea.classList.contains('hidden')) {
                renderSelectionGrid(currentCategory);
            } else if (comparisonView.classList.contains('hidden')) {
                // Show selection area automatically if clicking a category and not viewing comparison
                showSelectionArea(currentCategory);
            }
        });
    });

    // Dummy Search Button logic (simulates clicking input)
    document.getElementById('searchBtn').addEventListener('click', () => {
        showSelectionArea(currentCategory);
    });

    // Search Input Dropdown matching
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length === 0) {
            searchResults.classList.add('hidden');
            return;
        }

        const matches = productsDB.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            searchResults.innerHTML = matches.map(p => `
                <div class="search-result-item" onclick="selectProduct('${p.id}')">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="search-result-info">
                        <h4>${p.name}</h4>
                        <p>${p.brand} · ${p.category}</p>
                    </div>
                </div>
            `).join('');
            searchResults.classList.remove('hidden');
        } else {
            searchResults.innerHTML = '<div style="padding: 1rem; color: var(--text-muted);">검색 결과가 없습니다.</div>';
            searchResults.classList.remove('hidden');
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.add('hidden');
        }
    });

    // Reset Button
    resetBtn.addEventListener('click', () => {
        hideComparison();
        showSelectionArea(currentCategory);
        searchInput.value = '';
    });


    // --- Functions ---

    // Expose selectProduct to window for inline onclick handlers
    window.selectProduct = function(productId) {
        searchResults.classList.add('hidden');
        searchInput.value = '';
        renderComparison(productId);
    };

    function showSelectionArea(category) {
        comparisonView.classList.add('hidden');
        selectionArea.classList.remove('hidden');
        renderSelectionGrid(category);
        selectionArea.scrollIntoView({ behavior: 'smooth' });
    }

    function hideComparison() {
        comparisonView.classList.add('hidden');
    }

    function renderSelectionGrid(category) {
        let filtered = productsDB;
        if (category !== 'all') {
            filtered = productsDB.filter(p => p.category === category);
        }

        if (filtered.length === 0) {
            productGrid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1;">해당 카테고리의 제품이 아직 준비되지 않았습니다.</p>';
            return;
        }

        productGrid.innerHTML = filtered.map(product => `
            <div class="product-card-mini" onclick="selectProduct('${product.id}')">
                <div class="product-image-wrap">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div>
                    <span class="brand">${product.brand}</span>
                    <h3>${product.name}</h3>
                </div>
                <div style="margin-top: auto; font-weight: 600; color: var(--accent-primary);">
                    ${product.price}
                </div>
            </div>
        `).join('');
    }

    function renderComparison(baseProductId) {
        selectionArea.classList.add('hidden');
        comparisonView.classList.remove('hidden');

        const baseProduct = productsDB.find(p => p.id === baseProductId);
        if (!baseProduct) return;

        // Get Competitors
        const competitors = baseProduct.competitors.map(id => productsDB.find(p => p.id === id)).filter(Boolean);
        
        // 1. Render Headers (Cards)
        baseProductCard.innerHTML = `
            <img src="${baseProduct.image}" alt="${baseProduct.name}" class="compare-img">
            <div class="compare-brand">${baseProduct.brand}</div>
            <div class="compare-title">${baseProduct.name}</div>
            <div class="compare-price">${baseProduct.price}</div>
        `;

        competitorsWrapper.innerHTML = competitors.map(comp => `
            <div class="competitor-col">
                <img src="${comp.image}" alt="${comp.name}" class="compare-img">
                <div class="compare-brand">${comp.brand}</div>
                <div class="compare-title">${comp.name}</div>
                <div class="compare-price">${comp.price}</div>
            </div>
        `).join('');

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
});
