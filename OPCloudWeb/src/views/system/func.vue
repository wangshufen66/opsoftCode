<template>
  <div class="page-content">
    <div class="page-left">
      <div class="search-wrap">
        <el-input placeholder="输入关键字进行过滤" v-model.trim="menu.filterText"></el-input>
      </div>
      <el-tree
        v-loading.lock="menuLoading"
        class="filter-tree"
        :data="menu.menuData"
        :props="menu.defaultProps"
        :filter-node-method="filterNode"
        @node-click="onNodeClick"
        node-key="id"
        ref="treeRef"
      ></el-tree>
    </div>
    <div class="page-right">
      <div class="button-wrap">
        <el-button class="btn-add" type="primary" plain @click="onAdd">新增功能</el-button>
      </div>
      <table-extend
        v-bind="tableOption"
        @pageSizeChange="pageSizeChange"
        @currentChange="currentChange"
      >
        <template #operatColumn>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template #default="scope">
              <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click.stop="onDelete(scope.row.funcId)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-extend>
    </div>

    <el-dialog v-model="dialogVisible" @close="dialogClose" destroy-on-close>
      <template v-slot:title>
        <dialog-title title></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="页面" prop="menuName">
          <el-input v-model="dataForm.menuName" disabled></el-input>
        </el-form-item>
        <el-form-item label="功能名称" prop="funcName">
          <el-input v-model="dataForm.funcName" placeholder="请输入功能名称"></el-input>
        </el-form-item>
        <el-form-item label="授权" prop="funcPermissions">
          <el-input v-model="dataForm.funcPermissions" placeholder="请输入授权"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="isUsable">
          <el-select
            v-model="dataForm.isUsable"
            clearable
            placeholder="请选择是否可用"
            style="width: 100%"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="sortNo">
          <el-input v-model="dataForm.sortNo" placeholder="请输入排序号"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" rows="3"></el-input>
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
import { ElMessage } from 'element-plus';
import tableColums from '@/config/tableConfig/sysFuncList';
import {
  getMneuTree,
  getFuncList,
  addFunc,
  editFunc,
  delFunc,
} from '@/api/system';
import { confirmBox } from '@/utils/utils';
const menu = reactive({
  filterText: '',
  menuData: [],
  defaultProps: {
    children: 'children',
    label: 'label',
  },
});

watch(
  () => menu.filterText,
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
//菜单加载loading
const menuLoading = ref<boolean>(false);
//保存操作loading
const saveLoading = ref<boolean>(false);

// 列表参数
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

//弹框显示隐藏
const dialogVisible = ref<boolean>(false);
//弹框标题
const formTitle = computed(() => {
  return isEdit.value ? '编辑功能' : '新增功能';
});
//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive({
  funcId: '',
  funcName: '',
  funcPermissions: '',
  remark: '',
  sortNo: '',
  isUsable: '',
  menuName: '',
});

//添加和编辑表单的验证规则
const formRules = reactive({
  funcId: [{ required: true, message: '请输入菜单Key', trigger: 'blur' }],
  funcName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
  isUsable: [{ required: true, message: '请选择是否可用', trigger: 'blur' }],
  sortNo: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    {
      pattern: /^\d+$/,
      message: '只能输入数字',
      trigger: 'blur',
    },
  ],
});
//是否为编辑
const isEdit = ref<boolean>(false);

//获取菜单树
async function menuTree() {
  menuLoading.value = true;
  const res = await getMneuTree();
  menuLoading.value = false;
  if (res.code === 200) {
    menu.menuData = res.data;
    // menu.selectData.push(res.data[0].id);
  }
}
//获取列表数据
async function getDataList() {
  tableOption.tableLoading = true;
  const res = await getFuncList({ ...pagination, menuId: active.id });
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
function onNodeClick(row) {
  active.id = row.data.menuId;
  active.isLeaf = row.isLeaf;
  dataForm.menuName = row.data.menuName;
  getDataList();
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

//保存
function onSubmitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    saveLoading.value = true;
    const { menuName, ...params } = dataForm;
    if (isEdit.value) {
      const res = await editFunc({
        ...params,
        menuId: active.id,
      });
      saveLoading.value = false;
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
        dialogVisible.value = false;
      }
    } else {
      const res = await addFunc({
        ...params,
        menuId: active.id,
      });
      saveLoading.value = false;
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
        dialogVisible.value = false;
      }
    }
  });
}
//编辑
function onEdit(row) {
  if (!active.isLeaf) {
    ElMessage.warning('顶层菜单不允许编辑功能');
    return;
  }
  isEdit.value = true;
  dialogVisible.value = true;
  dataForm.funcId = row.funcId;
  dataForm.funcName = row.funcName;
  dataForm.isUsable = row.isUsable + '';
  dataForm.funcPermissions = row.funcPermissions;
  dataForm.remark = row.remark;
  dataForm.sortNo = row.sortNo;
}

//删除
function onDelete(ids) {
  confirmBox('删除该功能', async () => {
    const res = await delFunc({ ids });
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getDataList();
    }
  });
}

//新增
function onAdd() {
  if (!active.isLeaf) {
    ElMessage.warning('顶层菜单不允许添加功能');
    return;
  }
  if (!active.id) {
    ElMessage.warning('请先选择菜单再进行新增');
    return;
  }
  isEdit.value = false;
  dialogVisible.value = true;
}

//弹框关闭
function dialogClose() {
  resetForm();
  formRef.value.clearValidate();
}

function resetForm() {
  dataForm.funcId = '';
  dataForm.funcName = '';
  dataForm.funcPermissions = '';
  dataForm.sortNo = '';
  dataForm.remark = '';
}

menuTree();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/container.scss";
.button-wrap {
  margin-bottom: 20px;
}
</style>
