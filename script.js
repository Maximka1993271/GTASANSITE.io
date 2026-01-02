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
                // Элементы модального окна FAQ
                faqBtn: document.getElementById('faqBtn'),
                faqModal: document.getElementById('faqModal'),
                closeModal: document.querySelector('.close-modal')
            };
        },

        // --- МОДУЛЬ FAQ (МОДАЛЬНОЕ ОКНО) ---
        initFAQModal() {
            const { faqBtn, faqModal, closeModal } = this.elements;

            if (faqBtn && faqModal) {
                // Открытие окна при клике на кнопку FAQ
                faqBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    faqModal.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Запрет прокрутки страницы под окном
                });

                // Закрытие окна по клику на крестик
                if (closeModal) {
                    closeModal.addEventListener('click', () => {
                        this.closeModalFunc(faqModal);
                    });
                }

                // Закрытие при клике на темную область вне окна
                window.addEventListener('click', (event) => {
                    if (event.target === faqModal) {
                        this.closeModalFunc(faqModal);
                    }
                });

                // Закрытие по клавише Escape
                window.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && faqModal.style.display === 'block') {
                        this.closeModalFunc(faqModal);
                    }
                });
            }
        },

        // Вспомогательная функция закрытия модального окна
        closeModalFunc(modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Возвращаем прокрутку страницы
        },

        // --- МОДУЛЬ ЧИТОВ (АККОРДЕОН) ---
        initCheatAccordeon() {
            // Ищем все заголовки категорий читов
            document.querySelectorAll('.cheat-category h3').forEach(header => {
                header.addEventListener('click', () => {
                    const parent = header.parentElement;
                    
                    // Переключаем класс active (CSS покажет/скроет таблицу)
                    parent.classList.toggle('active');
                    
                    // (Опционально) Закрывать другие категории при открытии новой
                    /*
                    document.querySelectorAll('.cheat-category').forEach(cat => {
                        if (cat !== parent) cat.classList.remove('active');
                    });
                    */
                });
            });
        },

        // --- МОДУЛЬ ВРЕМЕНИ (ЧАСЫ) ---
        initDateTime() {
            const update = () => {
                const now = new Date();
                // Формат времени: ЧЧ:ММ:СС
                const timeStr = now.toLocaleTimeString('ru-RU', { hour12: false });
                // Формат даты: ДД.ММ.ГГГГ
                const dateStr = now.toLocaleDateString('ru-RU');

                if (this.elements.clock) this.elements.clock.textContent = timeStr;
                if (this.elements.date) this.elements.date.textContent = dateStr;
                
                // Комбинированное поле (если есть на странице)
                if (this.elements.dateTime) {
                    this.elements.dateTime.textContent = `${dateStr} ${timeStr}`;
                }
            };
            update();
            setInterval(update, 1000); // Обновление каждую секунду
        },

        // --- МОДУЛЬ ПРОКРУТКИ НАВЕРХ ---
        initScrollTop() {
            const btn = this.elements.scrollBtn;
            if (!btn) return;

            window.addEventListener('scroll', () => {
                // Показываем кнопку только если прокрутили больше 300 пикселей
                if (window.scrollY > 300) {
                    btn.style.display = 'flex'; // Используем flex для центрирования иконки внутри
                } else {
                    btn.style.display = 'none';
                }
            });

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Плавный скролл
            });
        },

        // --- АВТОМАТИЧЕСКАЯ ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ ---
        highlightActiveLink() {
            const currentPath = window.location.pathname;
            this.elements.navLinks.forEach(link => {
                // Если путь ссылки совпадает с текущим адресом
                if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
                    link.classList.add('active');
                }
            });
        },

        // --- ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ ---
        initImageFallback() {
            const fallbackUrl = 'https://via.placeholder.com/800x450?text=GTA+San+Andreas';
            
            this.elements.images.forEach(img => {
                // Добавляем ленивую загрузку для оптимизации скорости
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }

                // Если картинка не загрузилась, ставим заглушку
                img.addEventListener('error', function() {
                    this.src = fallbackUrl;
                    this.style.filter = 'sepia(0.5) contrast(1.2)'; // Эффект под ретро-игру
                }, { once: true });
            });
        },

        // --- ПЛАВНАЯ НАВИГАЦИЯ ПО ЯКОРЯМ ---
        initSmoothNavigation() {
            document.addEventListener('click', (e) => {
                const target = e.target.closest('a[href^="#"]');
                // Игнорируем кнопку FAQ (у неё своя логика) и пустые ссылки
                if (!target || target.id === 'faqBtn') return; 

                const targetId = target.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Если целевой элемент — категория читов, автоматически открываем её
                    if (targetElement.classList.contains('cheat-category')) {
                        targetElement.classList.add('active');
                    }
                }
            });
        }
    };

    // Безопасный запуск скрипта после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GTA_APP.init());
    } else {
        GTA_APP.init();
    }
})();