<template>
  <!-- 重置密码 -->
  <div>
    <el-dialog
      v-model="modalObj.show"
      :visible.sync="modalObj.show"
      :title="title"
      @closed="cancel"
      width="35%"
    >
      <!--<p slot="header" style="color:#f60;text-align:center">-->
      <!--<Icon type="ios-information-circle"></Icon>-->
      <!--<span>{{title}}</span>-->
      <!--</p>-->
      <div style="text-align: center; margin-bottom: 30px">
        <h1>{{ modalObj.target.account }}</h1>
        <h3>{{ modalObj.msg }}</h3>
      </div>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ title }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="cancel" size="medium">取消</el-button>
        <el-button
          type="primary"
          :loading="modal_loading"
          @click="confirm"
          size="medium"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resetUserPassword } from "@/api/systemManagement/user";

export default {
  name: "resetPassword",
  props: {
    modalObj: {
      type: Object,
      required: true,
    },
    title: {
      // 弹窗标题
      type: String,
      default: "重置密码",
    },
  },
  data() {
    return {
      modal_loading: false,
    };
  },
  mounted() {},
  methods: {
    confirm() {
      let params = {
        id: this.modalObj.target.id,
      };
      this.modal_loading = true;
      resetUserPassword(params).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("提交成功!");
          this.modalObj.show = false;
        } else {
          this.$notifyError("提交失败!", res.data.msg);
        }
        this.modal_loading = false;
      });
    },
    cancel() {
      this.modalObj.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../styles/diaForm.less";
</style>
