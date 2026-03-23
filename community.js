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
                    
                    const isOwner = currentUser && data.userId === currentUser.uid;
                    const actionHtml = isOwner ? `
                        <div style="margin-top:1rem; display:flex; gap:0.75rem; justify-content:flex-end;">
                            <button onclick="window.editReview('${doc.id}')" style="display:flex; align-items:center; gap:0.25rem; font-size:0.85rem; color:var(--text-secondary); background:transparent; border:none; cursor:pointer;" onmouseover="this.style.color='var(--accent-primary)'" onmouseout="this.style.color='var(--text-secondary)'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>수정</button>
                            <button onclick="window.deleteReview('${doc.id}')" style="display:flex; align-items:center; gap:0.25rem; font-size:0.85rem; color:var(--text-secondary); background:transparent; border:none; cursor:pointer;" onmouseover="this.style.color='var(--accent-danger)'" onmouseout="this.style.color='var(--text-secondary)'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>삭제</button>
                        </div>
                    ` : '';
                    
                    html += `
                        <div style="background: var(--surface); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.04); text-align: left; border: 1px solid var(--glass-border);">
                            <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 0.5rem;">
                                <img src="${data.photoURL}" alt="프로필" style="width:40px; height:40px; border-radius:50%; object-fit: cover; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                                <div>
                                    <div style="font-weight: 600; color: var(--text-primary);">${data.displayName}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${date}</div>
                                </div>
                            </div>
                            <p id="review-text-${doc.id}" style="color: var(--text-primary); line-height: 1.6; white-space: pre-wrap; font-size: 0.95rem;">${data.text}</p>
                            ${actionHtml}
                        </div>
                    `;
                });
                
                reviewsList.innerHTML = html;
            }, (error) => {
                console.error("의견 불러오기 실패:", error);
                reviewsList.innerHTML = '<div style="text-align:center; color:var(--accent-danger);">커뮤니티 데이터를 불러오는 중 오류가 발생했습니다.</div>';
            });
    }

    // 5. Global CRUD Action Handlers
    window.deleteReview = async (id) => {
        if(!confirm('정말 이 의견을 삭제하시겠습니까?')) return;
        try {
            await db.collection("reviews").doc(id).delete();
        } catch(e) {
            console.error(e);
            alert('삭제에 실패했습니다. 권한을 확인해주세요.');
        }
    };
    
    window.editReview = async (id) => {
        const p = document.getElementById(`review-text-${id}`);
        const currentText = p.innerText;
        const newText = prompt('의견을 수정하세요:', currentText);
        if(newText !== null && newText.trim() !== '' && newText !== currentText) {
            try {
                await db.collection("reviews").doc(id).update({
                    text: newText.trim(),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch(e) {
                console.error(e);
                alert('수정에 실패했습니다. 권한을 확인해주세요.');
            }
        }
    };

    initFirebase();
});
