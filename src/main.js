import Vue from 'vue';
import qs from 'qs';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
//import '../static/css/theme-green/index.css'; // 浅绿色主题
import "babel-polyfill";

Vue.use(ElementUI, {
    size: 'small'
});

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

axios.defaults.baseURL = 'http://api.jswei.cn/admin';
//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
    //在请求发送之前做一些事
    return config;
}, function (error) {
    //当出现请求错误是做一些事
    return Promise.reject(error);
});
//添加一个返回拦截器
axios.interceptors.response.use(function (response) {
    //对返回的数据进行一些处理
    return response;
}, function (error) {
    //对返回的错误进行一些处理
    return Promise.reject(error);
});
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
    const role = JSON.parse(sessionStorage.getItem('ms_username'));
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role.gid === -1 ? next() : next('/403');
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
