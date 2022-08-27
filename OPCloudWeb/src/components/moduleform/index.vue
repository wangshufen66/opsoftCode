<template>
  <div class="fixedDialog">
    <component v-if="type" :is="formType" :modelValue="visible" v-bind="dialogAttr">
      <template v-slot:title>
        <dialog-title :title="title"></dialog-title>
      </template>
      <component-form
        :componentList="componentList"
        ref="componentFormRef"
        :formConf="formConf"
        :formData="formData"
      ></component-form>
      <template #footer v-if="type === 'dialog'">
        <span class="dialog-footer">
          <el-button @click="beforeClose()">取 消</el-button>
          <template v-if="formConf.showButton">
            <template v-for="(item, index) in formConf.buttonList">
              <el-button
                v-bind="item"
                plain
                :key="index"
                v-if="isShowBtn(formData, item, index)"
                @click="doEvent(item, formData)"
              >{{ item.title }}</el-button>
            </template>
          </template>
          <el-button v-if="formConf.disabled" type="primary" @click="onEdit">编 辑</el-button>
          <el-button v-if="!formConf.disabled" type="primary" @click="onSubmit">保 存</el-button>
          <slot name="otherBtn"></slot>
        </span>
      </template>
      <span class="draw-footer" v-if="type !== 'dialog'">
        <el-button @click="beforeClose()">取 消</el-button>
        <template v-if="formConf.showButton">
          <template v-for="(item, index) in formConf.buttonList">
            <el-button
              v-bind="item"
              plain
              :key="index"
              v-if="isShowBtn(formData, item, index)"
              @click="doEvent(item, formData)"
            >{{ item.title }}</el-button>
          </template>
        </template>
        <el-button v-if="formConf.disabled" type="primary" @click="onEdit">编辑</el-button>
        <el-button v-if="!formConf.disabled" type="primary" @click="onSubmit">保 存</el-button>
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
  },

  emits: ["update:visible", "onSubmit"],
  setup(props, { emit }) {
    const formConf = computed(() => {
      return props.formConf;
    });

    const { formType, dialogAttr } = useFormDisplay(formConf, beforeClose);

    const DialogAttrs = ref<any>(null);

    const componentFormRef = ref<any>(null);

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
        if (!valid) return;
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
          if (props.formData && __vModel__ in props.formData) {
            params[__vModel__] = props.formData[__vModel__];
          }
        });
        params["id"] = props.formData["id"];
      } else {
        //新增
        params = props.formData;
        // console.log(params);
      }
      return params;
    }


    /**
     * 提交表单
     */
    function onSubmit(): void {
      formValid(() => {
        let params = getParams();
        emit("onSubmit", params);
        resetFields();
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
    const currentInstance = getCurrentInstance();
    const emitter =
      currentInstance?.appContext.config.globalProperties.$emitter;
    function doEvent(item, data) {
      item.data = data;
      emitter.emit("on-do-event-btnform", item);
    }

    /**
     * 详情时 弹出编辑弹窗
     */

    function onEdit() {
      formConf.value.disabled = false;
      emitter.emit("on-change-tabtablebtn");
    }

    function isShowBtn(formData, item, index) {
      if (item.eventCode == "IMPORT_WORK") {
        return true;
      }
      if (!formData.hasOwnProperty("workOrderStatus")) {
        return formData.buttonList ? formData.buttonList[index].show : false;
      }
      if (item.eventCode == "OTHER_WORK") {
        return formData.buttonList ? formData.buttonList[index].show : false;
      }
      if (formData.workOrderStatus == null) {
        return false;
      }
      if (item.eventCode == "START_WORK") {
        if (formData.workOrderStatus == "0") {
          return true;
        } else {
          return false;
        }
      }
      if (item.eventCode == "FINISH_WORK") {
        if (formData.workOrderStatus == "1") {
          return true;
        } else {
          return false;
        }
      }
      if (item.eventCode == "REPORT_WORK") {
        if (formData.workOrderStatus == "1") {
          return true;
        } else {
          return false;
        }
      }
    }

    return {
      componentFormRef,
      formType,
      beforeClose,
      onSubmit,
      onEdit,
      resetFields,
      DialogAttrs,
      dialogAttr,
      getParams,
      formValid,
      doEvent,
      isShowBtn,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/design/preview.scss";
</style>
