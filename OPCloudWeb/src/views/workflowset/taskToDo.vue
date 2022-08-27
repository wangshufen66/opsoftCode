<template>
  <!-- 我的待办 -->
  <div class="flow-valid-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form mode="topForm" :inline="true">
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
        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="onDoneDetail(scope.row)">查看详情</el-button>
            <el-button type="text" v-show="scope.row.category !== 'toRead'" size="small" @click="unclaim(scope.row)">
              取消签收
            </el-button>
            <el-button type="text" v-show="scope.row.category !== 'toRead'" size="small" @click="excute(scope.row)">
              执行
            </el-button>
            <el-button type="text" v-show="scope.row.category === 'toRead'" size="small" @click="read(scope.row)">
              已阅
            </el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <!-- <div class="fixedDialog"> -->
    <el-dialog v-model="detailToDovisible" title="查看详情" width="900px">
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
        <!-- 流程表单,接口暂不接入 -->
        <el-tab-pane label="流程表单" name="processIntanceForm">
          <top-form
            :formvisible="false"
            :formConf="pageSetting.formConf"
            :componentList="pageSetting.componentList"
            :formData="pageSetting.formData"
          ></top-form>
        </el-tab-pane>
        <!-- <el-tab-pane :label="ele.name" :name="`${index}`" v-for="(ele, index) in variables.__FormList__" :key="index">
          <top-form :formConf="ele.formConf" :formData="ele.formModel" :componentList="ele.componentList"></top-form>
        </el-tab-pane> -->
        <el-tab-pane label="流程图" name="processIntanceImage">
          <el-scrollbar>
            <img class="process-image" :src="detailToDoOptions.imageUrl" alt="流程图" />
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- </div> -->
    <el-dialog title="执行任务" v-model="executeTaskOptions.visible" @close="dialogClosed" width="900px">
      <template v-slot:title >
            <dialog-title title="执行任务"></dialog-title>
      </template>
      <div style="display: block">
        意见:
        <top-form
          :formvisible="false"
          :formConf="executeTaskOptions.formConf"
          :componentList="executeTaskOptions.componentList"
          :formData="executeTaskOptions.formData"
          ref="topFormRef"
        ></top-form>
        <div style="margin-bottom: 20px; flex: 1; margin-left: 10px">
          <el-input v-model="executeTaskOptions.message" type="textarea" placeholder="请输入意见" />
        </div>
      </div>

      <div>
        <el-button icon="el-icon-close" @click="executeTaskOptions.visible = false">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="onComplete">提交</el-button>
        <el-button icon="el-icon-check" type="primary" @click="onStop">终止</el-button>
        <!-- <el-button icon="el-icon-check" type="primary">转办 </el-button>
        <el-button icon="el-icon-check" type="primary">委派 </el-button>
        <el-button icon="el-icon-check" type="primary">退回 </el-button> -->
      </div>
    </el-dialog>
    <!-- <execute-task v-model:visible="executeTaskOptions.visible" :id="executeTaskOptions.id" :title="executeTaskOptions.title" :formConf="executeTaskOptions.formConf" :componentList="executeTaskOptions.componentList" @refreshList="getToDoList"></execute-task> -->
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import tableColums from '@/config/tableConfig/flowToDoList';
import { ElMessage } from 'element-plus';
import {
  listTodoList,
  unclaimTask,
  executeTaskData,
  getDoneDeatailComments,
  getformData,
  readProcessInstance,
  completeTask,
  stopProcessInstance,
} from '@/api/flowable';
import { deepClone, getStorage, getToken } from '@/utils/utils';
import topForm from '@/components/moduleform/form.vue';
import executeTask from './components/executetask.vue';
import useInitComponent from '@/viewHooks/use-init-component/index';
import { autoCodeRule } from '@/api/homeApi/index';

const { selectInit, cascaderInit } = useInitComponent();
//查询表单参数
const searchForm = reactive({
  taskName: undefined,
  processKey: undefined,
});
const tabOption = reactive({
  activeName: 'comments',
});
const tableloading = ref<boolean>(false);
//列表配置项
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

// 页面弹框配置数据
const pageSetting = reactive({
  formConf: undefined,
  componentList: [],
  formModel: undefined,
  formData: {},
});

//执行任务弹窗配置
const executeTaskOptions = reactive({
  visible: false,
  id: '',
  title: '',
  message: '',
  formConf: undefined,
  componentList: [],
  formData: {},
});

// 执行任务表单
const topFormRef = ref<any>(null);

// 查询
function onSearch() {
  pagination.current = 1;
  getToDoList();
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.size = pageSize as number;
  getToDoList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current = pageIndex as number;
  getToDoList();
}

/**
 * 自动创建值
 */
function autoCreateData(componentList, pageId) {
  componentList.forEach((component) => {
    if (component.componentTag === 'designAutoCode') {
      autoCode(component, pageId);
    }
  });
}

