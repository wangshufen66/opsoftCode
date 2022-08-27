export default {
	state: {
		ticketDetail: {},
		triggerType: {
			trigger: '',
			type: ''
		},
		blockItem: {}
	},
	getters: {},
	mutations: {
		setDetail(state, item) {
			state.ticketDetail = item
		},
		setTrigger(state, item) {
			state.triggerType = item
		},
		setItem(state, item) {
			state.blockItem = item
		}
	},
	actions: {
		setTicketDetail({
			commit
		}, item) {
			commit('setDetail', item)
		},
		setTicketTriggerType({
			commit
		}, item) {
			commit('setTrigger', item)
		},
		setTicketTriggerBlockItem({
			commit
		}, item) {
			commit('setItem', item)
		},
	}
}
