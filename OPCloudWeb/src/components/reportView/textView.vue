<template>
    <div class="text-wrap" :style="styleWrap">
        <div class="text-item" :style="style">{{ textValue }}</div>
    </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import { defineComponent, computed, getCurrentInstance } from 'vue';

export default defineComponent({
    name: 'text-view',
    props: {
        componentCfg: Object,
    },
    setup(props) {

        const current = getCurrentInstance();

        const styleWrap = computed<any>(() => {
            return {
                gridRowStart: `span ${props.componentCfg?.__config__.rowSpan}`,
                gridColumnStart: `span ${props.componentCfg?.__config__.colSpan}`
            }
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

        // 
        const parentDataModel = computed<any>(() => {
            const parent = current?.parent
            // 父组件的数据源
            const parentModel = parent && parent?.props && parent?.props.componentCfg && parent?.props.componentCfg.dataSource
            if (parentModel) {
                props.componentCfg && (props.componentCfg.dataModel = Object.keys(Array.isArray(parentModel) ? parentModel[0] : parentModel))
            }
            return parentModel || undefined
        })
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

        return {
            styleWrap,
            style,
            textValue
        }
    }
})
</script>