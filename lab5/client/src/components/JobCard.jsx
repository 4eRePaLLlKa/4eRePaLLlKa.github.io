import React, { useState } from 'react';

function JobCard({ job, onApply }) {
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    setIsApplied(true);
    onApply(job.title);
  };

  return (
    <article className={`job-card ${isApplied ? 'applied' : ''}`}>
      <h3>{job.title}</h3>
      
      <p className="date-text">📅 <strong>Опубліковано:</strong> {job.date}</p>
      
      <p><strong>Компанія:</strong> {job.company} | <strong>Місто:</strong> {job.city}</p>
      <p><strong>Категорія:</strong> {job.category}</p>
      <p><strong>Вимоги:</strong> {job.requirements}</p>
      <p><strong>Зарплата:</strong> {job.salaryStr} грн.</p>
      
      <button 
        className="apply-btn" 
        disabled={isApplied} 
        onClick={handleApply}
      >
        {isApplied ? 'Подано ✓' : 'Подати заявку'}
      </button>
    </article>
  );
}

export default JobCard;