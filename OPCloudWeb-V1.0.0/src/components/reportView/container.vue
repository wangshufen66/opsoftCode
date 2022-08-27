<template>
    <div class="container-view-wrap" :style="style">
        <template v-for="element in componentCfg.children" :key="element.chartId">
            <template v-if="element.type === 'chart'">
                <chart-item :componentCfg="element"></chart-item>
            </template>
            <!-- 容器 -->
            <template v-else-if="element.type === 'container'">
                <container-view :componentCfg="element"></container-view>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import chartItem from './chart.vue';

export default defineComponent({
    name: 'container-view',
    components: { chartItem },
    props: {
        componentCfg: Object,
    },
    setup(props) {

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

        return {
            style
        }
    }
})
</script>
