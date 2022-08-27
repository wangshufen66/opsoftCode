import {
	getCurrentAppStage
} from '@/config/stage.js'
const getBaseUrl = () => {
	const devUrl = 'https://ikbt.idcloud.group'
	const prodUrl = 'https://ikb.idcloud.group'
	// 私有化部署 看板端口号为5050
	const portNum = 5050

	let baseUrl = ''
	const isLocalUser = uni.getStorageSync('isLocalUser')
	if (isLocalUser) {
		const config = uni.getStorageSync('networkConfig')
		const ipAddr = config.ipAddr
		baseUrl = `http://${ipAddr}:${portNum}/idcloud`
	} else {
		process.env.NODE_ENV === 'development' ?
			baseUrl = devUrl :
			(getCurrentAppStage() == 'dev' ? baseUrl = devUrl :
				baseUrl = prodUrl)
	}
	return baseUrl
}


export default getBaseUrl
