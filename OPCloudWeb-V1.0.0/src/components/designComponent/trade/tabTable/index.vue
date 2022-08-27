<template>
  <div class="tab-tables-wrap">
    <el-tabs class="tab-tables" v-model="activeTab" @tab-click="onTabClick">
      <template v-for="option in component?.tabOptions" :key="option.id">
        <el-tab-pane :label="option.label" :name="`${option.id}`"></el-tab-pane>
      </template>
    </el-tabs>
    <el-button size="small" type="primary" plain @click="onAdd">新增</el-button>
    <template v-if="isShowMoveBtn">
      <el-button size="small" type="primary" plain @click="onMoveUp">上移</el-button>
      <el-button size="small" type="primary" plain @click="onMoveDown">下移</el-button>
    </template>

    <table-extend
      class="table-extend"
      v-bind="currentTableOption"
      :tableLoading="loading"
      :tableColums="currentTableColumns"
      :tableData="currentTableData"
      @rowDblClick="onRowDblClick"
      @row-click="onRowClick"
    >
      <template #operatColumn>
        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="scope">
            <text-button @click="onEditRow(scope)">编辑</text-button>
            <text-button @click="onDelRow(scope)">删除</text-button>
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

    const operateIndex = ref<number>(-1);

    const activeTable = reactive({
      tableId: "",
      tableName: "",
    });

    /**当前表格的配置 */
    const currentTableOption = reactive({
      selectionCol: true,
      paging: false,
      total: 0,
    });

    const loading = computed(() => {
      return props.component.__config__.loading;
    })

    /**表名是否为工序(工序任务    t_aegongdan_mshengchanzhixing_pICMOEntry 和委外工序 t_en_wi_OutSourceEntry) */
    const isShowMoveBtn = computed(() => {
      let regpICMOEntry = /^t_aegongdan_mshengchanzhixing_pICMOEntry$/;
      let regOutSourceEntry = /^t_en_wi_OutSourceEntry$/;
      if (regpICMOEntry.test(props.component?.selectModelList[0].config[0].tableName) || regOutSourceEntry.test(props.component?.selectModelList[0].config[0].tableName)) {
        return true
      } else {
        return false
      }
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
          type: 'edit',
          component: props.component,
          callback: editCallback,
        });
      }
    }

    let rowIndex; //选中的索引
    function onRowClick(row) {
      rowIndex = currentTableData.value.findIndex((f) => f === row);
    }
    //上移
    function onMoveUp() {
      if (!rowIndex) {
        messageAlert("warning", "请选择工序进行移动");
        return
      }
      if (rowIndex === 0) {
        messageAlert("warning", "第一道工序,不能移动");
        return;
      }
      if (rowIndex === currentTableData.value.length - 1) {
        messageAlert("warning", "最后一道工序,不能移动");
        return;
      }
      if (rowIndex == 1) {
        messageAlert("warning", "不能移到第一道工序");
      } else {
        const upData = currentTableData.value[rowIndex - 1];
        currentTableData.value.splice(rowIndex - 1, 1);
        currentTableData.value.splice(rowIndex, 0, upData);
        rowIndex -= 1;
      }
    }
    //下移
    function onMoveDown() {
      if (!rowIndex) {
        messageAlert("warning", "请选择工序进行移动");
        return
      }
      if (rowIndex === 0) {
        messageAlert("warning", "第一道工序,不能移动");
        return;
      }
      if (rowIndex === currentTableData.value.length - 1) {
        messageAlert("warning", "最后一道工序,不能移动");
        return;
      }
      if (rowIndex == currentTableData.value.length - 2) {
        messageAlert("warning", "不能移动到最后一道工序");
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
          type: 'detail',
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
      if (mitter.emitter.all.get("on-del-tabtable-data")) {
        mitter.emitter.emit("on-del-tabtable-data", {
          masterTableName: activeTable.tableName,
          row,
          rowIndex: operateIndex.value,
          tableData: currentTableData.value,
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

    function editCallback() { }

    function rowDblClickCallback() { }

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
      loading,
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
      isShowMoveBtn,
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
  margin-top: 16px;
  height: 328px;
}
.btn-add {
  position: absolute;
  right: 18px;
  top: 5px;
}
</style>
