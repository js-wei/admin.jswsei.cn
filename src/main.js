/**
 * @Author: 魏巍
 * @Date:   2018-07-08T15:25:57+08:00
 * @Email:  524314430@qq.com
 * @Filename: main.js
 * @Last modified by:   魏巍
 * @Last modified time: 2019-05-05T00:03:44+08:00
 * @Copyright: free
 */

import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueProgressBar from 'vue-progressbar'
import 'element-ui/lib/theme-chalk/display.css'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import '../static/css/theme-green/index.css'; // 浅绿色主题
import '@/assets/comment.scss'
import MetaInfo from 'vue-meta-info'
import axios from '@/axios'
import VueAxios from 'vue-axios'

// 过滤器
import Filters from './filters'

// Vuex
import store from './store'

// 多语言支持
import i18n from './i18n'

const options = {
  color: '#a94442',
  failedColor: '#a94442',
  thickness: '2px',
  location: 'top'
}

Vue.prototype.$api = process.env.baseUrl
Vue.prototype.$upload = process.env.uploadUrl

Vue.use(VueProgressBar, options)
Vue.use(ElementUI, {size: 'small'})
Vue.use(MetaInfo)
Vue.use(VueAxios, axios)

Object.keys(Filters).forEach(key => Vue.filter(key, Filters[key]))

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
