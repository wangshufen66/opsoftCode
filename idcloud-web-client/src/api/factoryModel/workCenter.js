
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/workCenter/getList',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/workCenter/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/workCenter/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update= (data) => {
  return axios.request({
    url: '/workCenter/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/workCenter/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/workCenter/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/workCenter/antiAudit',
    method: 'post',
    data: data
  })
}
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/workCenter/disable',
    method: 'post',
    data: data
  })
}
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/workCenter/antiDisable',
    method: 'post',
    data: data
  })
}
// 获取绑定字段列表
export const getFieldList = (data) => {
  return axios.request({
    url: '/workCenter/getFieldList',
    method: 'post',
    data: data
  })
}
// 设置绑定字段列表
export const setFieldList = (data) => {
  return axios.request({
    url: '/workCenter/setFieldList',
    method: 'post',
    data: data
  })
}
// 获取分组列表
export const getGroupList = (params) => {
  return axios.request({
    url: `/group/getGroupList/type=13`,
    method: 'get',
    params: params
  })
}


