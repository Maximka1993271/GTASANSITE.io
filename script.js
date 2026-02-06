/**
 * Единый скрипт для сайта GTA: SA Portal
 * Работает на всех страницах, включая Cheats.html
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

        cacheElements() {
            this.elements = {
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                navLinks: document.querySelectorAll('nav ul li a')
            };
        },

        // Дата и время: ДД.ММ.ГГГГ ЧЧ:ММ:СС
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

        // Кнопка "Наверх"
        initScrollTop() {
            const btn = this.elements.scrollBtn;
            if (!btn) return;

            window.addEventListener('scroll', () => {
                btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
            });

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        // Подсветка активной ссылки в меню
        highlightActiveLink() {
            const current = window.location.pathname.split('/').pop() || 'index.html';
            this.elements.navLinks?.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.toggle('active', href === current || href === `./${current}`);
            });
        },

        // Аккордеон: открытие/закрытие по клику на заголовок <h3>
        initCheatAccordeon() {
            document.querySelectorAll('.cheat-category h3').forEach(header => {
                header.style.cursor = 'pointer';

                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    const category = header.parentElement;
                    if (category) {
                        category.classList.toggle('active');
                    }
                });
            });
        },

        // Плавная прокрутка + АВТО ОТКРЫТИЕ категории при клике по оглавлению
        initSmoothAnchors() {
            document.querySelectorAll('.wiki-toc a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();

                    const targetId = this.getAttribute('href'); // #player, #weapons и т.д.
                    const target = document.querySelector(targetId);

                    if (target) {
                        // Плавная прокрутка
                        target.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });

                        // Находим .cheat-category и открываем его
                        const category = target.closest('.cheat-category');
                        if (category) {
                            // Задержка 350 мс — чтобы прокрутка завершилась
                            setTimeout(() => {
                                category.classList.add('active');
                            }, 350);
                        }
                    }
                });
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