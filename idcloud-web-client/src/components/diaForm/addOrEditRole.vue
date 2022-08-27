<template>
  <div>
    <el-dialog
      v-model="roleData.show"
      :visible.sync="roleData.show"
      :title="roleData.title"
      :mask-closable="false"
      top="30px"
      width="70%"
      footer-hide
      class="bind-role-wrap"
      @closed="closeRoleFunc('roleForm')"
    >
      <el-form
        ref="roleForm"
        :model="roleData.data"
        :rules="roleRules"
        label-width="100px"
        label-position="right"
        :inline="true"
        size="medium"
        style="margin-bottom: 20px"
      >
        <el-form-item label="角色" prop="name">
          <el-input
            :disabled="!roleData.editRoleAuthority"
            v-model="roleData.data.name"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="type">
          <el-select
            disabled
            v-model.trim="roleData.data.type"
            placeholder="角色类型"
            @change="typeChange"
          >
            <!--<el-option label="系统内建角色" value="0"></el-option>-->
            <el-option label="功能权限角色" value="1"></el-option>
            <!--<el-option label="组织权限角色" value="2"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input
            :disabled="!roleData.editRoleAuthority"
            v-model="roleData.data.description"
            placeholder="请输入描述信息"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="roleData.data.id" label="用户数量" prop="userCount">
          <el-input v-model="roleData.data.userCount" disabled></el-input>
        </el-form-item>

        <el-row style="width: 975px; margin-left: 30px">
          <el-col
            :span="16"
            align="left"
            style="display: flex; flex-direction: row"
          >
            <label style="width: 70px; font-size: 14px">可选权限</label>
            <el-cascader-panel
              class="elCascaderPanel"
              ref="elCascaderPanel"
              :style="{ width: authWidth }"
              :disabled="!roleData.editRoleAuthority"
              v-model="selectAuth"
              :props="{ checkStrictly: false, emitPath: true, multiple: true }"
              :options="authTreeData"
            ></el-cascader-panel>
          </el-col>
          <el-col :span="2" style="margin-left: -10px" align="center">
            <label style="width: 70px; font-size: 14px">已选权限</label>
            <el-button
              style="margin-top: 150px"
              :disabled="!roleData.editRoleAuthority"
              icon="el-icon-d-arrow-right"
              title="确认"
              size="mini"
              @click="selectFunc"
            ></el-button>
          </el-col>
          <el-col :span="6" style="display: flex; flex-direction: row">
            <el-tree
              ref="elTree"
              style="
                height: 385px;
                width: 250px;
                overflow: auto;
                border: 1px solid #e4e7ed;
                border-radius: 4px;
              "
              :disabled="!roleData.editRoleAuthority"
              :data="sedTreeData"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <i
                    class="el-icon-error"
                    @click="() => remove(node, data)"
                  ></i>
                </span>
              </span>
            </el-tree>
          </el-col>
        </el-row>
      </el-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ roleData.title }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button type="error" @click="closeRoleFunc('roleForm')"
        >取消
        </el-button
        >
        <el-button
          type="primary"
          :disabled="!roleData.editRoleAuthority"
          @click="saveRoleFunc('roleForm')"
        >确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findAuthorityListByRole,
  findOrgListByRole,
  findAuthorityListByOrg,
  // saveRole
  addRole,
  editRole,
} from "@/api/systemManagement/role";
import { getOrgList } from "@/api/systemManagement/org";

