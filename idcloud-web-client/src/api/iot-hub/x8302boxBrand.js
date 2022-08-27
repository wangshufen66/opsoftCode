/* 设备加工信息 */
import axios from '@/libs/api.request';
// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/Box8302Brand/list',
    method: 'get',
    params: params
  })
}

// 详情
export const findMoDetail = (id) => {
  return axios.request({
    url: `/Box8302Brand/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/Box8302Brand/saveBox8302Brand',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/Box8302Brand/updateBox8302Brand',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (data) => {
  return axios.request({
    url: '/Box8302Brand/delBatchBox8302Brand',
    method: 'post',
    data: data
  })
}
