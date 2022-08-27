import request from '@/utils/request'
import {
  getUserId
} from '@/utils/auth'
export function fetchTemplateList () {
  const id = getUserId()
  return request({
    url: `/dashboardTemplate/templates/user/${id}`,
    method: 'get'
  })
}
export function fetchTemplate (hash) {
  return request({
    url: '/dashboardTemplate/templates/' + hash,
    method: 'get'
  })
}

export function updateTemplate (data) {
  return request({
    url: '/dashboardTemplate/templates/' + data.hash,
    method: 'put',
    data
  })
}

export function createTemplate (data) {
  const id = getUserId()
  return request({
    url: `/dashboardTemplate/templates/user/${id}`,
    method: 'post',
    data
  })
}

export function deleteTemplate (hash) {
  return request({
    url: '/dashboardTemplate/templates/' + hash,
    method: 'delete'
  })
}
