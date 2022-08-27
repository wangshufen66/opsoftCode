<template>
  <div class="workflow-manage">
    <div class="topsearch">
      <el-form mode="topForm" :inline="true" @submit.prevent>
        <el-col :span="24">
          <el-form-item label="工作流模型">
            <el-input type="text" v-model="topForm.workflowName" clearable></el-input>
          </el-form-item>
          <el-select v-model="activeName" @change="refreshList" style="margin-right: 10px">
            <el-option
              v-for="item in processCategory"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="refreshList">搜索</el-button>
          <el-button type="primary" @click="addPage">新建模型</el-button>
          <el-button icon="el-icon-folder-opened" @click="importModel" type="primary">导入模型</el-button>
        </el-col>
      </el-form>
    </div>
    <div class="modelList">
      <!-- <el-tabs v-model="activeName" type="card" @tab-click="refreshList">
        <el-tab-pane label="审批流" name="approve"></el-tab-pane>
        <el-tab-pane label="生产流" name="manuf"></el-tab-pane>
        <el-tab-pane label="工序流" name="work"></el-tab-pane>
        <el-tab-pane label="未分类" name="other"></el-tab-pane>
      </el-tabs>-->
      <el-divider content-position="left">{{ getName(activeName) }}</el-divider>
      <div class="contentlist" ref="contentRef">
        <!-- v-loading.lock="listLoading" -->
        <div class="workflow-content">
          <div
            class="workflow-item"
            v-for="(model, index) in modelList"
            :key="index"
            @click="goDetail(model)"
          >
            <div class="item-version">{{ model.version }}</div>
            <div class="item-previewpic">
              <!-- <el-image :src="getImg(model.image)" alt="" class="previewpic" lazy></el-image> -->
              <img :src="getImg(model.image)" alt class="previewpic" />
            </div>
            <el-button
              class="item-btn"
              type="text"
              v-if="model.deployed"
              @click.stop="onDeploy(model)"
            >已部署</el-button>
            <el-button class="item-btn" type="text" v-else @click.stop="onDeploy(model)">部署</el-button>
            <el-button class="item-btn-del" type="text" @click.stop="onDelete(model)">删除</el-button>
            <div class="item-info">
              <div class="info-name" :title="model.name">{{ model.name }}</div>
              <div class="info-time">{{ formatTime(model.lastUpdateTime) }}</div>
              <div class="info-name">{{ model.creator ?? 'null' }}</div>
            </div>
          </div>
          <el-empty :image-size="200" v-show="modelList.length === 0" style="flex: 1"></el-empty>
        </div>
        <div class="loading-text">
          <p v-if="!noMore && !networkErr">
            正在加载中
            <i class="el-icon-loading"></i>
          </p>
          <p v-if="noMore && modelList.length >= pagination.size">没有更多了</p>
          <p v-if="networkErr">网络连接错误</p>
        </div>
      </div>
    </div>
    <el-dialog v-model="visible" destroy-on-close width="600px">
      <template v-slot:title>
        <dialog-title :title="formTitle"></dialog-title>
      </template>
      <el-form :model="addWorkFlow" ref="addPageRef" :rules="formRules" label-width="120px">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="addWorkFlow.name" placeholder="请输入模型名称"></el-input>
        </el-form-item>
        <el-form-item label="模型key" prop="key">
          <el-input v-model="addWorkFlow.key" placeholder="请输入模型key"></el-input>
        </el-form-item>
        <el-form-item label="模型分类" prop="category">
          <el-select v-model="addWorkFlow.category" placeholder="模型分类" style="width: 100%">
            <el-option
              v-for="item in processCategory"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型描述" prop="description">
          <el-input
            v-model="addWorkFlow.description"
            type="textarea"
            rows="3"
            placeholder="请输入模型描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="importmodelVisible" width="30%">
      <template v-slot:title>
        <dialog-title title="导入模型"></dialog-title>
      </template>
      <div class="upload-desc">请浏览或拖拽.bpmn或.bpmn20.xml扩展名的BPMN XML文件</div>
      <div class="open-model-btn">
        <el-upload
          action
          :show-file-list="false"
          :before-upload="checkBpmn"
          :on-error="onUploadError"
          :http-request="uploadBpmn"
          :limit="1"
          ref="uploadRef"
        >
          <el-button icon="el-icon-folder-opened" size="mini" type="primary">选择文件</el-button>
        </el-upload>
      </div>
      <div class="drag-box">
        <el-upload
          class="upload-demo"
          drag
          action
          :show-file-list="false"
          :before-upload="checkBpmn"
          :on-error="onUploadError"
          :http-request="uploadBpmn"
          :limit="1"
          ref="dragUploadRef"
        >
          <div class="el-upload__text">拖拽一个 .bpmn 或者 .bpmn20.xml BPMN XML 文件</div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import useEitter from '@/use/useEitter';
