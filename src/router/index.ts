// Composables
import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "@/stores/AuthStore";

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/users',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/users/Users.vue'),
      }
    ]
  },
  {
    path: '/users/:id',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'User',
        component: () => import(/* webpackChunkName: "user" */ '@/views/users/UserEdit.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/auth/Login.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !authStore.isLoggedIn) {
    return next('/login')
  }

  next()
})

export default router