export default {
  name: "AddOrEditRole",
  data() {
    return {
      //权限级联选择器相关参数----------------------
      authWidth: "570px",
      //--------------------------------------------------
      roleRules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "角色类型不能为空", trigger: "blur" },
        ],
      },
      selectAuth: [], //左侧选中的权限数据
      authTreeData: [], //左侧全部权限数据
      cacheSedTreeData: [], // 已选选中权限  列表结构 =》 对应 sedTreeData
      sedTreeData: [], //右侧树形目录数据=》已选权限数据  树形目录结构
      basicData: [], //原始数据，未进行修改
    };
  },
  props: {
    roleData: {
      editRoleAuthority: false,
      type: Object,
    },
  },
  mounted() {
  },
  methods: {
    //删除节点
    remove(node, data) {
      //原代码
      this.$refs.elTree.remove(node);
      let nowSelect = [];
      this.selectAuth.forEach((item) => {
        if (item[node.data.level - 1] !== node.data.id) nowSelect.push(item);
      });
      this.selectAuth = nowSelect;
      //复制的代码   需要抽出方法或者优化下面的方法
      let selectArray = [];
      if (this.selectAuth.length > 0) {
        this.selectAuth.forEach((item) => {
          item.forEach((item1) => {
            if (selectArray.findIndex((item2) => item2 === item1) < 0)
              selectArray.push(item1);
          });
        });
        this.cacheSedTreeData = [];
        this.basicData.forEach((item) => {
          if (selectArray.findIndex((number) => number === item.id) >= 0)
            this.cacheSedTreeData.push(item);
        });
      }
    },
    //选择角色类型时 获取所有权限的列表  功能=>功能列表 组织=》企业列表
    typeChange() {
      if (this.roleData.data.type === "1") this.getAllAuthorityListFunc([]);
      else if (this.roleData.data.type === "2") this.getAllOrgListFunc([]);
    },
    /* 获取角色的权限列表 */
    getRoleOwnList() {
      // console.log(this.$store.state.user)
      if (this.roleData.data.id === "") return;
      else {
        let sedAuthData = [];
        if (
          this.roleData.data.type === "1" ||
          this.roleData.data.type === "2"
        ) {
          findAuthorityListByRole({
            roleId: this.roleData.data.id,
          }).then((res) => {
            if (res.status === 200 && res.data.code === 200) {
              res.data.data.authorityList.forEach((item) => {
                item.label = item.name;
                item.key = item.number;
              });
              sedAuthData = JSON.parse(
                JSON.stringify(res.data.data.authorityList),
              );
              this.getAllAuthorityListFunc(sedAuthData);
            } else {
              this.$notifyError("获取角色的权限列表失败", res.data.msg);
            }
          });
        } else if (this.roleData.data.type === "3") {
          findOrgListByRole({
            roleId: this.roleData.data.id,
          }).then((res) => {
            if (res.status === 200 && res.data.code === 200) {
              res.data.data.forEach((item) => {
                // item.label = item.authority_name
                // item.key = item.authority_uid
                item.label = item.name;
                item.key = item.number;
              });
              sedAuthData = JSON.parse(JSON.stringify(res.data.data));
              this.getAllOrgListFunc(sedAuthData);
            } else {
              this.$notifyError("获取角色的权限列表失败", res.data.msg);
            }
          });
        }
      }
    },
    /* 获取全部【企业】权限列表 传值为空就是获取全部 */
    getAllOrgListFunc(sedAuthData) {
      getOrgList()
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            res.data.data.forEach((item) => {
              item.value = item.id;
              item.label = item.name;
            });
            this.basicData = res.data.data;
            let allAuthData = JSON.parse(JSON.stringify(res.data.data));
            // 遍历数组，校验选中状态 node_checked 0 未选 1 半选 2 全选
            // if (sedAuthData.length > 0) {
            //   allAuthData.forEach(treeItem => {
            //     treeItem.checked = false
            //     sedAuthData.forEach(sedItem => {
            //       if (treeItem.id === sedItem.id) {
            //         // if (sedItem.node_checked === 2) {
            //         treeItem.checked = true
            //         // }
            //       }
            //     })
            //   })
            // }
            // 角色的权限列表生成树形数据
            this.sedTreeData = this.getTreeData2Func(sedAuthData);
            // 展示在 右侧
            this.cacheSedTreeData = sedAuthData;
            // 全部权限列表生成树形图
            this.authTreeData = this.getTreeData2Func(allAuthData);
          } else {
            this.$notifyError("获取全部权限列表失败", res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally((this.roleData.show = true));
    },
    /* 获取全部【功能】权限列表 传值为空就是获取全部 */
    getAllAuthorityListFunc(sedAuthData) {
      findAuthorityListByOrg({
        orgId: this.roleData.data.orgId,
      })
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            res.data.data.forEach((item) => {
              // console.log(item.id)
              item.value = item.id;
              item.label = item.name;
            });
            this.basicData = res.data.data;
            let allAuthData = res.data.data;
            // 遍历数组，校验选中状态 node_checked 0 未选 1 半选 2 全选
            if (sedAuthData.length > 0) {
              allAuthData.forEach((treeItem) => {
                sedAuthData.forEach((sedItem) => {
                  if (treeItem.id === sedItem.id) {
                    // if (sedItem.node_checked === 2) {
                    // console.log(treeItem);
                    // console.log(allAuthData.findIndex(item=>item.pNumber===treeItem.number))
                    if (
                      allAuthData.findIndex(
                        (item) => item.pNumber === treeItem.number,
                      ) < 0
                    ) {
                      // treeItem.checked = true//此处无用
                      if (
                        allAuthData.findIndex(
                          (item) => item.number === treeItem.pNumber,
                        ) < 0
                      ) {
                        this.selectAuth.push([treeItem.id]);
                      } else {
                        const pData =
                          allAuthData[
                            allAuthData.findIndex(
                              (item) => item.number === treeItem.pNumber,
                            )
                            ];
                        if (
                          allAuthData.findIndex(
                            (item) => item.number === pData.pNumber,
                          ) >= 0
                        ) {
                          const ppData =
                            allAuthData[
                              allAuthData.findIndex(
                                (item) => item.number === pData.pNumber,
                              )
                              ];
                          if (
                            allAuthData.findIndex(
                              (item) => item.number === ppData.pNumber,
                            ) >= 0
                          ) {
                            const pppData =
                              allAuthData[
                                allAuthData.findIndex(
                                  (item) => item.number === ppData.pNumber,
                                )
                                ];
                            this.selectAuth.push([
                              pppData.id,
                              ppData.id,
                              pData.id,
                              treeItem.id,
                            ]);
                          } else
                            this.selectAuth.push([
                              ppData.id,
                              pData.id,
                              treeItem.id,
                            ]);
                        } else {
                          this.selectAuth.push([pData.id, treeItem.id]);
                        }
                        // console.log(this.selectAuth)
                      }
                    }
                  }
                });
              });
            }
            // 角色的权限列表生成树形数据
            this.sedTreeData = this.getTreeDataFunc(sedAuthData);
            // 展示在 右侧
            this.cacheSedTreeData = sedAuthData;
            // 全部权限列表生成树形图
            this.authTreeData = this.getTreeDataFunc(allAuthData);
            // console.log(this.authTreeData)
            // for (let item of this.authTreeData) {
            //   if (item.children!==undefined) {
            //     for (let child of item.children) {
            //       console.log(child.name)
            //       console.log(child.checked)
            //     }
            //   }
            //   console.log(item.name)
            //   console.log(item.checked)
            // }
          } else {
            this.$notifyError("获取全部权限列表失败", res.data.msg);
          }
        })
        .catch((err) => {
          this.$notifyError("网络请求失败!", "");
          console.log(err);
        })
        .finally((this.roleData.show = true));
    },
    /* 生成树形图 */
    getTreeDataFunc(data) {
      let allData = {
        rawdata: data,
        children: [],
        parent: [],
        expand: true,
      };
      allData.children = this.$utils.toTreeChildrenFunc(data, "number");
      allData.parent = this.$utils.toTreeParentFunc(data, "pNumber");
      return this.$utils.toTreeDataFunc(allData);
    },
    getTreeData2Func(data) {
      let allData = {
        rawdata: data,
        children: [],
        parent: [],
        expand: true,
      };
      allData.children = this.$utils.toTreeChildrenFunc(data, "id");
      allData.parent = this.$utils.toTreeParentFunc(data, "pid");
      return this.$utils.toTreeDataFunc(allData);
    },
    /* 选择复选框 */
    // selCheckFunc(selectIds) {
    //   // console.log(selectIds)
    //   this.cacheSedTreeData = selectIds
    //   // console.log(this.$refs.elCascaderPanel.getCheckedNodes())
    //   // 获取树形图 选中和半选中 数据节点
    //   // this.$refs.treeModalMap.getNodesFunc()
    //   // this.nodeData = JSON.parse(JSON.stringify(this.$refs.treeModalMap.nodeData))
    //
    //   // 将数据节点 数组数据 生成新的 树形图
    //   // this.getCacheSedTreeFunc(this.nodeData)
    // },
    /* 将点选的数组 生成 树形图 数据结构 数据 */
    getCacheSedTreeFunc(data) {
      // 清空 缓存数据
      this.cacheSedTreeData = [];
      if (this.roleData.data.type === "1")
        this.cacheSedTreeData = this.getTreeDataFunc(data);
      else if (this.roleData.data.type === "2")
        this.cacheSedTreeData = this.getTreeData2Func(data);
    },
    /* 确认选择 */
    selectFunc() {
      let selectArray = [];
      if (this.selectAuth.length > 0) {
        this.selectAuth.forEach((item) => {
          item.forEach((item1) => {
            if (selectArray.findIndex((item2) => item2 === item1) < 0)
              selectArray.push(item1);
          });
        });
        this.cacheSedTreeData = [];
        this.basicData.forEach((item) => {
          if (selectArray.findIndex((number) => number === item.id) >= 0)
            this.cacheSedTreeData.push(item);
        });
        // this.sedTreeData = this.cacheSedTreeData
        this.sedTreeData = this.getTreeDataFunc(this.cacheSedTreeData);
      } else this.sedTreeData = [];
      // console.log(this.cacheSedTreeData)
      // console.log(this.selectAuth)
    },
    /* 关闭窗口 */
    closeRoleFunc(data) {
      // this.roleData.data = []
      // 关闭窗口
      // console.log(this.$refs.elCascaderPanel)
      this.roleData.show = false;
      this.$refs.elCascaderPanel.clearCheckedNodes();
      this.sedTreeData = [];
      // this.authTreeData = []
      this.cacheSedTreeData = [];
      // 清空表单和穿梭框
      this.$refs[data].resetFields();
    },
    /* 将数据节点 数组数据 生成后台需要的 新数组 */
    getAuthListFunc() {
      // 清空 缓存数据
      this.roleData.data.authorityList = [];
      this.cacheSedTreeData.forEach((item) => {
        let tem = {};
        tem.id = item.id;
        // tem.node_checked = item.node_checked
        this.roleData.data.authorityList.push(tem);
      });
    },
    /* 保存角色 */
    saveRoleFunc(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.saveRoleSureFunc(data);
        } else {
          this.$message.error("*为必填项");
        }
      });
    },
    /* 确认保存 */
    saveRoleSureFunc(data) {
      this.getAuthListFunc();
      // if (this.roleData.data.type === "2") {
      //   this.roleData.data.orgList = this.roleData.data.authorityList
      //   this.roleData.data.authorityList = []
      // }
      // console.log(this.roleData.data.authorityList)
      if (this.roleData.data.id === "")
        addRole(this.roleData.data).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("提交成功!");
            // 关闭窗口
            this.closeRoleFunc(data);
            // 刷新角色列表
            this.$emit("getRoleListFunc");
          } else {
            this.$notifyError("提交失败!", res.data.msg);
          }
        });
      else
        editRole(this.roleData.data).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("提交成功!");
            // 关闭窗口
            this.closeRoleFunc(data);
            // 刷新角色列表
            this.$emit("getRoleListFunc");
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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 70px;
}

.elCascaderPanel {
  /*height: 400px;*/
  overflow: auto;

  /deep/ .el-cascader-menu__wrap {
    height: 400px;
    font-weight: normal;
  }

  /deep/ .el-cascader-node.in-active-path {
    font-weight: normal;
  }

  /deep/ .el-cascader-node.is-active {
    font-weight: normal;
  }

  /deep/ .el-cascader-node.is-selectable.in-checked-path {
    font-weight: normal;
  }
}

.el-dialog {
  .el-form {
    /deep/ .el-form-item__error {
      left: 0%;
    }

    .el-form-item {
      .el-input {
        width: 390px;
      }

      .el-select {
        width: 390px;
      }
    }
  }
}
</style>
