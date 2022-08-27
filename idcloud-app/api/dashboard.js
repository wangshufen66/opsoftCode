import request from '../common/js/request.js'

export const fetchList = (param) => {
	const orgId = param.orgId
	delete param.orgId
	return request.globalRequest('/dashboard/user/' + orgId + '/dashboards', 'GET', param)
}
