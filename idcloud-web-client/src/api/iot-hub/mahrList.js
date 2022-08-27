/* 设备加工信息 */
import axios from '@/libs/api.request'
import store from "../../store/index"
// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/mahr/list',
    method: 'get',
    params: params
  })
}

export const getMahrList = (params) => {
  return axios.request({
    url: '/mahr/list',
    method: 'get',
    params: params
  })
}

// 详情 此处理应需要修改
export const findMoDetail = (id) => {
  return axios.request({
    url: `/mahr/list?id=${id}&orgId=${store.state.user.userInfo.orgId}`,
    method: 'get',
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/mahr/saveMahr',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/mahr/updateMahr',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (data) => {
  return axios.request({
    url: '/mahr/delBatchMahr',
    method: 'post',
    data: data
  })
}

// mahr batch
export const addMahrBatch = (data) => {
  return axios.request({
    url: '/mahr/saveBatchMahr',
    method: 'post',
    data: data
  })
}

export const getMahrBrandList = (data) => {
  return axios.request({
    url: `/mahrBrand/list`,
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
