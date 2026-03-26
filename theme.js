(function() {
    // 1. 초기 테마 설정 (FOUC 방지 위해 즉시 실행)
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
    
    if (initialTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 2. DOM 로드 후 버튼 이벤트 바인딩
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                
                // Lucide 아이콘이 있으면 업데이트
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        }
    });
})();
