
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/docType/getList',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/docType/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/docType/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update= (data) => {
  return axios.request({
    url: '/docType/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/docType/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/docType/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/docType/antiAudit',
    method: 'post',
    data: data
  })
}
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/docType/disable',
    method: 'post',
    data: data
  })
}
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/docType/antiDisable',
    method: 'post',
    data: data
  })
}
// // 获取绑定字段列表
// export const getFieldList = (data) => {
//   return axios.request({
//     url: '/docType/getFieldList',
//     method: 'post',
//     data: data
//   })
// }
// // 设置绑定字段列表
// export const setFieldList = (data) => {
//   return axios.request({
//     url: '/docType/setFieldList',
//     method: 'post',
//     data: data
//   })
// }

// 分页获取【业务对象】列表
export const getAll = (params) => {
  return axios.request({
    url: '/businessObj/getAll',
    method: 'get',
    params: params
  })
}

