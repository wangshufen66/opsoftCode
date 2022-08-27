<template>
  <div class="fixedDialog">
    <component v-if="type" :is="formType" :modelValue="visible" v-bind="dialogAttr">
      <template v-slot:title>
        <dialog-title :title="title"></dialog-title>
      </template>
      <component-form :componentList="componentList" ref="componentFormRef" :formConf="formConf" :formData="formData"></component-form>
      <template #footer v-if="type === 'dialog'">
        <span class="dialog-footer">
          <el-button @click="beforeClose()">取 消</el-button>
          <template v-if="formConf.showButton">
            <template v-for="(item, index) in formConf.buttonList">
              <el-button v-bind="item" plain :key="index" v-if="isShowBtn(formData, item, index)" @click="doEvent(item, formData)">{{ item.title }}</el-button>
            </template>
          </template>
          <el-button v-if="formConf.disabled" type="primary" @click="onEdit">编 辑</el-button>
          <el-button v-if="!formConf.disabled" type="primary" :loading="saveLoading" @click="onSubmit">保 存</el-button>
          <slot name="otherBtn"></slot>
        </span>
      </template>
      <span class="draw-footer" v-if="type !== 'dialog'">
        <el-button plain @click="doEventIW" v-if="isShowImportBtn">工艺流程导入</el-button>
        <el-button @click="beforeClose()">取 消</el-button>
        <template v-if="formConf.showButton">
          <template v-for="(item, index) in formConf.buttonList">
            <el-button v-bind="item" plain :key="index" v-if="isShowBtn(formData, index)" @click="doEvent(item, formData)">{{ item.title }}</el-button>
          </template>
        </template>
        <el-button v-if="formConf.disabled" type="primary" @click="onEdit">编辑</el-button>
        <el-button v-if="!formConf.disabled" type="primary" :loading="saveLoading" @click="onSubmit">保 存</el-button>
        <slot name="otherBtn"></slot>
      </span>
    </component>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  PropType,
  computed,
  nextTick,
  getCurrentInstance,
  watch,
} from "vue";
import { useFormDisplay } from "@/use/useForm";
import componentForm from "./form.vue";

export default defineComponent({
  components: { componentForm },
  props: {
    title: String,
    type: String,
    visible: Boolean,
    formConf: Object,
    componentList: {
      type: Array as PropType<Array<any>>,
      default: [],
    },
    formData: Object,
    pageTableName: String,
  },


  emits: ["update:visible", "onSubmit"],
  setup(props, { emit }) {
    watch(
      [
        () => props.formData?.FICMONO,
        () => props.formData?.FProcessCode,
        () => props.formData?.FFEquipmentNumber,
        () => props.formData?.FReportNo,
        () => props.formData?.FReportTime,
        () => props.formData?.FStartTime,
        () => props.formData?.FMouldAmount,
        () => props.formData?.FStartNO,
      ],
      (value) => {
        const params: any = {};
        params.FICMONO = value[0] ? value[0] : null;
        params.FProcessCode = value[1] ? value[1] : null;
        params.FFEquipmentNumber = value[2] ? value[2] : null;
        params.FReportNO = value[3] ? value[3] : null;
        params.FReportTime = value[4] ? value[4] : null;
        params.FStartTime = value[5] ? value[5] : null;
        params.FMouldAmount = value[6] ? value[6] : 1;
        params.FStartNO = value[7] ? value[7] : null;
        if (
          params.FICMONO &&
          params.FProcessCode &&
          params.FFEquipmentNumber &&
          params.FReportTime &&
          params.FStartTime &&
          params.FReportNO
        ) {
          emitter.emit("on-do-event-setFReportQuantity", {
            params,
            formData: props.formData,
          });
        }
      }
    );

    const formConf = computed(() => {
      return props.formConf;
    });

    const currentInstance = getCurrentInstance();
    const emitter =
      currentInstance?.appContext.config.globalProperties.$emitter;

    const { formType, dialogAttr } = useFormDisplay(formConf, beforeClose);

    const DialogAttrs = ref<any>(null);

    const componentFormRef = ref<any>(null);

    const saveLoading = ref<boolean>(false);

    /**
     * 关闭弹窗事件
     */
    function beforeClose(): void {
      closeDialog();
    }

    /**
     * 重置表单
     */
    function resetFields() {
      const formRef = componentFormRef.value.formRef;
      formRef && formRef.resetFields();
      props.formData &&
        Object.keys(props.formData).forEach((key) => {
          props.formData && (props.formData[key] = undefined);
        });
    }
    /**
     *表单验证
     */
    function formValid(callback) {
      const formRef = componentFormRef.value.formRef;
      formRef.validate((valid) => {
        if (!valid) {
          saveLoading.value = false;
          return;
        }
        callback && callback();
      });
    }

    /**
     * 获取表单参数
     */
    function getParams() {
      let params: any = {};
      if (props.formData && props.formData["id"]) {
        //编辑
        props.componentList.forEach((component) => {
          const __vModel__ = component.__vModel__;
          if (props.formData && props.formData.hasOwnProperty(__vModel__)) {
            params[__vModel__] = props.formData[__vModel__];
          }
        });
        params["id"] = props.formData["id"];
      } else {
        //新增
        params = props.formData;
      }
      return params;
    }

    /**
     * 提交表单
     */
    function onSubmit(): void {
      saveLoading.value = true;
      formValid(() => {
        let params = getParams();
        emit("onSubmit", {
          params: params,
          callback: (result) => {
            saveLoading.value = false;
            result && resetFields();
          },
        });
      });
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

    function doEvent(item, data) {
      item.data = data;
      item.componentList = props.componentList
      emitter.emit("on-do-event-btnform", item);
    }
    function doEventIW() {
      let item = {
        eventCode: "IMPORT_WORK",
        closeable: false
      }
      emitter.emit("on-do-event-btnform", item);
    }

    /**
     * 详情时 弹出编辑弹窗
     */
    function onEdit() {
      formConf.value.disabled = false;
      emitter.emit("on-change-tabtablebtn");
    }

    function isShowBtn(formData, index) {
      return (
        (formData.buttonList &&
          formData.buttonList[index] &&
          formData.buttonList[index].show) ||
        false
      );
    }
    const isShowImportBtn = computed(() => {
      let regOrder = /^t_aegongdan_mshengchanzhixing_pICMO$/;
      if (!props.formData.id && regOrder.test(props.pageTableName)) {
        return true
      } else {
        return false
      }

    })

    return {
      componentFormRef,
      formType,
      DialogAttrs,
      dialogAttr,
      saveLoading,
      beforeClose,
      onSubmit,
      onEdit,
      resetFields,
      getParams,
      formValid,
      doEvent,
      doEventIW,
      isShowBtn,
      isShowImportBtn,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/design/preview.scss";
</style>
