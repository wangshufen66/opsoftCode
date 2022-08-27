export const checkVersion = (param) => {
	let url = 'http://api.idcloud.group/idcloud/app/getVersion'
	// const isLocalUser = uni.getStorageSync('isLocalUser')
	// if (isLocalUser) {
	// 	const config = uni.getStorageSync('networkConfig')
	// 	const ipAddr = config.ipAddr
	// 	url = `http://${ipAddr}:3001/getVersion`
	// }
	console.log('版本检测', url)
	return uni.request({
		url: url,
		method: 'GET',
		data: param
	})
}
