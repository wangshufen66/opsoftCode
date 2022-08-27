<template>
  <div class="container">
    <add-card-batch ref="addCard" :cardData="cardData" :hasHeadSubTitle="cardConfig.hasHeadSubTitle"
                    :cardKey="cardConfig.cardKey"
                    :serverPage="tabs.humidityMonitoring.serverPage"
                    :hasPageBar="true"
                    :cardIcon="iconHumidity"
                    :tableConfig="tabs.humidityMonitoring.tableConfig"
                    :switchConfig="switchConfig"
                    :switchDisabled="switchDisabled"
                    @requestAgain="initData"
                    @handleAdd="addCard"
                    @handleEdit="editCard"
                    @handleDelete="deleteCard"
                    @handleDetail="detailCard"
                    @handleSearch="handleSearch"
                    @clearInput="handClearInput"
                    @handClearInput="handClearInput"
                    @handleSwitch="handSwitch">
      <template slot="switchOptions">
        <table-el
          class="card-table"
          style="margin-top: -64px"
          :ref="`tableEl_${tabKey}`"
          :table-tag="tabKey"
          :table-height="tableHeight"
          :serverPage="tabs.humidityMonitoring.serverPage"
          :table-uni-key="tabs.humidityMonitoring.tableUniKey"
          :vuex-first-key="tabs.humidityMonitoring.vuexFirstKey"
          :vuex-second-key="tabs.humidityMonitoring.vuexSecondKey"
          :columns-std="tabs.humidityMonitoring.columnsStd"
          :table-config="tabs.humidityMonitoring.tableConfig"
          :hasAddButton="tabs.humidityMonitoring.tableConfig.hasAddButton"
          :hasServerExcelImportButton="false"
          :hasSelectColumn="false"
          :hasSearchTypeSelect="false"
          :hasSearchDateTimeRange="false"
          :showTableColumnsSetting="false"
          :hasAuditAccess="false"
          :hasAntiAuditAccess="false"
          :hasDisableAccess="false"
          :hasAntiDisableAccess="false"
          :hasConfigTableHeadBtn="false"
          :hasShowAllBtn="false"
          :hasHeadEditAccess="false"
          :hasHeadDelAccess="false"
          :searchDateTimeRangeConfig="searchDateTimeRangeConfig"
          @requestTablePageData="handleRequestTablePageData"
          @editRow="handleEditRow">
          <template slot="extraButton" slot-scope="{ row }">
            <el-button style="margin-left: 0.2rem;margin-bottom: 0.1rem" type="primary" size="mini" plain
                       @click="handleTableRowDetail(row)">详情
            </el-button>
          </template>
        </table-el>
      </template>
    </add-card-batch>
    <el-dialog
      top="50px"
      :visible.sync="dialogConfig.visible" left width="90%">
      <humidity-monitoring-detail ref="detailComponent"
                                  :title="detailDialogTitle"
                                  style="margin-top: -40px"></humidity-monitoring-detail>
      <div slot="title" class="dialog-title" style="margin-bottom: -50px">
        <span style="font-size: 30px"><strong>{{detailDialogTitle}}</strong></span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import addCardBatch from '@/components/add-card-batch/index.vue'
  import TableEl from "@/components/table-el/index"
  import {findHumidityList} from "@/api/environmentMonitor/humidityMonitor";
  import humidityMonitoringDetail
    from "@/view/environmentMonitor/humidityMonitoring/components/humidityMonitoringDetail.vue"
  import {RequestFilterMixins} from "@/mixins/RequestFilterMixins"
  import iconHumidity from '@/assets/images/environmentMonitor/humidityMonitoring/humidity.png'

  export default {
    name: "humidity_monitoring",
    mixins: [RequestFilterMixins],
    components: {
      addCardBatch,
      TableEl,
      humidityMonitoringDetail
    },
    data() {
      return {
        iconHumidity,
        tableHeight: '610',
        tabKey: 'humidityMonitoring',
        cardData: [],
        //true - card  false - table
        switchTable: true,
        switchDisabled: false,
        switchConfig: {
          activeText: '卡片',
          inactiveText: '表格',
          currentView: true
        },
        dialogConfig: {
          visible: false
        },
        detailDialogTitle: '',
        cardConfig: {
          iconName: iconHumidity,
          hasHeadSubTitle: true,
          // 用于关联数据和实际显示区域的关联器 卡片实际显示5个东西，从数据中指定
          //cardTitle    卡片左上角标签
          //cardSubTitle    右上角 输入字符串，可任意输入，如果关键字在线或者离线，则会变色
          //cardBodyTitle    数据主题的标题
          //cardBodyNumber    数据
          //cardBodyUnit    单位 （字符串）
          cardKey: {
            cardTitle: 'monitorName',
            cardSubTitle: 'monitorType',
            cardBodyTitle: 'consumptionTitle',
            cardBodyNumber: 'consumption',
            cardBodyUnit: 'consumptionUnit'
          }
        },
        tabs: {
          humidityMonitoring: {
            label: '湿度监测',
            type: 'normal',
            show: true,
            tableUniKey: 'id', // 作为表格数据唯一识别的字段名（即 属性 key）
            vuexFirstKey: 'humidityMonitoring', // 表格组件获取 vuex 数据的 一级Key
            vuexSecondKey: 'humidityMonitoring', // 表格组件获取 vuex 数据的 二级Key
            serverPage: true, // 分页模式，true=后台分页，false=前台分页
            // 记录所有的数据的列字段，包括不用显示的列字段（有些字段无需显示，但需要与后台进行交互）
            columnsStd: [],
            tableConfig: {
              loading: false,
              tableName: '湿度监测',  // 表格名称，在导出成Excel时，会使用该名称作为文件名
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
              selectSearchColumnSelections: [
                {
                  title: '容器名称',
                  key: 'containerName',
                  // width: '250',
                  type: 'text',
                }
              ],
              // 单选下拉框的选择内容，决定搜索栏位的搜索内容对应的 列名 key
              selectSearchColumn: 'containerName',
              // 单选下拉框的未选择任何内容时的提示内容
              selectSearchColumnPlaceholder: '请选择',
              showTotal: true,  // 是否显示 总数
              showPageInput: true, // 是否显示页码跳转输入框
              hasAddButton: false
            }
          }
        },
        searchDateTimeRangeConfig: {
          inputType: 'datetime',
          hasStartDatetime: true,
          hasEndDatetime: false,
          startDateTime: '',
          endDateTime: '',
          width: '13.1rem',
          datetimeFormat: 'yyyy-MM-dd HH:mm:ss',
          disabled: false,
          label: '时间范围',  // VueI18n 多语言库中的key值
          startPlaceholder: '请输入', // VueI18n 多语言库中的key值
          endPlaceholder: '请输入' // VueI18n 多语言库中的key值
        },
        detailViewTableColumns: [
          {
            title: '容器名称',
            key: 'containerName',
            width: '180',
            type: 'text',
          },
          {
            title: '容器点名称',
            key: 'pointContainerName',
            width: '180',
            type: 'text',
          },
          {
            title: '监测点代码',
            key: 'monitorNumber',
            // width: '250',
            type: 'text',
          },
          {
            title: '监测点名称',
            key: 'monitorName',
            // width: '250',
            type: 'text',
          },
          {
            title: '监测点状态',
            key: 'monitorType',
            width: '120',
            type: 'select',
            selectOptions: [
              {
                value: '0',
                label: '离线'
              },
              {
                value: '1',
                label: '在线'
              },
            ],
            render: (h, params) => {
              const selectionArray = [
                {
                  value: '0',
                  label: '离线'
                },
                {
                  value: '1',
                  label: '在线'
                },
              ]
              // 根据设置的选项集合，生成对应的下拉选项
              let optionArray = []
              selectionArray.map(item => {
                optionArray.push(h('Option', {
                  props: {
                    disabled: false,
                    value: item.value,
                    label: item.label
                  },
                  style: {
                    width: '80px',
                  }
                }))
              })

              const fontColor = String(params.row['monitorType']) === '0' ? '#e74c3c' : '#2FD900'

              return h('Select', {
                props: {
                  disabled: false,
                  size: 'small',
                  placeholder: '',
                  value: String(params.row['monitorType'])
                },
                style: {
                  width: '80px',
                  pointerEvents: 'none',
                  color: fontColor
                }
              }, optionArray)
            }
          },
          {
            title: '相对湿度（%）',
            key: 'consumption',
            // width: '250',
          },
          {
            title: '备注',
            key: 'marks',
            // width: '320',
            // type: 'text',
          },
        ]
      }
    },
    mounted() {
      this.initData()
      this.$nextTick(() => {
        this.tableHeight = `${document.documentElement.clientHeight * 0.7}`;
      })
    },
    methods: {
      initData() {
        // if (this.switchTable === true)
        //   this.requestCardData(this.$refs.addCard.getCurrentPage(), this.$refs.addCard.getWindowSize())
        this.requestData(this.tabs.humidityMonitoring.tableConfig.curPage, this.tabs.humidityMonitoring.tableConfig.pageSize)
      },

      changeCurrentPage(curPage) {
        this.tabs.humidityMonitoring.tableConfig.curPage = curPage
        this.requestData(this.tabs.humidityMonitoring.tableConfig.curPage, this.tabs.humidityMonitoring.tableConfig.pageSize)
      },
      changPageSize(pageSize) {
        this.tabs.humidityMonitoring.tableConfig.pageSize = pageSize
        this.requestData(this.tabs.humidityMonitoring.tableConfig.curPage, this.tabs.humidityMonitoring.tableConfig.pageSize)
      },

      requestData(curPage, curPageSize, callback) {
        this.switchDisabled = true
        this.tabs.humidityMonitoring.tableConfig.loading = true

        const param = {
          current_page: curPage,
          page_size: curPageSize,
          orgId: this.$store.state.user.userInfo.orgId
        }

        let promiseArray = [
          findHumidityList(param)
        ]

        this.appendRequestFilterParams('humidityMonitoring', param)

        Promise.all(promiseArray).then(response => {
          let [receivedData] = response
          if (this.switchTable)
            this.receiveCardData(receivedData)
          else
            this.receiveTableData(receivedData)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.switchDisabled = false
          this.tabs.humidityMonitoring.tableConfig.loading = false
        })
      },

      receiveCardData(response) {
        response = response.data
        if (response.code !== 200) {
          this.$notify.error({
            title: '失败',
            message: `原因：${response.msg}`
          })
        } else if (!response.hasOwnProperty('data') ||
          !response.data.hasOwnProperty('records') ||
          !response.data.records) {
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的反馈数据为NULL'
          })
        } else {
          if (response.data.records.length === 0) {
            this.$message({
              message: '没有更多了',
              type: 'warning',
              offset: 10
            });
          }
          let resData = [...response.data.records]
          // 将后台的数据根据这里的原先通过mock写的字段进行转换
          resData.map(item => {
            item['consumption'] = (!item['pointValue']) ? 0 : parseFloat(item['pointValue']).toFixed(1)
            item['consumptionUnit'] = `%`
            item['consumptionTitle'] = '湿度'
            item['monitorNumber'] = item['pointNumber']
            item['monitorName'] = `${item['pointContainerName']}(${item['containerName']})`
            item['monitorType'] = parseInt(item['onlineStatus']) ? 1 : 0 // 后台0=离线，1=在线，前端1=离线，2=在线，所以要转换一下
          })
          // this.cardData = [...this.cardData, ...resData]
          this.tabs.humidityMonitoring.tableConfig.countTotal = response.data.total
          // this.cardData = [...this.cardData, ...resData]
          this.cardData = resData
        }
      },
      receiveTableData(response) {
        response = response.data
        if (response.code !== 200) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: `原因：${response.msg}`
          })
        } else if (!response.hasOwnProperty('data') ||
          !response.data.hasOwnProperty('records') ||
          !response.data.records) {
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的反馈数据为NULL'
          })
        } else {
          let tableData = [...response.data.records]

          tableData.map(item => {
            item['disabledRowDelete']=false
            item['showRowEdit'] = false
            item['monitorType'] = parseInt(item['onlineStatus']) ? 1 : 0;// 后台0=离线，1=在线，前端1=离线，2=在线，所以要转换一下
            item['monitorNumber'] = item['pointNumber'];
            item['monitorNo'] = item['pointNumber'];
            item['monitorName'] = `${item['collectNumber']}` + `${item['pointName']}`;
            item['consumption'] = (!item['pointValue']) ? 0 : parseFloat(item['pointValue']).toFixed(1);
            // item['consumptionTitle'] = '电量'
            // item['consumptionUnit'] = `kW·h`
            // item['voltage'] = 220 // todo: 电压缺字段
            // item['humidity'] = ((!item['humidityNum'])?0:item['humidityNum']/100/220).toFixed(2) // todo: 电流缺字段
          })

          this.tabs.humidityMonitoring.tableConfig.columns = this.detailViewTableColumns
          this.tabs.humidityMonitoring.tableConfig.countTotal = response.data.total
          this.$refs[`tableEl_humidityMonitoring`].drawTableData(this.detailViewTableColumns, tableData)

        }
      },

      appendRequestFilterParams(mainKey, params) {
        this.appendFilterParams(mainKey, mainKey, params, this.detailViewTableColumns)
      },


      // 切换时的事件
      handSwitch(data) {
        this.cardData = []
        this.switchTable = data
        this.$nextTick(() => {
          this.handleRequestTablePageData('humidityMonitoring',
            this.tabs.humidityMonitoring.tableConfig.curPage,
            this.tabs.humidityMonitoring.tableConfig.pageSize,
            null)
        })
      },
      //表格界面获取数据
      handleRequestTablePageData(tableTag, curPage, curPageSize, callback) {
        this.requestData(curPage, curPageSize, callback)
      },
      //表格添加事件
      handleTableGoAddForm() {
        //空
      },
      //表格修改事件
      handleEditRow(tableTag, row) {

      },
      handleTableRowDetail(row) {
        console.log('表格行row: ' + JSON.stringify(row))
        this.showDetailDialog(row)
      },
      //表格删除事件
      handleSubmitToDeleteRow(tableTag, row, callback) {

      },
      //添加卡片
      addCard() {

      },
      //删除卡片
      deleteCard(data) {

      },
      //修改卡片
      editCard(data) {

      },
      //卡片详情
      detailCard(data) {
        this.showDetailDialog(data)
      },
      showDetailDialog(data) {
        //这里id写死，是data.id 还是别的 需要根据实际api改写
        this.dialogConfig.visible = true
        // this.$refs.detailCard.requestHumidityMonitoringDataById(data.id)
        // console.log('卡片data+ = ' + JSON.stringify(data))
        this.detailDialogTitle = data['monitorName']
        this.$nextTick(() => {
          this.$refs['detailComponent'].requestHumidityMonitoringDataById(data)
        })
      },
      //查询，根据监测点名称
      handleSearch() {
        this.tabs.humidityMonitoring.tableConfig.curPage = 1;
        this.tabs.humidityMonitoring.tableConfig.pageSize = 10;
        this.switchDisabled = true;
        this.tabs.humidityMonitoring.tableConfig.loading = true;

        const param = {
          current_page: this.tabs.humidityMonitoring.tableConfig.curPage,
          page_size: this.tabs.humidityMonitoring.tableConfig.pageSize,
          orgId: this.$store.state.user.userInfo.orgId,
          containerName:this.tabs.humidityMonitoring.tableConfig.search
        }

        let promiseArray = [
          findHumidityList(param)
        ]

        this.appendRequestFilterParams('humidityMonitoring', param)

        Promise.all(promiseArray).then(response => {
          let [receivedData] = response
          if (this.switchTable)
            this.receiveCardData(receivedData)
          else
            this.receiveTableData(receivedData)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.switchDisabled = false
          this.tabs.humidityMonitoring.tableConfig.loading = false
        })
      },
      //清除搜索框后的事件
      handClearInput() {

      },
      handleTableExcelExport() {
      },
      handleTableExcelImport() {
      },
    }
  }
</script>

<style lang="less" scoped>
  .card-table {
    /deep/ .table-head-refresh-icon {
      margin-left: 60px !important;
      position: fixed;
      line-height: 28px !important;
    }
  }
</style>
