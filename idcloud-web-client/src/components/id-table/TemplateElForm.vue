<template>
  <el-form label-position="left">
    <el-form-item label="名称">
      <span>{{ row.name }}</span>
    </el-form-item>
    <el-form-item label="地址">
      <span>{{ row.address }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "template-elForm",
  props: {
    row: {
      type: Object,
    },
  },
};
</script>

<style scoped></style>
