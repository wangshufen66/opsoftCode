<template>
  <div class="app-left-container" :class="{ 'expand': layoutState?.menuExpand.value }">
    <div class="title">
      <img :src="bttomImage" :style="bottomLogoStyle" />
    </div>
    <div class="app-search" v-show="layoutState?.menuExpand.value">
      <el-autocomplete
        v-model="searchValue"
        value-key="title"
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        @select="handleSelect"
        clearable
      />
    </div>
    <module-menu
      class="menus-wrap"
      :menus="menuLayout.menus"
      :active-index="menuLayout.activeMenu"
      @on-menu-click="onMenuClick"
    ></module-menu>
    <div class="bottom-logo">
      <img :src="bttomImage" :style="bottomLogoStyle" />
      <span v-show="layoutState.menuExpand.value">V3.2</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
import ModuleMenu from "@/components/moduleMenu/menus.vue";
import { getAppMenuList } from '@/api/homeApi';
import { MenuLayoutType } from "@/interfaces/enum";
import { getImageUrl, messageAlert } from '@/utils/utils';
import useLayout from '@/viewHooks/use-layout';

const { layoutState, menuLayout, menuClick, searchMenu, init: sysInit } = useLayout();


const searchValue = ref<string>('')

const activeIndex = ref<string>('0');

// 菜单容器栏宽度
const width = computed<string>(() => {
  return `${layoutState?.menuExpand.value && 272 || 64}px`;
})

const bottomLogoStyle = computed(() => {
  return {
    width: `${layoutState?.menuExpand.value && 94 || 40}px`,
  }
})

const bttomImage = computed<string>(() => {
  return layoutState?.menuExpand.value ? getImageUrl('blogo.png') : getImageUrl('logo-icon.png');
})

// 菜单点击
function onMenuClick(menu: any): void {
  menuClick(menu);
}

/**
 * 菜单查询
 */
function queryMenus() {
  const currentMenus = menuLayout.value.menus;
  const resultMenus: any[] = [];
  const findMenus = (menulist: any[]) => {
    for (let i = 0; i < menulist.length; i++) {
      const node = menulist[i];
      if ((!node.children || node.children.length === 0) && node.title.indexOf(searchValue.value) > -1) {
        resultMenus.push(node);
      } else if (node.children && node.children.length > 0) {
        findMenus(node.children);
      }
    }
  }
  findMenus(currentMenus);
  return resultMenus;
}

function querySearch(queryString: string, cb: (arg: any) => void) {
  cb(queryMenus())
}
/**
 * 菜单选中
 */
function handleSelect(item: any) {
  menuClick(item);
}


sysInit()

</script>

<style lang="scss" scoped>
.app-left-container {
  width: v-bind(width);
}
</style>