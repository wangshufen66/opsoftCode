import request from '../common/js/request.js'

export const getList = (param) => {
	return request.globalRequest('/environmentAnalysis/list', 'GET', param)
}

