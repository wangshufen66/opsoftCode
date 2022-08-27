import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/productionDeviceTask/getQualityInspectionList',
    method: 'get',
    params: params
  })
}
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/productionDeviceTask/getQualityInspectionDetail/${id}`,
    method: 'get'
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/productionDeviceTask/qualityInspectionAudit',
    method: 'post',
    data: data[0]
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/productionDeviceTask/antiQualityInspectionAudit',
    method: 'post',
    data: data[0]
  })
}
// 质检
export const qualityInspection  = (data) => {
  return axios.request({
    url: '/productionDeviceTask/qualityInspection',
    method: 'post',
    data: data[0]
  })
}
// 反质检
export const antiQualityInspection = (data) => {
  return axios.request({
    url: '/productionDeviceTask/antiQualityInspection',
    method: 'post',
    data: data[0]
  })
}

//——————————————————————————————表体—————————————————————————
export const addList = (data) => {
  return axios.request({
    url: '/qualityInspection/add',
    method: 'post',
    data: data
  })
}
export const updateList= (data) => {
  return axios.request({
    url: '/qualityInspection/update',
    method: 'post',
    data: data
  })
}
export const delList = (data) => {
  return axios.request({
    url: '/qualityInspection/batchDel',
    method: 'post',
    data: data
  })
}
