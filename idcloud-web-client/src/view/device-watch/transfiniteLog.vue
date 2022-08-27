<template>
  <id-bar-query-table
    id-query-form-label-width="110px"
    :getTable="getList"
    :getCascaderList="getCascaderList"
    :tableColumns="tableColumns"
  >
  </id-bar-query-table>
</template>

<script>
  import IdBarQueryTable from "@/components/id-pages/IdBarQueryTable";
  import {getMonitorTransfiniteList} from "@/api/device-watch/transfiniteLogs";
  import {getContainerList} from "@/api/productionManagement/productionPlan";

  export default {
    name: "transfiniteLog",
    components: {IdBarQueryTable},
    data() {
      return {
        tableColumns: [
          {
            tag: "el-table-column",
            label: "设备代码",
            prop: "deviceNumber",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "设备名称",
            prop: "deviceName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "点名称",
            prop: "pointName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "预警详情",
            prop: "content",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "预警持续时间",
            prop: "duration",
            minWidth: 180,
            sortable:true,
            showOverflowTooltip: true,
          },
          {
            tag: "el-table-column",
            label: "预警开始时间",
            prop: "startTime",
            minWidth: 180,
            sortable:true,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "预警结束时间",
            prop: "endTime",
            minWidth: 180,
            sortable:true,
            resizable: false,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
        ], //表格列配置
      }
    },
    computed: {
      getList() {
        return getMonitorTransfiniteList;
      },
      getCascaderList() {
        return getContainerList;
      }
    }
  }
</script>

