<template>
    <div class="table-view-report" :style="style">
        <div class="title" v-show="componentCfg?.__config__.label">
            <div class="line"></div>
            {{ componentCfg?.__config__.label }}
        </div>
        <component
            class="desgin-report-table"
            :is="componentCfg.componentTag"
            :component="componentCfg"
        ></component>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'table-view',
    props: {
        componentCfg: Object,
    },
    setup(props) {

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


        return {
            style
        }
    }
})
</script>