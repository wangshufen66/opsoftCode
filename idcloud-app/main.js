import Vue from 'vue'
import App from './App'
import common from 'common/js/com.js'
import store from './store'
import uView from 'uview-ui'
// 事件总线
import event from '@/common/js/event'
import {
	pageUtil
} from '@/common/js/utils'

Vue.config.productionTip = false
Vue.prototype.$com = common

Vue.use(event);

Vue.use(uView)

App.mpType = 'app'

Vue.prototype.$pageUtil = pageUtil;

const app = new Vue({
	store,
	...App
})
app.$mount()
