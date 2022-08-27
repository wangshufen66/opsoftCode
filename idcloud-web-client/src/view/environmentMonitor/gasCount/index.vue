<template>
  <div>
    <div style="margin-top: 10px">
      <span><strong>类型：</strong></span>
      <id-select
        :class="type.classKey"
        v-model="type.vModel"
        v-bind="type"
        ></id-select>
      <span v-show="type.vModel!=='2'" style="margin-left: 20px"><strong>时间：</strong></span>
      <el-date-picker
        v-show="type.vModel!=='2'"
        v-model="queryTime"
        v-bind="queryTimeConfig"
        :size="type.size"
      ></el-date-picker>
    </div>
    <table-el
      class="card-table"
      style="margin-top: -32px"
      :ref="`tableEl_${tabKey}`"
      :table-tag="tabKey"
      :table-height="tableHeight"
      :serverPage="tabs.gasCount.serverPage"
      :table-uni-key="tabs.gasCount.tableUniKey"
      :vuex-first-key="tabs.gasCount.vuexFirstKey"
      :vuex-second-key="tabs.gasCount.vuexSecondKey"
      :columns-std="tabs.gasCount.columnsStd"
      :table-config="tabs.gasCount.tableConfig"
      :hasAddButton="tabs.gasCount.tableConfig.hasAddButton"
      :hasRefreshButton="false"
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
      :hasActionColumn="false"
      :searchDateTimeRangeConfig="searchDateTimeRangeConfig"
      @requestTablePageData="handleRequestTablePageData"
      @requestTablePageData1="handleRequestTablePageData"
    >
    </table-el>
  </div>
</template>

<script>
  import TableEl from "@/components/table-el/index";
  import IdSelect from '@/components/id-select/IdSelect';
  import {usageStatistics} from "@/api/environmentMonitor/gasMonitor";

  export default {
    name: "gas_count",
    components: {
      TableEl,
      IdSelect
    },
    computed:{
      queryTimeConfig:function () {
        if(this.type.vModel==='0'){
          this.queryTime=new Date();
          return{
            type:'month',
            placeholder:'请输入月',
            valueFormat:'yyyy-MM',
          }
        }else if(this.type.vModel==='1'){
          this.queryTime=new Date();
          return{
            type:'year',
            placeholder:'请输入年',
            valueFormat:'yyyy',
          }
        }else {
          this.queryTime='';
          return{
            placeholder:'请输入日期',
          }
        }
      },
    },
    data() {
      return {
        //日期选择器
        queryTime:'',
        //选择框
        type: {
          classKey: "select",
          vModel: '1',
          placeholder: "请选择",
          size:'small',
          authority: {
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
          },
          options: [
            {
              value: '0',
              label: '日电量',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              }
            }, {
              value: '1',
              label: '月电量',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              }
            }, {
              value: '2',
              label: '年电量',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              }
            },
          ],
        },
        //昆仑表格组件
        tableHeight: '610',
        tabKey: 'gasCount',
        tabs: {
          gasCount: {
            label: '电量统计',
            type: 'normal',
            show: true,
            tableUniKey: 'uid', // 作为表格数据唯一识别的字段名（即 属性 key）
            vuexFirstKey: 'gasCount', // 表格组件获取 vuex 数据的 一级Key
            vuexSecondKey: 'gasCount', // 表格组件获取 vuex 数据的 二级Key
            serverPage: true, // 分页模式，true=后台分页，false=前台分页
            // 记录所有的数据的列字段，包括不用显示的列字段（有些字段无需显示，但需要与后台进行交互）
            columnsStd: [],
            tableConfig: {
              loading: false,
              tableName: '电量统计',  // 表格名称，在导出成Excel时，会使用该名称作为文件名
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
                  title: '监测点代码',
                  key: 'pointNumber',
                  // width: '250',
                  type: 'text',
                },
                {
                  title: '监测点名称',
                  key: 'pointName',
                  // width: '250',
                  type: 'text',
                }
              ],
              // 单选下拉框的选择内容，决定搜索栏位的搜索内容对应的 列名 key
              selectSearchColumn: 'pointNumber',
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
            title: '监测点代码',
            key: 'pointNumber',
            width: '180',
            type: 'text',
          },
          {
            title: '监测点名称',
            key: 'pointName',
            width: '180',
            type: 'text',
          },
        ],
      }
    },
    mounted(){
      this.requestData(this.tabs.gasCount.tableConfig.curPage, this.tabs.gasCount.tableConfig.pageSize);
    },
    methods: {
      //表格界面获取数据
      handleRequestTablePageData(tableTag, curPage, curPageSize, callback) {
        this.requestData(curPage, curPageSize, callback);
      },
      //接收数据参数
      requestData(curPage, curPageSize, callback) {
        this.tabs.gasCount.tableConfig.loading = true;
        const param = {
          orgId: this.$store.state.user.userInfo.orgId,
          type:this.type.vModel,
          time:this.type.vModel==='2'?undefined:this.queryTime,
        };
        if(this.tabs.gasCount.tableConfig.search!=='')
          param[this.$refs[`tableEl_gasCount`].searchTextContentConfig.value]=this.tabs.gasCount.tableConfig.search;
        let promiseArray = [
          usageStatistics(param)
        ];

        Promise.all(promiseArray).then(response => {
          let [receivedData] = response;
          this.receiveTableData(receivedData);
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.gasCount.tableConfig.loading = false;
        })
      },
      //接受到的数据处理
      receiveTableData(response) {
        response = response.data;
        if (response.code !== 200) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: `原因：${response.msg}`
          })
        } else if (!response.hasOwnProperty('data')||response.data.length===0) {
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的反馈数据为NULL'
          })
        } else {
          let tableData = [...response.data];
          // let tableData = [];
          // for(let i=0;i<15;i++){
          //   response.data[0].pointNumber=i;
          //   tableData.push({...response.data[0]})
          // }
          this.detailViewTableColumns=[
            {
              title: '监测点代码',
              key: 'pointNumber',
              width: '180',
              type: 'text',
            },
            {
              title: '监测点名称',
              key: 'pointName',
              width: '180',
              type: 'text',
            },
          ];
          response.data[0].usageList.forEach(item => {
            this.detailViewTableColumns.push({
              title: item.time,
              key: item.time,
              width: '180',
              type: 'text',
              resizable: true
            })
          });
          response.data.forEach(item=>{
            item.usageList.forEach(children=>{
              item[children.time]=children.amount.toFixed(1);
            })
          });
          this.tabs.gasCount.tableConfig.columns = this.detailViewTableColumns;
          this.tabs.gasCount.tableConfig.countTotal = tableData.length;
          //前台分页处理（操作空间）
          // this.tabs.gasCount.tableConfig.curPage
          // this.tabs.gasCount.tableConfig.pageSize
          let autoData=tableData.slice(
            (this.tabs.gasCount.tableConfig.curPage-1)*this.tabs.gasCount.tableConfig.pageSize,
            this.tabs.gasCount.tableConfig.curPage*this.tabs.gasCount.tableConfig.pageSize
          );

          //
          this.$refs[`tableEl_gasCount`].drawTableData(this.detailViewTableColumns, autoData);
        }
      },

    },
  }
</script>

<style lang="less" scoped>

</style>
