<template>
  <div class="desgin-chart-main-wrap scrollbar">
    <search-form></search-form>
    <div
      class="desgin-board-wrap"
      :style="{ height: panelConf.searchConfig.length > 0 ? 'calc(100% - 52px)' : '100%' }"
    >
      <draggable
        ref="designBoard"
        class="design-board"
        :list="currentChartList"
        item-key="chartId"
        group="chartsGroup"
        :sort="true"
        :animation="400"
        @end="onEnd"
      >
        <template #item="{ element }">
          <draggable-item :element="element"></draggable-item>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  nextTick,
  defineAsyncComponent,
} from 'vue';
import draggable from 'vuedraggable';
import draggableItem from './draggable-item.vue'
import { useDesignChart } from '@/hooks/use-designChart';

export default defineComponent({
  components: {
    draggable, draggableItem,
    searchForm: defineAsyncComponent({
      loader: () => import('./search-form.vue'),
      delay: 1000,
      timeout: 3000
    }),
  },
  setup() {
    const { currentChartList, panelConf, renderAllCharts, refreshChart } = useDesignChart();
    const designBoard = ref<any | null>(null);

    const gridTemplateColumns = computed<string>(() => {
      return `repeat(${panelConf.value.columns},1fr)`;
    });

    const gridTemplateRows = computed<string>(() => {
      return `repeat(${panelConf.value.rows},1fr)`;
    });

    // 网格gap
    const gap = computed<string>(() => {
      return `${panelConf.value.gap || 10}px`;
    });

    const style = computed(() => {
      return {
        gridTemplateColumns: gridTemplateColumns.value,
        gridTemplateRows: gridTemplateRows.value,
        gap: gap.value,
      };
    });

    watch(style, (val) => {
      initStyle(val);
      nextTick(() => {
        renderAllCharts();
      });
    });

    function initStyle(__style__: any) {
      designBoard.value &&
        Object.keys(__style__).forEach((s) => {
          designBoard.value.targetDomElement.style[s] = __style__[s];
        });
    }

    function onEnd(e) {
      if (e.from !== e.to) {
        const target = e.clone as HTMLElement
        const number = target && target.attributes.getNamedItem('number')?.value
        nextTick(() => {
          number && refreshChart(number)
        })
      }
    }

    onMounted((): void => {
      initStyle(style.value);
      nextTick(() => {
        renderAllCharts();
      });
    });

    return {
      panelConf,
      currentChartList,
      designBoard,
      onEnd
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/modules/designchart/main.scss";
</style>