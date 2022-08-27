import request from '@/utils/request'

export function fetchTemplateList() {
    return request({
        url: '/opcloud/dashboardTemplate/templates/user/000',
        method: 'get'
    })
}
export function fetchTemplate(hash) {
    return request({
        url: '/opcloud/dashboardTemplate/templates/' + hash,
        method: 'get'
    })
}

export function updateTemplate(data) {
    return request({
        url: '/opcloud/dashboardTemplate/templates/' + data.hash,
        method: 'put',
        data
    })
}

export function createTemplate(data) {
    return request({
        url: '/opcloud/dashboardTemplate/templates/user/000',
        method: 'post',
        data
    })
}

export function deleteTemplate(hash) {
    return request({
        url: '/opcloud/dashboardTemplate/templates/' + hash,
        method: 'delete'
    })
}