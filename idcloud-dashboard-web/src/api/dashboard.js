import request from '@/utils/request'
import {
  getUserId
} from '@/utils/auth'

export function fetchList(query) {
  const id = getUserId()
  return request({
    url: '/dashboard/user/' + id + '/dashboards',
    method: 'get',
    params: query
  })
}

export function fetchDashboard(hash) {
  return request({
    url: '/dashboard/dashboards/' + hash,
    method: 'get'
  })
}

export function createDashboard(data) {
  const id = getUserId()
  return request({
    url: '/dashboard/user/' + id + '/dashboards',
    method: 'post',
    data
  })
}

export function updateDashboard(data) {
  return request({
    url: '/dashboard/dashboards/' + data.hash,
    method: 'put',
    data
  })
}

export function deleteDashboard(hash) {
  return request({
    url: '/dashboard/dashboards/' + hash,
    method: 'delete'
  })
}

export function publishDashboard(hash, option) {
  return request({
    url: '/dashboard/publish/' + hash,
    method: 'post',
    data: {
      'option': option
    }
  })
}

export function fetchPublication(hash) {
  return request({
    url: '/dashboard/publish/' + hash,
    method: 'get'
  })
}

export function downloadDashboard(hash) {
  return request({
    url: '/dashboard/download/dashboards/' + hash,
    method: 'get'
  })
}

export function moveDashboard(hash, key) {
  return request({
    url: '/dashboard/projects/' + key + '/dashboards/' + hash,
    method: 'put'
  })
}
