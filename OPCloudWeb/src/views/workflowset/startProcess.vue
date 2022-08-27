<template>
  <!--发起流程  -->
  <div class="flow-valid-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form :inline="true" @submit.prevent>
          <el-form-item label="名称">
            <el-input type="text" v-model="searchForm.processDefinitionName" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button-group>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-button-group>
      </div>
    </div>

    <div class="startProcessList">
      <div class="flow-list-wrap" v-loading.lock="listLoading">
        <div class="filter-container" v-for="(row, index) in DataOption.procesList" :key="index">
          <div slot="header" class="clearfix">
            <span>{{ row.name }}-v{{ row.version }}</span>
            <div style="position: relative; text-align: right">
              <el-button type="primary" size="mini" @click="btnImage(row)">流程图</el-button>
              <el-button type="primary" size="mini" @click="btnStartInstance(row)">发起流程</el-button>
            </div>
          </div>
          <div class="text item">{{ row.description ? row.description : '无描述' }}</div>
          <div class="text item">{{ row.category ? row.category : '无命名空间' }}</div>
        </div>
      </div>

      <el-pagination
        v-if="DataOption.paging"
        background
        @size-change="pageSizeChange"
        @current-change="currentChange"
        :current-page="pagination.pageIndex"
        :page-sizes="DataOption.sizeList"
        :page-size="DataOption.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="DataOption.total"
      ></el-pagination>
    </div>

    <el-dialog v-model="dialogvisible">
      <template v-slot:title>
        <dialog-title :title="detailOptions.title"></dialog-title>
      </template>
      <img class="process-image" v-if="detailOptions.imageUrl" :src="detailOptions.imageUrl" />
    </el-dialog>
    <el-dialog v-model="processvisible">
      <template v-slot:title>
        <dialog-title :title="dialogOptions.title"></dialog-title>
      </template>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="流程表单" name="form">
          <top-form
            :formConf="pageSetting.formConf"
            :formData="pageSetting.formData"
            :componentList="pageSetting.componentList"
            ref="topSearchForm"
          ></top-form>
        </el-tab-pane>
        <el-tab-pane label="任务过期时间" name="time">
          <el-form ref="formRef" label-width="110px" size="small">
            <el-form-item :label="item.name" v-for="item in expirationTime" :key="item.id">
              <el-date-picker
                v-model="item.dueDate"
                type="datetime"
                placeholder="选择日期时间"
                format="YYYY-MM-DD HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="bottom-button">
        <el-button icon="el-icon-close" @click="processvisible = false">取消</el-button>
        <el-button
          icon="el-icon-check"
          :loading="startLoading"
          type="primary"
          @click="doStartInstance(dialogOptions.id)"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from 'vue';
import useInitComponent from '@/viewHooks/use-init-component/index';
import { startProcess, getRenderedStartForm, startProcessInstance } from '@/api/flowable';
import { autoCodeRule } from '@/api/homeApi';
import { getStorage, getToken, messageAlert } from '@/utils/utils';
import topForm from '@/components/moduleform/form.vue';

// 查询表单参数
const searchForm = reactive({
  processDefinitionName: undefined,
});

const pagination = reactive({
  current: 1,
  size: 15,
});
const dialogvisible = ref<boolean>(false);
const processvisible = ref<boolean>(false);

const activeName = ref('form');

// 页面弹框配置数据
const pageSetting = reactive({
  formConf: undefined,
  componentList: [],
  formData: {},
});

//发起流程请求的loading
const startLoading = ref<boolean>(false);
//列表配置项
const listLoading = ref<boolean>(false);
const DataOption = reactive({
  procesList: [],
  paging: true,
  total: 0,
  pageSize: 15,
  pageIndex: 1,
  sizeList: [15, 20, 30],
  listLoading: false,
});
const pageSizeChange = (pagesize: number): void => {
  pagination.size = pagesize;
  getStartProcess();
};
const currentChange = (current: number): void => {
  pagination.current = current;
  getStartProcess();
};
const topSearchForm = ref<any>(null);

const detailOptions = reactive({
  title: '',
  id: '',
  imageUrl: '',
});

