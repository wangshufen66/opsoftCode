<template>
    <div
        class="text-wrap"
        :class="{ active: activeChartId === componentCfg?.chartId }"
        :style="{ gridRowStart: `span ${componentCfg?.__config__.rowSpan}`, gridColumnStart: `span ${componentCfg?.__config__.colSpan}` }"
        @click.stop="onActiveChartHandler(componentCfg)"
        @mouseenter="componentCfg && (componentCfg.mouseenter = true)"
        @mouseleave="componentCfg && (componentCfg.mouseenter = false)"
    >
        <div class="text-item" :style="style">{{ textValue }}</div>
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
import { computed, defineComponent, getCurrentInstance } from 'vue';
import { useActiveDesignChart, useDesignChart } from '@/hooks/use-designChart';
import dayjs from 'dayjs';


export default defineComponent({
    props: {
        componentCfg: Object,
    },
    setup(props) {
        const { removeEchart } = useDesignChart();
        const { activeChartId, setActiveChart } = useActiveDesignChart();

        const current = getCurrentInstance();
        // 文本内容
        const textValue = computed<string>(() => {
            let label = ""
            if (!props.componentCfg) return label;
            let value: any = ""
            if (props.componentCfg.dataType === 'model') {
                // 父组件的数据源
                const parentModel = parentDataModel.value;
                const dataModel = parentModel && Array.isArray(parentModel) ? parentModel[0] : parentModel
                value = dataModel && dataModel[props.componentCfg.dataField]
            } else {
                value = props.componentCfg.fieldValue;
            }
            switch (props.componentCfg.format) {
                case 'bl':
                    if (value && /^\d+(\.\d+)?$/g.test(value)) {
                        value = Number((Number(value) * 100).toFixed(2)) + '%'
                    }
                    break;
                case 'thousands':
                    if (value && /^\d+(\.\d+)?$/g.test(value)) {
                        value = ('' + value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
                    }
                    break;
                case 'date':
                    value = dayjs(value).format(props.componentCfg.dateFormat)
                    break;
            }
            value = value && props.componentCfg.express && props.componentCfg.express.replace('{value}', value);
            label = value;
            return label
        })
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

        const style = computed<any>(() => {
            return {
                color: props.componentCfg.color,
                fontSize: `${props.componentCfg.fontSize}px`,
                fontWeight: props.componentCfg['font-weight'],
                backgroundColor: props.componentCfg.backgroundColor,
                justifyContent: props.componentCfg.horizontal,
                alignItems: props.componentCfg.vertical
            }
        })

        function onActiveChartHandler(item) {
            setActiveChart(item);
        }

        return {
            activeChartId,
            textValue,
            style,
            removeEchart,
            onActiveChartHandler
        }
    }
})
</script>

<style scoped lang="scss">
.text-wrap {
    background-color: #e6e6e6;
    position: relative;
    border-radius: 4px;
    height: 100%;
    width: 100%;
    border: 1px dashed transparent;
}
.text-item {
    width: 100%;
    height: 100%;
    display: flex;
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