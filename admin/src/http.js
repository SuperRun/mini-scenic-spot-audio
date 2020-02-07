import axios from 'axios'
import Vue from 'vue'
import router from './router'

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})

// 请求拦截器
http.interceptors.request.use(config => {
  if (localStorage.token) {
    config.headers.Authorization = localStorage.token
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
http.interceptors.response.use(res => {
  return res
}, err => {
  Vue.prototype.$message({
    type: 'error',
    message: err.response.data.message
  })
  console.log(err.response)
  if (err.response.status == 401) {
    router.push('/login')
  }
  return Promise.reject(err)
})

export default http