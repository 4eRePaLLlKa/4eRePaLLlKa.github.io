import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth({ onLoginSuccess, user }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? 'login' : 'register';

    try {
      const response = await fetch(`https://jobfinder-backend-os67.onrender.com/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        // Передаємо успішні дані в App.js
        onLoginSuccess({ email: result.email, token: result.token });
        navigate('/');
      } else {
        setError(result.message || 'Помилка авторизації');
      }
    } catch (err) {
      setError('Не вдалося з’єднатися з сервером');
    }
  };

  if (user) {
    return (
      <div className="job-card" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Ви вже увійшли в систему як {user.email}</h3>
        <button onClick={() => navigate('/')} className="theme-btn">Перейти до вакансій</button>
      </div>
    );
  }

  return (
    <div className="job-card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Вхід (JWT)' : 'Реєстрація (JWT)'}</h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Ваш Email" value={email} onChange={(e) => setEmail(e.target.value)} className="theme-input" required />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="theme-input" required />
        <button type="submit" className="theme-btn">{isLogin ? 'Увійти' : 'Зареєструватися'}</button>
      </form>
      {error && <p style={{ color: '#e74c3c', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
      <p style={{ cursor: 'pointer', color: 'var(--accent-color)', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Немає акаунту? Створіть його тут' : 'Вже маєте акаунт? Увійдіть'}
      </p>
    </div>
  );
}

export default Auth;