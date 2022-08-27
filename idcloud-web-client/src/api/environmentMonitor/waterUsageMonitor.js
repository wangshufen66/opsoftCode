import axios from '@/libs/api.request'

export const findWaterList = (params) => {
  return axios.request({
    url: '/water/list',
    method: 'get',
    params: params
  })
}
// 详情（echarts）（table）
export const detail = (data) => {
  return axios.request({
    url: `/water/detail`,
    method: 'post',
    data: data
  })
}
// 燃气统计
export const usageStatistics = (params) => {
  return axios.request({
    url: '/water/usageStatistics',
    method: 'get',
    params: params
  })
}
