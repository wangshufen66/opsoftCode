import axios from '@/libs/api.request'

// 清单
export const list = (params) => {
  return axios.request({
    url: '/environmentAnalysis/list',
    method: 'get',
    params: params
  })
}
// 分页获取列表
export const location = (params) => {
  return axios.request({
    url: '/environmentAnalysis/location',
    method: 'get',
    params: params
  })
}
// 分页获取列表
export const type = (params) => {
  return axios.request({
    url: '/environmentAnalysis/type',
    method: 'get',
    params: params
  })
}
// 分页获取列表
export const fee = (params) => {
  return axios.request({
    url: '/environmentAnalysis/fee',
    method: 'get',
    params: params
  })
}
