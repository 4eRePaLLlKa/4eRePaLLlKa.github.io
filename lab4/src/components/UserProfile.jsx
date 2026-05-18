import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // ДОДАЛИ db (базу даних)
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Інструменти для роботи з базою

function UserProfile({ user }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Стан завантаження даних
  
  // Порожній шаблон для нових користувачів
  const defaultProfile = {
    name: "",
    skills: "",
    experience: "",
    avatar: "https://st2.depositphotos.com/1594920/8612/i/450/depositphotos_86121648-stock-photo-close-up-of-mixed-breed.jpg"
  };

  const [profileData, setProfileData] = useState(defaultProfile);

  // ЗАВАНТАЖЕННЯ ДАНИХ З ХМАРИ
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        // Шукаємо документ у колекції "users", який має ім'я як ID нашого юзера
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Якщо такий профіль вже є в базі - завантажуємо його
          setProfileData(docSnap.data());
        } else {
          // Якщо це новий акаунт - даємо порожні поля
          setProfileData(defaultProfile);
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // ЗБЕРЕЖЕННЯ ДАНИХ У ХМАРУ
  const toggleEdit = async () => {
    if (isEditing) {
      // Коли тиснемо "Зберегти", відправляємо об'єкт profileData у Firestore
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profileData);
      alert('Профіль успішно збережено у хмарі!');
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
        <p>Для перегляду та редагування профілю, будь ласка, увійдіть у свій акаунт.</p>
        <button onClick={() => navigate('/login')} className="theme-btn" style={{ marginTop: '20px' }}>
          Увійти в акаунт
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження профілю з бази... ⏳</div>;
  }

  return (
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
              <p><strong>Ім'я:</strong> {profileData.name || <span style={{color: '#888'}}>Не вказано</span>}</p>
              <p><strong>Навички:</strong> {profileData.skills || <span style={{color: '#888'}}>Не вказано</span>}</p>
              <p><strong>Досвід:</strong> {profileData.experience || <span style={{color: '#888'}}>Не вказано</span>}</p>
            </div>
          ) : (
            <div className="edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>Ім'я:</label>
              <input name="name" value={profileData.name} onChange={handleChange} className="theme-input" placeholder="Введіть ваше ім'я" />
              <label>Навички:</label>
              <input name="skills" value={profileData.skills} onChange={handleChange} className="theme-input" placeholder="Наприклад: React, Java..." />
              <label>Досвід:</label>
              <textarea name="experience" value={profileData.experience} onChange={handleChange} className="theme-input" rows="3" placeholder="Розкажіть про свій досвід..."></textarea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;