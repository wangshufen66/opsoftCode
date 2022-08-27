import {
  getTree,
  getInfoPointData,
  getInfoPoint,
  getDepartmentData,
  getDeviceData,
  postChartData
} from '@/api/device-watch/device'
export default {
  methods: {
    async getTreeData(param) {
      try {
        let res = await Promise.resolve(getTree(param))
        return res
      } catch (e) {
        console.log(e);
      }
    },
    async getInfoPointData(param) {
      try {
        let res = await Promise.resolve(getInfoPointData(param))
        return res
      } catch (e) {
        console.log(e);
      }
    },
    async getDepartmentData(param) {
      try {
        let res = await Promise.resolve(getDepartmentData(param))
        return res
      } catch (e) {
        console.log(e);
      }
    },
    async getDeviceData(param) {
      try {
        let res = await Promise.resolve(getDeviceData(param))
        return res
      } catch (e) {
        console.log(e);
      }
    },
    async getInfoPoint(param) {
      try {
        let res = await Promise.resolve(getInfoPoint(param))
        return res
      } catch (e) {
        console.log(e);
      }
    },
    async getChartData(param) {
      try {
        let res = await Promise.resolve(postChartData(param))
        return res
      } catch (e) {
        console.log(e);
      }
    },
  }

}
