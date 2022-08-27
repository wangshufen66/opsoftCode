import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import ViewUI from 'view-design'
import {
  setToken,
  getToken,
  canTurnTo,
  setTitle
} from '@/libs/util'
import config from '@/config'
const {
  homeName
} = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to, access, routes)) next() // 有权限，可访问
  else {
    next({
      replace: true,
      name: 'error_401'
    })
  } // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {

      const orgId=sessionStorage.getItem(store.state.user.token+"changeOrgId")
      const orgName=sessionStorage.getItem(store.state.user.token+"changeOrgName")
      const orgNumber=sessionStorage.getItem(store.state.user.token+"changeOrgNumber")
      store.dispatch('getUserInfo',{orgId,orgName,orgNumber}).then(user => {
        // 通过用户权限和跳转的页面的name来判断是否有权限访问;user.menu是一个数组,存放了用户可以访问的路由name
        turnTo(to, user.menu, next)
        // localStorage.removeItem("changeOrgId")
        // localStorage.removeItem("changeOrgName")
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  ViewUI.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
