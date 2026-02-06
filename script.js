/**
 * Оптимизированный скрипт для GTA: SA Portal
 * Обеспечивает работу скроллинга, времени, FAQ и аккордеонов
 */

(function() {
    'use strict';

    const GTA_APP = {
        // Инициализация всех модулей приложения
        init() {
            this.cacheElements();
            this.initDateTime();
            this.initScrollTop(); 
            this.initImageFallback();
            this.initSmoothNavigation();
            this.initFAQModal();      
            this.initCheatAccordeon(); 
            this.highlightActiveLink(); 
        },

        // Кэширование элементов
        cacheElements() {
            this.elements = {
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                images: document.querySelectorAll('img'),
                navLinks: document.querySelectorAll('nav ul li a'),
                faqBtn: document.getElementById('faqBtn'),
                faqModal: document.getElementById('faqModal'),
                closeModal: document.querySelector('.close-modal')
            };
        },

        // --- МОДУЛЬ FAQ ---
        initFAQModal() {
            const { faqBtn, faqModal, closeModal } = this.elements;
            if (!faqBtn || !faqModal) return;

            faqBtn.addEventListener('click', (e) => {
                e.preventDefault();
                faqModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; 
            });

            const close = () => {
                faqModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            };

            if (closeModal) closeModal.addEventListener('click', close);
            window.addEventListener('click', (e) => { if (e.target === faqModal) close(); });
        },

        // --- МОДУЛЬ АККОРДЕОНА (ЧИТЫ) ---
        initCheatAccordeon() {
            // Исправлено: добавлена поддержка h3 и универсальных заголовков
            const cheatHeaders = document.querySelectorAll('.cheat-category h2, .cheat-category h3, .cheat-category-header');
            
            cheatHeaders.forEach(header => {
                header.style.cursor = 'pointer';
                
                header.addEventListener('click', () => {
                    const category = header.closest('.cheat-category');
                    if (category) {
                        // Закрыть другие, если нужно (опционально)
                        // document.querySelectorAll('.cheat-category').forEach(el => el.classList.remove('active'));
                        category.classList.toggle('active');
                    }
                });
            });
        },

        // --- ДАТА И ВРЕМЯ ---
        initDateTime() {
            const { dateTime } = this.elements;
            if (!dateTime) return;

            const update = () => {
                const now = new Date();
                // Формат: 06.02.2026 08:55:01 (как в твоем стиле)
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const timeStr = now.toLocaleTimeString('ru-RU');
                
                dateTime.textContent = `${day}.${month}.${year} ${timeStr}`;
            };
            update();
            setInterval(update, 1000);
        },

        // --- КНОПКА "НАВЕРХ" ---
        initScrollTop() {
            const { scrollBtn } = this.elements;
            if (!scrollBtn) return;

            window.addEventListener('scroll', () => {
                // Используем только класс, чтобы не конфликтовать с CSS
                if (window.scrollY > 300) {
                    scrollBtn.style.display = 'flex'; // Показываем как flex для центрирования стрелки
                } else {
                    scrollBtn.style.display = 'none';
                }
            });

            scrollBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        // --- ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ ---
        highlightActiveLink() {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            if (!this.elements.navLinks) return;

            this.elements.navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        },

        // --- ОБРАБОТКА ОШИБОК КАРТИНКИ ---
        initImageFallback() {
            const fallbackUrl = 'https://media-rockstargames-com.akamaized.net/mfe6/prod/__common/img/4bddd183ad5bce1fa0efdc5cbd958743.jpg';
            if (!this.elements.images) return;

            this.elements.images.forEach(img => {
                img.addEventListener('error', function() {
                    this.src = fallbackUrl;
                    this.style.filter = 'grayscale(1) brightness(0.7)'; // Эффект затухания для битых фото
                }, { once: true });
            });
        },

        // --- ПЛАВНАЯ НАВИГАЦИЯ ---
        initSmoothNavigation() {
            document.addEventListener('click', (e) => {
                const target = e.target.closest('a[href^="#"]');
                if (!target || target.id === 'faqBtn') return; 

                const targetId = target.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    if (targetElement.classList.contains('cheat-category')) {
                        targetElement.classList.add('active');
                    }
                }
            });
        }
    };

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GTA_APP.init());
    } else {
        GTA_APP.init();
    }
})();