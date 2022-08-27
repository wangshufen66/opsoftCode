import axios from '@/libs/api.request'
// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/docRule/getList',
    method: 'get',
    params: params
  })
}
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/docRule/getDetail/${id}`,
    method: 'get'
  })
}
// 添加
export const add = (data) => {
  return axios.request({
    url: '/docRule/add',
    method: 'post',
    data: data
  })
}
// 更新
export const update = (data) => {
  return axios.request({
    url: '/docRule/update',
    method: 'post',
    data: data
  })
}
// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/docRule/batchDel',
    method: 'post',
    data: data
  })
}
export const getGroupList = () => {
  return Promise.resolve({
    data: {
      data: [
        {
          "children": null,
          "component": null,
          "id": 6,
          "meta": {"icon": null, "title": "计量单位"},
          "name": "计量单位",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 7,
          "meta": {"icon": null, "title": "部门"},
          "name": "部门",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 8,
          "meta": {"icon": null, "title": "员工"},
          "name": "员工",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 9,
          "meta": {"icon": null, "title": "客户"},
          "name": "客户",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 10,
          "meta": {"icon": null, "title": "供应商"},
          "name": "供应商",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 11,
          "meta": {"icon": null, "title": "仓库"},
          "name": "仓库",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 12,
          "meta": {"icon": null, "title": "仓位"},
          "name": "仓位",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 13,
          "meta": {"icon": null, "title": "辅助资料"},
          "name": "辅助资料",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 17,
          "meta": {"icon": null, "title": "物料"},
          "name": "物料",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 19,
          "meta": {"icon": null, "title": "工序"},
          "name": "工序",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 22,
          "meta": {"icon": null, "title": "班组"},
          "name": "班组",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 25,
          "meta": {"icon": null, "title": "不良原因"},
          "name": "不良原因",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 117,
          "meta": {"icon": null, "title": "设备档案"},
          "name": "设备档案",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 118,
          "meta": {"icon": null, "title": "维保方案"},
          "name": "维保方案",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 119,
          "meta": {"icon": null, "title": "设备维修"},
          "name": "设备维修",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 120,
          "meta": {"icon": null, "title": "设备保养"},
          "name": "设备保养",
          "number": "",
          "params": null,
          "path": null
        },
        {
          "children": null,
          "component": null,
          "id": 121,
          "meta": {"icon": null, "title": "设备点检"},
          "name": "设备点检",
          "number": "",
          "params": null,
          "path": null
        }
      ],
      code: 200
    },
    status: 200
  });
}
// // 保存整个表体
// export const saveDocRuleInfos = (data) => {
//   return axios.request({
//     url: '/docRule/saveDocRuleInfos',
//     method: 'post',
//     data: data
//   })
// }
// 单条更新
export const updateDocRuleInfo = (data) => {
  return axios.request({
    url: '/docRule/updateDocRuleInfo',
    method: 'post',
    data: data
  })
}
// 单条新增
export const addDocRuleInfo = (data) => {
  return axios.request({
    url: '/docRule/addDocRuleInfo',
    method: 'post',
    data: data
  })
}
// 批量删除表体
export const batchDelDocRuleInfo = (data) => {
  return axios.request({
    url: '/docRule/batchDelDocRuleInfo',
    method: 'post',
    data: data
  })
}

// // 根据BomId 获取BomInfo表体
// export const getDocRuleInfoByDocRuleId = (params) => {
//   return axios.request({
//     url: '/docRule/getDocRuleInfoByDocRuleId',
//     method: 'get',
//     params: params
//   })
// }

