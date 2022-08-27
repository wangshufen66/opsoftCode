<template>
  <div class="workflow-set">
    <div class="container">
      <div class="left-container">
        <module-menu :menus="Menus" :activeIndex="activeIndex" @onMenuClick="onMenuClick"></module-menu>
      </div>
      <div class="right-wrap">
        <div class="right-header">
          <menu-header :paths="paths"></menu-header>
        </div>
        <div class="right-container">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import moduleMenu from '@/components/moduleMenu/menus.vue';

const router = useRouter();
const route = useRoute();

const activeIndex = ref<string>('1');

const paths = ref<any[]>([]);

const Menus = reactive([
  {
    key: 1,
    title: '个人信息管理',
    path: '/personal/infoMange',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 2,
    title: '修改密码',
    path: '/personal/changePwd',
    icon: 'opfont opiconxty-caidanlan1',
  },
]);

watch(
  () => route.path,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      setActiveMenu();
    }
  },
  {
    immediate: true,
  }
);

function onMenuClick(menu) {
  router.push({
    path: menu.path
  });
  setBreadcrumb(menu.title);
  activeIndex.value = `${menu.key}`;
}

function setBreadcrumb(path: string) {
  paths.value = [{ name: '个人中心' }, { name: path }];
}

function setActiveMenu() {
  const routePath = route.path;
  for (let i = 0; i < Menus.length; i++) {
    if (Menus[i].path === routePath) {
      activeIndex.value = `${Menus[i].key}`;
      setBreadcrumb(Menus[i].title);
      return;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/workflow/workflowset.scss";
</style>
