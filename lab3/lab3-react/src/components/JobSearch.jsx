import React, { useState, useEffect } from 'react';

function JobSearch({ onFilterChange, onSortDate }) {
  // Зберігаємо стан фільтрів
  const [filters, setFilters] = useState({
    category: 'all',
    city: 'all',
    salary: 'all'
  });

  // useEffect спрацьовує щоразу, коли змінюються filters. 
  // Він передає нові дані наверх (у головний компонент)
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Функція для оновлення конкретного фільтра
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: 'all', city: 'all', salary: 'all' });
  };

  return (
    <section id="search">
      <h2>Пошук та фільтри</h2>
      {/* У React стилі можна писати прямо в об'єкті, хоча пізніше ми перенесемо їх в CSS */}
      <div className="search-container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
        
        <select name="category" value={filters.category} onChange={handleChange} className="theme-input">
          <option value="all">Всі категорії</option>
          <option value="IT">IT</option>
          <option value="Marketing">Marketing</option>
          <option value="Design">Design</option>
        </select>

        <select name="city" value={filters.city} onChange={handleChange} className="theme-input">
          <option value="all">Всі міста</option>
          <option value="Київ">Київ</option>
          <option value="Львів">Львів</option>
          <option value="Одеса">Одеса</option>
          <option value="Дистанційно">Дистанційно</option>
        </select>

        <select name="salary" value={filters.salary} onChange={handleChange} className="theme-input">
          <option value="all">Будь-яка зарплата</option>
          <option value="40000">Від 40 000 грн</option>
          <option value="60000">Від 60 000 грн</option>
          <option value="80000">Від 80 000 грн</option>
        </select>

        <button onClick={resetFilters} className="apply-btn" style={{ width: 'auto', marginTop: 0 }}>Скинути</button>
        
        {/* Кнопка сортування за датою (твоє завдання за 11 варіантом) */}
        <button onClick={onSortDate} className="theme-btn">📅 Найновіші</button>
      </div>
    </section>
  );
}

export default JobSearch;