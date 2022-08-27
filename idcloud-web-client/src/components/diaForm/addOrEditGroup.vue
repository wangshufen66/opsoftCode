<template>
  <div>
    <el-dialog
      v-model="groupObj.show"
      :visible.sync="groupObj.show"
      :title="groupObj.title"
      @closed="closeFunc('accountRef')"
    >
      <el-form
        ref="accountRef"
        :model="groupObj.data"
        :rules="groupRules"
        label-width="140px"
        size="medium"
        label-position="right"
      >
        <el-form-item label="分组代码" prop="number">
          <el-input
            placeholder="请输入分组代码"
            v-model.trim="groupObj.data.number"
          />
        </el-form-item>
        <el-form-item label="分组名称" prop="name">
          <el-input
            placeholder="请输入分组名称"
            v-model.trim="groupObj.data.name"
          />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model.trim="groupObj.data.note" />
        </el-form-item>
      </el-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ groupObj.title }}</span>
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
import { addGroup, updateGroup } from "@/api/factoryModel/group";

export default {
  name: "EditPassword",
  data() {
    return {
      groupRules: {
        number: [
          { required: true, message: "分组代码不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    groupObj: {
      type: Object,
    },
  },
  methods: {
    // 关闭窗口
    closeFunc(data) {
      this.groupObj.show = false;
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
      if (!this.groupObj.data.id) {
        // let param={
        //   userId:this.groupObj.data.id,
        //   userPasswordOld:this.groupObj.data.oldPassword,
        //   userPasswordNew:this.groupObj.data.password
        // }
        addGroup(this.groupObj.data).then((res) => {
          if (res.data.code === 200 && res.status === 200) {
            this.$message.success("提交成功!");
            this.groupObj.show = false;
            this.$emit("findGroupListFunc");
          } else {
            this.$notifyError("提交失败!", res.data.msg);
          }
        });
      } else {
        updateGroup(this.groupObj.data).then((res) => {
          if (res.data.code === 200 && res.status === 200) {
            this.$message.success("提交成功!");
            this.groupObj.show = false;
            this.$emit("findGroupListFunc");
          } else {
            this.$notifyError("提交失败!", res.data.msg);
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../styles/diaForm.less";
</style>
