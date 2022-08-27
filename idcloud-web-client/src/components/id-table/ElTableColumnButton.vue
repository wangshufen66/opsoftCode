<template>
  <el-table-column
    class="el-table-column-role-list"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:default="{ row, column, index }">
      <el-button v-bind="elButton" @click="click(row, column, index)">
        {{ row[column.property] }}
      </el-button>
    </template>
  </el-table-column>
</template>
<style lang="less" scoped>
.el-button.is-plain:focus,
.el-button.is-plain:hover {
  border-color: transparent !important;
  background-color: transparent !important;
}
</style>
<script>
export default {
  name: "el-table-column-button",
  data() {
    return {
      elButton: {
        plain: true,
        type: "text",
        size: "small"
      }
    };
  },
  methods: {
    click(row, column, index) {
      console.log("click: ", row);

      this.$emit("idCellButtonClick", row, column, index);
    }
  }
};
</script>