import dayjs from 'dayjs';
import { getModelList, deployModel, saveModel, deleteModel, doImportModel, getProcessType } from '@/api/flowable';
import defaultImage from '@/assets/images/logo.png';
import { confirmBox, debounce, messageAlert } from '@/utils/utils';

const router = useRouter();
const formTitle = ref<string>('创建模型');

//页卡内容框
const contentRef = ref<Element | null>(null);
//没有更多数据
const noMore = ref(false);
//网络连接失败
const networkErr = ref(false);
//列表点击
// const listClick = ref(false);
//防抖的请求数据
const debounceGetPage = debounce(loadMore, 500);

//选项卡选中数据
const activeName = ref('approve');

//模型分类
const processCategory = ref<any>([]);

// 搜索条件表单
const topForm = reactive({
  workflowName: '',
});
// 新增编辑时表单
let addWorkFlow = reactive({
  category: '',
  description: '',
  key: '',
  name: '',
  id: '',
});
// 是否显示弹框
const visible = ref<boolean>(false);
// 是否显示导入模型弹框
const importmodelVisible = ref<boolean>(false);
// 全局事件定义
useEitter([{ key: 'on-refresh-workflowmodel', value: setRefreshWorkflowModel }]);

const currentInstance = getCurrentInstance();
const emitter = currentInstance?.appContext.config.globalProperties.$emitter;

function setRefreshWorkflowModel(visible: boolean): void { }

//跳转到详情
const goDetail = (model) => {
  router.push({
    path: '/systemset/workflowset/design',
    query: { id: model.id },
  });
};

let modelList = ref([]);

// 分页设置
const pagination = reactive({
  current: 1,
  size: 12,
});

const uploadRef = ref<any>(null);

const dragUploadRef = ref<any>(null);

const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};

getProcessType({ codeTypeIds: 'processCategory' }).then((res) => {
  processCategory.value = res.data.processCategory.map((item) => ({
    value: item.value,
    label: item.content,
  }));
  // processCategory.value.push({ value: 'other', label: '未分类' });
});

function getName(name) {
  if (processCategory.value.length) {
    let str = processCategory.value.find((item) => item.value === name);
    return str.label;
  }
  return '';
}

//获取模块下的模型列表数据
async function getPageList(index?: number) {
  networkErr.value = false;
  // listLoading.value = true;
  const para = {
    modelName: topForm.workflowName,
    modelKey: '',
    category: activeName.value,
    // ...pagination,
    size: pagination.size,
    current: index ? index : pagination.current,
  };
  try {
    const res = await getModelList(para);
    const { code, data } = res;
    if (code == 200) {
      if (index) {
        let start = (index - 1) * pagination.size;
        modelList.value.splice(start, pagination.size, ...data.records);
      } else {
        modelList.value.push(...data.records);
        noMore.value = data.last;
      }
    }
  } catch (e) {
    networkErr.value = true;
  } finally {
  }
}

//上传之前检查类型
const checkBpmn = (file: any) => {
  let isBpmn: boolean;
  if (!file.type) {
    //bpmn类型文件无type
    let nameArr = file.name.split('.');
    isBpmn = nameArr[nameArr.length - 1] === 'bpmn' || nameArr[nameArr.length - 1] === 'bpmn20';
  } else {
    isBpmn = file.type === 'text/xml';
  }
  if (!isBpmn) {
    messageAlert('error', '只能上传bpmn、bpmn20或者xml文件！')
  }
  return isBpmn;
};

