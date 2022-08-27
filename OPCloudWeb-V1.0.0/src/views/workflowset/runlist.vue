<!-- 运行中流程 -->
<template>
  <div class="flow-valid-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form mode="topForm" :inline="true">
          <el-form-item label="名称">
            <el-input type="text" v-model="searchForm.processDefinitionName" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="searchForm.type" clearable filterable>
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button-group>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-button-group>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      v-loading="tableloading"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #operatColumn>
        <el-table-column label="操作" fixed="right" min-width="120">
          <template #default="scope">
            <el-button v-if="scope.row.suspended" type="text" size="small" @click="onContinue(scope.row)">
              <span style="color: green">激活</span>
            </el-button>
            <el-button v-else type="text" size="small" @click="onSuspend(scope.row)">
              <span style="color: red">挂起</span>
            </el-button>
            <el-button type="text" size="small" @click="onDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
  </div>
  <flow-detail
    v-model:visible="detailOptions.visible"
    :title="detailOptions.title"
    :id="detailOptions.id"
  ></flow-detail>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import tableColums from '@/config/tableConfig/flowRunList';
import { ElMessage } from 'element-plus';
import flowDetail from './components/flowdetail.vue';

import {
  getProcessInstanceList,
  deplayProcessDefinition,
  suspendProcessInstance,
  getProcessType,
} from '@/api/flowable';

const detailOptions = reactive({
  visible: false,
  title: '',
  id: '',
});

// 查询表单参数
const searchForm = reactive({
  processDefinitionName: undefined,
  type: undefined,
});
const typeList = ref(null);

//列表配置项
const tableloading = ref<boolean>(false);
const tableOption = reactive({
  tableData: [],
  tableColums: tableColums,
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

//搜索栏数据
getProcessType({
  codeTypeIds: 'processCategory',
}).then((res) => {
  if (res.code === 200) {
    typeList.value = res.data.processCategory.map((item) => ({
      value: item.value,
      label: item.content,
    }));
  }
});

// 查询
function onSearch() {
  pagination.current = 1;
  getDataList();
}
// 获取数据
async function getDataList() {
  tableloading.value = true;
  const params = {
    unfinished: true,
    finished: false,
    ...searchForm,
    ...pagination,
  };
  const res = await getProcessInstanceList(params);
  const { code, data } = res;
  if (code === 200) {
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  tableloading.value = false;
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

// 激活
const onContinue = async (row: any) => {
  const res = await deplayProcessDefinition({ processInstanceId: row.id });
  if (res.code === 200) {
    getDataList();
    ElMessage({
      type: 'success',
      showClose: true,
      message: '已启动',
      duration: 1500,
    });
  }
};
// 挂起
const onSuspend = async (row: any) => {
  const res = await suspendProcessInstance({ processInstanceId: row.id });
  if (res.code === 200) {
    getDataList();
    ElMessage({
      type: 'error',
      showClose: true,
      message: '已挂起',
      duration: 1500,
    });
  }
};
// 详情
const onDetail = (row: any) => {
  detailOptions.visible = true;
  detailOptions.title = row.name;
  detailOptions.id = row.id;
};

getDataList();
</script>

<style lang="scss" scoped>
@import '@/styles/modules/workflow/flowvalidlist.scss';
</style>
