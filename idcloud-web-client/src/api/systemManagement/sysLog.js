import axios from '@/libs/api.request'

export const getLogList = (params) => {
  return axios.request({
    url: '/sysLog/list',
    method: 'get',
    params: params
  })
}

export const getOrgList = (params) => {
  return axios.request({
    url: '/org/getOrgList',
    method: 'get',
    params: params
  })
}

export const exportLogFiles = (params) => {
  return axios.request({
    url: '/sysLog/exportSysLogInfo',
    method: 'get',
    params: params,
    responseType: 'arraybuffer'
  })
}