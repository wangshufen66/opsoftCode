import baseUrl from './baseUrl.js'
import init from './authInit.js'
import store from './store.js'

const request = {}
const headers = {}
let _token = ''
let requestId = ''
request.globalRequest = async (url, method, data) => {
	let o = await init.token()
	requestId = o.requestId
	_token = o.token

	headers['Authorization'] = 'Bearer ' + _token
	headers['platform'] = 'mobile'

	return uni.request({
		url: baseUrl() + url,
		method,
		data: data,
		dataType: 'json',
		header: headers
	}).then(res => {
		// console.log('headers',headers)
		// console.log(res);
		switch (res[1].data.code) {
			case 401:
				console.log(store.state.requestId);
				console.log(requestId);
				if (store.state.requestId == requestId) {
					uni.showToast({
						title: '登录状态失效， 即将重新登录',
						icon: 'none'
					})
					if (!getCurrentPages()[0].route !== 'pages/login/login') {
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}

				}
				break;
			case 403:
				uni.showToast({
					title: '权限不足，请重新登录或者联系系统管理员',
					icon: 'none'
				})
				break;
			case 444:
				uni.showToast({
					title: '有其他设备登录该账号， 即将下线',
					icon: 'none'
				})
				if (!getCurrentPages()[0].route !== 'pages/login/login') {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
				break;
			default:
				return res
				break;
		}
		return res
	}).catch(e => {
		console.log(e);
		if (e == "TypeError: Cannot read property 'data' of undefined") {
			// uni.showToast({
			// 	title: '请求失败， 网络异常',
			// 	icon: 'none'
			// })
		}
		return -1
	})
}

export default request
