<template>
  <div class="fixedDialog">
    <el-dialog :modelValue="visible" @closed="closeDialog" destroy-on-close width="1000px">
      <template v-slot:title>
        <dialog-title :title="title"></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="模型类型" prop="modelType">
          <el-select
            v-model="dataForm.modelType"
            placeholder="请选择模型类型"
            style="width: 100%"
            :disabled="!!dataForm.id"
            filterable
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="模型名称" prop="modelName">
          <el-input v-model="dataForm.modelName" placeholder="请输入模型名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="使用状态">
          <el-radio-group v-model="dataForm.isUsing">
            <el-radio :label="1">可用</el-radio>
            <el-radio :label="0">不可用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="所属">
          <el-radio-group v-model="dataForm.belong">
            <el-radio :label="0">内部</el-radio>
            <el-radio :label="1">外部</el-radio>
          </el-radio-group>
          <el-input
            v-model="dataForm.outsidelink"
            placeholder="请输入"
            clearable
            style="position: absolute; width: 70%; right: 80px"
          ></el-input>
        </el-form-item>

        <el-form-item label="模型说明">
          <el-input v-model="dataForm.modelSpec" placeholder="请输入模型说明" clearable></el-input>
        </el-form-item>
        <el-form-item label="计算结果">
          <el-radio-group v-model="dataForm.notVirtualResuit">
            <el-radio :label="0">视图类</el-radio>
            <el-radio :label="1">实体类</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="saveLoding" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, inject, nextTick, ref, watch } from "vue";
import { addModelType, updateModelType, functionModelType } from "@/api/functionModel";
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
      modelType: "",
      modelName: "",
      isUsing: "",
      belong: "",
      outsidelink: "",
      modelSpec: "",
      notVirtualResuit: "",
    });

    const formRules = reactive({
      modelName: [
        { required: true, message: "请输入模型名称", trigger: "blur" },
      ],
      modelType: [
        { required: true, message: "请选择模型类型", trigger: "blur" },
      ],
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
            ? await addModelType(dataForm)
            : await updateModelType(dataForm);
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
      const res = await functionModelType({ id: dataForm.id });
      if (res.code == 200) {
        dataForm.modelName = res.data.modelName;
        dataForm.modelType = res.data.modelType;
        dataForm.belong = res.data.belong;
        dataForm.isUsing = res.data.isUsing;
      }
    }

    return {
      title,
      dataForm,
      formRules,
      typeList: parent?.typeList,
      formRef,
      saveLoding,
      closeDialog,
      onSubmitForm,
    };
  },
});
</script>
