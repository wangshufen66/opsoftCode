<template>
  <div class="app-container default-theme">
    <app-left></app-left>
    <div class="layout-container">
      <app-header></app-header>
      <app-main></app-main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, provide, computed } from "vue"
import { useStore } from 'vuex';
import AppHeader from '@/layout/app-header.vue';
import AppLeft from '@/layout/app-left.vue';
import AppMain from '@/layout/app-main.vue';
import useEitter from '@/hooks/use-core/useMitt';
import useRouter from "@/hooks/use-router";
import useWaterMark from "@/hooks/use-waterMark";
import { MenuLayoutType } from "@/shared/enum";
import type { LayoutState } from "@/shared/type";
import { getAppMenuList } from "@/api/homeApi";

const menuType = ref<MenuLayoutType>(MenuLayoutType.APPS_MENUS);

const store = useStore();

const { createWaterMark, removeWatermark } = useWaterMark()

useEitter([{ key: "create-page-watermark", value: initWaterMark }])

// 菜单栏状态
const menuExpand = computed<boolean>({
  get() {
    return store.state.comm.menuExpand;
  }, set(value) {
    store.commit('comm/setMenuExpand', value);
  }
})

const initComplete = computed<boolean>(() => {
  return store.state.comm.appInitComplete;
})

const pageTabs = ref<any[]>([])

provide<LayoutState>('layout', {
  menuType: menuType,
  menuExpand: menuExpand,
  pageTabList: pageTabs,
  initComplete: initComplete
})

// 初始化系统资源
async function initResource() {
  // 加载用户菜单
  const res = await getAppMenuList();
  if (res.code == 200) {
    const resData = res.data;
    // 缓存用户菜单
    store.commit("comm/setUserMenus", resData);
    // 根据用户菜单设置路由
    const { initRoute } = useRouter(store.state.comm.userMenus);
    initRoute()
  }
  store.commit("comm/setAppInitComplete", true);
}

function initWaterMark(markCfg: any): void {
  // 调用接口查询配置
  if (!markCfg) {

  } else {
    if (markCfg.isHidden === 0) {
      createWaterMark('.app-container', markCfg.title, markCfg.content, markCfg.color)
    } else {
      removeWatermark()
    }
  }
}

// 初始化路由
!initComplete.value && initResource();

</script>

<style lang="scss">
@import "@/styles/modules/index.scss";
</style>
