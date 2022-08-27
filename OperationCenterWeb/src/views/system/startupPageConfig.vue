<template>
  <div class="role-list">
    <div class="search-wrap">
      <el-input
        type="text"
        placeholder="请输入标题"
        v-model.trim="searchForm.title"
        clearable
        @keyup.enter="onSearch"
      ></el-input>

      <div class="button-wrap">
        <el-button type="primary" style="margin-left: 10px;" @click="onSearch">搜索</el-button>
        <el-button class="btn-add" type="primary" @click="onAdd">新建启动页</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_status="{ data }">
        <div
          :style="{ color: data.status == 0 ? '#FB6C4F' : '#3468D4' }"
        >{{ data.status == 0 ? '禁用' : '启用' }}</div>
      </template>
      <template #col_type="{ data }" min-width="280">
        <span>{{ data.type == 0 ? '启动页' : '客户登录页' }}</span>
      </template>
      <template #col_createTime="{ data }">
        <span>{{ formatTime(data.createTime) }}</span>
      </template>
      <template #col_imgAddress="{ data }">
        <el-button
          type="text"
          v-if="data.imgAddress"
          @click="onPreviewPicture(data.imgAddress)"
        >点击查看</el-button>
        <el-button v-else type="text" disabled>--</el-button>
      </template>

      <template #operatColumn>
        <el-table-column label="操作" fixed="left" width="220">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              plain
              @click="onStatus(scope.row)"
            >{{ scope.row.status == 1 ? '禁用' : '启用' }}</el-button>
            <el-button type="primary" plain size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="small" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <el-dialog
      :title="formTitle"
      v-model="dialogVisible"
      destroy-on-close
      @close="closeDialog"
      width="800px"
    >
      <template v-slot:title>
        <DialogTitle :dialogTitle="formTitle"></DialogTitle>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item prop="title" label="标题">
          <el-input placeholder="请输入标题" v-model="dataForm.title" style="width:420px"></el-input>
        </el-form-item>
        <el-form-item label="选择终端" prop="platformList" width="200px">
          <el-checkbox-group v-model="dataForm.platformList">
            <el-checkbox label="web"></el-checkbox>
            <el-checkbox label="ios"></el-checkbox>
            <el-checkbox label="小程序"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="dataForm.type">
            <el-option label="启动页" :value="0"></el-option>
            <el-option label="客户登录页" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示时长">
          <el-input-number v-model="dataForm.showTime" :min="0" label="展示时长"></el-input-number>
          <i>秒</i>
        </el-form-item>
        <el-form-item label="启动图">
          <div class="upload-demo" v-loading="imgloading">
            <el-upload
              class="upload-demo-item"
              list-type="picture-card"
              :before-upload="beforeUpload"
              action
              :on-error="onUploadError"
              :show-file-list="false"
              :http-request="upload"
            >
              <img
                class="uploadImg"
                v-if="dataForm.backgroundImagePath"
                :src="dataForm.backgroundImagePath"
              />
              <i class="el-icon-plus avatar-uploader-icon" v-else></i>
              <template #tip>
                <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
              </template>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item
          placeholder="请选择"
          prop="jumpPage"
          label="跳转链接"
          style="margin-right: 20px;width:800px"
        >
          <el-select v-model="dataForm.jumpPage" filterable style="width: 200px; margin-right:20px">
            <el-option lable="外链" value="外链"></el-option>
            <el-option label="内部界面" value="内部界面"></el-option>
            <el-option label="内部H5" value="内部H5"></el-option>
          </el-select>
          <el-input
            style="width: 200px; margin-right:20px"
            v-model="dataForm.jumpUrl"
            placeholder="请输入跳转链接"
          ></el-input>

          <!-- <el-select v-model="dataForm.jumpUrl" style="width: 200px; "> -->
          <!-- <el-option label="WWW.baidu.com" value="WWW.baidu.com"></el-option>
            <el-option label="内部界面" value="内部界面"></el-option>
            <el-option label="内部H5" value="内部H5"></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
  <el-image-viewer
    v-if="hasImageViewer"
    ref="imageViewerRef"
    v-show="imageViewer.show"
    :url-list="imageViewer.filePathList"
    hide-on-click-modal
    @close="imageViewer.show = false"
  ></el-image-viewer>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, nextTick } from 'vue';
import { uploadBgImage } from "@/api/system";
import tableColums from '@/config/tableConfig/starupPageConfig';
import { ElMessage } from 'element-plus';
import { confirmBox } from '@/utils/utils';
import dayjs from 'dayjs';
import DialogTitle from '@/components/dialogTitle/index.vue';
import {
  getStarUpList,
  addStarUpList,
  updateStarUpList,
  delStarUpList,
} from '@/api/system';

