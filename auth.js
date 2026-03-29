// global-auth.js: 전역 인증 핸들러
document.addEventListener('DOMContentLoaded', () => {
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const authWrapper = document.getElementById('authWrapper');

    // --- Firebase Initialization ---
    async function initGlobalAuth() {
        try {
            const response = await fetch('/api/getConfig');
            if (!response.ok) return;
            const config = await response.json();
            
            if (config.apiKey) {
                if (!firebase.apps.length) {
                    firebase.initializeApp(config);
                }
                window.db = firebase.firestore();
                window.auth = firebase.auth();
                
                setupGlobalAuthUI();
                setupLoginButton();
            }
        } catch (error) {
            console.error("Auth init error:", error);
        }
    }

    function setupLoginButton() {
        if (googleLoginBtn) {
            googleLoginBtn.onclick = async () => {
                const provider = new firebase.auth.GoogleAuthProvider();
                try {
                    await auth.signInWithPopup(provider);
                    // onAuthStateChanged will handle UI update
                } catch (error) {
                    console.error("Login failed:", error);
                    alert("로그인에 실패했습니다: " + error.message);
                }
            };
        }
    }

    function setupGlobalAuthUI() {
        auth.onAuthStateChanged(user => {
            if (user) {
                // Update Header with Profile
                if (authWrapper) {
                    authWrapper.innerHTML = `
                        <div class="user-profile" id="headerProfileTrigger" style="display:flex; align-items:center; gap:0.75rem; cursor:pointer; position:relative;">
                            <img src="${user.photoURL || 'https://placehold.co/150x150?text=P'}" alt="Profile" style="width:36px; height:36px; border-radius:50%; border:2px solid var(--accent-primary);">
                            <span style="font-weight:600; font-size:0.95rem;">${user.displayName}</span>
                            <div id="headerLogoutMenu" style="display:none; position:absolute; top:120%; right:0; background:var(--bg-surface); padding:0.5rem; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.15); border:1px solid var(--glass-border); min-width:140px; z-index:9999;">
                                <button id="headerLogoutBtn" style="width:100%; text-align:left; padding:0.6rem; font-size:0.9rem; color:var(--accent-danger); border-radius:4px; display:inline-flex; align-items:center; background:transparent; border:none; cursor:pointer;">
                                    <i data-lucide="log-out" style="width:14px; height:14px; margin-right:8px;"></i> 로그아웃
                                </button>
                            </div>
                        </div>
                    `;

                    const trigger = document.getElementById('headerProfileTrigger');
                    const menu = document.getElementById('headerLogoutMenu');
                    const logoutBtn = document.getElementById('headerLogoutBtn');

                    if (trigger && menu) {
                        trigger.onclick = (e) => {
                            e.stopPropagation();
                            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                        };
                    }
                    if (logoutBtn) {
                        logoutBtn.onclick = async () => {
                            await auth.signOut();
                            window.location.reload();
                        };
                    }
                    
                    if (window.lucide) lucide.createIcons();
                }
            } else {
                // Guest UI (Default button already exists in HTML, ensure it's shown if modified)
                if (authWrapper && !document.getElementById('googleLoginBtn')) {
                    authWrapper.innerHTML = `
                        <button class="btn btn-primary" id="googleLoginBtn">
                            <i data-lucide="log-in" style="width: 16px; height: 16px;"></i> 구글 로그인
                        </button>
                    `;
                    setupLoginButton();
                    if (window.lucide) lucide.createIcons();
                }
            }
            
            // Dispatch event for page-specific scripts (like community.js)
            window.dispatchEvent(new CustomEvent('authStateChanged', { detail: user }));
        });
    }

    // Close menu when clicking outside
    window.addEventListener('click', () => {
        const menu = document.getElementById('headerLogoutMenu');
        if (menu) menu.style.display = 'none';
    });

    initGlobalAuth();
});
