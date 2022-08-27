<template>
  <div class="tab-tables-wrap">
    <el-tabs class="tab-tables" v-model="activeTab" @tab-click="onTabClick">
      <template v-for="option in component?.tabOptions" :key="option.id">
        <el-tab-pane :label="option.label" :name="`${option.id}`"></el-tab-pane>
      </template>
    </el-tabs>
    <el-button type="primary" size="small" @click="onAdd">新增</el-button>
    <el-button type="primary" size="small" @click="onMoveUp">上移</el-button>
    <el-button type="primary" size="small" @click="onMoveDown">下移</el-button>
    <table-extend
      class="table-extend"
      v-bind="currentTableOption"
      :tableColums="currentTableColumns"
      :tableData="currentTableData"
      @rowDblClick="onRowDblClick"
      @row-click="onRowClick"
    >
      <template #operatColumn>
        <el-table-column label="操作" min-width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="onEditRow(scope)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="onDelRow(scope)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <!-- <el-button class="btn-add" type="text" @click="onAdd">新增</el-button> -->
  </div>
</template>

<script lang="ts">
import { computed, PropType, reactive, ref } from "vue";
import { TabTableComponent } from "./IConfig";
import useEitter from "@/use/useEitter";
import { messageAlert } from "@/utils/utils";

export default {
  name: "designTabTable",
  props: {
    component: Object as PropType<TabTableComponent>,
    model: Object,
  },
  setup(props) {
    const mitter = useEitter();

    const activeTab = ref<any>();

    const activeTable = reactive({
      tableId: "",
      tableName: "",
    });

    const operateIndex = ref<number>(-1);

    /**当前表格的配置 */
    const currentTableOption = computed(() => {
      return {
        selectionCol: true,
        paging: false,
        total: 0,
      };
    });

    /**当前表格列 */
    const currentTableColumns = computed(() => {
      const columnModel = props.component?.columnModelList.find(
        (f) => f.pid == activeTab.value
      );
      if (columnModel) {
        const columns = columnModel.columnConfig.filter(
          (f) => f.check === true
        );
        return columns;
      } else {
        return [];
      }
    });

    /**当前表单的数据 */
    const currentTableData = computed(() => {
      const dataSourceList = props.component?.dataSourceList;
      const dataSourceObj =
        dataSourceList &&
        dataSourceList.length > 0 &&
        dataSourceList.find((f) => f.pid == activeTab.value);
      return (dataSourceObj && dataSourceObj.dataSource) || [];
    });

    function onTabClick(tab) {
      const index = Number(tab.index);
      if (index != undefined || !isNaN(index)) {
        tabChange(index);
      }
    }

    /**编辑行 */
    function onEditRow(scope: any) {
      const { $index, row } = scope;
      operateIndex.value = $index;
      if (mitter.emitter.all.get("on-edit-tabtable-data")) {
        mitter.emitter.emit("on-edit-tabtable-data", {
          tableId: activeTable.tableId,
          row,
          component: props.component,
          callback: editCallback,
        });
      }
    }

    let rowIndex; //选中的索引
    function onRowClick(row) {
      rowIndex = currentTableData.value.findIndex((f) => f === row);
      console.log(rowIndex);
    }
    //上移
    function onMoveUp() {
      console.log(rowIndex);
      if (rowIndex == 0) {
        messageAlert("warning", "处于顶端，不能继续上移");
      } else {
        const upData = currentTableData.value[rowIndex - 1];
        currentTableData.value.splice(rowIndex - 1, 1);
        currentTableData.value.splice(rowIndex, 0, upData);
        rowIndex -= 1;
      }
    }
    //下移
    function onMoveDown() {
      console.log(rowIndex);
      if (rowIndex == currentTableData.value.length - 1) {
        messageAlert("warning", "处于最,底端不能继续向下移动");
      } else {
        const downData = currentTableData.value[rowIndex + 1];
        currentTableData.value.splice(rowIndex + 1, 1);
        currentTableData.value.splice(rowIndex, 0, downData);
        rowIndex += 1;
      }
    }

    /**双击查看详情 */
    function onRowDblClick(row) {
      if (mitter.emitter.all.get("on-viewDetail-tabtable-data")) {
        mitter.emitter.emit("on-viewDetail-tabtable-data", {
          tableId: activeTable.tableId,
          row,
          component: props.component,
          callback: rowDblClickCallback,
        });
      }
    }

    /**
     * 删除行
     */
    function onDelRow(scope: any) {
      const { $index, row } = scope;
      operateIndex.value = $index;
      const currentTableData = getTableData(activeTab.value);
      if (mitter.emitter.all.get("on-del-tabtable-data")) {
        mitter.emitter.emit("on-del-tabtable-data", {
          masterTableName: activeTable.tableName,
          row,
          rowIndex: operateIndex.value,
          tableData: currentTableData,
          callback: deleteCallback,
        });
      }
    }
    /**
     * 删除成功回调
     */
    function deleteCallback() {
      const dataSourceList = props.component?.dataSourceList;
      const dataSourceObj =
        dataSourceList &&
        dataSourceList.length > 0 &&
        dataSourceList.find((f) => f.pid == activeTab.value);
      dataSourceObj &&
        operateIndex.value > -1 &&
        dataSourceObj.dataSource.splice(operateIndex.value, 1);
    }

    function editCallback() {}

    function rowDblClickCallback() {}

    /**
     * 新增数据
     */
    function onAdd() {
      if (mitter.emitter.all.get("on-add-tabtable-data")) {
        mitter.emitter.emit("on-add-tabtable-data", {
          optionId: activeTab.value,
          tableId: activeTable.tableId,
          model: props.model,
          component: props.component,
        });
      }
    }

    function init() {
      tabChange(0);
    }

    function tabChange(index) {
      const options = props.component?.tabOptions;
      activeTab.value = options && options[index] && `${options[index].id}`;
      getTableName();
    }

    function getTableName() {
      const selectModelList = props.component?.selectModelList;
      const table = selectModelList?.find((f) => f.pid == activeTab.value);
      const tablename =
        table && table.config && table.config[0] && table.config[0].tableName;
      tablename && (activeTable.tableName = tablename);
      const tableId =
        table && table.config && table.config[0] && table.config[0].id;
      tableId && (activeTable.tableId = tableId);
    }

    init();

    return {
      activeTab,
      activeTable,
      operateIndex,
      currentTableOption,
      currentTableColumns,
      currentTableData,
      onTabClick,
      onEditRow,
      onRowDblClick,
      onDelRow,
      onAdd,
      onRowClick,
      onMoveUp,
      onMoveDown,
    };
  },
};
</script>

<style lang="scss" scoped>
.tab-tables-wrap {
  position: relative;
}
.tab-tables {
  box-shadow: none;
  width: 100%;
}
.table-extend {
  height: 328px;
}
.btn-add {
  position: absolute;
  right: 18px;
  top: 5px;
}
</style>
