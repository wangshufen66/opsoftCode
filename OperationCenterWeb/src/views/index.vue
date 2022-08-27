<template>
  <div class="app-container">
    <div class="left-container">
      <module-menu :menus="tabList.tabList" :activeIndex="activeIndex" @onMenuClick="onTabClick"></module-menu>
    </div>
    <div class="layout-container">
      <app-header></app-header>
      <app-main></app-main>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref, onBeforeMount, watch } from 'vue';
import appHeader from '@/layout/app-header.vue';
import appMain from '@/layout/app-main.vue';
import moduleMenu from '@/components/moduleMenu/menus.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import tableList from '@/config/component/systemconfig';
const router = useRouter();
const route = useRoute();
const store = useStore();
const activeIndex = ref<any>('0');
const tabList = reactive({
  tabList: [] as any,
});
const paths = ref<string[]>([]);
// 菜单点击
const onTabClick = (item) => {
  router.push(item.path);
  activeIndex.value = `${item.key}`;
};
function initMenuTitle(tableList: any[], titlelist: any[]) {
  const routePath = route.path;
  for (let i = 0; i < tableList.length; i++) {
    if (tableList[i].path === routePath) {
      activeIndex.value = `${tableList[i].key}`;
      titlelist.push(tableList[i].title);
      return;
    }
    if (tableList[i].children && tableList[i].children.length > 0) {
      initMenuTitle(tableList[i].children, titlelist);
    }
  }
}

function initPage() {
  const titlelist: any[] = [];
  tabList.tabList = tableList;
  initMenuTitle(tabList.tabList, titlelist);
  
  //面包屑菜单名称处理
  let newpaths = []
  tableList.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((ele) => {
        if (ele.children && ele.children.length > 0) {
          ele.children.forEach(el => {
            if (el.title === titlelist[0]) {
              newpaths = []
              newpaths.push({ name: item.title }, { name: ele.title }, { name: titlelist[0] })
            }
          })
        } else {
          if (ele.title === titlelist[0]) {
            newpaths = []
            newpaths.push({ name: item.title }, { name: titlelist[0] })
          }
        }
      })
    } else {
      newpaths = []
      newpaths.push({ name: item.title });
    }
  })
  paths.value = newpaths

}

// vue生命周期赋值当前选中的tab
onBeforeMount((): void => {
  initPage();
});

watch(
  () => route.path,
  (newVal, oldVal) => {
    initPage();
  }
);
</script>
  
<style lang="scss">
@import "@/styles/modules/index.scss";
</style>
  