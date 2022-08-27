import baseUrl from '@/common/js/baseUrl.js'
import request from '@/common/js/request.js'

export const getToken = (param) => {
	return uni.request({
		url: baseUrl() + '/auth/token',
		method: 'POST',
		header: {
			platform: 'mobile'
		},
		data: param
	})
}

export const getUserInfo = (param) => {
	return request.globalRequest('/appearance/getAppUserDetail', 'GET', param)
}

//绑定客户端id
export const bindingCid =(param)=>{
	return request.globalRequest('/user/userBindingCid', 'POST', param)
}