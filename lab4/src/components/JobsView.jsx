import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Підключаємо базу
import JobCard from './JobCard';
import JobSearch from './JobSearch';

// Масив на 40 вакансій для початкового заповнення бази
const initialVacancies = [
  { title: "Frontend Developer (React)", company: "WebTech Solutions", requirements: "React, JS, CSS", salaryStr: "65 000", salaryVal: 65000, category: "IT", city: "Київ", date: "2026-05-10" },
  { title: "Java Backend Engineer", company: "FinCore Systems", requirements: "Java 17, Spring Boot", salaryStr: "80 000", salaryVal: 80000, category: "IT", city: "Львів", date: "2026-05-09" },
  { title: "UI/UX Designer", company: "Creative Flow", requirements: "Figma, UX Research", salaryStr: "45 000", salaryVal: 45000, category: "Design", city: "Київ", date: "2026-05-08" },
  { title: "Python Data Scientist", company: "DataMind", requirements: "Python, Machine Learning", salaryStr: "90 000", salaryVal: 90000, category: "IT", city: "Дистанційно", date: "2026-05-07" },
  { title: "SMM Specialist", company: "PromoGroup", requirements: "SMM, Copywriting", salaryStr: "30 000", salaryVal: 30000, category: "Marketing", city: "Одеса", date: "2026-05-06" },
  { title: "C++ Game Developer", company: "Lviv Games", requirements: "C++, Unreal Engine", salaryStr: "75 000", salaryVal: 75000, category: "IT", city: "Львів", date: "2026-05-05" },
  { title: "Vue.js Developer", company: "TechStack", requirements: "Vue 3, JS", salaryStr: "55 000", salaryVal: 55000, category: "IT", city: "Київ", date: "2026-05-04" },
  { title: "SEO Specialist", company: "TopRank", requirements: "SEO, Ahrefs, Google Analytics", salaryStr: "35 000", salaryVal: 35000, category: "Marketing", city: "Дистанційно", date: "2026-05-03" },
  { title: "Graphic Designer", company: "ArtVision", requirements: "Photoshop, Illustrator", salaryStr: "40 000", salaryVal: 40000, category: "Design", city: "Одеса", date: "2026-05-02" },
  { title: "DevOps Engineer", company: "CloudNet", requirements: "Docker, Kubernetes, AWS", salaryStr: "100 000", salaryVal: 100000, category: "IT", city: "Київ", date: "2026-05-01" },
  { title: "Junior QA Engineer", company: "BugHunters", requirements: "Manual Testing, Postman", salaryStr: "25 000", salaryVal: 25000, category: "IT", city: "Львів", date: "2026-04-30" },
  { title: "Marketing Manager", company: "BrandBoost", requirements: "Marketing Strategy, B2B", salaryStr: "60 000", salaryVal: 60000, category: "Marketing", city: "Київ", date: "2026-04-29" },
  { title: "Product Designer", company: "InnovateApp", requirements: "Figma, Prototyping", salaryStr: "70 000", salaryVal: 70000, category: "Design", city: "Дистанційно", date: "2026-04-28" },
  { title: "Fullstack Developer", company: "WebTech Solutions", requirements: "Node.js, React", salaryStr: "85 000", salaryVal: 85000, category: "IT", city: "Одеса", date: "2026-04-27" },
  { title: "Copywriter", company: "TextPro", requirements: "Writing, SEO optimization", salaryStr: "20 000", salaryVal: 20000, category: "Marketing", city: "Львів", date: "2026-04-26" },
  { title: "Android Developer", company: "MobileSoft", requirements: "Kotlin, Android SDK", salaryStr: "75 000", salaryVal: 75000, category: "IT", city: "Київ", date: "2026-04-25" },
  { title: "iOS Developer", company: "MobileSoft", requirements: "Swift, Xcode", salaryStr: "75 000", salaryVal: 75000, category: "IT", city: "Київ", date: "2026-04-24" },
  { title: "Email Marketer", company: "MailSense", requirements: "Mailchimp, CRM", salaryStr: "30 000", salaryVal: 30000, category: "Marketing", city: "Дистанційно", date: "2026-04-23" },
  { title: "Motion Designer", company: "VideoArt", requirements: "After Effects, Premiere", salaryStr: "50 000", salaryVal: 50000, category: "Design", city: "Львів", date: "2026-04-22" },
  { title: "Data Analyst", company: "FinCore Systems", requirements: "SQL, Tableau", salaryStr: "60 000", salaryVal: 60000, category: "IT", city: "Київ", date: "2026-04-21" },
  { title: "Targetologist", company: "AdStars", requirements: "FB Ads, Google Ads", salaryStr: "45 000", salaryVal: 45000, category: "Marketing", city: "Одеса", date: "2026-04-20" },
  { title: "3D Artist", company: "Lviv Games", requirements: "Blender, Maya", salaryStr: "65 000", salaryVal: 65000, category: "Design", city: "Львів", date: "2026-04-19" },
  { title: "PHP Developer", company: "OldSchool Web", requirements: "PHP, Laravel", salaryStr: "50 000", salaryVal: 50000, category: "IT", city: "Дистанційно", date: "2026-04-18" },
  { title: "PR Manager", company: "Publica", requirements: "PR Strategy, Media relations", salaryStr: "55 000", salaryVal: 55000, category: "Marketing", city: "Київ", date: "2026-04-17" },
  { title: "UX Writer", company: "Creative Flow", requirements: "Microcopy, UX", salaryStr: "40 000", salaryVal: 40000, category: "Design", city: "Київ", date: "2026-04-16" },
  { title: "System Administrator", company: "TechStack", requirements: "Linux, Networks", salaryStr: "45 000", salaryVal: 45000, category: "IT", city: "Одеса", date: "2026-04-15" },
  { title: "Content Manager", company: "PromoGroup", requirements: "CMS, Copywriting", salaryStr: "25 000", salaryVal: 25000, category: "Marketing", city: "Львів", date: "2026-04-14" },
  { title: "Web Designer", company: "ArtVision", requirements: "Figma, Tilda", salaryStr: "35 000", salaryVal: 35000, category: "Design", city: "Дистанційно", date: "2026-04-13" },
  { title: "Ruby on Rails Developer", company: "RubyTech", requirements: "Ruby, PostgreSQL", salaryStr: "80 000", salaryVal: 80000, category: "IT", city: "Київ", date: "2026-04-12" },
  { title: "PPC Specialist", company: "TopRank", requirements: "Google Ads, Analytics", salaryStr: "40 000", salaryVal: 40000, category: "Marketing", city: "Одеса", date: "2026-04-11" },
  { title: "Illustrator", company: "DesignHub", requirements: "Digital Art, Illustrator", salaryStr: "30 000", salaryVal: 30000, category: "Design", city: "Львів", date: "2026-04-10" },
  { title: "Cybersecurity Analyst", company: "SafeNet", requirements: "Security Audits, Network", salaryStr: "95 000", salaryVal: 95000, category: "IT", city: "Київ", date: "2026-04-09" },
  { title: "Brand Manager", company: "BrandBoost", requirements: "Branding, Strategy", salaryStr: "65 000", salaryVal: 65000, category: "Marketing", city: "Дистанційно", date: "2026-04-08" },
  { title: "Art Director", company: "Creative Flow", requirements: "Leadership, Design Vision", salaryStr: "110 000", salaryVal: 110000, category: "Design", city: "Київ", date: "2026-04-07" },
  { title: "Game Designer", company: "Lviv Games", requirements: "Game Mechanics, Balance", salaryStr: "70 000", salaryVal: 70000, category: "IT", city: "Львів", date: "2026-04-06" },
  { title: "Event Manager", company: "PromoGroup", requirements: "Organization, B2B Events", salaryStr: "35 000", salaryVal: 35000, category: "Marketing", city: "Одеса", date: "2026-04-05" },
  { title: "Sound Designer", company: "VideoArt", requirements: "Audio editing, Foley", salaryStr: "45 000", salaryVal: 45000, category: "Design", city: "Дистанційно", date: "2026-04-04" },
  { title: "Blockchain Developer", company: "CryptoCore", requirements: "Solidity, Web3", salaryStr: "120 000", salaryVal: 120000, category: "IT", city: "Київ", date: "2026-04-03" },
  { title: "Affiliate Manager", company: "AdStars", requirements: "CPA networks, Negotiations", salaryStr: "50 000", salaryVal: 50000, category: "Marketing", city: "Львів", date: "2026-04-02" },
  { title: "Animator", company: "DesignHub", requirements: "Spine 2D, After Effects", salaryStr: "55 000", salaryVal: 55000, category: "Design", city: "Київ", date: "2026-04-01" }
];

