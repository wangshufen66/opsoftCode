/* 设备加工信息 */
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/plcPoint/list',
    method: 'get',
    params: params
  })
}

// 详情
export const getListDetail = (data) => {
  return axios.request({
    url: `/plcPoint/list`,
    method: 'get',
    params: data
  })
}

// 添加
export const addOne = (data) => {
  return axios.request({
    url: '/plcPoint/savePlcPoint',
    method: 'post',
    data: data
  })
}

// 更新
export const updateOne = (data) => {
  return axios.request({
    url: '/plcPoint/updatePlcPoint',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteOne = (data) => {
  return axios.request({
    url: '/plcPoint/delBatchPlcPoint',
    method: 'post',
    data: data
  })
}


export const getInfoPoint = (params) => {
  return axios.request({
    url: '/pointCode/list',
    method: 'get',
    params: params
  })
}