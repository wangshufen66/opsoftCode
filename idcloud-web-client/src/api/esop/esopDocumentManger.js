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
  return process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
}

export const getFolderTree = (params) => {
  return axios.request({
    url: '/esop_file/getFolderTree',
    method: 'get',
    params: params
  })
}

export const getFiles = (params) => {
  return axios.request({
    url: '/esop_file/getFiles',
    method: 'get',
    params: params
  })
}

export const createFolder = (params) => {
  return axios.request({
    url: '/esop_file/createFolder',
    method: 'post',
    params: params
  })
}

export const deleteFolder = (data) => {
  return axios.request({
    url: '/esop_file/deleteFolder',
    method: 'post',
    data: data
  })
}

export const renameFolder = (data) => {
  return axios.request({
    url: '/esop_file/renameFolder',
    method: 'post',
    data: data
  })
}

export const modifyFolder = (data) => {
  return axios.request({
    url: '/esop_file/modifyFolder',
    method: 'post',
    data: data
  })
}

export const auditFile = (data) => {
  return axios.request({
    url: '/esop_file/auditFile',
    method: 'post',
    data: data
  })
}

export const antiAudiFile = (data) => {
  return axios.request({
    url: '/esop_file/antiAudiFile',
    method: 'post',
    data: data
  })
}

export const deleteFile = (data) => {
  return axios.request({
    url: '/esop_file/deleteFile',
    method: 'post',
    data: data
  })
}

// export const viewFile = (params) => {
//   return axios.request({
//     url: '/esop_file/viewFile',
//     method: 'get',
//     params: params
//   })
// }

export function uploadFile (file,level,pid,fileName,orgId,_cb,_catchcb) {
  const fd = new FormData();
  const url='/esop_file/uploadFile'
  fd.append('file',file)
  fd.append('level',level)
  fd.append('pid',pid)
  fd.append('fileName',fileName)
  fd.append('orgId',orgId)
  return api.post(url,fd,{
    headers : {
      "Authorization":'Bearer '+store.state.user.token,
      'Content-Type' : 'multipart/form-data',
      'Access-Control-Allow-Origin' : '*'
    }
  }).then(_cb).catch(_catchcb)
}
