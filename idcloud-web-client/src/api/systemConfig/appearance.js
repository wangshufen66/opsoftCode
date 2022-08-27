import axios from '@/libs/api.request'
import config from '@/config'
import axiosUpload from 'axios'
import store from "@/store";

const api = axiosUpload.create({
  baseURL: _getBaseUrl(),
});

function _getBaseUrl() {
  return process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
}
export function uploadPic(file, fileName, _cb, _catchcb) {
  const fd = new FormData();
  const url = '/file/upload'
  fd.append('file', file)
  fd.append('fileName', fileName)
  return api.post(url, fd, {
    headers: {
      "Authorization": 'Bearer ' + store.state.user.token,
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*'
    }
  }).then(_cb).catch(_catchcb)
}

export const getAppearanceList = (param) => {
  return axios.request({
    url: '/appearance/appearanceImgList',
    method: 'get',
    params: param
  })
}

export const saveImg = info => {
  return axios.request({
    url: '/appearance/saveAppearanceImg',
    data: info,
    method: 'post'
  })
}

export const updateImg = info => {
  return axios.request({
    url: '/appearance/updateAppearanceImg',
    data: info,
    method: 'post'
  })
}

export const deleteImg = info => {
  return axios.request({
    url: '/appearance/delAppearanceImg',
    data: info,
    method: 'post'
  })
}
