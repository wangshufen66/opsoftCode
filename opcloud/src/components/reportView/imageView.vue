<template>
    <div class="image-wrap" :style="styleWrap">
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue';

export default defineComponent({
    name: 'image-view',
    props: {
        componentCfg: Object,
    },
    setup(props) {

        const current = getCurrentInstance();

        const parentDataModel = computed<any>(() => {
            const parent = current?.parent
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

        const styleWrap = computed<any>(() => {
            return {
                gridRowStart: `span ${props.componentCfg?.__config__.rowSpan}`,
                gridColumnStart: `span ${props.componentCfg?.__config__.colSpan}`,
                borderRadius: `${props.componentCfg?.borderRadius}px`,
                backgroundImage: `url(${imgSrc.value})`
            }
        })

        return {
            styleWrap,
            imgSrc,
        }
    }
})
</script>