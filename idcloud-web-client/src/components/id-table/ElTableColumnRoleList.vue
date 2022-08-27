<template>
  <el-table-column
    class="el-table-column-role-list"
    v-bind="$attrs"
    v-on="$listeners">
    <template v-slot:default="{ row, column, index }">
      <el-tag v-for="(item, index) in row.roleList"
              :key="index"
              plain
              size="small"
              style="margin-right: 4px"
              :type="typeList[index%5]"
              >
        {{item.name}}
      </el-tag>
    </template>
  </el-table-column>
</template>

<script>
  export default {
    name: "el-table-column-role-list",
    data() {
      return {
        typeList: ['','success','info','danger','warning'],
      }
    }
  }
</script>
