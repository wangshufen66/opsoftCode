import axios from '@/libs/api.request'

// 删除角色
export const delRole = (data) => {
  return axios.request({
    url: '/role/delRole',
    method: 'post',
    data: data
  })
}
// 分页获取角色列表
export const findRoleList = (params) => {
  return axios.request({
    url: '/role/findRoleList',
    method: 'get',
    params: params
  })
}
// 获取所有【功能】权限列表
export const findAuthorityListByOrg = (params) => {
  return axios.request({
    url: '/role/findAuthorityListByOrg',
    method: 'get',
    params: params
  })
}
// 保存角色
export const addRole = (data) => {
  return axios.request({
    url: '/role/addRole',
    method: 'post',
    data: data
  })
}
// 编辑角色
export const editRole = (data) => {
  return axios.request({
    url: '/role/editRole',
    method: 'post',
    data: data
  })
}
// 禁用角色
// export const suspendRole = (data) => {
//   return axios.request({
//     url: '/role/suspendRole',
//     method: 'post',
//     data: data
//   })
// }
// // 反禁用角色
// export const deSuspendRole = (data) => {
//   return axios.request({
//     url: '/role/deSuspendRole',
//     method: 'post',
//     data: data
//   })
// }
// 获取角色的【功能】权限列表
export const findAuthorityListByRole = (params) => {
  return axios.request({
    url: '/role/findAuthorityListByRole',
    method: 'get',
    params: params
  })
}
// 获取角色的【企业】权限列表
export const findOrgListByRole = (params) => {
  return axios.request({
    url: '/role/findOrgListByRole',
    method: 'get',
    params: params
  })
}


// 给用户分配角色
export const bindUsersByRole = (params) => {
  return axios.request({
    url: '/role/bindUsersForRole',
    data: params,
    method: 'post'
  })
}

// 可选角色列表
export const findSelectableRoleList = (params) => {
  return axios.request({
    url: '/role/findSelectableRoleList',
    method: 'get',
    params: params
  })
}
//获取用户的角色列表
export const findSelectedRoleList = (params) => {
  return axios.request({
    url: '/role/findSelectedRoleList',
    method: 'get',
    params: params
  })
}

// 可选用户列表
export const findSelectedUserForRole= (params) => {
  return axios.request({
    url: '/role/findSelectedUserForRole',
    method: 'get',
    params: params
  })
}
//获取角色的用户列表
export const findSelectableUserForRole = (params) => {
  return axios.request({
    url: '/role/findSelectableUserForRole',
    method: 'get',
    params: params
  })
}
