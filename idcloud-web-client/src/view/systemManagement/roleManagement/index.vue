<template>
  <div class="role">
    <id-tree-table-for-system
      ref="treeTable"
      :authorityName="authorityName"
      treeName="企业"
      tableName="角色"
      customAction
      :customWidth="'180px'"
      :actionBarConfig="actionBarConfig"
      :tableColumns="tableColumns"
      :getTreeList="getTreeList"
      :getTableByTree="getTableByTree"
      :deleteTable="deleteTable"
      @afterGetTablePage="afterGetTablePage"
      @tableAdd="tableAdd"
      @getTableDetail="getTableDetail"
    >
      <template v-slot:moreAction="{ row, column, index }">
        <el-dropdown @command="handleTableRowMenuCommand" style="margin-right: 5px">
          <el-button
            type="primary"
            size="mini"
            plain
          >
            操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item
              :command="{key:'getUserListFunc',row}"
            >
              用户详情
            </el-dropdown-item>
            <el-dropdown-item
              :disabled="!bindingRoleAuthority"
              :command="{key:'bindUserFunc',row}"
            >分配用户
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </id-tree-table-for-system>
    <role
      ref="roleMap"
      :roleData="roleData"
      @getRoleListFunc="getTree"
    ></role>
    <el-drawer title="用户数量详情" width="440" :visible.sync="userListDrawer">
      <el-table
        style="margin: 2px"
        border
        :height="tableHeight+120"
        v-loading="userListLoading"
        :data="userListData"
      >
        <el-table-column property="account" label="登录账号"></el-table-column>
        <el-table-column property="number" label="用户代码"></el-table-column>
        <el-table-column property="name" label="用户姓名"></el-table-column>
      </el-table>
    </el-drawer>
    <bindUser
      ref="addRole2UserModal"
      :modalObj="addRole2UserModalObj"
      @queryList="getTree"
    ></bindUser>
  </div>
</template>
<script>
import IdTreeTableForSystem from "@/components/id-pages/IdTreeTableForSystem";
import IdButtonConfig from "@/components/id-button/IdButtonConfig";
import {
  findRoleList,
  delRole,
  findSelectedUserForRole,
} from "@/api/systemManagement/role";
import role from "@/components/diaForm/addOrEditRole";
import { getOrgList } from "@/api/systemManagement/org";
import bindUser from "@/components/diaForm/bindUserOrRole";
import resizeTableHeightMixins from "@/mixins/resizeTableHeightMixins";
import authority from "@/components/authority";

