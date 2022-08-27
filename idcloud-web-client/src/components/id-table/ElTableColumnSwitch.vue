<template>
  <el-table-column
    class="el-table-column-switch"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:default="{ row, column, index }">
      <el-switch
        v-model="row[column.property]"
        :width="40"
        active-color="#13ce66"
        @change="change($event,row,column,index)"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <!--
        inactive-color="#ff4949"
        active-text="是"
        inactive-text="否"
        -->
      </el-switch>
    </template>
  </el-table-column>
</template>
<script>
  export default {
    name: "el-table-column-switch",
    props: {
      setTrueOfFalse: {type: Function},
    },
    methods: {
      async change(newValue, row, column, index) {
        let param = {
          id: row.id,
        };
        param[column['property']]=newValue;
        await this.setTrueOfFalse(param).then((res) => {
          if (res.data.code === 200 && res.status === 200) {
            this.$message.success("切换成功!");
            this.$emit('id-row-column-switch-refresh');
          } else {
            this.$notifyError("切换失败!", res.data.msg);
          }
        });
      }
    }
  }
</script>
