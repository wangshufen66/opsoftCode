<template>
  <div class="upload-wrap">
    <el-upload
      ref="uploadRef"
      v-bind="component?.__attr__"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :on-exceed="onExceed"
    >
      <template v-if="component?.__attr__.drag">
        <el-icon>
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </template>
      <template v-else>
        <template v-if="component?.__attr__['list-type'] === 'text'">
          <el-button size="small" type="primary">点击上传</el-button>
        </template>
        <template v-else-if="component?.__attr__['list-type'] === 'picture-card'">
          <el-icon>
            <plus />
          </el-icon>
        </template>
      </template>
    </el-upload>
    <template v-if="component?.__attr__['list-type'] === 'picture-card'">
      <el-image-viewer
        v-show="imageViewerShow"
        :url-list="filePathList"
        :initial-index="imageViewerIndex"
        hide-on-click-modal
        @close="onImageViewerClose"
      ></el-image-viewer>
    </template>
  </div>
</template>

<script lang="ts">
import { PropType, ref, onMounted, computed, watch } from "vue";
import { UploadComponent } from "./IConfig";
import { deepClone, getToken, messageAlert } from "@/shared/utils/utils";

export default {
  name: "designUpload",
  props: {
    component: Object as PropType<UploadComponent>,
    model: Object,
  },
  setup(props) {
    const uploadRef = ref<any>(null);
    const imageViewerShow = ref<boolean>(false);
    const imageViewerIndex = ref<number>(0);

    const filePathList = computed(() => {
      let fileList = props.model[props.component.__vModel__];
      if (typeof fileList === 'string') {
        fileList = JSON.parse(fileList);
      }
      return (fileList && fileList.length > 0 && fileList.map((m) => m.url)) || [];
    });

    watch(
      () => props.model[props.component?.__vModel__],
      (fileList) => {
        if (typeof fileList === 'string') {
          const files = JSON.parse(fileList);
          uploadRef.value.uploadFiles = files;
        } else if (fileList && fileList.length > 0) {
          uploadRef.value.uploadFiles = deepClone(fileList);
        } else {
          uploadRef.value.uploadFiles = [];
        }
      }
    );

    function beforeUpload(file) {
      const type = props.component?.__attr__.accept,
        name = file.name;
      if (!type?.length) {
        messageAlert('warning', "请先设置允许上传的文件类型")
        return false;
      }
      if (file.size === 0) {
        messageAlert('warning', "请勿上传空白文件")
        return false;
      }
      const tempStr = type.split(",");
      const typeReg = new RegExp(tempStr.join("|") + "$");
      if (!typeReg.test(name)) {
        messageAlert('error', `不允许上传的文件类型,请上传${tempStr.join(" ")}类型的文件`)
        return false;
      }
      /**文件类型检测*/
      if (props.component?.__config__?.takeToken) {
        let token = getToken("accessToken");
        const headers = props.component?.__attr__?.headers;
        headers.Authorization = `Bearer ${token}`;
      }
      if (!props.component?.__attr__?.action) {
        messageAlert('error', `请设置上传接口地址`)
        return false;
      }
      const maxSize = props.component?.__config__?.maxSize;
      if (props.component?.__config__ && maxSize) {
        const exceedSize = file.size / 1024 / 1024 < maxSize;
        if (!exceedSize) {
          messageAlert('error', `上传文件大小不能超过 ${maxSize}MB!`)
        }
        return exceedSize;
      }
      return true;
    }

    function onSuccess(response) {
      if (!response.data) {
        return;
      }
      const { id, filePath, originalFileName } = response.data;
      if (!props.model[props.component.__vModel__]) {
        props.model[props.component.__vModel__] = [];
      }
      props.model[props.component.__vModel__].push({
        id,
        name: originalFileName,
        url: filePath,
      });
    }

    function onError(err) {
      messageAlert('error', "上传失败，请重试")
    }

    function onPreview(file) {
      if (
        props.component &&
        props.component.__attr__["list-type"] !== "picture-card"
      )
        return;
      const { id } = file.response?.data || file;
      const index = props.model[props.component.__vModel__].findIndex(
        (f) => f.id === id
      );
      imageViewerIndex.value = index;
      imageViewerShow.value = true;
    }

    function onRemove(file) {
      const { id } = file.response?.data || file;
      const index = props.model[props.component.__vModel__].findIndex(
        (f) => f.id === id
      );
      index > -1 && props.model[props.component.__vModel__].splice(index, 1);
    }

    function onImageViewerClose() {
      imageViewerShow.value = false;
    }

    function onExceed(files) {
      const limit = props.component?.__attr__.limit;
      if (limit && files.length > limit) {
        messageAlert('warning', `上传文件数不能大于${limit}`)
      }
    }

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] = [];
      }
    }

    onMounted(() => {
      init();
    });

    return {
      uploadRef,
      imageViewerShow,
      imageViewerIndex,
      filePathList,
      beforeUpload,
      onSuccess,
      onError,
      onRemove,
      onPreview,
      onImageViewerClose,
      onExceed,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-upload-list__item-thumbnail {
  object-fit: contain;
}
</style>