export default {
  name: "role_management",
  data() {
    return {
      actionBarConfig: [
        new IdButtonConfig("button-add", "添加", "add", { type: "primary" }),
        new IdButtonConfig("button-fresh", "刷新", "fresh", {
          styleTwo: true,
          beforeIf: true,
          beforeClass: "el-icon-refresh-right",
        }),
      ],//操作行配置
      authorityName: "role_management",//按钮权限的开头命名
      tableColumns: [
        {
          tag: "el-table-column",
          label: "角色名称",
          prop: "name",
          width: 180,
          showOverflowTooltip: true,
          comp: "String",
        },
        {
          tag: "el-table-column",
          label: "角色类型",
          prop: "typeName",
          width: 120,
          showOverflowTooltip: true,
          comp: "Select",
          options: [
            {
              label: "系统内建角色",
              value: "0",
              authority: new authority(),
            },
            {
              label: "功能权限角色",
              value: "1",
              authority: new authority(),
            },
            {
              label: "组织权限角色",
              value: "2",
              authority: new authority(),
            },
          ],
        },
        {
          tag: "el-table-column",
          label: "用户数量",
          prop: "userCount",
          width: 120,
          showOverflowTooltip: true,
          comp: "Number",
        },
        {
          tag: "el-table-column",
          label: "创建时间",
          prop: "createTime",
          width: 180,
          showOverflowTooltip: true,
          comp: "Datetime",
        },
        {
          tag: "el-table-column",
          label: "修改时间",
          prop: "updateTime",
          width: 180,
          showOverflowTooltip: true,
          comp: "Datetime",
        },
        {
          tag: "el-table-column",
          label: "备注",
          prop: "description",
          width: 250,
          showOverflowTooltip: true,
          comp: "String",
        },
        //此列只有列权限
        // {
        //   tag: "el-table-column-template",
        //   fixed: "right",
        //   label: "操作",
        //   align: "center",
        //   width: 140,
        //   component: {
        //     tag: "id-action-bar",
        //     actionButtonSize: "mini",
        //     idConfig: [
        //       new IdButtonConfig("row-edit", "编辑", "rowEdit", { plain: true, type: "primary" }),
        //       new IdButtonConfig("row-delete", "删除", "rowDelete", { plain: true, type: "danger" }),
        //     ],
        //   },
        // },
        //该列的权限分为行权限和列权限  所以单纯列权限是无法实现的
      ], //表格列配置
      // 添加/编辑角色
      roleData: {
        show: false,
        title: "",
        data: {},
      },
      //绑定界面
      addRole2UserModalObj: {
        diaTitle: "分配用户",
        transferTitle: ["可选用户", "已选用户"],
        show: false,
        operateObj: "", // 编辑传入用户信息，新增就是空字符串
      },
      // 用户数量详细信息
      userListDrawer: false,
      userListLoading: false,
      userListData: [], //右侧抽屉数据

      bindingRoleAuthority: false,
    };
  },
  mixins:[resizeTableHeightMixins],
  computed: {
    getTreeList() {
      return getOrgList;
    },
    getTableByTree() {
      return findRoleList;
    },
    deleteTable() {
      return delRole;
    },
  },
  components: {
    role,
    bindUser,
    IdTreeTableForSystem,
  },
  created() {
    //操作行权限
    this.actionBarConfig[0].idDisable =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === `${this.authorityName}_add`) < 0;
    this.bindingRoleAuthority =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === "role_management_binding_user") >= 0;
  },
  methods: {
    //行操作相关
    handleTableRowMenuCommand(command) {
      switch (command.key) {
        case "getUserListFunc":
          this.getUserListFunc(command.row);
          break;
        case "bindUserFunc":
          this.bindUserFunc(command.row);
          break;
      }
    },
    //获取角色的用户列表
    getUserListFunc(data) {
      this.userListLoading = true;
      findSelectedUserForRole({
        roleId: data.id,
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.userListData = JSON.parse(JSON.stringify(res.data.data));
            this.$nextTick(() => {
              this.userListDrawer = true;
            });
          } else {
            this.$notifyError("获取角色的用户列表失败", res.data.msg);
          }
          this.userListLoading = false;
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    //绑定用户
    bindUserFunc(row) {
      this.$refs.addRole2UserModal.queryUserList(
        row,
        this.$refs.treeTable.treeSelectData.id,
      );
      this.addRole2UserModalObj.show = true;
    },
    //通用方法
    getTree() {
      this.$refs.treeTable.findOrgListFunc();
    },
    afterGetTablePage(data) {
      const statusCompare = {
        0: "系统内建角色",
        1: "功能权限角色",
        2: "组织权限角色",
      };
      data.forEach((item) => {
        item.typeName = statusCompare[item.type];
      });
    },
    tableAdd(treeSelectData) {
      if (!treeSelectData.id) {
        this.$message.warning("请选择你的企业");
        return;
      }
      this.roleData.title = "添加角色";
      this.roleData.data = {
        id: "",
        type: "",
        name: "",
        description: "",
        authorityList: [],
      };
      this.roleData.data.pid = this.$store.state.user.userInfo.id;
      this.roleData.data.orgId = treeSelectData.id;
      this.roleData.data.orgNumber = treeSelectData.number;
      this.roleData.editRoleAuthority = !this.actionBarConfig[0].idDisable;
      this.roleData.data.type = "1";
      this.$refs.roleMap.getAllAuthorityListFunc([]);
    },
    getTableDetail(data, editFormAuthority) {
      this.roleData.title = "修改角色";
      this.roleData.data = {...data};
      this.roleData.data.type = String(this.roleData.data.type);
      this.roleData.editRoleAuthority = editFormAuthority;
      this.$refs.roleMap.getRoleOwnList();
    },
  },
};
</script>

