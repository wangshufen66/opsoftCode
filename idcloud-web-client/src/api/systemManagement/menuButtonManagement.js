/* 设备加工信息 */
import axios from '@/libs/api.request'

// 分页获取列表
export const findMenuButtonManagementList = (params) => {
  return axios.request({
    url: '/authority/list',
    method: 'get',
    params: params
  })
}

// 获取菜单列表
export const findMenuList = () => {
  return axios.request({
    url: `/authority/menuList`,
    method: 'get',
  })
}

// 获取按钮列表
export const findButtonList = () => {
  return axios.request({
    url: `/authority/buttonList`,
    method: 'get',
  })
}

// 详情
export const findMenuButtonManagementDetail = (id) => {
  return axios.request({
    url: `/authority/detail/${id}`,
    method: 'post'
  })
}


// 添加
export const addMenuButtonManagement = (data) => {
  return axios.request({
    url: '/authority/add',
    method: 'post',
    data: data
  })
}

// 更新
export const updateMenuButtonManagement = (data) => {
  return axios.request({
    url: '/authority/edit',
    method: 'post',
    data: data
  })
}

// 删除
export const deleteMenuButtonManagement = (data) => {
  // const params = {
  //   wp_uid: id
  // }
  return axios.request({
    url: '/authority/delete',
    method: 'post',
    data: data
  })
}







