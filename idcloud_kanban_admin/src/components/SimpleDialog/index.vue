<template>
  <div class="container">
    <!--=========== 对话框组件 ==========start==========-->

    <!--普通信息对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :show-close="false"
      :before-close="simpleDialogHandleClose"
      :width="dialogWidth">
      <!--=========信息主体====start====-->
      <span v-if="dialogMessage">{{ dialogMessage }}</span>
      <el-table v-if="dialogGridTable" :data="dialogGridTable.data">
        <el-table-column v-for="(column, index) in dialogGridTable.columns" :key="index" :property="column.property" :label="column.label" :width="dialogGridTable.width"/>
      </el-table>
      <!--=========信息主体====end====-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="simpleDialogHandleCancel()">取 消</el-button>
        <el-button type="primary" @click="simpleDialogHandleConfirm()">确 定</el-button>
      </span>
    </el-dialog>

    <!--=========== 对话框组件 ==========end==========-->
  </div>
</template>

<script>
export default {
  name: 'SimpleDialog',
  props: {
    dialogWidth: {
      type: String,
      default: '30%'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }, dialogTitle: {
      type: String,
      default: ''
    }, dialogMessage: {
      type: String,
      default: ''
    }, dialogGridTable: {
      type: Object,
      default: null
    }, dialogCancelCallback: {
      type: Function,
      default: null
    }, dialogConfirmCallback: {
      type: Function,
      default: null
    }},
  data() {
    return {
      mDialogVisible: false, // 是否显示
      mDialogTitle: '提示',
      mDialogMessage: '',
      mDialogCancelCallback: null,
      mDialogConfirmCallback: null
    }
  },
  watch: {
    dialogVisible(val) {
      this.mDialogVisible = val
    },
    dialogTitle(val) {
      this.mDialogTitle = val
    },
    dialogMessage(val) {
      this.mDialogMessage = val
    },
    dialogCancelCallback(val) {
      this.mDialogCancelCallback = val
    },
    dialogConfirmCallback(val) {
      this.mDialogConfirmCallback = val
    }
  },
  methods: {
    // ===== 对话框相关 ===start===

    // 打开 普通信息对话框
    // openSimpleDialog: function (title, msg, confirmCallback) {
    //     this.dialogConfirmCallback = null;
    //     this.dialogTitle = title;
    //     this.dialogMessage = msg;
    //     this.dialogVisible = true;
    //
    //     //设置确定按钮点击回调函数
    //     this.dialogConfirmCallback = confirmCallback;
    // },

    // 普通信息对话框 右上角大叉关闭事件的关闭前处理处理机制
    simpleDialogHandleClose(done) {
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //         done();
      //     })
      //     .catch(_ => {
      //     });
    },

    // 普通信息对话框 取消按钮点击事件
    simpleDialogHandleCancel: function() {
      // this.mDialogVisible = false;
      if (this.mDialogCancelCallback != null) {
        this.mDialogCancelCallback()
      }
    },

    // 普通信息对话框 确定按钮点击事件
    simpleDialogHandleConfirm: function() {
      // this.mDialogVisible = false;
      if (this.mDialogConfirmCallback != null) {
        this.mDialogConfirmCallback()
      }
    }

    // ===== 对话框相关 ===end===
  }
}
</script>

<style lang='scss' scoped>

</style>
