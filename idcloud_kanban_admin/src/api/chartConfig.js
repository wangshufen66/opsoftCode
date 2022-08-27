import request from '@/utils/requestBoard'

/** ******【编辑组件 页面】****start*** */

/**
 * 查询所有组件列表
 */
export function queryComponentList() {
  return request({
    url: '/kanban/component/list',
    method: 'get'
  })
}

/**
 * 删除组件
 * @param cmpJson
 */
export function deleteComponent(data) {
  return request({
    url: '/kanban/component/delete',
    method: 'post',
    data
  })
}

/**
 * 保存组件
 * @param cmpJson
 */
export function saveComponent(data) {
  return request({
    url: '/kanban/component/save',
    method: 'post',
    data
  })
}

/** ******【编辑组件 页面】****end*** */
