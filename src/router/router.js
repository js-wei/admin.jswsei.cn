/**
 * File: g:\vue\admin.jswsei.cn\src\router\router.js
 * Created Date: '2018-07-15 10:24:46
 * Author: 魏巍
 * -----
 * Last Modified: '2018-07-15 10:25:09
 * Modified By: 魏巍
 * -----
 * Copyright (c) 2018 魏巍
 * ------------------------------------
 * Javascript will save your soul!
 */


import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {
                title: '自述文件'
            },
            children: [{
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {
                        title: '系统首页'
                    }
                },
                {
                    path: '/module',
                    component: resolve => require(['../components/page/module.vue'], resolve),
                    meta: {
                        title: '模块'
                    }
                },
                {
                    path: '/column',
                    component: resolve => require(['../components/page/column.vue'], resolve),
                    meta: {
                        title: '栏目管理'
                    }
                },
                {
                    path: '/column/:id',
                    component: resolve => require(['../components/page/columnPage.vue'], resolve),
                    meta: {
                        title: '栏目管理'
                    }
                },
                {
                    path: '/group',
                    component: resolve => require(['../components/page/group.vue'], resolve),
                    meta: {
                        title: '权限组',
                        icon: 'icon-qunzu'
                    }
                },
                {
                    path: '/admin',
                    component: resolve => require(['../components/page/admin.vue'], resolve),
                    meta: {
                        title: '管理员',
                        icon: 'icon-guanliyuan'
                    }
                },
                {
                    path: '/member',
                    component: resolve => require(['../components/page/member.vue'], resolve),
                    meta: {
                        title: '会员管理',
                        icon: 'icon-shouye'
                    }
                },
                {
                    path: '/auth',
                    component: resolve => require(['../components/page/auth.vue'], resolve),
                    meta: {
                        title: '权限',
                        icon: 'icon-12quanxianguanli'
                    }
                },
                {
                    path: '/carousel',
                    component: resolve => require(['../components/page/carousel.vue'], resolve),
                    meta: {
                        title: '轮播',
                        icon: 'el-icon-picture'
                    }
                },
                {
                    path: '/profile',
                    component: resolve => require(['../components/page/Profile.vue'], resolve),
                    meta: {
                        title: '基本信息'
                    }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: {
                        title: '基础表格'
                    }
                },
                {
                    path: '/message',
                    component: resolve => require(['../components/page/message.vue'], resolve),
                    meta: {
                        title: '消息管理'
                    }
                },
                {
                    path:'/blogroll',
                    component: resolve => require(['../components/page/blogroll.vue'], resolve),
                    meta: {
                        title: '友情链接',
                        icon:'icon-icon'
                    }
                },
                {
                    path:'/setting',
                    component: resolve => require(['../components/page/setting.vue'], resolve)
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: {
                        title: '基本表单'
                    }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: {
                        title: '富文本编辑器'
                    }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: {
                        title: 'markdown编辑器'
                    }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: {
                        title: '文件上传'
                    }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: {
                        title: 'schart图表'
                    }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: {
                        title: '拖拽列表'
                    }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: {
                        title: '权限测试',
                        permission: true
                    }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404',
        }
    ]
})
