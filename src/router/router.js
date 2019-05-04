/**
 * @Author: 魏巍
 * @Date:   2018-07-15T22:24:46+08:00
 * @Email:  524314430@qq.com
 * @Filename: router.js
 * @Last modified by:   魏巍
 * @Last modified time: 2019-05-05T00:08:14+08:00
 * @Copyright: free
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: resolve => require(['@/components/Home.vue'], resolve),
    meta: {
      title: '自述文件'
    },
    children: [{
      path: '/dashboard',
      component: resolve => require(['@/page/Dashboard.vue'], resolve),
      meta: {
        title: '系统首页'
      }
    },
    {
      path: '/module',
      component: resolve => require(['@/page/module.vue'], resolve),
      meta: {
        title: '模块'
      }
    },
    {
      path: '/column',
      component: resolve => require(['@/page/column.vue'], resolve),
      meta: {
        title: '栏目管理'
      }
    },
    {
      path: '/column/:id',
      component: resolve => require(['@/page/columnPage.vue'], resolve),
      meta: {
        title: '栏目管理'
      }
    },
    {
      path: '/group',
      component: resolve => require(['@/page/group.vue'], resolve),
      meta: {
        title: '权限组',
        icon: 'icon-qunzu'
      }
    },
    {
      path: '/admin',
      component: resolve => require(['@/page/admin.vue'], resolve),
      meta: {
        title: '管理员',
        icon: 'icon-guanliyuan'
      }
    },
    {
      path: '/member',
      component: resolve => require(['@/page/member.vue'], resolve),
      meta: {
        title: '会员管理',
        icon: 'icon-shouye'
      }
    },
    {
      path: '/auth',
      component: resolve => require(['@/page/auth.vue'], resolve),
      meta: {
        title: '权限',
        icon: 'icon-12quanxianguanli'
      }
    },
    {
      path: '/carousel',
      component: resolve => require(['@/page/carousel.vue'], resolve),
      meta: {
        title: '轮播',
        icon: 'el-icon-picture'
      }
    },
    {
      path: '/profile',
      component: resolve => require(['@/page/Profile.vue'], resolve),
      meta: {
        title: '基本信息'
      }
    },
    {
      path: '/table',
      component: resolve => require(['@/page/BaseTable.vue'], resolve),
      meta: {
        title: '基础表格'
      }
    },
    {
      path: '/message',
      component: resolve => require(['@/page/message.vue'], resolve),
      meta: {
        title: '消息管理'
      }
    },
    {
      path: '/blogroll',
      component: resolve => require(['@/page/blogroll.vue'], resolve),
      meta: {
        title: '友情链接',
        icon: 'icon-icon'
      }
    },
    {
      path: '/setting',
      component: resolve => require(['@/page/setting.vue'], resolve)
    },
    {
      path: '/form',
      component: resolve => require(['@/page/BaseForm.vue'], resolve),
      meta: {
        title: '基本表单'
      }
    },
    {
                    // 富文本编辑器组件
      path: '/editor',
      component: resolve => require(['@/page/VueEditor.vue'], resolve),
      meta: {
        title: '富文本编辑器'
      }
    },
    {
                    // markdown组件
      path: '/markdown',
      component: resolve => require(['@/page/Markdown.vue'], resolve),
      meta: {
        title: 'markdown编辑器'
      }
    },
    {
                    // 图片上传组件
      path: '/upload',
      component: resolve => require(['@/page/Upload.vue'], resolve),
      meta: {
        title: '文件上传'
      }
    },
    {
                    // vue-schart组件
      path: '/charts',
      component: resolve => require(['@/page/BaseCharts.vue'], resolve),
      meta: {
        title: 'schart图表'
      }
    },
    {
                    // 拖拽列表组件
      path: '/drag',
      component: resolve => require(['@/page/DragList.vue'], resolve),
      meta: {
        title: '拖拽列表'
      }
    },
    {
                    // 权限页面
      path: '/permission',
      component: resolve => require(['@/page/Permission.vue'], resolve),
      meta: {
        title: '权限测试',
        permission: true
      }
    }
    ]
  },
  {
    path: '/login',
    component: resolve => require(['@/page/Login.vue'], resolve)
  },
  {
    path: '/404',
    component: resolve => require(['@/page/404.vue'], resolve)
  },
  {
    path: '/403',
    component: resolve => require(['@/page/403.vue'], resolve)
  },
  {
    path: '*',
    redirect: '/404'
  }
  ]
})
