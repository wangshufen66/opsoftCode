import {
	checkVersion
} from '@/api/version.js'
import {
	getCurrentAppStage
} from '@/config/stage.js'
import {
	getCurrentVersion
} from '@/config/version.js'

/***
 *	@return {object} code: 返回服务器版本号与当前版本号的差值， 如果出现问题则返回-1， version: 当前版本号, serverVersion: 服务器版本号
 */
export const checkAppVersion = async () => {
	const param = {
		env: process.env.NODE_ENV === 'development' ? 'development' : (getCurrentAppStage() == 'dev' ?
			'development' :
			'production')
	}
	const appInfo = process.env.NODE_ENV === 'development' ? getCurrentVersion().dev : getCurrentVersion().prod
	try {
		let res = await Promise.resolve(checkVersion(param))
		res = res[1]?res[1].data:{};
		console.log('返回结果', res)
		const appVersion = appInfo.version_number?parseInt(appInfo.version_number):'';
		const serverAppVersion = res.data?parseInt(res.data.version_number):'';
		return {
			code: serverAppVersion - appVersion,
			version: appInfo.version?appInfo.version:'',
			serverVersion: res.data?res.data.version:'',
			downloadUrl: res.data.download_address,
			msgArr: res.data.msgArr
		}
	} catch (e) {
		console.log(e);
		return {
			code: -1
		}
	}
}
