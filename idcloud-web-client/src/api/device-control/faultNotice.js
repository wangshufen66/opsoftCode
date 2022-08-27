import axios from '@/libs/api.request'
// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/faultNotice/getFaultNoticeList',
    method: 'get',
    params: params
  })
}
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/faultNotice/getDetail/${id}`,
    method: 'get'
  })
}
// 添加
export const add = (data) => {
  return axios.request({
    url: '/faultNotice/add',
    method: 'post',
    data: data
  })
}
// 更新
export const update= (data) => {
  return axios.request({
    url: '/faultNotice/update',
    method: 'post',
    data: data
  })
}
// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/faultNotice/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/faultNotice/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/faultNotice/antiAudit',
    method: 'post',
    data: data
  })
}
// 保存整个表体
export const addList = (data) => {
  return axios.request({
    url: '/faultNotice/saveNotifier',
    method: 'post',
    data: data
  })
}
// 批量删除表体
export const delList = (data) => {
  return axios.request({
    url: '/faultNotice/batchDelFaultNotifier',
    method: 'post',
    data: data
  })
}
// 保存整个表体
export const updateList = (data) => {
  return axios.request({
    url: '/faultNotice/updateFaultNotifier',
    method: 'post',
    data: data
  })
}
