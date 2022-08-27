<template>
  <div class="appsupdate-form">
    <el-form
      :model="appForm"
      ref="appFormRef"
      :inline="false"
      :rules="appFormRule"
      label-width="120px"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="应用名称" prop="appName">
            <el-input
              v-model="appForm.appName"
              clearable
              placeholder="应用名称,长度在2~10个字"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="显示标题" prop="isShowName">
            <el-select
              v-model="appForm.isShowName"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="显示" :value="1"></el-option>
              <el-option label="不显示" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="应用排序" prop="ord">
            <el-input
              v-model="appForm.ord"
              type="number"
              clearable
              placeholder="应用排序号"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="是否可用" prop="isUsing">
            <el-select
              v-model="appForm.isUsing"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="可用" :value="0"></el-option>
              <el-option label="不可用" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="常用应用" prop="isCommon">
            <el-select
              v-model="appForm.isCommon"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
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
                <img
                  class="uploadImg"
                  v-if="appForm.backgroundImagePath"
                  :src="appForm.backgroundImagePath"
                />
                <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传 jpg/png 文件，且不超过 500kb
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="btns">
          <el-button @click="onSubmitCancel">取 消</el-button>
          <el-button
            type="primary"
            :loading="btnloading"
            @click="onSubmitAppForm"
            >保 存</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { uploadBgImage } from "@/api/homeApi/index";
import { setStorage } from "@/utils/utils";

import { getAppById, updateAppInfoById, addAppList } from "@/api/homeApi/index";

const route = useRoute();

const router = useRouter();

const imgloading = ref<boolean>(false);
const btnloading = ref<boolean>(false);

const appForm = reactive({
  appName: "",
  ord: "",
  isUsing: 0,
  isCommon:0,
  isShowName: 1,
  backgroundImagePath: "",
});
const appFormRef = ref<any>(null);
// 上传之前
const beforeUpload = (file) => {
  console.log(file);
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 <= 500;
  if (!isJPG) {
    ElMessage({
      type: "error",
      message: "上传头像图片只能是 JPG 或者 PNG 格式!",
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

// 修改应用表单验证规则
const appFormRule = reactive({
  appName: [
    { required: true, message: "请输入应用名称", trigger: "blur" },

    { min: 2, max: 10, message: "长度在 2 到 10 个字之间", trigger: "blur" },
    {
      pattern: /^[^0-9][\u4E00-\u9FA5A-Za-z0-9_]+$/,
      message: "名称不能数字开头且不能包含特殊字符",
      trigger: "blur",
    },
  ],
  ord: [{ required: true, message: "请输入应用排序", trigger: "blur" }],
  isUsing: [{ required: true, message: "请选择是否可用", trigger: "blur" }],
  isCommon: [{ required: true, message: "请选择是否为常用应用", trigger: "blur" }],
  icon: { required: true, message: "请上传背景图片", trigger: "blur" },
  isShowName: [{ required: true, message: "请选择是否显示", trigger: "blur" }],
});

// 点击提交应用表单,新增应用
const onSubmitAppForm = (): void => {
  btnloading.value = true;
  appFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      btnloading.value = false;
      return;
    }
    if (route.query.appid) {
      updateAppInfoById({ ...appForm, id: route.query.appid }).then(
        (res: any) => {
          if (res.code == 200) {
            ElMessage.success({
              message: "修改成功",
              type: "success",
            });
            getInfo(res.data.id);
          }
          btnloading.value = false;
        }
      );
    } else {
      addAppList(appForm).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: "添加成功",
            type: "success",
          });
          getInfo(res.data.id);
          router.replace({
            path: "/systemset/appsupdate",
            query: {
              appid: res.data.id,
            },
          });
        }
        btnloading.value = false;
      });
    }
  });
};
// 上传图片
const upload = async (fileOptions: any): Promise<void> => {
  imgloading.value = true;
  const formData = new FormData();
  formData.append("file", fileOptions.file);
  console.log(fileOptions.file);
  const res = await uploadBgImage(formData);
  if (res.code == 200) {
    appForm.backgroundImagePath = res.data.filePath;
    imgloading.value = false;
  } else {
    imgloading.value = false;
  }
};

function onUploadError() {
  imgloading.value = false;
}



// 表单取消操作
const onSubmitCancel = () => {
  router.push("/systemset/mange/appsset");
};
// 获取应用信息
const getInfo = (val) => {
  let para = {
    applicationId: val,
    isActive: 0,
  };
  getAppById(para).then((res: any) => {
    if (res.code == 200) {
      setStorage("appName", res.data.appName);
      appForm.appName = res.data.appName;
      appForm.isUsing = res.data.isUsing;
      appForm.isCommon = res.data.isCommon;
      appForm.isShowName = res.data.isShowName;
      appForm.ord = res.data.ord;
      appForm.backgroundImagePath = res.data.backgroundImagePath;
    }
  });
};
onMounted(() => {
  if (route.query.appid) {
    getInfo(route.query.appid);
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/appdetail.scss";
</style>
