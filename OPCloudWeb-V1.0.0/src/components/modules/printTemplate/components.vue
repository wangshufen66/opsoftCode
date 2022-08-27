<!-- 打印组件列表 -->
<template>
    <div class="print-components">
        <div
            class="component-item ep-draggable-item"
            v-for="item in components"
            :key="item.type"
            :tid="item.tid"
        >
            <i
                :class="item.icon.indexOf('el-') > -1 ? [`${item.icon}`] : ['opfont', `opicon-${item.icon}`]"
            ></i>
            {{ item.label }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { components } from '@/config/modules/system/printTemplate';


</script>

<style lang="scss" scoped>
@import "@/styles/modules/printTemplate/components.scss";
</style>