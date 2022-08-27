import request from '@/common/js/request.js'

export const getPie = (param) => {
	return request.globalRequest('/deviceDataAnalysis/usage', 'GET', param)
}

export const getColumn = (param) => {
	return request.globalRequest('/deviceDataAnalysis/usage/table', 'GET', param)
}