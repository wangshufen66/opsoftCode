import axios from '@/libs/api.request'
/* 认证接口 */
// 修改密码
export const updatePassword = (params) => {
  return axios.request({
    url: '/auth/updatePassword',
    data: params,
    method: 'post'
  })
}

// 注册
export const register = (params) => {
  return axios.request({
    url: '/auth/register',
    data: params,
    method: 'post'
  })
}

// 获取权限和用户基本信息
export const getAuthority = () => {
  return axios.request({
    url: '/auth/getAuthority',
    method: 'get'
  })
}

// 获取industry list
export const getIndustryList = (params) => {
  return axios.request({
    url: '/businessType/list',
    method: 'get',
    params: params
  })
}

// get verificationCode
export const getVerificationCode = (params) => {
  return axios.request({
    url: '/auth/getVerificationCode',
    method: 'get',
    params: params
  })
}


// forgetPwd
export const forgetPassword = (params) => {
  return axios.request({
    url: '/auth/forgetPassword',
    data: params,
    method: 'post'
  })
}

//重置密码
export const confirmPassword  = (params) => {
  return axios.request({
    url: '/auth/confirmPassword ',
    data: params,
    method: 'post'
  })
}

export const sendCode = (params) => {
  return axios.request({
    url: '/trial/getCode',
    method: 'get',
    params: params,
  })
}

export const forgetCode = (params) => {
  return axios.request({
    url: '/trial/forgetCode',
    method: 'get',
    params: params,
  })
}

export const registered = (data) => {
  return axios.request({
    url: '/trial/registered',
    method: 'post',
    data: data,
  })
}
