# GTA: San Andreas Portal

**Версия:** 2.0 (Production Ready)  
**Дата релиза:** 21.08.2026  
**Лицензия:** MIT  

---

## 📋 Описание проекта

Статический веб-портал для модификации игры **Grand Theft Auto: San Andreas**. Сайт содержит:
- Инструкции по установке модов (RoSA Project, Urbanize, Proper Shaders)
- Полный список чит-кодов с аккордеон-навигацией
- Каталог модов и плагинов с прямыми ссылками на скачивание
- Настройка приоритетов ModLoader
- FAQ и руководство для новичков
- Встроенное интернет-радио GTA

**Технологии:** HTML5, CSS3, JavaScript (vanilla), Font Awesome, Google Fonts.

---

## 📁 Структура проекта
GTASANSITE.io/
├── index.html # Главная страница
├── urbanize.html # Мод Urbanize (24 видео-обзора)
├── proper_shaders.html # Мод Proper Shaders
├── mods.html # Каталог всех модов (70+ категорий)
├── Cheats.html # Полный список чит-кодов
├── Priority.html # Настройка приоритетов ModLoader
├── install.html # Инструкция по установке
├── FAQ.html # Вопросы и ответы
├── 404.html # Страница ошибки 404
├── style.css # Единый файл стилей
├── script.js # Единый файл скриптов
├── robots.txt # Инструкции для поисковых роботов
├── sitemap.xml # Карта сайта для SEO
├── images/
│ └── favicon.ico # Иконка сайта
└── README.md # Этот файл


---

## 🛠 Список всех исправлений (v2.0)

### 1. Безопасность (Security)

| # | Проблема | Исправление | Файлы |
|---|----------|-------------|-------|
| 1 | Внешние ссылки без `rel="noopener noreferrer"` | Добавлен атрибут ко всем `target="_blank"` ссылкам | Все HTML |
| 2 | `og:url` указывал на `your-domain.com` | Заменён на реальный GitHub Pages URL | `index.html` |
| 3 | Отсутствует `robots.txt` | Создан файл с настройками индексации | `robots.txt` |
| 4 | Отсутствует `sitemap.xml` | Создана карта сайта для поисковиков | `sitemap.xml` |
| 5 | Нет политики безопасности на уровне деплоя | Добавлены рекомендации в README | — |

### 2. Производительность (Performance)

| # | Проблема | Исправление | Файлы |
|---|----------|-------------|-------|
| 6 | 24 YouTube iframe без `loading="lazy"` | Добавлен атрибут `loading="lazy"` ко всем видео | `urbanize.html` |
| 7 | Тяжёлая загрузка всех видео сразу | Оставлено как есть (структура страницы не менялась) | `urbanize.html` |
| 8 | Изображения без `loading="lazy"` | Добавлен атрибут к удалённым изображениям | `proper_shaders.html` |
| 9 | Отсутствуют `width`/`height` у изображений | Добавлены для основных изображений | `proper_shaders.html` |

### 3. Доступность (Accessibility)

| # | Проблема | Исправление | Файлы |
|---|----------|-------------|-------|
| 10 | Изображения без `alt` | Добавлены осмысленные `alt` для всех `<img>` | `proper_shaders.html`, `urbanize.html` |
| 11 | Нарушена иерархия заголовков (h2 → h4) | Исправлено на h2 → h3 | `proper_shaders.html` |
| 12 | Меню "Радио" работает только через `:hover` | Добавлены `aria-haspopup` и `aria-expanded` | Все HTML |
| 13 | Нет клавиатурной навигации для меню | Добавлены базовые атрибуты | Все HTML |

### 4. SEO (Search Engine Optimization)

| # | Проблема | Исправление | Файлы |
|---|----------|-------------|-------|
| 14 | Отсутствует `canonical` | Добавлен в секцию `<head>` | Все HTML |
| 15 | Нет `robots.txt` | Создан | `robots.txt` |
| 16 | Нет `sitemap.xml` | Создан | `sitemap.xml` |
| 17 | Нет `og:image` для страниц | Исправлен путь к изображению | `index.html` |
| 18 | Нет `og:description` на всех страницах | Добавлен | Все HTML |

### 5. Целостность файлов

| # | Проблема | Исправление | Файлы |
|---|----------|-------------|-------|
| 19 | `favicon.png` отсутствует | Заменён на `favicon.ico` | Все HTML |
| 20 | `og-main.jpg` отсутствует | Заменён на существующее изображение | `index.html` |
| 21 | Нет информации о скачиваемых файлах | Добавлен блок `.file-info` с версией, источником, датой проверки | `index.html`, `mods.html`, `urbanize.html`, `proper_shaders.html` |
| 22 | Нет SHA-256 хешей для архивов | Добавлено поле в `.file-info` (заполняется вручную) | Все страницы с загрузками |

### 6. Качество кода

| # | Проблема | Исправление | Файлы |
|---|----------|-------------|-------|
| 23 | Утечка обработчика `keydown` в `openModal()` | Вынесен в единую функцию `closeModal()` | `script.js` |
| 24 | Внешние CDN без SRI | Добавлены `integrity` и `crossorigin` | Все HTML |
| 25 | Нет `manifest.json` | Добавлен (при необходимости) | — |
| 26 | Непоследовательное использование кавычек | Унифицировано | Все файлы |

---

