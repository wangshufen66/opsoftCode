import request from '../common/js/request.js'

export const getTaskList = (param) => {
	// return request.globalRequest('/produceTaskInDevice/getList', 'GET', param)
	return request.globalRequest('/productionDevice/appList', 'GET', param)
}

export const getContainerTree = (param) => {
	return request.globalRequest('/container/getContainerPcAnalysisList', 'GET', param)
}

export const getTaskDetail = (param, extra) => {
	// return request.globalRequest(`/produceTaskInDevice/getDetail/${extra}`, 'GET', param)
	return request.globalRequest(`/productionDevice/getDetail/${extra}`, 'GET', param)
}

export const startWork = (param) => {
	return request.globalRequest('/productionDeviceTask/startWork', 'POST', param)
}

// 完工
export const finishWork = (param) => {
	return request.globalRequest('/productionDeviceTask/endWork', 'POST', param)
}

export const batchDel = (param) => {
	return request.globalRequest('/productionDeviceTask/batchDel', 'POST', param)
}

export const getMaterialList = (param) => {
	return request.globalRequest('/productionDeviceTask/getProcessList', 'GET', param)
}

export const addNewMaterial = (param) => {
	return request.globalRequest('/productionDeviceTask/add', 'POST', param)
}

// 获取班次列表
export const getList = (param) => {
	return request.globalRequest('/team/getList', 'GET', param)
}

// 获取人员列表
export const getStaffList = (param) => {
	return request.globalRequest('/person/getList', 'GET', param)
}

// 获取设备列表
export const getDeviceList = (param) => {
	return request.globalRequest('/archives/getList', 'GET', param)
}
// 添加设备加工任务
export const addDeviceTask = (param) => {
	return request.globalRequest('/productionDevice/add', 'POST', param)
}
// 删除设备加工任务
export const delDeviceTask = (param) => {
	return request.globalRequest('/productionDevice/batchDel', 'POST', param)
}
// 编辑设备加工任务
export const editDeviceTask = (param) => {
	return request.globalRequest('/productionDevice/updateProductionDevice', 'POST', param)
}