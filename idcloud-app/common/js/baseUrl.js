import {
	getCurrentAppStage
} from '@/config/stage.js'
const getBaseUrl = () => {
	// const devUrl = 'http://api.idcloud.group/idcloud' //'https://apitest.idcloud.group/idcloud'
	const prodUrl = 'http://api.idcloud.group/idcloud'
	const devUrl = 'http://192.168.0.167:7060/idcloud'
	// const prodUrl = 'http://192.168.0.167:7060/idcloud'

	/*  */
	let baseUrl = '';
	const isLocalUser = uni.getStorageSync('isLocalUser')
	if (isLocalUser) {
		const config = uni.getStorageSync('networkConfig')
		const ipAddr = config.ipAddr
		const portNum = config.port
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
