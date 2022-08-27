/* 设备加工信息 */
import axios from '@/libs/api.request'

// 分页获取列表
export const findMoList = (params) => {
  return axios.request({
    url: '/mahrBrand/list',
    method: 'get',
    params: params
  })
}

// 详情
export const findMoDetail = (id) => {
  return axios.request({
    url: `/mahrBrand/getDetail/${id}`,
    method: 'get',
  })
}

// 添加
export const addMo = (data) => {
  return axios.request({
    url: '/mahrBrand/saveMahrBrand',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMo = (data) => {
  return axios.request({
    url: '/mahrBrand/updateMahrBrand',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMo = (data) => {
  return axios.request({
    url: '/mahrBrand/delBatchMahrBrand',
    method: 'post',
    data: data
  })
}
// 添加
export const addList = (data) => {
  return axios.request({
    url: '/mahrBrandPoint/saveMahrBrandPoint',
    method: 'post',
    data: data
  })
}

// 更新
export const updateList = (data) => {
  return axios.request({
    url: '/mahrBrandPoint/updateMahrBrandPoint',
    method: 'post',
    data: data
  })
}

// 删除
export const delList = (data) => {
  return axios.request({
    url: '/mahrBrandPoint/delBatchMahrBrandPoint',
    method: 'post',
    data: data
  })
}
