<template>
  <div class="role-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form :model="searchForm" :inline="true" @submit.prevent>
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
        <el-tag
          :type="data.auditStatus ? 'success' : 'danger'"
        >{{ data.auditStatus ? '已审核' : '未审核' }}</el-tag>
      </template>
      <template #col_disableStatus="{ data }">
        <el-tag
          :type="data.disableStatus ? 'danger' : 'success'"
        >{{ data.disableStatus ? '已禁用' : '未禁用' }}</el-tag>
      </template>
      <template #operatColumn>
        <el-table-column label="操作" min-width="200">
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

    <el-dialog v-model="dialogVisible" @close="dialoagClose" destroy-on-close width="600px">
      <template v-slot:title>
        <dialog-title :title="formTitle"></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dataForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>

    <permission-setting v-model:visible="permission.visible" :rkey="permission.roleId"></permission-setting>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, ref } from 'vue';
import tableColums from '@/config/tableConfig/sysRoleList';
import PermissionSetting from './setting.vue'
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
import { confirmBox, messageAlert } from '@/shared/utils/utils';

//表单ref
const formRef = ref<any>(null);
//保存按钮的loading
const subLoading = ref<boolean>(false);
// 是否显示弹框
const dialogVisible = ref<boolean>(false);

const formTitle = ref<string>("");

const permission = reactive({
  visible: false,
  roleId: ''
})

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
});

const pagination = reactive({
  current: 1,
  size: 15,
});

//添加和编辑的表单
const dataForm = reactive({
  roleName: '',
  roleId: '',
});

//添加和编辑表单的验证规则
const formRules = reactive({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
});

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
  pagination.current = 1
  pagination.size = pageSize as number;
  getDataList();
}

// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current = pageIndex as number;
  getDataList();
}

//弹框关闭
function dialoagClose() {
  formRef.value.clearValidate();
  formRef.value.resetFields();
}

//新增角色
function onAdd() {
  formTitle.value = "新增角色";
  dataForm.roleId = '';
  dialogVisible.value = true;
}

// 编辑角色
async function onEdit(row: any) {
  formTitle.value = "编辑角色";
  dialogVisible.value = true;
  nextTick(() => {
    dataForm.roleName = row.roleName;
    dataForm.roleId = row.roleId;
  })
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    subLoading.value = true;
    const req = !dataForm.roleId ? addRole(dataForm) : editRole(dataForm);
    const res = await req;
    dialogVisible.value = false;
    subLoading.value = false;
    if (res.code === 200) {
      messageAlert('success', res.msg)
      getDataList();
    }
  });
}

//禁用
function onDisable(row) {
  confirmBox(row.disableStatus ? '解除该角色禁用状态' : '禁用该角色', async () => {
    const req = row.disableStatus ? antiDisableRole({ roleId: row.roleId }) : disableRole({ roleId: row.roleId });
    const res = await req;
    if (res.code === 200) {
      messageAlert('success', res.msg)
      getDataList();
    }
  });
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

//授权
function onAuth(row) {
  permission.visible = true;
  permission.roleId = row.roleId;
}

getDataList();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/role.scss";
</style>
