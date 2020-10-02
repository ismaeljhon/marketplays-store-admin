import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('@/views/departments/Index.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/products/Index.vue')
  },
  {
    path: '/job-categories',
    name: 'Job Categories',
    component: () => import('@/views/job_categories/Index.vue')
  },
  {
    path: '/jobs',
    name: 'Job Listing',
    component: () => import('@/views/jobs/Index.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
