<template>
  <id-bar-query-table
    id-query-form-label-width="110px"
    :getTable="getList"
    :tableColumns="tableColumns"
    @afterGetTablePage="afterGetTablePage"
  >
  </id-bar-query-table>
</template>

<script>
  import IdBarQueryTable from "@/components/id-pages/IdBarQueryTable";
  import {type} from "@/api/environmentMonitor/environmentAnalysis";
  import iconAirPressure from '@/assets/images/environmentMonitor/airPressureMonitoring/airPressure.png';
  import iconElectronic from '@/assets/images/environmentMonitor/electronicUsageMonitor/electronic.png';
  import iconGas from '@/assets/images/environmentMonitor/gasMonitoring/gas.png';
  import iconHumidity from '@/assets/images/environmentMonitor/humidityMonitoring/humidity.png';
  import iconTemperature from '@/assets/images/environmentMonitor/temperatureMonitoring/temperature.png';
  import iconWater from '@/assets/images/environmentMonitor/waterUsageMonitoring/water.png';

  export default {
    name: "type",
    components: {IdBarQueryTable},
    data() {
      return {
        tableColumns: [
          {
            tag: "el-table-column",
            label: "监测点代码",
            prop: "type",
            minWidth: 250,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "监测点数量",
            prop: "count",
            minWidth: 250,
            showOverflowTooltip: true,
            comp: "Number",
          },
          {
            tag: "el-table-column",
            label: "监测点占比(%)",
            prop: "percentage",
            minWidth: 250,
            showOverflowTooltip: true,
            comp: "Number",
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
        return type;
      },
    },
    methods:{
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
            icon:iconAirPressure
          },
          {
            value: '5',
            label: '温度表',
            icon:iconTemperature
          },
          {
            value: '6',
            label: '湿度表',
            icon:iconHumidity
          },
          {
            value: '7',
            label: '燃气表',
            icon: iconGas
          },
        ]
        data.records.forEach((rItem)=>{
          rItem.type=selectionArray[parseInt(rItem.type)-1].label;
        });
        data.list = data.records;
      }
    }
  }
</script>
