<template>
  <div class="fixedDialog">
    <el-dialog
      :modelValue="visible"
      @closed="closeDialog"
      destroy-on-close
      width="600px"
    >
      <template v-slot:title>
        <dialog-title :title="title"></dialog-title>
      </template>
      <el-form
        :model="dataForm"
        ref="formRef"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="模型名称" prop="modelName">
          <el-input
            v-model="dataForm.modelName"
            placeholder="请输入模型名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="模型类型" prop="modelType">
          <el-select
            v-model="dataForm.modelType"
            placeholder="请选择模型类型"
            style="width: 100%;"
            :disabled="!!dataForm.id"
            filterable
            clearable
          >
            <el-option
              v-for="item in modelTypeList"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称" prop="appId">
          <el-select
            v-model="dataForm.appId"
            placeholder="请选应用名称"
            style="width: 100%;"
            filterable
            clearable
          >
            <el-option
              v-for="item in appList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行顺序" prop="ord">
          <el-input
            v-model="dataForm.ord"
            placeholder="请输入执行顺序"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="saveLoding" @click="onSubmitForm"
          >保 存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, inject, nextTick, ref, watch } from "vue";
import { addModel, updateModel, getModelDetail } from "@/api/functionModel";
import { messageAlert } from "@/shared/utils/utils";

export default defineComponent({
  props: {
    visible: Boolean,
    params: Object,
  },
  setup(props, { emit }) {
    const parent = inject("functionModel", {});

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          dataForm.id = props.params?.id;
          title.value = dataForm.id ? "编辑模型" : "新增模型";
          if (dataForm.id) {
            getDetail();
          }
        }
      }
    );

    const title = ref<string>("");

    const formRef = ref<any>(null);

    const dataForm = reactive({
      id: undefined,
      modelName: "",
      modelType: "",
      appId: undefined,
      ord: undefined,
    });

    const formRules = reactive({
      modelName: [
        { required: true, message: "请输入模型名称", trigger: "blur" },
      ],
      modelType: [
        { required: true, message: "请选择模型类型", trigger: "blur" },
      ],
      ord: [{ required: true, message: "请输入执行顺序", trigger: "blur" }],
    });

    const saveLoding = ref<boolean>();

    /**
     * 重置表单
     */
    function resetFields() {
      formRef.value && formRef.value.resetFields();
    }

    /**
     * 关闭弹窗
     */
    function closeDialog() {
      resetFields();
      nextTick(() => {
        emit("update:visible", false);
      });
    }

    function onSubmitForm() {
      saveLoding.value = true;
      formRef.value.validate(async (valid) => {
        if (!valid) {
          saveLoding.value = false;
        } else {
          const res = !dataForm.id
            ? await addModel(dataForm)
            : await updateModel(dataForm);
          saveLoding.value = false;
          if (res.code == 200) {
            messageAlert("success", dataForm.id ? "修改成功" : "新增成功");
            dataForm.id = undefined;
            closeDialog();
            emit("onSubmit");
          }
        }
      });
    }

    async function getDetail() {
      const res = await getModelDetail({ id: dataForm.id });
      if (res.code == 200) {
        const { modelName, modelType, appId, ord } = res.data;
        dataForm.modelName = modelName;
        dataForm.modelType = modelType;
        dataForm.appId = appId;
        dataForm.ord = ord;
      }
    }

    return {
      title,
      dataForm,
      formRules,
      modelTypeList: parent?.modelTypeList,
      appList: parent?.appList,
      formRef,
      saveLoding,
      closeDialog,
      onSubmitForm,
    };
  },
});
</script>
