
import axios from '@/libs/api.request';

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/environmentFee/list',
    method: 'get',
    params: params
  })
};
// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/environmentFee/getDetail/${id}`,
    method: 'get'
  })
};
// 添加
export const add = (data) => {
  return axios.request({
    url: '/environmentFee/add',
    method: 'post',
    data: data
  })
};
// 更新
export const update= (data) => {
  return axios.request({
    url: '/environmentFee/update',
    method: 'post',
    data: data
  })
};
// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/environmentFee/batchDel',
    method: 'post',
    data: data
  })
};
// 切换开关
export const switchEffective = (data) => {
  return axios.request({
    url: '/environmentFee/switchEffective',
    method: 'post',
    data: data
  })
};
