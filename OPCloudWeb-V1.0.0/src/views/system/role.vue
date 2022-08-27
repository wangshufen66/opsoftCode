<template>
  <div class="role-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form mode="topForm" :inline="true" @submit.prevent>
          <el-form-item label="角色">
            <el-input
              type="text"
              placeholder="请输入角色名称"
              v-model.trim="searchForm.roleName"
              clearable
              @keyup.enter="onSearch"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button class="btn-search" type="primary" plain @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" plain @click="onAdd">新增角色</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_auditStatus="{ data }">
        <el-tag v-show="data.auditStatus" type="success">已审核</el-tag>
        <el-tag v-show="!data.auditStatus" type="danger">未审核</el-tag>
      </template>
      <template #col_disableStatus="{ data }">
        <el-tag v-show="data.disableStatus" type="danger">已禁用</el-tag>
        <el-tag v-show="!data.disableStatus" type="success">未禁用</el-tag>
      </template>
      <template #col_isUsable="{ data }">
        <el-tag v-show="data.isUsable" type="success">可用</el-tag>
        <el-tag v-show="!data.isUsable" type="danger">不可用</el-tag>
      </template>
      <template #operatColumn>
        <el-table-column label="操作" fixed="right" min-width="280">
          <template #default="scope">
            <text-button @click="onEdit(scope.row)">编辑</text-button>
            <text-button
              :type="scope.row.disableStatus ? 'success' : 'error'"
              @click="onDisable(scope.row)"
            >{{ scope.row.disableStatus ? '启用' : '禁用' }}</text-button>
            <text-button @click="onAuth(scope.row)">授权</text-button>
            <text-button @click="onDelete(scope.row.roleId)">删除</text-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <el-dialog
      :title="formTitle"
      v-model="dialogVisible"
      @close="dialoagClose"
      destroy-on-close
      width="600px"
    >
      <!-- @open="dialogOpen" -->
      <template v-slot:title>
        <dialog-title :title="formTitle"></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="企业名称" prop="orgId">
          <el-select
            class="select-fill"
            v-model="dataForm.orgId"
            placeholder="请选择企业名称"
            filterable
            :disabled="isEdit"
          >
            <el-option
              v-for="item in orgList"
              :key="item.orgId"
              :value="item.orgId"
              :label="item.orgName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dataForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="角色授权"
      v-model="authDialogVisible"
      @close="authClose"
      destroy-on-close
      width="600px"
    >
      <template v-slot:title>
        <dialog-title title="角色授权"></dialog-title>
      </template>
      <el-scrollbar height="60vh">
        <el-tree
          ref="menuTreeRef"
          :data="menuTab.menuData"
          show-checkbox
          node-key="id"
          :props="menuTab.defaultProps"
          :default-expanded-keys="menuTab.selectData"
          :default-checked-keys="menuTab.selectData"
          v-loading.lock="menuLoading"
        ></el-tree>
      </el-scrollbar>
      <template #footer>
        <el-button @click="authDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="authLoading" @click="onSaveAuth">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import tableColums from '@/config/tableConfig/sysRoleList';
import { confirmBox, messageAlert } from '@/utils/utils';
import {
  getRoleList,
  getRoleAuthList,
  getOrgSelect,
  addRole,
  editRole,
  delRole,
  disableRole,
  antiDisableRole,
  auditRole,
  antiAuditRole,
  givePermissions,
} from '@/api/system';

// 查询表单参数
const searchForm = reactive({
  roleName: undefined,
});

//列表配置项
const tableOption = reactive({
  tableData: [],
  tableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
  noTableRight: false,
});

const pagination = reactive({
  current: 1,
  size: 15,
});

//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive({
  orgId: '',
  roleName: '',
  isUsable: '',
  roleId: '',
});
//添加和编辑表单的验证规则
const formRules = reactive({
  orgId: [{ required: true, message: '请选择企业名称', trigger: 'blur' }],
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  isUsable: [{ required: true, message: '请选择状态', trigger: 'blur' }],
});

//保存按钮的loading
const subLoading = ref<boolean>(false);
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? '编辑角色' : '新增角色';
});

