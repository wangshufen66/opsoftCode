<template>
  <!-- 应用设计页面 -->
  <div class="appsset-container">
    <el-skeleton :loading="appLoading" animated>
      <template #template>
        <div class="skeleton-wrap app-item">
          <el-skeleton-item class="item-module" v-for="i in 7" />
        </div>
      </template>
      <template #default>
        <div class="app-item">
          <div
            class="item-module coverbg"
            v-for="(item,index) in homeItem.itemList"
            :key="index"
            @click="goAppsUpdate(item.id)"
            :style="{ backgroundImage: `url(${item.backgroundImagePath})` }"
          >
            <div
              class="name"
              :style="!item.backgroundImagePath && { backgroundColor: '#c5c5c5b7' } || {}"
            >{{ item.appName }}</div>
          </div>
          <div class="item-add" @click="goAppsUpdate('')">
            <img src="@/assets/images/icon-add.png" alt />
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { ElMessage } from "element-plus";
import { getAppListByDev } from "@/api/homeApi/index";

//app列表加载loading
const appLoading = ref<boolean>(false);

const router = useRouter();

// 页面整体对象
let homeItem = reactive({
  itemList: [],
});

// 分页器
const pageRequest = reactive({
  pageIndex: 1,
  pageSize: 1000,
});
// 查询应用列表
const getApps = () => {
  appLoading.value = true;
  let para = {
    isActive: 0,
    pageRequest: pageRequest,
  };

  getAppListByDev(para).then((res: any) => {
    appLoading.value = false;
    if (res.code == 200) {
      homeItem.itemList = res.data;
    }
  });
};

// 跳转模块编辑页
const goAppsUpdate = (value) => {
  router.push({
    path: "/systemset/appsupdate",
    query: {
      appid: value,
    },
  });
};
onMounted(() => {
  getApps();
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/appsset.scss";
</style>
