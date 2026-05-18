<template>
  <div>
    <JobSearch @filter-changed="updateFilters" @sort-by-date="sortByDate" />
    <section id="jobs">
      <h2>Доступні вакансії</h2>
      <div class="jobs-container">
        <p v-if="filteredVacancies.length === 0" style="grid-column: 1 / -1; text-align: center;">
          На жаль, за вашими критеріями вакансій не знайдено.
        </p>
        <JobCard 
          v-for="job in filteredVacancies" 
          :key="job.title" 
          :job="job" 
          @applied="handleApply" 
        />
      </div>
    </section>
    
    <div class="toast" :class="{ show: isToastVisible }">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import JobCard from './JobCard.vue';
import JobSearch from './JobSearch.vue';

export default {
  name: 'JobsView',
  components: {
    JobCard,
    JobSearch
  },
  data() {
    return {
      vacancies: [
        { title: "Frontend Developer", company: "WebTech Solutions", requirements: "HTML5, CSS3, React, Git", salaryStr: "65 000", salaryVal: 65000, category: "IT", city: "Київ", date: "2026-03-31" },
        { title: "Java Backend Engineer", company: "FinCore Systems", requirements: "Java 17, Spring Boot, PostgreSQL", salaryStr: "80 000", salaryVal: 80000, category: "IT", city: "Львів", date: "2026-03-25" },
        { title: "Python Data Scientist", company: "DataMind", requirements: "Python, Pandas, Machine Learning", salaryStr: "90 000", salaryVal: 90000, category: "IT", city: "Дистанційно", date: "2026-03-30" },
        { title: "Social Media Manager", company: "PromoGroup", requirements: "SMM, Копірайтинг, Таргет", salaryStr: "30 000", salaryVal: 30000, category: "Marketing", city: "Одеса", date: "2026-03-20" },
        { title: "UI/UX Designer", company: "Creative Flow", requirements: "Figma, Adobe XD, Прототипування", salaryStr: "45 000", salaryVal: 45000, category: "Design", city: "Київ", date: "2026-03-28" },
        { title: "C++ Game Developer", company: "Lviv Games", requirements: "C++, OOP, Game Logic", salaryStr: "75 000", salaryVal: 75000, category: "IT", city: "Львів", date: "2026-04-15" },
        { title: "Vue.js Frontend Developer", company: "TechStack", requirements: "Vue 3, JavaScript, HTML/CSS", salaryStr: "55 000", salaryVal: 55000, category: "IT", city: "Київ", date: "2026-05-01" },
        { title: "Marketing Director", company: "BrandBoost", requirements: "Стратегія, Team Lead, SEO", salaryStr: "100 000", salaryVal: 100000, category: "Marketing", city: "Одеса", date: "2026-04-20" },
        { title: "2D Game Artist", company: "PixelArt", requirements: "Photoshop, Ілюстрація, Анімація", salaryStr: "40 000", salaryVal: 40000, category: "Design", city: "Дистанційно", date: "2026-04-25" },
        { title: "Junior Java Developer", company: "CodeAcademy", requirements: "Java Core, Git, Базовий SQL", salaryStr: "35 000", salaryVal: 35000, category: "IT", city: "Львів", date: "2026-05-02" },
        { title: "SEO Specialist", company: "SearchPro", requirements: "Google Analytics, Ahrefs, Копірайтинг", salaryStr: "45 000", salaryVal: 45000, category: "Marketing", city: "Дистанційно", date: "2026-04-28" }
      ],
      currentFilters: { category: 'all', city: 'all', salary: 'all' },
      toastMessage: '',
      isToastVisible: false
    };
  },
  computed: {
    filteredVacancies() {
      return this.vacancies.filter(job => {
        const matchCategory = this.currentFilters.category === 'all' || job.category === this.currentFilters.category;
        const matchCity = this.currentFilters.city === 'all' || job.city === this.currentFilters.city;
        const matchSalary = this.currentFilters.salary === 'all' || job.salaryVal >= parseInt(this.currentFilters.salary);
        return matchCategory && matchCity && matchSalary;
      });
    }
  },
  methods: {
    updateFilters(filters) { this.currentFilters = filters; },
    sortByDate() {
      this.vacancies.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.showToast('Вакансії відсортовано за датою (від нових)!');
    },
    handleApply(jobTitle) { this.showToast(`Ви успішно подалися на: ${jobTitle}!`); },
    showToast(message) {
      this.toastMessage = message;
      this.isToastVisible = true;
      setTimeout(() => { this.isToastVisible = false; }, 3000);
    }
  }
};
</script>

<style scoped>
.jobs-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
}
.toast {
    position: fixed;
    bottom: -100px; 
    right: 20px;
    background-color: #27ae60;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    font-weight: bold;
    transition: bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); 
    z-index: 1000;
}
.toast.show { bottom: 20px; }
</style>