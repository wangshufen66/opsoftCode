import axios from '@/libs/api.request'

export const findTemperatureList = (params) => {
  return axios.request({
    url: '/temperature/list',
    method: 'get',
    params: params
  })
}

// 详情（echarts）（table）
export const detail = (data) => {
  return axios.request({
    url: `/temperature/detail`,
    method: 'post',
    data: data
  })
}
//
// // 详情
// export const findTemperatureDetailTable = (data) => {
//   return axios.request({
//     url: `/temperature/detail`,
//     method: 'post',
//     data: data
//   })
// }
