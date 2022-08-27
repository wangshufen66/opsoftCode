<template>
  <div class="content-search">
    <el-form :model="searchForm" :inline="true" @submit.prevent>
      <el-form-item label="模块名称">
        <el-input
          v-model="searchForm.modelName"
          @keyup.enter="searchModel"
          clearable
          placeholder="模块名称"
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="searchModel">搜索</el-button>
      <el-button type="primary" @click="onAddRow">添加模块</el-button>
    </el-form>
    <template v-if="tableOption.total > 0">
      <table-extend
        v-bind="tableOption"
        @handleSelectionChange="handleSelectionChange"
        @pageSizeChange="handleSizeChange"
        @currentChange="currentChange"
        :batchDelete="true"
        @dataDelete="dataDelete"
      >
        <template #col_isUsing="{ data }">
          {{
            data.isUsing == "0" ? "可用" : "不可用"
          }}
        </template>
        <template #operatColumn>
          <el-table-column label="操作" min-width="160" fixed="right">
            <template #default="scope">
              <el-button type="text" size="small" @click="goModelDetail(scope.row)">编辑页面</el-button>
              <el-button type="text" size="small" @click="onEditRow(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="onDelRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-extend>
    </template>
    <template v-else>
      <el-empty description="暂无数据"></el-empty>
    </template>
  </div>
  <el-dialog :title="formTitle" v-model="visible" destroy-on-close @close="onClose" width="600px">
    <template v-slot:title>
      <dialog-title :title="formTitle"></dialog-title>
    </template>

    <el-form :model="form" :rules="formRules" ref="formRef" label-width="120px">
      <el-form-item label="模块名称" prop="modelName">
        <el-input v-model="form.modelName" clearable placeholder="请输入模块名称,长度在2~10个字"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="menuIcon">
        <el-input v-model="form.menuIcon" placeholder="请选择模块菜单图标" clearable>
          <template #append>
            <el-button @click="openIconsDialog()">选择</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否可用" prop="isUsing">
        <el-select v-model="form.isUsing" placeholder="请选择">
          <el-option label="可用" :value="0"></el-option>
          <el-option label="不可用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="ord">
        <el-input type="number" min="1" v-model="form.ord" placeholder="请输入模块排序"></el-input>
      </el-form-item>
      <el-form-item label="上传背景图片">
        <div class="upload-demo" v-loading="imgloading">
          <el-upload
            class="upload-demo-item"
            :before-upload="beforeUpload"
            action
            :on-error="onUploadError"
            :show-file-list="false"
            :http-request="upload"
            list-type="picture-card"
          >
            <img class="uploadImg" v-if="form.backgroundImagePath" :src="form.backgroundImagePath" />
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
            <template #tip>
              <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmitForm">保 存</el-button>
    </template>
  </el-dialog>
  <icons-dialog
    v-model:visible="iconDialogState.visible"
    :current="form.menuIcon"
    @select="setIcon"
  />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getModelListBypage,
  delModelInfoById,
  updateModelInfoById,
  addModel,
  delModels,
  uploadBgImage
} from "@/api/homeApi/index";
import IconsDialog from "@/components/iconSelect/index.vue";
import columnmodelconfig from "@/config/tableConfig/modelconfig";
import { confirmBox, messageAlert, setStorage } from "@/utils/utils";

const formTitle = ref<string>("");

const loading = ref(false);

const formRef = ref<any>(null);

const visible = ref(false);

const route = useRoute();

const appid: string = route.query.appid as string;

const router = useRouter();

const deleteIds = ref<number[]>([]);

const searchForm = reactive({
  modelName: "",
});

// 表单数据对象
const form = reactive({
  backgroundImagePath: "",
  isUsing: 0,
  modelName: "",
  id: undefined,
  ord: 1,
  menuIcon: undefined,
});

// 添加模块表单验证规则
const formRules = reactive({
  modelName: [
    { required: true, message: "请输入模块名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字之间", trigger: "blur" },
    {
      pattern: /^[^0-9][\u4E00-\u9FA5A-Za-z0-9_]+$/,
      message: "名称不能数字开头且不能包含特殊字符",
      trigger: "blur",
    },
  ],
  isUsing: { required: true, message: "请选择", trigger: "blur" },
  ord: [{ required: true, message: "请输入模块排序", trigger: "blur" }],
});

/**
 * 图标选择
 **/
const iconDialogState = reactive({
  visible: false,
});

// 点击查询模块列表
function searchModel() {
  if (searchForm.modelName) {
    pageRequest.pageIndex = 1;
  }
  getModels();
}

