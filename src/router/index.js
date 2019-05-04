/**
 * @Author: 魏巍
 * @Date:   2018-07-15T22:26:53+08:00
 * @Email:  524314430@qq.com
 * @Filename: index.js
 * @Last modified by:   魏巍
 * @Last modified time: 2019-05-05T00:08:02+08:00
 * @Copyright: free
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
