<template>
    <div
        class="desgin-report-table"
        :class="{ active: activeChartId === componentCfg?.chartId }"
        :style="style"
        @click.stop="onActiveChartHandler"
    >
        <div class="title" v-show="componentCfg?.__config__.label">
            <div class="line"></div>
            {{ componentCfg?.__config__.label }}
        </div>
        <component :is="componentCfg.componentTag" :component="componentCfg"></component>
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
import { defineComponent, computed } from 'vue';
import { useActiveDesignChart, useDesignChart } from '@/use/useDesignChart';

export default defineComponent({
    props: {
        componentCfg: Object
    },
    setup(props) {
        const { removeEchart } = useDesignChart();
        const { activeChartId, setActiveChart } = useActiveDesignChart();

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
            style,
            activeChartId,
            removeEchart,
            onActiveChartHandler
        }
    }
})
</script>

<style lang="scss" scoped>
.desgin-report-table {
    position: relative;
    padding: 0;
    border: 1px dashed transparent;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 10px;
    .title {
        font-size: 15px;
        display: flex;
        align-items: center;
        height: 30px;
        padding-bottom: 8px;
        .line {
            height: 15px;
            width: 4px;
            margin-right: 8px;
            background-color: #539af8;
        }
    }
    .table-extend {
        padding: 0;
    }
    .el-table__empty-block {
        width: 100% !important;
    }
}
</style>