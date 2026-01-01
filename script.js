/**
 * Оптимизированный скрипт для Priority GTA: SA с интеграцией ИИ (CJ Assistant)
 * Объединяет управление временем, скроллом, картинками и чатом.
 */

(function() {
    'use strict';

    // API Key для Gemini (в Canvas подставляется автоматически, для GitHub можно оставить пустым или вставить свой)
    const apiKey = "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"; 

    const GTA_APP = {
        // Инициализация всех модулей
        init() {
            this.ensureUIElements(); // Создаем элементы интерфейса ИИ
            this.cacheElements();
            this.initDateTime();
            this.initScrollTop();
            this.initAIChat();
            this.initImageFallback();
            this.initSmoothNavigation();
        },

        // Создаем кнопки и окна, если их нет в HTML
        ensureUIElements() {
            // Кнопка вызова ИИ
            if (!document.getElementById('ai-toggle-btn')) {
                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'ai-toggle-btn';
                toggleBtn.innerHTML = '🤖';
                toggleBtn.title = "Спросить Си-Джея";
                document.body.appendChild(toggleBtn);
            }

            // Виджет чата
            if (!document.getElementById('ai-chat-widget')) {
                const widget = document.createElement('div');
                widget.id = 'ai-chat-widget';
                widget.innerHTML = `
                    <div class="ai-chat-header">
                        <span>CJ AI Assistant</span>
                        <button id="ai-close-btn">✕</button>
                    </div>
                    <div id="ai-chat-messages">
                        <div class="message ai-message">Эй, Си-Джей! Гроув-Стрит на связи. Нужна помощь с установкой модов или хочешь узнать, какой патч лучше? Спрашивай!</div>
                    </div>
                    <div class="ai-chat-input-area">
                        <input type="text" id="ai-user-input" placeholder="Напиши что-нибудь, бро...">
                        <button id="ai-send-btn">➤</button>
                    </div>
                `;
                document.body.appendChild(widget);
            }
        },

        // Кэширование DOM-элементов для экономии ресурсов
        cacheElements() {
            this.elements = {
                clock: document.getElementById('header-clock'),
                date: document.getElementById('date'),
                dateTime: document.getElementById('datetime'),
                scrollBtn: document.getElementById('scroll-btn'),
                images: document.querySelectorAll('img'),
                aiWidget: document.getElementById('ai-chat-widget'),
                aiToggle: document.getElementById('ai-toggle-btn'),
                aiClose: document.getElementById('ai-close-btn'),
                aiMessages: document.getElementById('ai-chat-messages'),
                aiInput: document.getElementById('ai-user-input'),
                aiSend: document.getElementById('ai-send-btn')
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
                
                // Для блока datetime в подвале или мобильной версии
                if (this.elements.dateTime) {
                    const options = { 
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit' 
                    };
                    this.elements.dateTime.textContent = now.toLocaleString('ru-RU', options);
                }
            };
            setInterval(update, 1000);
            update();
        },

        // --- МОДУЛЬ СКРОЛЛА ---
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

        // --- ЛОГИКА ИИ-ЧАТА ---
        initAIChat() {
            const { aiWidget, aiToggle, aiClose, aiSend, aiInput } = this.elements;
            if (!aiWidget || !aiToggle) return;

            // Переключатель видимости
            aiToggle.addEventListener('click', () => {
                const isVisible = window.getComputedStyle(aiWidget).display === 'flex';
                aiWidget.style.display = isVisible ? 'none' : 'flex';
                if (!isVisible) aiInput.focus();
            });

            if (aiClose) {
                aiClose.addEventListener('click', () => {
                    aiWidget.style.display = 'none';
                });
            }

            const sendMessage = async () => {
                const text = aiInput.value.trim();
                if (!text) return;

                this.addChatMessage(text, 'user');
                aiInput.value = '';

                const loadingId = 'loading-' + Date.now();
                this.addChatMessage('Печатает...', 'ai loading', loadingId);
                
                try {
                    const response = await this.fetchAIResponse(text);
                    const loader = document.getElementById(loadingId);
                    if (loader) loader.remove();
                    this.addChatMessage(response, 'ai');
                } catch (error) {
                    const loader = document.getElementById(loadingId);
                    if (loader) loader.remove();
                    this.addChatMessage('Черт, Си-Джей, копы обрубили связь. Попробуй еще раз через минуту.', 'ai');
                }
            };

            if (aiSend) aiSend.addEventListener('click', sendMessage);
            if (aiInput) {
                aiInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });
            }
        },

        addChatMessage(text, role, id = null) {
            const div = document.createElement('div');
            div.className = `message ${role}-message`;
            div.textContent = text;
            if (id) div.id = id;
            if (this.elements.aiMessages) {
                this.elements.aiMessages.appendChild(div);
                this.elements.aiMessages.scrollTo({
                    top: this.elements.aiMessages.scrollHeight,
                    behavior: 'smooth'
                });
            }
            return div;
        },

        async fetchAIResponse(userQuery) {
            const systemPrompt = "Ты - CJ (Карл Джонсон) из GTA San Andreas. Ты помогаешь пользователям на сайте Priority GTA. Твой стиль: 'эй, бро', 'послушай', 'Гроув-Стрит навсегда'. Ты эксперт по модам (No-CD, SilentPatch, CLEO). Если спрашивают 'как скачать игру', отвечай: 'Слушай, Си-Джей, я здесь по модам. Саму игру ищи в проверенных местах, а когда достанешь чистую версию 1.0 US — возвращайся сюда, мы её прокачаем!'. Если про моды — советуй смотреть карточки на этой странице. Отвечай коротко.";
            
            let retries = 0;
            const delays = [1000, 2000, 4000];

            const callApi = async () => {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: userQuery }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] }
                    })
                });

                if (!response.ok) throw new Error('API Error');
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "Что-то я затупил, бро. Повтори?";
            };

            while (retries < 3) {
                try {
                    return await callApi();
                } catch (err) {
                    retries++;
                    if (retries === 3) throw err;
                    await new Promise(r => setTimeout(r, delays[retries-1]));
                }
            }
        },

        // --- МОДУЛЬ КАРТИНОК ---
        initImageFallback() {
            const fallbackUrl = 'https://media-rockstargames-com.akamaized.net/mfe6/prod/__common/img/bbcbd2a2bb65ddad76e831c91c17b421.jpg';
            
            this.elements.images.forEach(img => {
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

        // --- ПЛАВНАЯ НАВИГАЦИЯ ---
        initSmoothNavigation() {
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

    const run = () => GTA_APP.init();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();