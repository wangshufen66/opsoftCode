export default {
	state: {
		data: {
			useNativeTimePicker: false
		},

	},
	getters: {},
	mutations: {
		setSystemConfig(state, item) {
			state.data = item
		}
	},
	actions: {
		// 修改系统参数使用以下方式
		// this.$store.dispatch('setSystemConfig',{configName: '', data:''})
		async setSystemConfig({
			commit,
			state
		}, payload) {
			state.data[`${payload.configName}`] = payload.data
			await commit('setSystemConfig', state.data)
			await uni.setStorageSync('systemConfig', state.data)
		},
	}
}
