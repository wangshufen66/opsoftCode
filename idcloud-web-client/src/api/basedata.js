import axios from '@/libs/api.request'
import config from '@/config'
import axiosUpload from 'axios'
import store from "@/store";

/* 容器配置 */
// 获取云盒数据点树结构
export const getAttrTree = () => {
        return axios.request({
            url: '/cloudbox/getAttrTree',
            method: 'get'
        })
    }
    // 获取容器列表
export const findContainerList = (param) => {
    return axios.request({
        url: '/container/findContainerList',
        method: 'get',
        params: param
    })
}

export const findAppContainerList = (param) => {
    return axios.request({
        url: '/container/getContainerList',
        method: 'get',
        params: param
    })
}
export const getContainerDetail = (param) => {
    return axios.request({
        url: '/container/getContainer',
        method: 'get',
        params: param
    })
}

// 获取已选择的cloudbox/plc/cnc
// 获取已经被选上的信息点，
// @param orgId、 id
export const getCheckedInfoPoint = (param) => {
    return axios.request({
        url: '/container/connectList',
        method: 'get',
        params: param
    })
}

const api = axiosUpload.create({
    baseURL: _getBaseUrl(),
});

function _getBaseUrl() {
    return process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
}

// 容器上传图片
export function uploadPic(file, fileName, _cb, _catchcb) {
    const fd = new FormData();
    const url = '/file/upload'
    fd.append('file', file)
        //   fd.append('level', level)
        //   fd.append('pid', pid)
    fd.append('fileName', fileName)
    return api.post(url, fd, {
        headers: {
            "Authorization": 'Bearer ' + store.state.user.token,
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        }
    }).then(_cb).catch(_catchcb)
}

// 数据点List
// 获取信息点可关联列表 collectPointList
// 必带ctrParent父节点id deviceType

export const getDataPointList = (param) => {
        return axios.request({
            url: '/container/collectPointList',
            method: 'get',
            params: param
        })
    }
    // 关联数据点 动态tab
    // 信息点type头接口 collectUsedList
export const getDataPointTab = (param) => {
    return axios.request({
        url: '/container/collectUsedList',
        method: 'get',
        params: param
    })
}

// 保存容器
export const saveContainer = info => {
        return axios.request({
            url: '/container/saveContainer',
            data: info,
            method: 'post'
        })
    }
    // 删除容器
export const delContainer = info => {
    return axios.request({
        url: '/container/delContainer',
        data: info,
        method: 'post'
    })
}


/* 信息部门 */
// 获取组织列表
export const findOrgList = () => {
        return axios.request({
            url: '/org/findOrgList',
            method: 'get'
        })
    }
    // 获取组织的人员列表
export const getUserListByOrg = info => {
        return axios.request({
            url: '/org/getUserListByOrg',
            params: info,
            method: 'get'
        })
    }
    // 保存组织
export const saveOrg = info => {
        return axios.request({
            url: '/org/saveOrg',
            data: info,
            method: 'post'
        })
    }
    // 删除组织
export const delOrg = info => {
        return axios.request({
            url: '/org/delOrg',
            data: info,
            method: 'post'
        })
    }
    // 绑定组织与用户
export const bindUserByOrg = info => {
    return axios.request({
        url: '/org/bindUserByOrg',
        data: info,
        method: 'post'
    })
}


export const getfullCloudboxList = info => {
    return axios.request({
        url: '/cloudBox/collectList',
        params: info,
        method: 'get'
    })
}

export const getfullCncList = info => {
    return axios.request({
        url: '/cnc/collectList',
        params: info,
        method: 'get'
    })
}

export const getfullPlcList = info => {
    return axios.request({
        url: '/plc/collectList',
        params: info,
        method: 'get'
    })
}
export const getfullBox8303List = info => {
        return axios.request({
            url: '/box8303/collectList',
            params: info,
            method: 'get'
        })
    }
    // 获取容器的信息点列表
export const getPointListByContainer = info => {
    return axios.request({
        url: '/container/getPointListByContainer',
        params: info,
        method: 'get'
    })
};