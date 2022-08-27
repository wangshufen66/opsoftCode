import axios from '@/libs/api.request'
export const getList = (params) => {
  return axios.request({
    url: '/sparePart/getList',
    method: 'get',
    params: params
  })
}
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/sparePart/getDetail/${id}`,
    method: 'get',
  })
}
// 添加
export const add = (data) => {
  return axios.request({
    url: '/sparePart/add',
    method: 'post',
    data: data
  })
}
// 更新
export const update = (data) => {
  return axios.request({
    url: '/sparePart/update',
    method: 'post',
    data: data
  })
}
// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/sparePart/batchDel',
    method: 'post',
    data: data
  })
}
export const audit = (data) => {
  return axios.request({
    url: '/sparePart/audit',
    method: 'post',
    data: data
  })
}
export const antiAudit = (data) => {
  return axios.request({
    url: '/sparePart/antiAudit',
    method: 'post',
    data: data
  })
}
export const disable = (data) => {
  return axios.request({
    url: '/sparePart/disable',
    method: 'post',
    data: data
  })
}
export const antiDisable = (data) => {
  return axios.request({
    url: '/sparePart/antiDisable',
    method: 'post',
    data: data
  })
}
export const addList = (data) => {
  return axios.request({
    url: '/sparePart/addSparePart',
    method: 'post',
    data: data
  })
}
export const updateList = (data) => {
  return axios.request({
    url: '/sparePart/updateSparePart',
    method: 'post',
    data: data
  })
}
export const batchDelList = (data) => {
  return axios.request({
    url: '/sparePart/batchSparePartDel',
    method: 'post',
    data: data
  })
}
