document.addEventListener('DOMContentLoaded', () => {
    const bucketList = document.getElementById('bucketList');

    function generateHumorousTitle(item) {
        if (!item.items || item.items.length === 0) return "비어있는 비교 세트";
        
        const copyList = [
            '지갑이 허락한 유일한 사치: {name}',
            '결국 답은 정해져 있다, 너는 {name}',
            '인생의 중대사: {name}을 살 것인가 말 것인가',
            '세기의 대결에서 살아남은 {name}'
        ];

        // Pick random product
        const randomProduct = item.items[Math.floor(Math.random() * item.items.length)];
        const productName = (randomProduct.name || "").split(' ')[0] || "상품";
        
        // Pick random copy
        const randomCopy = copyList[Math.floor(Math.random() * copyList.length)];
        
        // Format date (MM.DD)
        let dateStr = "";
        try {
            const dateParts = item.date.split('.'); // "2026.03.29" -> ["2026", "03", "29"]
            if (dateParts.length >= 3) {
                dateStr = `(${dateParts[1]}.${dateParts[2].slice(0, 2)})`;
            } else {
                const now = new Date();
                dateStr = `(${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')})`;
            }
        } catch(e) {
            dateStr = "(오늘)";
        }

        return randomCopy.replace('{name}', productName) + ` <span class="bucket-date-small">${dateStr}</span>`;
    }

    function loadBucket() {
        const saved = JSON.parse(localStorage.getItem('savedComparisons') || '[]');

        if (saved.length === 0) {
            bucketList.innerHTML = `
                <div class="glass-panel" style="text-align:center; padding: 5rem 2rem;">
                    <i data-lucide="archive" style="width:48px; height:48px; color:#dee2e6; margin-bottom:1.5rem;"></i>
                    <h3 style="color:#adb5bd; margin-bottom:1rem;">보관함이 비어있습니다</h3>
                    <p style="color:#ced4da; margin-bottom:2rem;">제품 검색 후 현재 비교 저장하기 버튼을 눌러보세요.</p>
                    <button class="btn btn-primary" onclick="window.location.href='index.html'">제품 비교하러 가기</button>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        bucketList.innerHTML = saved.map((item, index) => {
            const b = (item.items && item.items[0]) || { name: '상품 정보 없음', brand: '-', image: '' };
            const c = (item.items && item.items[1]) || { name: '상품 정보 없음', brand: '-', image: '' };
            const humorTitle = generateHumorousTitle(item);
            
            return `
                <div class="bucket-card" onclick="window.loadComparison(${index})">
                    <div class="thumb-stack">
                        <img src="${b.image}" alt="${b.name}" onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=No+Image';this.insertAdjacentHTML('afterend','<img src=\'https://ui-avatars.com/api/?name=V&background=random\' style=\'display:none;\' onerror=\'this.parentElement.querySelector(\"img\").src=this.src\'>');">
                        <img src="${c.image}" alt="${c.name}" onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=No+Image';this.insertAdjacentHTML('afterend','<img src=\'https://ui-avatars.com/api/?name=V&background=random\' style=\'display:none;\' onerror=\'this.parentElement.querySelectorAll(\"img\")[1].src=this.src\'>');">
                    </div>
                    <div class="bucket-info">
                        <div class="bucket-title">${humorTitle}</div>
                        <div class="bucket-subtitle">${b.brand} vs ${c.brand}</div>
                    </div>
                    <button class="delete-btn" onclick="window.removeComparison('${item.id}', event)" title="삭제">
                        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        lucide.createIcons();
    }

    window.removeComparison = (id, event) => {
        if (event) event.stopPropagation(); // Prevent card click
        
        if (confirm("정말 이 비교 기록을 삭제할까요?")) {
            const saved = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
            const filtered = saved.filter(item => String(item.id) !== String(id));
            localStorage.setItem('savedComparisons', JSON.stringify(filtered));
            
            // If the deleted one was the current matchup, clear it
            const loadedId = localStorage.getItem('loadedPresetId');
            if (String(loadedId) === String(id)) {
                localStorage.removeItem('loadedPresetId');
            }
            
            loadBucket();
        }
    };

    window.loadComparison = (index) => {
        const saved = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
        const item = saved[index];
        if (item && item.items) {
            const matchup = {
                base: item.items[0],
                competitor: item.items[1]
            };
            localStorage.setItem('currentMatchup', JSON.stringify(matchup));
            localStorage.setItem('loadedPresetId', item.id); // 원본 프리셋 고유 ID 저장
            window.location.href = 'compare.html';
        }
    };

    loadBucket();
});
