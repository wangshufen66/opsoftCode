<template>
    <div
        class="chart-item-wrap"
        @click.stop="onActiveChartHandler(componentCfg)"
        :class="{ active: activeChartId === componentCfg?.chartId }"
        :style="{
            'gridRowStart': `span ${componentCfg?.__config__.rowSpan || 1}`,
            'gridColumnStart': `span ${componentCfg?.__config__.colSpan || 1}`,
        }"
        :number="componentCfg?.chartId"
        @mouseenter="componentCfg && (componentCfg.mouseenter = true)"
        @mouseleave="componentCfg && (componentCfg.mouseenter = false)"
    >
        <div class="title" v-show="componentCfg?.__config__.label">
            <div class="line"></div>
            {{ componentCfg?.__config__.label }}
            <div class="more" v-if="componentCfg?.__config__.isDetail" @click="onMoreClick">more>></div>
        </div>
        <div :id="`chart_${componentCfg?.chartId}`" class="chart-item"></div>
        <!-- 操作按钮 -->
        <div class="oper-button-wrap">
            <i
                v-if="componentCfg?.chartId == activeChartId || componentCfg?.mouseenter"
                class="right-oper-icon el-icon-document-copy icon-error"
                @click.stop="copyComponent(componentCfg)"
            ></i>
            <i
                v-if="componentCfg?.chartId == activeChartId || componentCfg?.mouseenter"
                class="right-oper-icon el-icon-delete icon-error"
                @click.stop="removeEchart(componentCfg?.chartId)"
            ></i>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useActiveDesignChart, useDesignChart } from '@/hooks/use-designChart';
import { useRouter } from 'vue-router'

export default defineComponent({
    props: {
        componentCfg: Object
    },
    setup(props) {
        const router = useRouter();

        const { panelConf, copyComponent, removeEchart } = useDesignChart();
        const { activeChartId, setActiveChart } = useActiveDesignChart();

        function onActiveChartHandler(item) {
            setActiveChart(item);
        }
        /**详情 */
        function onMoreClick() {
            const { detailParams } = props.componentCfg?.__config__;
            if (detailParams && detailParams.length > 0) {

                const searchParams = {}
                panelConf.value.searchConfig &&
                    panelConf.value.searchConfig.forEach(f => {
                        searchParams[f.field] = undefined
                    })
                router.push({
                    path: '/application',
                    query: {
                        appid: detailParams[0],
                        modelid: detailParams[1],
                        pageId: detailParams[2],
                        ...searchParams
                    }
                })
            }
        }

        return {
            activeChartId,
            copyComponent,
            removeEchart,
            onActiveChartHandler,
            onMoreClick
        }
    }
})
</script>

<style lang="scss" scoped>
.chart-item-wrap {
    position: relative;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: all ease-out 0.35s;
    border: 1px dashed transparent;
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
    .chart-item {
        flex: 1;
        height: calc(100% - 30px);
    }
    .oper-button-wrap {
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 5px;
        display: flex;
    }

    .right-oper-icon {
        border: 1px solid #eee;
        border-radius: 100%;
        padding: 5px;
        margin-left: 10px;
        font-size: 12px;
    }
    .icon-error {
        border-color: #f56c6c;
        color: #f56c6c;
        background: #fff;
        &:hover {
            background: #f56c6c;
            color: #fff;
        }
    }

    .more {
        cursor: pointer;
        position: absolute;
        right: 10px;
        color: #539af8;
        font-size: 10px;
    }
}
</style>