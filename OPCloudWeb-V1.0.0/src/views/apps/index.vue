<template>
  <!-- 模块 -->
  <div class="apps-container">
    <el-skeleton :loading="appLoading" animated :count="2">
      <template #template>
        <div class="skeleton-wrap">
          <el-skeleton-item
            class="skeleton-image"
            variant="image"
          ></el-skeleton-item>
          <el-skeleton-item class="skeleton-item" v-for="i in 4" />
        </div>
      </template>
      <template #default>
        <div
          class="container"
          v-for="(menu, index) in pageData.menuList"
          :key="index"
        >
          <el-container>
            <el-aside width="231px;">
              <div
                class="apps-left"
                :style="{ backgroundImage: `url(${menu.backgroundImagePath})` }"
              >
                {{ !!menu.isShowName ? menu.appName : "" }}
              </div>
            </el-aside>
            <el-main class="container-main">
              <div class="apps-right">
                <el-empty
                  v-if="!menu.models || menu.models.length === 0"
                  description="暂无模块"
                ></el-empty>
                <div
                  class="app-card"
                  v-for="item in menu.models"
                  :key="item.id"
                  @click="appviewClick(menu, item)"
                >
                  <div class="title">{{ item.modelName }}</div>
                </div>
              </div>
            </el-main>
          </el-container>
        </div>
      </template>
    </el-skeleton>
  </div>
  <el-backtop target=".apps-container"></el-backtop>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";

import { useRouter } from "vue-router";
import { getAppList } from "@/api/homeApi/index";

type pageData = {
  menuList: Array<{
    id: string | number;
    backgroundImagePath: string;
    isShowName: string | number;
    appName: string;
  }>;
};

const appLoading = ref<boolean>(false);
//页面菜单列表数据
let pageData = reactive<pageData>({
  menuList: [],
});
// 应用页面
const router = useRouter();

// 获取模块列表数据
const getApps = async () => {
  let para = {
    isActive: 1,
  };

  const res = await getAppList(para);
  if (res.code == 200) {
    pageData.menuList = res.data;
  }
  appLoading.value = false;
};

// 模块点击事件,跳转到详情
const appviewClick = (menu, item): void => {
  router.push({
    path: "/pages/moduledetaillist",
    query: {
      appid: menu.id,
      modelid: item.id,
    },
  });
};
onMounted(() => {
  appLoading.value = true;
  getApps();
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/apps.scss";
</style>
