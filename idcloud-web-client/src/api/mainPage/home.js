import axios from '@/libs/api.request'

// 首页
//设备数量
export const getEquipmentRate = param => {
  return axios.request({
    url: '/index/container/getEquipmentRate',
    method: 'get',
    params: param
  })
};
//故障信息
export const getFaultUnfinishedCount = param => {
  return axios.request({
    url: '/index/monitorFault/getUnfinishedCount',
    method: 'get',
    params: param
  })
};
//预警信息
export const getWarningUnfinishedCount = param => {
  return axios.request({
    url: '/index/monitorWarning/getUnfinishedCount',
    method: 'get',
    params: param
  })
};
//获取企业详情
export const getOrgDetail = param => {
  return axios.request({
    url: '/index/enterpriseInfo',
    method: 'get',
    params: param
  })
};
//首页 =》运行分析
export const running = (params) => {
  return axios.request({
    url: '/index/deviceDataAnalysis/running',
    method: 'get',
    params: params
  })
};
//首页 =》 利用率
export const usage = (params) => {
  return axios.request({
    url: '/index/deviceDataAnalysis/usage',
    method: 'get',
    params: params
  })
};
//首页=》故障分析
export const err = (params) => {
  return axios.request({
    url: '/index/deviceDataAnalysis/err',
    method: 'get',
    params: params
  })
};
//首页=》成品产量分析
export const finalMaterialPlanActualProduceNumChart = (params) => {
  return axios.request({
    url: '/index/deviceDataAnalysis/finalMaterialPlanActualProduceNumChart',
    method: 'get',
    params: params
  })
};
// 首页=》设备产量统计
export const produceStatics = (params) => {
  return axios.request({
    url: '/index/deviceReport/produceStatics',
    method: 'get',
    params: params
  })
};
