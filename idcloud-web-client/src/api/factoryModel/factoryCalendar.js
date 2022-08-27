/* 生产工序 */
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/factoryCalendar/getList',
    method: 'get',
    params: params
  })
}

// 详情
export const getMonthDetail = (data) => {
  return axios.request({
    url: `/factoryCalendar/getMonthDetail`,
    method: 'post',
    data:data
  })
}


// 添加
export const save = (data) => {
  return axios.request({
    url: '/factoryCalendar/save',
    method: 'post',
    data: data
  })
}

// 表体详情
export const getDayDetail = data => {
  return axios.request({
    url: `/factoryCalendar/getDayDetail`,
    method: 'post',
    data:data
  })
}

// 保存表体
export const setDayDetail = (data) => {
  return axios.request({
    url: '/factoryCalendar/setDayDetail',
    method: 'post',
    data: data
  })
}

// 删除表体
export const delDayDetail = (data) => {
  return axios.request({
    url: '/factoryCalendar/delDayDetail',
    method: 'post',
    data: data
  })
}

// 更新
export const update= (data) => {
  return axios.request({
    url: '/factoryCalendar/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/factoryCalendar/delCalendars',
    method: 'post',
    data: data
  })
}
// // 审核
// export const audit = (data) => {
//   return axios.request({
//     url: '/factoryCalendar/audit',
//     method: 'post',
//     data: data
//   })
// }
// // 反审核
// export const antiAudit = (data) => {
//   return axios.request({
//     url: '/factoryCalendar/antiAudit',
//     method: 'post',
//     data: data
//   })
// }
// // 禁用
// export const disable = (data) => {
//   return axios.request({
//     url: '/factoryCalendar/disable',
//     method: 'post',
//     data: data
//   })
// }
// // 反禁用
// export const antiDisable = (data) => {
//   return axios.request({
//     url: '/factoryCalendar/antiDisable',
//     method: 'post',
//     data: data
//   })
// }



