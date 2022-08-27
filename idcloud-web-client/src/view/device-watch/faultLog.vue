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
  import {getMonitorFaultList} from "@/api/device-watch/warningLogs";
  import {getContainerList} from "@/api/productionManagement/productionPlan";

  export default {
    name: "faultLog",
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
            label: "故障代码",
            prop: "code",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "故障详情",
            prop: "content",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "故障持续时间",
            prop: "duration",
            minWidth: 180,
            showOverflowTooltip: true,
            sortable:true,
          },
          {
            tag: "el-table-column",
            label: "故障开始时间",
            prop: "startTime",
            minWidth: 180,
            showOverflowTooltip: true,
            sortable:true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "故障结束时间",
            prop: "endTime",
            minWidth: 180,
            resizable: false,
            showOverflowTooltip: true,
            sortable:true,
            comp: "Datetime",
          },
        ], //表格列配置
      }
    },
    computed: {
      getList() {
        return getMonitorFaultList;
      },
      getCascaderList() {
        return getContainerList;
      }
    }
  }
</script>

