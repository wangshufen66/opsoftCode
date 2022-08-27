import request from '../common/js/request.js'

export const getTreeData = (param) => {
	return request.globalRequest('/container/getContainerTree', 'GET', param)
}

/** 
 * @param ctrType orgId id
 * 
 * */
export const getContainerList = (param) => {
	return request.globalRequest('/container/findAppContainerList', 'GET', param)
}
