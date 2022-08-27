<template>
  <!--多按钮 按钮-->
  <el-button-group class="id-el-button-group">
    <id-button
      class="id-el-button-group-button"
      styleOne
      v-for="item in childButton"
      :key="item.target"
      :class="item.classKey"
      :text="item.text"
      :size="size"
      v-bind="item"
      @click="chick(item.target)"
    ></id-button>
  </el-button-group>
</template>
<style lang="less" scoped>
//基本上禁止以下这种写法出现  没有办法情况下才回去修改el的样式
//下面这种情况 主要防止无限缩小情况下导致的样式没有保持原样的情况
//（可能是el-button-group本身的问题）=》后面需要解决
.el-button-group > .el-button + .el-button {
  border-left: 0;
  border-right: 0;
}
.el-button-group > .el-button:first-child {
  border-right: 0;
}
.el-button-group > .el-button:last-child {
  border-right: 1px solid #1890ff;
}
.el-button-group > .el-button:hover {
  z-index: 0;
}
.el-button-group > .el-button + .el-button::after {
  content: "";
  z-index: 2;
  position: absolute;
  width: 0.5px;
  height: 50%;
  top: 25%;
  left: -1px;
  bottom: 0;
  background-color: #1890ff;
}
</style>
<script>
import IdButton from "../id-button/index";

export default {
  name: "id-group-button",
  components: { IdButton },
  data() {
    return {};
  },
  props: {
    size: {
      type: String,
      default() {
        return "";
      }
    },
    childButton: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    chick(key) {
      this.$emit("click", key);
    }
  }
};
</script>
