import axios from '@/libs/api.request'

export const getTableList = (params) => {
  return axios.request({
    url: '/dncDistribution/getList',
    params: params,
    method: 'get'
  })
}

export const getCncList = (params) => {
  return axios.request({
    url: '/cnc/list',
    method: 'get',
    params: params
  })
}

export const getCncListUni = (params) => {
  return axios.request({
    url: '/cnc/DistributionList',
    method: 'get',
    params: params
  })
}


export const getProgramList = (params) => {
  return axios.request({
    url: '/dncProgram/getList',
    params: params,
    method: 'get'
  })
}



export const addOne = (data) => {
  return axios.request({
    url: '/dncDistribution/add',
    data: data,
    method: 'post'
  })
}

export const updateOne = (data) => {
  return axios.request({
    url: '/dncDistribution/update',
    data: data,
    method: 'post'
  })
}

export const batchDel = (data) => {
  return axios.request({
    url: '/dncDistribution/batchDel',
    data: data,
    method: 'post'
  })
}

export const batchDisable = (data) => {
  return axios.request({
    url: '/dncDistribution/disable',
    data: data,
    method: 'post'
  })
}

export const batchAntiDisable = (data) => {
  return axios.request({
    url: '/dncDistribution/antiDisable',
    data: data,
    method: 'post'
  })
}


export const distribute = (data) => {
  return axios.request({
    url: '/dncDistribution/distribute',
    data: data,
    method: 'post'
  })
}
