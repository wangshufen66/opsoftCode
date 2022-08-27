import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/paramSys/getList',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/paramSys/getDetail/${id}`,
    method: 'get'
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/paramSys/add',
    method: 'post',
    data: data
  })
}

// 更新
export const update = (data) => {
  return axios.request({
    url: '/paramSys/update',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/paramSys/batchDel',
    method: 'post',
    data: data
  })
}
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/paramSys/audit',
    method: 'post',
    data: data
  })
}
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/paramSys/antiAudit',
    method: 'post',
    data: data
  })
}
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/paramSys/disable',
    method: 'post',
    data: data
  })
}
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/paramSys/antiDisable',
    method: 'post',
    data: data
  })
}
// // 获取绑定字段列表
// export const getFieldList = (data) => {
//   return axios.request({
//     url: '/paramSys/getFieldList',
//     method: 'post',
//     data: data
//   })
// }
// // 设置绑定字段列表
// export const setFieldList = (data) => {
//   return axios.request({
//     url: '/paramSys/setFieldList',
//     method: 'post',
//     data: data
//   })
// }
export const getGroupList = () => {
  return Promise.resolve({
    data: {
      data: [{
        "children": null,
        "component": null,
        "id": 10,
        "meta": {"icon": null, "title": "生产运营"},
        "name": "生产运营",
        "number": "",
        "params": null,
        "path": null
      }],
      code:200
    },
    status:200
  });
}
