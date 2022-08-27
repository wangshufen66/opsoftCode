import request from '../common/js/request.js'

export const addNewReport = (param) => {
	return request.globalRequest('/workOrder/saveWorkOrderReport', 'POST', param)
}

export const addNewParts = (param) => {
	return request.globalRequest('/workOrder/saveWorkOrderPart', 'POST', param)
}

export const getTicketList = (param) => {
	return request.globalRequest('/workOrder/getAllList', 'GET', param)
}

export const getRecordList = (param) => {
	return request.globalRequest('/workOrder/getWorkOrderReport', 'GET', param)
}

export const getSparePartList = (param) => {
	return request.globalRequest('/workOrder/getWorkOrderPart', 'GET', param)
}

export const getMaterialList = (param) => {
	return request.globalRequest('/material/getMaterialSparePart', 'GET', param)
}

export const getReportPart = (param) => {
	return request.globalRequest('/workOrder/getWorkOrderPartByReportId', 'GET', param)
}
