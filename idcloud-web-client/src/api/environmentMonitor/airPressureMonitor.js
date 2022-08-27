import axios from '@/libs/api.request'

export const findAirPressureList = (params) => {
  return axios.request({
    url: '/pressure/list',
    method: 'get',
    params: params
  })
}

// 详情（echarts）+（table）
export const detail = (data) => {
  return axios.request({
    url: `/pressure/detail`,
    method: 'post',
    data: data
  })
}


