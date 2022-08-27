import request from '@/utils/request'
// 获取列表
export function maillogList(params) {
  return request({
    url: '/sys/maillog/list',
    method: 'get',
    params: params
  })
}


// 获取信息
export function info(id) {
  return request({
    url: '/sys/mail/info?id=' + id,
    method: 'get'
  })
}

// 添加
export function add(params) {
  return request({
    url: '/sys/mail/save',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/sys/mail/update',
    method: 'put',
    data: params
  })
}
// 删除
export function del(params) {
  return request({
    url: '/sys/mail/delete',
    method: 'delete',
    data: params
  })
}
