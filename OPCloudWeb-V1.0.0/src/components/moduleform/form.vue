<template>
  <el-form
    class="preview-form"
    :model="formData"
    :rules="formRules"
    ref="formRef"
    :inline="formConf?.inline"
    :size="formConf?.size"
    :label-position="formConf?.labelPosition"
    :disabled="formConf?.disabled"
    :label-width="`${formConf?.labelWidth}px`"
    @submit.prevent
  >
    <template v-for="(group,index) in formComponentList" :key="group.key">
      <!-- 标题组件 -->
      <template v-if="group.parentNode">
        <template v-for="component in group.componentList" :key="component.componentId">
          <el-col
            v-if="component?.__config__?.inForm === true || component?.__config__?.inForm == undefined"
            :span="component?.__form__?.span"
          >
            <el-form-item
              :label="(component?.__form__?.showLabel && component?.__form__?.label) || ''"
              :prop="component.__vModel__"
              :required="component?.__form__?.required"
              :label-width="getLabelWidth(component)"
            >
              <div class="item-title-wrap" @click="onExpandItems(group)">
                <component :is="component.componentTag" :model="formData" :component="component"></component>
                <i
                  class="el-icon-arrow-down expand-icon"
                  :style="`transform:rotate(${group.expand ? 0 : -90}deg);`"
                ></i>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </template>
      <template v-else>
        <el-collapse-transition>
          <el-row
            class="items-wrap"
            v-show="index - 1 > -1 ? formComponentList[index - 1].expand : true"
          >
            <template v-for="component in group.componentList" :key="component.componentId">
              <el-col
                v-if="component?.__config__?.inForm === true || component?.__config__?.inForm == undefined"
                :span="component?.__form__?.span"
              >
                <el-form-item
                  :label="(component?.__form__?.showLabel && component?.__form__?.label) || ''"
                  :prop="component.__vModel__"
                  :required="component?.__form__?.required"
                  :label-width="getLabelWidth(component)"
                >
                  <component
                    :is="component.componentTag"
                    :model="formData"
                    :component="component"
                    @click="doEvent(component)"
                  ></component>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-collapse-transition>
      </template>
    </template>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, computed, getCurrentInstance, provide } from 'vue';
import type { PropType } from 'vue';
import { useForm } from '@/use/useForm';
import type { ModuleFormProvide, FormDisplayStructure } from '@/use/useForm';
import type { DesignComponent } from '../designComponent';

const props = defineProps({
  formConf: Object,
  componentList: {
    type: Array as PropType<DesignComponent[]>,
    default: [],
  },
  formData: Object,
})

provide<ModuleFormProvide>('moduleForm', {
  formComponents: props.componentList,
});

const { formRules, initFormRules, addCompareRules } = useForm(props.componentList);

const currentInstance = getCurrentInstance();

const emitter =
  currentInstance?.appContext.config.globalProperties.$emitter;

const formRef = ref<any>(null);

/**组件呈现结构 */
const formComponentList = ref<FormDisplayStructure[]>();

/**
 * 初始化搜索表单结构
 */
function initFormData() {
  // 如果未传递数据，则解析组件，生成Model结构
  if (props.formData) {
    props.componentList.map((component) => {
      const __vModel__ = component.__vModel__;
      if (__vModel__ && !(__vModel__ in props.formData)) {
        props.formData[__vModel__] = null;
      }
    });
  }
  initGroupComponent();
}

function initGroupComponent() {
  const itemList: FormDisplayStructure[] = [];
  let nodeComponentList: DesignComponent[] = []
  for (let i = 0; i < props.componentList.length; i++) {
    const component = props.componentList[i];
    if (component.componentTag === 'designLabel') {
      // 增加之前数据
      i != 0 && itemList.push({
        key: +new Date(),
        parentNode: false,
        expand: true,
        componentList: [...nodeComponentList]
      })
      // label标签单独分组
      itemList.push({
        key: +new Date(),
        parentNode: true,
        expand: true,
        componentList: [component]
      })
      nodeComponentList = []
      continue;
    }
    //  重置
    nodeComponentList.push(component);
    if (i === props.componentList.length - 1) {
      itemList.push({
        key: +new Date(),
        parentNode: false,
        expand: true,
        componentList: [...nodeComponentList]
      });
    }
  }
  formComponentList.value = itemList;
}

/**
 * 重置表单
 */
function resetFields() {
  formRef.value.resetFields();
  props.formData &&
    Object.keys(props.formData).forEach((key) => {
      props.formData && (props.formData[key] = null);
    });
}

/**
 * 表单验证
 */
function formValid() {
  let flag = false;
  formRef.value.validate((valid) => {
    flag = valid;
  });
  return flag;
}

function getLabelWidth(component) {
  const width = component?.__form__?.labelWidth;
  if (width === 0 || !!width) {
    return `${width}px`;
  } else {
    return `${props.formConf?.labelWidth || 120}px`;
  }
}

function doEvent(component) {
  if (component.componentTag === 'designButton') {
    emitter.emit('on-do-event', { visible: false, component });
  }
}

function onExpandItems(group: any) {
  group.expand = !group.expand;
}

/**开放功能 */
defineExpose({
  formRef
})

initFormData();

initFormRules();

addCompareRules();

</script>

<style lang="scss" scoped>
.items-wrap {
  max-width: 100%;
  width: 100%;
}
.item-title-wrap {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.expand-icon {
  transform-origin: center;
  transition: transform 0.35s ease-in-out;
}
</style>
