
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/cause/list',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/cause/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/cause/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update= (data) => {
  return axios.request({
    url: '/cause/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/cause/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/cause/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/cause/antiAudit',
    method: 'post',
    data: data
  })
}
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/cause/disable',
    method: 'post',
    data: data
  })
}
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/cause/antiDisable',
    method: 'post',
    data: data
  })
}
// 获取绑定字段列表
export const getFieldList = (data) => {
  return axios.request({
    url: '/cause/getFieldList',
    method: 'post',
    data: data
  })
}
// 设置绑定字段列表
export const setFieldList = (data) => {
  return axios.request({
    url: '/cause/setFieldList',
    method: 'post',
    data: data
  })
}
// 获取分组列表
export const getGroupList = (params) => {
  return axios.request({
    url: `/group/getGroupList/type=30`,
    method: 'get',
    params: params
  })
}


