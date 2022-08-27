import request from '@/common/js/request.js'

export const getErrorList = (param) => {
	return request.globalRequest('/deviceDataAnalysis/err', 'GET', param)
}

export const getPieData = (param) => {
	return request.globalRequest('/deviceDataAnalysis/deviceErrStatusProportionStatics', 'GET', param)
}

export const getErrorListV2 = (param) => {
	return request.globalRequest('/monitorWarning/getMonitorWarningAnalysisList', 'GET', param)
}
