import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JobSearch from './JobSearch';

function JobsView({ user }) {
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'all', city: 'all', salary: 'all' });
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Отримання вакансій з нашого власного Node.js сервера
  useEffect(() => {
    fetch('http://localhost:5000/api/vacancies')
      .then(res => res.json())
      .then(data => {
        setVacancies(data);
        setIsLoading(false);
      })
      .catch(err => console.error("Помилка завантаження вакансій:", err));
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000);
  };

  const sortByDate = () => {
    const sorted = [...vacancies].sort((a, b) => new Date(b.date) - new Date(a.date));
    setVacancies(sorted);
    showToast('Вакансії відсортовано за датою!');
  };

  // Подача заявки через наш сервер з валідацією (Варіант 11)
  const handleApply = async (jobId, jobTitle) => {
    if (!user) {
      showToast('Помилка: Необхідно увійти в акаунт, щоб подати заявку!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          vacancyId: jobId
        })
      });

      const result = await response.json();

      if (response.ok) {
        showToast(`Успіх: ${result.message}`);
      } else {
        showToast(`Увага: ${result.message}`); // Тут виведеться "Ви вже подавали заявку..."
      }
    } catch (err) {
      showToast('Помилка з’єднання з сервером');
    }
  };

  const filteredVacancies = vacancies.filter(job => {
    const matchCategory = filters.category === 'all' || job.category === filters.category;
    const matchCity = filters.city === 'all' || job.city === filters.city;
    const matchSalary = filters.salary === 'all' || job.salaryVal >= parseInt(filters.salary);
    return matchCategory && matchCity && matchSalary;
  });

  return (
    <div>
      <JobSearch onFilterChange={setFilters} onSortDate={sortByDate} />
      
      <section id="jobs">
        <h2>Доступні вакансії ({filteredVacancies.length})</h2>
        
        {isLoading ? (
          <p style={{ textAlign: 'center', fontSize: '18px' }}>Завантаження вакансій з PostgreSQL... ⏳</p>
        ) : (
          <div className="jobs-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            {filteredVacancies.map(job => (
              <JobCard key={job.id} job={job} onApply={() => handleApply(job.id, job.title)} />
            ))}
          </div>
        )}
      </section>
      
      <div className={`toast ${isToastVisible ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}

export default JobsView;