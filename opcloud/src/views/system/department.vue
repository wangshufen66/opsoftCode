<template>
  <div class="role-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form mode="topForm" :inline="true" @submit.prevent>
          <el-form-item label="部门">
            <el-input
              type="text"
              placeholder="请输入部门名称"
              v-model.trim="searchForm.departmentName"
              clearable
              @keyup.enter="onSearch"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button class="btn-search" type="primary" plain @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" plain @click="onAdd">新增部门</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #operatColumn>
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="onDelete(scope.row.departmentId)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <el-dialog v-model="dialogVisible" @close="dialoagClose" destroy-on-close width="600px">
      <template v-slot:title>
        <dialog-title title></dialog-title>
      </template>
      <!-- @open="dialogOpen" -->
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input
            v-model="dataForm.departmentName"
            placeholder="请输入部门名称"
            style="width: 100%"
            maxlength="32"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="部门代码" prop="departmentCode">
          <el-input
            v-model="dataForm.departmentCode"
            placeholder="请输入部门代码"
            maxlength="32"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="dataForm.remark"
            maxlength="50"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import tableColums from '@/config/tableConfig/department';
import { confirmBox, messageAlert } from '@/shared/utils/utils';

import {
  addDepartment,
  getDepartmentList,
  updateDepartment,
  delDepartment,
} from '@/api/system';

// 查询表单参数
const searchForm = reactive({
  // roleName: undefined,
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
  departmentCode: '',
  departmentName: '',
  departmentId: '',
  remark: '',
  orgId: '',
});
// 场景列表
const sceneList = reactive({
  options: [{
    value: '选项1',
    label: '黄金糕'
  }, {
    value: '选项2',
    label: '双皮奶',

  }],
  scene: ''
})
const rowList = reactive({
  options: [{
    value: 'dataForm.departmentName',
    label: '部门名称',
    type: 'text'
  }, {
    value: 'dataForm.departmentCode',
    label: '部门代码',
    type: 'text'
  }, {
    value: 'dataForm.remark',
    label: '备注',
    type: 'date'
  }]
})

//保存按钮的loading
const subLoading = ref<boolean>(false);
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? '编辑部门' : '新增部门';
});

//添加和编辑表单的验证规则
const formRules = reactive({
  departmentCode: [
    { required: true, message: '请输入部门代码', trigger: 'blur' },
    {
      pattern: /^[\w-]{1,32}$/i,
      message: '只能输入数字、字母、下划线和-且不能超过32',
      trigger: 'blur',
    },
  ],
  departmentName: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
  ],
  remark: [{ message: '请输入备注', trigger: 'blur' }],
});

// 查询
function onSearch() {
  pagination.current = 1;
  getDataList();
}
// 获取数据
async function getDataList() {
  const params = {
    ...searchForm,
    ...pagination,
  };
  const res = await getDepartmentList(params);
  const { code, data } = res;
  if (code === 200) {
    tableOption.tableData = data.records;
    tableOption.total = data.total;
    tableOption.tableLoading = true;
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
  dataForm.departmentCode = '';
  dataForm.departmentName = '';
  dataForm.remark = '';
}

//新增部门
function onAdd() {
  isEdit.value = false;
  dialogVisible.value = true;
}

// 编辑角色
async function onEdit(row: any) {
  isEdit.value = true;
  dialogVisible.value = true;
  dataForm.remark = row.remark;
  dataForm.departmentId = row.departmentId;
  dataForm.departmentName = row.departmentName;
  dataForm.orgId = row.orgId;
  dataForm.departmentCode = row.departmentCode;
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    subLoading.value = true;
    if (!isEdit.value) {
      const res = await addDepartment(dataForm);
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
        dialogVisible.value = false;
      }
      subLoading.value = false;
    } else {
      const res = await updateDepartment(dataForm);
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
        dialogVisible.value = false;
      }
      subLoading.value = false;
    }
  });
}

//删除
function onDelete(departmentId) {
  let delDepartmentlist = [];
  delDepartmentlist.push({ departmentId: departmentId });

  confirmBox('删除该部门', async () => {
    const res = await delDepartment(delDepartmentlist);
    if (res.code === 200) {
      messageAlert('success', res.msg)
      getDataList();
    }
  });
}

getDataList();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/role.scss";
</style>