async function autoCode(component, pageId) {
  const params = {
    tableId: pageId,
    fieldName: component.__vModel__,
    isUnique: +component.__config__.unique,
    additionalConfiguration: {
      rule: component.autorule.type,
      numberLength: component.autorule.numLen,
      defaultAlphabetal: component.autorule.letter,
      dateFormat: component.autorule.dataformat,
    },
  };
  const res = await autoCodeRule(params);
  // console.log('自编码数据', res.data);

  executeTaskOptions.formData[component.__vModel__] = res.data;
}

// 提交
const onComplete = async (row: any) => {
  if (!topFormRef.value.formValid()) return;
  let params = {
    message: executeTaskOptions.message,
    taskId: executeTaskOptions.id,
    ccToVos: [],
    values: {
      formConf: executeTaskOptions.formConf || null,
      componentList: executeTaskOptions.componentList || null,
      formModel: executeTaskOptions?.formData || null,
    },
  };
  const res = await completeTask(params);
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      showClose: true,
      message: res.msg,
      duration: 1500,
    });
    executeTaskOptions.visible = false;
    getToDoList();
  }
};
// 终止
const onStop = async (row: any) => {
  // if (!topFormRef.value.formValid()) return;
  const res = await stopProcessInstance({
    message: executeTaskOptions.message,
    taskId: executeTaskOptions.id,
  });

  if (res.code === 200) {
    ElMessage({
      type: 'success',
      showClose: true,
      message: '已终止',
      duration: 1500,
    });
    executeTaskOptions.visible = false;
    getToDoList();
  }
};

const detailToDovisible = ref<boolean>(false);
const detailToDoOptions = reactive({
  id: '',
  imageUrl: '',
});
const DoneDetailComment = reactive({
  comments: [],
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
    detailToDoOptions.id = row.id;
    const token = getToken('accessToken');
    detailToDoOptions.imageUrl = `/flowable/processInstanceImage?processInstanceId=${
      row.processInstanceId
    }&access_token=${token}&time=${+new Date()}`;
    if (detailRes.code == 200) {
      const { formConf, componentList = [], formModel } = detailRes.data.variables;
      if (formConf) {
        formConf.disabled = true;
      }
      detailToDovisible.value = true;
      pageSetting.componentList = componentList;
      // initComponentData(pageSetting.componentList, 'edit');
      pageSetting.formConf = formConf;
      nextTick(() => {
        pageSetting.formData = formModel;
      });
    }
  });
};

//取消签收
const unclaim = async (row) => {
  const res = await unclaimTask({ taskId: row.id });
  if (res.code === 200) {
    getToDoList();
    ElMessage({
      type: 'success',
      showClose: true,
      message: res.msg,
      duration: 1500,
    });
  }
};

/**
 * 初始化组件数据
 */
async function initComponentData(valueList, type: 'add' | 'edit') {
  for (let i = 0; i < valueList.length; i++) {
    const element = valueList[i] as any;
    const tag = element.componentTag;

    if (tag === 'designSelect') {
      await selectInit(element);
    } else if (tag === 'designCascader') {
      await cascaderInit(element);
    } else if (tag === 'designTabTable') {
      if (type === 'add') {
        element.dataSourceList?.forEach((item) => {
          item.dataSource && (item.dataSource = []);
        });
      }
    } else if (tag === 'designRadio') {
      await selectInit(element);
    } else if (tag === 'designCheckBox') {
      await selectInit(element);
    }
  }
}

//执行
const excute = async (row) => {
  const res = await executeTaskData({ taskId: row.id });
  if (res.code == 200) {
    // console.log(JSON.parse(res.data.renderedTaskForm));
    executeTaskOptions.visible = true;
    executeTaskOptions.id = row.id;
    executeTaskOptions.title = row.name;
    if (res.data.renderedTaskForm) {
      const { formConf, components = [] } = JSON.parse(res.data.renderedTaskForm);
      executeTaskOptions.formConf = formConf;
      executeTaskOptions.componentList = components;
      initComponentData(executeTaskOptions.componentList, 'add');
      //创建自编码
      autoCreateData(executeTaskOptions.componentList, res.data.pageId);
    } else {
      executeTaskOptions.formConf = undefined;
      executeTaskOptions.componentList = [];
    }
  }
};
//已阅
async function read(row) {
  const res = await readProcessInstance({ taskId: row.id });
  if (res.code === 200) {
    ElMessage.success(res.msg);
    getToDoList();
  }
}
//执行任务弹窗关闭
function dialogClosed() {
  topFormRef.value.resetFields();
}

//获取数据
async function getToDoList() {
  tableloading.value = true;
  const params = {
    ...searchForm,
    ...pagination,
  };
  const res = await listTodoList(params);
  const { code, data } = res;
  if (code == 200) {
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  tableloading.value = false;
}
getToDoList();
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
