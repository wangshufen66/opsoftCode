import request from '../common/js/request.js'

export const getLogList = (param) => {
	return request.globalRequest('/container/getAppAlarmLog', 'GET', param)
}