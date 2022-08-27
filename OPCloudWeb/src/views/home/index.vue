<template>
  <div class="home-container" id="home-container">
    <div class="item item-apps">
      <div class="card-item-title">应用模块</div>
      <el-skeleton :loading="itemloading" animated :count="8" class="app-items">
        <template #template>
          <div class="item-module">
            <el-skeleton-item class="item-img coverbg" />
            <el-skeleton-item class="name" />
          </div>
        </template>
        <template #default>
          <div class="app-items">
            <div
              class="item-module"
              v-for="item in homeItem.itemList"
              :key="item.id"
              @click="openAppPage(item.id)"
            >
              <div
                class="item-img coverbg"
                :style="{
                  backgroundImage: `url(${item.backgroundImagePath})`,
                }"
              ></div>
              <div class="name">{{ !!item.isShowName ? item.appName : '' }}</div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
    <div class="item item-msg-list">
      <div class="card-item-title">消息通知</div>
      <el-skeleton :loading="newsloading" animated :count="3">
        <template #template>
          <div class="right-news">
            <div class="news-icon">
              <el-skeleton-item class="icon" />
            </div>
            <div class="news-text skeleton-item">
              <el-skeleton-item class="news-desc skeleton-item" />
              <el-skeleton-item class="news-date skeleton-item" />
            </div>
          </div>
        </template>
        <template #default>
          <div class="new-list">
            <div
              class="right-news"
              v-for="(newsItem, i) in homeItem.newsList"
              :key="i"
              @click="goNewListDetail(newsItem.id)"
            >
              <div class="news-text">
                <div class="text-desc">{{ newsItem.messageContent }}</div>
                <div class="news-date">{{ newsItem.createTime }}</div>
              </div>
            </div>
          </div>
          <div class="news-more" @click="goNewListDetail('')">查看更多</div>
        </template>
      </el-skeleton>
    </div>
    <div class="item report-view">
      <div class="card-item-title">数据统计</div>
      <iframe
        class="report-page"
        src="http://124.70.106.26:51980/dashboards/view/067eecef-039a-44ce-bc37-06e739384f31?theme=default&lng=zh&token=292b33abb1269666abd05fc241ed636765f2467839fac5c8bc3d340fca89484a"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject } from "vue";
import { useRouter } from "vue-router";
import { getHomepage, getAppList, getNewsPublish } from "@/api/homeApi/index";
import { useStore } from "vuex";
import type { LayoutState } from "@/interfaces/type";
import { messageAlert } from "@/utils/utils";

type homeItem = {
  itemList: Array<{
    id: string | number;
    backgroundImagePath: string;
    isShowName: string | number;
    appName: string;
  }>;
  newsList: any[];
};

const store = useStore();

const router = useRouter();

const layoutState = inject<LayoutState>("layout");

// 应用列表loading
const itemloading = ref<boolean>(false);
// 消息loading
const newsloading = ref<boolean>(false);

// 页面整体对象
let homeItem = reactive<homeItem>({
  itemList: [],
  newsList: [],
});
// 查询应用列表
const getApps = () => {
  itemloading.value = true;
  let para = {
    isActive: 1,
  };
  getHomepage(para)
    .then((res: any) => {
      itemloading.value = false;
      if (res.code == 200) {
        homeItem.itemList = res.data;
      }
    })
    .catch(() => {
      itemloading.value = false;
    });
};

function goNewListDetail(value) {
  router.push({
    path: "/systemset/news/newDetail",
    query: {
      id: value,
    },
  });
}

// 跳转模块编辑页
const openAppPage = (value) => {
  /**菜单结构数据 */
  const menuLayout: any = store.state.comm.menuLayout;
  console.log('menus', menuLayout.menus)
  const app = menuLayout.menus.find(f => f.key === value);
  const page = app.children[0] && app.children[0].children && app.children[0].children[0];
  if (!page) {
    messageAlert("error", "该应用下未包含任何模块页面！");
    return;
  }
  menuLayout.paths = page.pathName.split("_").map((m) => ({ name: m }));
  menuLayout.activeMenu = page.key;
  const pageRoute = `/application/${page.key.replace(/_/g, '/')}`
  router.push(pageRoute);
  if (layoutState) {
    const has = layoutState.pageTabList.value.findIndex(f => f.name === page.key) > -1;
    if (!has) {
      layoutState.pageTabList.value.push({
        label: page.title,
        name: page.key,
        path: pageRoute,
      })
    }
  }
  store.commit("comm/setActivePageTab", page.key);
};

const getNews = () => {
  newsloading.value = true;
  let para = {
    current_page: 1,
    page_size: 4,
  };
  getNewsPublish(para)
    .then((res: any) => {
      newsloading.value = false;
      if (res.code == 200) {
        homeItem.newsList = res.data.records;
      }
    })
    .catch(() => {
      newsloading.value = false;
    });
};

getApps();
getNews();

</script>

<style lang="scss" scoped>
@import "@/styles/modules/home.scss";
</style>
