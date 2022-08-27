<template>
  <el-dropdown
    ref="dropdown"
    @command="handleClick"
    class="collased-menu-dropdown"
    :placement="placement"
  >
    <span v-if="!parentItem.icon"
         class="menu-title"
         @mouseover="handleMousemove($event, children)">
      {{ showTitle(parentItem) }}
      <i class="el-icon-arrow-right"></i>
    </span>
    <a v-else class="drop-menu-a" @mouseover="handleMousemove($event, children)">
      <i :class="parentItem.icon"> </i>
    </a>
    <el-dropdown-menu slot="dropdown">
      <template v-for="child in children">
        <el-dropdown-item v-if="showChildren(child)" class="el-dropdown-item-menu">
          <collapsed-menu
            :parent-item="child"
            :key="`drop-${child.name}`"
          ></collapsed-menu>
        </el-dropdown-item>
        <el-dropdown-item
          v-else
          :key="`drop-${child.name}`"
          :name="child.name"
          :command="child.name"
        >
          <!--<i style="font-size: 16px" :class="child.icon"></i>-->
          <span class="menu-title">
            {{ showTitle(child) }}
          </span>
        </el-dropdown-item>
      </template>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<style lang="less" scoped>
  @import "./collapsed-menu.less";
</style>
<script>
  import mixin from "./mixin";
  import itemMixin from "./item-mixin";
  import {findNodeUpperByClasses} from "@/libs/util";

  export default {
    name: "CollapsedMenu",
    mixins: [mixin, itemMixin],
    data() {
      return {
        placement: "right-end",
      };
    },
    methods: {
      handleClick(name) {
        this.$emit("on-click", name);
      },
      handleMousemove(event, children) {
        const {pageY} = event;
        const height = children.length * 38;
        const isOverflow = pageY + height < window.innerHeight;
        this.placement = isOverflow ? "right-start" : "right-end";
      },
    },
  };
</script>
