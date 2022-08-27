/* 物料 */
import axios from '@/libs/api.request'

// 分页获取列表
export const findMaterialList = (params) => {
  return axios.request({
    url: '/material/getMaterialList',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/material/getMaterialDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/material/addMaterial',
    method: 'post',
    data: data
  })
}

// 更新
export const update = (data) => {
  return axios.request({
    url: '/material/updateMaterial',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/material/batchDelMaterial',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/material/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/material/antiAudit',
    method: 'post',
    data: data
  })
}
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/material/disable',
    method: 'post',
    data: data
  })
}
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/material/antiDisable',
    method: 'post',
    data: data
  })
}
// 获取绑定字段列表
export const getFieldList = (data) => {
  return axios.request({
    url: '/material/getFieldList',
    method: 'post',
    data: data
  })
}
// 设置绑定字段列表
export const setFieldList = (data) => {
  return axios.request({
    url: '/material/setFieldList',
    method: 'post',
    data: data
  })
}

// 获取物料类别
export const getMaterialType = (params) => {
  return axios.request({
    url: '/material/getMaterialType',
    method: 'get',
    params: params
  })
}
// 获取物料备件
export const getMaterialSparePart = (params) => {
  return axios.request({
    url: '/material/getMaterialSparePart',
    method: 'get',
    params: params
  })
}
// 获取分组列表
export const getGroupList = (params) => {
  return axios.request({
    url: `/group/getGroupList/type=1`,
    method: 'get',
    params: params
  })
}
