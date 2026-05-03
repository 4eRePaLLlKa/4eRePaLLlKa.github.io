import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Коваль Максим",
    skills: "Java, C++, Python, Git, HTML/CSS, React",
    experience: "Розробка ігрових проектів та десктопних додатків.",
    avatar: "https://st2.depositphotos.com/1594920/8612/i/450/depositphotos_86121648-stock-photo-close-up-of-mixed-breed.jpg"
  });

  // Завантажуємо дані при першому рендері сторінки
  useEffect(() => {
    const savedData = localStorage.getItem('savedProfileReact');
    if (savedData) {
      setUser(JSON.parse(savedData));
    }
  }, []);

  const toggleEdit = () => {
    if (isEditing) {
      // Зберігаємо у localStorage при виході з режиму редагування
      localStorage.setItem('savedProfileReact', JSON.stringify(user));
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-container" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
      <img src={user.avatar} alt="Фото профілю" className="profile-pic" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
      
      <div className="profile-info" style={{ flex: 1 }}>
        <div className="header-edit" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Мій профіль</h3>
          <button onClick={toggleEdit} className="theme-btn" style={{ padding: '8px 15px', fontSize: '14px' }}>
            {isEditing ? '💾 Зберегти' : '✏️ Редагувати'}
          </button>
        </div>

        {!isEditing ? (
          <div>
            <p><strong>Ім'я:</strong> {user.name}</p>
            <p><strong>Навички:</strong> {user.skills}</p>
            <p><strong>Досвід:</strong> {user.experience}</p>
          </div>
        ) : (
          <div className="edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>Ім'я:</label>
            <input name="name" value={user.name} onChange={handleChange} className="theme-input" />
            
            <label>Навички:</label>
            <input name="skills" value={user.skills} onChange={handleChange} className="theme-input" />
            
            <label>Досвід:</label>
            <textarea name="experience" value={user.experience} onChange={handleChange} className="theme-input" rows="3"></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;