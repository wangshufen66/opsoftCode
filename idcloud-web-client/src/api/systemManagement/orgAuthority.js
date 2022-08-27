import axios from '@/libs/api.request'
/**
 * 所有可选权限
 */
export const getAllSelectableAuthority = (params) => {
  return axios.request({
    url: '/orgAuthority/getAllSelectableAuthority',
    method: 'get',
    params: params
  })
}
/**
 * 组织已经获取的权限
 */
export const getOrgSelectedAuthority = (params) => {
  return axios.request({
    url: '/orgAuthority/getOrgSelectedAuthority',
    method: 'get',
    params: params
  })
}
/**
 * 组织权限范围列表
 */
export const getOrgAuthorityScope = (params) => {
  return axios.request({
    url: '/orgAuthority/getOrgAuthorityScope',
    method: 'get',
    params: params,
  })
}
/**
 * 组织权限修改
 */
export const editOrgAuthorityScope = (data) => {
  return axios.request({
    url: '/orgAuthority/editOrgAuthorityScope',
    method: 'post',
    data: data,
  })
}
