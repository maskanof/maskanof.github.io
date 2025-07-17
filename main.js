document.addEventListener('DOMContentLoaded', function() {
    // Параллакс-эффект для шапки
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', function() {
        const scrollValue = window.scrollY;
        hero.style.backgroundPositionY = scrollValue * 0.5 + 'px';
    });

    // Анимация карточек при скролле
    gsap.utils.toArray('.game-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8
        });
    });

    // Загрузка отзывов
    loadFeedback();
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
function loadFeedback() {
    fetch('feedback.php?action=get_latest')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('feedback-preview');
            if (!data.length) {
                container.innerHTML = '<p class="no-feedback">Пока нет отзывов. Будьте первым!</p>';
                return;
            }

            container.innerHTML = data.map(item => `
                <div class="feedback-card">
                    <div class="user-avatar">${item.name.charAt(0)}</div>
                    <div class="feedback-content">
                        <h4>${item.name} <span>о ${item.game || 'игре'}</span></h4>
                        <p class="feedback-text">"${item.message}"</p>
                        <div class="feedback-meta">
                            <span class="feedback-date">${new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                            <div class="feedback-rating">★★★★★</div>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('feedback-preview').innerHTML = 
                '<p class="error">Не удалось загрузить отзывы</p>';
        });
}