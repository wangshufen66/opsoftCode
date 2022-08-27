<template>
  <el-scrollbar class="charts-list">
    <draggable
      class="charts-draggable"
      :list="state.componentList"
      item-key="chartId"
      :group="{ name: 'chartsGroup', pull: 'clone', put: false }"
      :clone="cloneChart"
      :sort="false"
      @end="onEnd"
    >
      <template #item="{ element }">
        <div class="charts-item" @click="addComponent(element)">
          <div class="charts-body">
            <i
              :class="
                element.__config__.icon.indexOf('el-') > -1
                  ? [`${element.__config__.icon}`]
                  : ['opfont', `opicon-${element.__config__.icon}`]
              "
            ></i>
            {{ element.__config__.label }}
          </div>
        </div>
      </template>
    </draggable>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import draggable from 'vuedraggable';
import { chart } from '@/config/echarts/config';
import { deepClone } from '@/utils/utils';
import { useActiveDesignChart, useDesignChart } from '@/use/useDesignChart';

const state = reactive({
  componentList: chart,
});
let tempActiveData;

const { currentChartList } = useDesignChart();

const { activeChartAndPush } = useActiveDesignChart(currentChartList);

// 点击组件给设计界面添加组件
const addComponent = (item: any): void => {
  cloneChart(item);
  activeChartAndPush(tempActiveData);
};
// 拖拽结束
const onEnd = (e) => {
  if (e.from !== e.to) {
    activeChartAndPush(tempActiveData);
  }
};
// 复制组件
const cloneChart = (orgItem: any) => {
  const clone = deepClone(orgItem);
  const config = clone.__config__;
  createIdAndKey(clone);
  clone.placeholder !== undefined && (clone.placeholder += config.label);
  tempActiveData = clone;
};

// 设置组件ID
function createIdAndKey(item) {
  item.chartId = `${+new Date()}`;
  return item;
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/designchart/chartlist.scss";
</style>