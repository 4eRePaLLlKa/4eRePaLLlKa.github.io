// 1. Масив вакансій (Дані з "бази") [cite: 387]
const vacancies = [
    { id: 1, title: "Frontend Developer", category: "IT", city: "Київ", salary: "55 000" },
    { id: 2, title: "Java Engineer", category: "IT", city: "Львів", salary: "70 000" },
    { id: 3, title: "Social Media Manager", category: "Marketing", city: "Одеса", salary: "30 000" },
    { id: 4, title: "UI/UX Designer", category: "Design", city: "Дистанційно", salary: "45 000" }
];

const container = document.getElementById('jobsContainer');

// 2. Функція для виводу вакансій (Завдання 1: використання циклу for) [cite: 259, 282]
function displayJobs(data) {
    container.innerHTML = ''; // Очищуємо контейнер перед виводом [cite: 88]

    for (let i = 0; i < data.length; i++) {
        const job = data[i];
        
        // Створюємо елемент картки [cite: 107]
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Категорія:</strong> ${job.category}</p>
            <p><strong>Місто:</strong> ${job.city}</p>
            <p><strong>Зарплата:</strong> ${job.salary} грн</p>
            <button class="apply-btn" onclick="applyToJob(this)">Подати заявку</button>
        `;
        container.appendChild(card); // Додаємо в DOM [cite: 108]
    }
}

// 3. Функція подачі заявки (Завдання 2: обробка подій та умови) [cite: 266, 289]
function applyToJob(button) {
    const card = button.parentElement;
    
    // Умовна логіка if-else (Завдання 2) [cite: 270]
    if (!card.classList.contains('applied')) {
        card.classList.add('applied');
        button.textContent = 'Подано ✓';
        button.disabled = true;
        alert('Ви успішно подали заявку на вакансію!'); // Повідомлення про успіх [cite: 388]
    }
}

// 4. Фільтрація (Завдання 3) [cite: 389]
document.getElementById('categoryFilter').addEventListener('change', (e) => {
    const selected = e.target.value;
    
    if (selected === 'all') {
        displayJobs(vacancies);
    } else {
        // Фільтруємо масив
        const filtered = vacancies.filter(job => job.category === selected);
        displayJobs(filtered);
    }
});

// Скидання фільтрів
document.getElementById('resetFilters').onclick = () => {
    document.getElementById('categoryFilter').value = 'all';
    displayJobs(vacancies);
};

// Початковий виклик функції для відображення всіх вакансій [cite: 162]
displayJobs(vacancies);