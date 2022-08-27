// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import config from '@/config'
import installPlugin from '@/plugin'
import '@/icons/side-menu-custom/iconfont.css'
import '@/icons/sidemenu-full/iconfont.css'
import utils from '@/view/utils/utils.js'
import axioss from 'axios'

const echarts = require('echarts')
import moment from 'moment' // 日期格式化工具

// 引入饿了么组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)


import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI)


/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$utils = utils
Vue.prototype.$moment = moment
Vue.prototype.$http = axioss
Vue.prototype.$echarts = echarts

//特别设定的报错Notification
const notifyError = function (title, message) {
  ElementUI.Notification({
    title: title,
    dangerouslyUseHTMLString: true,
    message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:red;">原因：${message}</span>
                      </div>`,
    type: "error",
  });
};
Vue.prototype.$notifyError = notifyError;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
// 生产环境下清除所有console.log
if (process.env.NODE_ENV === 'production') {
  console.log = () => {
  }
}
