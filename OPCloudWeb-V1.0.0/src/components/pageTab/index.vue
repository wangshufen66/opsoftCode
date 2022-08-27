<template>
    <div class="page-tabs-container">
        <el-tabs v-model="activeName" @tab-click="onTabClick" @tab-remove="onTabRemove">
            <el-tab-pane
                class="tab-panel-wrap"
                v-for="(tab,index) in tabs"
                :key="tab.name"
                v-bind="tab"
                :closable="index !== 0"
            ></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import type { PropType } from 'vue';
import type { Tab } from './type';

const props = defineProps({
    activeName: String,
    tabs: Object as PropType<Tab[]>
});

const emit = defineEmits(['onTabClick', 'onTabRemove'])

function onTabClick(tab: any): void {
    emit('onTabClick', tab.props)
}

function onTabRemove(name: string) {
    emit('onTabRemove', name)
}

</script>

<style lang="scss">
@import "@/styles/components/tab-page.scss";
</style>