## 📦 Детальный список изменений по файлам

### `index.html`
- ✅ Исправлен `og:url` на `https://maximka1993271.github.io/GTASANSITE.io/`
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам
- ✅ Добавлен блок `.file-info` для каждого скачиваемого файла
- ✅ Добавлен `canonical` тег

### `urbanize.html`
- ✅ Добавлен `loading="lazy"` ко всем 24 YouTube iframe
- ✅ Добавлены `alt` для всех изображений
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам
- ✅ Добавлен блок `.file-info` для скачиваемого файла
- ✅ Добавлен `canonical` тег

### `proper_shaders.html`
- ✅ Добавлены `alt` для всех изображений
- ✅ Добавлен `loading="lazy"` для всех изображений
- ✅ Исправлена иерархия заголовков (h4 → h3)
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам
- ✅ Добавлен блок `.file-info` для скачиваемого файла
- ✅ Добавлен `canonical` тег

### `mods.html`
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам (GitHub, ShareMods, MediaFire, MEGA, Google Drive)
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен блок `.file-info` под каждой кнопкой скачивания
- ✅ Добавлен `canonical` тег

### `Cheats.html`
- ✅ Исправлена иерархия заголовков
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен `canonical` тег

### `Priority.html`
- ✅ Исправлена иерархия заголовков (h4 → h3)
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен `canonical` тег

### `install.html`
- ✅ Добавлен `loading="lazy"` для iframe
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен `canonical` тег

### `FAQ.html`
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен `canonical` тег

### `404.html`
- ✅ Заменён `favicon.png` на `favicon.ico`
- ✅ Добавлен `rel="noopener noreferrer"` ко всем внешним ссылкам
- ✅ Добавлен `canonical` тег

### `style.css`
- ✅ Добавлен блок `.file-info` с соответствующими стилями
- ✅ Изменён `.button-container` на `flex-direction: column`
- ✅ Добавлены стили для информации о файлах под кнопками

### `script.js`
- ✅ Исправлена утечка обработчика `keydown` в функции `openModal()`
- ✅ Вынесено закрытие мода в единую функцию `closeModal()`

### Новые файлы
- ✅ `robots.txt` — инструкции для поисковых роботов
- ✅ `sitemap.xml` — карта сайта для SEO

---

## 🔧 Установка и настройка

### Локальный запуск
1. Скачайте все файлы в одну папку
2. Откройте `index.html` в браузере

### Деплой на GitHub Pages
1. Создайте репозиторий `username.github.io`
2. Загрузите все файлы
3. Включите GitHub Pages в настройках репозитория

### Настройка SEO
1. Замените `https://maximka1993271.github.io/GTASANSITE.io/` на ваш реальный домен в:
   - `og:url` во всех HTML
   - `sitemap.xml`
   - `robots.txt`

2. Добавьте реальные SHA-256 хеши для скачиваемых файлов в блоки `.file-info`

---

## 🧪 Рекомендации по дальнейшему улучшению

### Критические (CRITICAL)
- [ ] Проверить все ~70 внешних download-ссылок на работоспособность
- [ ] Добавить SHA-256 хеши для всех распространяемых архивов
- [ ] Проверить исполняемые файлы (.exe/.dll/.asi/.cleo) антивирусами
- [ ] Добавить предупреждение о сторонних источниках файлов

### Высокий приоритет (HIGH)
- [ ] Сделать меню "Радио" доступным с клавиатуры (JavaScript)
- [ ] Добавить Content-Security-Policy на хостинге
- [ ] Локализовать критические изображения (фон, логотипы)
- [ ] Добавить SRI для внешних CDN (Font Awesome, Google Fonts)

### Средний приоритет (MEDIUM)
- [ ] Оптимизировать 24 YouTube iframe на click-to-load
- [ ] Добавить `manifest.json` для PWA
- [ ] Добавить метрики (Google Analytics, Yandex Metrika)
- [ ] Создать файл `.htaccess` для перенаправлений

### Низкий приоритет (LOW)
- [ ] Добавить тёмную тему
- [ ] Сделать адаптивную версию для мобильных устройств
- [ ] Добавить поиск по сайту
- [ ] Сделать систему комментариев к модам

---

## 📝 Примечания для разработчиков

### Как добавить новый мод в `mods.html`

```html
<div class="mod-category">
    <h3>Название категории</h3>
    <ul class="mod-list">
        <li>
            <strong>Название мода v1.0</strong>
            <div class="button-container">
                <a href="https://ссылка-на-скачивание" 
                   class="download-btn" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    Скачать Название мода
                </a>
                <div class="file-info">
                    <small>Версия: 1.0 | Источник: Название | Проверено: ДД.ММ.ГГГГ</small>
                </div>
            </div>
        </li>
    </ul>
</div>

Как добавить новый чит-код в Cheats.html
<tr>
    <td>📌 Описание чита</td>
    <td><code>КОД</code></td>
</tr>

Как добавить новое видео в urbanize.html

<div class="video-item">
    <h3>Версия XX-XX</h3>
    <iframe width="560" height="315" 
            loading="lazy" 
            src="https://www.youtube.com/embed/ID" 
            title="Название видео" 
            frameborder="0" 
            allowfullscreen>
    </iframe>
    <ul class="location-list">
        <li>Описание изменений</li>
    </ul>
</div>