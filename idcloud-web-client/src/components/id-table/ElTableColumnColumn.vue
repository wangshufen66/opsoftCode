<template>
  <!--可能需要写嵌套column  但暂时没有写-->
  <!--需要写循环column  但暂时也没有写-->
  <el-table-column class="el-table-column-column" :label="label">
    <el-table-column v-if="item.tag !== 'el-table-column-button'" v-for="(item, index) in columns" :key="index" v-bind="item" v-on="$listeners">
    </el-table-column>
    <ElTableColumnButton v-if="item.tag === 'el-table-column-button'" v-for="(item, index) in columns" :key="index" v-bind="item" v-on="$listeners"></ElTableColumnButton>
  </el-table-column>
</template>

<script>
import ElTableColumnButton from './ElTableColumnButton.vue';
export default {
  name: 'el-table-column-column',
  components: {
    ElTableColumnButton,
  },
  props: {
    label: { type: String, default: '' },
    columns: { type: Array, default: [] },
  },
  created() {
    console.log('columns', this.columns);
  },
};
</script>
