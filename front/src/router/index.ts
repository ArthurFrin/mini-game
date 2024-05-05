import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/TestView.vue';
import SignUpView from '@/views/SignUpView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/PostCreationView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/HomeView.vue')
    }
  ]
})

export default router
