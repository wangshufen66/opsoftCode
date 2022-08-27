import request from '@/utils/request'
// 获取列表
export function list(params) {
  return request({
    url: '/sys/sms/list',
    method: 'get',
    params: params
  })
}
// 获取信息
export function config() {
  return request({
    url: '/sys/sms/config',
    method: 'get'
  })
}
// 获取信息
export function info(id) {
  return request({
    url: '/sys/sms/info?id=' + id,
    method: 'get'
  })
}

// 添加
export function saveConfig(params) {
  return request({
    url: '/sys/sms/saveConfig',
    method: 'post',
    data: params
  })
}
// 发送短信
export function send(params) {
  return request({
    url: '/sys/sms/send',
    method: 'post',
    params: params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/sys/sms/update',
    method: 'put',
    data: params
  })
}
// 删除
export function del(params) {
  return request({
    url: '/sys/sms/delete',
    method: 'delete',
    data: params
  })
}
