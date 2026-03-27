document.addEventListener('DOMContentLoaded', () => {
    const baseProductCard = document.getElementById('baseProductCard');
    const competitorSlot = document.getElementById('competitorSlot');
    const specsTable = document.getElementById('specsTable');
    const saveBtn = document.getElementById('saveComparisonBtn');
    const toast = document.getElementById('toast');

    // Load data from localStorage
    let matchup = JSON.parse(localStorage.getItem('currentMatchup'));

    function renderComparison() {
        if (!matchup || !matchup.base) {
            window.location.href = 'index.html';
            return;
        }

        const { base, competitor } = matchup;
        const onImgError = "this.onerror=null;this.src='https://images.placeholder.com/400x400?text=No+Image';";

        // Render Base
        baseProductCard.innerHTML = `
            <img src="${base.image}" alt="${base.name}" class="compare-img" onerror="${onImgError}">
            <div class="compare-brand">${base.brand}</div>
            <div class="compare-title">${base.name}</div>
            <div class="compare-price">${base.price}</div>
            <button class="btn btn-primary" onclick="window.open('${base.url}', '_blank')">최저가 방문</button>
        `;

        // Render Competitor
        if (!competitor) {
            competitorSlot.innerHTML = `
                <div class="empty-slot" onclick="window.location.href='index.html'">
                    <i data-lucide="plus-circle"></i>
                    <span>비교할 상품 추가하기</span>
                </div>
            `;
            // If no competitor, show placeholders in table
             specsTable.innerHTML = `<tbody><tr class="category-row"><th colspan="2">비교 대상이 없습니다</th></tr></tbody>`;
        } else {
            competitorSlot.innerHTML = `
                <div style="position:relative; width:100%;">
                    <img src="${competitor.image}" alt="${competitor.name}" class="compare-img" onerror="${onImgError}">
                    <div class="compare-brand">${competitor.brand}</div>
                    <div class="compare-title">${competitor.name}</div>
                    <div class="compare-price">${competitor.price}</div>
                    <button class="btn btn-shiny" onclick="window.open('${competitor.url}', '_blank')">최저가 방문</button>
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
                const cVal = competitor.specs[key] || '-';
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

    // Save Logic
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (!matchup || !matchup.base || !matchup.competitor) {
                alert("비교할 두 상품이 모두 있어야 저장 가능합니다.");
                return;
            }

            const savedList = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
            
            const newSave = {
                id: Date.now(),
                date: new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }),
                fullDate: new Date().toLocaleString(),
                base: matchup.base,
                competitor: matchup.competitor,
                title: `${matchup.base.name.split(' ').slice(0, 2).join(' ')} 외 1개 비교`
            };

            savedList.unshift(newSave); // Add to beginning
            localStorage.setItem('savedComparisons', JSON.stringify(savedList));

            // Toast
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

    renderComparison();
});
