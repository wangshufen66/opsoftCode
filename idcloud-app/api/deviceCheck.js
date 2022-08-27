import request from '../common/js/request.js'

export const getReportDetail = (param) => {
	return request.globalRequest('/workOrder/getWorkOrderReportDetail', 'GET', param)
}

export const getAdminList = (param) => {
	return request.globalRequest('/person/getAll', 'GET', param)
}


export const addNewRepairTicket = (param) => {
	return request.globalRequest('/workOrder/add', 'POST', param)
}

export const deleteReport = (param) => {
	return request.globalRequest('/workOrder/delWorkOrderReportByApp', 'POST', param)
}
