import { reactive, ref } from "vue";

/**
 * 表格组件
 * @export
 * @return {*}
 */
export default function useTableExtend() {
  //列表配置项
  const tableOption = reactive({
    tableData: [],
    tableColums: [],
    paging: true,
    total: 0,
    tableLoading: false,
  });

  const selectIds = ref<number[]>();

  // 批量选择
  function handleSelectionChange(vals) {
    if (vals.length > 0) {
      selectIds.value = vals.map((item) => {
        return item.id;
      });
    } else {
      selectIds.value = [];
    }
  }

  /**
   * 重置表格配置
   */
  function resetTableOption() {
    tableOption.tableData = [];
    tableOption.tableColums = [];
    tableOption.total = 0;
  }

  return {
    tableOption,
    selectIds,
    handleSelectionChange,
    resetTableOption,
  };
}
