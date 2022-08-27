import request from '../common/js/request.js'

export const getDeviceList = (param) => {
	return request.globalRequest('/remote/list', 'GET', param)
}

export const changeControl = (param) => {
	return request.globalRequest('/remote/control', 'POST', param)
}
