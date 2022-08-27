/* 所有工厂建模基础资料的分组 */
import axios from '@/libs/api.request'

// 获取列表
export const getGroupList = (type,params) => {
  return axios.request({
    url: `/group/getGroupList/type=${type}`,
    method: 'get',
    params: params
  })
}

// 获取列表
export const getGroupListByPage = (type,params) => {
  return axios.request({
    url: `/group/getGroupListByPage/type=${type}`,
    method: 'get',
    params: params
  })
}

// 获取全部分组
export const getAllGroup = (data) => {
  return axios.request({
    url: '/group/getAllGroup',
    method: 'post',
    data: data
  })
}

// 详情
export const getGroupDetail = (id) => {
  return axios.request({
    url: `/group/getGroupDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const addGroup = (data) => {
  return axios.request({
    url: '/group/addGroup',
    method: 'post',
    data: data
  })
}

// 更新
export const updateGroup = (data) => {
  return axios.request({
    url: '/group/updateGroup',
    method: 'post',
    data: data
  })
}

// 删除
export const delGroup = (data) => {
  return axios.request({
    url: '/group/delGroup',
    method: 'post',
    data: data
  })
}
