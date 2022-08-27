export default {
	state: {
		chatbotSessionId: '',
		userLocation: {
			province: '',
			city: '',
			formattedAddress: '',
			district: '',
			lng: '',
			lat: ''
		}
	},
	getters: {},
	mutations: {
		setChatbotSessionId(state, status) {
			state.chatbotSessionId = status
		},
		setUserLocation(state, val) {
			state.userLocation = val
		}
	},
	actions: {
		setSessionId({
			commit
		}, status) {
			commit('setChatbotSessionId', status)
		}
	}
}
