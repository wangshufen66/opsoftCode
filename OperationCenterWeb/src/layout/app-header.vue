<template>
  <header class="app-header">
    <div class="main-menu">
      <el-menu :default-active="state.activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item
          :index="`${i}`"
          v-for="(item, i) in state.menus"
          :key="i"
          @click="menuItemClick(item, i)"
        >
          <i :class="`${item.icon}`" class="opfont"></i>
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="rigth-wrap">
      <el-dropdown>
        <span>
          <i class="el-icon-user"></i>
          <span class="user-name">{{ nickName }}</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <span class="language">
          <i class="opfont opiconxty-yuyan" style="font-size: 22px"></i>
          <span>中文(简体)</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>繁体</el-dropdown-item>
            <el-dropdown-item>English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { reactive, watch, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { getStorage } from '@/utils/utils';
import { setToken } from '@/utils/utils';
import useEitter from '@/use/useEitter';

const state = reactive({
  activeIndex: '0',
  menus: [

  ],
});

const router = useRouter();
const route = useRoute();
const store = useStore();

const menuItemClick = (item) => {
  router.push(item.path);
};

// 登出
const personalJumper = () => {
  router.push('/personal');
};
const loginOut = () => {
  // store.dispatch('auth/loginOut');
  router.replace('/login');
};
const nickName = ref<string>('');
nickName.value = getStorage('nickName');

</script>

<style lang="scss" scoped>
@import "@/styles/modules/index.scss";
</style>

