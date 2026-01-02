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
            this.initScrollTop(); // Модуль кнопки скроллинга
            this.initImageFallback();
            this.initSmoothNavigation();
            this.initFAQModal();      // Логика модального окна FAQ
            this.initCheatAccordeon(); // Логика разворота читов
            this.highlightActiveLink(); // Подсветка текущей страницы
        },

        // Кэширование элементов для повышения производительности
        cacheElements() {
            this.elements = {
                clock: document.getElementById('header-clock'),
                date: document.getElementById('date'),
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                images: document.querySelectorAll('img'),
                navLinks: document.querySelectorAll('nav ul li a'),
                faqBtn: document.getElementById('faqBtn'),
                faqModal: document.getElementById('faqModal'),
                closeModal: document.querySelector('.close-modal')
            };
        },

        // --- МОДУЛЬ FAQ (МОДАЛЬНОЕ ОКНО) ---
        initFAQModal() {
            const { faqBtn, faqModal, closeModal } = this.elements;
            if (!faqBtn || !faqModal) return;

            faqBtn.addEventListener('click', (e) => {
                e.preventDefault();
                faqModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Запрет скролла при открытом окне
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
            // Ищем все заголовки внутри категорий читов
            const cheatHeaders = document.querySelectorAll('.cheat-category h2, .cheat-category-header');
            
            cheatHeaders.forEach(header => {
                header.style.cursor = 'pointer'; // Указываем, что на элемент можно нажать
                
                header.addEventListener('click', () => {
                    const category = header.closest('.cheat-category');
                    if (category) {
                        category.classList.toggle('active');
                    }
                });
            });
        },

        // --- ДАТА И ВРЕМЯ ---
        initDateTime() {
            const update = () => {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

                if (this.elements.dateTime) {
                    this.elements.dateTime.textContent = `${dateStr} | ${timeStr}`;
                }
            };
            update();
            setInterval(update, 1000);
        },

        // --- КНОПКА "НАВЕРХ" ---
        initScrollTop() {
            const { scrollBtn } = this.elements;
            if (!scrollBtn) return;

            // Показываем кнопку при прокрутке более 300px
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollBtn.classList.add('visible');
                    scrollBtn.style.display = 'block'; // Принудительное отображение
                } else {
                    scrollBtn.classList.remove('visible');
                    scrollBtn.style.display = 'none'; // Скрываем, если вверху
                }
            });

            // Плавный скролл наверх при клике
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        // --- ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ ---
        highlightActiveLink() {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            this.elements.navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
        },

        // --- ОБРАБОТКА ОШИБОК ЗАГРУЗКИ КАРТИНКИ ---
        initImageFallback() {
            const fallbackUrl = 'https://media-rockstargames-com.akamaized.net/mfe6/prod/__common/img/bbcbd2a2bb65ddad76e831c91c17b421.jpg';
            this.elements.images.forEach(img => {
                img.addEventListener('error', function() {
                    this.src = fallbackUrl;
                    this.style.filter = 'sepia(0.5) contrast(1.2)';
                }, { once: true });
            });
        },

        // --- ПЛАВНАЯ НАВИГАЦИЯ ПО ЯКОРЯМ ---
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

    // Безопасный запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GTA_APP.init());
    } else {
        GTA_APP.init();
    }
})();