import baseUrl from './baseUrl.js'
import {
	getToken
} from '../../api/auth.js'
import moment from 'moment'
import {
	v4 as uuidv4
} from 'uuid';
import store from './store.js'

const init = {}
let _token = ''
init.token = async () => {
	let requestId = ''
	// console.log(getCurrentPages()[0].route);
	function returnHourTime(mss) {
		const hours = parseInt(((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
		const minutes = parseInt(((mss % (1000 * 60 * 60)) / (1000 * 60)));
		const seconds = ((mss % (1000 * 60)) / 1000).toFixed(2);
		return hours + " 小时 " + minutes + " 分钟 " +
			seconds + " 秒 ";

	}
	try {
		requestId = uuidv4()
		store.commit('setRequestId', requestId)
		const auth = uni.getStorageSync('auth')
		// 本地没有auth数据, 跳转登录页
		if (auth === '') {
			uni.reLaunch({
				url: '/pages/login/login',
			})
		} else {
			const user = uni.getStorageSync('user')
			const token = auth.token
			const expire = auth.expire
			const now = Date.now()
			const expireTime = expire - now
			// console.log('距离token过期还有：' +
			// 	returnHourTime(expireTime) + '   ' + '(' + requestId + ')');
			if (now >= expire) {
				console.log('token过期');
				// token 过期, 重新请求
				const param = {
					username: user.username,
					password: user.password
				}
				let res = await Promise.resolve(getToken(param));
				if (res[1].data.code === 200) {
					const oi = uni.getStorageSync('auth').orgId
					uni.setStorageSync('auth', {
						token: res[1].data.data.token,
						expire: moment(res[1].data.data.expire_time).valueOf(),
						orgId: oi
					})

					console.log('下一个过期时间为： ' + moment(res[1].data.data.expire_time).valueOf());
					_token = res[1].data.data.token
					console.log('已刷新token');
				} else {
					if (store.state.requestId == requestId) {
						uni.showToast({
							title: '登录状态失效，即将重新登录',
							icon: 'none',
							duration: 2000
						});
						
						if (!getCurrentPages()[0].route !== 'pages/login/login') {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
						store.commit('setRequestId', '')
						// setTimeout(() => {
						// 	uni.reLaunch({
						// 		url: '/pages/login/login'
						// 	})
						// 	store.commit('setRequestId', '')
						// }, 2000);
					}
				}

			} else {
				_token = token
			}
		}
	} catch (e) {
		console.log(e);
	}
	return {
		token: _token,
		requestId: requestId
	}
}

export default init
