import axios from '@/libs/api.request'
import {
  commonUpload
} from '@/api/publicApis'

export const getGroupList = (params) => {
  return axios.request({
    url: `/group/getGroupList/type=22`,
    method: 'get',
    params: params
  })
}
export const getList = param => {
  return axios.request({
    url: '/archives/getList',
    method: 'get',
    params: param
  })
}
export const getDetail = (id) => {
  return axios.request({
    url: `/archives/getDetail/${id}`,
    method: 'get'
  })
}

export const add = data => {
  return axios.request({
    url: '/archives/add',
    method: 'post',
    data: data
  })
}

export const update = data => {
  return axios.request({
    url: '/archives/update',
    method: 'post',
    data: data
  })
}

export const batchDel = data => {
  return axios.request({
    url: '/archives/batchDel',
    method: 'post',
    data: data
  })
}
export const audit = data => {
  return axios.request({
    url: '/archives/audit',
    method: 'post',
    data: data
  })
}
export const antiAudit = data => {
  return axios.request({
    url: '/archives/antiAudit',
    method: 'post',
    data: data
  })
}

export const disable = data => {
  return axios.request({
    url: '/archives/disable',
    method: 'post',
    data: data
  })
}

export const antiDisable = data => {
  return axios.request({
    url: '/archives/antiDisable',
    method: 'post',
    data: data
  })
}
export const getDeviceGroup = (param) => {
  return axios.request({
    url: '/archives/getArchivesType',
    method: 'get',
    params: param
  })
}
// 添加附件
export const addList = data => {
  return axios.request({
    url: '/archives/addAttachment',
    method: 'post',
    data: data
  })
}
// 下载附件
export const updateList = data => {
  return axios.request({
    url: '/archives/???',
    method: 'post',
    data: data
  })
}
// 删除附件
export const delList = data => {
  return axios.request({
    url: '/archives/batchAttachmentDel',
    method: 'post',
    data: data
  })
}
// 添加
export const addList1 = data => {
  return axios.request({
    url: '/archives/addParameter',
    method: 'post',
    data: data
  })
}
// 更新
export const updateList1 = data => {
  return axios.request({
    url: '/archives/updateParameter',
    method: 'post',
    data: data
  })
}
// 删除
export const delList1 = data => {
  return axios.request({
    url: '/archives/batchParameterDel',
    method: 'post',
    data: data
  })
}
// 添加
export const addList2 = data => {
  return axios.request({
    url: '/archives/addPart',
    method: 'post',
    data: data
  })
}
// 更新
export const updateList2 = data => {
  return axios.request({
    url: '/archives/updatePart',
    method: 'post',
    data: data
  })
}
// 删除
export const delList2 = data => {
  return axios.request({
    url: '/archives/batchPartDel',
    method: 'post',
    data: data
  })
}
// 添加
export const addList3 = data => {
  return axios.request({
    url: '/archives/addInstructions',
    method: 'post',
    data: data
  })
}
// 更新
export const updateList3 = data => {
  return axios.request({
    url: '/archives/updateInstructions',
    method: 'post',
    data: data
  })
}

// 删除
export const delList3= data => {
  return axios.request({
    url: '/archives/batchInstructionsDel',
    method: 'post',
    data: data
  })
}

export const getGroupId = (param) => {
  return axios.request({
    url: '/archives/getArchivesType',
    method: 'get',
    params: param
  })
}

// 设备档案
export const getDeviceTemplate = (params) => {
  return axios.request({
    url: '/archives/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importDeviceTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/archives/importDataExcel?orgId=${orgId}`)
}

// 获取部位信息
export const getPositionList = (param) => {
  return axios.request({
    url: '/archives/getPartList',
    method: 'get',
    params: param
  })
}
