import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from './http'
import VueJsonp from 'vue-jsonp'


import './style.scss'
import './plugins/element.js'

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.use(VueJsonp)
Vue.mixin({
  computed: {
    uploadAudioUrl() {
      return http.defaults.baseURL + '/upload/audio'
    },
    uploadImgUrl() {
      return http.defaults.baseURL + '/upload/image'
    }
  },
  methods: {
    getAuthorization() {
      return {
        Authorization: localStorage.token || ''
      }
    }
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
