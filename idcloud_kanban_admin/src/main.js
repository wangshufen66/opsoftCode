import Vue from 'vue'
// Vue在IE、低版本Android显示空白问题
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import infiniteScroll from 'vue-infinite-scroll'
import echarts from 'echarts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

import permission from '@/directive/permission/index.js' // 权限判断指令

import _ from 'lodash' // lodash（components/CustomReport/mixins/chart-default.js中用到）
Vue.prototype._ = _

// /* 引入资源请求插件*/
// import VueResource from 'vue-resource'
//
// /* 使用VueResource插件*/
// Vue.use(VueResource)

// // 在main.js中定义一个全局函数
// // 功能是调用打包输出可修改后台接口URL的配置文件
// Vue.prototype.getConfigJson = function() {
//   console.log('this.$http.get')
//   this.$http.get('serverconfig.json').then((result) => {
//     console.log(JSON.stringify(result))
//     // 用一个全局字段保存ApiUrl  也可以用sessionStorage存储
//     Vue.prototype.serverconfig = result.body
//   }).catch((error) => { console.log(error) })
// }

Vue.prototype.$echarts = echarts
// Vue.use(infiniteScroll)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.directive('permission', permission)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // // 在app.vue里面  执行this.getConfigJson();(main.js中定义的函数)，
  // // 功能是调用打包输出可修改后台接口URL的配置文件
  // mounted: function() {
  //   console.log('App mounted')
  //   this.getConfigJson()
  // },
  render: h => h(App)
})
