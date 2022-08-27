<template>
  <div>
    <el-dialog
      v-model="passwordObj.show"
      :visible.sync="passwordObj.show"
      :title="passwordObj.title"
      @closed="closeFunc('accountRef')"
    >
      <el-form
        ref="accountRef"
        :model="passwordObj.data"
        :rules="accountSaveRules"
        label-width="140px"
        size="medium"
        label-position="right"
      >
        <el-form-item label="登录账号" prop="account">
          <el-input
            :disabled="passwordObj.data.id !== ''"
            v-model.trim="passwordObj.data.account"
          />
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            placeholder="请输入密码"
            v-model.trim="passwordObj.data.oldPassword"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model.trim="passwordObj.data.password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input
            placeholder="请确认密码"
            v-model.trim="passwordObj.data.passwordConfirm"
            show-password
          />
        </el-form-item>
      </el-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ passwordObj.title }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="closeFunc('accountRef')">取消</el-button>
        <el-button type="primary" @click="saveFunc('accountRef')"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateUserPassword } from "@/api/systemManagement/user";

export default {
  name: "EditPassword",
  data() {
    return {
      accountSaveRules: {
        account: [
          { required: true, message: "登录账号不能为空", trigger: "blur" },
        ],
        oldPassword: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
        ],
        passwordConfirm: [
          { required: true, message: "确认新密码不能为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.validatePasswordConfirm(rule, value, callback);
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    passwordObj: {
      type: Object,
    },
  },
  methods: {
    //确认密码验证
    validatePasswordConfirm(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordObj.data.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    // 关闭窗口
    closeFunc(data) {
      this.passwordObj.show = false;
      this.$refs[data].resetFields();
    },
    // 保存 表单验证
    saveFunc(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.saveSureFunc(data);
        } else {
          this.$message.error("*为必填项");
        }
      });
    },
    // 保存 提交后台
    saveSureFunc(data) {
      let param = {
        userId: this.passwordObj.data.id,
        userPasswordOld: this.passwordObj.data.oldPassword,
        userPasswordNew: this.passwordObj.data.password,
      };
      updateUserPassword(param).then((res) => {
        if (res.data.code === 200 && res.status === 200) {
          this.$message.success("提交成功!");
          this.passwordObj.show = false;
          this.$emit("getUserListByOrgFunc");
        } else {
          this.$notifyError("提交失败!", res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../styles/diaForm.less";
</style>
