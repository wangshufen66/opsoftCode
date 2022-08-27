import request from '../common/js/request.js'

export const getMapData = (param) => {
	return request.globalRequest('/container/findContainerList', 'GET', param)
}
