<template>
  <div class="container">
    <div class="container-bar">
      <id-action-bar ref="idBar" :idConfig="actionBarConfig" @click="actionBarClick">
      </id-action-bar>
      <div class="container-query" >
        <id-radio
          ref="idRadio"
          v-if="idRadio.exist"
          v-bind="idRadio"
          @change="queryChange"
        >
        </id-radio>
        <el-date-picker
          class="id-date-picker"
          key="a"
          v-if="datePicker.exist"
          v-model="datePicker.vModel"
          v-bind="datePicker"
          @change="queryChange"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="container-chart" :style="{height:tableHeight/2+'px'}">
      <div id="left-chart" style="width: 50%"></div>
      <div id="right-chart" style="width: 50%"></div>
    </div>
    <div class="container-table">
      <h2>{{tableName}}</h2>
      <id-table
        ref="table"
        v-loading="tableLoading"
        border
        :selection="false"
        :height="tableHeight/2-12"
        :columns="tableColumns"
        :table-data="tableData"
        v-bind="$attrs"
        v-on="$listeners"
      >
      </id-table>
      <div class="el-page-center">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          v-bind="page"
          layout="total,  prev, pager, next, sizes, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import IdActionBar from "../id-action-bar/index";
  import IdTable from "../id-table/IdTable";
  import resizeTableHeightMixins from "@/mixins/resizeTableHeightMixins";
  import {getContainerPcAnalysisList} from "@/api/device-watch/device";
  import IdButtonConfig from "../id-button/IdButtonConfig";
  import IdRadio from "../id-radio/index";
  import moment from "moment";
  import authority from "../authority";
  import echarts from 'echarts';


  export default {
    name: "IdBarTimeChartTable",
    components: {
      IdActionBar,
      IdTable,
      IdRadio,
    },
    computed: {},
    mixins: [resizeTableHeightMixins],
    data() {
      return {
        //操作栏相关配置----------------------------
        actionBarConfig: [
          {
            tag: "id-cascader",
            classKey: "id-cascader",
            target: "cascader",
            props: {
              expandTrigger: 'hover',
              checkStrictly: true,
            },
            showAllLevels: false,
            options: [
              //数据结构格式
              // {
              //   value: '工厂',
              //   label: '工厂',
              //   children: [
              //     {
              //       value: '0',
              //       label: '工厂0',
              //     }, {
              //       value: '1',
              //       label: '工厂1',
              //     }
              //   ]
              // },
            ],
          },
          new IdButtonConfig("button-fresh", "刷新", "fresh", {
            styleTwo: true,
            beforeIf: true,
            beforeClass: "el-icon-refresh-right",
          }),
        ],

        //查询相关参数------------------------------
        //查询组件1 radio组件
        idRadio: {
          size: "small",
          textColor: "#409eff",
          fill: "#ffffff",
          exist: true,
          defaultValue: "今日",
          options: [
            {
              label: "今日",
              authority: new authority(),
            },
            {
              label: "近7天",
              authority: new authority(),
            },
            {
              label: "近30天",
              authority: new authority(),
            },
          ],
        },
        //查询组件2 radio组件
        datePicker: {
          // vModel: [],
          vModel: [],
          size: "small",
          exist: true,
          type: "daterange",
          align: 'right',
          rangeSeparator: "至",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          pickerOptions: {
            disabledDate(date) {
              const now = new Date(Date.now());
              const tomorrow = now.setDate(now.getDate() + 1);
              return date && date.valueOf() > tomorrow;
            },
          },
        },
        //最终汇总的参数
        filterData: {},

        //chart相关参数
        leftChart: {
          loading: false,
          chart: null,
          eChartsOptions: {},
        },
        rightChart: {
          loading: false,
          chart: null,
          eChartsOptions: {},
        },

        //表格相关参数options-----------------------
        tableLoading: false,
        // tableColumns: [
        //   {
        //     tag: "el-table-column",
        //     label: "设备代码",
        //     prop: "deviceNumber",
        //     width: 180,
        //     showOverflowTooltip: true,
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "设备名称",
        //     prop: "deviceName",
        //     width: 180,
        //     showOverflowTooltip: true,
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "运行比例(%)",
        //     prop: "runningProportion",
        //     width: 180,
        //     showOverflowTooltip: true,
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "空闲比例(%)",
        //     prop: "waitingProportion",
        //     width: 180,
        //     showOverflowTooltip: true,
        //
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "空转比例(%)",
        //     prop: "adjustProportion",
        //     width: 180,
        //     showOverflowTooltip: true,
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "故障比例(%)",
        //     prop: "errorProportion",
        //     width: 180,
        //     showOverflowTooltip: true,
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "离线比例(%)",
        //     prop: "offlineProportion",
        //     width: 180,
        //     showOverflowTooltip: true,
        //   },
        // ],//表格列配置
        allTableData: [],//全部数据（当前端自动分页时，所有数据都保存在此，根据这个数据获取分页数据）
        tableData: [], //表格数据
        tableSelectData: [], //表格当前选中数据

        //分页相关参数
        page: {
          background: true,
          pageSizes: [10, 20, 30, 50, 100],
          currentPage: 1,
          pageSize: 10,
          total: 10,
        },

        //参数 =》 用来判断 是分页的请求还是查询的请求(这不是一个好的解决方案)
        pageQuest: false,
      };
    },
    props: {
      getTable: {type: Function},
      tableName: {type: String, default: ""},
      // actionBarConfig: {type: Array},
      tableColumns: {type: Array},
      isPage: {type: Boolean, default: false},//是否前台自动分页
      tableErrTip: {type: String, default: ''},
      leftChartOptions: {type: Object},
      rightChartOptions: {type: Object},
      idRadioComp: {type: Object},//日期快捷方式组件
      datePickerComp: {type: Object},//日期选择组件
    },
    created() {
      this.initRadio();
      this.initDatePicker();
      this.getCascaderOpitions();
    },
    methods: {
      //初始化id-radio组件
      initRadio() {
        this.idRadio = {
          ...this.idRadio,
          ...this.idRadioComp
        };
      },
      //初始化id-date-picker组件
      initDatePicker() {
        this.datePicker = {
          ...this.datePicker,
          ...this.datePickerComp
        };
      },
      //获取cascader的数据
      getCascaderOpitions() {
        const param = {
          orgId: this.$store.state.user.userInfo.orgId,
        };
        let promiseArray = [
          //列表请求
          getContainerPcAnalysisList(param),
        ];
        this.$emit('beforeGetCascaderOpitions', param);
        Promise.all(promiseArray)
          .then(response => {
            let [res] = response;
            // //根据层级来限定
            res.data.data.map((item) => {
              item.name = item.ctrName;
              item.value = item.id;
              item.label = item.ctrName;
            });
            // 生成树形图结构数据
            let data = {
              rawdata: res.data.data,
              children: [],
              parent: [],
              expand: true
            };
            // data.children
            data.children = this.$utils.toTreeChildrenFunc(res.data.data, "id");
            // data.parent
            data.parent = this.$utils.toTreeParentFunc(res.data.data, "ctrParent");
            this.actionBarConfig[0].options = this.$utils.toTreeDataFunc(data);
          })
          .catch(() => {
            this.$notifyError("网络请求失败!", "");
          })
          .finally(() => {
            this.$refs.idBar.$children[0].setVModel([this.actionBarConfig[0].options[0].value]);
            this.queryChange();
          });
      },
      //初始化左侧chart
      initLeftChart() {
        this.leftChart.chart = echarts.dispose(document.getElementById('left-chart'));
        this.leftChart.chart = echarts.init(document.getElementById('left-chart'));
        this.leftChart.eChartsOptions = this.leftChartOptions;
        this.leftChart.chart.setOption(this.leftChart.eChartsOptions);
      },
      //初始化右侧chart
      initRightChart() {
        this.rightChart.chart = echarts.dispose(document.getElementById('right-chart'));
        this.rightChart.chart = echarts.init(document.getElementById('right-chart'));
        this.rightChart.eChartsOptions = this.rightChartOptions;
        this.rightChart.chart.setOption(this.rightChart.eChartsOptions);
      },
      //获取table数据
      async getTableList() {
        this.filterData.orgId = this.$store.state.user.userInfo.orgId;
        if (!this.isPage) {
          this.filterData.current_page = this.page.currentPage;
          this.filterData.page_size = this.page.pageSize;
        }
        if (this.$refs.idBar.$children[0].vModel) {
          if (this.$refs.idBar.$children[0].vModel.length === 1) {
            this.filterData.id = this.$refs.idBar.$children[0].vModel[0];
            this.filterData.ctrType = 1;
          } else if (this.$refs.idBar.$children[0].vModel.length === 2) {
            this.filterData.id = this.$refs.idBar.$children[0].vModel[1];
            this.filterData.ctrType = 2;
          } else if (this.$refs.idBar.$children[0].vModel.length === 3) {
            this.filterData.id = this.$refs.idBar.$children[0].vModel[2];
            // this.filterData.ctrType = 3;
          } else
            return;
        } else {
          return;
        }
        await this.$emit('beforeGetTable', this.filterData);
        if(this.idRadio.exist) this.$refs.idRadio.setVModelEmpty();
        this.tableLoading = true;
        await this.getTable(this.filterData)
          .then((res) => {
            if (res.status === 200 && res.data.code === 200) {
              if (this.isPage) {
                this.$emit("afterGetTableNoPage", res.data.data, this.filterData.ctrType);
                this.allTableData = res.data.data.listTable;
                this.tableData = this.allTableData.slice(0, this.page.pageSize);
                this.page.total = this.allTableData.length;
                this.$emit("alterTableData", this.tableData);//不分页修改表格数据
              } else {
                this.$emit("afterGetTablePage", res.data.data.records);
                this.tableData = res.data.data.records;
                this.page.total = res.data.data.total;
              }
            } else {
              this.$notifyError(`获取${this.tableErrTip}列表失败`, res.data.msg);
            }
          })
          .catch(() => {
            this.$notifyError("网络请求失败!", "");
          })
          .finally(() => {
            this.$refs.table.$children[0].doLayout();
            this.tableLoading = false;
            this.pageQuest = false;
            this.filterData = {};
          });
      },
      //操作栏点击
      actionBarClick(target) {
        switch (target) {
          case "fresh":
            this.queryChange();
            break;
          case "cascader":
            this.queryChange();
            break;
        }
      },
      //当前页的数据数量改变时
      sizeChange(pageSize) {
        this.pageQuest = true;
        this.page.pageSize = pageSize;
        if (this.isPage)
          this.dataPage();
        else
          this.queryChange();
      },
      //当前页修改  当前页跳转到某一页（向前或者向后都行）
      currentChange(currentPage) {
        this.pageQuest = true;
        this.page.currentPage = currentPage;
        if (this.isPage)
          this.dataPage();
        else
          this.queryChange();
      },
      //前台自动分页
      dataPage() {
        this.tableData = this.allTableData.slice(
          (this.page.currentPage - 1) * this.page.pageSize,
          this.page.currentPage * this.page.pageSize,
        );
        this.pageQuest = false;
        this.$emit("alterTableData", this.tableData);//不分页修改表格数据
      },
      //查询参数修改
      queryChange(value) {
        if (!this.pageQuest) this.page.currentPage = 1;
        if (!value) {
          if (this.idRadio.exist) value = this.$refs.idRadio.vModel?this.$refs.idRadio.vModel:"今日";
        }
        if (this.datePicker.exist) {
          const that = this;
          if (typeof value === "string") {
            const tomorrowNow = new Date(Date.now());
            const tomorrow = tomorrowNow.setDate(tomorrowNow.getDate() + 1);
            const now = new Date(Date.now());
            const timeRage = {
              "今日": function () {
                that.filterData.startTime = moment(now).format("YYYY-MM-DD 00:00:00");
                that.filterData.endTime = moment(tomorrow).format("YYYY-MM-DD 00:00:00");
              },
              "近7天": function () {
                const weekNow = new Date(Date.now());
                that.filterData.startTime = moment(weekNow.setDate(weekNow.getDate() - 7)).format("YYYY-MM-DD 00:00:00");
                that.filterData.endTime = moment(tomorrow).format("YYYY-MM-DD 00:00:00");
              },
              "近30天": function () {
                const monthNow = new Date(Date.now());
                that.filterData.startTime = moment(monthNow.setDate(monthNow.getDate() - 30)).format("YYYY-MM-DD 00:00:00");
                that.filterData.endTime = moment(tomorrow).format("YYYY-MM-DD 00:00:00");
              },
            };
            if(!!value){
              timeRage[value]();
            } else {
              this.filterData.startTime = moment(this.datePicker.vModel[0]).format("YYYY-MM-DD HH:mm:ss");
              this.filterData.endTime = moment(this.datePicker.vModel[1]).format("YYYY-MM-DD HH:mm:ss");
            }
          } else {
            if(value.length===2){
              this.filterData.startTime = moment(value[0]).format("YYYY-MM-DD HH:mm:ss");
              this.filterData.endTime = moment(value[1]).format("YYYY-MM-DD HH:mm:ss");
            }else {
              return;
            }
          }
        }
        this.getTableList();
      },
    },
  }
</script>

<style lang="less" scoped>
  .container {
    margin-top: 6px;

    .container-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 5px;
    }

    .container-chart {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 5px;
    }

    .id-date-picker {
      margin-right: 6px;
      width: 400px;
    }

    .el-page-center {
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-pagination {
        margin: 10px 0;
      }
    }
  }

  .id-date-picker{
    ::v-deep .el-range-input{
      color:#409EFF;
    }
    ::v-deep .el-range-separator{
      color:#409EFF;
    }
    ::v-deep .el-input__inner{
      color:#409EFF;
    }
  }
</style>
