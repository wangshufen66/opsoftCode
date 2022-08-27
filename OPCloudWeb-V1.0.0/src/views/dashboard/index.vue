<template>
  <div class="workflow-set">
    <div class="container">
      <div class="left-container">
        <module-menu :menus="Menus" :activeIndex="activeIndex" @onMenuClick="onMenuClick"></module-menu>
      </div>
      <div class="right-wrap">
        <div class="right-header">
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

const activeIndex = ref<string>('1');

const paths = ref<any[]>([]);

const router = useRouter();
const route = useRoute();

const Menus = reactive([
  {
    key: 1,
    title: '设计列表',
    path: '/systemset/dashboard/dashboardList',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 2,
    title: '大屏设计',
    path: '/systemset/dashboard/dashboardDesign',
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

function setBreadcrumb(path: string) {
  paths.value = [{ name: '大屏设计器', path: '/systemset/dashboard' }, { name: path }];
}

function onMenuClick(menu) {
  router.push(menu.path);
  setBreadcrumb(menu.title);
  activeIndex.value = `${menu.key}`;
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
