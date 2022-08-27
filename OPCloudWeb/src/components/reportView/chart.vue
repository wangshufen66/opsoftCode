<template>
    <div class="chart-item-wrap" :style="style">
        <div class="title" v-show="componentCfg?.__config__.label">
            <div class="line"></div>
            {{ componentCfg?.__config__.label }}
            <div class="more" v-if="componentCfg?.__config__.isDetail" @click="onMoreClick">more>></div>
        </div>
        <div :id="`chart_${componentCfg?.chartId}`" class="chart-item"></div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'chart-view',
    props: {
        componentCfg: Object,
    },
    emits: ['onMore'],
    setup(props, { emit }) {

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
        });

        /**
         * 详情
         */
        function onMoreClick() {
            const { detailParams } = props.componentCfg?.__config__;
            emit("onMore", detailParams)
        }

        return {
            style,
            onMoreClick
        }
    }
})
</script>