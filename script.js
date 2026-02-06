/**
 * Единый скрипт для портала GTA: San Andreas
 * Обрабатывает: время, скролл, активные ссылки, аккордеоны читов и навигацию.
 */
(function() {
    'use strict';

    const GTA_APP = {
        init() {
            this.cacheElements();
            this.initDateTime();
            this.initScrollTop();
            this.highlightActiveLink();
            this.initCheatAccordeon();
            this.initSmoothAnchors();
        },

        // Сохраняем ссылки на элементы, чтобы не искать их постоянно
        cacheElements() {
            this.elements = {
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                navLinks: document.querySelectorAll('nav ul li a'),
                cheatHeaders: document.querySelectorAll('.cheat-category h3')
            };
        },

        // 1. Обновление даты и времени (Формат: ДД.ММ.ГГГГ ЧЧ:ММ:СС)
        initDateTime() {
            const el = this.elements.dateTime;
            if (!el) return;

            const update = () => {
                const now = new Date();
                const pad = n => String(n).padStart(2, '0');
                el.textContent = 
                    `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ` +
                    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            };

            update();
            setInterval(update, 1000);
        },

        // 2. Кнопка "Наверх"
        initScrollTop() {
            const btn = this.elements.scrollBtn;
            if (!btn) return;

            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    btn.style.display = 'flex';
                } else {
                    btn.style.display = 'none';
                }
            });

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        // 3. Подсветка текущей страницы в меню
        highlightActiveLink() {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            this.elements.navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
        },

        // 4. Логика аккордеона для страницы читов
        initCheatAccordeon() {
            this.elements.cheatHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const category = header.parentElement;
                    
                    // Если хочешь, чтобы при открытии одной категории закрывались другие, 
                    // раскомментируй блок ниже:
                    /*
                    document.querySelectorAll('.cheat-category').forEach(el => {
                        if (el !== category) el.classList.remove('active');
                    });
                    */

                    category.classList.toggle('active');
                });
            });
        },

        // 5. Плавная прокрутка из оглавления + авто-открытие категории
        initSmoothAnchors() {
            document.querySelectorAll('.wiki-toc a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();

                    const targetId = this.getAttribute('href');
                    const target = document.querySelector(targetId);

                    if (target) {
                        // Сначала открываем категорию, чтобы скролл был точным
                        target.classList.add('active');

                        // Плавная прокрутка
                        setTimeout(() => {
                            target.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }, 50);
                    }
                });
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