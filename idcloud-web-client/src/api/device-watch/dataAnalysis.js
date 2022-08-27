import axios from '@/libs/api.request'
//数据分析=》运行分析=》车间
export const running = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/running',
    method: 'get',
    params: params
  })
};
//数据分析=》运行分析=》设备
export const getEquipmentRateSlice = (params) => {
  return axios.request({
    url: '/container/getEquipmentRateSlice',
    method: 'get',
    params: params
  })
};
//数据分析=》故障分析=》table + 右侧chart
export const err = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/err',
    method: 'get',
    params: params
  })
};
//数据分析=》故障分析=》左侧chart
export const deviceErrStatusProportionStatics = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/deviceErrStatusProportionStatics',
    method: 'get',
    params: params
  })
};
//数据分析=》故障分析=》详情
export const detail = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/err/detail',
    method: 'get',
    params: params
  })
};
//数据分析=》物料产量分析 =》左侧chart   —— 物料产量数据
export const materialProduce = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/materialProduce',
    method: 'get',
    params: params
  })
};
//数据分析=》物料产量分析=》右侧chart —— 物料产量同比分析
export const materialProduceNumCompareChart = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/materialProduceNumCompareChart',
    method: 'get',
    params: params
  })
};
//数据分析=》物料产量分析=》table —— 物料产量统计信息 表
export const materialProduceDataTable = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/materialProduceDataTable',
    method: 'get',
    params: params
  })
};
//数据分析=》成品产量分析 =》左侧chart   —— 计划产量和实际产量分析
export const finalMaterialPlanActualProduceNumChart = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/finalMaterialPlanActualProduceNumChart',
    method: 'get',
    params: params
  })
};
//数据分析=》成品产量分析=》右侧chart —— 产量同比分析
export const finalMaterialPlanActualProduceCompareDataByTime = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/finalMaterialPlanActualProduceCompareDataByTime',
    method: 'get',
    params: params
  })
};
//数据分析=》成品产量分析=》table —— 成品产量统计信息
export const finalMaterialProduceDataTable = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/finalMaterialProduceDataTable',
    method: 'get',
    params: params
  })
};
//数据分析=》利用率分析 =》右侧chart 左侧chart —— 设备利用率  车间利用率
export const usage = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/usage',
    method: 'get',
    params: params
  })
};
//数据分析=》利用率分析=》table —— 设备利用率统计信息
export const table = (params) => {
  return axios.request({
    url: '/deviceDataAnalysis/usage/table',
    method: 'get',
    params: params
  })
};
