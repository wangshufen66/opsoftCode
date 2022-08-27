<template>
    <div
        class="image-wrap"
        :class="{ active: activeChartId === componentCfg?.chartId }"
        :style="style"
        @click.stop="onActiveChartHandler(componentCfg)"
        @mouseenter="componentCfg && (componentCfg.mouseenter = true)"
        @mouseleave="componentCfg && (componentCfg.mouseenter = false)"
    >
        <!-- <img ref="imgRef" :src="imgSrc"  /> -->
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
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
import { useActiveDesignChart, useDesignChart } from '@/use/useDesignChart';


export default defineComponent({
    props: {
        componentCfg: Object,
    },
    setup(props) {
        const { removeEchart } = useDesignChart();
        const { activeChartId, setActiveChart } = useActiveDesignChart();

        const current = getCurrentInstance();

        const imgRef = ref<any>(null);

        // 
        const parentDataModel = computed<any>(() => {
            const parent = current?.parent?.parent
            // 父组件的数据源
            const parentModel = parent && parent?.props && parent?.props.componentCfg && parent?.props.componentCfg.dataSource
            if (parentModel) {
                props.componentCfg && (props.componentCfg.dataModel = Object.keys(Array.isArray(parentModel) ? parentModel[0] : parentModel))
            }
            return parentModel || undefined
        })

        // 图片路径
        const imgSrc = computed<string | undefined>(() => {
            let src = undefined
            if (!props.componentCfg) return src
            if (props.componentCfg.dataType === 'model') {
                // 父组件的数据源
                const parentModel = parentDataModel.value
                const dataModel = parentModel && Array.isArray(parentModel) ? parentModel[0] : parentModel
                src = dataModel && dataModel[props.componentCfg.dataField]
            } else {
                src = props.componentCfg.path
            }
            return src
        })

        const style = computed<any>(() => {
            return {
                borderRadius: `${props.componentCfg?.borderRadius}px`,
                gridRowStart: `span ${props.componentCfg?.__config__.rowSpan}`,
                gridColumnStart: `span ${props.componentCfg?.__config__.colSpan}`,
                backgroundImage: `url(${imgSrc.value})`
            }
        })

        function onActiveChartHandler(item) {
            setActiveChart(item);
        }

        return {
            activeChartId,
            imgSrc,
            style,
            imgRef,
            removeEchart,
            onActiveChartHandler
        }
    }
})
</script>

<style scoped lang="scss">
.image-wrap {
    background-color: #e6e6e6;
    position: relative;
    border-radius: 4px;
    height: 100%;
    width: 100%;
    border: 1px dashed transparent;
    background-size: cover;
    background-position: center;
}
img {
    width: 100%;
    height: 100%;
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
</style>