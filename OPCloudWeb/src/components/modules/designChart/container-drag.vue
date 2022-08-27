<template>
    <draggable
        ref="containerBoard"
        class="design-container-board"
        :class="{ active: activeChartId === componentCfg?.chartId }"
        :list="componentCfg?.children"
        item-key="chartId"
        group="chartsGroup"
        :animation="400"
        :number="componentCfg?.chartId"
        @end="onEnd"
        @mouseenter="componentCfg && (componentCfg.mouseenter = true)"
        @mouseleave="componentCfg && (componentCfg.mouseenter = false)"
    >
        <template #item="{ element }">
            <template v-if="element.type === 'chart'">
                <chart-item :componentCfg="element"></chart-item>
            </template>
            <!-- 容器 -->
            <template v-else-if="element.type === 'container'">
                <container-drag :componentCfg="element"></container-drag>
            </template>
            <template v-else-if="element.type === 'container'">
                <card-drag :componentCfg="element"></card-drag>
            </template>
            <template v-else-if="element.type === 'table'">
                <table-drag :componentCfg="element"></table-drag>
            </template>
            <template v-else-if="element.type === 'tree'">
                <tree-drag :componentCfg="element"></tree-drag>
            </template>
        </template>
    </draggable>
</template>

<script lang="ts">
import { computed, ref, watch, onMounted, defineComponent } from "vue";
import draggable from "vuedraggable";
import chartItem from './chartItem.vue';
import cardDrag from './card-drag.vue';
import tableDrag from './table-drag.vue';
import treeDrag from './tree-drag.vue';
import { useActiveDesignChart, useDesignChart } from "@/use/useDesignChart";

export default defineComponent({
    name: 'containerDrag',
    components: { draggable, chartItem, cardDrag, tableDrag, treeDrag },
    props: {
        componentCfg: Object,
    },
    setup(props) {

        const { removeEchart, refreshChart } = useDesignChart();

        const { activeChartId, setActiveChart } = useActiveDesignChart()

        const containerBoard = ref<any | null>(null);

        const gridTemplateColumns = computed<string>(() => {
            return `repeat(${props.componentCfg?.columns},1fr)`;
        });

        const gridTemplateRows = computed<string>(() => {
            return `repeat(${props.componentCfg?.rows},1fr)`;
        });

        const gridRowStart = computed<string>(() => {
            return `span ${props.componentCfg?.__config__.rowSpan || 1}`;
        })

        const gridColumnStart = computed<string>(() => {
            return `span ${props.componentCfg?.__config__.colSpan || 1}`
        })
        // 网格gap
        const gap = computed<string>(() => {
            return `${props.componentCfg?.gap || 10}px`;
        });

        const style = computed(() => {
            return {
                gridTemplateColumns: gridTemplateColumns.value,
                gridTemplateRows: gridTemplateRows.value,
                gridRowStart: gridRowStart.value,
                gridColumnStart: gridColumnStart.value,
                gap: gap.value,
            };
        });

        watch(style, (val) => {
            initStyle(val);
        });

        function initStyle(__style__: any) {
            containerBoard.value &&
                Object.keys(__style__).forEach((s) => {
                    containerBoard.value.$el.style[s] = __style__[s];
                });
        }

        function onActiveChartHandler() {
        }

        function onEnd(e) {
            if (e.from !== e.to) {
                const target = e.clone as HTMLElement
                const number = target && target.attributes.getNamedItem('number').value
                number && refreshChart(number)
            }
        }

        onMounted((): void => {
            initStyle(style.value);
            if (containerBoard.value) {
                containerBoard.value.$el.onclick = () => {
                    props.componentCfg && setActiveChart(props.componentCfg)
                }
                const operButtonWrap = document.createElement('div')
                operButtonWrap.className = 'oper-button-wrap';
                const operIcon = document.createElement('i')
                operIcon.className = 'right-oper-icon el-icon-delete icon-error';
                operIcon.onclick = () => {
                    removeEchart(props.componentCfg.chartId)
                }
                operButtonWrap.appendChild(operIcon);
                containerBoard.value.$el.appendChild(operButtonWrap);
            }
        });

        return {
            activeChartId,
            containerBoard,
            removeEchart,
            onActiveChartHandler,
            onEnd
        };
    },
});
</script>