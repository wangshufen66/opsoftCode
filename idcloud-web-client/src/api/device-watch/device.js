import axios from '@/libs/api.request'

// 设备监测api
// 获取左树
export const getTree = param => {
  return axios.request({
    url: '/container/getContainerTree',
    method: 'get',
    params: param
  })
}

// 获取容器下信息点的数据
export const getInfoPointData = param => {
  return axios.request({
    url: '/container/getPointListByContainer',
    method: 'get',
    params: param
  })
}

// 获取车间信息
export const getDepartmentData = param => {
  return axios.request({
    url: '/container/getWorkshopListByContainer',
    method: 'get',
    params: param
  })
}

// 获取设备信息
export const getDeviceData = param => {
  return axios.request({
    url: '/container/getDeviceListByContainer',
    method: 'get',
    params: param
  })
}

// 获取信息点信息
export const getInfoPoint = param => {
  return axios.request({
    url: '/container/getContainer',
    method: 'get',
    params: param
  })
}

export const postChartData = data => {
  return axios.request({
    url: '/container/getPointHis',
    method: 'post',
    data: data
  })
}
//新增api
//获取【容器】右侧上半部的图表信息
export const getEquipmentRate = params => {
  return axios.request({
    url: '/container/getEquipmentRate',
    method: 'get',
    params: params
  })
}
//获取【信息点】右侧上半部的图表信息
export const getEquipmentRateSlice = params => {
  return axios.request({
    url: '/container/getEquipmentRateSlice',
    method: 'get',
    params: params
  })
}
//获取容器右侧下半部的图表信息
export const getWorkshopListByContainer = params => {
  return axios.request({
    url: '/container/getWorkshopListByContainer',
    method: 'get',
    params: params
  })
}
// 获取车间、工厂、设备
export const getContainerPcAnalysisList = param => {
  return axios.request({
    url: '/container/getContainerPcAnalysisList',
    method: 'get',
    params: param
  })
}
//获取一个车间下的设备
export const findContainerList = param => {
  return axios.request({
    url: '/container/findContainerList',
    method: 'get',
    params: param
  })
}
// 获取车间、工厂、设备
export const getEquipmentPieRateSlice = param => {
  return axios.request({
    url: '/container/getEquipmentPieRateSlice',
    method: 'get',
    params: param
  })
}
