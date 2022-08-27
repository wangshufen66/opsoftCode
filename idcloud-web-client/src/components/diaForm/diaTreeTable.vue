<template>
  <el-dialog
    v-model="show"
    :visible.sync="show"
    :title="title"
    width="80%"
    top="6vh"
    @closed="closeFunc"
  >
    <id-tree-table-for-system
      id="id-tree-table-for-system"
      class="id-tree-table-for-system"
      ref="treeTable"
      treeName="分组"
      tableName="表格"
      :selection="false"
      :isAutoClickTree="false"
      :highlight-current-row="highlightCurrentRow"
      :actionBarConfig="actionBarConfig"
      :tableColumns="tableColumns"
      :getTreeList="getTreeList"
      :getTableByTree="getTableByTree"
      @row-click="rowClick"
      @afterGetTableNoPage="afterGetTableNoPage"
      @getTreeListFinally="getTreeListFinally"
      v-bind="$attrs"
      v-on="$listeners"
    >
    </id-tree-table-for-system>
    <div slot="title" class="diaTitle">
      <span class="diaTitleText">{{ title }}</span>
    </div>
    <div slot="footer" class="diaFooter">
      <el-button @click="closeFunc">取消</el-button>
      <el-button type="primary" @click="saveSureFunc">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import IdTreeTableForSystem from "../id-pages/IdTreeTableForSystem";

export default {
  name: "diaTreeTable",
  components: {
    IdTreeTableForSystem
  },
  data() {
    return {
      actionBarConfig: [],
      highlightCurrentRow: true,
      currentRow: {}
    };
  },
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: "数据点-(双击选择)" },
    getTreeList: { type: Function },
    getTableByTree: { type: Function },
    tableColumns: { type: Array }
  },
  computed: {},
  methods: {
    rowClick(row) {
      if (row && this.currentRow) {
        if (this.currentRow.id === row.id) {
          this.currentRow = {};
          this.$refs.treeTable.$children[3].$children[0].setCurrentRow();
        } else {
          this.currentRow = row;
        }
      } else {
        this.currentRow = row;
      }
    },
    closeFunc() {
      this.$emit("close");
    },
    saveSureFunc() {
      this.$emit("confirm", this.currentRow);
    },
    afterGetTableNoPage(data) {
      this.$refs.treeTable.$children[3].$children[0].setCurrentRow();
      if (this.currentRow !== {}) {
        const currIndex = data.findIndex(
          item => item.id === this.currentRow.id
        );
        if (currIndex > 0) {
          this.currentRow = data[currIndex];
          this.$refs.treeTable.$children[3].$children[0].setCurrentRow(
            this.currentRow
          );
        }
      }
    },
    findOrgListFunc() {
      if (this.$refs.treeTable) {
        this.$refs.treeTable.treeSelectData = {};
        this.$refs.treeTable.findOrgListFunc();
      }
    },
    setCurrentRow(id) {
      if (id) this.currentRow = { id: id };
      else this.currentRow = {};
    },
    getTreeListFinally() {
      const dia = document.getElementById("id-tree-table-for-system");
      if (dia.querySelector(".el-tree-node__content"))
        dia.querySelector(".el-tree-node__content").click();
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../styles/diaForm.less";

/deep/ .el-dialog__header {
  /*width: 100%;*/
  align-content: center;
  border-bottom: 1px solid #c4c4c4;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .diaTitle {
    border: 0;
  }

  .el-dialog__headerbtn {
    display: none;
  }
}

.id-tree-table-for-system {
  padding: 0 20px;
  margin-top: -20px;
}
</style>
