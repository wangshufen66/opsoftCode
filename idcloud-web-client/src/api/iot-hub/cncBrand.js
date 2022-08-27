/* 设备加工信息 */
import axios from '@/libs/api.request'

// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/cncBrand/list',
    method: 'get',
    params: params
  })
}

// 详情
export const findMoDetail = (id) => {
  return axios.request({
    url: `/cncBrand/getDetail/${id}`,
    method: 'get',
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/cncBrand/saveCncBrand',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/cncBrand/updateCncBrand',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (data) => {
  return axios.request({
    url: '/cncBrand/delBatchCncBrand',
    method: 'post',
    data: data
  })
}
// 添加
export const addList = (data) => {
  return axios.request({
    url: '/cncBrandPoint/saveCncBrandPoint',
    method: 'post',
    data: data
  })
}

// 更新
export const updateList = (data) => {
  return axios.request({
    url: '/cncBrandPoint/updateCncBrandPoint',
    method: 'post',
    data: data
  })
}

// 删除
export const delList = (data) => {
  return axios.request({
    url: '/cncBrandPoint/delBatchCncBrandPoint',
    method: 'post',
    data: data
  })
}
