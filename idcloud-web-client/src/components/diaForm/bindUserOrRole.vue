<template>
  <div class="addRole2UserModal">
    <el-dialog
      v-model="modalObj.show"
      :visible.sync="modalObj.show"
      :title="modalObj.diaTitle"
      @closed="modalObj.show = false"
      :show-close="false"
      width="625px"
    >
      <!--<el-form ref="distributeRoles" :model="userInfo" :rules="userRules" label-width="50px"-->
      <!--label-position="right">-->
      <!--<FormItem label="账号">-->
      <!--<Input v-model="userInfo.account" disabled/>-->
      <!--</FormItem>-->
      <!--<FormItem label="姓名">-->
      <!--<Input v-model="userInfo.name" disabled/>-->
      <!--</FormItem>-->
      <!--<el-form-item label="权限" prop="roleMenu">-->
      <el-transfer
        class="el-transfer-bind"
        :titles="modalObj.transferTitle"
        :data="allList"
        v-model="selectList"
        style="display: inline"
        @change="handleRoleMenuChange"
      >
        <span slot-scope="{ option }">{{ option.label }}</span>
      </el-transfer>
      <!--</el-form-item>-->
      <!--<FormItem align="right" class="custom-modal-footer">-->
      <!--<Button type="warning" @click="modalObj.show = false" style="margin-right: 10px;">取消</Button>-->
      <!--<Button type="primary" @click="addRolesToUser" class="common-button-style" :loading="modalLoading"-->
      <!--:disabled="modalLoading">确认-->
      <!--</Button>-->
      <!--</FormItem>-->
      <!--</el-form>-->
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ modalObj.diaTitle }}</span>
        <el-switch
          style="margin-left: 350px"
          v-model="transferDataType"
          active-text="全部企业"
          inactive-text="本企业"
          @change="transferDataTypeChange"
        >
        </el-switch>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button
          @click="modalObj.show = false"
          style="margin-right: 10px"
          size="medium"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="confirmTo"
          :loading="modalLoading"
          :disabled="modalLoading"
          size="medium"
          >确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  bindRoleByUser,
  // ,findAllUserListByRole
} from "@/api/systemManagement/user";
import {
  bindUsersByRole,
  findSelectableRoleList,
  findSelectedRoleList,
  findSelectedUserForRole,
  findSelectableUserForRole,
  // findRoleList
} from "@/api/systemManagement/role";

