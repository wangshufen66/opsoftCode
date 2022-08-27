import axios from '@/libs/api.request'
import config from '@/config'
import axiosUpload from 'axios'
import store from "@/store";
// import axiosReq from '@/libs/api.request'
// import {url} from '@/libs/api.request'
//
// // get PDF preview url
//
// export const getPdfUrl = (name) => {
//   return url +'/'+ name+'.pdf'
// }

const api = axiosUpload.create({
  baseURL : _getBaseUrl(),
});
function _getBaseUrl(){
  return process.env.NODE_ENV === 'development' ? config.baseUrl.dirDev : config.baseUrl.dirPro
}

const apiTrue = axiosUpload.create({
  baseURL : _getBaseUrlTrue(),
});
function _getBaseUrlTrue(){
  return process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
}

export const clientBaseUrl = _getBaseUrl()

export const getGroupTree = (params) => {
  return axios.request({
    url: '/esop_client/getGroupTree',
    method: 'get',
    params: params
  })
}

export const getClients = (params) => {
  return axios.request({
    url: '/esop_client/getClients',
    method: 'get',
    params: params
  })
}

export const addGroup = (data) => {
  return axios.request({
    url: '/esop_client/addGroup',
    method: 'post',
    data: data
  })
}

export const renameGroup = (data) => {
  return axios.request({
    url: '/esop_client/renameGroup',
    method: 'post',
    data: data
  })
}

export const deleteGroup = (data) => {
  return axios.request({
    url: '/esop_client/deleteGroup',
    method: 'post',
    data: data
  })
}

export const addClient = (data) => {
  return axios.request({
    url: '/esop_client/addClient',
    method: 'post',
    data: data
  })
}

export const deleteClient = (data) => {
  return axios.request({
    url: '/esop_client/deleteClient',
    method: 'post',
    data: data
  })
}

export const editClient = (data) => {
  return axios.request({
    url: '/esop_client/editClient',
    method: 'post',
    data: data
  })
}
//上传背景
export const setClientBackground = (data) => {
  return axios.request({
    url: '/esop_client/setClientGlobalBackgroudImage',
    method: 'post',
    data: data
  })
}
//上传印章
export const setClientSeal = (data) => {
  return axios.request({
    url: '/esop_client/setClientGlobalSeal',
    method: 'post',
    data: data
  })
}

//获得默认图片
export const getDefaultBackground = (params) => {
  return axios.request({
    url: '/esop_client/getClientGlobalBackgroudImage',
    method: 'get',
    params:params
  })
}
export const getDefaultSeal = (params) => {
  return axios.request({
    url: '/esop_client/getClientGlobalSeal',
    method: 'get',
    params:params
  })
}

export function uploadBackground (file,orgId,_cb,_catchcb) {
  const fd = new FormData();
  const url='/esop_client/setClientGlobalBackgroudImage'
  fd.append('file',file)
  fd.append('orgId',orgId)
  return apiTrue.post(url,fd,{
    headers : {
      "Authorization":'Bearer '+store.state.user.token,
      'Content-Type' : 'multipart/form-data',
      'Access-Control-Allow-Origin' : '*'
    }
  }).then(_cb).catch(_catchcb)
}
export function uploadSeal (file,orgId,_cb,_catchcb) {
  const fd = new FormData();
  const url='/esop_client/setClientGlobalSeal'
  fd.append('file',file)
  fd.append('orgId',orgId)
  return apiTrue.post(url,fd,{
    headers : {
      "Authorization":'Bearer '+store.state.user.token,
      'Content-Type' : 'multipart/form-data',
      'Access-Control-Allow-Origin' : '*'
    }
  }).then(_cb).catch(_catchcb)
}
