<template>
  <div class="m-container">测试图表组件
    <component
      :is="`custom-report-${reportConfig[0].componentName}`"
      :api="reportConfig[0].api"
      :api-method="reportConfig[0].method"
      :call-interval-sec="reportConfig[0].refreshSec"
      style="flex: 1"
    />
    <component
      :is="`custom-report-${reportConfig[1].componentName}`"
      :api="reportConfig[1].api"
      :api-method="reportConfig[1].method"
      :call-interval-sec="reportConfig[1].refreshSec"
      style="flex: 1"
    />
    <component
      :is="`custom-report-${reportConfig[2].componentName}`"
      :api="reportConfig[2].api"
      :api-method="reportConfig[2].method"
      :call-interval-sec="reportConfig[2].refreshSec"
      style="flex: 1;height: 20rem;width: 100%;"
    />
    <component
      :is="`custom-report-${reportConfig[3].componentName}`"
      :api="reportConfig[3].api"
      :api-method="reportConfig[3].method"
      :call-interval-sec="reportConfig[3].refreshSec"
      style="flex: 1;height: 20rem;width: 100%;"
    />
    <component
      :is="`custom-report-${reportConfig[4].componentName}`"
      :api="reportConfig[4].api"
      :api-method="reportConfig[4].method"
      :call-interval-sec="reportConfig[4].refreshSec"
      style="flex: 1;height: 20rem;width: 100%;"
    />
  </div>
</template>

<script>
import CustomReportTableModule from '@/components/CustomReport/custom-report-table-module'
import CustomReportTableCardsModule from '@/components/CustomReport/custom-report-table-cards-module'
import CustomReportBarModule from '@/components/CustomReport/custom-report-bar-module'
import CustomReportPieModule from '@/components/CustomReport/custom-report-pie-module'
import CustomReportProfileModule from '@/components/CustomReport/custom-report-profile-module'

export default {
  name: 'BoardTemplate',
  components: { CustomReportTableModule, CustomReportTableCardsModule, CustomReportBarModule, CustomReportPieModule, CustomReportProfileModule },
  data() {
    return {
      // 统计图组件配置属性数组
      reportConfig: [
        { // 普通数据表
          componentName: 'table-module',
          api: 'http://www.micking.top:8580/kanban/preview/tabledemoa',
          method: 'get',
          refreshSec: 8
        },
        { // 卡片数据表
          componentName: 'table-cards-module',
          api: 'http://www.micking.top:8580/kanban/preview/tablecardsdemo',
          method: 'get',
          refreshSec: 8
        },
        { // 柱形折线图
          componentName: 'bar-module',
          api: 'http://www.micking.top:8580/kanban/preview/barLinedemod',
          method: 'get',
          refreshSec: 8
        },
        { // 饼状环形图
          componentName: 'pie-module',
          api: 'http://www.micking.top:8580/kanban/preview/pieringdemoa',
          method: 'get',
          refreshSec: 8
        },
        { // 剖面图
          componentName: 'profile-module',
          api: 'http://www.micking.top:8580/kanban/preview/profiledemo',
          method: 'get',
          refreshSec: 8
        }
      ]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .m-container{
    background-color: black;
    .m-chart-demo{
      flex: 1;
      width: 200rem;
      height: 200rem;
    }
  }

</style>
