<template>
  <article class="job-card" :class="{ applied: isApplied }">
    <h3>{{ job.title }}</h3>
    <p class="date-text">📅 <strong>Опубліковано:</strong> {{ job.date }}</p>
    
    <p><strong>Компанія:</strong> {{ job.company }} | <strong>Місто:</strong> {{ job.city }}</p>
    <p><strong>Категорія:</strong> {{ job.category }}</p>
    <p><strong>Вимоги:</strong> {{ job.requirements }}</p>
    <p><strong>Зарплата:</strong> {{ job.salaryStr }} грн.</p>
    
    <button 
      class="apply-btn" 
      :disabled="isApplied" 
      @click="applyToJob"
    >
      {{ isApplied ? 'Подано ✓' : 'Подати заявку' }}
    </button>
  </article>
</template>

<script>
export default {
  name: 'JobCard',
  props: {
    job: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isApplied: false
    };
  },
  methods: {
    applyToJob() {
      this.isApplied = true;
      this.$emit('applied', this.job.title);
    }
  }
};
</script>

<style scoped>
.job-card {
    background: #ffffff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    border-top: 5px solid #3498db;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.job-card:hover {
    border-top-color: #e67e22;
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.job-card.applied {
    border-top-color: #27ae60;
    background-color: rgba(39, 174, 96, 0.05);
}

h3 {
    margin-top: 0;
    color: #333;
}

p {
    color: #333;
    margin: 5px 0;
}

/* Стиль для нашої нової дати */
.date-text {
    font-size: 0.9em;
    color: #7f8c8d;
    margin-bottom: 10px;
}

.apply-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 15px;
    width: 100%;
    transition: 0.3s;
}

.apply-btn:hover:not(:disabled) {
    background-color: #e67e22;
}

.apply-btn:disabled {
    background-color: #27ae60; 
    cursor: not-allowed;
}
</style>