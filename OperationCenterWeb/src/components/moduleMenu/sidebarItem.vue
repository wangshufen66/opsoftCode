<template>
  <template v-for="item in Menus">
    <template v-if="item.children && item.children.length > 0">
      <el-submenu class="module-submenu" :index="`${item.key}`" :key="item.key">
        <template #title>
          <i :class="item.icon || 'el-icon-menu'"></i>
          <span>{{ item.title }}</span>
        </template>
        <sidebar-Item :Menus="item.children"></sidebar-Item>
      </el-submenu>
    </template>
    <template v-else>
      <el-menu-item
        class="module-menu-item"
        :index="`${item.key}`"
        :key="item.key"
        @click="onMenuItemClick(item)"
      >
        <i :class="item.icon || 'el-icon-menu'"></i>
        <template #title>
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType, inject } from 'vue';
import { BaseMenuProvide, Menus } from './type';

export default defineComponent({
  name: 'SidebarItem',
  props: {
    Menus: {
      type: Array as PropType<Array<Menus>>,
      required: true,
    },
  },
  emits: ['onMenuItemClick'],
  setup(props, { emit }) {
    const baseMenu = inject<BaseMenuProvide>('baseMenu');

    function onMenuItemClick(item: Menus): void {
      baseMenu?.onMenuClickHandler(item);
    }

    return {
      onMenuItemClick,
    };
  },
});
</script>

<style lang="scss">
.module-submenu,
.module-menu-item {
  position: relative;
  font-size: 14px;
  font-weight: 400;
  color: #585858;
  .el-submenu__title {
    height: 46px;
    line-height: 46px;
    font-size: 14px;
  }
  i:not(.el-submenu__icon-arrow) {
    font-size: 18px;
    margin-right: 8px;
  }
  &::before {
    content: "";
    height: 100%;
    width: 2px;
    margin-right: 22px;
    transition: background-color 0.3s;
    position: absolute;
    left: 0;
  }
}
.module-menu-item {
  height: 50px;
  line-height: 46px;
  &.is-active {
    background-color: #1890ff !important;
    color: #fff;
  }
}
</style>