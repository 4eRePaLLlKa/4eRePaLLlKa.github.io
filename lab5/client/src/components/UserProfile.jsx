import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile({ user, onLogout }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [applications, setApplications] = useState([]); 
  
  // Початковий чистий стан профілю
  const [profileData, setProfileData] = useState({
    name: "",
    skills: "",
    experience: "",
    avatar: "https://st2.depositphotos.com/1594920/8612/i/450/depositphotos_86121648-stock-photo-close-up-of-mixed-breed.jpg"
  });

  // Завантажуємо дані профілю та історію заявок безпосередньо з нашого Node.js сервера
  useEffect(() => {
    if (user && user.email) {
      // 1. Завантажуємо текстові дані профілю з бази
      fetch(`http://localhost:5000/api/profile?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setProfileData(prev => ({
            ...prev,
            name: data.name || "",
            skills: data.skills || "",
            experience: data.experience || ""
          }));
        })
        .catch(err => console.error("Помилка завантаження профілю:", err));

      // 2. Завантажуємо історію заявок
      fetch(`http://localhost:5000/api/applications?email=${user.email}`)
        .then(res => res.json())
        .then(data => setApplications(data))
        .catch(err => console.error("Помилка завантаження заявок:", err));
    }
  }, [user]);

  const handleLogout = () => {
    onLogout(); 
    navigate('/'); 
  };

  const toggleEdit = async () => {
    if (isEditing) {
      // Коли тиснемо "Зберегти" — відправляємо оновлені дані на сервер в PostgreSQL
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: profileData.name,
            skills: profileData.skills,
            experience: profileData.experience
          })
        });
        if (response.ok) {
          alert('Зміни успішно збережено в базі даних PostgreSQL!');
        }
      } catch (err) {
        console.error("Помилка збереження профілю:", err);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="job-card" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Ви не авторизовані</h2>
        <p>Для перегляду профілю, будь ласка, увійдіть у свій акаунт.</p>
        <button onClick={() => navigate('/login')} className="theme-btn" style={{ marginTop: '20px' }}>
          Увійти в акаунт
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Картка профілю */}
      <div className="job-card">
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img src={profileData.avatar} alt="Фото" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-color)' }} />
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Мій профіль ({user.email})</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={toggleEdit} className="theme-btn" style={{ fontSize: '13px' }}>
                  {isEditing ? '💾 Зберегти' : '✏️ Редагувати'}
                </button>
                <button onClick={handleLogout} className="theme-btn" style={{ backgroundColor: '#e74c3c', fontSize: '13px' }}>
                  Вийти
                </button>
              </div>
            </div>

            {!isEditing ? (
              <div>
                <p><strong>Ім'я:</strong> {profileData.name || <span style={{color: '#888', fontStyle: 'italic'}}>Не вказано</span>}</p>
                <p><strong>Навички:</strong> {profileData.skills || <span style={{color: '#888', fontStyle: 'italic'}}>Не вказано</span>}</p>
                <p><strong>Досвід:</strong> {profileData.experience || <span style={{color: '#888', fontStyle: 'italic'}}>Не вказано</span>}</p>
              </div>
            ) : (
              <div className="edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>Ім'я:</label>
                <input name="name" value={profileData.name} onChange={handleChange} className="theme-input" placeholder="Введіть ваше ім'я" />
                <label>Навички:</label>
                <input name="skills" value={profileData.skills} onChange={handleChange} className="theme-input" placeholder="Перерахуйте ваші скіли" />
                <label>Досвід:</label>
                <textarea name="experience" value={profileData.experience} onChange={handleChange} className="theme-input" rows="3" placeholder="Розкажіть про свій досвід розробки"></textarea>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ІСТОРІЯ ЗАЯВОК */}
      <div className="job-card">
        <h3>Історія моїх заявок на вакансії ({applications.length})</h3>
        {applications.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>Ви ще не подавали заявок на вакансії.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {applications.map(app => (
              <div key={app.id} style={{ padding: '15px', borderLeft: '4px solid var(--accent-color)', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{app.title}</h4>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#888' }}>Компанія: {app.company} | Місто: {app.city}</p>
                <span style={{ fontSize: '12px', color: '#aaa' }}>Дата подачі: {new Date(app.appliedAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;