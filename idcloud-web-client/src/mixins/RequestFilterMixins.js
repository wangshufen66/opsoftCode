import {datetimeStdStrFormateToDatetime} from "@/utils/dateUtils"

export const RequestFilterMixins = {
  methods: {
    //  请求参数中追加过滤条件
    appendFilterParams(vuexModuleKey,vuexSecondKey, params, columns) {
      let tableColumns=[]
      // 根据获取到的ref对象是否是数组，来判定获取ref的方式
      let tableDom = Array.isArray(this.$refs[`tableEl_${vuexSecondKey}`])?this.$refs[`tableEl_${vuexSecondKey}`][0]
        :this.$refs[`tableEl_${vuexSecondKey}`]

      if (!columns) {
        tableColumns = [...this.$store.state[vuexModuleKey][`${vuexSecondKey}Columns`].columns]
      }else {
        tableColumns = [...columns]
      }
      // 字符串查询判定
      if (!(!this.tabs[vuexSecondKey].tableConfig.search)) {
        const curFilterTextKey = tableDom.searchTextContentConfig.value
        for (const col of tableColumns) {
          if (col.type === 'text' && col.key === curFilterTextKey) {
            params[curFilterTextKey] = this.tabs[vuexSecondKey].tableConfig.search
          }
        }
      }
      // 类型查询判定
      if (tableDom.searchTypeSwitch){  // 若开关开启，则加入筛选条件
        const curFilterTypeKey = tableDom.searchTypeConfig.value
        for (const col of tableColumns) {
          if (col.type === 'select' && col.key === curFilterTypeKey) {
            params[curFilterTypeKey] = tableDom.searchTypeContentConfig.value
          }
        }
      }
      // 日期查询判定
      if (true){  // 若开关开启，则加入筛选条件

        // console.log('开始时间：' + this.searchDateTimeRangeConfig.startDateTime)

        const curFilterDateKey = tableDom.searchDateConfig.value
        for (const col of tableColumns) {
          if (col.type === 'datetime' && col.key === curFilterDateKey) {
            if (!(!this.searchDateTimeRangeConfig.startDateTime) && !(!this.searchDateTimeRangeConfig.endDateTime)) {
              // params[curFilterDateKey] = [datetimeStdStrFormateToDatetime(this.searchDateTimeRangeConfig.startDateTime),
              //   datetimeStdStrFormateToDatetime(this.searchDateTimeRangeConfig.endDateTime)]
              params[`${curFilterDateKey}Start`] = datetimeStdStrFormateToDatetime(this.searchDateTimeRangeConfig.startDateTime)
              params[`${curFilterDateKey}End`] = datetimeStdStrFormateToDatetime(this.searchDateTimeRangeConfig.endDateTime)
            }else if (!(!this.searchDateTimeRangeConfig.startDateTime)) {
              params[`${curFilterDateKey}Start`] = datetimeStdStrFormateToDatetime(this.searchDateTimeRangeConfig.startDateTime)
            }else if (!(!this.searchDateTimeRangeConfig.endDateTime)) {
              params[`${curFilterDateKey}End`] = datetimeStdStrFormateToDatetime(this.searchDateTimeRangeConfig.endDateTime)
            }
          }
        }
      }
      // console.log('当前过滤参数是：' + JSON.stringify(params))

    },
  }
}
