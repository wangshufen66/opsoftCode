import request from '../common/js/request.js'

export const getScheduleList = (param) => {
	return request.globalRequest('/appearance/scheduleList', 'GET', param)
}

export const saveSchedule = (param) => {
	return request.globalRequest('/appearance/saveSchedule', 'POST', param)
}

export const updateSchedule = (param) => {
	return request.globalRequest('/appearance/updateSchedule', 'POST', param)
}

export const deleteSchedule = (param) => {
	return request.globalRequest('/appearance/delSchedule', 'POST', param)
}
