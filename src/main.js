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

Object.keys(Filters).forEach(key => Vue.filter(key, Filters[key]))

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