//表单ref
const formRef = ref<any>(null);
const hasImageViewer = ref<boolean>(false);
const imgloading = ref<boolean>(false)
//保存按钮的loading
const subLoading = ref<boolean>(false);
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? '编辑启动页' : '新建启动页';
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
const imageViewer = ref({
  show: false,
  filePathList: [] as any
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 15,
});

//添加和编辑的表单
const dataForm = reactive({
  id: undefined,
  title: '',
  status: '',
  platform: '',//平台
  backgroundImagePath: '',
  platformList: [],//平台列表
  isDisable: '',//是否启用
  type: '',//类型
  imgId: '',//启动图
  imgAddress: '',//图片地址
  jumpPage: '',//跳转
  jumpUrl: '',
  showTime: '',//展示时长
  img: ''

});
//添加和编辑表单的验证规则
const formRules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  platformList: [{ required: true, message: '请选择终端', trigger: 'blur' }],
  jumpPage: [{ required: true, message: '请选择跳转链接', trigger: 'blur' }],
  status: [{ required: true, message: '请选择启用状态', trigger: 'blur' }],


});


function onPreviewPicture(files: string) {
  if (!files) return;
  hasImageViewer.value = true;
  imageViewer.value.filePathList = [files];
  imageViewer.value.show = true;
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.pageSize = pageSize as number;
  getDataList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.currentPage = pageIndex as number;
  getDataList();
}

// 查询表单参数
const searchForm = reactive({
  title: undefined,
});
// 查询
function onSearch() {
  pagination.currentPage = 1;
  getDataList();
}
//新增角色   
function onAdd() {
  isEdit.value = false;
  dialogVisible.value = true;

}
function closeDialog() {
  dialogVisible.value = false;
  formRef.value.resetFields();
}
// 编辑角色
function onEdit(row: any) {
  isEdit.value = true;
  dialogVisible.value = true;
  nextTick(() => {
    dataForm.backgroundImagePath = row.imgAddress;
    dataForm.id = row.id;
    dataForm.title = row.title;
    dataForm.type = row.type;
    dataForm.status = row.status;
    dataForm.jumpPage = row.jumpPage;
    dataForm.platformList = row.platformList || []
  })
}


// 获取数据
async function getDataList() {
  tableOption.tableLoading = true;
  const params = {
    ...pagination,
    ...searchForm
  };
  const res = await getStarUpList(params);
  const { code, data } = res;
  if (code === 200) {
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  tableOption.tableLoading = false;
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    subLoading.value = true;
    const res = dataForm.id ? await updateStarUpList({ ...dataForm }) : await addStarUpList(dataForm)
    if (res.code === 200) {
      ElMessage.success({
        message: res.msg,
        type: 'success'
      });
      getDataList();
      dialogVisible.value = false;
    }
    subLoading.value = false;
    closeDialog()
  });
}


//禁用/启用
function onStatus(row) {
  //更改启用禁用状态,调用跟新的接口
  confirmBox('解除该启动页配置停用状态', async () => {
    const res = row.status == 0 ? await updateStarUpList({
      id: row.id,
      status: 1
    }) : await updateStarUpList({
      id: row.id,
      status: 0
    });
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getDataList();
    }
  });
}

//删除
function onDelete(row) {
  confirmBox('删除该启动页', async () => {
    const res = await delStarUpList({ id: row.id });
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getDataList();
    }
  });
}

function onUploadError() {
  imgloading.value = false;
}
// 图片上传之前
const beforeUpload = (file) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 <= 500;
  if (!isJPG) {
    ElMessage({
      type: "error",
      message: "上传图片只能是 JPG 或者 PNG 格式!",
    });
  }
  if (!isLt2M) {
    ElMessage({
      type: "error",
      message: "上传头像图片大小不能超过500KB!",
    });
  }
  return isJPG && isLt2M;
};


// 上传图片
const upload = async (fileOptions: any): Promise<void> => {
  imgloading.value = true;
  const formData = new FormData();
  formData.append("file", fileOptions.file);
  const res = await uploadBgImage(formData);
  if (res.code == 200) {
    dataForm.backgroundImagePath = res.data.filePath;
    dataForm.imgId = res.data.id;
    dataForm.imgAddress = res.data.filePath;

    imgloading.value = false;
  } else {
    imgloading.value = false;
  }
};

function formatTime(str) {
  if (!str) return '';
  return dayjs(str).format('YYYY-MM-DD HH:mm')
}
getDataList();
</script>


<style lang="scss" scoped>
@import "@/styles/modules/system/startupPageConfig.scss";
</style>
