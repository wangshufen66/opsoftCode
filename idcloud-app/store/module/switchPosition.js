export default {
	state: {
		data: [],
		switched: ''
	},
	getters: {},
	mutations: {
		setData(state, item) {
			state.data = item
		},
		setSwitch(state, item) {
			state.switched = item
		}
	},
	actions: {
		setPositionList({
			commit
		}, item) {
			commit('setData', item)
		},
		setSwitchedPosition({
			commit
		}, item) {
			commit('setSwitch', item)
		}
	}
}
