import axios from '@/libs/api.request'

export const findElectricList = (params) => {
  return axios.request({
    url: '/electricity/list',
    method: 'get',
    params: params
  })
}

// 详情（echarts）（table）
export const detail = (data) => {
  return axios.request({
    url: `/electricity/detail`,
    method: 'post',
    data: data
  })
}

// 电量统计
export const usageStatistics = (params) => {
  return axios.request({
    url: '/electricity/usageStatistics',
    method: 'get',
    params: params
  })
}
