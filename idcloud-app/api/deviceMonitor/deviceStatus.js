import request from '@/common/js/request.js'

export const getPieData = (param) => {
	return request.globalRequest('/container/getEquipmentRate', 'GET', param)
}

export const getDeviceData = (param) => {
	return request.globalRequest('/container/getAppDeviceListByContainer', 'GET', param)
}

export const getDeviceDetail = (param) => {
	return request.globalRequest('/container/getEquipmentRateSlice', 'GET', param)
}

export const getCount = (param) => {
	return request.globalRequest('/container/getDeviceProduction', 'GET', param)
}