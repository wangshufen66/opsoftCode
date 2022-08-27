<template>
  <header class="app-header" v-permission="'44344fsdfsdfsd'">
    <header-menu :paths="menuLayout.paths"></header-menu>
    <div class="rigth-wrap">
      <div class="system-menu">
        <i
          :class="['opfont', layoutState?.menuType.value === MenuLayoutType.APPS_MENUS ? 'opicon-tool-setting' : 'opicon-menu-group']"
          :title="layoutState?.menuType.value === MenuLayoutType.APPS_MENUS ? '系统菜单' : '应用菜单'"
          @click="onMenuChange"
        ></i>
      </div>
      <div class="helperCenter">
        <a target="_blank" href="/document/operation.html">
          <i class="opfont opicon-help-doc" title="帮助文档"></i>
        </a>
      </div>
      <div class="system-message">
        <i class="opfont opicon-message" title="消息中心"></i>
      </div>
      <el-dropdown>
        <span class="user-wrap">
          <i class="opfont opicon-user"></i>
          <span class="user-name">{{ nickName }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="personalJumper">个人中心</el-dropdown-item>
            <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { reactive, watch, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getPersonalInfo } from '@/api/system';
import { getStorage } from '@/utils/utils';
import useLayout from '@/viewHooks/use-layout';
import { MenuLayoutType } from '@/interfaces/enum';
import HeaderMenu from '@/components/moduleMenu/header.vue';
import { vPermission } from '@/directives/index';

const router = useRouter();
const store = useStore();

const { layoutState, menuLayout, systemMenuChange } = useLayout();

const nickName = ref<string>('');

// 登出
const personalJumper = () => {
  router.push('/personal');
};
const loginOut = () => {
  store.dispatch('auth/loginOut');
  router.replace('/login');
};

/**菜单切换 */
function onMenuChange() {
  if (layoutState) {
    layoutState.menuType.value = layoutState?.menuType.value === MenuLayoutType.APPS_MENUS ?
      MenuLayoutType.SYSTEM_MENUS : MenuLayoutType.APPS_MENUS
    systemMenuChange()
  }
}

nickName.value = getStorage('nickName');
</script>