//列表配置项
const tableOption = reactive({
  tableData: [],
  tableColums: columnmodelconfig,
  paging: true,
  total: 0,
  tableLoading: false,
  border: false,
});

// 分页器
const pageRequest = reactive({
  pageIndex: 1,
  pageSize: 15,
});

//分页
function handleSizeChange(val) {
  pageRequest.pageSize = val.pageSize;
  console.log(val);
  getModels();
}
function currentChange(val) {
  pageRequest.pageIndex = val.pageIndex;
  getModels();
}

// 获取应用下的模块列表
async function getModels() {
  let para = {
    appid: appid,
    modelName: searchForm.modelName,
    pageRequest: pageRequest,
    isActive: 0,
  };
  if (!para.appid) {
    return;
  }
  tableOption.tableLoading = true;
  const res = await getModelListBypage(para);
  if (res.code == 200) {
    tableOption.tableData = res.data.records;
    tableOption.total = res.data.total;
  }
  tableOption.tableLoading = false;
}
// 批量选择
function handleSelectionChange(vals) {
  console.log("选中的data", vals);
  if (vals.length > 0) {
    deleteIds.value = vals.map((item) => {
      return +item.id;
    });
  } else {
    deleteIds.value = [];
  }
}

// 批量删除
function dataDelete() {
  if (deleteIds.value.length == 0) {
    messageAlert("error", "请选择要删除的数据");
  } else {
    confirmBox("删除数据", async () => {
      const res = await delModels(deleteIds.value);
      if (res.code == 200) {
        messageAlert("success", "删除成功");
        getModels();
      }
    });
  }
}

// 删除模块
const onDelRow = (row) => {
  let para = {
    modelid: row.id,
  };
  confirmBox("删除数据", async () => {
    const res = await delModelInfoById(para);
    if (res.code == 200) {
      messageAlert("success", "删除成功");
      getModels();
    }
  });
};

// 点击提交模块表单
const onSubmitForm = (): void => {
  loading.value = true;
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      let para = { ...form, appId: appid };
      // 更新
      if (para.id) {
        const res = await updateModelInfoById(para);
        if (res.code == 200) {
          messageAlert("success", "修改成功");
          visible.value = false;
        }
        loading.value = false;
      } else {
        // 新增
        const res = await addModel(para);
        if (res.code == 200) {
          messageAlert("success", "添加成功");
          visible.value = false;
        }
        loading.value = false;
      }
      // 刷新列表
      getModels();
    } else {
      loading.value = false;
      return false;
    }
  });
};

function openIconsDialog() {
  iconDialogState.visible = true;
}

/**
 * 确认选择图标
 */
function setIcon(val) {
  form.menuIcon = val;
}

//模块里面的页面设计
const goModelDetail = (row) => {
  setStorage("currentModelName", row.modelName);
  router.push({
    path: "/systemset/appsupdate/pagelist",
    query: {
      appid: appid,
      modelid: row.id,
    },
  });
};

// 新增显示控制
const onAddRow = () => {
  if (!appid) {
    messageAlert("error", "请先添加应用");
    return;
  }
  visible.value = true;
  formTitle.value = "添加模块";
  nextTick(() => {
    form.id = undefined;
  });
};

// 点击编辑事件
const onEditRow = (row) => {
  visible.value = true;
  formTitle.value = "编辑模块";
  nextTick(() => {
    form.modelName = row.modelName;
    form.isUsing = row.isUsing;
    form.id = row.id;
    form.ord = row.ord;
    form.menuIcon = row.menuIcon;
    form.backgroundImagePath = row.backgroundImagePath;
  });
};

// 弹框关闭事件
function onClose() {
  formRef.value?.resetFields();
  form.backgroundImagePath = "";
}

//图片加载
const imgloading = ref<boolean>(false);

// 上传之前
const beforeUpload = (file) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 <= 500;
  if (!isJPG) {
    messageAlert('error', "上传头像图片只能是 JPG 或者 PNG 格式!")
  }
  if (!isLt2M) {
    messageAlert('error', "上传头像图片大小不能超过500KB!")
  }
  return isJPG && isLt2M;
};
//上传错误
function onUploadError() {
  imgloading.value = false;
}

// 上传图片
const upload = async (fileOptions: any): Promise<void> => {
  imgloading.value = true;
  const formData = new FormData();
  formData.append("file", fileOptions.file);
  console.log(fileOptions.file);
  const res = await uploadBgImage(formData);
  if (res.code == 200) {
    form.backgroundImagePath = res.data.filePath;
    imgloading.value = false;
  } else {
    imgloading.value = false;
  }
};

onMounted(() => {
  if (appid) {
    getModels();
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/modellist.scss";
</style>
