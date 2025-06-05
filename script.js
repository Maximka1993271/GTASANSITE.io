const scrollBtn = document.getElementById('scroll-btn');

// Проверим, существует ли кнопка, прежде чем добавлять обработчики событий
if (scrollBtn) {
    // Функция, которая будет проверять положение прокрутки
    function toggleScrollButton() {
        // Проверяем, прокручен ли экран больше чем на 20px
        if (window.scrollY > 20) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    }

    // Используем `addEventListener` для прокрутки и проверки
    window.addEventListener('scroll', toggleScrollButton);

    // Прокрутка вверх при нажатии на кнопку
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Сначала проверим состояние при загрузке страницы
    toggleScrollButton();
}

<script>
    function updateTime() {
        const now = new Date();
        // Форматируем время (часы:минуты:секунды)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        // Форматируем дату (день.месяц.год)
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const dateString = `${day}.${month}.${year}`;

        // Обновляем блоки с временем и датой
        document.getElementById('header-clock').textContent = timeString;
        document.getElementById('date').textContent = dateString;
    }

    // Обновляем время каждую секунду
    setInterval(updateTime, 1000);

    // Первоначальный вызов для отображения времени сразу при загрузке страницы
    updateTime();
</script>



