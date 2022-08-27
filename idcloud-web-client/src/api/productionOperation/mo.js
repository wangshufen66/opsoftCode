/* 设备加工信息 */
import axios from '@/libs/api.request'

// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/produceTask/listProduceTask',
    method: 'get',
    params: params
  })
}

// 详情
export const findMoDetail = (id) => {
  return axios.request({
    url: `/produceTask/detailProduceTask/${id}`,
    method: 'post'
  })
}

// 获取容器的车间列表
export const getWorkshopListByContainer = info => {
  return axios.request({
    url: '/container/getWorkshopListByContainer',
    params: info,
    method: 'get'
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/produceTask/addProduceTask',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/produceTask/updateProduceTask',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (id) => {
  // const params = {
  //   wp_uid: id
  // }
  return axios.request({
    url: '/produceTask/deleteProduceTask',
    method: 'post',
    data: {
      id: id
    }
  })
}

export const findFactoryWorkshopList = (params) => {
  return axios.request({
    url: '/container/getFactoryWorkshopList',
    method: 'get',
    params:params
  })
}

// 审核
export const checkMo = (data) => {
  // const params = {
  //   wp_uid: id
  // }
  return axios.request({
    url: '/produceTask/auditProduceTask',
    method: 'post',
    data: data
  })
}

// 反审核
export const checkNoMo = (data) => {
  // const params = {
  //   wp_uid: id
  // }
  return axios.request({
    url: '', //'/produceTask/cancelAssignProduceTask',
    method: 'post',
    data: data
  })
}

// 下达
export const transmitMo = (data) => {
  // const params = {
  //   wp_uid: id
  // }
  return axios.request({
    url: '/produceTask/assignProduceTask',
    method: 'post',
    data: data
  })
}

// 结案
export const closeMo = (data) => {
  // const params = {
  //   wp_uid: id
  // }
  return axios.request({
    url: '/produceTask/closeProduceTask',
    method: 'post',
    data: data
  })
}

// 反结案
export const closeNoMo = (data) => {
  // const params = {
  //   wp_uid: id
  // }
  return axios.request({
    url: '/produceTask/reopenProdeceTask',
    method: 'post',
    data: data
  })
}

// 获取绑定字段列表
export const produceTaskFieldList = (data) => {
  return axios.request({
    url: '/produceTask/produceTaskFieldList',
    method: 'post',
    data: data
  })
}
// 设置绑定字段列表
export const setProduceTaskFieldList = (data) => {
  return axios.request({
    url: '/produceTask/setProduceTaskFieldList',
    method: 'post',
    data: data
  })
}
