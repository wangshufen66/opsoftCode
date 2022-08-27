<template>
  <div>
    <el-dialog
      v-model="orgData.show"
      :visible.sync="orgData.show"
      :title="orgData.title"
      :mask-closable="false"
      top="30px"
      width="70%"
      footer-hide
      class="bind-role-wrap"
      @closed="closeRoleFunc('roleForm')"
    >
      <el-row style="width: 975px; margin-left: 30px; margin-bottom: 20px">
        <el-col
          :span="16"
          align="left"
          style="display: flex; flex-direction: row"
        >
          <label style="width: 70px; font-size: 14px">可选企业</label>
          <el-cascader-panel
            class="elCascaderPanel"
            ref="elCascaderPanel"
            :style="{ width: authWidth, overflow: 'auto' }"
            v-model="selectAuth"
            :props="{ checkStrictly: true, emitPath: true, multiple: true }"
            :options="authTreeData"
          ></el-cascader-panel>
        </el-col>
        <el-col :span="2" style="margin-left: -10px" align="center">
          <label style="width: 70px; font-size: 14px">已选企业</label>
          <el-button
            style="margin-top: 150px"
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
            :data="sedTreeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <i class="el-icon-error" @click="() => remove(node, data)"></i>
              </span>
            </span>
          </el-tree>
        </el-col>
      </el-row>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ orgData.title }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button type="error" @click="closeRoleFunc('roleForm')"
          >取消</el-button
        >
        <el-button type="primary" @click="saveRoleSureFunc('roleForm')"
          >确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserManagedOrg,
  getUserSelectableOrg,
} from "@/api/systemManagement/org";
import { setUserManagedOrgs } from "@/api/systemManagement/user";

export default {
  name: "bindOrg",
  data() {
    return {
      //权限级联选择器相关参数----------------------
      authWidth: "570px",
      //--------------------------------------------------
      selectAuth: [], //左侧选中的权限数据
      authTreeData: [], //左侧全部权限数据
      cacheSedTreeData: [], // 已选选中权限  列表结构 =》 对应 sedTreeData
      sedTreeData: [], //右侧树形目录数据=》已选权限数据  树形目录结构
      basicData: [], //原始数据，未进行修改
    };
  },
  props: {
    orgData: {
      type: Object,
    },
  },
  mounted() {},
  methods: {
    //删除节点
    remove(node, data) {
      // console.log(this.cacheSedTreeData)
      // console.log(this.selectAuth)
      //原代码
      this.$refs.elTree.remove(node);
      let nowSelect = [];
      this.selectAuth.forEach((item) => {
        // console.log(node)
        if (item[node.level - 1] !== node.data.id) nowSelect.push(item);
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
      } else {
        this.cacheSedTreeData = [];
      }
      // console.log(JSON.stringify(this.selectAuth))
    },
    /* 获取角色的权限列表 */
    getUserOwnOrgList() {
      let sedAuthData = [];
      getUserManagedOrg({
        userId: this.orgData.data.id,
      }).then((res) => {
        if (res.status === 200 && res.data.code === 200) {
          res.data.data.forEach((item) => {
            // item.label = item.authority_name
            // item.key = item.authority_uid
            item.label = item.name;
            item.key = item.id;
          });
          sedAuthData = JSON.parse(JSON.stringify(res.data.data));
          this.getAllOrgListFunc(sedAuthData);
        } else {
          this.$notifyError("获取角色的权限列表失败!", res.data.msg);
        }
      });
    },
    /* 获取全部【功能】列表 传值为空就是获取全部 */
    getAllOrgListFunc(sedAuthData) {
      getUserSelectableOrg({
        orgId: this.orgData.data.orgId,
      })
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            res.data.data.forEach((item) => {
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
                    // console.log(treeItem.id)
                    // console.log(allAuthData.findIndex(item=>item.pid===treeItem.id))
                    if (
                      allAuthData.findIndex(
                        (item) => item.id === treeItem.pid
                      ) >= 0
                    ) {
                      treeItem.checked = true; //此处无用
                      const pData =
                        allAuthData[
                          allAuthData.findIndex(
                            (item) => item.id === treeItem.pid
                          )
                        ];
                      if (
                        allAuthData.findIndex((item) => item.id === pData.pid) >
                        0
                      ) {
                        const ppData =
                          allAuthData[
                            allAuthData.findIndex(
                              (item) => item.id === pData.pid
                            )
                          ];
                        this.selectAuth.push([
                          ppData.id,
                          pData.id,
                          treeItem.id,
                        ]);
                      } else {
                        this.selectAuth.push([pData.id, treeItem.id]);
                      }
                    } else {
                      this.selectAuth.push([treeItem.id]);
                    }
                    // console.log(this.selectAuth)
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
          } else {
            this.$notifyError("获取全部权限列表失败!", res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally((this.orgData.show = true));
    },
    /* 生成树形图 */
    getTreeDataFunc(data) {
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
    /* 确认选择 */
    selectFunc() {
      let selectArray = [];
      if (this.selectAuth.length > 0) {
        this.selectAuth.forEach((item) => {
          // item.forEach(item1 => {
          //   if (selectArray.findIndex(item2 => item2 === item1) < 0)
          //     selectArray.push(item1)
          // })
          // console.log(item)
          selectArray.push(item[item.length - 1]);
          // console.log(selectArray)
        });
        this.cacheSedTreeData = [];
        this.basicData.forEach((item) => {
          if (selectArray.findIndex((number) => number === item.id) >= 0)
            this.cacheSedTreeData.push(item);
        });
        // this.sedTreeData = this.cacheSedTreeData
        this.sedTreeData = this.getTreeDataFunc(this.cacheSedTreeData);
      } else {
        this.sedTreeData = [];
        this.cacheSedTreeData = [];
      }

      // console.log(this.cacheSedTreeData)
      // console.log(JSON.stringify(this.selectAuth))
    },
    /* 关闭窗口 */
    closeRoleFunc() {
      // 关闭窗口
      this.orgData.show = false;
      this.$refs.elCascaderPanel.clearCheckedNodes();
      this.sedTreeData = [];
      // this.authTreeData = []
      this.cacheSedTreeData = [];
    },
    /* 将数据节点 数组数据 生成后台需要的 新数组 */
    getAuthListFunc() {
      // 清空 缓存数据
      this.orgData.data.authorityList = [];
      this.cacheSedTreeData.forEach((item) => {
        // let tem = {}
        // tem.id = item.id
        // tem.node_checked = item.node_checked
        this.orgData.data.authorityList.push(item.id);
      });
      // console.log(this.cacheSedTreeData);
    },
    /* 确认保存 */
    saveRoleSureFunc() {
      this.getAuthListFunc();
      let param = {
        userId: this.orgData.data.id,
        orgIdList: this.orgData.data.authorityList,
      };
      setUserManagedOrgs(param).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("分配企业成功!");
          // 关闭窗口
          this.closeRoleFunc();
          // 刷新角色列表
          this.$emit("getUserListByOrgFunc");
        } else {
          this.$notifyError("操作失败!", res.data.msg);
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
