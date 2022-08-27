<template>
  <div class="fixedDialog">
    <component
      v-if="type"
      :is="formType"
      title="页面预览"
      v-model="visible"
      v-bind="dialogAttr"
    >
      <el-form
        class="preview-form"
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        :size="formConf.size"
        :label-position="formConf.labelPosition"
        :disabled="formConf.disabled"
        :label-width="`${formConf.labelWidth}px`"
      >
        <template
          v-for="component in currentComponentList"
          :key="component.componentId"
        >
          <el-col :span="component.__form__.span" v-if="!component.funType">
            <el-form-item
              :label="
                (component?.__form__.showLabel && component?.__form__.label) ||
                ''
              "
              :required="component?.__form__?.required"
              :prop="component.__vModel__"
              :label-width="getLabelWidth(component)"
            >
              <component
                :is="component.componentTag"
                :model="formModel"
                :component="component"
              >
              </component>
            </el-form-item>
          </el-col>
          <template v-else>
            <component
              :is="component.componentTag"
              :model="formModel"
              :component="component"
            ></component>
          </template>
        </template>
      </el-form>
      <template #footer v-if="type === 'dialog'">
        <span class="dialog-footer">
          <template
            v-if="formConf.showButton&&formConf.buttonList.length>0"
          >
            <el-button v-bind="item" v-for="(item, index) in formConf.buttonList">{{ item.title }}</el-button>
          </template>
          <el-button @click="resetFields">重 置</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
      <span class="draw-footer" v-if="type !== 'dialog'">
        <template
          v-if="formConf.showButton&&formConf.buttonList.length>0"
        >
          <el-button v-bind="item"  v-for="(item, index) in formConf.buttonList">{{ item.title }}</el-button>
        </template>

        <el-button @click="resetFields">重 置</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </component>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useDesign } from "@/use/useDesign";
import { useForm, useFormDisplay } from "@/use/useForm";

const props = defineProps({
  type: String,
  size: Number,
  direction: String,
  visible: Boolean,
});
// 事件定义
const emit = defineEmits(["update:visible"]);

const { currentComponentList, formConf } = useDesign();
// console.log("formConf00", formConf);

const formRef = ref<any>(null);

const { formModel, formRules, initFormRules,addCompareRules } = useForm(currentComponentList);

const { formType, dialogAttr } = useFormDisplay(formConf, beforeClose);

watch(
  () => props.visible,
  (val) => {
    if (!!val) {
      initFormRules();
    }
  }
);

function beforeClose(): void {
  emit("update:visible", false);
}

// 提交
function submit() {
  formRef.value.validate((valid) => {
    console.log("formModel", formModel);
  });
  
}
// 重置
function resetFields() {
  formRef.value.resetFields();
}

function getLabelWidth(component) {
  const width = component?.__form__?.labelWidth;
  if (width === 0 || !!width) {
    return `${width}px`;
  } else {
    return `${formConf.value.labelWidth || 120}px`;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/design/preview.scss";
</style>
