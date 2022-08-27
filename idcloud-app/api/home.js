import request from '../common/js/request.js'

export const getPics = (param) => {
	return request.globalRequest('/appearance/appearanceImgList', 'GET', param)
}

export const getLogs = (param) => {
	return request.globalRequest('/appearance/noticeList', 'GET', param)
}

//未带分页的通知消息列表
export const getAllNotice = (param) => {
	return request.globalRequest('/appearance/noticeAllList', 'GET', param)
}

export const callAck = (param) => {
	return request.globalRequest('/appearance/noticeRead', 'GET', param)
}