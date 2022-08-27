
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/bom/getList',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/bom/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/bom/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update= (data) => {
  return axios.request({
    url: '/bom/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/bom/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/bom/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/bom/antiAudit',
    method: 'post',
    data: data
  })
}
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/bom/disable',
    method: 'post',
    data: data
  })
}
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/bom/antiDisable',
    method: 'post',
    data: data
  })
}
// 获取绑定字段列表
export const getFieldList = (data) => {
  return axios.request({
    url: '/bom/getFieldList',
    method: 'post',
    data: data
  })
}
// 设置绑定字段列表
export const setFieldList = (data) => {
  return axios.request({
    url: '/bom/setFieldList',
    method: 'post',
    data: data
  })
}
// 保存整个表体
// export const saveBomInfos = (data) => {
//   return axios.request({
//     url: '/bom/saveBomInfos',
//     method: 'post',
//     data: data
//   })
// }
// 单条更新
export const updateBomInfo = (data) => {
  return axios.request({
    url: '/bom/updateBomInfo',
    method: 'post',
    data: data
  })
}
// 单条新增
export const addBomInfo = (data) => {
  return axios.request({
    url: '/bom/addBomInfo',
    method: 'post',
    data: data
  })
}
// 批量删除表体
export const batchDelBomInfo = (data) => {
  return axios.request({
    url: '/bom/batchDelBomInfo',
    method: 'post',
    data: data
  })
}
// // 根据BomId 获取BomInfo表体
// export const getBomInfoByBomId = (params) => {
//   return axios.request({
//     url: '/bom/getBomInfoByBomId',
//     method: 'get',
//     params: params
//   })
// }
// 获取分组列表
export const getGroupList = (params) => {
  return axios.request({
    url: `/group/getGroupList/type=17`,
    method: 'get',
    params: params
  })
}

