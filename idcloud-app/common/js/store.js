import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		requestId: ''
	},
	mutations: {
		setRequestId(state, val) {
			state.requestId = val
		}
	}
})

export default store
