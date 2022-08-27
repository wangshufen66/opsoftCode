import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../layout/Layout'

export const constantRouterMap = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    meta: {
      title: '登录',
      keepAlive: false,
      noCache: true
    },
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    meta: {
      title: '404未找到',
      keepAlive: true,
      noCache: true
    },
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    meta: {
      title: '401页面失效，需重新登录',
      keepAlive: true,
      noCache: true
    },
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/noAccess',
    meta: {
      title: '对不起，您没有权限访问该页面！',
      keepAlive: true,
      noCache: true
    },
    component: () => import('@/views/error-page/unauthorized'),
    hidden: true
  },
  {
    path: '/preview/:hash',
    component: () => import('@/views/modules/datav/Preview'),
    hidden: true
  },
  {
    path: '/dashboard/:hash',
    component: () => import('@/views/modules/datav/Preview'),
    hidden: true
  },
  {
    path: '/edit/dashboard/:hash',
    component: () => import('@/views/modules/datav/Designer'),
    hidden: true
  },

  {
    path: '/report',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [{
      path: 'chart',
      component: () => import('@/views/modules/report/chart'),
      name: '在线图表',
      meta: {
        title: '在线图表',
        icon: 'chart'
      }
    }]
  },


  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: '首页',
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true
      }
    }]
  },
  // {
  //   path: '/datav',
  //   component: Layout,
  //   redirect: 'datav',
  //   children: [
  //     {
  //       path: 'project',
  //       component: () => import('@/views/modules/datav/Manage.vue'),
  //       name: '全部大屏',
  //       meta: { title: '全部大屏', icon: 'chart' }
  //     },
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/modules/datav/Template.vue'),
  //       name: '模板管理',
  //       meta: { title: '模板管理', icon: 'chart'}
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [{
      path: 'center',
      component: () => import('@/views/modules/sys/user/center'),
      name: '个人中心',
      meta: {
        title: '个人中心',
        icon: 'user'
      }
    }]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  mode: 'hash',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
