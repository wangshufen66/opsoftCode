<template>
    <div class="card-view-wrap" :style="style">
        <template v-for="element in componentCfg.children" :key="element.chartId">
            <text-view v-if="element.type === 'text'" :componentCfg="element"></text-view>
            <image-view v-else-if="element.type === 'image'" :componentCfg="element"></image-view>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import textView from './textView.vue';
import imageView from './imageView.vue';

export default defineComponent({
    name: 'cardView',
    components: { textView, imageView },
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

        const backgroundColor = computed<string>(() => {
            return props.componentCfg?.backgroundColor;
        });

        const style = computed(() => {
            return {
                gridTemplateColumns: gridTemplateColumns.value,
                gridTemplateRows: gridTemplateRows.value,
                gridRowStart: gridRowStart.value,
                gridColumnStart: gridColumnStart.value,
                gap: gap.value,
                backgroundColor: backgroundColor.value,
                backgroundImage: `url(${props.componentCfg?.backgroundImage})`
            };
        });

        return {
            style
        }
    }
})
</script>