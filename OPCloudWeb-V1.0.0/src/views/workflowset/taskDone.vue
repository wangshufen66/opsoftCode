<template>
  <!-- 我的已办 -->
  <div class="flow-valid-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form :inline="true">
          <el-form-item label="名称">
            <el-input type="text" v-model="searchForm.taskName" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="主键">
            <el-input type="text" v-model="searchForm.processKey" clearable></el-input>
          </el-form-item> -->
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
        <el-table-column label="操作" min-width="100" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="onDoneDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <el-dialog v-model="detailDonevisible"  width="900px">
      <template v-slot:title >
            <dialog-title title="查看详情"></dialog-title>
      </template>
      <el-tabs v-model="tabOption.activeName" type="border-card">
        <el-tab-pane label="过程意见" name="comments">
          <el-table
            :data="DoneDetailComment.comments"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :cell-style="{ padding: '3px' }"
          >
            <el-table-column label="任务节点" prop="taskName" align="center" width="165px"></el-table-column>
            <el-table-column label="操作类型" prop="typeDesc" align="center" width="100px"></el-table-column>
            <el-table-column label="参与人" prop="userName" align="center" width="165px"></el-table-column>
            <el-table-column label="时间" prop="time" align="center" width="200px"></el-table-column>
            <el-table-column label="意见" prop="fullMessage" align="left"></el-table-column>
          </el-table>
        </el-tab-pane>
        <!--  -->
        <el-tab-pane label="流程表单" name="processIntanceForm">
          <!-- <template v-if="pageSetting.componentList.length > 0" height="500px"> -->
          <top-form
            :formConf="pageSetting.formConf"
            :componentList="pageSetting.componentList"
            :formData="pageSetting.formData"
            ref="topSearchForm"
          ></top-form>
          <!-- </template> -->
        </el-tab-pane>

        <el-tab-pane label="流程图" name="processIntanceImage">
          <el-scrollbar>
            <img class="process-image" :src="detailDoneOptions.imageUrl" alt="流程图" />
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import tableColums from '@/config/tableConfig/flowDoneList';
import { listDoneList, getDoneDeatailComments, getformData } from '@/api/flowable';
import topForm from '@/components/moduleform/form.vue';
import { getStorage, getToken } from '@/utils/utils';
const topSearchForm = ref<any>(null);

//查询表单参数
const searchForm = reactive({
  taskName: undefined,
  processKey: undefined,
});

const tabOption = reactive({
  activeName: 'comments',
});

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
  getDoneList();
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.size = pageSize as number;
  getDoneList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current = pageIndex as number;
  getDoneList();
}

//获取数据
async function getDoneList() {
  tableloading.value = true;
  const params = {
    ...searchForm,
    ...pagination,
  };
  const res = await listDoneList(params);
  const { code, data } = res;
  if (code == 200) {
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  tableloading.value = false;
}

const detailDoneOptions = reactive({
  id: '',
  imageUrl: '',
});

const detailDonevisible = ref<boolean>(false);

const DoneDetailComment = reactive({
  comments: [],
});
// 页面弹框配置数据
const pageSetting = reactive({
  formConf: undefined,
  componentList: [],
  formModel: undefined,
  formData: {},
});

// 查看详情
const onDoneDetail = async (row: any) => {
  Promise.all([
    getDoneDeatailComments({
      processInstanceId: row.processInstanceId,
    }),
    getformData({
      processInstanceId: row.processInstanceId,
    }),
  ]).then((res) => {
    const doneRes = res[0];
    const detailRes = res[1];
    if (doneRes.code == 200) {
      DoneDetailComment.comments = doneRes.data;
    }
    detailDoneOptions.id = row.id;
    const token = getToken('accessToken');
    detailDoneOptions.imageUrl = `/flowable/processInstanceImage?processInstanceId=${
      row.processInstanceId
    }&access_token=${token}&time=${+new Date()}`;
    if (detailRes.code == 200) {
      const { formConf, componentList = [], formModel } = detailRes.data.variables;
      detailDonevisible.value = true;
      formConf.disabled = true;
      pageSetting.formConf = formConf;
      pageSetting.componentList = componentList;
      nextTick(() => {
        pageSetting.formData = formModel;
      });
    }
  });
};
getDoneList();
</script>
<style lang="scss" scoped>
@import '@/styles/modules/workflow/flowvalidlist.scss';
@import '@/styles/modules/design/preview.scss';
.process-image {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>
