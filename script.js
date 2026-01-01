/**
 * Оптимизированный скрипт для Priority GTA: SA
 * Обеспечивает плавную работу интерфейса и динамическое обновление данных
 */

(function() {
    'use strict';

    const GTA_APP = {
        // Инициализация всех модулей
        init() {
            this.cacheElements();
            this.initDateTime();
            this.initScrollTop();
            this.initImageFallback();
        },

        // Кэширование DOM-элементов для экономии ресурсов
        cacheElements() {
            this.elements = {
                clock: document.getElementById('header-clock'),
                date: document.getElementById('date'),
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                images: document.querySelectorAll('img')
            };
        },

        // --- МОДУЛЬ ВРЕМЕНИ ---
        initDateTime() {
            const update = () => {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('ru-RU', { hour12: false });
                const dateStr = now.toLocaleDateString('ru-RU');

                if (this.elements.clock) this.elements.clock.textContent = timeStr;
                if (this.elements.date) this.elements.date.textContent = dateStr;
                if (this.elements.dateTime) {
                    this.elements.dateTime.textContent = `${dateStr} ${timeStr}`;
                }
            };

            // Запуск с интервалом в 1 секунду
            update();
            setInterval(update, 1000);
        },

        // --- МОДУЛЬ ПЛАВНОЙ ПРОКРУТКИ ---
        initScrollTop() {
            const btn = this.elements.scrollBtn;
            if (!btn) return;

            // Настройка стилей для максимальной плавности через CSS-transition
            Object.assign(btn.style, {
                transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                opacity: "0",
                visibility: "hidden",
                transform: "translateY(40px) scale(0.7)",
                display: "flex"
            });

            let isTicking = false;

            const onScroll = () => {
                const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                const threshold = 350;

                if (scrolled > threshold) {
                    btn.style.visibility = "visible";
                    btn.style.opacity = "1";
                    btn.style.transform = "translateY(0) scale(1)";
                } else {
                    btn.style.opacity = "0";
                    btn.style.transform = "translateY(40px) scale(0.7)";
                    btn.style.visibility = "hidden";
                }
                isTicking = false;
            };

            // Оптимизация производительности скролла через requestAnimationFrame
            window.addEventListener('scroll', () => {
                if (!isTicking) {
                    window.requestAnimationFrame(onScroll);
                    isTicking = true;
                }
            }, { passive: true });

            // Плавный возврат наверх
            btn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Проверка состояния при загрузке
            onScroll();
        },

        // --- МОДУЛЬ ЗАЩИТЫ ИЗОБРАЖЕНИЙ ---
        initImageFallback() {
            this.elements.images.forEach(img => {
                img.addEventListener('error', function() {
                    this.src = 'https://via.placeholder.com/800x450/1a1a1a/FFD700?text=GTA+SA+IMAGE+ERROR';
                    this.style.border = '2px solid #FFD700';
                    this.style.filter = 'grayscale(1)';
                }, { once: true });
            });
        }
    };

    // Запуск приложения после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GTA_APP.init());
    } else {
        GTA_APP.init();
    }
})();