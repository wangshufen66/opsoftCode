<!-- 主从表表单 -->
<template>
    <el-tabs v-model="currentTab">
        <el-tab-pane
            :label="tabOption.label"
            :name="tabOption.id"
            v-for="tabOption in tabOptions"
            :key="tabOption.id"
        ></el-tab-pane>
    </el-tabs>
    <template>

    </template>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';

type TabOption = {
    id: number | string;
    label: string;
}

const props = defineProps({
    tabOptions: Array as PropType<TabOption[]>,
});

const currentTab = ref<string>('');




</script>
