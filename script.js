/**
 * Единый скрипт для портала GTA: San Andreas
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
            this.initImageZoom(); 
        },

        cacheElements() {
            this.elements = {
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                navLinks: document.querySelectorAll('nav ul li a'),
                cheatHeaders: document.querySelectorAll('.cheat-category h3'),
                // Убираем жесткую привязку к картинкам здесь, будем искать их в методе
                grid: document.querySelector('.comparison-grid')
            };
        },

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

        initScrollTop() {
            const btn = this.elements.scrollBtn;
            if (!btn) return;
            window.addEventListener('scroll', () => {
                btn.style.display = (window.pageYOffset > 300) ? 'flex' : 'none';
            });
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        highlightActiveLink() {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            this.elements.navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
        },

        initCheatAccordeon() {
            this.elements.cheatHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    header.parentElement.classList.toggle('active');
                });
            });
        },

        initSmoothAnchors() {
            document.querySelectorAll('.wiki-toc a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.classList.add('active');
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                    }
                });
            });
        },

        // ИСПРАВЛЕННЫЙ МЕТОД
        initImageZoom() {
            // Используем делегирование: вешаем событие на весь body
            document.addEventListener('click', (e) => {
                // Проверяем, что кликнули именно по картинке внутри сетки сравнения
                if (e.target.closest('.comparison-grid img')) {
                    this.openModal(e.target.src);
                }
            });

            // Добавляем курсор через CSS (стилизуем все картинки в сетке сразу)
            const style = document.createElement('style');
            style.textContent = '.comparison-grid img { cursor: zoom-in !important; }';
            document.head.appendChild(style);
        },

        openModal(src) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.92); display: flex; align-items: center;
                justify-content: center; z-index: 10000; cursor: zoom-out;
                animation: fadeIn 0.3s ease;
            `;

            const fullImg = document.createElement('img');
            fullImg.src = src;
            fullImg.style.cssText = `
                max-width: 95%; max-height: 95%; 
                border: 2px solid #ffcc00;
                box-shadow: 0 0 50px rgba(0,0,0,0.8);
                transform: scale(1);
                transition: transform 0.3s ease;
            `;

            // Добавляем простую анимацию появления
            const anim = document.createElement('style');
            anim.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
            document.head.appendChild(anim);

            modal.appendChild(fullImg);
            document.body.appendChild(modal);

            modal.onclick = () => modal.remove();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GTA_APP.init());
    } else {
        GTA_APP.init();
    }
})();