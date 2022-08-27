<!-- 组件属性配置 -->
<template>
  <el-form size="small" label-width="90px">
    <div class="divider-wrap">外观</div>
    <el-form-item label="手风琴">
      <el-switch v-model="activeChart.__attr__.accordion" />
    </el-form-item>
    <div class="divider-wrap">布局</div>
    <el-row>
      <el-col :span="12">
        <el-form-item label="跨行">
          <el-input v-model.number="activeChart.__config__.rowSpan" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="跨列">
          <el-input v-model.number="activeChart.__config__.colSpan" />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="divider-wrap tree-list-header">层级设置</div>
    <div class="tree-item-list">
      <div
        class="tree-item"
        v-for="(element, index) in activeChart.options"
        :key="element.id"
        :class="{ active: currentLeveId === element.id }"
        @click="onTreeItemClick(element.id, index)"
      >
        <div class="move-icon">
          <i class="el-icon-s-operation" />
        </div>
        <el-input v-model="element.name" readonly size="mini"></el-input>
        <div class="remove">
          <i class="el-icon-remove-outline" @click.stop="onDeleteTreeItem(index)" />
        </div>
      </div>
    </div>
    <div class="property-additem">
      <el-button
        class="btn-operate"
        icon="el-icon-circle-plus-outline"
        type="text"
        @click="addTreeItem"
      >添加层级</el-button>
    </div>
    <div class="divider-wrap">表关联设置</div>
    <el-form-item label="关联表" prop="pageTableName">
      <el-select v-model="selectTree.pageTableName" clearable filterable @change="onTableChange">
        <el-option
          v-for="table in treeList[currentLevel]"
          :key="table.id"
          :value="table.tableName"
          :label="table.tableRemark"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联字段" prop="fieldCode">
      <el-select v-model="selectTree.fieldCode" clearable filterable>
        <el-option
          v-for="fied in fiedList[currentLevel]"
          :key="fied.id"
          :value="fied.fieldName"
          :label="fied.fieldRemark"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { reactive, ref, watch } from "vue";
import useEitter from "@/use/useEitter";
import { deepClone, messageAlert } from "@/utils/utils";
import {
  getTablesBypage,
  getfieldsByTableId,
  getNextTable,
} from "@/api/homeApi";
import { useActiveDesignChart } from "@/use/useDesignChart";

