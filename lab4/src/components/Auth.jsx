import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Додали інструмент для переходу

function Auth({ user }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Створюємо функцію для перенаправлення

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
      // МАГІЯ ТУТ: Після успішного входу перекидаємо на головну сторінку!
      navigate('/'); 
    } catch (err) {
      setError('Помилка: Неправильний логін/пароль або такий користувач вже існує.');
    }
  };

  // Якщо юзер вже залогінений, йому не треба бачити цю сторінку
  if (user) {
    return (
      <div className="job-card" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Ви вже увійшли в систему як {user.email}</h3>
        <button onClick={() => navigate('/')} className="theme-btn">
          Перейти до вакансій
        </button>
      </div>
    );
  }

  return (
    <div className="job-card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Вхід у систему' : 'Реєстрація'}</h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Ваш Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="theme-input"
          required
        />
        <input 
          type="password" 
          placeholder="Пароль (мінімум 6 символів)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="theme-input"
          required
        />
        <button type="submit" className="theme-btn">
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>
      
      {error && <p style={{ color: '#e74c3c', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
      
      <p 
        style={{ cursor: 'pointer', color: 'var(--accent-color)', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }} 
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Немає акаунту? Створіть його тут' : 'Вже маєте акаунт? Увійдіть'}
      </p>
    </div>
  );
}

export default Auth;