import axios from '@/libs/api.request'
import {
  commonUpload
} from '@/api/publicApis'
// 币别
export const getCurrencyTemplate = (params) => {
  return axios.request({
    url: '/currency/getCurrencyExcelTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importCurrencyTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/currency/importCurrencyExcel?orgId=${orgId}`)
}

// 计量单位
export const getUnitTemplate = (params) => {
  return axios.request({
    url: '/unit/getUnitExcelTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importUnitTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/unit/importUnitExcel?orgId=${orgId}`)
}

// 不良原因
export const getCauseTemplate = (params) => {
  return axios.request({
    url: '/cause/exportExcelTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importCauseTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/cause/importExcel?orgId=${orgId}`)
}


// 部门
export const getDepartmentTemplate = (params) => {
  return axios.request({
    url: '/department/getDepartmentTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importDepartmentTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/department/importDepartmentExcel?orgId=${orgId}`)
}

// 员工
export const getPeopleTemplate = (params) => {
  return axios.request({
    url: '/person/getPersonTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importPeopleTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/person/importPersonExcel?orgId=${orgId}`)

}
// 客户
export const getClientTemplate = (params) => {
  return axios.request({
    url: '/client/getClientTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importClientTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/client/importClientExcel?orgId=${orgId}`)

}
// 供应商
export const getSupplierTemplate = (params) => {
  return axios.request({
    url: '/supplier/getSupplierTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importSupplierTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/supplier/importSupplierExcel?orgId=${orgId}`)
}
// 仓库
export const getWarehouseTemplate = (params) => {
  return axios.request({
    url: '/warehouse/getWarehouseTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importWarehouseTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/warehouse/importWarehouseExcel?orgId=${orgId}`)
}
// 仓位
export const getWarehousePositionTemplate = (params) => {
  return axios.request({
    url: '/warehousePosition/getWarehousePositionTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export const importWarehousePositionTemplate = (file, fileName, orgId) => {
  return commonUpload(file, fileName, `/warehousePosition/importWarehousePositionExcel?orgId=${orgId}`)
}
