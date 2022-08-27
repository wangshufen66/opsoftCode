<template>
  <div style="overflow: auto; height: 100%">
    <table-extend class="table-extend" v-bind="getTableOption(option.id)" :tableColums="getTableColumns(option.id)" :tableData="getTableData(option.id)">
      <template #operatColumn>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-if="editRowDisplay" type="text" size="small" @click="onEditRow(scope)">编辑</el-button>
            <el-button type="text" size="small" @click="onDelRow(scope)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import tableExtend from '@/components/commontable/index.vue';

export default defineComponent({
  components: { tableExtend },
  setup() {
    return {};
  },
});
</script>

<style></style>
