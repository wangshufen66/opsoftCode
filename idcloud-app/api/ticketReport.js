import request from '../common/js/request.js'

export const uploadAvatar = (param) => {
	return request.globalRequest('/appearance/saveAppUserImg', 'POST', param)
}

export const getReportTicketList = (param) => {
	return request.globalRequest('/workOrder/getList', 'GET', param)
}

export const getReportTicketDetail = (param, param2) => {
	return request.globalRequest(`/workOrder/getDetail/${param2}`, 'GET', param)
}

export const getBlockDetail = (param) => {
	return request.globalRequest(`/workOrder/getWorkOrderReportDetail`, 'GET', param)
}

export const saveReport = (param) => {
	return request.globalRequest('/workOrder/saveWorkOrderReport', 'POST', param)
}