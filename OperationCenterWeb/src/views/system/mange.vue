 <template>
  <div class="overall-layout">
    <div class="container">
      <div class="left-container">
        <!-- @onMenuClick="onTabClick" -->
        <!-- <module-menu :menus="tableList" :activeIndex="activeIndex" @onMenuClick="onTabClick"></module-menu> -->
        <module-menu :menus="tabList.tabList" :activeIndex="activeIndex" @onMenuClick="onTabClick"></module-menu>
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
import { reactive, ref, onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import menuHeader from '@/components/moduleMenu/header.vue';
import moduleMenu from '@/components/moduleMenu/menus.vue';
import tableList from '@/config/component/systemconfig';

import { useStore } from 'vuex';
const router = useRouter();
const route = useRoute();
const store = useStore();
const activeIndex = ref<string>('4');


const paths = ref<string[]>([]);

// 菜单点击
const onTabClick = (item) => {
  router.push(item.path);

  activeIndex.value = `${item.key}`;
};

// const user = getStorage('user')
// const menu = user.value.menus
// console.log(menu)
// let tableList = menu.map(i => {
// let p = '/systemset/mange/';
//   return {
//     key: i.id,
//     icon: i.id == 1 ? 'opfont opicon-a-' + 'lujing1' : i.id == 3 ? 'opfont opicon-a-' + 'zu2' : i.id == 4 ? 'opfont opicon-a-' + 'lujing3' : '',
//     title: i.data.permissionName,
//     children: i.children.map(m => {
//       return {
//         key: m.id,
//         path: m.label == '注册用户' ? '/systemset/mange/tenant' : m.label == '成交列表' ? '/systemset/mange/transactionList' : m.label == '线索管理' ? '/systemset/mange/clueManagement' : m.label == '启动页配置' ? '/systemset/mange/startupPageConfig' : m.label == '消息中心' ? '/systemset/mange/new' : m.label == '角色管理' ? '/systemset/mange/roleManage' : m.label == '员工管理' ? '/systemset/mange/staffManage' : m.label == '更新密码' ? '/systemset/mange/changePwd' : ''
//       }

const tabList = reactive({
  tabList: [] as any,
});

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
    item.children.forEach((ele) => {
      if (ele.title === titlelist[0]) {
        newpaths.push({ name: item.title }, { name: titlelist[0] })

      }
    })
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

<style lang="scss" scoped>
@import "@/styles/modules/system/overall-layout.scss";
</style> 
