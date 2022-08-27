<template>
  <table-extend class="table-extend" v-bind="component?.__attr__" :tableColums="tableColums" @rowClick="onRowClick" v-loading="tableLoading" @pageSizeChange="onPageSizeChange" @currentChange="currentChange" @tableSort="onTableSort"></table-extend>
</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue';
import { TableComponent } from './IConfig';

export default {
  name: 'designTable',
  props: {
    component: Object as PropType<TableComponent>,
  },
  setup(props) {
    const tableLoading = ref<boolean>(false);
    // 分页设置
    const pageRequest = { pageIndex: 1, pageSize: 15 };
    // 排序设置
    const sortCfg = { fieldName: undefined, orderDesc: undefined };

    const tableColums = computed(() => {
      if (
        props.component?.columnModel &&
        props.component.columnModel.length > 0
      ) {
        const columns = props.component?.columnModel.filter(
          (f) => f.check === true
        );
        return columns;
      } else {
        return [];
      }
    });

    /**
     * 行点击事件
     * @row
     */
    function onRowClick(row: any) {}

    const onPageSizeChange = (e): void => {
      pageRequest.pageSize = e.pageSize;
      currentChange(e);
    };
    // 页码改变
    const currentChange = (e): void => {
      pageRequest.pageIndex = e.pageIndex;
      searchData();
    };

    /**
     * 表格字段排序事件
     */
    function onTableSort(e) {
      const { sortName, sortType } = e;
      sortCfg.fieldName = sortName;
      sortCfg.orderDesc = sortType;
      searchData();
    }
    /**
     * 表格数据查询
     */
    function searchData() {}

    return {
      tableLoading,
      tableColums,
      onRowClick,
      onTableSort,
      onPageSizeChange,
      currentChange,
    };
  },
};
</script>
