<template>
    <div class="tree-view-report" :style="style">
        <component
            class="desgin-report-tree"
            :is="componentCfg.componentTag"
            :component="componentCfg"
            :model="formData"
            @onNodeClick="onNodeClick"
        ></component>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, inject } from 'vue';
import { ReloadProvide } from './type';

export default defineComponent({
    name: 'tree-view',
    props: {
        componentCfg: Object,
    },
    setup(props) {

        const reload = inject<ReloadProvide>('reload', {} as ReloadProvide)

        const formData = reactive({})

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
        // 节点点击事件
        function onNodeClick(node: any) {
            reload && reload.reloadTreeRelData({
                chartId: props.componentCfg?.chartId,
                node
            })
        }


        return {
            style,
            formData,
            onNodeClick
        }
    }
})
</script>