import axios from '@/libs/api.request'
import {
  commonUpload
} from '@/api/publicApis'
// 物料
export const getMaterialTemplate = (params) => {
  return axios.request({
    url: '/material/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importMaterialTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/material/importDataExcel?orgId=${orgId}`)
}

// BOM
export const getBomTemplate = (params) => {
  return axios.request({
    url: '/bom/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importBomTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/bom/importDataExcel?orgId=${orgId}`)
}

// 工序
export const getProdProcessTemplate = (params) => {
  return axios.request({
    url: '/workProcess/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importProdProcessTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/workProcess/importDataExcel?orgId=${orgId}`)
}

// 资源
export const getResourceTemplate = (params) => {
  return axios.request({
    url: '/resource/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importResourceTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/resource/importDataExcel?orgId=${orgId}`)

}
// 工作中心
export const getWorkCenterTemplate = (params) => {
  return axios.request({
    url: '/workCenter/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importWorkCenterTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/workCenter/importDataExcel?orgId=${orgId}`)

}
// 班组
export const getTeamTemplate = (params) => {
  return axios.request({
    url: '/team/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importTeamTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/team/importDataExcel?orgId=${orgId}`)
}
// 工艺模版
export const getTechnologyManagerTemplate = (params) => {
  return axios.request({
    url: '/craft/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importTechnologyManagerTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/craft/importDataExcel?orgId=${orgId}`)
}
// 产品工艺
export const getProdTechnologyTemplate = (params) => {
  return axios.request({
    url: '/materialAndCraft/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importProdTechnologyTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/materialAndCraft/importDataExcel?orgId=${orgId}`)
}
