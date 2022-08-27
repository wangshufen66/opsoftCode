<template>
  <div class="user_list">
    <id-tree-table-for-system ref="treeTable" :authorityName="authorityName" treeName="企业" tableName="账户" customAction :customWidth="'180px'" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" :getTreeList="getTreeList" :getTableByTree="getTableByTree" :deleteTable="deleteTable" :suspendTable="suspendTable" :deSuspendTable="deSuspendTable" :getTableDetail="getTableDetail" @afterGetTablePage="afterGetTablePage" @tableAdd="tableAdd" @tableEdit="tableEdit">
      <template v-slot:moreAction="{ row, column, index }">
        <el-dropdown @command="handleTableRowMenuCommand" style="margin-right: 5px">
          <el-button type="primary" size="mini" plain>
            操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item :disabled="!bindOrgAuthority || userInfo.id === row.id" :command="{ key: 'bindOrgFunc', row }">
              分配企业
            </el-dropdown-item>
            <el-dropdown-item :disabled="!bindUserAuthority || userInfo.id === row.id" :command="{ key: 'bindRoleFunc', row }">
              分配角色
            </el-dropdown-item>
            <el-dropdown-item :disabled="!updatePasswordAuthority || userInfo.id !== row.id" :command="{ key: 'editPassword', row }">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item :disabled="!resetPasswordAuthority || userInfo.id === row.id" :command="{ key: 'resetPwd', row }">
              重置密码
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </id-tree-table-for-system>

    <user :accountSaveObj="accountSaveObj" @getUserListByOrgFunc="getTree">
    </user>
    <bindRole ref="addRole2UserModal" :modalObj="addRole2UserModalObj" @queryList="getTree">
    </bindRole>
    <password :passwordObj="passwordSaveObj"></password>
    <resetPwdModal :modalObj="resetPwdModalObj"></resetPwdModal>
    <bindOrg ref="bingOrg" :orgData="bindOrgObj"></bindOrg>
  </div>
</template>
<script>
import {
  saveUser,
  resetUserPassword,
  delUser,
  getUserListByOrg,
  suspendUsers,
  deSuspendUsers,
  getUserDetail,
} from '@/api/systemManagement/user';
import resetPwdModal from '@/components/diaForm/resetPassword';
import user from '@/components/diaForm/addOrEditUser';
import bindRole from '@/components/diaForm/bindUserOrRole';
import { getOrgList } from '@/api/systemManagement/org';
import { findRoleList } from '@/api/systemManagement/role';
import password from '@/components/diaForm/editPassword';
import bindOrg from '@/components/diaForm/bindOrg';
import IdTreeTableForSystem from '@/components/id-pages/IdTreeTableForSystem';
import IdButtonConfig from '@/components/id-button/IdButtonConfig';
import authority from '@/components/authority';

