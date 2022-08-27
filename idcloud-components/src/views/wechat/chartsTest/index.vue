<template>
  <div class="chart-test" v-title data-title="复杂图表测试">
      <div class="chart-container" :ref="charts"></div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
const echarts = require('echarts')

export default defineComponent({
  name: "wechat-chart-test",
  data() {
    return {};
  },
  async mounted() {
      const chartInstance = echarts.init(ref['charts'])
      console.log(chartInstance); 
  },
  unmounted() {},
  methods: {
  },
});
</script>

<style lang="scss" scoped>
.chart-container{
    width: 100%;
    height: 200px;
    background-color: red;
}
</style>