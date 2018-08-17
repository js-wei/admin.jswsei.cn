/**
 * File: g:\vue\admin.jswsei.cn\src\router\index.js
 * Created Date: '2018-07-15 10:26:53
 * Author: 魏巍
 * -----
 * Last Modified: '2018-07-15 10:37:18
 * Modified By: 魏巍
 * -----
 * Copyright (c) 2018 魏巍
 * ------------------------------------
 * Javascript will save your soul!
 */

import router from './router';
import store from '../store'

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    let login = store.state.mutations.logined;
    if (!login && to.path !== '/login') {
        next({
            path: '/login',
            query: {
                redirect: to.fullPath
            }
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

export default router;