export default {
  name: "bindUseOrRole",
  props: {
    modalObj: {
      type: Object,
      required: true,
    },
    // userInfo: {
    //   type: Object,
    //   required: true
    // },
    // transferObj: {
    //   type: Object,
    //   required: true
    // },
  },
  data() {
    return {
      modalLoading: false,
      // transferTitles: ['可选角色', '已有角色'],
      allList: [],
      selectList: [], // 它里面的id必须是roleList里面有的才行
      userRules: {},
      dataList: [], //列表缓存数据
      transferDataType: false,
    };
  },
  mounted() {
    // this.queryRoleList()
  },
  watch: {
    "modalObj.show": function (val, oldVal) {
      if (val) {
        // userInfo的角色数组构建userHaveRoles
        // if (this.userInfo.roleList === undefined) {
        // } else {
        //   for (let i of this.userInfo.roleList) {
        //     this.selectList.push(i.id)
        //   }
        // }
      } else {
        this.selectList = [];
      }
    },
  },
  methods: {
    //
    transferDataTypeChange() {
      // console.log(1)
      this.changeTransferData(this.dataList);
    },
    //
    changeTransferData(data) {
      this.allList = [];
      // console.log(this.dataList)
      for (let i of data) {
        if (!this.transferDataType) {
          if (this.modalObj.orgId !== i.org.id) {
            // console.log('跳过')
            continue;
          }
        }
        if (i.org.id !== undefined) {
          i.key = -i.org.id;
          i.label = i.org.name;
          i.disabled = true;
          this.allList.push(i);
        }
        if (this.modalObj.diaTitle === "分配用户") {
          if (i.userList.length > 0)
            i.userList.forEach((item) => {
              item.key = item.id;
              item.label = item.name;
              item.disabled = false;
              this.allList.push(item);
            });
        } else {
          if (i.roleList.length > 0)
            i.roleList.forEach((item) => {
              item.key = item.id;
              item.label = item.name;
              item.disabled = false;
              this.allList.push(item);
            });
        }
        // console.log(this.allList)
      }
    },
    //
    handleRoleMenuChange(newTargetKeys, direction, moveKeys) {
      this.selectList = newTargetKeys;
    },
    //
    async queryRoleList() {
      let param = {
        orgId: this.modalObj.orgId,
        userId: this.modalObj.id,
      };
      this.allList = [];
      await findSelectableRoleList(param).then((res) => {
        if (res.data.code === 200) {
          // 构建可选角色列表
          this.dataList = res.data.data;
          //系统管理修改项
          this.changeTransferData(res.data.data);
        } else {
          this.$notifyError("获取所有角色信息异常！",res.data.msg);
        }
      });

      let paramSelect = {
        orgId: this.modalObj.orgId,
        userId: this.modalObj.id,
      };
      await findSelectedRoleList(paramSelect).then((res) => {
        if (res.data.code === 200) {
          // 构建可选角色列表
          for (let i of res.data.data) {
            this.selectList.push(i.id);
          }
        } else {
          this.$notifyError("获取用户已选角色信息异常！",res.data.msg);
        }
      });
    },
    //
    async queryUserList(roleRow, orgId) {
      this.modalObj.orgId = orgId;
      this.modalObj.row = roleRow;
      let param = {
        orgId: orgId,
        roleId: roleRow.id,
      };
      this.allList = [];
      await findSelectableUserForRole(param).then((res) => {
        if (res.data.code === 200) {
          // 构建可选角色列表
          this.dataList = res.data.data;
          //系统管理修改项
          this.changeTransferData(res.data.data);
        } else {
          this.$notifyError("获取所有角色信息异常！",res.data.msg);
        }
      });

      let paramSelect = {
        orgId: orgId,
        roleId: roleRow.id,
      };
      await findSelectedUserForRole(paramSelect).then((res) => {
        if (res.data.code === 200) {
          // 构建可选角色列表
          for (let i of res.data.data) {
            this.selectList.push(i.id);
          }
        } else {
          this.$notifyError("获取用户已选角色信息异常！",res.data.msg);
        }
      });
    },
    //
    confirmTo() {
      if (this.modalObj.diaTitle === "分配角色") this.addRolesToUser();
      else if (this.modalObj.diaTitle === "分配用户") this.addUserToRole();
    },
    //分配用户给角色
    addUserToRole() {
      let roleListData = [];
      for (let i of this.selectList) {
        roleListData.push({
          id: i,
          // type: this.allList[this.allList.findIndex(item => item.id === i)].type,
        });
      }
      let params = {
        roleId: this.modalObj.row.id,
        userList: roleListData,
        orgId: this.modalObj.orgId,
        roleType: this.modalObj.row.type,
      };
      bindUsersByRole(params)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success("用户分配成功");
            this.allList = [];
            this.selectList = [];
            // 关闭窗口
            this.modalObj.show = false;
            // 刷新父组件 用户列表
            this.$emit("queryList");
          } else {
            this.$notifyError( "用户分配异常",res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    //分配角色给用户
    addRolesToUser() {
      let roleListData = [];
      // console.log(this.allList)
      for (let i of this.selectList) {
        roleListData.push({
          id: i,
          type: this.allList[this.allList.findIndex((item) => item.id === i)]
            .type,
          orgId: this.allList[this.allList.findIndex((item) => item.id === i)]
            .orgId,
        });
      }
      let params = {
        userId: this.modalObj.id,
        roleList: roleListData,
        orgId: this.modalObj.orgId,
      };
      bindRoleByUser(params)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success("角色分配成功");
            this.allList = [];
            this.selectList = [];
            // 关闭窗口
            this.modalObj.show = false;
            // 刷新父组件 用户列表
            this.$emit("queryList");
          } else {
            this.$notifyError("角色分配异常",res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../styles/diaForm.less";

.el-transfer-bind {
  /deep/ .el-checkbox-group.el-transfer-panel__list {
    /deep/ .el-checkbox.el-transfer-panel__item {
      margin-left: 20px;
    }

    /deep/ .el-checkbox.el-transfer-panel__item.is-disabled {
      margin-left: 0px;
    }
  }
}
</style>
