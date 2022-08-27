import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/productionDevice/list',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/productionDevice/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/productionDevice/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update = (data) => {
  return axios.request({
    url: '/productionDevice/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/productionDevice/batchDel',
    method: 'post',
    data: data
  })
}
export const audit = (data) => {
  return axios.request({
    url: '/productionDevice/audit',
    method: 'post',
    data: data
  })
}
export const antiAudit = (data) => {
  return axios.request({
    url: '/productionDevice/antiAudit',
    method: 'post',
    data: data
  })
}

//——————————————————————————————表体—————————————————————————
export const addList = (data) => {
  return axios.request({
    url: '/productionDeviceTask/add',
    method: 'post',
    data: data
  })
}
export const updateList = (data) => {
  return axios.request({
    url: '/productionDeviceTask/update',
    method: 'post',
    data: data
  })
}
export const delList = (data) => {
  return axios.request({
    url: '/productionDeviceTask/batchDel',
    method: 'post',
    data: data
  })
}
export const startWork = (data) => {
  return axios.request({
    url: '/productionDeviceTask/startWork',
    method: 'post',
    data: data
  })
}
export const finishWork = (data) => {
  return axios.request({
    url: '/productionDeviceTask/endWork',
    method: 'post',
    data: data
  })
}
export const bodyAudit = (data) => {
  return axios.request({
    url: '/productionDeviceTask/audit',
    method: 'post',
    data: data
  })
}
//表体新增任务单
export const getProcessList = (params) => {
  return axios.request({
    url: '/productionDeviceTask/getProcessList',
    method: 'get',
    params: params
  })
}
