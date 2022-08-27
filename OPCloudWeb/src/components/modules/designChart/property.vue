<template>
  <div class="chart-property-board property-wrap">
    <el-tabs v-model="currentTab" class="property-wrap_tabs">
      <el-tab-pane label="组件属性" name="field"></el-tab-pane>
      <el-tab-pane label="页面属性" name="page"></el-tab-pane>
    </el-tabs>
    <el-scrollbar class="property-board-content">
      <template v-if="activeChart">
        <div v-show="currentTab === 'field'">
          <template v-if="activeChart.type === 'chart'">
            <!-- 图表 -->
            <chart-setting></chart-setting>
          </template>
          <!-- 容器 -->
          <template v-else-if="activeChart.type === 'container'">
            <container-setting></container-setting>
          </template>
          <template v-else-if="activeChart.type === 'card'">
            <card-setting></card-setting>
          </template>
          <template v-else-if="activeChart.type === 'image'">
            <image-setting></image-setting>
          </template>
          <template v-else-if="activeChart.type === 'text'">
            <text-setting></text-setting>
          </template>
          <template v-else-if="activeChart.type === 'table'">
            <table-setting></table-setting>
          </template>
          <template v-else-if="activeChart.type === 'tree'">
            <tree-setting></tree-setting>
          </template>
        </div>
        <!-- 页面属性配置 -->
        <page-setting v-show="currentTab === 'page'"></page-setting>
      </template>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useActiveDesignChart, useDesignChart } from '@/use/useDesignChart';
import chartSetting from './property/chartSet.vue'
import pageSetting from './property/pageSet.vue'
import containerSetting from './property/containerSet.vue'
import cardSetting from './property/cardSet.vue'
import imageSetting from './property/imageSet.vue'
import textSetting from './property/textSet.vue'
import tableSetting from './property/tableSet.vue'
import treeSetting from './property/treeSet.vue'

import { getDataBySql } from '@/api/homeApi/index';
import { messageAlert } from '@/utils/utils';
export default defineComponent({
  components: {
    chartSetting, pageSetting, containerSetting, cardSetting, imageSetting, textSetting, tableSetting, treeSetting
  },
  setup() {
    const currentTab = ref<string>('field');

    const activeChartIndex = ref<number>(0);


    const { currentChartList } = useDesignChart();
    const { activeChart, refreshChart, addDefaultSerie, removeSerie } = useActiveDesignChart(currentChartList);
    console.log('activeChart', activeChart.value)

    function removeChart(index: number): void {
      const { series } = activeChart.value;
      if (series.length === 1) {
        messageAlert('error', '必须包含一项图表!')
      } else {
        removeSerie(index);
      }
    }

    return {
      currentTab,
      activeChartIndex,
      activeChart,
      refreshChart,
      addDefaultSerie,
      removeChart,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/modules/designchart/property.scss";
.custom-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-select {
  width: 100%;
}
.add-serie {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  i {
    margin-right: 5px;
    color: #999;
    cursor: pointer;
    font-size: 20px;
  }
}
.radar-item {
  display: flex;
  align-items: center;
}
</style>
