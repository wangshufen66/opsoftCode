<template>
  <el-checkbox-group v-bind="$attrs" v-on="$listeners">
    <el-checkbox
      v-for="(item, index) in options"
      v-loading="item.authority.idLoad"
      v-if="item.authority.idIf"
      v-show="item.authority.idShow"
      :disabled="item.authority.idDisable"
      :key="index"
      v-bind="item"
      >{{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: "id-checkbox-group",
  data() {
    return {
      // vModel: [],
      // options: [
      //   {
      //     label:'是',
      //   },
      //   {
      //     label:'否',
      //   },
      // ],
    };
  },
  props: {
    options: {
      type: Array,
      return() {
        return [];
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
