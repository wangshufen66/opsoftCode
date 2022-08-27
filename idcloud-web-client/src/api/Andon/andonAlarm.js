import axios from '@/libs/api.request'

export const getTableList = (params) => {
  return axios.request({
    url: '/andonWarning/getList',
    params: params,
    method: 'get'
  })
}

export const getFormData = (param) => {
  return axios.request({
    url: `/andonWarning/getList`,
    params: param,
    method: 'get'
  })
}


export const getInfoPointData = (id) => {
  return axios.request({
    url: `/andonWarning/getBox8302Point/${id}`,
    method: 'get'
  })
}

export const addOne = (data) => {
  return axios.request({
    url: '/andonWarning/add',
    data: data,
    method: 'post'
  })
}

export const updateOne = (data) => {
  return axios.request({
    url: '/andonWarning/update',
    data: data,
    method: 'post'
  })
}

export const batchDel = (data) => {
  return axios.request({
    url: '/andonWarning/batchDel',
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


export const startHandleIssue = (data) => {
  return axios.request({
    url: '/andonWarning/disposeStart',
    params: data,
    method: 'get'
  })
}

export const finishIssue = (data) => {
  return axios.request({
    url: '/andonWarning/disposeEnd',
    params: data,
    method: 'get'
  })
}
