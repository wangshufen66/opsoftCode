<!-- 工作流定义(部署的工作流) -->
<template>
  <div class="flow-valid-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form :inline="true">
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
      v-loading="tableloading"
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_suspended="{ data }">
        <span class="label_error" v-if="data.suspended">挂起</span>
        <span class="label_success" v-else>激活</span>
      </template>
      <template #col_createTime="{ data }">
        {{ formatTime(data.createTime) }}
      </template>
      <template #operatColumn>
        <el-table-column label="操作" min-width="100" fixed="right">
          <template #default="scope">
            <el-button v-if="scope.row.suspended" type="text" size="small" @click="onActive(scope.row)">激活</el-button>
            <el-button v-else type="text" size="small" @click="onSuspend(scope.row)">挂起</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import tableColums from '@/config/tableConfig/flowValidList';
import {
  getProcessDefinitionList,
  activeProcessDefinition,
  suspendProcessDefinition,
  getProcessType,
} from '@/api/flowable';
import { ElMessage } from 'element-plus/lib';
import dayjs from 'dayjs';

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
});

const pagination = reactive({
  current: 1,
  size: 15,
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
    latestVersion: true,
    suspended: false,
    active: false,
    ...searchForm,
    ...pagination,
  };
  const res = await getProcessDefinitionList(params);
  const { code, data } = res;
  if (code === 200) {
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  tableloading.value = false;
}
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
const onActive = async (row: any) => {
  const res = await activeProcessDefinition({ processDefinitionId: row.id });
  if (res.code === 200) {
    getDataList();
    ElMessage({
      type: 'success',
      showClose: true,
      message: '已激活',
      duration: 1500,
    });
  }
};
// 挂起
const onSuspend = async (row: any) => {
  const res = await suspendProcessDefinition({ processDefinitionId: row.id });
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

//格式化时间
function formatTime(str) {
  if (!str) return '';
  return dayjs(str).format('YYYY-MM-DD HH:mm:ss');
}

getDataList();
</script>

<style lang="scss" scoped>
@import '@/styles/modules/workflow/flowvalidlist.scss';
</style>
