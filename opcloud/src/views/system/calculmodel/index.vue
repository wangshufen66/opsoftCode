<template>
  <div class="model-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form mode="topForm" :inline="true" @submit.prevent>
          <el-form-item label="模型名称">
            <el-input
              type="text"
              placeholder="请输入模型名称"
              v-model="searchForm.modelName"
              clearable
              @keyup.enter="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="模型分类" prop="category">
            <el-select v-model="searchForm.modelType" placeholder="模型分类" clearable>
              <el-option v-for="item in modelTypeList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button class="btn-search" type="primary" plain @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" plain @click="onAdd">新增模型</el-button>
      </div>
    </div>
    <table-extend
      ref="tableRef"
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_status="{ data }">
        <el-tag v-if="data.isUsing === 1" type="success">可用</el-tag>
        <el-tag v-else-if="data.isUsing === 0" type="danger">不可用</el-tag>
      </template>
      <template #operatColumn>
        <el-table-column label="操作" fixed="right" min-width="280">
          <template #default="scope">
            <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="onSetting(scope.row)">字段设置</el-button>
            <el-button
              type="text"
              size="small"
              @click="onUsingChange(scope.row)"
            >{{ scope.row.isUsing === 1 ? "停用" : "启用" }}</el-button>
            <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <detail-form
      v-model:visible="formState.detailVisible"
      :params="formState.detail"
      @onSubmit="onDetailSubmit"
    ></detail-form>
    <field-setting v-model:visible="formState.paramsVisible" :params="formState.params"></field-setting>
  </div>
</template>

<script lang="ts" setup>
import { provide, reactive, ref } from "vue";
import tableColums from "@/config/tableConfig/sysModelList";
import { confirmBox, messageAlert } from "@/shared/utils/utils";
import {
  deleteModel,
  getModelList,
  getModelType,
  setModelStatus,
} from "@/api/functionModel";
import { getAppList } from "@/api/userApi";
import detailForm from "./form.vue";
import fieldSetting from "./fieldsetting.vue";

const modelTypeList = ref<any>([]);
const appList = ref<any[]>([]);
const tableRef = ref<any>(null);

// 查询表单参数
const searchForm = reactive({
  modelName: undefined,
  category: undefined,
});

provide("functionModel", {
  modelTypeList: modelTypeList,
  appList: appList,
});

const tableOption = reactive({
  tableData: [],
  tableColums: tableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
});

const pagination = reactive({
  current_page: 1,
  page_size: 15,
});

const formState = reactive({
  detailVisible: false,
  detail: {
    id: undefined,
  },
  paramsVisible: false,
  params: {
    id: undefined,
  },
});
/**
 * 查询
 */
function onSearch() {
  pagination.current_page = 1;
  getDataList();
}


/**
 * 表格pagesize
 */
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.page_size = pageSize as number;
  getDataList();
}
/**
 * 表格页码切换
 */
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current_page = pageIndex as number;
  getDataList();
}
/**
 * 新增模型
 */
function onAdd() {
  formState.detail.id = undefined;
  formState.detailVisible = true;
}
/**
 * 编辑模型
 */
function onEdit(row: any) {
  formState.detail.id = row.id;
  formState.detailVisible = true;
}
/**
 * 设置参数
 */
function onSetting(row: any) {
  formState.paramsVisible = true;
  formState.params.id = row.id;
}
/**
 * 启用、停用
 */
async function onUsingChange(row: any) {
  const params = {
    id: row.id,
    status: row.isUsing === 1 ? 0 : 1,
  };
  const res = await setModelStatus(params);
  if (res.code === 200) {
    row.isUsing = row.isUsing === 1 ? 0 : 1;
    messageAlert("success", row.isUsing === 1 ? "启用成功" : "停用成功");
  }
}
/**
 * 删除
 */
function onDelete(row: any) {
  confirmBox("删除数据", async () => {
    const res = await deleteModel({ id: row.id });
    if (res.code == 200) {
      messageAlert("success", "删除成功");
      getDataList();
    }
  });
}

function onDetailSubmit() {
  formState.detail.id = undefined;
  pagination.current_page = 1
  tableRef.value.gotoPage(pagination.current_page)
  getDataList();
}

/**
 * 获取数据列表
 */
async function getDataList() {
  const params = {
    ...searchForm,
    ...pagination,
  };
  tableOption.tableLoading = true;
  const res = await getModelList(params);
  if (res.code == 200) {
    tableOption.total = res.data.total;
    tableOption.tableData = res.data.records || [];
  }
  tableOption.tableLoading = false;
}

/**
 * 获取模型类型
 */
async function getModelTypeList() {
  const res = await getModelType();
  if (res.code == 200) {
    modelTypeList.value = res.data || [];
  }
}
/**
 * 获取应用列表
 */
async function getApplist() {
  const res = await getAppList();
  if (res.code == 200) {
    appList.value = (res.data || []).map((m) => {
      return {
        id: m.id,
        code: m.appCode,
        name: m.appName,
      };
    });
  }
}

function init() {
  //获取模型类型列表
  getModelTypeList();
  //获取模型列表
  getDataList();

  getApplist();
}

init();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/model.scss";
</style>
