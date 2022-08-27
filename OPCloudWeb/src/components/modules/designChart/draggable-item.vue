<template>
    <template v-if="element.type === 'chart'">
        <chart-item :componentCfg="element"></chart-item>
    </template>
    <template v-else-if="element.type === 'container'">
        <container-drag :activeComponentId="activeChartId" :componentCfg="element"></container-drag>
    </template>
    <template v-else-if="element.type === 'card'">
        <card-drag :activeComponentId="activeChartId" :componentCfg="element"></card-drag>
    </template>
    <template v-else-if="element.type === 'image'">
        <image-drag :componentCfg="element"></image-drag>
    </template>
    <template v-else-if="element.type === 'text'">
        <text-drag :componentCfg="element"></text-drag>
    </template>
    <template v-else-if="element.type === 'table'">
        <table-drag :componentCfg="element"></table-drag>
    </template>
    <template v-else-if="element.type === 'tree'">
        <tree-drag :componentCfg="element"></tree-drag>
    </template>
</template>

<script lang="ts">
import { useActiveDesignChart, useDesignChart } from '@/use/useDesignChart';
import containerDrag from './container-drag.vue'
import cardDrag from './card-drag.vue'
import chartItem from './chartItem.vue'
import imageDrag from './image-drag.vue'
import textDrag from './text-drag.vue'
import tableDrag from './table-drag.vue'
import treeDrag from './tree-drag.vue'

export default {
    components: { chartItem, containerDrag, cardDrag, imageDrag, textDrag, tableDrag, treeDrag },
    props: {
        element: Object
    },
    setup(props) {
        const { removeEchart, copyComponent } = useDesignChart()
        const { activeChartId } = useActiveDesignChart();

        return {
            activeChartId,
            removeEchart,
            copyComponent
        }
    }
}
</script>