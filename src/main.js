import Vue from 'vue'
import qs from 'qs'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueProgressBar from 'vue-progressbar'

import 'element-ui/lib/theme-chalk/display.css'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import '../static/css/theme-green/index.css'; // 浅绿色主题
import '@/assets/comment.scss'

import MetaInfo from 'vue-meta-info'

import axios from 'axios'
import VueAxios from 'vue-axios'

// 过滤器
import Filters from './filters'

// Vuex
import store from './store'
// toasted
import Toasted from 'vue-toasted'
// 多语言支持
import i18n from './i18n'

const options = {
  color: '#409EFF',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

Vue.use(ElementUI, {
  size: 'small',
  debug: false
})
Vue.use(MetaInfo)
Vue.use(VueAxios, axios)

axios.defaults.baseURL = process.env.baseUrl

// 过滤OPTINS
axios.interceptors.request.use(function (config) {
  store.commit('SHOW_LOADING')
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  if (config.method === 'post') {
    config.data = qs.stringify({
      ...config.data
    })
  }
  return config
}, function (error) {
  store.commit('HIDE_LOADING')
  return Promise.reject(error)
})

axios.interceptors.response.use(
  response => {
    store.commit('HIDE_LOADING')
    return response
  },
  error => {
    store.commit('HIDE_LOADING')
    return Promise.reject(error.response.data)
  }
)

Object.keys(Filters).forEach(key => Vue.filter(key, Filters[key]))

Vue.use(Toasted, {
  theme: 'primary',
  position: 'bottom-center',
  duration: 1.5e3
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
