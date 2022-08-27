//报表统计 子目录接口
import axios from '@/libs/api.request'

// 设备运行统计
export const runningStatics = (params) => {
        return axios.request({
            url: '/deviceReport/runningStatics',
            method: 'get',
            params: params
        })
    }
    // 导出设备运行统计
export const exportRunningStatics = (params) => {
        return axios.request({
            url: '/deviceReport/exportRunningStatics',
            method: 'get',
            params: params,
            responseType: 'blob'
        })
    }
    // 设备利用率统计
export const usageRateStatics = (params) => {
        return axios.request({
            url: '/deviceReport/usageRateStatics',
            method: 'get',
            params: params
        })
    }
    // 导出设备利用率统计
export const exportUsageRateStatics = (params) => {
        return axios.request({
            url: '/deviceReport/exportUsageRateStatics',
            method: 'get',
            params: params,
            responseType: 'blob'
        })
    }
    // 设备产量统计
export const produceStatics = (params) => {
        return axios.request({
            url: '/deviceReport/produceStatics',
            method: 'get',
            params: params
        })
    }
    // 导出设备产量统计
export const exportProduceStatics = (params) => {
        return axios.request({
            url: '/deviceReport/exportProduceStatics',
            method: 'get',
            params: params,
            responseType: 'blob'
        })
    }
    // 生产产能统计
export const deviceProduceCapacityStatics = (params) => {
        return axios.request({
            url: '/deviceReport/deviceProduceCapacityStatics',
            method: 'get',
            params: params
        })
    }
    // 导出生产产能统计
export const exportProduceCapacityStatics = (params) => {
        return axios.request({
            url: '/deviceReport/exportProduceCapacityStatics',
            method: 'get',
            params: params,
            responseType: 'blob'
        })
    }
    // 设备综合统计
export const deviceSummaryStatics = (params) => {
        return axios.request({
            url: '/deviceReport/deviceSummaryStatics',
            method: 'get',
            params: params
        })
    }
    // 导出设备综合统计
export const exportDeviceSummaryStatics = (params) => {
        return axios.request({
            url: '/deviceReport/exportDeviceSummaryStatics',
            method: 'get',
            params: params,
            responseType: 'blob'
        })
    }
    // 设备维保统计
export const deviceMaintenanceStatics = (params) => {
        return axios.request({
            url: '/deviceReport/deviceMaintenanceStatics',
            method: 'get',
            params: params
        })
    }
    // 导出设备维保统计
export const exportDeviceMaintenanceStatics = (params) => {
    return axios.request({
        url: '/deviceReport/exportDeviceMaintenanceStatics ',
        method: 'get',
        params: params,
        responseType: 'blob'
    })
}

//设备维保统计=》查看保养完成详情
export const maintenanceCompletedStatics = (params) => {
    return axios.request({
        url: '/workOrder/getStatisticsList',
        method: 'get',
        params: params
    })
};