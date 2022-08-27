import axios from '@/libs/api.request'

export const getWarningLog = param => {
  return axios.request({
    url: '/container/getAlarmHisByCtrRelation',
    method: 'post',
    data: param
  })
}
//超限接口
export const getMonitorTransfiniteList = params => {
  return axios.request({
    url: '/transfinite/getTransfiniteList',
    method: 'get',
    params: params
  })
}
// //预警接口
// export const getMonitorWarningList = params => {
//   return axios.request({
//     url: '/monitorWarning/getMonitorWarningList',
//     method: 'get',
//     params: params
//   })
// }
// //故障接口
// export const getMonitorFaultList = params => {
//   return axios.request({
//     url: '/monitorFault/getMonitorFaultList',
//     method: 'get',
//     params: params
//   })
// }
