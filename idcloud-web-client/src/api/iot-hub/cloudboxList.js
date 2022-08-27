/* 设备加工信息 */
import axios from '@/libs/api.request'

// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/cloudBox/list',
    method: 'get',
    params: params
  })
}

export const getCloudboxList = (params) => {
  return axios.request({
    url: '/cloudBox/list',
    method: 'get',
    params: params
  })
}

// 详情
export const findMoDetail = (data) => {
  return axios.request({
    url: `/cloudBox/list`,
    method: 'get',
    params: data
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/cloudBox/saveCloudbox',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/cloudBox/saveCloudbox',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (data) => {
  return axios.request({
    url: '/cloudBox/delBatchCloudbox',
    method: 'post',
    data: data
  })
}

// cloudbox batch
export const addCloudboxBatch = (data) => {
  return axios.request({
    url: '/cloudBox/saveCountCloudbox',
    method: 'post',
    data: data
  })
}

export const getCloudboxBrandList = (data) => {
  return axios.request({
    url: `/cloudTypeBox/findTypeList`,
    method: 'get',
    params: data
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