export default {
  name: "report-tree-setting",
  setup() {

    const { activeChart } = useActiveDesignChart();

    let lastNode: any = undefined;

    const mitter = useEitter();

    /**树的表列表*/
    const treeList = ref<any[]>([]);

    /**表的字段*/
    const fiedList = ref<any[]>([]);

    const selectTree = ref<any>(activeChart.value?.options[0]);

    /**当前的层级id*/
    const currentLeveId = ref<number | string | undefined>(
      activeChart.value?.options[0].id
    );
    /**当前的层级*/
    const currentLevel = ref<number>(0);

    /**层级数组数据长度*/
    const optionLength = ref<number>(0);

    watch(
      () => activeChart.value?.componentId,
      () => {
        currentLeveId.value = undefined;
      }
    );

    watch(currentLeveId, (value) => {
      if (!value) return;
      selectTree.value = activeChart.value?.options?.find(
        (f) => f.id === value
      );
      if (selectTree.value.tableId) {
        getFiedList(selectTree.value.tableId);
      }
      getNextInfo();
    });

    /**添加层级 */
    function addTreeItem() {
      const flag =
        currentLeveId.value ===
        activeChart.value?.options[optionLength.value - 2].id;
      if (!flag) {
        messageAlert('error', '请选中末级后再添加')
        return;
      }

      if (selectTree.value.fieldCode === "") {
        messageAlert('error', '请选择需要绑定的字段后再添加层级')
        return;
      }
      if (treeList.value[currentLevel.value + 1].length === 0) {
        messageAlert('error', '暂无可选择下级')
        return;
      }
      init();
      const id = +new Date();
      if (optionLength.value > 4) {
        messageAlert('error', '最多添加四级')
        return;
      }
      currentLeveId.value = id;

      let params = {
        id,
        name: `层级${optionLength.value}`,
        levelType: optionLength.value,
        pageTableName: "",
        fieldCode: "",
        fieldForeignCode: "",
        tableId: null,
      };
      activeChart.value?.options.push(params);
      currentLevel.value = optionLength.value - 1;
      selectTree.value = params;

      if (mitter.emitter.all.get("design-tree-node-add")) {
        const newNode = {
          id,
          // levelType: optionLength.value,
          name: `层级${optionLength.value}`,
        };
        mitter.emitter.emit("design-tree-node-add", {
          data: newNode,
          parentKey: lastNode?.id,
        });
        lastNode = newNode;
      }
    }
    /**删除当前层级*/
    function onDeleteTreeItem(index: number) {
      if (index === 0) {
        messageAlert('error', '至少保留一级')
        return;
      }
      const tempArr = deepClone(activeChart.value?.options);
      if (mitter.emitter.all.get("design-tree-node-remove")) {
        const node = tempArr[index];
        mitter.emitter.emit("design-tree-node-remove", node);
      }
      activeChart.value?.options.splice(index);
      treeList.value.splice(index + 1);
      fiedList.value.splice(index + 1);
      optionLength.value = index + 1;
      currentLeveId.value = tempArr[index - 1].id;
      currentLevel.value = index - 1;
    }

    /**获取首层数据表格*/
    async function getFirstList() {
      const res = await getTablesBypage({ pageIndex: 1, pageSize: 2000 });
      if (res.code === 200) {
        treeList.value[currentLevel.value] = res.data.records;
      }
      getNextInfo();
    }

    /**获取下一张表可选字段和表名*/
    async function getNextInfo() {
      const nextRes = await getNextTable({
        tableName: selectTree.value.pageTableName,
      });
      if (nextRes.code === 200) {
        treeList.value[currentLevel.value + 1] = nextRes.data;
      }
    }

    /**获取字段列表*/
    async function getFiedList(tableId) {
      const res = await getfieldsByTableId({ tableId });
      if (res.code === 200) {
        fiedList.value[currentLevel.value] = res.data;
      }
    }

    /**获取表格ID*/
    function getTableId() {
      const temp = treeList.value[currentLevel.value].find(
        (f) => f.tableName === selectTree.value.pageTableName
      );
      return { tableId: temp.id, fieldForeignCode: temp.fieldForeignCode };
    }

    /**选择表单的时候*/
    async function onTableChange() {
      const { tableId, fieldForeignCode } = getTableId();
      selectTree.value.fieldForeignCode = fieldForeignCode;
      selectTree.value.tableId = tableId;
      getFiedList(tableId);
      getNextInfo();
      onDeleteTreeItem(currentLevel.value + 1);
    }

    /**当前层级点击*/
    async function onTreeItemClick(id: number | string, index: number) {
      if (!treeList.value[index]) {
        messageAlert('error', `请先点击层级${index}`)
        return;
      }
      currentLeveId.value = id;
      currentLevel.value = index;

      if (index === 0) {
        getFirstList();
        return;
      }
      //获取上一级的表名
      const tableName = activeChart.value?.options[index - 1].pageTableName;
      //上一级的数据为旧数据或第二层(第一层数据始终为旧数据，多进行一次下级数据调用)
      const flag =
        index === 1
          ? true
          : treeList.value[index - 1].findIndex(
            (item) => item.tableName === tableName
          ) === -1;
      if (flag) {
        //调用上一级获取当前层级的表格数据方法
        const nextRes = await getNextTable({ tableName });
        if (nextRes.code === 200) {
          treeList.value[index] = nextRes.data;
        }
      }
    }

    /**初始化获取配置字段长度和最后的结点*/
    function init() {
      optionLength.value = activeChart.value?.options.length + 1;
      const data = activeChart.value?.options[optionLength.value - 2];
      data &&
        (lastNode = {
          id: data.id,
          name: data.name,
        });
    }

    getFirstList();
    if (selectTree.value.tableId) {
      getFiedList(selectTree.value.tableId);
    }
    init();
    return {
      activeChart,
      currentLeveId,
      currentLevel,
      onTreeItemClick,
      onDeleteTreeItem,
      addTreeItem,
      onTableChange,
      treeList,
      fiedList,
      selectTree,
    };
  },
};
</script>
<style lang="scss" scoped>
.tree-list-header {
  padding: 0;
}
.tree-item-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.tree-item {
  display: flex;
  align-items: center;
  border: 1px dashed #bbb;
  padding: 2px 8px;
  cursor: pointer;
  i {
    font-size: 18px;
  }
  .remove {
    color: #f86a6a;
  }
  .move-icon {
    padding: 0 4px;
    color: #777;
  }
  &.active {
    background-color: #d1eefa;
    border-color: #539af8;
  }
}
</style>
