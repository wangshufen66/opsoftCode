import request from '../common/js/request.js'

export const uploadAvatar = (param) => {
	return request.globalRequest('/appearance/saveAppUserImg', 'POST', param)
}

export const getOrgList = (param) => {
	return request.globalRequest('/org/getUserManagedOrg', 'GET', param)
}

export const getAuthority = (param) => {
	return request.globalRequest('/auth/getAuthority', 'POST', param)
}