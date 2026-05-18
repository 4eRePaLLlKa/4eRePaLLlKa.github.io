<template>
  <div class="profile-container">
    <img :src="user.avatar" alt="Фото профілю" class="profile-pic">
    <div class="profile-info">
      <h3>Мій профіль</h3>
      <p><strong>Ім'я:</strong> {{ user.name }}</p>
      <p><strong>Навички:</strong> {{ user.skills }}</p>
      <p><strong>Досвід:</strong> {{ user.experience }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  // У Vue всі змінні компонента зберігаються тут
  data() {
    return {
      user: {
        name: "Коваль Максим Миколайович",
        skills: "Java, C++, Python, Git, HTML/CSS, Vue.js",
        experience: "2 роки розробки ігрових проектів та десктопних додатків.",
        avatar: "https://st2.depositphotos.com/1594920/8612/i/450/depositphotos_86121648-stock-photo-close-up-of-mixed-breed.jpg"
      }
    };
  }
};
</script>

<style scoped>
.profile-container {
    display: flex;
    align-items: center;
    gap: 30px;
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    margin-bottom: 40px;
}

.profile-pic {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #3498db;
    transition: border-color 0.3s ease;
}

.profile-container:hover .profile-pic {
    border-color: #e67e22;
}

h3 {
    margin-top: 0;
    color: #333;
}

p {
    color: #333;
}

@media (max-width: 768px) {
    .profile-container {
        flex-direction: column;
        text-align: center;
    }
}
</style>