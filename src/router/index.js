/**
 * File: g:\vue\admin.jswsei.cn\src\router\index.js
 * Created Date: '2018-07-15 10:26:53
 * Author: 魏巍
 * -----
 * Last Modified: '2018-08-17 11:01:51
 * Modified By: 魏巍
 * -----
 * Copyright (c) 2018 魏巍
 * ------------------------------------
 * Javascript will save your soul!
 */

import router from './router'
import store from '../store'

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  let login = store.state.mutations.logined
  if (!login && to.path !== '/login') {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    // role.gid === -1 ? next() : next('/403')
  } else if (to.path === '*') {
    next({
      path: '/404'
    })
  } else {
    next()
  }
})

export default router
