import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/additionalInfo/getList',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/additionalInfo/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/additionalInfo/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update= (data) => {
  return axios.request({
    url: '/additionalInfo/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/additionalInfo/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/additionalInfo/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/additionalInfo/antiAudit',
    method: 'post',
    data: data
  })
}
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/additionalInfo/disable',
    method: 'post',
    data: data
  })
}
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/additionalInfo/antiDisable',
    method: 'post',
    data: data
  })
}
// 获取绑定字段列表
export const getFieldList = (data) => {
  return axios.request({
    url: '/additionalInfo/getFieldList',
    method: 'post',
    data: data
  })
}
// 设置绑定字段列表
export const setFieldList = (data) => {
  return axios.request({
    url: '/additionalInfo/setFieldList',
    method: 'post',
    data: data
  })
}
// 获取分组列表
export const getGroupList = (params) => {
  return axios.request({
    url: `/group/getGroupList/type=5`,
    method: 'get',
    params: params
  })
}

