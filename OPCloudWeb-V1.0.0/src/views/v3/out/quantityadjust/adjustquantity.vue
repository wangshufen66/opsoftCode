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

const activeIndex = ref<string>('1');

const paths = ref<any[]>([]);

const router = useRouter();
const route = useRoute();

const Menus = reactive([
  {
    key: 1,
    title: '开工数量调整',
    path: '/quantityadjust/productionstart',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 2,
    title: '汇报数量调整',
    path: '/quantityadjust/productionreport',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 3,
    title: '委外计划数量调整',
    path: '/quantityadjust/outpaln',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 4,
    title: '委外发出数量调整',
    path: '/quantityadjust/outsend',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 5,
    title: '委外接收数量调整',
    path: '/quantityadjust/outrecive',
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
  paths.value = [{ name: '数量调整' }, { name: path }];
  console.log(paths.value)
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
