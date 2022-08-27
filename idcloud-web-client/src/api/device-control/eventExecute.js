import axios from '@/libs/api.request'
// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/trigger/getList',
    method: 'get',
    params: params
  })
}
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/trigger/getDetail/${id}`,
    method: 'get'
  })
}
// 添加
export const add = (data) => {
  return axios.request({
    url: '/trigger/save',
    method: 'post',
    data: data
  })
}
// 更新
export const update= (data) => {
  return axios.request({
    url: '/trigger/save',
    method: 'post',
    data: data
  })
}
// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/trigger/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/trigger/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/trigger/antiAudit',
    method: 'post',
    data: data
  })
}
// 保存整个表体
export const addList1 = (data) => {
  return axios.request({
    url: '/trigger/saveCondition',
    method: 'post',
    data: data
  })
}
// 保存整个表体
export const updateList1 = (data) => {
  return axios.request({
    url: '/trigger/updateCondition',
    method: 'post',
    data: data
  })
}
// 批量删除表体
export const delList1 = (data) => {
  return axios.request({
    url: '/trigger/batchDelTriggerCondition',
    method: 'post',
    data: data
  })
}
// 保存整个表体
export const addList = (data) => {
  return axios.request({
    url: '/trigger/saveNotifier',
    method: 'post',
    data: data
  })
}
// 批量删除表体
export const updateList = (data) => {
  return axios.request({
    url: '/trigger/updateNotifier',
    method: 'post',
    data: data
  })
}
// 批量删除表体
export const delList = (data) => {
  return axios.request({
    url: '/trigger/batchDelTriggerControl',
    method: 'post',
    data: data
  })
}



