<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <el-menu
      ref="menu"
      v-show="!collapsed"
      :default-active="activeName"
      :default-openeds="openedNames"
      :unique-opened="accordion"
      background-color="#515a6e"
      text-color="#fff"
      active-text-color="#fff"
      @select="handleSelect"
      v-bind="$attrs"
    >
      <template v-for="item in menuList">
        <!--<template v-if="item.children && item.children.length === 1">-->
          <!--<side-menu-item-->
            <!--v-if="showChildren(item)"-->
            <!--:key="`${item.name}`"-->
            <!--:parent-item="item"-->
          <!--&gt;-->
          <!--</side-menu-item>-->
          <!--<el-menu-item-->
            <!--v-else-->
            <!--:name="getNameOrHref(item, true)"-->
            <!--:index="`${item.children[0].name}`"-->
          <!--&gt;-->
            <!--<i :class="item.children[0].icon || ''"></i>-->
            <!--<span>{{ showTitle(item.children[0]) }}</span>-->
          <!--</el-menu-item>-->
        <!--</template>-->
        <template>
          <side-menu-item
            :key="`${item.name}`"
            :parent-item="item"
          >
          </side-menu-item>
          <!--<el-menu-item-->
            <!--v-else-->
            <!--:name="getNameOrHref(item)"-->
            <!--:index="`${item.name}`"-->
          <!--&gt;-->
            <!--<i :class="item.children[0].icon || ''"></i>-->
            <!--<span>{{ showTitle(item) }}1111</span>-->
          <!--</el-menu-item>-->
        </template>
      </template>
    </el-menu>
    <div v-show="collapsed">
      <template v-for="item in menuList">
        <collapsed-menu
          v-if="item.children && item.children.length > 1"
          @on-click="handleSelect"
          :parent-item="item"
          :key="`${item.name}`"
        ></collapsed-menu>
        <el-tooltip
          v-else
          :content="showTitle( item.children && item.children[0] ? item.children[0] : item)"
          placement="right"
          :key="`${item.name}`"
        >
          <a @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a">
            <i :class="item.icon || (item.children && item.children[0].icon)"></i>
          </a>
        </el-tooltip>
      </template>
    </div>
  </div>
</template>
<script>
  import SideMenuItem from "./side-menu-item.vue";
  import CollapsedMenu from "./collapsed-menu.vue";
  import {getUnion} from "@/libs/tools";
  import mixin from "./mixin";

  export default {
    name: "SideMenu",
    mixins: [mixin],
    components: {
      SideMenuItem,
      CollapsedMenu,
    },
    props: {
      menuList: {
        type: Array,
        default() {
          return [];
        },
      },
      collapsed: {
        type: Boolean,
      },
      accordion: Boolean,
      activeName: {
        type: String,
        default: "",
      },
      openNames: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        openedNames: [],
      };
    },
    methods: {
      handleSelect(name) {
        this.$emit("on-select", name);
      },
      getOpenedNamesByActiveName(name) {
        return this.$route.matched
          .map((item) => item.name)
          .filter((item) => item !== name);
      },
      updateOpenName(name) {
        if (name === this.$config.homeName) this.openedNames = [];
        else this.openedNames = this.getOpenedNamesByActiveName(name);
      },
    },
    watch: {
      activeName(name) {
        if (this.accordion)
          this.openedNames = this.getOpenedNamesByActiveName(name);
        else
          this.openedNames = getUnion(
            this.openedNames,
            this.getOpenedNamesByActiveName(name)
          );
      },
      openNames(newNames) {
        this.openedNames = newNames;
      },
    },
    mounted() {
      this.openedNames = getUnion(
        this.openedNames,
        this.getOpenedNamesByActiveName(name)
      );
    },
  };
</script>
<style lang="less" scoped>
  @import "./side-menu.less";
</style>
