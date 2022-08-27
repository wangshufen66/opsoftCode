import request from '@/common/js/request.js'

export const getColumn = (param) => {
	return request.globalRequest('/deviceReport/produceStaticsAll', 'GET', param)
}

// ?orgId=54&id=1184&startTime=2020-12-07&endTime=2020-12-08
export const getPlanActual = (param) => {
	return request.globalRequest('/deviceDataAnalysis/finalMaterialPlanActualProduceNumChart', 'GET', param)
}
// ?orgId=54&id=1184&startTime=2020-12-07&endTime=2020-12-08
export const getYesterdayToday = (param) => {
	return request.globalRequest('/deviceDataAnalysis/finalMaterialPlanActualProduceCompareDataByTime', 'GET', param)
}

// ?orgId=54&id=1184&startTime=2020-12-07&endTime=2020-12-08
export const getMaterialTable = (param) => {
	return request.globalRequest('/deviceDataAnalysis/finalMaterialProduceDataTable', 'GET', param)
}
