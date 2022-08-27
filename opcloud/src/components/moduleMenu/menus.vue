<template>
  <div class="module-menus">
    <el-menu
      class="sidebar-menu-wrap"
      :default-active="activeIndex"
      :unique-opened="true"
      :collapse="!menuExpand"
    >
      <sidebar-item :Menus="menus" :level="1"></sidebar-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { provide, computed } from 'vue';
import type { PropType } from 'vue';
import { useStore } from 'vuex';
import SidebarItem from './sidebarItem.vue';
import type { BaseMenuProvide, Menus } from './type';

const props = defineProps({
  activeIndex: {
    type: String,
    default: '0',
  },
  menus: Array as PropType<Array<Menus>>,
})

const emit = defineEmits(['onMenuClick'])

provide<BaseMenuProvide>('baseMenu', { onMenuClickHandler });

const store = useStore();

// 菜单栏状态
const menuExpand = computed<boolean>({
  get() {
    return store.state.comm.menuExpand;
  }, set(value) {
    store.commit('comm/setMenuExpand', value);
  }
})

function onMenuClickHandler(menu: Menus) {
  emit('onMenuClick', menu);
}
</script>

<style lang="scss">
.module-menus {
  .el-menu-item {
    i {
      margin-right: 10px;
    }
  }
  .sidebar-menu-wrap {
    border-right: none;
  }
}
</style>
