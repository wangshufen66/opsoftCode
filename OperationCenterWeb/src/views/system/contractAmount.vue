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
    <div id="chart-contractAmount" class="chart" ref="chartCustomerActivity"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import echarts from '@/plugins/echarts';
import { getCustomerList } from '@/api/system';

function initEchartData(option: any) {
  const chartcontractAmount = document.getElementById('chart-contractAmount');
  const myChartCustomer = echarts.init(chartcontractAmount);
  myChartCustomer.setOption(option);
}
function setOption(data) {
  return {
    color: ['#5470C6', '#91CC75', '#EE6666'],
    title: {
      text: '客户数',
      left: 100
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      right: '20%'
    },

    legend: {
      data: ['活跃个数', '活跃比列'],
      right: '300px',
    },
    xAxis: [
      {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 50,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: 'grey'
          }
        },
        axisLabel: {
          formatter: '{value}(个)'
        }
      },

    ],
    series: [
      {
        name: '活跃个数',
        type: 'bar',
        data: [2, 4, 17, 23, 26, 17, 1, 12, 32, 20, 6, 3]
      },
      {
        name: '活跃比列',
        type: 'bar',

        data: [6, 9, 9, 26, 2, 7, 17, 18, 7, 18, 6, 23]
      },
    ]
  }
}

//获取配置数据
async function getDataList() {
  const res = await getCustomerList();
  if (res.code === 200) {
    let option = setOption(res.data.records)
    initEchartData(option)
  }
}

//选中下拉框触发事件
function onSelectDate(value) {
  // let todayDate = new Date();
  getDataList();

}

const datePick = reactive({
  value: [],
  option: [
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