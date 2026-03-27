document.addEventListener('DOMContentLoaded', () => {
    const bucketList = document.getElementById('bucketList');

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

        bucketList.innerHTML = saved.map((item, index) => `
            <div class="bucket-card" onclick="window.loadComparison(${index})">
                <div class="thumb-stack">
                    <img src="${item.base.image}" alt="${item.base.name}" onerror="this.src='https://via.placeholder.com/50'">
                    <img src="${item.competitor.image}" alt="${item.competitor.name}" onerror="this.src='https://via.placeholder.com/50'">
                </div>
                <div class="bucket-info">
                    <div class="bucket-title">${item.title} (${item.date})</div>
                    <div class="bucket-date" style="display:flex; align-items:center; gap:0.5rem;">
                        <span>${item.base.brand} vs ${item.competitor.brand}</span>
                        <span style="color:#ced4da;">•</span>
                        <span>${item.fullDate}</span>
                    </div>
                </div>
                <i data-lucide="chevron-right" style="color:#ced4da;"></i>
            </div>
        `).join('');
        
        lucide.createIcons();
    }

    window.loadComparison = (index) => {
        const saved = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
        const item = saved[index];
        if (item) {
            const matchup = {
                base: item.base,
                competitor: item.competitor
            };
            localStorage.setItem('currentMatchup', JSON.stringify(matchup));
            window.location.href = 'compare.html';
        }
    };

    loadBucket();
});
