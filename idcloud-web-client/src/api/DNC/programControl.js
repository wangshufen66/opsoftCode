import axios from '@/libs/api.request'

export const getTableList = (params) => {
  return axios.request({
    url: '/dncProgram/getList',
    params: params,
    method: 'get'
  })
}


export const addOne = (data) => {
  return axios.request({
    url: '/dncProgram/add',
    data: data,
    method: 'post'
  })
}

export const updateOne = (data) => {
  return axios.request({
    url: '/dncProgram/update',
    data: data,
    method: 'post'
  })
}

export const batchDel = (data) => {
  return axios.request({
    url: '/dncProgram/batchDel',
    data: data,
    method: 'post'
  })
}

export const batchAudit = (data) => {
  return axios.request({
    url: '/dncProgram/audit',
    data: data,
    method: 'post'
  })
}

export const batchAntiAudit = (data) => {
  return axios.request({
    url: '/dncProgram/antiAudit',
    data: data,
    method: 'post'
  })
}
