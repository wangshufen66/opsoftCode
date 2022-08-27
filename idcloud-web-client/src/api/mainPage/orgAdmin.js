import axios from '@/libs/api.request'

export const getUserSum = (param) => {
  return axios.request({
    url: '/index/userSum',
    method: 'get',
    params: param
  })
}

export const getDeviceSum = (param) => {
  return axios.request({
    url: '/index/deviceSum',
    method: 'get',
    params: param
  })
}

export const getEnterpriseInfo = (param) => {
  return axios.request({
    url: '/index/enterpriseInfo',
    method: 'get',
    params: param
  })
}

// 功能使用率
export const getActiveStatistics = (param) => {
  return axios.request({
    url: '/index/activeStatistics',
    method: 'get',
    params: param
  })
}

// 活跃度
export const getActiveTrend = (param) => {
  return axios.request({
    url: '/index/activeTrend',
    method: 'post',
    data: param
  })
}

// 活跃度排行
export const getUserActiveRank = (param) => {
  return axios.request({
    url: '/index/UserActiveRank',
    method: 'get',
    params: param
  })
}

export const getUserCollect = (param) => {
  return axios.request({
    url: '/index/userCollectList',
    method: 'get',
    params: param
  })
}

export const updateUserCollect = (param) => {
  return axios.request({
    url: '/index/userCollect',
    method: 'post',
    data: param
  })
}
