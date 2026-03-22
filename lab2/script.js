// --- 1. ЛОГІКА ТЕМНОЇ ТЕМИ (з 1 лаби) ---
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');


// --- 2. ДАНІ ВАКАНСІЙ (Завдання 1) ---
const vacancies = [
    { title: "Frontend Developer", company: "WebTech Solutions", requirements: "HTML5, CSS3, JavaScript, Git", salary: "55 000", category: "IT" },
    { title: "Java Backend Engineer", company: "FinCore Systems", requirements: "Java 17, Spring Boot, PostgreSQL", salary: "70 000", category: "IT" },
    { title: "Python Data Analyst", company: "DataMind", requirements: "Python, Pandas, SQL", salary: "48 000", category: "IT" },
    { title: "Social Media Manager", company: "PromoGroup", requirements: "SMM, Копірайтинг, Таргет", salary: "30 000", category: "Marketing" },
    { title: "UI/UX Designer", company: "Creative Flow", requirements: "Figma, Adobe XD, Прототипування", salary: "45 000", category: "Design" },
    { title: "Project Manager", company: "Global Deliver", requirements: "Agile, Scrum, English C1", salary: "60 000", category: "IT" }
];

const container = document.getElementById('jobsContainer');

// --- 3. ФУНКЦІЯ ГЕНЕРАЦІЇ КАРТОК ЧЕРЕЗ ЦИКЛ (Завдання 1) ---
function displayJobs(jobsArray) {
    container.innerHTML = ''; // Очищаємо перед новим малюванням

    for (let i = 0; i < jobsArray.length; i++) {
        const job = jobsArray[i];
        
        // Створюємо картку (таку ж, як була в HTML 1 лаби)
        const article = document.createElement('article');
        article.className = 'job-card';
        article.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Компанія:</strong> ${job.company} </p>
            <p><strong>Вимоги:</strong> ${job.requirements} </p>
            <p><strong>Зарплата:</strong> ${job.salary} грн. </p>
            <button class="apply-btn" onclick="applyToJob(this)">Подати заявку</button>
        `;
        container.appendChild(article);
    }
}

// --- 4. ОБРОБКА КЛІКУ ПО КНОПЦІ (Завдання 2) ---
function applyToJob(button) {
    const card = button.parentElement;
    
    // Перевіряємо умову if-else
    if (!card.classList.contains('applied')) {
        card.classList.add('applied');
        button.textContent = 'Подано ✓';
        button.disabled = true; // Вимикаємо кнопку
        alert('Заявку успішно надіслано!');
    }
}

// --- 5. ФІЛЬТРАЦІЯ (Завдання 3) ---
const filterSelect = document.getElementById('categoryFilter');
const resetBtn = document.getElementById('resetFilters');

filterSelect.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    
    if (selectedCategory === 'all') {
        displayJobs(vacancies); // Показуємо всі
    } else {
        const filtered = vacancies.filter(job => job.category === selectedCategory);
        displayJobs(filtered); // Показуємо відфільтровані
    }
});

resetBtn.addEventListener('click', () => {
    filterSelect.value = 'all'; // Скидаємо селект
    displayJobs(vacancies);     // Малюємо всі вакансії
});

// Запускаємо генерацію при завантаженні сторінки
displayJobs(vacancies);