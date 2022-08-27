import axios from '@/libs/api.request'

//企业管理: 获取企业树形图
export const getOrgTree = () => {
  return axios.request({
    url: '/org/getOrgTree',
    method: 'get'
  })
}
//企业管理: 获取企业树形图
export const getOrgList = () => {
  return axios.request({
    url: '/org/getOrgList',
    method: 'get'
  })
}

//企业管理: 获取企业树形图
export const getOrgListById = (params) => {
  return axios.request({
    url: '/org/getOrgListById',
    method: 'get',
    params:params
  })
}

//获取企业的基础数据——行业列表
export const getTypeList = () => {
  return axios.request({
    url: '/businessType/list',
    method: 'get'
  })
}

//删除组织
export const delOrg = (data) => {
  return axios.request({
    url: '/org/delOrg',
    method: 'post',
    data: data
  })
}

//新增组织
export const addOrg = (data) => {
  return axios.request({
    url: '/org/addOrg',
    method: 'post',
    data: data
  })
}

//编辑组织
export const editOrg = (data) => {
  return axios.request({
    url: '/org/editOrg',
    method: 'post',
    data: data
  })
}

//组织详情
export const getOrgDetail = (params) => {
  return axios.request({
    url: '/org/getOrgDetail',
    method: 'get',
    params:params
  })
}
//禁用组织
export const suspendOrg = (data) => {
  return axios.request({
    url: '/org/suspendOrg',
    method: 'post',
    data: data
  })
}
//反禁用组织
export const deSuspendOrg = (data) => {
  return axios.request({
    url: '/org/deSuspendOrg',
    method: 'post',
    data: data
  })
}
// 获取组织列表
export const findOrgList = () => {
  return axios.request({
    url: '/org/findOrgList',
    method: 'get'
  })
}
//企业层级调整
export const modifyOrgParentAndLevel = (data) => {
  return axios.request({
    url: '/org/modifyOrgParentAndLevel',
    method: 'post',
    data: data
  })
}

//获取用户的企业权限
export const getUserManagedOrg = (params) => {
  return axios.request({
    url: '/org/getUserManagedOrg',
    method: 'get',
    params: params
  })
}
//获取用户可选组织列表权限
export const getUserSelectableOrg = (params) => {
  return axios.request({
    url: '/org/getUserSelectableOrg',
    method: 'get',
    params: params
  })
}
//========================================================API最新 不用修改






