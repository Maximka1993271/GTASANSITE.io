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
            
            // Функция для обновления видимости кнопки
            const toggleVisibility = () => {
                btn.style.display = (window.scrollY > 300) ? "flex" : "none";
            };
            
            window.addEventListener('scroll', toggleVisibility);
            toggleVisibility(); // Вызов для начального состояния
            
            btn.onclick = () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
        },

        highlightActiveLink() {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            this.elements.navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        },

        initCheatAccordeon() {
            this.elements.cheatHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const parent = header.parentElement;
                    if (parent) {
                        parent.classList.toggle('active');
                    }
                });
            });
        },

        initSmoothAnchors() {
            document.querySelectorAll('.wiki-toc a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.classList.add('active');
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                    }
                });
            });
        },

        initImageZoom() {
            // Используем делегирование: вешаем событие на весь document
            document.addEventListener('click', (e) => {
                // Проверяем, что кликнули по картинке внутри сетки сравнения
                const img = e.target.closest('.comparison-grid img');
                if (img) {
                    this.openModal(img.src);
                }
            });

            // Добавляем стиль для курсора
            const style = document.createElement('style');
            style.textContent = '.comparison-grid img { cursor: zoom-in !important; transition: transform 0.2s; } .comparison-grid img:hover { transform: scale(1.02); }';
            document.head.appendChild(style);
        },

        openModal(src) {
            // Проверяем, нет ли уже открытого модального окна
            if (document.querySelector('.gta-modal')) return;
            
            const modal = document.createElement('div');
            modal.className = 'gta-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.95); display: flex; align-items: center;
                justify-content: center; z-index: 10000; cursor: zoom-out;
                animation: gtaModalFadeIn 0.2s ease;
            `;

            const fullImg = document.createElement('img');
            fullImg.src = src;
            fullImg.style.cssText = `
                max-width: 90%; max-height: 90%; 
                border: 3px solid #ffcc00;
                border-radius: 8px;
                box-shadow: 0 0 50px rgba(0,0,0,0.8);
                object-fit: contain;
                animation: gtaModalZoomIn 0.2s ease;
            `;

            // Добавляем анимации, если их еще нет
            if (!document.querySelector('#gta-modal-styles')) {
                const animStyles = document.createElement('style');
                animStyles.id = 'gta-modal-styles';
                animStyles.textContent = `
                    @keyframes gtaModalFadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes gtaModalZoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                `;
                document.head.appendChild(animStyles);
            }

            modal.appendChild(fullImg);
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы

            // Закрытие по клику
            modal.onclick = () => {
                modal.remove();
                document.body.style.overflow = '';
            };
            
            // Закрытие по клавише Escape
            const onKeyDown = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', onKeyDown);
                }
            };
            document.addEventListener('keydown', onKeyDown);
        }
    };

    // Запуск приложения после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GTA_APP.init());
    } else {
        GTA_APP.init();
    }
})();