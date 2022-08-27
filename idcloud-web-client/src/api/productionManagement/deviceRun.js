import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/deviceRunning/getList',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/deviceRunning/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/deviceRunning/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update= (data) => {
  return axios.request({
    url: '/deviceRunning/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/deviceRunning/batchDel',
    method: 'post',
    data: data
  })
}


// 分页获取列表
export const bodyGetList = (params) => {
  return axios.request({
    url: '/deviceMaterialProduce/getList',
    method: 'get',
    params: params
  })
}

// 详情
export const bodyGetDetail = (id) => {
  return axios.request({
    url: `/deviceMaterialProduce/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const bodyAdd = (data) => {
  return axios.request({
    url: '/deviceMaterialProduce/add',
    method: 'post',
    data: data
  })
}

// 更新
export const bodyUpdate= (data) => {
  return axios.request({
    url: '/deviceMaterialProduce/update',
    method: 'post',
    data: data
  })
}

// 删除
export const bodyBatchDel = (data) => {
  return axios.request({
    url: '/deviceMaterialProduce/batchDel',
    method: 'post',
    data: data
  })
}

