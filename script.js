/**
 * Оптимизированный скрипт для GTA: SA Portal
 * Обеспечивает работу скроллинга, времени и модального окна FAQ
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
            this.initFAQModal(); // Инициализация окна FAQ
            this.initCheatAccordeon(); // Логика для страницы читов
        },

        // Кэширование DOM-элементов
        cacheElements() {
            this.elements = {
                clock: document.getElementById('header-clock'),
                date: document.getElementById('date'),
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                images: document.querySelectorAll('img'),
                // Элементы для FAQ
                faqBtn: document.getElementById('faqBtn'),
                faqModal: document.getElementById('faqModal'),
                closeModal: document.querySelector('.close-modal')
            };
        },

        // --- МОДУЛЬ FAQ (МОДАЛЬНОЕ ОКНО) ---
        initFAQModal() {
            const { faqBtn, faqModal, closeModal } = this.elements;

            if (faqBtn && faqModal) {
                // Открытие окна
                faqBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    faqModal.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Запрет скролла фона
                });

                // Закрытие по крестику
                if (closeModal) {
                    closeModal.addEventListener('click', () => {
                        faqModal.style.display = 'none';
                        document.body.style.overflow = '';
                    });
                }

                // Закрытие по клику вне окна
                window.addEventListener('click', (event) => {
                    if (event.target === faqModal) {
                        faqModal.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                });
            }
        },

        // --- МОДУЛЬ ЧИТОВ (АККОРДЕОН) ---
        initCheatAccordeon() {
            document.querySelectorAll('.cheat-category h3').forEach(header => {
                header.addEventListener('click', () => {
                    header.parentElement.classList.toggle('active');
                });
            });
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
            update();
            setInterval(update, 1000);
        },

        // --- МОДУЛЬ СКРОЛЛИНГА (НАВЕРХ) ---
        initScrollTop() {
            const btn = this.elements.scrollBtn;
            if (!btn) return;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    btn.style.display = 'block';
                } else {
                    btn.style.display = 'none';
                }
            });

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        // --- ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ ---
        initImageFallback() {
            const fallbackUrl = 'https://via.placeholder.com/800x450?text=GTA+San+Andreas';
            
            this.elements.images.forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }

                img.addEventListener('error', function() {
                    this.src = fallbackUrl;
                    this.style.filter = 'sepia(0.5) contrast(1.2)';
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
                    // Если это категория читов, открываем её
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