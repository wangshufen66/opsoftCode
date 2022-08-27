import axios from '@/libs/api.request'

export const getTree = (params) => {
  return axios.request({
    url: '/Terminal/getTree',
    params: params,
    method: 'get'
  })
}

export const getTableList = (params) => {
  return axios.request({
    url: '/cnc/list',
    method: 'get',
    params: params
  })
}
