/* 设备加工信息 */
import axios from '@/libs/api.request'
import store from "../../store/index"

// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/cnc/list',
    method: 'get',
    params: params
  })
}

export const getCncList = (params) => {
  return axios.request({
    url: '/cnc/list',
    method: 'get',
    params: params
  })
}

// 详情
export const findMoDetail = (id) => {
  return axios.request({
    url: `/cnc/list?id=${id}&orgId=${store.state.user.userInfo.orgId}`,
    method: 'get',
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/cnc/saveCnc',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/cnc/updateCnc',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (data) => {
  return axios.request({
    url: '/cnc/delBatchCnc',
    method: 'post',
    data: data
  })
}

// cnc batch
export const addCncBatch = (data) => {
  return axios.request({
    url: '/cnc/saveBatchCnc',
    method: 'post',
    data: data
  })
}

export const getCncBrandList = (data) => {
  return axios.request({
    url: `/cncBrand/list`,
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
