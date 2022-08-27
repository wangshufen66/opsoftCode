
<template>
  <div class="page-content">
    <div class="page-left">
      <div class="search-wrap">
        <el-input placeholder="输入关键字进行过滤" v-model="department.filterText"></el-input>
      </div>
      <el-tree
        v-loading.lock="department.Loading"
        class="filter-tree"
        :data="department.departmentData"
        :props="department.defaultProps"
        :filter-node-method="filterNode"
        @node-click="onNodeClick"
        node-key="id"
        ref="treeRef"
        :current-node-key="active.id"
        default-expand-all
      ></el-tree>
    </div>
    <div class="page-right" style="margin-bottom:10px">
      <div class="btn-wrap">
        <div>
          <el-button class="btn-add" type="primary" plain @click="onAdd">更换部门</el-button>
          <el-button
            class="btn-del"
            type="primary"
            plain
            @click="onDelChange"
            :disabled="dataForm.departmentId == '-1'"
          >批量移除</el-button>
        </div>
        <div class="btn-left">
          <el-input
            style="width:250px"
            placeholder="输入昵称查询,以逗号间隔"
            v-model.trim="searchForm.userName"
            clearable
            @keyup.enter="onSearch"
          ></el-input>
          <el-button
            class="btn-search"
            style="margin-left:10px"
            icon="el-icon-search"
            circle
            type="primary"
            @click="onSearch"
          ></el-button>
        </div>
      </div>
      <table-extend
        v-bind="tableOption"
        @pageSizeChange="pageSizeChange"
        @handleSelectionChange="handleSelectionChange"
        @currentChange="currentChange"
        @rowClick="rowClick"
      >
        <template #operatColumn>
          <el-table-column label="操作" min-width="120">
            <template #default="scope">
              <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.departmentId"
                @click="onDelete(scope.row)"
              >移除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-extend>
    </div>

    <el-dialog v-model="dialogVisible" @close="dialogClose" destroy-on-close>
      <template v-slot:title>
        <dialog-title title></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" label-width="120px">
        <el-form-item label="选择部门" prop="name">
          <el-select
            v-model="dataForm.departmentId"
            placeholder="请选择部门名称"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :value="item.departmentId"
              :label="item.departmentName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import tableColums from '@/config/tableConfig/departmentRole';
import {
  getDepartmentTree,
  getUsersByConditions,
  getAll,
  modifyDepartmentForUser,
  removeUserFromDepartment,
} from '@/api/system';
import { confirmBox, messageAlert } from '@/shared/utils/utils';

const department = reactive({
  filterText: '',
  departmentData: [],
  defaultProps: {
    children: 'children',
    label: 'label',
  },
});

watch(
  () => department.filterText,
  (val) => {
    treeRef.value.filter(val);
  }
);

const treeRef = ref<any>(null);
//选中的菜单id
const active = reactive({
  id: '',
  isLeaf: false,
});
//保存操作loading
const saveLoading = ref<boolean>(false);
// 批量删除ids
const deleteIds = ref<any>([]);
const departmentList = ref<any>([]);
const searchForm = reactive({
  userName: '',
});
// 列表参数
const tableOption = reactive({
  tableData: [],
  tableColums,
  selectionCol: true,
  paging: true,
  total: 0,
  tableLoading: false,
  noTableRight: false,
});
const pagination = reactive({
  current: 1,
  size: 15,
});

//弹框显示隐藏
const dialogVisible = ref<boolean>(false);
//弹框标题
const formTitle = computed(() => {
  return isEdit.value ? '编辑功能' : '更换部门';
});
//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive({
  remark: '',
  departmentCode: '',
  departmentName: '',
  departmentId: '',
  orgId: '',
  userId: '',
  nickName: '',
  userName: '',
  id: null,
});

//是否为编辑
const isEdit = ref<boolean>(false);

//获取组织树
async function departmentTree() {
  const res = await getDepartmentTree();
  if (res.code === 200) {
    department.departmentData = res.data;
    if (department.departmentData.length >= 0) {
      active.id = department.departmentData[0].id;
      getDataList();
    }
  }
}

