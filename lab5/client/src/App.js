import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; 

import JobsView from './components/JobsView';
import UserProfile from './components/UserProfile';
import Auth from './components/Auth'; 

function App() {
  const [user, setUser] = useState(null); 
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    // Перевіряємо, чи є збережений JWT токен у браузері
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedToken && savedEmail) {
      setUser({ email: savedEmail, token: savedToken });
    }

    const savedTheme = localStorage.getItem('themeReact');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }

    const handleScroll = () => setShowScrollBtn(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userEmail', userData.email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.body.classList.toggle('dark-theme', newTheme);
    localStorage.setItem('themeReact', newTheme ? 'dark' : 'light');
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Router>
      <div id="app-wrapper">
        <header style={{ backgroundColor: 'var(--header-bg)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>JobFinder</h1>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <Link to="/" style={{ color: 'var(--nav-link)', textDecoration: 'none', fontWeight: 'bold' }}>Вакансії</Link>
            <button onClick={toggleTheme} className="theme-btn" style={{ borderRadius: '25px', padding: '5px 15px', fontSize: '12px' }}>
              {isDarkTheme ? 'Світла' : 'Темна'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!user ? (
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Увійти</span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#555', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>👤</div>
                </Link>
              ) : (
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-color)' }}>
                    <img src="https://st2.depositphotos.com/1594920/8612/i/450/depositphotos_86121648-stock-photo-close-up-of-mixed-breed.jpg" alt="Профіль" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px', minHeight: '60vh' }}>
          <Routes>
            <Route path="/" element={<JobsView user={user} />} />
            <Route path="/profile" element={<UserProfile user={user} onLogout={handleLogout} />} />
            <Route path="/login" element={<Auth user={user} onLoginSuccess={handleLoginSuccess} />} />
          </Routes>
        </main>
        <footer style={{ backgroundColor: 'var(--footer-bg)', color: 'white', textAlign: 'center', padding: '40px 20px', marginTop: '60px' }}>
          <p>© 2026 JobFinder Platform</p>
        </footer>
        <button className={`scroll-top-btn ${showScrollBtn ? 'show' : ''}`} onClick={scrollToTop}>↑</button>
      </div>
    </Router>
  );
}

export default App;