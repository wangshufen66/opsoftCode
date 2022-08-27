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
    <div id="chart-customerActivity" class="chart" ref="chartCustomerActivity"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import echarts from '@/plugins/echarts';
import { getCustomerList } from '@/api/system';


function initEchartData(option: any) {
  const customerActivity = document.getElementById('chart-customerActivity');
  const myChartCustomer = echarts.init(customerActivity);
  myChartCustomer.setOption(option);
}
function setOption(data) {
  return {
    color: ['#5470C6', '#91CC75', '#EE6666'],
    title: {
      text: '合同金额',
      left: 100
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },

    legend: {
      data: ['当月预定金额', '去年当月预定金额'],
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
          formatter: '{value}(万)'
        }
      },

    ],
    series: [
      {
        name: '当月预定金额',
        type: 'bar',
        data: [2, 4, 17, 23, 26, 17, 1, 12, 32, 20, 6, 3]
      },
      {
        name: '去年当月预定金额',
        type: 'bar',

        data: [6, 9, 9, 26, 2, 7, 17, 18, 7, 18, 6, 23]
      },
    ]
  }
}


//选中下拉框触发事件
function onSelectDate(value) {
  getDataList()

}
const datePick = reactive({
  value: [],
  option: [
    {
      value: '一月',
      label: '一月',
    },
    {
      value: '二月',
      label: '二月',
    },
    {
      value: '三月',
      label: '三月',
    },
    {
      value: '四月',
      label: '四月',
    },
    {
      value: '五月',
      label: '五月',
    },
    {
      value: '六月',
      label: '六月',
    },
    {
      value: '七月',
      label: '七月',
    },
    {
      value: '八月',
      label: '五月',
    },
    {
      value: '八月',
      label: '八月',
    },
    {
      value: '九月',
      label: '九月',
    },
    {
      value: '六月',
      label: '五月',
    },
    {
      value: '十月',
      label: '十月',
    },
    {
      value: '十一月',
      label: '十一月',
    },
    {
      value: '十二月',
      label: '十二月',
    },
  ]
})

//获取配置数据
async function getDataList() {
  const res = await getCustomerList();
  if (res.code === 200) {
    let option = setOption(res.data.records)
    initEchartData(option)
  }
}
getDataList();
</script>

<style lang="scss" scoped>
// @import "@/styles/statisticsCss.scss";
</style>