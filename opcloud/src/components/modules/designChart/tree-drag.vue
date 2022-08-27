<template>
    <div
        class="desgin-report-tree-wrap"
        :class="{ active: activeChartId === componentCfg?.chartId }"
        :style="style"
    >
        <component
            class="desgin-report-tree"
            :is="componentCfg.componentTag"
            :component="componentCfg"
            :model="dataModel"
            @click.stop="onActiveChartHandler"
        ></component>
        <!-- 操作按钮 -->
        <div class="oper-button-wrap">
            <i
                v-if="componentCfg?.chartId == activeChartId || componentCfg?.mouseenter"
                class="right-oper-icon el-icon-delete icon-error"
                @click.stop="removeEchart(componentCfg?.chartId)"
            ></i>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from 'vue';
import { useActiveDesignChart, useDesignChart } from '@/hooks/use-designChart';

export default defineComponent({
    props: {
        componentCfg: Object
    },
    setup(props) {
        const { removeEchart } = useDesignChart();
        const { activeChartId, setActiveChart } = useActiveDesignChart();

        const dataModel = reactive({});

        const gridRowStart = computed<string>(() => {
            return `span ${props.componentCfg?.__config__.rowSpan || 1}`;
        })

        const gridColumnStart = computed<string>(() => {
            return `span ${props.componentCfg?.__config__.colSpan || 1}`
        })

        const style = computed(() => {
            return {
                gridRowStart: gridRowStart.value,
                gridColumnStart: gridColumnStart.value,
            };
        })

        function onActiveChartHandler() {
            setActiveChart(props.componentCfg);
        }

        return {
            dataModel,
            style,
            activeChartId,
            removeEchart,
            onActiveChartHandler
        }
    }
})
</script>

<style lang="scss" scoped>
.desgin-report-tree-wrap {
    position: relative;
    padding: 0;
    border: 1px dashed transparent;
    display: flex;
    .desgin-report-tree {
        width: 100%;
    }
}
</style>