<template>
  <el-table-column
    class="el-table-column-template"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:default="{ row, column, index }">
      <!--推荐方法 动态组件-->
      <component
        :is="component.tag"
        :row="row"
        v-bind="component"
        @click="click($event, row)"
      >
        {{ column ? row[column["property"]] : "" }}
      </component>
    </template>
  </el-table-column>
</template>
<style lang="less" scoped>
.el-table-column-template {
  /deep/ .flex-row-align-all-center {
    display: inline;
  }
}
</style>
<script>
import IdActionBar from "../id-action-bar/index";

export default {
  name: "el-table-column-template",
  components: {
    IdActionBar,
  },
  props: {
    component: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  // provide: function () {
  //   return {
  //     click: this.click
  //   }
  // },//依赖注入
  methods: {
    click(target, row) {
      // console.log(target, row);
      this.$emit("rowClick", target, row);
    },
  },
};
</script>
