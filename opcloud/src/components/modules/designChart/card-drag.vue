<template>
    <draggable
        ref="cardBoard"
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
                <card-drag :componentCfg="element"></card-drag>
            </template>
            <template v-else-if="element.type === 'image'">
                <image-drag :componentCfg="element"></image-drag>
            </template>
            <template v-else-if="element.type === 'text'">
                <text-drag :componentCfg="element"></text-drag>
            </template>
        </template>
    </draggable>
</template>

<script lang="ts">
import { computed, ref, watch, onMounted, defineComponent } from "vue";
import draggable from "vuedraggable";
import chartItem from './chartItem.vue'
import imageDrag from './image-drag.vue'
import textDrag from './text-drag.vue'
import { useActiveDesignChart, useDesignChart } from "@/hooks/use-designChart";

export default defineComponent({
    name: 'cardDrag',
    components: { draggable, chartItem, imageDrag, textDrag },
    props: {
        componentCfg: Object,
    },
    setup(props) {

        const { removeEchart, refreshChart } = useDesignChart();

        const { activeChartId, setActiveChart } = useActiveDesignChart()

        const cardBoard = ref<any | null>(null);

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

        const backgroundColor = computed<string>(() => {
            return props.componentCfg?.backgroundColor;
        });

        const style = computed(() => {
            return {
                gridTemplateColumns: gridTemplateColumns.value,
                gridTemplateRows: gridTemplateRows.value,
                gridRowStart: gridRowStart.value,
                gridColumnStart: gridColumnStart.value,
                gap: gap.value,
                backgroundColor: backgroundColor.value,
                backgroundImage: `url(${props.componentCfg?.backgroundImage})`
            };
        });

        watch(style, (val) => {
            initStyle(val);
        });

        function initStyle(__style__: any) {
            cardBoard.value &&
                Object.keys(__style__).forEach((s) => {
                    cardBoard.value.$el.style[s] = __style__[s];
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
            if (cardBoard.value) {
                cardBoard.value.$el.onclick = () => {
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
                cardBoard.value.$el.appendChild(operButtonWrap);
            }
        });

        return {
            activeChartId,
            cardBoard,
            removeEchart,
            onActiveChartHandler,
            onEnd
        };
    },
});
</script>

