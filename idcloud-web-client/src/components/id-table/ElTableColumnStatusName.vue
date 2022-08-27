<template>
  <el-table-column
    class="el-table-column-status-name"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:default="{ row, column, index }">
      <!--推荐方法 动态组件-->
      <span :style="{ color: colorGroup(row.status) }">{{
        row.statusName
      }}</span>
    </template>
  </el-table-column>
</template>
<script>
  export default {
    name: "el-table-column-status-name",
    props: {
      colorType: {type: Number, default: 0}//可能后期要改 =》 colorType的意义不明确 不能反映是哪个界面的
    },
    computed: {
      colorGroup() {
        return function (value) {
          const group = [
            {
              0: "#409EFF",
              1: "#45C376",
              2: "#E6A23C",
              3: "#F67049",
            },
            {
              0: "#45C376",
              1: "#F67049",
            },
            {
              0: "#F67049",
              1: "#45C376",
            },
          ];
          return group[this.colorType][value];
        };
      },
    },
    methods: {},
  };
</script>
