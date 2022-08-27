import axios from '@/libs/api.request'

export const findHumidityList = (params) => {
  return axios.request({
    url: '/humidity/list',
    method: 'get',
    params: params
  })
}

// 详情（echarts）（table）
export const detail = (data) => {
  return axios.request({
    url: `/humidity/detail`,
    method: 'post',
    data: data
  })
}

// // 详情
// export const findHumidityDetailTable = (data) => {
//   return axios.request({
//     url: `/humidity/detail`,
//     method: 'post',
//     data: data
//   })
// }
