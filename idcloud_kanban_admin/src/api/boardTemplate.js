import request from '@/utils/requestBoard'

/** ******【看板模板列表 页面】****start*** */

/**
 * 查询所有看板模板列表
 */
export function queryKanbanTemplateList() {
  return request({
    url: '/kanban/template/list',
    method: 'get'
  })
}

/**
 * 查询指定看板模板的详细信息
 */
export function queryKanbanTemplateDetail(tmpId) {
  return request({
    url: '/kanban/template/cntlist',
    method: 'get',
    params: {
      'tmpId': tmpId
    }
  })
}

/**
 * 保存看板模板以及其中包含的所有容器数据
 * （根据id自动判定是新增模板还是更新模板）
 * @param tmpJson
 */
export function saveKanbanTemplate(data) {
  return request({
    url: '/kanban/template/savetmpcnts',
    method: 'post',
    data
  })
}

/**
 * 删除看板模板以及其中包含的所有容器数据
 * @param tmpJson
 */
export function deleteKanbanTemplate(tmpId) {
  return request({
    url: '/kanban/template/deletetmpcnts',
    method: 'get',
    params: {
      'tmpId': tmpId
    }
  })
}

/** ******【看板模板列表 页面】****end*** */
