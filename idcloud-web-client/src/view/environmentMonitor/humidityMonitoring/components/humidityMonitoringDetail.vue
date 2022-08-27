<template>
  <div id="container"
       v-loading="loading"
       element-loading-text="数据加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.5)"
       :fullscreen="false">

    <div id="dateTimeSelect"
         style="display: flex;margin-bottom: 1rem;flex-direction: row;justify-items: center;justify-content: flex-end">
      <!--<el-select v-model="searchTypeValue" size="small" :clearable="false" placeholder="请选择"-->
                 <!--@change="handleSearchTypeChange"-->
                 <!--style="width: 150px;margin-right: 10px;margin-top: 1px;">-->
        <!--<el-option-->
          <!--v-for="item in searchTypeOptions"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<Form v-show="searchTypeValue !== '0' && searchTypeValue !== '1'" ref="dataForm" :model="queryValidate"-->
            <!--:rules="ruleCustom"-->
            <!--style="display: flex;flex-direction:row;justify-content: center">-->
        <!--&lt;!&ndash;<span style="font-size: large;margin-top: 0.1rem;">监测点1 电量信息</span>&ndash;&gt;-->
        <!--<FormItem prop="queryStartTime">-->
          <!--<Date-picker type="date" :placeholder="searchTypeValue==='2'?'日期':'开始'" style="width: 200px"-->
                       <!--v-model="queryValidate.queryStartTime"-->
                       <!--:transfer="true" :options="dateOptionsLeft"-->
                       <!--@on-change="handleStartTimeChange"/>-->
        <!--</FormItem>-->
        <!--<FormItem v-show="searchTypeValue==='3'" prop="queryEndTime" style="margin-left: 1.5em;">-->
          <!--<Date-picker type="date" placeholder="结束" :transfer="true"-->
                       <!--style="width: 200px" :options="dateOptionsRight"-->
                       <!--v-model="queryValidate.queryEndTime"-->
                       <!--@on-change="handleEndTimeChange"/>-->
        <!--</FormItem>-->
        <!--<FormItem>-->
          <!--<el-button class="dateTimeSelectButton" type="primary" size="small"-->
                     <!--style="width: 70px;margin-left: 1.5em;"-->
                     <!--@click="handleTransmitSelectedTimes('dataForm')">-->
            <!--查询-->
          <!--</el-button>-->
        <!--</FormItem>-->
      <!--</Form>-->
      <el-radio-group class="queryRadioGroup" v-model="queryRadio" size="small" @change="handleSearchTypeChange">
        <el-radio-button label="0">今日</el-radio-button>
        <el-radio-button label="1">本周</el-radio-button>
        <el-radio-button label="2">本月</el-radio-button>
      </el-radio-group>
      <DatePicker
        v-model="queryTime"
        :options="dateOptions"
        type="datetimerange"
        placeholder="请选择时间范围"
        class="queryTime"
        style="width: 320px;margin-right: 55px;"
        @on-ok="handleSearchTypeChange('3')"></DatePicker>
    </div>

    <new-line-chart
      ref="humidityLineChart"
      :loading="chartLoading"
      :style="{height:chartHeight+'rem'}"
      :grid="chartGird"
      :titleShow="chartTitleShow"
      :titleTextFontSize="chartTitleTextFontSize"
      :titleText="chartTitleText"
      :tooltipShow="chartTooltipShow"
      :tooltipTextFontSize="chartTooltipTextFontSize"
      :dataZoomShow="chartDataZoomShow"
      dataUnit="%"
    >
    </new-line-chart>
    <div id="listTabText" style="margin-bottom: -30px">
      <span style="font-size: 30px"><strong>{{title}}</strong></span>
    </div>
    <table-el
      class="detail-table"
      v-if="tableShow"
      :ref="`tableEl_${tabKey}`"
      :table-height="tableHeight"
      :table-tag="tabKey"
      :serverPage="tabs.humidityMonitoringDetail.serverPage"
      :table-uni-key="tabs.humidityMonitoringDetail.tableUniKey"
      :vuex-first-key="tabs.humidityMonitoringDetail.vuexFirstKey"
      :vuex-second-key="tabs.humidityMonitoringDetail.vuexSecondKey"
      :columns-std="tabs.humidityMonitoringDetail.columnsStd"
      :table-config="tabs.humidityMonitoringDetail.tableConfig"
      :hasAddButton="hasAddButton"
      :hasServerExcelImportButton="hasServerExcelImportButton"
      :showTableColumnsSetting="false"
      :hasSearch="false"
      :hasSelectColumn="false"
      :hasActionColumn="false"
      :hasPageBar="false"
      :hasAuditAccess="false"
      :hasAntiAuditAccess="false"
      :hasDisableAccess="false"
      :hasAntiDisableAccess="false"
      :hasConfigTableHeadBtn="false"
      :hasShowAllBtn="false"
      :hasHeadEditAccess="false"
      :hasHeadDelAccess="false"
      @requestTablePageData="handleRequestTablePageData">
    </table-el>
  </div>
