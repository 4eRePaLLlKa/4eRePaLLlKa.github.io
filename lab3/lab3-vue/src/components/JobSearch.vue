<template>
  <section id="search" class="search-section">
    <h2>Пошук та фільтри</h2>
    <div class="filter-section">
      <select v-model="filters.category" @change="emitFilters" class="theme-input">
        <option value="all">Всі категорії</option>
        <option value="IT">IT</option>
        <option value="Marketing">Маркетинг</option>
        <option value="Design">Дизайн</option>
      </select>
      
      <select v-model="filters.city" @change="emitFilters" class="theme-input">
        <option value="all">Всі міста</option>
        <option value="Київ">Київ</option>
        <option value="Львів">Львів</option>
        <option value="Одеса">Одеса</option>
        <option value="Дистанційно">Дистанційно</option>
      </select>

      <select v-model="filters.salary" @change="emitFilters" class="theme-input">
        <option value="all">Будь-яка зарплата</option>
        <option value="30000">Від 30 000 грн</option>
        <option value="50000">Від 50 000 грн</option>
        <option value="70000">Від 70 000 грн</option>
      </select>

      <button @click="resetFilters" class="theme-btn">Скинути</button>
      
      <button @click="sortByDate" class="theme-btn sort-btn">📅 Нові вакансії</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'JobSearch',
  data() {
    return {
      filters: {
        category: 'all',
        city: 'all',
        salary: 'all'
      }
    };
  },
  methods: {
    emitFilters() {
      this.$emit('filter-changed', this.filters);
    },
    resetFilters() {
      this.filters = {
        category: 'all',
        city: 'all',
        salary: 'all'
      };
      this.emitFilters();
    },
    sortByDate() {
      this.$emit('sort-by-date');
    }
  }
};
</script>

<style scoped>
.search-section {
    margin-bottom: 40px;
}

h2 {
    color: #333;
}

.filter-section {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
}

.theme-input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #3498db;
    background-color: #ffffff;
    color: #333;
    font-size: 16px;
    flex: 1;
    min-width: 150px;
    outline: none;
}

.theme-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s ease;
    height: 42px;
}

.theme-btn:hover {
    background-color: #e67e22;
}

.sort-btn {
    background-color: #2c3e50; 
}

.sort-btn:hover {
    background-color: #e67e22;
}

@media (max-width: 768px) {
    .filter-section {
        flex-direction: column;
    }
    .theme-btn {
        width: 100%;
    }
}
</style>