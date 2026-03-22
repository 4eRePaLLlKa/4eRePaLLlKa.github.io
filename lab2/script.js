// --- 1. ТЕМА ---
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');
}

// --- 2. ДАНІ ВАКАНСІЙ ---
const vacancies = [
    { title: "Frontend Developer", company: "WebTech Solutions", requirements: "HTML5, CSS3, React, Git", salaryStr: "65 000", salaryVal: 65000, category: "IT", city: "Київ" },
    { title: "Java Backend Engineer", company: "FinCore Systems", requirements: "Java 17, Spring Boot, PostgreSQL", salaryStr: "80 000", salaryVal: 80000, category: "IT", city: "Львів" },
    { title: "Python Data Scientist", company: "DataMind", requirements: "Python, Pandas, Machine Learning", salaryStr: "90 000", salaryVal: 90000, category: "IT", city: "Дистанційно" },
    { title: "Social Media Manager", company: "PromoGroup", requirements: "SMM, Копірайтинг, Таргет", salaryStr: "30 000", salaryVal: 30000, category: "Marketing", city: "Одеса" },
    { title: "UI/UX Designer", company: "Creative Flow", requirements: "Figma, Adobe XD, Прототипування", salaryStr: "45 000", salaryVal: 45000, category: "Design", city: "Київ" },
    { title: "Project Manager", company: "Global Deliver", requirements: "Agile, Scrum, English C1", salaryStr: "60 000", salaryVal: 60000, category: "IT", city: "Львів" },
    { title: "SEO Спеціаліст", company: "TopRank", requirements: "Google Analytics, Ahrefs, Оптимізація", salaryStr: "35 000", salaryVal: 35000, category: "Marketing", city: "Дистанційно" },
    { title: "QA Automation (C++)", company: "Unreal Games Lab", requirements: "C++, GTest, Розуміння ООП", salaryStr: "55 000", salaryVal: 55000, category: "IT", city: "Київ" },
    { title: "HR Generalist", company: "People First", requirements: "Рекрутинг, Онбординг, Комунікабельність", salaryStr: "32 000", salaryVal: 32000, category: "Marketing", city: "Дистанційно" },
    { title: "Graphic Designer", company: "ArtSpace", requirements: "Photoshop, Illustrator, Креативність", salaryStr: "28 000", salaryVal: 28000, category: "Design", city: "Львів" }
];

const container = document.getElementById('jobsContainer');

// --- 3. ГЕНЕРАЦІЯ КАРТОК ---
function displayJobs(jobsArray) {
    container.innerHTML = ''; 

    if (jobsArray.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">На жаль, за вашими критеріями вакансій не знайдено.</p>';
        return;
    }

    for (let i = 0; i < jobsArray.length; i++) {
        const job = jobsArray[i];
        
        const article = document.createElement('article');
        article.className = 'job-card';
        article.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Компанія:</strong> ${job.company} | <strong>Місто:</strong> ${job.city}</p>
            <p><strong>Категорія:</strong> ${job.category}</p>
            <p><strong>Вимоги:</strong> ${job.requirements} </p>
            <p><strong>Зарплата:</strong> ${job.salaryStr} грн. </p>
            <button class="apply-btn" onclick="applyToJob(this, '${job.title}')">Подати заявку</button>
        `;
        container.appendChild(article);
    }
}

// --- 4. TOAST СПОВІЩЕННЯ ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show'); 
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); 
}

// --- 5. ОБРОБКА ПОДАЧІ ЗАЯВКИ ---
function applyToJob(button, jobTitle) {
    const card = button.parentElement;
    
    if (!card.classList.contains('applied')) {
        card.classList.add('applied');
        button.textContent = 'Подано ✓';
        button.disabled = true; 
        showToast(`Ви успішно подалися на: ${jobTitle}!`);
    }
}

// --- 6. ФІЛЬТРАЦІЯ ---
const catFilter = document.getElementById('categoryFilter');
const cityFilter = document.getElementById('cityFilter');
const salFilter = document.getElementById('salaryFilter');
const resetBtn = document.getElementById('resetFilters');

function filterJobs() {
    const catVal = catFilter.value;
    const cityVal = cityFilter.value;
    const salVal = salFilter.value;

    const filtered = vacancies.filter(job => {
        const matchCategory = catVal === 'all' || job.category === catVal;
        const matchCity = cityVal === 'all' || job.city === cityVal;
        const matchSalary = salVal === 'all' || job.salaryVal >= parseInt(salVal);
        return matchCategory && matchCity && matchSalary;
    });

    displayJobs(filtered);
}

catFilter.addEventListener('change', filterJobs);
cityFilter.addEventListener('change', filterJobs);
salFilter.addEventListener('change', filterJobs);

resetBtn.addEventListener('click', () => {
    catFilter.value = 'all'; 
    cityFilter.value = 'all'; 
    salFilter.value = 'all'; 
    displayJobs(vacancies);     
});

// --- 7. КНОПКА "ВГОРУ" (ОНОВЛЕНО ЛОГІКУ) ---
const scrollTopBtn = document.getElementById("scrollTopBtn");
const footer = document.querySelector('footer');

// Налаштування позиціонування
const standardFixedBottom = 80; // Відступ знизу, коли кнопка "плаває" над контентом
const gapAboveFooter = 20;     // Мінімальний зазор між кнопкою та початком футера

function handleScrollEffects() {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const footerRect = footer.getBoundingClientRect(); // Вимірюємо положення футера відносно вікна

    // 7а. Поява кнопки при прокручуванні вниз (поріг 300px)
    if (scrollPos > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }

    // 7б. Динамічне позиціонування над Футером
    // footerRect.top — це відстань від верхньої межі вікна до початку футера.
    // Якщо ця відстань менша за висоту вікна, значить футер вже з'явився знизу.
    if (footerRect.top < windowHeight) {
        // Футер ВИДИМИЙ у вікні.
        const visibleFooterHeight = windowHeight - footerRect.top;
        // Розраховуємо новий bottom: видима частина футера + зазор
        scrollTopBtn.style.bottom = (visibleFooterHeight + gapAboveFooter) + 'px';
    } else {
        // Футер ще не з'явився (або занадто далеко). Стандартна позиція.
        scrollTopBtn.style.bottom = standardFixedBottom + 'px';
    }
}

// Слухаємо подію скролу
window.addEventListener('scroll', handleScrollEffects);

// Перший запуск (на випадок завантаження сторінки вже прокрученою)
handleScrollEffects();

// Плавний скрол нагору при кліку
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Запуск при завантаженні
displayJobs(vacancies);