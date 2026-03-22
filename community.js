document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const reviewForm = document.getElementById('reviewForm');
    const reviewInput = document.getElementById('reviewInput');
    const submitReviewBtn = document.getElementById('submitReviewBtn');
    const reviewsList = document.getElementById('reviewsList');
    const loginPrompt = document.getElementById('loginPrompt');
    const authWrapper = document.getElementById('authWrapper');

    let currentUser = null;

    // 1. Firebase Initialization
    async function initFirebase() {
        try {
            const response = await fetch('/api/getConfig');
            if (!response.ok) throw new Error("API 연결 실패");
            const config = await response.json();
            
            if (config.apiKey) {
                firebase.initializeApp(config);
                window.db = firebase.firestore();
                window.auth = firebase.auth();
                
                setupAuthUI();
                fetchReviews(); // 실시간 리스너 등록
            }
        } catch (error) {
            console.error("Firebase 초기화 실패:", error);
            reviewsList.innerHTML = '<div style="text-align:center; color:var(--error);">서버에 연결할 수 없습니다.</div>';
        }
    }

    // 2. Auth State Observer
    function setupAuthUI() {
        auth.onAuthStateChanged(user => {
            currentUser = user;
            
            if (user) {
                // Header UI Update
                authWrapper.innerHTML = `
                    <div class="user-profile" style="display:flex; align-items:center; gap:0.5rem;">
                        <img src="${user.photoURL || 'https://via.placeholder.com/150'}" alt="Profile" style="width:32px; height:32px; border-radius:50%;">
                        <span style="color:var(--text); font-weight:500;">${user.displayName}</span>
                    </div>
                `;
                
                // Form UI Update
                reviewForm.style.display = 'block';
                loginPrompt.style.display = 'none';
            } else {
                // Header UI Update
                authWrapper.innerHTML = `
                    <button class="btn btn-primary" onclick="window.location.href='index.html'">로그인하러 가기</button>
                `;
                
                // Form UI Update
                reviewForm.style.display = 'none';
                loginPrompt.style.display = 'block';
            }
            lucide.createIcons();
        });
    }

    // 3. Review Submit Logic
    submitReviewBtn.addEventListener('click', async () => {
        const text = reviewInput.value.trim();
        if (!text) return alert('내용을 입력해주세요.');
        if (!currentUser) return alert('로그인이 필요합니다.');
        if (!window.db) return alert('데이터베이스에 연결되지 않았습니다.');

        submitReviewBtn.disabled = true;
        submitReviewBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> 등록 중...';
        lucide.createIcons();

        try {
            await db.collection("reviews").add({
                text: text,
                userId: currentUser.uid,
                displayName: currentUser.displayName || '익명',
                photoURL: currentUser.photoURL || 'https://via.placeholder.com/150',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            reviewInput.value = ''; // 폼 초기화
        } catch (error) {
            console.error("리뷰 작성 실패:", error);
            alert("리뷰 등록에 실패했습니다.");
        } finally {
            submitReviewBtn.disabled = false;
            submitReviewBtn.innerHTML = '<i data-lucide="send"></i> 등록하기';
            lucide.createIcons();
        }
    });

    // 4. Real-time Reviews Listener
    function fetchReviews() {
        if (!window.db) return;
        
        // onSnapshot을 사용하여 실시간으로 데이터를 화면에 뿌려줌
        db.collection("reviews")
            .orderBy("timestamp", "desc")
            .limit(50)
            .onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    reviewsList.innerHTML = '<div style="text-align:center; color:var(--text-secondary); padding: 2rem;">아직 첫 번째 의견이 없습니다. 첫 글을 남겨보세요!</div>';
                    return;
                }
                
                let html = '';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString('ko-KR', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '방금 전';
                    
                    html += `
                        <div style="background: var(--surface); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: var(--shadow-sm); text-align: left;">
                            <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 0.5rem;">
                                <img src="${data.photoURL}" alt="프로필" style="width:40px; height:40px; border-radius:50%; object-fit: cover;">
                                <div>
                                    <div style="font-weight: 600; color: var(--text);">${data.displayName}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${date}</div>
                                </div>
                            </div>
                            <p style="color: var(--text); line-height: 1.6; white-space: pre-wrap;">${data.text}</p>
                        </div>
                    `;
                });
                
                reviewsList.innerHTML = html;
            }, (error) => {
                console.error("의견 불러오기 실패:", error);
                reviewsList.innerHTML = '<div style="text-align:center; color:var(--error);">커뮤니티 데이터를 불러오는 중 오류가 발생했습니다.</div>';
            });
    }

    initFirebase();
});
