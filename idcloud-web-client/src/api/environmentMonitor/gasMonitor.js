import axios from '@/libs/api.request'

export const findGasList = (params) => {
  return axios.request({
    url: '/gas/list',
    method: 'get',
    params: params
  })
}
// 详情（echarts）（table）
export const detail = (data) => {
  return axios.request({
    url: `/gas/detail`,
    method: 'post',
    data: data
  })
}
// 燃气统计
export const usageStatistics = (params) => {
  return axios.request({
    url: '/gas/usageStatistics',
    method: 'get',
    params: params
  })
}
