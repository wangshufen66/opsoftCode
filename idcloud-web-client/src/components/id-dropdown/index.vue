<template>
  <el-dropdown
    class="id-el-dropdown"
    :class="classKey"
    placement="bottom"
    @command="chick"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <id-button
      class="id-el-dropdown-button"
      :styleOne="styleOne"
      :text="text"
      :size="size"
      afterIf
      afterClass="el-icon-arrow-down el-icon--right"
      v-bind="$attrs"
      v-on="$listeners"
    ></id-button>
    <el-dropdown-menu class="id-el-dropdown-menu" slot="dropdown">
      <el-dropdown-item
        class="id-el-dropdown-item"
        v-for="item in childButton"
        :key="item.target"
        v-loading="item.idLoad"
        v-if="item.idIf"
        v-show="item.idShow"
        :disabled="item.idDisable"
        :class="item.classKey"
        :command="item.target"
        v-bind="item"
        >{{ item.text }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<style lang="less" scoped>
//公司下拉菜单样式1————————————————————————————————
.id-button {
  padding-right: 2px;
  padding-left: 10px;
  border: 1px solid #1890ff;
}

.id-el-dropdown-menu {
  padding: 5px 0 5px 0;
}

.id-el-dropdown-item {
  line-height: 28px;
  height: 28px;
  text-align: center;
  color: #1890ff;
}
.el-dropdown-menu__item.is-disabled {
  cursor: default;
  color: #bbb;
  pointer-events: none;
}
//————————————————————————————————————————————————
</style>
<script>
import IdButton from "../id-button/index";

export default {
  name: "id-dropdown",
  components: { IdButton },
  data() {
    return {};
  },
  created() {},
  props: {
    size: {
      type: String,
      default() {
        return "";
      },
    },
    classKey: {
      type: String,
      default() {
        return "";
      },
    },
    text: {
      type: String,
      default() {
        return "";
      },
    },
    styleOne: {
      type: Boolean,
      default() {
        return true;
      },
    },
    childButton: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    chick(command) {
      this.$emit("click", command);
    },
  },
};
</script>
