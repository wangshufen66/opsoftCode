<template>
  <el-drawer @close="closeDrawer" :model-value="show" :title="title" @opened="openDrawer">
    <el-form ref="multiInstanceForm" :model="multiInstance" label-width="80px">
      <el-form-item label="多实例类型">
        <el-select v-model="multiInstance.isSequential" clearable>
          <el-option
            v-for="item in multiInstanceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="循环基数" prop="loopCardinality">
        <el-input v-model="multiInstance.loopCardinality" clearable />
      </el-form-item>
      <el-form-item label="集合">
        <el-input v-model="multiInstance.collection" clearable />
      </el-form-item>
      <el-form-item label="元素变量">
        <el-input v-model="multiInstance.elementVariable" clearable />
      </el-form-item>
      <el-form-item label="完成条件">
        <el-input v-model="multiInstance.completionCondition" clearable />
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button icon="el-icon-close" @click="closeDrawer">取消</el-button>
      <el-button icon="el-icon-check" type="primary" @click="save">确定</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, inject } from 'vue';
import useBpmnFunc from '@/use/useBpmnFunc';
export default defineComponent({
  name: '',
  props: {
    type: String,
    descriptor: {
      type: String,
      default: 'flowable',
    },
    title: String,
    show: Boolean,
    nodeType: String,
  },
  emits: ['closeDraw', 'upListenerLen'],
  setup(props, { emit }) {
    const bpmn: any = inject('flow-modeler');

    //加入hooks函数
    const { updateProperties, descriptorPrefix } = useBpmnFunc(bpmn, props.descriptor);
    const multi = reactive({
      multiInstance: {
        isSequential: '',
        loopCardinality: '',
        collection: '',
        elementVariable: '',
        completionCondition: '',
      },
      //多实例选择
      multiInstanceOptions: [
        {
          value: true,
          label: '串行',
        },
        {
          value: false,
          label: '并行',
        },
      ],
    });
    const multiInstanceForm = ref<Element | null>(null);
    //保存
    function save() {
      if (
        multi.multiInstance.isSequential === undefined ||
        multi.multiInstance.isSequential === ''
      ) {
        delete bpmn.operElement.businessObject.loopCharacteristics;
        multi.multiInstance = {};
        updateProperties({ loopCharacteristics: undefined });
      } else {
        let loopCharacteristics = bpmn.operElement.businessObject.loopCharacteristics;
        if (!loopCharacteristics) {
          loopCharacteristics = bpmn.modeler
            .get('moddle')
            .create('bpmn:MultiInstanceLoopCharacteristics');
        }
        loopCharacteristics.isSequential = multi.multiInstance.isSequential;

        if (multi.multiInstance.collection) {
          loopCharacteristics.set(
            descriptorPrefix.value + 'collection',
            multi.multiInstance.collection
          );
        } else {
          loopCharacteristics.set(descriptorPrefix.value + 'collection', undefined);
        }
        if (multi.multiInstance.elementVariable) {
          loopCharacteristics.set(
            descriptorPrefix.value + 'elementVariable',
            multi.multiInstance.elementVariable
          );
        } else {
          loopCharacteristics.set(descriptorPrefix.value + 'elementVariable', undefined);
        }
        if (multi.multiInstance.loopCardinality) {
          const loopCardinality = bpmn.modeler
            .get('moddle')
            .create('bpmn:Expression', { body: multi.multiInstance.loopCardinality });
          loopCharacteristics['loopCardinality'] = loopCardinality;
        } else {
          loopCharacteristics['loopCardinality'] = undefined;
        }
        if (multi.multiInstance.completionCondition) {
          const completionCondition = bpmn.modeler
            .get('moddle')
            .create('bpmn:Expression', { body: multi.multiInstance.completionCondition });
          loopCharacteristics['completionCondition'] = completionCondition;
        } else {
          loopCharacteristics['completionCondition'] = undefined;
        }
        updateProperties({ loopCharacteristics });
      }
      closeDrawer();
    }
    //关闭抽屉
    function closeDrawer() {
      multi.multiInstance.isSequential = '';
      multi.multiInstance.loopCardinality = '';
      multi.multiInstance.collection = '';
      multi.multiInstance.elementVariable = '';
      multi.multiInstance.completionCondition = '';
      emit('closeDraw');
    }

    function openDrawer() {
      const loopCharacteristics = bpmn.operElement.businessObject?.loopCharacteristics;
      const isSequential =
        loopCharacteristics === undefined ? undefined : loopCharacteristics.isSequential ?? false;
      const data: any = {};
      data.isSequential = isSequential;
      data.collection = loopCharacteristics?.collection;
      data.elementVariable = loopCharacteristics?.elementVariable;
      data.loopCardinality = loopCharacteristics?.loopCardinality?.body;
      data.completionCondition = loopCharacteristics?.completionCondition?.body;
      multi.multiInstance = data;
    }

    return {
      ...toRefs(multi),
      closeDrawer,
      openDrawer,
      save,
      multiInstanceForm,
    };
  },
});
</script>
