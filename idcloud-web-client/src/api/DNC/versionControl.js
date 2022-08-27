import axios from '@/libs/api.request'

export const getTableList = (params) => {
  return axios.request({
    url: '/dncProgram/getList',
    params: params,
    method: 'get'
  })
}

export const changeVersion = (data) => {
  return axios.request({
    url: '/dncProgram/switchVersion',
    data: data,
    method: 'post'
  })
}