//获取列表数据
async function getDataList() {
  tableOption.tableLoading = true;
  const res = await getUsersByConditions({
    userNames: searchForm.userName,
    ...pagination,
    departmentId: active.id,
  });
  tableOption.tableLoading = false;
  if (res.code === 200) {
    let { data } = res;
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
}

//筛选节点
function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}
//节点点击
async function onNodeClick(row) {
  dataForm.departmentId = row.id;
  const res = await getUsersByConditions({
    ...pagination,
    departmentId: dataForm.departmentId,
    orgId: row.orgId,
  });

  if ((res.code = 200)) {
    tableOption.tableData = res.data.records;
    tableOption.total = res.data.total;
  }

  if (row) {
    active.isLeaf = true;
  }
  active.id = row.id;
  searchForm.userName = '';
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.current = 1;
  pagination.size = pageSize as number;
  getDataList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current = pageIndex as number;
  getDataList();
}

// 批量选择
function handleSelectionChange(vals) {
  deleteIds.value = [];
  for (let index = 0; index < vals.length; index++) {
    const element = vals[index];
    deleteIds.value.push({
      userId: element.userId,
      orgId: element.orgId,
      id: element.id,
    });
  }
}
//点击添加按钮之后才获取下拉列表
async function getDepartmentList() {
  const res = await getAll();
  departmentList.value = res.data;
}
//保存
function onSubmitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    for (let index = 0; index < deleteIds.value.length; index++) {
      const element = deleteIds.value[index];
      element.departmentId = dataForm.departmentId;
    }
    const res = await modifyDepartmentForUser(deleteIds.value);
    if (res.code === 200) {
      messageAlert('success', res.msg)
      dialogVisible.value = false;
      getDataList();
    }
  });
}
//编辑
function onEdit(row) {
  dataForm.departmentId = '';
  deleteIds.value = [];
  isEdit.value = true;
  dialogVisible.value = true;
  deleteIds.value.push({
    userId: row.userId,
    orgId: row.orgId,
    id: row.id,
  });
}

//记录选中的type
const typeActive = ref<string | null>(null);
//新增
async function onAdd() {
  if (dataForm.departmentId == '-1') {
    dataForm.departmentId = '';
  }
  isEdit.value = false;
  if (deleteIds.value.length == 0) {
    messageAlert('success', '请选择要操作的行')
    return;
  }

  dialogVisible.value = true;
}
//移除
function onDelete(row) {
  let delDepartmentList = [];
  delDepartmentList.push({
    id: row.id,
    userId: row.userId,
    orgId: row.orgId,
    departmentId: row.departmentId,
  });
  confirmBox('移除该人员', async () => {
    const res = await removeUserFromDepartment(delDepartmentList);
    if (res.code === 200) {
      messageAlert('success', res.msg)
      getDataList();
    }
  });
}

//批量移除
async function onDelChange(row) {
  if (deleteIds.value.length == 0) {
    messageAlert('error', '请选择要操作的行')
    return;
  }
  let delDepartmentList = [];
  delDepartmentList.push({
    id: row.id,
    userId: row.userId,
    orgId: row.orgId,
    departmentId: row.departmentId,
  });
  // for (let index = 0; index < deleteIds.value.length; index++) {
  //   const element = deleteIds.value[index];
  //   element.departmentId = dataForm.departmentId;
  // }
  const res = await removeUserFromDepartment(deleteIds.value);
  if (res.code == 200) {
    messageAlert('success', res.msg)
    getDataList();
  }
}

//按姓名查询,中间用逗号间隔
async function onSearch() {
  let para = {
    userNames: searchForm.userName,
    departmentId: dataForm.departmentId || '0',
    ...pagination,
  };
  const res = await getUsersByConditions(para);
  if (res.code === 200) {
    tableOption.tableData = res.data.records;
    tableOption.total = res.data.total;
    pagination.current = 1;
  }
}

//表格一行点击
function rowClick(row) {
  typeActive.value = row.userId;
  dataForm.orgId = row.orgId;
  dataForm.id = row.id;
}
//弹框关闭
function dialogClose() {
  resetForm();
  formRef.value.clearValidate();
}

function resetForm() {
  dataForm.remark = '';
}
getDepartmentList();
departmentTree();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/container.scss";
</style>
<style>
.btn-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
