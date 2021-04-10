import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
// import Help from '../views/Help.vue'
// import User from '../views/User.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import Forgot from '../components/Forgot.vue'
import Reset from '../components/Reset.vue'



const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/help',
    name: 'Help',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue')
  },
  {
    path: '/user',
    name: 'User',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
    
  },
  {
    path: '/login',
    name: 'Login',
    component: Login

  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: Forgot
  },
  {
    path: '/reset/:token',
    name: 'Reset',
    component: Reset
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
