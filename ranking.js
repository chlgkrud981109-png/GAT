document.addEventListener('DOMContentLoaded', () => {
    // 1. Listen for global Auth State to trigger data fetch
    let rankingsFetched = false;
    window.addEventListener('authStateChanged', () => {
        if (window.db && !rankingsFetched) {
            fetchRankings();
            rankingsFetched = true;
        }
    });

    // 2. Fetch and Aggregate Top Searches
    async function fetchRankings() {
        if (!window.db) return;
        const rankingList = document.getElementById('rankingList');
        
        try {
            // 최근 200개의 검색 기록을 가져와서 클라이언트 측에서 집계 (Prototypes용)
            const snapshot = await db.collection("search_history")
                .orderBy("timestamp", "desc")
                .limit(200)
                .get();
                
            const counts = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.keyword) {
                    const kw = data.keyword.toLowerCase();
                    counts[kw] = (counts[kw] || 0) + 1;
                }
            });
            
            // 트렌드 기반 랭킹: 네이버 쇼핑 베스트 / IT 시장 핫 아이템 믹스 (현실적인 순위 제공)
            const trendMix = ["에어팟 프로", "제습기", "LG 스탠바이미", "다이슨 에어랩", "닌텐도 스위치", "M3 맥북 에어", "갤럭시 Z플립 6", "아이폰 16"];
            trendMix.forEach(trend => {
                const kw = trend.toLowerCase();
                // 현실적인 조회수를 부여하여 랭킹에 인위적으로 섞음
                counts[kw] = (counts[kw] || 0) + Math.floor(Math.random() * 30) + 20;
            });
            
            // Sort by count descending
            const sortedRankings = Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10); // Top 10
                
            if (sortedRankings.length === 0) {
                rankingList.innerHTML = '<li style="text-align:center;">아직 검색 데이터가 충분하지 않습니다.</li>';
                return;
            }
            
            rankingList.innerHTML = sortedRankings.map((item, index) => {
                const keyword = item[0];
                const count = item[1];
                let rankStyle = '';
                let rankIcon = '';
                
                if (index === 0) {
                    rankStyle = 'background: rgba(255, 215, 0, 0.1); border: 1px solid gold; transform: scale(1.02);';
                    rankIcon = '<i data-lucide="crown" style="color: gold; width: 20px; height: 20px;"></i>';
                } else if (index === 1) {
                    rankStyle = 'background: rgba(192, 192, 192, 0.1); border: 1px solid silver;';
                } else if (index === 2) {
                    rankStyle = 'background: rgba(205, 127, 50, 0.1); border: 1px solid #cd7f32;';
                }
                
                return `
                    <li style="display: flex; align-items: center; padding: 1rem; border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-sm); transition: all 0.2s ease; ${rankStyle}">
                        <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-secondary); width: 40px; text-align: center; margin-right: 1rem;">
                            ${index + 1}
                        </div>
                        <div style="flex: 1; font-weight: 600; font-size: 1.1rem; color: var(--text);">
                            ${keyword}
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                            ${rankIcon}
                            <span>${count}회 검색</span>
                            <button class="btn btn-icon" style="padding: 0.25rem;" onclick="window.location.href='index.html?search=${encodeURIComponent(keyword)}'" title="비교하러 가기">
                                <i data-lucide="arrow-right" style="width:16px; height:16px;"></i>
                            </button>
                        </div>
                    </li>
                `;
            }).join('');
            
            lucide.createIcons();
            
        } catch (error) {
            console.error("랭킹 집계 실패:", error);
            rankingList.innerHTML = '<li style="text-align:center; color:var(--error);">순위를 불러오는 중 오류가 발생했습니다.</li>';
        }
    }

    // Fallback if db is already initialized
    if (window.db && !rankingsFetched) {
        fetchRankings();
        rankingsFetched = true;
    }
});
