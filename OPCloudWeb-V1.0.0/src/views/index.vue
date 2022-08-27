<template>
  <div class="app-container">
    <app-left></app-left>
    <div class="layout-container">
      <app-header></app-header>
      <app-main></app-main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, provide, computed } from "vue"
// saveHomePageConfig,saveHomePageConfig
import { saveWaterMark, updateWaterMark, } from '@/api/system';
import { useStore } from 'vuex';
import useEitter from '@/use/useEitter';
import { useAppGlobal } from '@/use/useAppGlobal'
import AppHeader from '@/layout/app-header.vue';
import AppLeft from '@/layout/app-left.vue';
import AppMain from '@/layout/app-main.vue';
import { MenuLayoutType } from "@/interfaces/enum";
import type { LayoutState } from "@/interfaces/type";

// 全局事件定义
useEitter([{ key: "on-water-set", value: submit }]);
//全局定义首页配置
useEitter([{ key: "on-homePageConfig-set", value: submithomePage }]);


const { drawSystemWater, refreshUserToken } = useAppGlobal();

const menuType = ref<MenuLayoutType>(MenuLayoutType.APPS_MENUS);

const store = useStore();

// 菜单栏状态
const menuExpand = computed<boolean>({
  get() {
    return store.state.comm.menuExpand;
  }, set(value) {
    store.commit('comm/setMenuExpand', value);
  }
})

const pageTabs = ref<any[]>([])

provide<LayoutState>('layout', {
  menuType: menuType,
  menuExpand: menuExpand,
  pageTabList: pageTabs
})

async function submit(params) {
  const res: any = params.id
    ? await updateWaterMark(params)
    : await saveWaterMark(params);
  if (res.code == 200) {
    drawSystemWater();
  };
}
//首页配置
async function submithomePage(params) {
  // const res: any = params.id
  //   ? await updateHomePageConfig(params)
  //   : await saveHomePageConfig(params);
  // if (res.code == 200) {
  //   drawSystemWater();
  // };
}

// drawSystemWater();

// 刷新token功能
// refreshUserToken();

</script>

<style lang="scss">
@import "@/styles/modules/index.scss";
</style>
