<template>
    <div class="app-left-container" :class="{ 'expand': layoutState?.menuExpand.value }">
        <div class="app-search" v-show="layoutState?.menuExpand.value">
            <el-input prefix-icon="el-icon-search" v-model="searchValue" />
        </div>
        <module-menu
            class="menus-wrap"
            :menus="menuLayout.menus"
            :active-index="menuLayout.activeMenu"
            @on-menu-click="onMenuClick"
        ></module-menu>
        <div class="bottom-logo">
            <img :src="bttomImage" :style="bottomLogoStyle" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import ModuleMenu from "@/components/moduleMenu/menus.vue";
import { getAppMenuList } from '@/api/homeApi';
import { MenuLayoutType } from "@/interfaces/enum";
import { getImageUrl, messageAlert } from '@/utils/utils';
import useLayout from '@/viewHooks/use-layout';

const { layoutState, menuLayout, menuClick, init: sysInit } = useLayout();

const searchValue = ref<string>('')

const activeIndex = ref<string>('0');

// 菜单容器栏宽度
const width = computed<string>(() => {
    return `${layoutState?.menuExpand.value && 272 || 64}px`;
})

const bottomLogoStyle = computed(() => {
    return {
        width: `${layoutState?.menuExpand.value && 110 || 40}px`,
        marginLeft: `${layoutState?.menuExpand.value && 0 || 12}px`
    }
})

const bttomImage = computed<string>(() => {
    return layoutState?.menuExpand.value ? getImageUrl('blogo.png') : getImageUrl('/logo-icon.png');
})

// 菜单点击
function onMenuClick(menu: any): void {
    menuClick(menu);
}

sysInit()

</script>

<style lang="scss" scoped>
.app-left-container {
    width: v-bind(width);
}
</style>