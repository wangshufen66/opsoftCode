import axios from '@/libs/api.request'

///========================================
///左侧导航栏显示，找出类型定义
// export const getGroupList = (params) => {
//   return axios.request({
//     url: `/group/getGroupList/type=22`,
//     method: 'get',
//     params: params
//   })
// }
// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/workOrder/getList',
    method: 'get',
    params: params
  })
}
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/workOrder/getDetail/${id}`,
    method: 'get'
  })
}
// 添加
export const add = (data) => {
  return axios.request({
    url: '/workOrder/add',
    method: 'post',
    data: data
  })
}
// 更新
export const update = (data) => {
  return axios.request({
    url: '/workOrder/update',
    method: 'post',
    data: data
  })
}
// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/workOrder/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/workOrder/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/workOrder/antiAudit',
    method: 'post',
    data: data
  })
}
// 派工
export const dispatch = (data) => {
  return axios.request({
    url: '/workOrder/dispatch',
    method: 'post',
    data: data
  })
}
// 验收
export const acceptance = (data) => {
  return axios.request({
    url: '/workOrder/acceptance',
    method: 'post',
    data: data
  })
}
// 保存整个【汇报】表体
export const addList = (data) => {
  return axios.request({
    url: '/workOrder/saveWorkOrderReport',
    method: 'post',
    data: data
  })
}
// 批量删除【汇报】表体
export const batchDelList = (data) => {
  return axios.request({
    url: '/workOrder/batchDelWorkOrderReport',
    method: 'post',
    data: data
  })
}
// 保存整个【备件】表体
export const addList1 = (data) => {
  return axios.request({
    url: '/workOrder/savePcWorkOrderPart',
    method: 'post',
    data: data
  })
}
// 批量删除【备件】表体
export const batchDelList1 = (data) => {
  return axios.request({
    url: '/workOrder/batchDelWorkOrderPart',
    method: 'post',
    data: data
  })
}
// 分页获取列表
export const getWorkPlanList = (params) => {
  return axios.request({
    url: '/workPlan/getList',
    method: 'get',
    params: params
  })
}
