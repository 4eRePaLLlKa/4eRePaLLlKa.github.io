import React, { useState } from 'react';
import JobCard from './JobCard';
import JobSearch from './JobSearch';

function JobsView() {
  const [vacancies, setVacancies] = useState([
    { title: "Frontend Developer", company: "WebTech Solutions", requirements: "HTML5, CSS3, React, Git", salaryStr: "65 000", salaryVal: 65000, category: "IT", city: "Київ", date: "2026-03-31" },
    { title: "Java Backend Engineer", company: "FinCore Systems", requirements: "Java 17, Spring Boot, PostgreSQL", salaryStr: "80 000", salaryVal: 80000, category: "IT", city: "Львів", date: "2026-03-25" },
    { title: "Python Data Scientist", company: "DataMind", requirements: "Python, Pandas, Machine Learning", salaryStr: "90 000", salaryVal: 90000, category: "IT", city: "Дистанційно", date: "2026-03-30" },
    { title: "Social Media Manager", company: "PromoGroup", requirements: "SMM, Копірайтинг, Таргет", salaryStr: "30 000", salaryVal: 30000, category: "Marketing", city: "Одеса", date: "2026-03-20" },
    { title: "UI/UX Designer", company: "Creative Flow", requirements: "Figma, Adobe XD, Прототипування", salaryStr: "45 000", salaryVal: 45000, category: "Design", city: "Київ", date: "2026-03-28" },
    { title: "C++ Game Developer", company: "Lviv Games", requirements: "C++, OOP, Game Logic", salaryStr: "75 000", salaryVal: 75000, category: "IT", city: "Львів", date: "2026-04-15" },
    { title: "Vue.js Frontend Developer", company: "TechStack", requirements: "Vue 3, JavaScript, HTML/CSS", salaryStr: "55 000", salaryVal: 55000, category: "IT", city: "Київ", date: "2026-05-01" }
  ]);

  const [filters, setFilters] = useState({ category: 'all', city: 'all', salary: 'all' });
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000);
  };

  const sortByDate = () => {
    // У React ми обов'язково робимо копію масиву перед сортуванням
    const sorted = [...vacancies].sort((a, b) => new Date(b.date) - new Date(a.date));
    setVacancies(sorted);
    showToast('Вакансії відсортовано за датою (від нових)!');
  };

  const handleApply = (jobTitle) => {
    showToast(`Ви успішно подалися на: ${jobTitle}!`);
  };

  // Фільтруємо вакансії перед відображенням
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
        <h2>Доступні вакансії</h2>
        <div className="jobs-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {filteredVacancies.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>На жаль, вакансій не знайдено.</p>
          )}
          {/* У React ми використовуємо map замість v-for */}
          {filteredVacancies.map(job => (
            <JobCard key={job.title} job={job} onApply={handleApply} />
          ))}
        </div>
      </section>
      
      <div className={`toast ${isToastVisible ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}

export default JobsView;