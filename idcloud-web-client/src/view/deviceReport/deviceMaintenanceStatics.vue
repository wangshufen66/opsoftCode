<template>
  <div>
    <id-bar-time-table
      isPage
      tableErrTip="设备维保统计"
      excelName="设备维保统计"
      :tableColumns="tableColumns"
      :getTable="getTable"
      :getExcelTemplate="getExcelTemplate"
      @idCellButtonClick="idCellButtonClick"
      @transfilterData="transfilterData"
    >
    </id-bar-time-table>
    <el-dialog
      :visible.sync="maintenanceCompleteData.show"
      width="90%"
      :title="title"
      @closed="maintenanceCompleteData.show = false"
    >
      <id-table v-bind="maintenanceCompleteData.table"> </id-table>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ title }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="maintenanceCompleteData.show = false"
          >取消</el-button
        >
        <el-button type="primary" @click="maintenanceCompleteData.show = false"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IdBarTimeTable from "@/components/id-pages/IdBarTimeTable";
import IdTable from "@/components/id-table/IdTable";
import {
  deviceMaintenanceStatics,
  exportDeviceMaintenanceStatics,
  maintenanceCompletedStatics
} from "@/api/deviceReport";

export default {
  name: "deviceMaintenanceStatics",
  components: { IdTable, IdBarTimeTable },
  computed: {
    getTable() {
      return deviceMaintenanceStatics;
    },
    getExcelTemplate() {
      return exportDeviceMaintenanceStatics;
    }
  },
  data() {
    return {
      tableColumns: [
        {
          tag: "el-table-column",
          label: "#",
          type: "index",
          align: "center",
          width: 40
        },
        {
          tag: "el-table-column",
          label: "设备代码",
          prop: "deviceNumber",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "设备名称",
          prop: "deviceName",
          width: "auto",
          showOverflowTooltip: true
        },
        // {
        //   tag: "el-table-column",
        //   label: "保养计划",
        //   prop: "maintenancePlanNum",
        //   width: "auto",
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   tag: "el-table-column-button",
        //   label: "保养完成",
        //   prop: "maintenanceCompleteNum",
        //   width: "auto",
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   tag: "el-table-column",
        //   label: "点检计划",
        //   prop: "checkPlanNum",
        //   width: "auto",
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   tag: "el-table-column-button",
        //   label: "点检完成",
        //   prop: "checkCompleteNum",
        //   width: "auto",
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        {
          tag: "el-table-column-column",
          label: "保养",
          columns: [
            {
              tag: "el-table-column",
              label: "计划",
              prop: "maintenancePlanNum",
              width: 180,
              sortable: true,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column-button",
              label: "完成",
              prop: "maintenanceCompleteNum",
              width: 180,
              sortable: true,
              showOverflowTooltip: true
            }
          ]
        },
        {
          tag: "el-table-column-column",
          label: "点检",
          columns: [
            {
              tag: "el-table-column",
              label: "计划",
              prop: "checkPlanNum",
              width: 180,
              sortable: true,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column-button",
              label: "完成",
              prop: "checkCompleteNum",
              width: 180,
              sortable: true,
              showOverflowTooltip: true
            }
          ]
        },
        {
          tag: "el-table-column-button",
          label: "维修",
          prop: "repairNum",
          width: 180,
          sortable: true,
          showOverflowTooltip: true
          // formatter: function (row, column, cellValue, index) {
          // return cellValue ? cellValue.toFixed(2) : 0;
          // },
        }
      ],
      maintenanceCompleteData: {
        show: false,
        table: {
          selection: false,
          border: true,
          tableData: [],
          columns: [
            {
              tag: "el-table-column",
              label: "设备",
              prop: "archivesName",
              width: 180,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "部位",
              prop: "partName",
              width: 250,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "工单日期",
              prop: "orderTime",
              width: 120,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "内容及要求",
              prop: "contentrequire",
              width: 250,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "执行结果",
              prop: "executionResult",
              width: 120,
              showOverflowTooltip: true,
              formatter: function(row, column, cellValue, index) {
                if (cellValue == 0) {
                  return "执行中";
                } else {
                  return "完成";
                }
              }
            },
            {
              tag: "el-table-column",
              label: "汇报内容",
              prop: "content",
              width: 180,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "执行时长",
              prop: "workTime",
              width: 180,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "汇报人",
              prop: "personName",
              width: 180,
              showOverflowTooltip: true
            }
          ]
        }
      },
      filterData: {},
      title: ""
    };
  },
  methods: {
    transfilterData(filterData) {
      this.filterData = filterData;
    },
    idCellButtonClick(row, column, index) {
      let type =
        column.label == "维修" ? 1 : column.label == "保养完成" ? 2 : 3;
      let params;
      if (type == 1) {
        this.title = "设备维修记录";
        params = {
          archivesNumber: row.deviceNumber,
          orgId: this.$store.state.user.userInfo.orgId,
          // current_page: 1,
          // page_size: 10,
          type: type,
          orderTimeStart: this.filterData.startTime,
          orderTimeEnd: this.filterData.endTime
        };
      } else if (type == 2) {
        this.title = "设备保养记录";
        params = {
          archivesNumber: row.deviceNumber,
          orgId: this.$store.state.user.userInfo.orgId,
          // current_page: 1,
          // page_size: 10,
          type: type,
          complete: true,
          orderTimeStart: this.filterData.startTime,
          orderTimeEnd: this.filterData.endTime
        };
      } else {
        this.title = "设备点检记录";
        params = {
          archivesNumber: row.deviceNumber,
          orgId: this.$store.state.user.userInfo.orgId,
          // current_page: 1,
          // page_size: 10,
          type: type,
          complete: true,
          orderTimeStart: this.filterData.startTime,
          orderTimeEnd: this.filterData.endTime
        };
      }
      Promise.resolve(maintenanceCompletedStatics(params))
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            // this.maintenanceCompleteData.table.tableData =
            //   res.data.data.records;
            console.log(res.data.data.records);
            let newArrey = [];
            res.data.data.records.forEach(element => {
              element.reportList.forEach(item => {
                newArrey.push({
                  archivesName: element.archivesName,
                  partName: element.partName,
                  orderTime: element.orderTime,
                  contentrequire: element.content,
                  workTime: item.workTime,
                  personName: item.personName,
                  content: item.content,
                  executionResult: item.executionResult
                });
              });
            });
            this.maintenanceCompleteData.table.tableData = newArrey;
            console.log(newArrey);
            this.$nextTick(() => {
              this.maintenanceCompleteData.show = true;
            });
          } else {
            this.$notifyError(`获取详情失败`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.diaTitle {
  border-bottom: 1px solid #c4c4c4;
  height: 60px;
  margin: -20px -20px -10px -20px;
  padding-left: 25px;
  padding-top: 19px;
}
.diaTitleText {
  font-size: 16px;
  line-height: 22px;
  font-weight: bolder;
  font-family: 微软雅黑, serif;
}
</style>
