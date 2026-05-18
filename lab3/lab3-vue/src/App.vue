<template>
  <div id="app-wrapper">
    <header>
      <h1>JobFinder</h1>
      <nav>
        <ul>
          <li><router-link to="/">Вакансії та Пошук</router-link></li>
          <li><router-link to="/profile">Мій профіль</router-link></li>
        </ul>
      </nav>
      <button @click="toggleTheme" class="theme-btn">Змінити тему</button>
    </header>

    <main>
      <router-view></router-view>
    </main>

    <footer>
      <p>Контакти: info@jobfinder.ua | тел: +380 44 555 66 77</p>
      <p>Адреса: м. Київ, вул. Технологічна, 101</p>
      <p>© 2026 JobFinder Platform — Твій шлях до успіху</p>
    </footer>

    <button 
      id="scrollTopBtn" 
      class="scroll-top-btn" 
      :class="{ show: showScrollBtn }" 
      @click="scrollToTop"
    >↑</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showScrollBtn: false
    };
  },
  methods: {
    toggleTheme() {
      document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    },
    handleScroll() {
      this.showScrollBtn = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  mounted() {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-theme');
    }
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style>
:root {
    --bg-color: #f0f2f5;
    --text-color: #333;
    --header-bg: #2c3e50;
    --nav-link: #ecf0f1;
    --accent-color: #3498db; 
    --hover-color: #e67e22;  
    --footer-bg: #2c3e50;
}

.dark-theme {
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --header-bg: #000000;
    --nav-link: #bb86fc;
    --accent-color: #bb86fc; 
    --hover-color: #03dac6;  
    --footer-bg: #1a1a1a;
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    transition: background-color 0.3s, color 0.3s;
}

header {
    background-color: var(--header-bg);
    color: white;
    padding: 1.5rem;
    text-align: center;
}

nav ul {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

nav ul li { margin: 0 15px; }

nav ul li a {
    color: var(--nav-link);
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
}

nav ul li a:hover,
.router-link-active {
    color: var(--hover-color);
}

.theme-btn {
    background-color: var(--accent-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s ease;
}

.theme-btn:hover {
    background-color: var(--hover-color);
    transform: scale(1.05);
}

main {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    min-height: 50vh; /* Щоб футер не стрибав, коли сторінка пуста */
}

footer {
    background-color: var(--footer-bg);
    color: white;
    text-align: center;
    padding: 40px 20px;
    margin-top: 60px;
}

.scroll-top-btn {
    position: fixed;
    bottom: 80px; 
    right: 20px;
    background-color: var(--accent-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: 0.3s;
    opacity: 0; 
    visibility: hidden; 
    z-index: 999;
}

.scroll-top-btn.show {
    opacity: 1;
    visibility: visible;
}

.scroll-top-btn:hover {
    background-color: var(--hover-color);
    transform: translateY(-5px);
}

.dark-theme .job-card,
.dark-theme .profile-container {
    background-color: #1e1e1e !important; 
    border-top-color: #bb86fc !important; 
}

.dark-theme h2, 
.dark-theme h3, 
.dark-theme p, 
.dark-theme strong, 
.dark-theme label,
.dark-theme .date-text {
    color: var(--text-color) !important; 
}

.dark-theme .theme-input {
    background-color: #2c2c2c !important; 
    color: #e0e0e0 !important;
    border-color: #555 !important;
}
</style>