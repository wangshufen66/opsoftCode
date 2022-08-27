<template>
  <div class="module-menus" :style="collapse ? '' : { width: `${width}px` }">
    <div class="left-wrap">
      <div class="logo" :class="[!collapse ? 'collapse1' : 'collapse2']">
        <img src="@/assets/images/logo-home.png" />
      </div>
      <div v-show="!collapse" class="title">运营管理平台</div>
    </div>
    <el-menu
      class="sidebar-menu-wrap"
      :default-active="activeIndex"
      :unique-opened="true"
      :collapse="collapse"
      background-color="#001529"
      text-color="#999999"
      active-text-color="#fff"
    >
      <sidebar-item :Menus="menus"></sidebar-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, provide, ref, getCurrentInstance } from 'vue';
import sidebarItem from './sidebarItem.vue';
import { BaseMenuProvide, Menus } from './type';

export default defineComponent({
  props: {
    activeIndex: {
      type: String,
      default: '0',
    },
    width: {
      type: Number,
      default: 272,
    },
    menus: Array as PropType<Array<Menus>>,
  },
  components: { sidebarItem },
  emits: ['onMenuClick'],
  setup(props, { emit }) {
    // menu接受icon的值，实现折叠
    const eventBus = getCurrentInstance()?.appContext.config.globalProperties.$emitter
    const collapse = ref(false)
    eventBus.on('collapse', (val: boolean) => {
      collapse.value = val
    })

    provide<BaseMenuProvide>('baseMenu', { onMenuClickHandler });

    function onMenuClickHandler(menu: Menus) {
      emit('onMenuClick', menu);
    }
    return {
      collapse
    }
  },
});
</script>

<style lang="scss" scoped>
.module-menus {
  padding: 20px 0;
  height: 100%;
}
.logo {
  img {
    width: 43px;
    height: 30px;
  }
}
.collapse1 {
  margin-left: 20px;
}
.collapse2 {
  margin-left: 10px;
}
.title {
  font-size: 20px;
  color: #fff;
  margin-left: 10px;
}
.el-menu {
  border-right: none;
}
.left-wrap {
  display: flex;
  margin-bottom: 30px;
}
</style>
