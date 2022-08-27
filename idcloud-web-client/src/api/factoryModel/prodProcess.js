/* 生产工序 */
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/workProcess/getList',
    method: 'get',
    params: params
  })
};
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/workProcess/getDetail/${id}`,
    method: 'get'
  })
};
// 添加
export const add = (data) => {
  return axios.request({
    url: '/workProcess/add',
    method: 'post',
    data: data
  })
};
// 更新
export const update= (data) => {
  return axios.request({
    url: '/workProcess/update',
    method: 'post',
    data: data
  })
};
// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/workProcess/batchDel',
    method: 'post',
    data: data
  })
};
// 审核
export const audit = (data) => {
  return axios.request({
    url: '/workProcess/audit',
    method: 'post',
    data: data
  })
};
// 反审核
export const antiAudit = (data) => {
  return axios.request({
    url: '/workProcess/antiAudit',
    method: 'post',
    data: data
  })
};
// 禁用
export const disable = (data) => {
  return axios.request({
    url: '/workProcess/disable',
    method: 'post',
    data: data
  })
};
// 反禁用
export const antiDisable = (data) => {
  return axios.request({
    url: '/workProcess/antiDisable',
    method: 'post',
    data: data
  })
};
// 获取绑定字段列表
export const getFieldList = (data) => {
  return axios.request({
    url: '/workProcess/getFieldList',
    method: 'post',
    data: {
      pageName: "page:ProdProcess",
      ...data
    }
  })
};
// 设置绑定字段列表
export const setFieldList = (data) => {
  return axios.request({
    url: '/workProcess/setFieldList',
    method: 'post',
    data: {
      pageName: "page:ProdProcess",
      ...data
    }
  })
};
// 获取分组列表
export const getGroupList = (params) => {
  return axios.request({
    url: `/group/getGroupList/type=14`,
    method: 'get',
    params: params
  })
}
