<template>
  <div>
    <div class="topDroupDown">
      <div class="datePicker">时间选择</div>
      <div>
        <el-select @change="onSelectDate" placeholder="请选择时间" v-model="datePick.value" filterable>
          <el-option
            v-for="item in datePick.option"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div id="chart-customer" class="chart" ref="chartCustomer"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import echarts from '@/plugins/echarts';
import { getCustomerList } from '@/api/system';

function initEchartData(option: any) {
  const chartCustomer = document.getElementById('chart-customer');
  const myChartCustomer = echarts.init(chartCustomer);
  myChartCustomer.setOption(option);
}

// function setOption(data) {
//   return {
//     color: ['#5470C6', '#91CC75', '#EE6666'],
//     title: {
//       text: '新增客户数',
//       left: 100
//     },
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//         type: 'cross'
//       }
//     },
//     grid: {
//       right: '20%'
//     },
//     legend: {
//       data: ['新增客户数', '新增订阅'],
//       right: '300px'
//     },
//     xAxis: [
//       {
//         type: 'category',
//         data: data.xAxisData
//       }
//     ],
//     yAxis: [
//       {
//         type: 'value',
//         min: 0,
//         max: 50,
//         position: 'left',
//         axisLine: {
//           show: true,
//           lineStyle: {
//             color: 'grey'
//           }
//         },
//         axisLabel: {
//           formatter: '{value}(个)'
//         }
//       },
//     ],
//     series: [
//       {
//         name: '新增客户数',
//         type: 'bar',
//         data: data.newCustomer
//       },
//       {
//         name: '新增订阅',
//         type: 'bar',
//         data: data.newOrder
//       },
//     ]
//   }
// }

//获取配置数据
async function getDataList() {
  // const res = await getCustomerList();
  // if (res.code === 200) {
  //   let option = setOption(res.data.records)
  //   initEchartData(option)
  // }else{
    const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    series: [

        {
            name: '新增',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            itemStyle: {
                color: '#91CC75'
            },
            data: [12, 13, 10, 13, 29, 23, 21]
        },
        {
            name: '总数',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            itemStyle: {
                // color: '#000'
                color: '#73C0DE'
            },
            data: [132, 130, 130, 133, 139, 130, 132]
        },
    ]
};
  initEchartData(option)

  // }
}

//选中下拉框触发事件
function onSelectDate(value) {
  let todayDate = new Date();
  getDataList();
}
//下拉框数据
const datePick = reactive({
  value: [],
  option: [
    {
      value: '今日',
      label: '今日',
    },
    {
      value: '本周',
      label: '本周',
    },
    {
      value: '本月',
      label: '本月',
    },
    {
      value: '季度',
      label: '季度',
    },
    {
      value: '半年',
      label: '半年',
    },
    {
      value: '全年',
      label: '全年',
    },
  ]
})
getDataList();

</script>

<style lang="scss" scoped>
@import "@/styles/statisticsCss.scss";
</style>

