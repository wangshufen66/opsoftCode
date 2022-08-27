/* 设备加工信息 */
import axios from '@/libs/api.request'

// 分页获取列表
export const getList = (params) => {
  return axios.request({
    url: '/connection/list',
    method: 'get',
    params: params
  })
}

// 详情
export const getDetail = (id) => {
  return axios.request({
    url: `/connection/getDetail/${id}`,
    method: 'get',
  })
}

// 添加
export const add = (data) => {
  return axios.request({
    url: '/connection/saveConnection',
    method: 'post',
    data: data
  })
}

// 更新
export const update = (data) => {
  return axios.request({
    url: '/connection/updateConnection',
    method: 'post',
    data: data
  })
}

// 删除
export const batchDel = (data) => {
  return axios.request({
    url: '/connection/delBatchConnection',
    method: 'post',
    data: data
  })
}
// 切换开关
export const switchEffective = (data) => {
  return axios.request({
    url: '/connection/switchEffective',
    method: 'post',
    data: data
  })
};
