<template>
  <el-submenu :index="`${parentName}`">
    <!--一级目录-->
    <template slot="title">
      <div class="inline-wrapper">
        <i :class="parentItem.icon || ''"></i>
        <span v-if="showTitle(parentItem).length <= 7">
          {{ showTitle(parentItem) }}
        </span>
        <span v-else> {{ showTitle(parentItem).substr(0, 7) }}... </span>
      </div>
    </template>
    <!--二级目录-->
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`${item.name}`" :parent-item="item" />
        <el-menu-item v-else :name="getNameOrHref(item, true)" :index="`menu-${item.children[0].name}`">
          <div class="inline-wrapper">
            <i :class="item.children[0].icon || ''"></i>
            <span>{{ showTitle(item.children[0]) }}</span>
          </div>
        </el-menu-item>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`${item.name}`" :parent-item="item" />
        <el-menu-item v-else :name="getNameOrHref(item)" :index="`${item.name}`">
          <div class="inline-wrapper">
            <i :class="item.icon || ''"></i>
            <span>{{ showTitle(item) }}</span>
          </div>
        </el-menu-item>
      </template>
    </template>
  </el-submenu>
</template>
<style lang="less" scoped>
@import './side-menu-item.less';
</style>
<script>
import mixin from './mixin';
import itemMixin from './item-mixin';

export default {
  name: 'SideMenuItem',
  mixins: [mixin, itemMixin],
};
</script>
