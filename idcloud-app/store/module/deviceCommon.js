export default {
	state: {
		data: '',
		report: '',
		partInfo: [],
		detail: '',
		finishInfo: {
			status: 0,
			reportId: ''
		},
		// 设备点检， 点击查看汇报记录时， 判断是否是从 *汇报完成* 界面跳转过来的。 用于控制删除时返回的层级。
		isFromFinish: false
		
	},
	getters: {},
	mutations: {
		setTicket(state, item) {
			state.data = item
		},
		setReport(state, item) {
			state.report = item
		},
		setPart(state, item) {
			state.partInfo = item
		},
		setDetail(state, item) {
			state.detail = item
		},
		setCheckResult(state, item) {
			state.finishInfo = item
		},
		setIsFromFinish(state, item){
			state.isFromFinish = item
		}
	},
	actions: {
		setDeviceTicketInfo({
			commit
		}, item) {
			commit('setTicket', item)
		},
		setDeviceReportInfo({
			commit
		}, item) {
			commit('setReport', item)
		},
		setSparePartInfo({
			commit
		}, item) {
			commit('setPart', item)
		},
		setReportDetailInfo({
			commit
		}, item) {
			commit('setDetail', item)
		},
		setCheckResultStatus({
			commit
		}, item) {
			commit('setCheckResult', item)
		}
	}
}
