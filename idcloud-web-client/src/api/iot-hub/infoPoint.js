/* 设备加工信息 */
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/pointCode/list',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/pointCode/getDetail/${id}`,
    method: 'get',
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/pointCode/savePointCode',
    method: 'post',
    data: data
  })
}

// 更新
export const update = (data) => {
  return axios.request({
    url: '/pointCode/updatePointCode',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/pointCode/delBatchPointCode',
    method: 'post',
    data: data
  })
}
