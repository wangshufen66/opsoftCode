export default {
	state: {
		moduleName: '',
		hasUseFunc: ''
	},
	getters: {},
	mutations: {
		setPublicNotReadyModuleName(state, name) {
			state.moduleName = name
		},
		setBackToLogin(state, item){
			state.hasUseFunc = item
		}
	},
	actions: {
		changeModuleName({
			commit
		}, name) {
			commit('setPublicNotReadyModuleName', name)
		}
	}
}
