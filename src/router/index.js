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
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/orders/Index.vue')
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
  {
    path: '/email-templates',
    name: 'Email Templates',
    component: () => import('@/views/email_templates/Index.vue')
  },
  {
    path: '/department-requests',
    name: 'Department Requests',
    component: () => import('@/views/department_requests/Index.vue')
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name + " - " + process.env.VUE_APP_NAME
  next()
})

export default router
