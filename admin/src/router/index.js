import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../views/Main.vue'
import Login from '../views/Login.vue'

import AudioEdit from '../views/AudioEdit'
import AudioList from '../views/AudioList'

import AdEdit from '../views/AdEdit'
import AdList from '../views/AdList'

import SpotEdit from '../views/SpotEdit'
import SpotList from '../views/SpotList'

import AdminUserEdit from '../views/AdminUserEdit'
import AdminUserList from '../views/AdminUserList'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [
      { path: '/audios/create', component: AudioEdit },
      { path: '/audios/list', component: AudioList },
      { path: '/audios/edit/:id', component: AudioEdit, props: true },

      { path: '/ads/create', component: AdEdit },
      { path: '/ads/list', component: AdList },
      { path: '/ads/edit/:id', component: AdEdit, props: true },

      { path: '/spots/create', component: SpotEdit },
      { path: '/spots/list', component: SpotList },
      { path: '/spots/edit/:id', component: SpotEdit, props: true },

      { path: '/admin_users/create', component: AdminUserEdit },
      { path: '/admin_users/list', component: AdminUserList },
      { path: '/admin_users/edit/:id', component: AdminUserEdit, props: true }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { isPublic: true }
  }
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   console.log(!to.meta.isPublic && !localStorage.token)
//   if (!to.meta.isPublic && !localStorage.token) {
//     return next('/login')
//   }
//   next()
// })

export default router
