import request from '../common/js/request.js'

export const getList = (param) => {
	return request.globalRequest('/andon/getAppAndonInfo', 'GET', param)
}

export const andonControl = (param) => {
	return request.globalRequest('/andonWarning/control', 'POST', param)
}
