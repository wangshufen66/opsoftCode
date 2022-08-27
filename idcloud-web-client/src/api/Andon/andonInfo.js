import axios from '@/libs/api.request'

export const getTableList = (params) => {
  return axios.request({
    url: '/andon/getList',
    params: params,
    method: 'get'
  })
}

export const getFormData = (id) => {
  return axios.request({
    url: `/andon/getDetail/${id}`,
    method: 'get'
  })
}


export const getInfoPointData = (id) => {
  return axios.request({
    url: `/andon/getBox8302Point/${id}`,
    method: 'get'
  })
}

export const addOne = (data) => {
  return axios.request({
    url: '/andon/add',
    data: data,
    method: 'post'
  })
}

export const updateOne = (data) => {
  return axios.request({
    url: '/andon/update',
    data: data,
    method: 'post'
  })
}

export const batchDel = (data) => {
  return axios.request({
    url: '/andon/batchDel',
    data: data,
    method: 'post'
  })
}

export const batchAudit = (data) => {
  return axios.request({
    url: '/andon/audit',
    data: data,
    method: 'post'
  })
}

export const batchAntiAudit = (data) => {
  return axios.request({
    url: '/andon/antiAudit',
    data: data,
    method: 'post'
  })
}

export const batchDisable = (data) => {
  return axios.request({
    url: '/andon/disable',
    data: data,
    method: 'post'
  })
}

export const batchAntiDisable = (data) => {
  return axios.request({
    url: '/andon/antiDisable',
    data: data,
    method: 'post'
  })
}

export const updateInfoPoint = (data) => {
  return axios.request({
    url: '/box8302Point/updateBox8302Point',
    data: data,
    method: 'post'
  })
}
