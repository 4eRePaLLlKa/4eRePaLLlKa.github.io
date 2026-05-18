import { createRouter, createWebHistory } from 'vue-router';
import UserProfile from './components/UserProfile.vue';
import JobsView from './components/JobsView.vue';

const routes = [
  { path: '/', component: JobsView }, 
  { path: '/profile', component: UserProfile } 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;