//企业名称下拉
let orgList = ref<any>([]);

//菜单loading
const menuLoading = ref<boolean>(false);

//授权保存按钮loading
const authLoading = ref<boolean>(false);

const authDialogVisible = ref<boolean>(false);
//菜单树
const menuTab = reactive({
  menuData: [],
  defaultProps: {
    children: 'children',
    label: 'label',
  },
  selectData: [],
});
const menuTreeRef = ref<any>(null);

//选中的roleid
const activeRole = ref<string | null>(null);

// 查询
function onSearch() {
  pagination.current = 1;
  getDataList();
}
// 获取数据
async function getDataList() {
  tableOption.tableLoading = true;
  const params = {
    ...searchForm,
    ...pagination,
  };
  const res = await getRoleList(params);
  const { code, data } = res;
  if (code === 200) {
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  tableOption.tableLoading = false;
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.size = pageSize as number;
  getDataList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current = pageIndex as number;
  getDataList();
}
//企业下来列表
async function getOrgList() {
  const res = await getOrgSelect({ disableStatus: 0 });
  orgList.value = res.data;
}

//弹框关闭
function dialoagClose() {
  formRef.value.clearValidate();
  dataForm.orgId = '';
  dataForm.roleName = '';
  dataForm.isUsable = '';
  dataForm.roleId = '';
}

//新增角色
function onAdd() {
  isEdit.value = false;
  dialogVisible.value = true;
}

// 编辑角色
async function onEdit(row: any) {
  isEdit.value = true;
  dialogVisible.value = true;
  dataForm.orgId = row.orgId;
  dataForm.roleName = row.roleName;
  dataForm.isUsable = row.isUsable + '';
  dataForm.roleId = row.roleId;
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    subLoading.value = true;
    if (!isEdit.value) {
      const res = await addRole(dataForm);
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
        dialogVisible.value = false;
      }
      subLoading.value = false;
    } else {
      const res = await editRole(dataForm);
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
        dialogVisible.value = false;
      }
      subLoading.value = false;
    }
  });
}

//审核
async function onVerify(row) {
  if (row.auditStatus) {
    //反审核
    confirmBox('去除该角色审核状态', async () => {
      const res = await antiAuditRole({ roleId: row.roleId });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  } else {
    //审核
    confirmBox('审核该角色', async () => {
      const res = await auditRole({ roleId: row.roleId });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  }
}

//禁用
function onDisable(row) {
  if (row.disableStatus) {
    //反禁用
    confirmBox('解除该角色禁用状态', async () => {
      const res = await antiDisableRole({ roleId: row.roleId });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  } else {
    //禁用
    confirmBox('禁用该角色', async () => {
      const res = await disableRole({ roleId: row.roleId });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  }
}

//删除
function onDelete(ids) {
  confirmBox('删除该角色', async () => {
    const res = await delRole({ ids });
    if (res.code === 200) {
      messageAlert('success', res.msg)
      getDataList();
    }
  });
}

//获取菜单树
async function RoleAuthList() {
  const res = await getRoleAuthList({ roleId: activeRole.value });
  if (res.code === 200) {
    menuTab.menuData = res.data.permissionTree;
    menuTab.selectData = res.data.permissions;
  }
}

//授权
function onAuth(row) {
  activeRole.value = row.roleId;
  RoleAuthList();
  authDialogVisible.value = true;
}

//保存授权
async function onSaveAuth() {
  authLoading.value = true;
  const menuOrFuncId: string[] = [],
    permissionType: string[] = [];
  const nodeList = menuTreeRef.value.getCheckedNodes();
  nodeList.forEach((item) => {
    menuOrFuncId.push(item.data.menuOrFuncId);
    permissionType.push(item.data.permissionType);
  });
  let res = await givePermissions({
    menuOrFuncId: menuOrFuncId.toString(),
    permissionType: permissionType.toString(),
    roleId: activeRole.value,
  });
  authLoading.value = false;
  if (res.code === 200) {
    messageAlert('success', res.msg)
    authDialogVisible.value = false;
  }
}

function authClose() {
  menuTab.selectData = [];
}

getDataList();
getOrgList();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/role.scss";
</style>
