import axios from '@/libs/api.request'
import {
  commonUpload
} from '@/api/publicApis'
// 生产计划
export const getProducePlanTemplate = (params) => {
  return axios.request({
    url: '/productionOrder/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importProducePlanTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/productionOrder/importExcel?orgId=${orgId}`)
}

// 设备加工任务
export const getProduceTaskTemplate = (params) => {
  return axios.request({
    url: '/productionDeviceTask/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importProduceTaskTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/productionDeviceTask/importExcel?orgId=${orgId}`)
}

//设备运行维护
export const getDeviceRunTemplate = (params) => {
  return axios.request({
    url: '/deviceRunning/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importDeviceRunTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/deviceRunning/importExcel?orgId=${orgId}`)
}

//设备故障维护
export const getDeviceErrorTemplate = (params) => {
  return axios.request({
    url: '/deviceErr/exportTemplateExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importDeviceErrorTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/deviceErr/importExcel?orgId=${orgId}`)

}

