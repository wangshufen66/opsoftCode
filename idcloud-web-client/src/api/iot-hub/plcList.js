/* 设备加工信息 */
import axios from '@/libs/api.request'
import store from "../../store/index"
// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/plc/list',
    method: 'get',
    params: params
  })
}

export const getPlcList = (params) => {
  return axios.request({
    url: '/plc/list',
    method: 'get',
    params: params
  })
}

// 详情
export const findMoDetail = (id) => {
  return axios.request({
    url: `/plc/list?id=${id}&orgId=${store.state.user.userInfo.orgId}`,
    method: 'get',
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/plc/savePlc',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/plc/updatePlc',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (data) => {
  return axios.request({
    url: '/plc/delBatchPlc',
    method: 'post',
    data: data
  })
}

// plc batch
export const addPlcBatch = (data) => {
  return axios.request({
    url: '/plc/saveBatchPlc',
    method: 'post',
    data: data
  })
}

export const getPlcBrandList = (data) => {
  return axios.request({
    url: `/plcBrand/list`,
    method: 'get',
    params: data
  })
}

export const getConnectionManagementList = (data) => {
  return axios.request({
    url: `/connection/list`,
    method: 'get',
    params: data
  })
}
