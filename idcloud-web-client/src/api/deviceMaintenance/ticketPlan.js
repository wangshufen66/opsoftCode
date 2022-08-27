/* 设备加工信息 */
import axios from '@/libs/api.request'
export const getWorkerList = (params) => {
  return axios.request({
    url: '/person/getList',
    method: 'get',
    params: params
  })
}

