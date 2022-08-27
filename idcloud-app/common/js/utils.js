/* 页面操作 */
export const pageUtil = {
	/* 跳转页面，保留当前页面 */
	navigateTo: (url, params) => {
		url = getUrl(url, params)
		uni.navigateTo({
			url
		});
	},
	/* 跳转页面，关闭当前页面 */
	redirectTo: (url, params) => {
		url = getUrl(url, params)
		uni.redirectTo({
			url
		});
	},
	/* 关闭所有页面，打开到应用内的某个页面 */
	reLaunch: (url, params) => {
		url = getUrl(url, params)
		uni.reLaunch({
			url
		});
	},
	/* 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。 */
	switchTab: (url, params) => {
		url = getUrl(url, params)
		uni.switchTab({
			url
		});
	},
	/* 关闭当前页面，返回上一页面或多级页面 */
	navigateBack: (delta = 1) => {
		uni.navigateBack({
			delta
		});
	},
	/*** 提示框 */
	msg: (title, duration = 2000, mask = false, icon = 'none', success = function() {}, fail = function() {}) => {
		if (Boolean(title) === false) {
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon,
			success,
			fail
		});
	},
	prePage: () => {
		let pages = getCurrentPages();
		let prePage = pages[pages.length - 2];
		// #ifdef H5
		return prePage
		// #endif
		return prePage.$vm
	},
	showLoading: (title) => {
		uni.showLoading({
			title
		});
	},
	hideLoading: () => {
		uni.hideLoading();
	},
}

function getUrl(url, params) {
	const queryParams = urlParams(params)
	return `${url}${queryParams?('?'+queryParams):''}`
}

/**
 * url参数
 * @param {Object} paramsObj
 */
export function urlParams(obj) {
	let queryParams = ''
	for (let param in obj) {
		queryParams = queryParams ? `${queryParams}&` : ''
		queryParams += `${param}=${obj[param]}`
	}
	return queryParams
}
