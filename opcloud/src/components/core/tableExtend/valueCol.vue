<template>
    <template v-if="column?.disPlayedValue != undefined">
        <template v-if="!rowHasPenetrate(colCfg.prop)">{{ column?.disPlayedValue }}</template>
        <template v-else>
            <span
                class="has-more"
                @click="columnItemClick(row, colCfg.prop)"
            >{{ column?.disPlayedValue }}</span>
        </template>
    </template>
    <template v-else>
        <template v-if="!rowHasPenetrate(colCfg.prop)">{{ row[colCfg.prop] }}</template>
        <template v-else>
            <span class="has-more" @click="columnItemClick(row, colCfg.prop)">{{ column }}</span>
        </template>
    </template>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import useProvies from "./useProvies";

const { columnItemClick, rowHasPenetrate } = useProvies();

const props = defineProps({
    row: {
        type: Object,
        default: () => { }
    },
    colCfg: {
        type: Object,
        default: () => { }
    }
})

const column = computed(() => {
    const { row, colCfg } = props
    return row[colCfg.prop]
})

</script>