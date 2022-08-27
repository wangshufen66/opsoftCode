<template>
  <el-dialog :visible.sync="diaForm.show" @closed="diaClose(diaForm.ref)">
    <id-form :ref="diaForm.ref" class="more-query-form" :id-form="dialogForm" v-bind="diaForm" :label-width="dialogFormLabelWidth"></id-form>
    <div slot="title" :class="$style.diaTitle">
      <span :class="$style.diaTitleText">{{ title }}</span>
    </div>
    <div slot="footer" :class="$style.diaFooter">
      <el-button @click="diaClose(diaForm.ref)">取消</el-button>
      <el-button type="primary" @click="diaSave(diaForm.ref)">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import IdForm from '../id-form/index';

export default {
  name: 'id-dialog-form',
  components: {
    IdForm,
  },
  data() {
    return {
      //弹窗相关配置
      diaForm: {
        show: false,
        ref: 'detailForm',
        size: 'default',
      },
    };
  },
  props: {
    dialogForm: { type: Object, required: true },
    dialogFormLabelWidth: { type: String, required: true },
    title: { type: String, required: true },
    getDetail: { type: Function, required: true },
    addDetail: { type: Function, required: true },
    updateDetail: { type: Function, required: true },
  },
  created() {
    console.log('this', this.diaForm);
  },
  methods: {
    // 新增弹窗窗口
    diaShow() {
      this.$nextTick(() => {
        this.diaForm.show = true;
      });
    },
    // 打开弹窗窗口
    async diaOpenEdit(row) {
      await this.getDetail(row.id)
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            this.$emit('initDiaFormDetail', res.data.data);
            this.diaShow();
          } else {
            this.$notifyError(`获取${this.title}详情失败!`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError('网络请求失败!', '');
        });
    },
    // 关闭弹窗窗口
    diaClose(ref) {
      this.diaForm.show = false;
      this.$nextTick(() => {
        this.$emit('initDiaFormDetail');
        this.$refs[ref].$refs['idForm'].resetFields();
      });
    },
    // 数据校验=》保存或者更新数据
    diaSave(ref) {
      this.$refs[ref].$refs['idForm'].validate((valid) => {
        if (valid) {
          this.addOrUpdateDetail();
        } else {
          this.$message.error('*为必填项');
        }
      });
    },
    // detail保存或者更新数据(提交到后台) =》更新表格
    async addOrUpdateDetail() {
      let submit = null;
      if (this.dialogForm.data.id) submit = this.updateDetail;
      else submit = this.addDetail;
      await submit(this.dialogForm.data).then((res) => {
        if (res.data.code === 200 && res.status === 200) {
          this.$message.success('提交成功!');
          this.diaForm.show = false;
          this.$emit('submitSuccess');
        } else {
          this.$notifyError('提交失败!', res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
.diaTitle {
  border-bottom: 1px solid #c4c4c4;
  height: 60px;
  margin: -20px -20px -10px -20px;
  padding-left: 25px;
  padding-top: 19px;
}

.diaTitleText {
  font-size: 16px;
  line-height: 22px;
  font-weight: bolder;
  font-family: 微软雅黑, serif;
}

.diaFooter {
  margin-top: -30px;

  .el-button {
    margin-right: 16px;
  }
}
</style>
<style lang="less" scoped>
@import '../id-form/idFormColumn';
</style>