function JobsView() {
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Стан завантаження
  const [filters, setFilters] = useState({ category: 'all', city: 'all', salary: 'all' });
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // 1. ЗАВАНТАЖЕННЯ ДАНИХ З ХМАРИ ПРИ ВІДКРИТТІ СТОРІНКИ
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vacancies"));
        const jobsFromDB = [];
        querySnapshot.forEach((doc) => {
          jobsFromDB.push({ id: doc.id, ...doc.data() });
        });
        setVacancies(jobsFromDB);
      } catch (error) {
        console.error("Помилка завантаження вакансій:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  // 2. ФУНКЦІЯ ДЛЯ ОДНОРАЗОВОГО ЗАВАНТАЖЕННЯ 40 ВАКАНСІЙ У БАЗУ
  const seedDatabase = async () => {
    setIsLoading(true);
    try {
      const vacanciesCollection = collection(db, "vacancies");
      for (const job of initialVacancies) {
        await addDoc(vacanciesCollection, job);
      }
      alert("Успіх! 40 вакансій додано у Firebase. Оновіть сторінку.");
    } catch (error) {
      alert("Помилка при додаванні: " + error.message);
    }
    setIsLoading(false);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000);
  };

  const sortByDate = () => {
    const sorted = [...vacancies].sort((a, b) => new Date(b.date) - new Date(a.date));
    setVacancies(sorted);
    showToast('Вакансії відсортовано за датою (від нових)!');
  };

  const handleApply = (jobTitle) => {
    showToast(`Ви успішно подалися на: ${jobTitle}!`);
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
      
      {/* КНОПКА ДЛЯ ЗАПОВНЕННЯ БАЗИ (Показуємо тільки якщо база порожня) */}
      {!isLoading && vacancies.length === 0 && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p>База даних наразі порожня.</p>
          <button onClick={seedDatabase} className="theme-btn" style={{ backgroundColor: '#27ae60' }}>
            🚀 Завантажити 40 вакансій у хмару Firebase
          </button>
        </div>
      )}

      <section id="jobs">
        <h2>Доступні вакансії ({filteredVacancies.length})</h2>
        
        {isLoading ? (
          <p style={{ textAlign: 'center', fontSize: '18px' }}>Завантаження даних з бази... ⏳</p>
        ) : (
          <div className="jobs-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            {filteredVacancies.length === 0 && vacancies.length > 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>За вашими фільтрами нічого не знайдено.</p>
            )}
            {filteredVacancies.map(job => (
              <JobCard key={job.id || job.title} job={job} onApply={handleApply} />
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