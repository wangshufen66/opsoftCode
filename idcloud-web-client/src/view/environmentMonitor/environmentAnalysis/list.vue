<template>
  <id-bar-query-table
    id-query-form-label-width="100px"
    :getTable="getList"
    :tableColumns="tableColumns"
    @afterGetTablePage="afterGetTablePage"
  >
  </id-bar-query-table>
</template>

<script>
  import IdBarQueryTable from "@/components/id-pages/IdBarQueryTable";
  import {list} from "@/api/environmentMonitor/environmentAnalysis";
  import authority from "@/components/authority";
  import iconAirPressure from '@/assets/images/environmentMonitor/airPressureMonitoring/airPressure.png';
  import iconElectronic from '@/assets/images/environmentMonitor/electronicUsageMonitor/electronic.png';
  import iconGas from '@/assets/images/environmentMonitor/gasMonitoring/gas.png';
  import iconHumidity from '@/assets/images/environmentMonitor/humidityMonitoring/humidity.png';
  import iconTemperature from '@/assets/images/environmentMonitor/temperatureMonitoring/temperature.png';
  import iconWater from '@/assets/images/environmentMonitor/waterUsageMonitoring/water.png';

  export default {
    name: "list",
    components: {IdBarQueryTable},
    data() {
      return {
        tableColumns: [
          {
            tag: "el-table-column",
            label: "容器名称",
            prop: "containerName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "容器点名称",
            prop: "pointContainerName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "监测代码",
            prop: "collectNumber",
            minWidth: 250,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "监测名称",
            prop: "pointName",
            minWidth: 250,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column-status-name",
            label: "状态",
            prop: "onlineStatus",
            minWidth: 100,
            colorType: 2,
            showOverflowTooltip: true,
            comp: "Select",
            options: [
              {
                label: "正常",
                value: "0",
                authority: new authority(),
              },
              {
                label: "离线",
                value: "1",
                authority: new authority(),
              },
            ],
          },
          {
            tag: "el-table-column",
            label: "监测点分类",
            prop: "type",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "备注信息",
            prop: "name",
            minWidth: 400,
            resizable: false,
            showOverflowTooltip: true,
            comp: "String",
          },
        ], //表格列配置
      }
    },
    computed: {
      getList() {
        return list;
      },
    },
    methods: {
      afterGetTablePage(data) {
        const selectionArray = [
          {
            value: '1',
            label: '默认',
            icon: null
          },
          {
            value: '2',
            label: '电表',
            icon: iconElectronic
          },
          {
            value: '3',
            label: '水表',
            icon: iconWater
          },
          {
            value: '4',
            label: '气压表',
            icon: iconAirPressure
          },
          {
            value: '5',
            label: '温度表',
            icon: iconTemperature
          },
          {
            value: '6',
            label: '湿度表',
            icon: iconHumidity
          },
          {
            value: '7',
            label: '燃气表',
            icon: iconGas
          },
        ]
        data.records.forEach((rItem) => {
          rItem.type = selectionArray[parseInt(rItem.showType) - 1].label;
          rItem.status=rItem.onlineStatus;
          rItem.statusName=rItem.onlineStatus===0?"离线":"在线";
        });
        data.list = data.records;
      }
    }
  }
</script>
