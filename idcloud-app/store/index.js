import Vue from 'vue'
import Vuex from 'vuex'
import notReady from './module/notReady'
import reportTicket from './module/reportTicket'
import switchPosition from './module/switchPosition'
import device from './module/deviceCommon'
import dashboard from './module/dashboard.js'
import auth from './module/auth.js'
import config from './module/config.js'
import deviceProcess from './module/deviceProcess.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {

	},
	mutations: {

	},
	actions: {

	},
	modules: {
		notReady,
		reportTicket,
		switchPosition,
		device,
		dashboard,
		auth,
		config,
		deviceProcess,
	}
})
