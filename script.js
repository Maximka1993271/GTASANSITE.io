/**
 * Основной скрипт сайта Grand Theft Auto: San Andreas
 * Обрабатывает динамическое время и интерактивные элементы интерфейса
 */

document.addEventListener('DOMContentLoaded', () => {
    // === 1. УПРАВЛЕНИЕ ВРЕМЕНЕМ И ДАТОЙ ===
    const clockElement = document.getElementById('header-clock');
    const dateElement = document.getElementById('date');
    const dtElement = document.getElementById('datetime');

    /**
     * Обновляет текстовое содержимое элементов времени
     */
    const updateTime = () => {
        const now = new Date();
        
        // Опции для форматирования (локаль ru-RU)
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

        const currentTime = now.toLocaleTimeString('ru-RU', timeOptions);
        const currentDate = now.toLocaleDateString('ru-RU', dateOptions);

        // Приоритет раздельным блокам, если они есть в HTML
        if (clockElement && dateElement) {
            clockElement.textContent = currentTime;
            dateElement.textContent = currentDate;
        } 
        // Fallback на общий блок
        else if (dtElement) {
            dtElement.textContent = `${currentDate} | ${currentTime}`;
        }
    };

    // Запуск таймера обновления
    const timeInterval = setInterval(updateTime, 1000);
    updateTime(); // Мгновенное отображение при загрузке

    // === 2. КНОПКА "ВВЕРХ" (SCROLL TO TOP) ===
    const scrollBtn = document.getElementById('scroll-btn');
    
    if (scrollBtn) {
        // Устанавливаем начальные стили для плавности через JS, если их нет в CSS
        scrollBtn.style.transition = "opacity 0.4s ease, transform 0.3s ease, visibility 0.4s";
        scrollBtn.style.opacity = "0";
        scrollBtn.style.visibility = "hidden";
        scrollBtn.style.display = "flex"; // Оставляем flex для центрирования иконки

        /**
         * Переключает видимость кнопки в зависимости от прокрутки
         */
        const handleScroll = () => {
            const scrollThreshold = 300;
            const isVisible = window.scrollY > scrollThreshold;
            
            if (isVisible) {
                scrollBtn.style.visibility = "visible";
                scrollBtn.style.opacity = "1";
                scrollBtn.style.transform = "translateY(0)";
            } else {
                scrollBtn.style.opacity = "0";
                scrollBtn.style.visibility = "hidden";
                scrollBtn.style.transform = "translateY(20px)";
            }
        };

        // Оптимизация: используем passive event listener для лучшей производительности скролла
        window.addEventListener('scroll', handleScroll, { passive: true });

        /**
         * Плавный скролл к началу страницы
         */
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Начальная проверка положения
        handleScroll();
    }

    // === 3. ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ ===
    // Если картинка не загрузилась, подставляем заглушку
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/700x400?text=GTA+San+Andreas';
            this.onerror = null;
        };
    });
});

/**
 * Очистка ресурсов при выгрузке страницы
 */
window.addEventListener('unload', () => {
    if (typeof timeInterval !== 'undefined') clearInterval(timeInterval);
});