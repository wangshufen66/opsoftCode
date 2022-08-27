import request from '@/utils/requestBoard'

/** ******【TV看板列表 页面（暂未开发）】****start*** */

/**
 * 查询所有TV APP列表
 */
export function queryTvAppList() {
  return request({
    url: '/kanban/tvapp/list',
    method: 'get'
  })
}

/**
 * 根据ID查询所有TV APP信息
 */
export function queryTvAppById(tvaIp) {
  return request({
    url: '/kanban/tvapp/one',
    method: 'get',
    params: {
      'tvaId': tvaIp
    }
  })
}

/**
 * 删除TvApp
 * @param cmpJson
 */
export function deleteTvApp(data) {
  return request({
    url: '/kanban/tvapp/delete',
    method: 'post',
    data
  })
}

/**
 * 保存TvApp
 * @param cmpJson
 */
export function saveTvApp(data) {
  return request({
    url: '/kanban/tvapp/save',
    method: 'post',
    data
  })
}

/** ******【TV看板列表 页面（暂未开发）】****end*** */
