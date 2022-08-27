/* 设备加工信息 */
import axios from '@/libs/api.request'
import store from "../../store/index"
// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/box8302/list',
    method: 'get',
    params: params
  })
}

export const getX8302boxList = (params) => {
  return axios.request({
    url: '/box8302/list',
    method: 'get',
    params: params
  })
}

// 详情
export const findMoDetail = (id) => {
  return axios.request({
    url: `/box8302/list?id=${id}&orgId=${store.state.user.userInfo.orgId}`,
    method: 'get',
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/box8302/saveBox8302',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/box8302/updateBox8302',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (data) => {
  return axios.request({
    url: '/box8302/delBatchBox8302',
    method: 'post',
    data: data
  })
}

// cloudbox batch
export const addX8302boxBatch = (data) => {
  return axios.request({
    url: '/box8302/saveBatchBox8302',
    method: 'post',
    data: data
  })
}

export const getX8302boxBrandList = (data) => {
  return axios.request({
    url: `/Box8302Brand/list`,
    method: 'get',
    params: data
  })
}
export const getConnectionManagementList = (params) => {
  return axios.request({
    url: '/connection/list',
    method: 'get',
    params: params
  })
}



// 获取从机列表

export const getChildDeviceList = (data) => {
  return axios.request({
    url: `/cloudBox/findCloudboxFromList`,
    method: 'get',
    params: data
  })
}

export const addSlaveDevice = (data) => {
  return axios.request({
    url: '/cloudBox/saveCloudboxFrom',
    method: 'post',
    data: data
  })
}

export const updateSlaveDevice = (data) => {
  return axios.request({
    url: '/cloudBox/saveCloudboxFrom',
    method: 'post',
    data: data
  })
}


export const deleteSlaveDevice = (data) => {
  return axios.request({
    url: '/cloudBox/delCloudboxFrom',
    method: 'post',
    data: data
  })
}

export const enableSlaveDevice = (data) => {
  return axios.request({
    url: '/cloudBox/effectCloudboxFrom',
    method: 'post',
    data: data
  })
}

export const sendSlaveDevice = (data) => {
  return axios.request({
    url: '/cloudBox/sendCloudboxFrom',
    method: 'post',
    data: data
  })
}


export const getConfigList = (data) => {
  return axios.request({
    url: `/cloudBox/getCloudboxLink`,
    method: 'get',
    params: data
  })
}

export const getConfigStatus = (data) => {
  return axios.request({
    url: '/cloudBox/sendGetMac',
    method: 'post',
    data: data
  })
}
export const reloadConfig = (data) => {
  return axios.request({
    url: '/cloudBox/restartCloudbox',
    method: 'post',
    data: data
  })
}
export const saveConfig = (data) => {
  return axios.request({
    url: '/cloudBox/editCloudboxLink',
    method: 'post',
    data: data
  })
}
export const dispatchConfig = (data) => {
  return axios.request({
    url: '/cloudBox/sendCloudboxLink',
    method: 'post',
    data: data
  })
}
