import Vue from 'vue';
import qs from 'qs';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import VueProgressBar from 'vue-progressbar'

import 'element-ui/lib/theme-chalk/display.css';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
//import '../static/css/theme-green/index.css'; // 浅绿色主题
import vuescroll from 'vuescroll'
Vue.use(vuescroll)
Vue.prototype.$vuescrollConfig = {
    bar: {
        vBar: {
            background: "#777"
        },
        hBar: {
            background: "#777",
            keepShow: true,
        }
    },
    rail: {
        hRail: {
            //height:'6px'
        }
    }
}

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
});

import MetaInfo from 'vue-meta-info'
Vue.use(MetaInfo)

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)


axios.defaults.baseURL = 'http://api.jswei.cn/admin';
//过滤OPTINS
axios.interceptors.request.use(function (config) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (config.method === 'post') {
        config.data = qs.stringify({
            ...config.data
        })
    }
    return config;
}, function (error) {
    loadinginstace.close()
    return Promise.reject(error);
});

//过滤器
import Filters from './filters'
Object.keys(Filters).forEach(key => Vue.filter(key, Filters[key]))

//方法
import Metheds from './metheds'
Object.keys(Metheds).forEach(key => Vue.prototype[key] = Metheds[key])

//Vuex
import store from './store'
//toasted
import Toasted from 'vue-toasted'
Vue.use(Toasted, {
    theme: "primary",
    position: "bottom-center",
    duration: 1.5e3
})
//多语言支持
import i18n from './i18n';
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