</template>

<script>
  import newLineChart from "@/components/newLineChart/index"
  import TableEl from "@/components/table-el/index"
  import {
    dateCompare,
    datetimeStdStrFormateToDatetime,
    getNowDate,
    getTormorrowDate,
    datetimeStdStrFormateToDate
  } from '@/utils/dateUtils'
  import {detail} from '@/api/environmentMonitor/humidityMonitor'
  import moment from 'moment'

  export default {
    name: "humidityMonitoringDetail",
    components: {newLineChart, TableEl},
    props: {
      title: {
        type: String,
        default() {
          return '监测点'
        }
      }
    },
    data() {
      // //验证
      // const validateQueryStartTime = (rule, value, callback) => {
      //   if (value === '') {
      //     callback(new Error('不能为空'));
      //   } else if (dateCompare(value, this.queryValidate.queryEndTime) === 0 || dateCompare(value, this.queryValidate.queryEndTime) === 1) {
      //     callback(new Error('开始时间必须小于结束时间'));
      //   } else {
      //     callback();
      //   }
      // };
      // const validateQueryEndTime = (rule, value, callback) => {
      //   if (this.searchTypeValue !== '3') {
      //     callback();
      //   }else if (value === '') {
      //     callback(new Error('不能为空'));
      //   } else if (dateCompare(this.queryValidate.queryStartTime, value) === 0 || dateCompare(this.queryValidate.queryStartTime, value) === 1) {
      //     callback(new Error('开始时间必须小于结束时间'));
      //   } else {
      //     callback();
      //   }
      // };

      return {
        detailData: '',
        tabKey: 'humidityMonitoringDetail',
        buttonParentName: 'idc_humidityMonitoringDetail', // 所有按钮对应的菜单名称（后台数据库存放的数据决定的）
        accessButtons: this.$store.state.user.accessButton, //获取当前存储的当前登录用户的所有权限按钮，根据名称进行匹配
        timerComm: null,  // 公共定时器
        chartLoading: false,
        tableShowTimer: null,
        tableShow: true,
        tableHeight: '300',
        pageHeight: 0,
        activeTab: 'humidityMonitoringDetail',  // 当前激活的页签(对象的key值)
        showAddTab: false,  // 控制添加页签的显示和隐藏
        hackTimer: null,  // 用于强制重新渲染组件timer定时器
        hasAddButton: false,
        hasServerExcelImportButton: false,
        hasTransmitButton: false,
        hasTransmitNoButton: false,
        hasSettleButton: false,
        hasSettleNoButton: false,
        // 按钮点击时的提示气泡框显示控制
        showHintTransmitButton: false,
        showHintTransmitButtonNo: false,
        showHintSettleButton: false,
        showHintSettleButtonNo: false,
        // //日期选择优化
        // dateOptionsLeft: {
        //   disabledDate(date) {
        //     return date && date.valueOf() > Date.now();
        //   },
        //   shortcuts: [
        //     {
        //       text: '昨天',
        //       value() {
        //         const date = new Date();
        //         date.setTime(date.getTime() - 3600 * 1000 * 24);
        //         return moment(date).format('YYYY-MM-DD HH:mm:ss');
        //       },
        //       onClick: (picker) => {
        //
        //       }
        //     },
        //     {
        //       text: '一周前',
        //       value() {
        //         const date = new Date();
        //         date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        //         return moment(date).format('YYYY-MM-DD HH:mm:ss');
        //       },
        //       onClick: (picker) => {
        //
        //       }
        //     },
        //     {
        //       text: '三周前',
        //       value() {
        //         const date = new Date();
        //         date.setTime(date.getTime() - 3600 * 1000 * 24 * 21);
        //         return moment(date).format('YYYY-MM-DD HH:mm:ss');
        //       },
        //       onClick: (picker) => {
        //
        //       }
        //     },
        //   ]
        // },
        // dateOptionsRight: {
        //   disabledDate(date) {
        //     return date && date.valueOf() > Date.now();
        //   },
        //   shortcuts: [
        //     {
        //       text: '今天',
        //       value() {
        //         return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        //       },
        //       onClick: (picker) => {
        //
        //       }
        //     },
        //     {
        //       text: '昨天',
        //       value() {
        //         const date = new Date();
        //         date.setTime(date.getTime() - 3600 * 1000 * 24);
        //         return moment(date).format('YYYY-MM-DD HH:mm:ss');
        //       },
        //       onClick: (picker) => {
        //
        //       }
        //     }
        //   ]
        // },
        //当前搜索框关-------
        dateOptions: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now();
          },
          shortcuts: [
            {
              text: '昨天',
              value() {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
              },
              onClick: (picker) => {

              }
            },
            {
              text: '一周前',
              value() {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
              },
              onClick: (picker) => {

              }
            },
            {
              text: '三周前',
              value() {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 21);
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
              },
              onClick: (picker) => {

              }
            },
          ]
        },
        queryTime: '',
        queryRadio: '0',
        //--------------------

        tableColumns: [
          // {
          //   title: '监测点代码',
          //   key: 'monitorNumber',
          //   width: '250',
          //   type: 'text',
          // },
          // {
          //   title: '监测点名称',
          //   key: 'monitorName',
          //   // width: '250',
          //   type: 'text',
          // },
          {
            title: '相对湿度（%）',
            key: 'consumption',
            // width: '250',
            type: 'text',
          },
          {
            title: '采集时间',
            key: 'createTime',
            // width: '220'
          },
          {
            title: '采集频率',
            key: 'frequency',
            width: '100',
          },
        ],
        // searchTypeValue: '0',
        // searchTypeOptions: [{
        //   value: '0',
        //   label: '今日数据'
        // }, {
        //   value: '1',
        //   label: '近7天数据'
        // }, {
        //   value: '2',
        //   label: '自定义日期'
        // }, {
        //   value: '3',
        //   label: '自定义日期范围'
        // }],
        tabs: {
          humidityMonitoringDetail: {
            label: '电量详细信息',
            type: 'normal',
            show: false,
            tableUniKey: 'id', // 作为表格数据唯一识别的字段名（即 属性 key）
            vuexFirstKey: 'humidityMonitoringDetail', // 表格组件获取 vuex 数据的 一级Key
            vuexSecondKey: 'humidityMonitoringDetail', // 表格组件获取 vuex 数据的 二级Key
            serverPage: true, // 分页模式，true=后台分页，false=前台分页
            // 记录所有的数据的列字段，包括不用显示的列字段（有些字段无需显示，但需要与后台进行交互）
            columnsStd: [],
            tableConfig: {
              loading: false,
              tableName: '',  // 表格名称，在导出成Excel时，会使用该名称作为文件名
              columns: [],
              pageData: [], // 根据当前页最大行数进行分页计算所得的 当前页显示数据
              filterData: [], // 根据当前搜索内容进行过滤的表格数据
              // 表格的原始数据
              data: [],
              curPage: 1,
              pageSize: 10, // 每页最多显示行数`
              pageSizeOpts: [5, 10, 20, 30, 50, 100],
              pageTotal: 1,  // 分页总数，《后台分页功能》下会使用此变量
              countTotal: 0,
              search: '', // 输入的搜索名称
              searchPlaceholder: '请输入', // 搜索输入栏的提示
              // 单选搜索下拉框的选项集合：
              // 1、如果设为空，则默认使用收集当前所有的列属性作为搜索下拉框的选项集合，即 支持对表格的所有列进行搜索
              // 2、如果设置列字段对象数组，则将根据此变量作为搜索下拉框的选项集合（前提是columns中存在的里属性对象，这里会对此变量进行匹配验证）
              selectSearchColumnSelections: [],
              // 单选下拉框的选择内容，决定搜索栏位的搜索内容对应的 列名 key
              selectSearchColumn: '',
              // 单选下拉框的未选择任何内容时的提示内容
              selectSearchColumnPlaceholder: '请选择',
              showTotal: true,  // 是否显示 总数
              showPageInput: true // 是否显示页码跳转输入框
            }
          },
        },
        chartHeight: 25,
        chartGird: {
          left: '85px',
          right: '50px',
          top: '45px',
          bottom: '50px',
          height: '290rem',
          width: document.documentElement.clientWidth * 0.78,
          // width: '100rem',
        },
        chartTitleShow: true,
        chartTitleText: '湿度（%）',
        chartTitleTextFontSize: 15,
        chartTooltipShow: true,
        chartTooltipTextFontSize: 15,
        chartDataZoomShow: true,

        // queryValidate: {
        //   queryStartTime: '',
        //   queryEndTime: '',
        // },
        // ruleCustom: {
        //   queryStartTime: [
        //     {validator: validateQueryStartTime, trigger: 'blur'}
        //   ],
        //   queryEndTime: [
        //     {validator: validateQueryEndTime, trigger: 'blur'}
        //   ],
        // },
        loading: false
      }

    },
    mounted() {
    },
    methods: {
      appendRequestParams(params) {
        // 根据当前下拉选择类型传递相应的日期时间范围参数
        let currentdate = ''
        let preDate = ''
        switch (this.queryRadio) {
          case '0': // 今日
            // 不传日期范围参数，后台默认范围当天的数据，从0点到当前时间
            // currentdate = moment(new Date()).format('YYYY-MM-DD')
            // params[`startTime`] = currentdate + ' 00:00:00'
            // params[`endTime`] = currentdate + ' 23:59:59'
            console.log('今日筛选条件：' + JSON.stringify(params))
            break;
          case '1': // 近7天数据 => 本周
            // currentdate = moment(new Date()).format('YYYY-MM-DD')
            // const curDate = new Date()
            // preDate = moment(new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD') //减7天
            // params[`startTime`] = preDate + ' 00:00:00'
            // params[`endTime`] = currentdate + ' 23:59:59'
            // console.log('近7天数据筛选条件：' + JSON.stringify(params))
            // console.log(new Date(new Date() - (new Date().getDay() - 1) * 86400000))
            currentdate = moment(new Date()).format('YYYY-MM-DD')
            const curDate = new Date()
            preDate = moment(new Date(curDate.getTime() - (curDate.getDay() - 1) * 86400000)).format('YYYY-MM-DD') //减7天
            params[`startTime`] = preDate + ' 00:00:00'
            params[`endTime`] = currentdate + ' 23:59:59'
            console.log('近7天数据筛选条件：' + JSON.stringify(params))
            break;
          case '2': // 本月
            params[`startTime`] = moment(getNowDate() + ' 00:00:00').format('YYYY-MM-01 HH:mm:ss')
            // const oneDate = new Date(getNowDate)
            // const nextDate = moment(new Date(oneDate.getTime() + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD') //加一天
            params[`endTime`] = moment(getTormorrowDate() + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss')
            console.log('自定义某一天的筛选条件：' + JSON.stringify(params))
            break;
          case '3': // 自定义选择某一段日期范围
            params[`startTime`] = moment(datetimeStdStrFormateToDate(this.queryTime[0]) + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss')
            const oneDateD = new Date(datetimeStdStrFormateToDate(this.queryTime[1]))
            const nextDateD = moment(new Date(oneDateD.getTime() + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD') //加一天
            params[`endTime`] = moment(nextDateD + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss')
            console.log('自定义时间范围的筛选条件：' + JSON.stringify(params))
            break;
          default:
            break;
        }
      },
      // 将后台数据转换成前端可用于显示折线统计图图形的数据
      convertResponseToLineChartData(respData) {
        const tmp = respData
        respData = respData['humidityUseList']
        //后台数据到日期+1，所以在这边切掉最后一天
        if (tmp.grained === 2) {
          respData.splice(respData.length - 1, 1)
        }
        let chartData = {
          xAxisData: [],
          seriesData: []
        }

        // console.log('后台传递的统计图数据：' + JSON.stringify(respData))

        // console.log('后台传递的统计图数据：' + JSON.stringify(respData))
        if(respData && respData.length > 0){
          switch (this.queryRadio) {
            case '0': // 今日
              chartData = {...this.toTodayChartData(respData)}
              break;
            case '1': // 近7天数据
              chartData = {...this.toSevenDaysChartData(respData)}
              break;
            case '2': // 自定义选择某一天
              chartData = {...this.toOneDayChartData(respData)}
              break;
            case '3': // 自定义选择某一段日期范围
              chartData = {...this.toDateRangeChartData(respData)}
              break;
            default:
              break;
          }
        }
        return chartData
      },

      setLineChartMin(chartData) {
        // 取数组最小值
        let min = parseInt(chartData.seriesData.reduce(function(a , b){
          return b < a ? b : a;
        }))
        min = parseInt(min * 0.8)
        let strTmp = String(min)
        strTmp = strTmp.substring(0,1)
        // console.log('max = ' + max)
        // console.log('strTmp = ' + strTmp)
        let beishuStr = '1'
        let forCount = String(min).length - 1
        for (let i = 0; i < forCount; i++) {
          beishuStr = beishuStr + '0'
        }
        // console.log('beishuStr = ' + beishuStr)
        min = parseInt(strTmp) * parseInt(beishuStr)

        // console.log('数组最小值：' + min)

        this.$refs['humidityLineChart'].chartData.yAxisData.yAxisMin = min
      },

      setLineChartMax(chartData) {
        // 取数组最大值
        let max = parseInt(chartData.seriesData.reduce(function(a , b){
          return b > a ? b : a;
        }))
        max = parseInt(max * 1.5)
        let strTmp = String(max)
        strTmp = strTmp.substring(0,1)
        // console.log('max = ' + max)
        // console.log('strTmp = ' + strTmp)
        let beishuStr = '1'
        let forCount = String(max).length - 1
        for (let i = 0; i < forCount; i++) {
          beishuStr = beishuStr + '0'
        }
        // console.log('beishuStr = ' + beishuStr)
        max = parseInt(strTmp) * parseInt(beishuStr)
        // console.log('max = ' + max)
        this.$refs['humidityLineChart'].chartData.yAxisData.yAxisMax =  max
      },

      setLineChartMinMax(chartData) {
        this.$refs['humidityLineChart'].chartData.yAxisData.yAxisSplitNumber = 5
        this.setLineChartMin(chartData)
        this.setLineChartMax(chartData)
      },

      toTodayChartData(respData) {
        return this.toOneDayChartData(respData)
      },

      toSevenDaysChartData(respData) {
        return this.toDateRangeChartData(respData)
      },

      toOneDayChartData(respData) {
        let chartData = {
          xAxisData: [],
          seriesData: []
        }
        let tmpData = [...respData]
        if (tmpData.length > 1) {
          for (let i = 1; i < tmpData.length; i++) {
            chartData.xAxisData.push(moment(tmpData[i]['time']).format('HH:mm:ss'))
            tmpData[i]['num'] = tmpData[i]['num']
            chartData.seriesData.push(tmpData[i]['num'])
            // console.log('num = ' + tmpData[i]['num'])
          }

          this.setLineChartMinMax(chartData)

          return chartData
        }
      },

      toDateRangeChartData(respData) {
        let chartData = {
          xAxisData: [],
          seriesData: []
        }

        let tmpData = [...respData]
        if (tmpData.length > 1) {
          for (let i=1; i<tmpData.length; i++) {
            chartData.xAxisData.push(moment(tmpData[i]['time']).format('YYYY-MM-DD'))
            tmpData[i]['num'] = tmpData[i]['num']
            chartData.seriesData.push(tmpData[i]['num'])
            console.log('num = ' + tmpData[i]['num'])
          }

          this.setLineChartMinMax(chartData)

          return chartData
        }
      },

      handleRequestTablePageData(tableTag, curPage, curPageSize, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        this.refreshTabTable(tableTag, curPage, curPageSize, callback)
      },

      // 刷新某页签下的表格数据（重新请求）
      refreshTabTable(tableTag, curPage, curPageSize, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'humidityMonitoringDetail': // 生产任务单
            // 请求<生产任务单>页签下的表格数据
            this.requestDetailData(curPage, curPageSize, callback)
            break
        }
      },
      // 请求<生产任务单>页签下的表格数据
      requestDetailData(curPage, curPageSize, callback) {
        // 请求参数
        // let params = {
        //   "uid": this.detailData['uid'],
        //   "mac": this.detailData['mac'],
        //   "attrHidden": this.detailData['attrHidden'],
        //   "attrName": this.detailData['attrName'],
        //   "humidityNum": this.detailData['humidityNum'],
        //   "onlineStatus": this.detailData['onlineStatus'],
        //   "showType": this.detailData['showType'],
        //   "orgId":this.$store.state.user.userInfo.orgId
        // }
        let params = {
          "collectId": this.detailData['collectId'],
          "collectNumber": this.detailData['collectNumber'],
          "collectTableName": this.detailData['collectTableName'],
          "pointId": this.detailData['pointId'],
          "pointName": this.detailData['pointName'],
          "pointNumber": this.detailData['pointNumber'],
          "pointTableName": this.detailData['pointTableName'],
          "orgId":this.$store.state.user.userInfo.orgId
        };
        this.appendRequestParams(params)

        console.log('列表请求参数：' + JSON.stringify(params))
        let promiseArray = [
          //列表请求
          detail(params)
        ]

        this.chartLoading = true
        this.tabs.humidityMonitoringDetail.tableConfig.loading = true
        Promise.all(promiseArray).then(response => {
          // console.log('echarts response = ' + JSON.stringify(response))
          let [humidityMonitoringResponse] = response;

          if(humidityMonitoringResponse.data.data.tableName!==undefined)
            humidityMonitoringResponse.data.data.humidityUseList=humidityMonitoringResponse.data.data.pointHisList
          // 接收页签的表格数据（后台数据）
          this.receiveChartData(humidityMonitoringResponse)
          this.receiveMoTableData(humidityMonitoringResponse, callback)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.chartLoading = false
          this.tabs.humidityMonitoringDetail.tableConfig.loading = false
        })
      },
      // 接收<生产任务单>页签的表格数据（后台数据）
      receiveChartData(response) {
        // console.log(JSON.stringify(response))
        response = response.data

        if (response.code !== 200) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: `原因：${response.msg}`
          })
        } else if (!response.hasOwnProperty('data')) {
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的反馈数据为NULL'
          })
        } else {
          // this.tabs.humidityMonitoringDetail.tableConfig.columnsStd = this.$store.state['humidityMonitoringDetail'].moColumns.columnsStd
          // this.tabs.humidityMonitoringDetail.tableConfig.columns = this.tableColumns
          // this.tabs.humidityMonitoringDetail.tableConfig.countTotal = response.data.total
          // console.log('数据：' + JSON.stringify(tableData))

          // 将后台数据转换成前端可用于显示折线统计图图形的数据
          let chartData = this.convertResponseToLineChartData(response.data)
          console.log(chartData)
          this.$refs[`humidityLineChart`].drawLine(chartData.xAxisData, chartData.seriesData)
        }
      },
      // 接收<生产任务单>页签的表格数据（后台数据）
      receiveMoTableData(response, callback) {
        // console.log(JSON.stringify(response))
        response = response.data

        if (response.code !== 200) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: `原因：${response.msg}`
          })
        } else if (!response.hasOwnProperty('data')) {
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的反馈数据为NULL'
          })
        } else {
          let tableData = [...response.data['humidityUseList']]

          // 移除第一项数组元素（因为第一个数组元素的用电量插值为null，不需要）
          tableData.splice(0,1)
          //后台数据到日期+1，所以在这边切掉最后一天,密度为2的情况
          if (response.data.grained === 2){
            tableData.splice(tableData.length-1,1)
          }

          tableData.map(item=>{
            item['monitorType'] = parseInt(item['onlineStatus']) ?1: 0 ; // 后台0=离线，1=在线，前端1=离线，2=在线，所以要转换一下
            item['monitorNumber']=item['pointNumber'];
            item['monitorNo'] = item['pointNumber'];
            item['monitorName']=`${item['collectNumber']}`+`${item['pointName']}`;
            item['consumption']=(!item['num'])?0:item['num']
            // item['consumptionTitle'] = '电量'
            // item['consumptionUnit'] = `kW·h`
            // item['voltage'] = 220 // todo: 电压缺字段
            // item['humidity'] = ((!item['num'])?0:item['num']/100/220).toFixed(2) // todo: 电流缺字段
            item['createTime'] = item['time']
            item['frequency'] = '5s'
          })

          // this.tabs.humidityMonitoringDetail.tableConfig.columnsStd = this.$store.state['humidityMonitoringDetail'].moColumns.columnsStd
          this.tabs.humidityMonitoringDetail.tableConfig.columns = this.tableColumns
          this.tabs.humidityMonitoringDetail.tableConfig.countTotal = 0 //response.data.total
          // console.log('数据：' + JSON.stringify(tableData))

          this.$refs[`tableEl_humidityMonitoringDetail`].drawTableData(this.tabs.humidityMonitoringDetail.tableConfig.columns, tableData)
          // 绘制生产工序的表格
          // console.log(JSON.stringify(response))

          if (callback) {
            // 将最新表格数据回调给子组件，子组件会依据最新数据来对本地的勾选行记录进行更新
            callback(tableData)
          } else { // TODO:若 callback 为 null，认为是此父组件自己主动调用的请求数据功能，那么需要自己对勾选数据进行更新
            this.$refs['tableEl_humidityMonitoringDetail'].updateSelectedRowsToVuex(tableData, [])
          }

          // 每次刷新此表格后，恢复相应的表格刷新意图
          // this.$store.dispatch('set_HumidityMonitoringDetailTableRefreshIntent', false)
        }
      },

      // handleTransmitSelectedTimes(name) {
      //   // console.log(this.$refs[name])
      //   this.$refs[name].validate((valid) => {
      //     if (valid) {
      //       this.requestHumidityMonitoringDataById(this.detailData)
      //     } else {
      //       this.$message.error('验证失败，请根据提示修改内容!');
      //     }
      //   })
      // },
      requestHumidityMonitoringDataById(data) {
        this.detailData = data
        this.$refs[`humidityLineChart`].drawLine([], [])
        this.$refs[`tableEl_humidityMonitoringDetail`].drawTableData(this.tableColumns, [])

        // this.requestChartData()
        this.refreshTabTable('humidityMonitoringDetail', this.tabs.humidityMonitoringDetail.tableConfig.curPage, this.tabs.humidityMonitoringDetail.tableConfig.pageSize, null)
      },

      // handleStartTimeChange(date) {
      //   this.queryValidate.queryStartTime = date
      // },
      //
      // handleEndTimeChange(date) {
      //   this.queryValidate.queryEndTime = date
      // },

      // 查询范围类型选择下拉框变化事件
      handleSearchTypeChange(val) {
        if (val === '3')
          this.queryRadio = val
        else
          this.queryTime = ''
        this.requestHumidityMonitoringDataById(this.detailData)
        // switch (val) {
        //   case '0': // 当天
        //     this.requestHumidityMonitoringDataById(this.detailData)
        //     break;
        //   case '1': // 本周
        //     this.requestHumidityMonitoringDataById(this.detailData)
        //     break;
        //   case '2': // 自定义选择某一天
        //     if (this.queryValidate.queryStartTime) {  // 若存在输入的日期，则直接刷新
        //       this.requestHumidityMonitoringDataById(this.detailData)
        //     }
        //     break;
        //   case '3': // 自定义选择某一段日期范围
        //     if (this.queryValidate.queryStartTime && this.queryValidate.queryEndTime) {  // 若存在输入的日期，则直接刷新
        //       this.requestHumidityMonitoringDataById(this.detailData)
        //     }
        //     break;
        //   default:
        //     break;
        // }
      }
    },
  }
</script>

<style lang="less" scoped>
  .queryTime{
    margin-top: -2px;
    /deep/ input::-webkit-input-placeholder{
      font-size: 12px;
    }
  }

  .queryRadioGroup {
    margin-right: 10px;

    /deep/ .el-radio-button__inner {
      border-radius: 0;
      border: 0;
    }

    /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: none;
      -webkit-box-shadow: none;
      border-radius: 0;
      border: 0;
      background: #ffffff;
      color: #409EFF;
    }
  }

  .detail-table{
    /deep/ .table-head-refresh-icon {
      margin-left: 400px !important;
      line-height: 25px !important;
    }
  }
</style>
