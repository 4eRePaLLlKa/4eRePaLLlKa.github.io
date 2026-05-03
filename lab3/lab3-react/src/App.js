import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Підключаємо наші стилі

import JobsView from './components/JobsView';
import UserProfile from './components/UserProfile';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Перевірка теми та скролу при завантаженні
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeReact');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }

    const handleScroll = () => setShowScrollBtn(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    if (newTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('themeReact', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('themeReact', 'light');
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    // Router огортає весь додаток для роботи посилань
    <Router>
      <div id="app-wrapper">
        <header style={{ backgroundColor: 'var(--header-bg)', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
          <h1>JobFinder (React)</h1>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '10px' }}>
              <li>
                <Link to="/" style={{ color: 'var(--nav-link)', textDecoration: 'none', fontWeight: 'bold' }}>Вакансії та Пошук</Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: 'var(--nav-link)', textDecoration: 'none', fontWeight: 'bold' }}>Мій профіль</Link>
              </li>
            </ul>
          </nav>
          <button onClick={toggleTheme} className="theme-btn" style={{ borderRadius: '25px' }}>
            {isDarkTheme ? 'Світла тема' : 'Темна тема'}
          </button>
        </header>

        <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px', minHeight: '50vh' }}>
          {/* ТУТ МІНЯЮТЬСЯ СТОРІНКИ */}
          <Routes>
            <Route path="/" element={<JobsView />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>

        <footer style={{ backgroundColor: 'var(--footer-bg)', color: 'white', textAlign: 'center', padding: '40px 20px', marginTop: '60px' }}>
          <p>© 2026 JobFinder Platform — Твій шлях до успіху (React Версія)</p>
        </footer>

        <button 
          className={`scroll-top-btn ${showScrollBtn ? 'show' : ''}`} 
          onClick={scrollToTop}
        >
          ↑
        </button>
      </div>
    </Router>
  );
}

export default App;