import axios from '@/libs/api.request'
import {
  commonUpload
} from '@/api/publicApis'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/workPlan/getList',
    method: 'get',
    params: params
  })
}
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/workPlan/getDetail/${id}`,
    method: 'get'
  })
}
// 添加
export const add = (data) => {
  return axios.request({
    url: '/workPlan/add',
    method: 'post',
    data: data
  })
}
// 更新
export const update = (data) => {
  return axios.request({
    url: '/workPlan/update',
    method: 'post',
    data: data
  })
}
// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/workPlan/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/workPlan/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/workPlan/antiAudit',
    method: 'post',
    data: data
  })
}
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/workPlan/disable',
    method: 'post',
    data: data
  })
}
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/workPlan/antiDisable',
    method: 'post',
    data: data
  })
}
//表体——————————————————————————————————————————————————————————————————————
// 添加
export const addList = (data) => {
  return axios.request({
    url: '/workPlan/addPart',
    method: 'post',
    data: data
  })
}
// 更新
export const updateList = (data) => {
  return axios.request({
    url: '/workPlan/updatePart',
    method: 'post',
    data: data
  })
}
// 删除
export const batchDelList = (data) => {
  return axios.request({
    url: '/workPlan/batchDelPart',
    method: 'post',
    data: data
  })
}

// 维保方案
export const getPlanTemplate = (params) => {
  return axios.request({
    url: '/workPlan/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importPlanTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/workPlan/importDataExcel?orgId=${orgId}`)
}

