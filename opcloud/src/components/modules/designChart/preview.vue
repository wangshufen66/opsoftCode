<template>
  <el-dialog title="预览" v-model="visible" width="80%" destroy-on-close :before-close="beforeClose">
    <template v-slot:title>
      <dialog-title title="预览"></dialog-title>
    </template>

    <el-scrollbar class="desgin-main-wrap scrollbar">
      <div class="chart-preview-board" ref="designBoard" :style="style">
        <div v-for="(element,i) in currentChartList" :key="element.chartId">
          <div
            class="chart-item-wrap"
            :style="{
              'grid-row-start': `span ${element.__config__.rowSpan || 1}`,
              'grid-column-start': `span ${element.__config__.colSpan || 1}`,
            }"
          >
            <div class="title" v-show="element.__config__.label">
              <div class="line"></div>
              {{ element.__config__.label }}
            </div>
            <div :id="`chart_${element.chartId}`" class="chart-item"></div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import { computed, ref, watch, nextTick } from 'vue';
import { useDesignChart } from '@/hooks/use-designChart';

export default {
  name: 'chartPreview',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],

  setup(props, { emit }) {
    const { currentChartList, panelConf, renderAllCharts } = useDesignChart();

    const designBoard = ref(null);

    const gridTemplateColumns = computed(() => {
      return `repeat(${panelConf.value.columns},${(panelConf.value.cellWidth && `${panelConf.value.cellWidth}px`) || '1fr'
        })`;
    });

    const gridTemplateRows = computed(() => {
      return `repeat(${panelConf.value.rows},${(panelConf.value.cellHeight && `${panelConf.value.cellHeight}px`) ||
        '1fr'
        })`;
    });

    // 网格gap
    const gap = computed(() => {
      return `${panelConf.value.gap || 10}px`;
    });

    const style = computed(() => {
      return {
        gridTemplateColumns: gridTemplateColumns.value,
        gridTemplateRows: gridTemplateRows.value,
        gap: gap.value,
      };
    });

    watch(
      () => props.visible,
      (val) => {
        if (!!val) {
          nextTick(() => {
            renderAllCharts('.chart-preview-board');
          });
        }
      }
    );

    function beforeClose() {
      emit('update:visible', false);
    }

    return {
      currentChartList,
      designBoard,
      style,
      beforeClose,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/designchart/preview.scss";
</style>