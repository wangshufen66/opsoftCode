import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/productionOrder/list',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/productionOrder/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/productionOrder/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update= (data) => {
  return axios.request({
    url: '/productionOrder/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/productionOrder/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/productionOrder/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/productionOrder/antiAudit',
    method: 'post',
    data: data
  })
}
// 下达
export const issued = (data) => {
  return axios.request({
    url: '/productionOrder/assign',
    method: 'post',
    data: data
  })
}
// 反下达
export const antiIssued = (data) => {
  return axios.request({
    url: '/productionOrder/antiAssign',
    method: 'post',
    data: data
  })
}
// 挂起
export const hang = (data) => {
  return axios.request({
    url: '/productionOrder/suspend',
    method: 'post',
    data: data
  })
}
// 反挂起
export const antiHang  = (data) => {
  return axios.request({
    url: '/productionOrder/antiSuspend',
    method: 'post',
    data: data
  })
}
// 结案
export const end = (data) => {
  return axios.request({
    url: '/productionOrder/end',
    method: 'post',
    data: data
  })
}
// 反结案
export const antiEnd  = (data) => {
  return axios.request({
    url: '/productionOrder/antiEnd',
    method: 'post',
    data: data
  })
}
//获取容器列表
export const getContainerList = (params) => {
  return axios.request({
    url: '/container/getContainerList',
    method: 'get',
    params: params
  })
}
//——————————————————————————————表体—————————————————————————
export const addList = (data) => {
  return axios.request({
    url: '/productionOrderProcess/add',
    method: 'post',
    data: data
  })
}
export const updateList= (data) => {
  return axios.request({
    url: '/productionOrderProcess/update',
    method: 'post',
    data: data
  })
}
export const delList = (data) => {
  return axios.request({
    url: '/productionOrderProcess/batchDel',
    method: 'post',
    data: data
  })
}
export const outsource = (data) => {
  return axios.request({
    url: '/productionOrderProcess/outsource',
    method: 'post',
    data: data
  })
}
export const receive = (data) => {
  return axios.request({
    url: '/productionOrderProcess/receive',
    method: 'post',
    data: data
  })
}

