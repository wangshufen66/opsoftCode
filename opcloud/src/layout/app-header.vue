<template>
  <header class="app-header">
    <header-menu :paths="menuLayout.paths"></header-menu>
    <div class="rigth-wrap">
      <div class="system-menu" v-if="hasSystemMenu">
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
            <el-dropdown-item @click="onPersonal">个人中心</el-dropdown-item>
            <el-dropdown-item @click="onLoginOut">退出</el-dropdown-item>
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
import { getStorage } from '@/shared/utils/utils';
import useLayout from '@/hooks/use-layout';
import { MenuLayoutType } from '@/shared/enum';
import HeaderMenu from '@/components/moduleMenu/header.vue';
import { vPermission } from '@/directives/index';

const router = useRouter();
const store = useStore();

const { layoutState, menuLayout, userMenus, systemMenuChange } = useLayout();

const nickName = ref<string>('');

/**是否包含系统菜单 */
const hasSystemMenu = computed(() => {
  const menusList = userMenus.value;
  return menusList && menusList["0"] && menusList["0"].length > 0
})

// 个人中心
function onPersonal() {
  router.push('/personal');
};

//  退出登录
function onLoginOut() {
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