const dialogOptions = reactive({
  title: '',
  id: '',
});
//过期时间
const expirationTime = ref([]);

// 查询
function onSearch() {
  pagination.current = 1;
  getStartProcess();
}

async function getStartProcess() {
  listLoading.value = true;
  const params = {
    latestVersion: true,
    ...searchForm,
    ...pagination,
  };
  const res = await startProcess(params);
  const { code, data } = res;
  if (code == 200) {
    DataOption.procesList = data.records;
    DataOption.total = data.total;
  }
  listLoading.value = false;
}
getStartProcess();

const btnImage = (row: any) => {
  dialogvisible.value = true;
  detailOptions.title = '流程图-' + row.name;
  detailOptions.id = row.id;
  const token = getToken('accessToken');
  if (token) {
    detailOptions.imageUrl = `/flowable/processDefinition/image?processDefinitionId=${row.id
      }&access_token=${token}&time=${+new Date()}`;
  } else {
    dialogvisible.value = false;
    messageAlert('error', '认证失败，无法访问系统资源')
  }
};
//发起流程
const btnStartInstance = async (row: any) => {
  dialogOptions.title = row.name;
  dialogOptions.id = row.id;

  pageSetting.formConf = undefined;
  pageSetting.componentList = [];
  const res = await getRenderedStartForm({ processDefinitionId: row.id });
  if (res.code === 200) {
    expirationTime.value = res.data.UserTasks?.map((item) => ({
      id: item.id,
      name: item.name,
      dueDate: item.dueDate,
    }));
    if (res.data.renderedStartForm) {
      const { formConf, components = [] } = JSON.parse(res.data.renderedStartForm);
      const pageId = res.data.pageId;

      pageSetting.formConf = formConf;
      pageSetting.componentList = components;

      Promise.all([initComponentData(components, pageId)]).then(() => {
        processvisible.value = true;
      });
      // 自编码数据
      // console.log(pageSetting.componentList);
    } else {
      processvisible.value = true;
    }
  }

  console.log('row', row);
};

// 设置选择型组件数据源
async function initComponentData(valueList, pageId) {
  for (let i = 0; i < valueList.length; i++) {
    const element = valueList[i] as any;
    const { selectInit, cascaderInit } = useInitComponent();
    const tag = element.componentTag;

    if (tag === 'designSelect') {
      await selectInit(element);
    } else if (tag === 'designCascader') {
      await cascaderInit(element);
    } else if (tag === 'designAutoCode') {
      autoCode(element, pageId);
    } else {
    }
  }
}
// 自编码组件获取值

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
  console.log('自编码数据', res.data);
  pageSetting.formData[component.__vModel__] = res.data;
}

const doStartInstance = async (dialogOptions: any) => {
  if (!topSearchForm.value?.formRef) {
    processvisible.value = false;
    return;
  }
  topSearchForm.value.formRef.validate(async (valid) => {
    if (!valid) return;
    startLoading.value = true;
    const res = await startProcessInstance({
      processDefinitionId: dialogOptions,
      values: {
        formConf: pageSetting.formConf || null,
        componentList: pageSetting.componentList || null,
        formModel: topSearchForm.value?.formData || null,
      },
      json: JSON.stringify(expirationTime.value),
    });
    startLoading.value = false;
    if (res.code === 200) {
      messageAlert('success', res.msg)
    }
    processvisible.value = false;
  });
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/workflow/flowvalidlist.scss";
@import "@/styles/modules/design/preview.scss";
.bottom-button {
  text-align: center;
  margin-top: 15px;
}
.el-col {
  margin: 5px 0;
}
.startProcessList {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  flex: 1 0 0;
}
.flow-list-wrap {
  padding: 10px;
  overflow-y: auto;
  height: calc(100% - 50px);
  margin-bottom: 10px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fill, 140px);
  gap: 20px;
}
.filter-container {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 3px;
  box-shadow: 0 0 10px #efefef;
  .item {
    font-weight: 400;
  }
}
.process-image {
  object-fit: contain;
  width: 100%;
}
</style>
