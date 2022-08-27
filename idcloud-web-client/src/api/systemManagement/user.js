import axios from '@/libs/api.request'

// 获取用户列表
export const getUserListByOrg = (params) => {
  return axios.request({
    url: '/user/getUserListByOrg',
    method: 'post',
    params: params
  })
}
// 删除用户
export const delUser = (data) => {
  return axios.request({
    url: '/user/delUser',
    data: data,
    method: 'post'
  })
}
// 编辑保存用户
export const editUser = (data) => {
  return axios.request({
    url: '/user/editUser',
    data: data,
    method: 'post'
  })
}
// 新增用户
export const addUser = (data) => {
  return axios.request({
    url: '/user/addUser',
    data: data,
    method: 'post'
  })
}
//用户详情
export const getUserDetail = (params) => {
  return axios.request({
    url: '/user/getUserDetail',
    method: 'get',
    params:params
  })
}
// 禁用用户
export const suspendUsers = (data) => {
  return axios.request({
    url: '/user/suspendUsers',
    data: data,
    method: 'post'
  })
}
// 反禁用用户
export const deSuspendUsers = (data) => {
  return axios.request({
    url: '/user/deSuspendUsers',
    data: data,
    method: 'post'
  })
}
// 重置用户密码
export const resetUserPassword = (params) => {
  return axios.request({
    url: '/user/resetUserPassword',
    data: params,
    method: 'post'
  })
}
//修改用户密码
export const updateUserPassword = (params) => {
  return axios.request({
    url: '/user/updatePassword',
    data: params,
    method: 'post'
  })
}

//查找当前角色下的所有用户
export const findAllUserListByRole = (params) => {
  return axios.request({
    url: '/role/findAllUserListByRole',
    method: 'get',
    params: params
  })
}
// 给用户分配角色
export const bindRoleByUser = (params) => {
  return axios.request({
    url: '/user/bindRoleForUser',
    data: params,
    method: 'post'
  })
}
//给用户分配企业
export const setUserManagedOrgs = (params) => {
  return axios.request({
    url: '/user/setUserManagedOrgs',
    data: params,
    method: 'post'
  })
}
// 编辑保存用户
export const saveUser = (params) => {
  return axios.request({
    url: '/user/saveUser',
    data: params,
    method: 'post'
  })
}
// 登录
export const login = ({ username, password }) => {
  const params = { username, password }
  return axios.request({
    url: '/auth/token',
    data: params,
    method: 'post'
  })
}
// 获取用户信息和权限
export const getUserInfo = (data) => {
  return axios.request({
    url: '/auth/getAuthority',
    method: 'post',
    data:data
  })
}
