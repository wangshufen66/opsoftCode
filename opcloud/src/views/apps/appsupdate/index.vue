<template>
  <div class="workflow-set">
    <div class="container">
      <div class="left-container">
        <module-menu :menus="Menus" :activeIndex="activeIndex" @onMenuClick="onMenuClick"></module-menu>
      </div>
      <div class="right-wrap">
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
    title: '应用管理',
    path: '/systemset/appsupdate/appdetail',
    icon: 'opfont opiconxty-caidanlan1',
  },
  {
    key: 2,
    title: '模块管理',
    path: '/systemset/appsupdate/modellist',
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

function setActiveMenu() {
  const routePath = route.path;
  for (let i = 0; i < Menus.length; i++) {
    if (Menus[i].path === routePath) {
      activeIndex.value = `${Menus[i].key}`;
      setBreadcrumb(Menus[i].title);
      return;
    }
    if (i === Menus.length - 1) {
      activeIndex.value = '2';
      setBreadcrumb('应用列表', 1);
    }
  }
}

function setBreadcrumb(path: string, type: number = 0) {
  let navs: any = [
    { name: '系统设置', path: '/systemset/mange' },
    { name: '应用开发', path: `/systemset/mange/appsset` }
  ]
  if (type === 0) {
    navs.push({ name: path })
  } else {
    navs = [
      ...navs,
      ...[
        { name: '模块管理', path: `/systemset/appsupdate/modellist?appid=${route.query.appid}` },
        { name: '应用列表' }
      ]
    ]
  }
  paths.value = navs
}

function onMenuClick(menu) {
  router.push({
    path: menu.path,
    query: {
      appid: route.query.appid,
    },
  });
  setBreadcrumb(menu.title);
  activeIndex.value = `${menu.key}`;
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/workflow/workflowset.scss";
</style>
