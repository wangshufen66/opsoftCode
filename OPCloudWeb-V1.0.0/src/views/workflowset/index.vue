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
import { reactive, ref, onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import moduleMenu from '@/components/moduleMenu/menus.vue';

const activeIndex = ref<string>('1');

const paths = ref<any[]>([]);

const router = useRouter();
const route = useRoute();

const Menus = reactive([
  {
    key: 1,
    title: '模型管理',
    path: '/systemset/workflowset/model',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 2,
    title: '定义管理',
    path: '/systemset/workflowset/validlist',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 3,
    title: '运行中的流程',
    path: '/systemset/workflowset/runlist',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 4,
    title: '发起流程',
    path: '/systemset/workflowset/startProcess',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 5,
    title: '我的待办',
    path: '/systemset/workflowset/taskToDo',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 6,
    title: '我的已办',
    path: '/systemset/workflowset/taskDone',
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
  let navs: any = [
    { name: '系统设置', path: '/systemset/mange' },
    { name: '工作流设置', path: `/systemset/workflowset` }
  ]
  navs.push({ name: path })
  paths.value = navs
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
