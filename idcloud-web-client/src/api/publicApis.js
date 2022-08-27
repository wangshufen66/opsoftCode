import config from '@/config'
import axios from 'axios'
import store from "@/store";

const api = axios.create({
  baseURL: _getBaseUrl(),
});

function _getBaseUrl() {
  return process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
}

// 上传文件到fdfs server
export function uploadFile(file, fileName, _cb, _catchcb) {
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


// 通用上传功能
export function commonUpload(file, fileName, url, _cb, _catchcb) {
  const fd = new FormData();
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


/**
 *
// if (res.data) {
//   const filename = i.fafsName;
//   let blob = new Blob([res.data], {
//     type: res.data.type
//   });
//   if (window.navigator.msSaveOrOpenBlob) {
//     // IE10+下载
//     navigator.msSaveOrBlob(blob, filename);
//   } else {
//     let link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = filename;
//     document.body.appendChild(link);
//     var evt = document.createEvent("MouseEvents");
//     evt.initEvent("click", false, false);
//     link.dispatchEvent(evt);
//     document.body.removeChild(link);
//   }
// }
 *
 * @export
 * @param {*} url
 * @returns
 */
export function downloadFile(url) {
  return axios({
    method: 'get',
    url: url,
    responseType: 'blob'
  })
}
