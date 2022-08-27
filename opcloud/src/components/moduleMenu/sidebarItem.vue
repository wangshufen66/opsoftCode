<template>
  <template v-for="item in Menus">
    <template v-if="item.children && item.children.length > 0">
      <el-sub-menu class="module-submenu" :index="`${item.key}`" :key="item.key">
        <template #title>
          <el-icon v-if="level === 1">
            <component :is="item.icon || 'Menu'"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <sidebar-Item :Menus="item.children" :level="(level || 1) + 1"></sidebar-Item>
      </el-sub-menu>
    </template>
    <template v-else>
      <el-menu-item
        :class="{ 'menu-item-leaf': level && level > 1 }"
        :index="`${item.key}`"
        :key="item.key"
        @click="onMenuItemClick(item)"
      >
        <el-icon v-if="level === 1">
          <component :is="item.icon || 'Menu'"></component>
        </el-icon>
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
    level: Number,
    Menus: {
      type: Array as PropType<Array<Menus> | undefined>,
      required: true,
    },
  },
  emits: ['onMenuItemClick'],
  setup() {
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
.menu-item-leaf {
  background-color: var(--menu-leaf-bgcolor);
}
</style>