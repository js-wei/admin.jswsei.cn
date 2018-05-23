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
            background: '#122423'
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
    size: 'small'
});

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
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    let login = store.state.mutations.logined;
    if (!login && to.path !== '/login') {
        next({
            path: '/login'
        });
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role.gid === -1 ? next() : next('/403');
    } else if (to.path == "*") {
        next({
            path: '/404'
        });
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