export default {
  name: 'user_management',
  components: {
    user,
    resetPwdModal,
    bindRole,
    password,
    bindOrg,
    IdTreeTableForSystem,
  },
  data() {
    return {
      actionBarConfig: [
        new IdButtonConfig('button-add', '添加', 'add', { type: 'primary' }),
        {
          tag: 'id-dropdown',
          text: '禁用',
          childButton: [
            {
              text: '禁用',
              target: 'disable',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              text: '反禁用',
              target: 'unDisable',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
          ],
        },
        new IdButtonConfig('button-fresh', '刷新', 'fresh', {
          styleTwo: true,
          beforeIf: true,
          beforeClass: 'el-icon-refresh-right',
        }),
      ], //操作行配置
      authorityName: 'user_management', //按钮权限的开头命名
      tableColumns: [
        {
          tag: 'el-table-column',
          label: '企业名称',
          prop: 'orgName',
          width: 240,
          showOverflowTooltip: true,
        },
        {
          tag: 'el-table-column',
          label: '登录账号',
          prop: 'account',
          width: 120,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '用户代码',
          prop: 'number',
          width: 120,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '用户姓名',
          prop: 'name',
          width: 120,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column-status-name',
          label: '状态',
          prop: 'statusName',
          width: 80,
          colorType: 1,
          comp: 'Select',
          options: [
            {
              label: '正常',
              value: '0',
              authority: new authority(),
            },
            {
              label: '禁用',
              value: '1',
              authority: new authority(),
            },
          ],
        },
        {
          tag: 'el-table-column-role-list',
          label: '角色列表',
          prop: 'roleList',
          width: 240,
          showOverflowTooltip: true,
        },
        {
          tag: 'el-table-column',
          label: '类型',
          prop: 'typeName',
          width: 130,
          showOverflowTooltip: true,
          comp: 'Select',
          options: [
            {
              label: '普通用户',
              value: '0',
              authority: new authority(),
            },
            {
              label: '注册企业管理员',
              value: '1',
              authority: new authority(),
            },
            {
              label: '组织管理员角色',
              value: '2',
              authority: new authority(),
            },
            {
              label: '平台超级管理员',
              value: '99',
              authority: new authority(),
            },
          ],
        },
        {
          tag: 'el-table-column',
          label: '联系电话',
          prop: 'phone',
          width: 130,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '联系邮箱',
          prop: 'email',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '备注',
          prop: 'description',
          width: 250,
          showOverflowTooltip: true,
          comp: 'String',
        },
        //该列的权限分为行权限和列权限  所以单纯列权限是无法实现的
      ], //表格列配置

      //重置密码
      resetPwdModalObj: {
        show: false,
        target: '',
        msg: '确认重置该用户密码为默认密码（123456）么？',
      },
      //绑定界面
      addRole2UserModalObj: {
        diaTitle: '分配角色',
        transferTitle: ['可选角色', '已选角色'],
        show: false,
        operateObj: '', // 编辑传入用户信息，新增就是空字符串
      },
      //用户相关
      accountSaveObj: {
        show: false,
        title: '编辑用户',
        data: {},
      },
      //修改密码
      passwordSaveObj: {
        show: false,
        title: '修改密码',
        data: {},
      },
      //分配企业
      bindOrgObj: {
        show: false,
        title: '分配企业',
        data: {},
      },

      resetPasswordAuthority: false,
      bindUserAuthority: false,
      updatePasswordAuthority: false,
      bindOrgAuthority: false,
    };
  },
  computed: {
    getTreeList() {
      return getOrgList;
    },
    getTableByTree() {
      return getUserListByOrg;
    },
    deleteTable() {
      return delUser;
    },
    suspendTable() {
      return suspendUsers;
    },
    deSuspendTable() {
      return deSuspendUsers;
    },
    getTableDetail() {
      return getUserDetail;
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    },
  },
  created() {
    //操作行权限
    this.actionBarConfig[0].idDisable =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === `${this.authorityName}_add`
      ) < 0;

    this.actionBarConfig[1].childButton[0].idDisable =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === `${this.authorityName}_suspend`
      ) < 0;

    this.actionBarConfig[1].childButton[1].idDisable =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === `${this.authorityName}_deSuspend`
      ) < 0;

    this.resetPasswordAuthority =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === 'user_management_reset_password'
      ) >= 0;

    this.bindUserAuthority =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === 'user_management_binging_role'
      ) >= 0;

    this.updatePasswordAuthority =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === 'user_management_updatePassword'
      ) >= 0;
    this.bindOrgAuthority =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === 'user_management_binding_org'
      ) >= 0;
  },
  methods: {
    //行操作相关
    handleTableRowMenuCommand(command) {
      switch (command.key) {
        case 'editPassword':
          this.editPassword(command.row);
          break;
        case 'bindRoleFunc':
          this.bindRoleFunc(command.row);
          break;
        case 'resetPwd':
          this.resetPwd(command.row);
          break;
        case 'bindOrgFunc':
          this.bindOrgFunc(command.row);
          break;
      }
    },
    //绑定企业
    bindOrgFunc(row) {
      this.bindOrgObj.data = JSON.parse(JSON.stringify(row));
      this.$refs.bingOrg.getUserOwnOrgList();
    },
    //修改密码
    editPassword(data) {
      this.passwordSaveObj.data = JSON.parse(JSON.stringify(data));
      this.passwordSaveObj.show = true;
    },
    //绑定账户
    bindRoleFunc(row) {
      this.addRole2UserModalObj.id = row.id;
      this.addRole2UserModalObj.orgId = row.orgId;
      this.$refs.addRole2UserModal.queryRoleList();
      this.addRole2UserModalObj.show = true;
    },
    //重置密码
    resetPwd(row) {
      this.resetPwdModalObj.show = true;
      this.resetPwdModalObj.target = row;
    },
    //通用方法
    getTree() {
      this.$refs.treeTable.findOrgListFunc();
    },
    afterGetTablePage(data) {
      for (let oneAccount of data) {
        oneAccount.statusName = oneAccount.status === 0 ? '正常' : '禁用';
        oneAccount.typeName =
          oneAccount.type === 0
            ? '普通用户'
            : (oneAccount.typeName =
                oneAccount.type === 2 ? '组织管理员' : '企业管理员');
        oneAccount._disabled =
          oneAccount.id === this.$store.state.user.userInfo.id;
      }
    },
    tableAdd(treeSelectData) {
      if (!treeSelectData.id) {
        this.$message.warning('请选择你的企业');
        return;
      }

      this.accountSaveObj.title = '新增用户';
      this.accountSaveObj.data = {};
      this.accountSaveObj.data.pid = this.$store.state.user.userInfo.id;
      this.accountSaveObj.data.orgId = treeSelectData.id;
      this.accountSaveObj.data.orgNumber = treeSelectData.number;
      this.accountSaveObj.editUserAuthority = !this.actionBarConfig[0]
        .idDisable;
      this.accountSaveObj.show = true;
    },
    tableEdit(data, editFormAuthority, tableSelectData) {
      this.accountSaveObj.title = '编辑用户';
      this.accountSaveObj.data = JSON.parse(JSON.stringify(data));
      this.accountSaveObj.data.pid = this.$store.state.user.userInfo.id;
      this.accountSaveObj.data.orgId = tableSelectData.id;
      this.accountSaveObj.data.orgNumber = tableSelectData.number;
      this.accountSaveObj.data.type = String(this.accountSaveObj.data.type);
      this.accountSaveObj.data.status = String(this.accountSaveObj.data.status);
      if (data.personNumber !== null || data.personName != null)
        this.accountSaveObj.data.showPerson =
          data.personNumber + '【' + data.personName + '】';
      if (editFormAuthority) {
        if (this.$store.state.user.userInfo.type === 0) {
          this.accountSaveObj.editUserAuthority =
            this.$store.state.user.userInfo.id === data.id;
        } else {
          this.accountSaveObj.editUserAuthority = editFormAuthority;
        }
      } else this.accountSaveObj.editUserAuthority = editFormAuthority;
      this.accountSaveObj.show = true;
    },
  },
};
</script>