//上传的方法
const uploadBpmn = async (fileOptions: any) => {
  const formData = new FormData();
  formData.append('file', fileOptions.file);
  const res = await doImportModel(formData);
  if (res.code === 200) {
    messageAlert('success', '导入模型成功')
  }
  activeName.value = 'other';
  refreshList();
  importmodelVisible.value = false;
  uploadRef.value.clearFiles();
  dragUploadRef.value.clearFiles();
};

//上传错误
const onUploadError = (err) => {
  importmodelVisible.value = false;
};

const addPageRef = ref<any>(null);
// 创建模型
const addPage = () => {
  formTitle.value = '创建模型';
  visible.value = true;
  addWorkFlow.name = '';
  addWorkFlow.key = '';
  addWorkFlow.description = '';
  addWorkFlow.category = '';
};
const importModel = () => {
  importmodelVisible.value = true;
};

const formRules = reactive({
  name: [
    { required: true, message: '请输入模型名称', trigger: 'change' },
    { min: 1, max: 50, message: '长度不能超过50个字符', trigger: 'blur' },
    {
      pattern: /^[\u4E00-\u9FA5\w]+$/i,
      message: '格式不正确(只能输入数字、字母、下划线和中文字符)',
      trigger: 'blur',
    },
  ],
  key: [
    { required: true, message: '请输入模型key', trigger: 'blur' },
    { min: 1, max: 50, message: '长度不能超过50个字符', trigger: 'blur' },
    {
      pattern: /^[a-z_][\w-.]*$/i,
      message: '格式不正确(只能输入数字、字母、下划线并且不能以数字开头)',
      trigger: 'blur',
    },
  ],
  category: [{ required: true, message: '请选择模型分类', trigger: 'blur' }],
  description: [
    {
      pattern: /^[\u4E00-\u9FA5\w]*$/i,
      message: '格式不正确(只能输入数字、字母、下划线和中文字符)',
      trigger: 'blur',
    },
  ],
});
//获取图片
function getImg(url) {
  return url ? url : defaultImage;
}
//获取操作的模型按照pagination.size分组后在哪一组
function getGroup(id: number): number {
  let index = modelList.value.findIndex((item) => item.id === id);
  return Math.floor(index / pagination.size) + 1;
}

// 表单提交
const onSubmitForm = () => {
  addPageRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    let params = Object.assign({}, addWorkFlow);
    if (params.id) return;
    const res = await saveModel(params);
    if (res.code == 200) {
      messageAlert('success', '添加成功')
    }
    visible.value = false;
    activeName.value = addWorkFlow.category;
    refreshList();
  });
};

const deployLoading = ref<boolean>(false);
// 点击部署
const onDeploy = async (model: any) => {
  if (deployLoading.value) return;
  deployLoading.value = true;
  const res = await deployModel({ id: model.id });
  deployLoading.value = false;
  if (res.code === 200) {
    getPageList(getGroup(model.id));

    messageAlert('success', '部署成功')
  }
};

// 删除
const onDelete = (model: any) => {
  confirmBox('将删除该模型', async () => {
    const res = await deleteModel({ ids: model.id });
    if (res.code === 200) {
      refreshList();
      messageAlert('success','删除成功')
    }
  });
};

//加载更多
function loadMore() {
  if (noMore.value) return;
  if (!networkErr.value) {
    pagination.current += 1;
  }
  getPageList();
}

//列表刷新
function refreshList() {
  pagination.current = 1;
  contentRef.value.scrollTop = 0;
  modelList.value = [];
  getPageList();
}

getPageList();
onMounted(() => {
  contentRef.value?.addEventListener('scroll', (e: any) => {
    const { offsetHeight, scrollHeight, scrollTop } = e.target;
    if (scrollTop + offsetHeight + 5 >= scrollHeight && scrollTop !== 0) {
      debounceGetPage();
    }
  });
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/workflow/workflowmanage.scss";
</style>
