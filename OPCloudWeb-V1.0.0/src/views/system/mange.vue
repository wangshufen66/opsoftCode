<template>
  <div class="workflow-set">
    <div class="container">
      <div class="left-container">
        <module-menu :menus="tabList.tabList" :activeIndex="activeIndex" @onMenuClick="onTabClick"></module-menu>
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
import tableList from '@/config/modules/system/menus';
import { getStorage } from '@/utils/utils';

const router = useRouter();
const route = useRoute();
const activeIndex = ref<string>('1');
const currentTab = ref<string>('租户中心');

const paths = ref<any[]>([]);

// 菜单点击
const onTabClick = (item) => {
  router.push(item.path);
  setBreadcrumb(item.title);
  activeIndex.value = `${item.key}`;
};

const tabList = reactive({
  tabList: [] as any,
});

watch(
  () => route.path,
  (newVal, oldVal) => {
    // if (newVal != oldVal && newVal === '/systemset/mange') {
    initPage();
    // }
  }
);

function setBreadcrumb(path: string) {
  paths.value = [{ name: '系统设置', path: '/systemset/mange' }, { name: path }];
}

function initMenuTitle(tableList: any[], titlelist: any[]) {
  const routePath = route.path;
  for (let i = 0; i < tableList.length; i++) {
    if (tableList[i].path === routePath) {
      activeIndex.value = `${tableList[i].key}`;
      titlelist.push({ name: tableList[i].title });
      return;
    }
    if (tableList[i].children && tableList[i].children.length > 0) {
      initMenuTitle(tableList[i].children, titlelist);
    }
  }
}
function initPage() {
  const titlelist: any[] = [];
  let menus: any = []
  const userInfo = getStorage('user')
  if (userInfo.value.orgId == '000') {
    menus = tableList;
    route.path === '/systemset/mange' && router.push('/systemset/mange/tenant');
  } else {
    menus = tableList.filter((item, index) => {
      return item.key != 1;
    });
    route.path === '/systemset/mange' && router.push('/systemset/mange/role');
  }
  tabList.tabList = menus
  initMenuTitle(tabList.tabList, titlelist);
  paths.value = [{ name: '系统设置', path: '/systemset/mange' }, ...titlelist];
}
// vue生命周期赋值当前选中的tab
onBeforeMount((): void => {
  initPage();
});

</script>

<style lang="scss" scoped>
@import "@/styles/modules/workflow/workflowset.scss";
</style>
