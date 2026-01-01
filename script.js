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
            this.initSmoothNavigation();
        },

        // Кэширование DOM-элементов для экономии ресурсов
        cacheElements() {
            this.elements = {
                clock: document.getElementById('header-clock'),
                date: document.getElementById('date'),
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                images: document.querySelectorAll('img'),
                navLinks: document.querySelectorAll('nav a[href^="#"]')
            };
        },

        // --- МОДУЛЬ ВРЕМЕНИ ---
        initDateTime() {
            const update = () => {
                const now = new Date();
                // Используем Intl.DateTimeFormat для гибкости локализации
                const timeStr = now.toLocaleTimeString('ru-RU', { hour12: false });
                const dateStr = now.toLocaleDateString('ru-RU');

                if (this.elements.clock) this.elements.clock.textContent = timeStr;
                if (this.elements.date) this.elements.date.textContent = dateStr;
                if (this.elements.dateTime) {
                    this.elements.dateTime.textContent = `${dateStr} ${timeStr}`;
                }
            };

            update();
            setInterval(update, 1000);
        },

        // --- МОДУЛЬ ПЛАВНОЙ ПРОКРУТКИ ---
        initScrollTop() {
            const btn = this.elements.scrollBtn;
            if (!btn) return;

            // Настройка стилей через JS для чистоты HTML
            Object.assign(btn.style, {
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: "0",
                visibility: "hidden",
                transform: "translateY(20px)",
                display: "flex"
            });

            let isTicking = false;

            const onScroll = () => {
                const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                const threshold = 400;

                if (scrolled > threshold) {
                    btn.style.visibility = "visible";
                    btn.style.opacity = "1";
                    btn.style.transform = "translateY(0)";
                } else {
                    btn.style.opacity = "0";
                    btn.style.transform = "translateY(20px)";
                    btn.style.visibility = "hidden";
                }
                isTicking = false;
            };

            window.addEventListener('scroll', () => {
                if (!isTicking) {
                    window.requestAnimationFrame(onScroll);
                    isTicking = true;
                }
            }, { passive: true });

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        // --- МОДУЛЬ ЗАЩИТЫ ИЗОБРАЖЕНИЙ (С ЛЕНИВОЙ ЗАГРУЗКОЙ) ---
        initImageFallback() {
            const fallbackUrl = 'https://via.placeholder.com/800x450/1a1a1a/FFD700?text=GTA+SA+IMAGE+ERROR';
            
            this.elements.images.forEach(img => {
                // Добавляем нативную ленивую загрузку, если она не задана
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }

                img.addEventListener('error', function() {
                    this.src = fallbackUrl;
                    this.classList.add('img-error');
                    this.style.filter = 'sepia(0.5) contrast(1.2)';
                }, { once: true });
            });
        },

        // --- ПЛАВНАЯ НАВИГАЦИЯ ПО ЯКОРЯМ ---
        initSmoothNavigation() {
            // Используем делегирование событий для эффективности
            document.addEventListener('click', (e) => {
                const target = e.target.closest('a[href^="#"]');
                if (!target) return;

                const targetId = target.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    };

    // Безопасный запуск приложения
    const run = () => GTA_APP.init();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();