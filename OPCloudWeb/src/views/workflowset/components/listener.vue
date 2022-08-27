<template>
  <el-drawer @closed="closeDrawer" :model-value="show" :title="title" @opened="openDrawer">
    <div style="padding: 10px">
      <el-table
        ref="listenersRef"
        :data="listenersArr"
        border
        fit
        highlight-current-row
        @row-click="editListener"
        v-if="!isService"
      >
        <el-table-column prop="eventType" label="事件" align="center" />
        <el-table-column prop="listenerType" label="类型" align="center">
          <template #default="scope">
            <span>{{ itemType(scope.row.listenerType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="值" prop="itemValue" align="center"></el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button icon="el-icon-delete" @click.stop="deleteListener(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="showForm || isService" class="bpmn-listener">
        <el-divider v-if="!isService"></el-divider>
        <el-form :model="formData" ref="formDataRef" :rules="fromRules" label-width="80px">
          <el-form-item label="事件类型" prop="eventType" v-if="!isService">
            <el-select v-model="formData.eventType" placeholder="请选择">
              <el-option v-for="item in eventType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="监听类型" prop="listenerType" v-if="!isService">
            <el-select v-model="formData.listenerType" placeholder="请选择" @change="typeChange">
              <el-option v-for="item in listenerTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="值"
            prop="value"
            :rules="!isService ? { required: true, message: '该项不能为空', trigger: 'blur' } : {}"
          >
            <el-input v-model="formData.value" @input="changValue" v-if="!showSelect" type="textarea" rows="3" />
            <el-select
              v-model="formData.value"
              :disabled="!isService && formData.listenerType === ''"
              @change="changValue"
              @clear="cleanServe"
              v-else
              clearable
            >
              <el-option v-for="item in valueList" :key="item.value" :label="item.content" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="参数">
            <el-badge :value="paramLen">
              <el-button @click="openParamDraw">编辑</el-button>
            </el-badge>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="text-align: center; padding: 10px">
      <el-button icon="el-icon-plus" type="primary" @click="addListener" v-if="!isService">添加</el-button>
      <el-button icon="el-icon-close" @click="cancel">取消</el-button>
      <el-button icon="el-icon-check" type="primary" @click="save">确定</el-button>
    </div>

    <listenerparam
      @closeParamsDraw="onCloseParams"
      @saveParams="saveParams"
      :show="showParamsDrawer"
      :editIndex="editIndex"
      :listenerParams="listenerParams"
    ></listenerparam>
  </el-drawer>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, ref, inject } from 'vue';
import listenerparam from './listenerparam.vue';
import useBpmnFunc from '@/use/useBpmnFunc';
import { ElMessage } from 'element-plus';
import { param, listenerArr, valueInp } from '@/interfaces/flowableConfig';
import { getProcessType } from '@/api/flowable';

export default defineComponent({
  name: 'listener',
  props: {
    type: String,
    show: Boolean,
    title: String,
    descriptor: {
      type: String,
      default: 'flowable',
    },
    nodeType: String,
  },
  components: {
    listenerparam,
  },
  emits: ['closeDraw', 'upListenerLen'],
  setup(props, { emit }) {
    const bpmn: any = inject('flow-modeler');
    const { descriptorPrefix, updateProperties, updateProperty } = useBpmnFunc(bpmn, props.descriptor);
    //监听器表格
    const listen = reactive<listenerArr>({
      listenersArr: [],
      listenerTypes: [
        { value: 'class', label: '类' },
        { value: 'expression', label: '表达式' },
        { value: 'delegateExpression', label: '代理表达式' },
      ],
    });

    //value信息
    const valueInp = reactive<valueInp>({
      showSelect: true,
      valueList: [],
    });

    const listenersRef = ref<any>(null);

    //事件类型表单
    const form = reactive({
      showForm: false,
      formData: {
        eventType: '',
        listenerType: '',
        value: '',
        itemValue: '',
      },
      fromRules: {
        eventType: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
        listenerType: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
        // value: [
        //   { required: true, message: '该项不能为空', trigger: 'blur' },
        //   // {
        //   //   pattern: /^[\u4E00-\u9FA5\w]{1,500}$/,
        //   //   message: '只能输入数字、字母、下划线和中文字符且长度不能超过500',
        //   //   trigger: 'blur',
        //   // },
        // ],
      },
    });
    const formDataRef = ref<any>(null);

    //参数
    const param = reactive<param>({
      //监听参数列表
      listenerParams: [],
      //参数抽屉显示隐藏
      showParamsDrawer: false,
      //编辑参数的索引
      editIndex: 0,
    });

    //计算任务类型下拉样式
    const eventType = computed(() => {
      if (props.type === 'Task') {
        // valueInp.param = ;
        getValueList('flowableTaskListener');
        return [
          { value: 'create', label: 'create' },
          { value: 'assignment', label: 'assignment' },
          { value: 'complete', label: 'complete' },
          { value: 'delete', label: 'delete' },
        ];
      } else {
        // valueInp.param = ;
        getValueList('flowableExecutionListener');
        return [
          { value: 'start', label: 'start' },
          { value: 'take', label: 'take' },
          { value: 'end', label: 'end' },
        ];
      }
    });
    //参数的长度
    const paramLen = computed(() => {
      return param.listenerParams.length;
    });

    //是否为服务
    const isService = computed(() => {
      const flag = props.nodeType === 'bpmn:ServiceTask';
      if (flag) {
        getValueList('flowableTaskClass');
      }
      return flag;
    });

    //下拉列表参数翻译
    const itemType = function (type: string) {
      switch (type) {
        case 'class':
          return '类';
        case 'expression':
          return '表达式';
        case 'delegateExpression':
          return '代理表达式';
      }
    };

    //类型改变
    function typeChange() {
      //为class类型显示下拉框
      valueInp.showSelect = form.formData.listenerType === 'class';
      form.formData.value = '';
    }
    //值的下拉列表获取
    async function getValueList(param) {
      const res = await getProcessType({ codeTypeIds: param });
      valueInp.valueList = res.data[param];
    }

    //服务任务清除监听
    function cleanServe() {
      if (!isService.value) return;
      param.listenerParams = [];
    }

    //输入框选中改变值
    function changValue() {
      if (form.formData.listenerType === 'class') {
        form.formData.itemValue = valueInp.valueList.find((item) => item.value === form.formData.value)?.content;
      } else {
        form.formData.itemValue = form.formData.value;
      }
    }

    function addFunc(valied: boolean) {
      if (!valied) return;
      form.showForm = true;
      let val = {
        eventType: '',
        listenerType: '',
        value: '',
        itemValue: '',
      };
      listen.listenersArr.push(val);
      form.formData = val;
      listenersRef.value.setCurrentRow(val, true);
      param.listenerParams = [];
    }
    //添加事件
    function addListener() {
      if (!form.showForm) {
        addFunc(true);
      } else {
        formDataRef.value.validate((val) => {
          addFunc(val);
        });
      }
    }
    //点击表格编辑监听事件
    function editListener(row) {
      // formDataRef.value.validate((val) => {
      //   if (!val) return;
      valueInp.showSelect = row.listenerType === 'class';
      formDataRef.value.clearValidate();
      form.showForm = true;
      form.formData = row;
      param.editIndex = listen.listenersArr.indexOf(row);
      param.listenerParams = listen.listenersArr[param.editIndex]?.params ?? [];
      // });
    }

    function addListenerProperties(container, params, str) {
      if (params && params.length) {
        params.forEach((field) => {
          const fieldElement = bpmn.modeler.get('moddle').create(descriptorPrefix.value + 'Field');
          fieldElement['name'] = field.name;
          const valueElement = bpmn.modeler.get('moddle').create(descriptorPrefix.value + field.paramType, {
            body: field.value,
          });
          fieldElement.set(field.paramType, valueElement);
          container.get(str).push(fieldElement);
        });
      }
    }

    function saveFunc(val: boolean) {
      if (!val) return;
      //创建外层bpmn2:extensionElements标签
      let extensionElements = bpmn.operElement.businessObject.get('extensionElements');
      if (!extensionElements) {
        extensionElements = bpmn.modeler.get('moddle').create('bpmn:ExtensionElements');
      }
      //筛选出属于当前类别的属性
      extensionElements.values =
        extensionElements.values?.filter((item) => item.$type !== descriptorPrefix.value + props.type + 'Listener') ??
        [];
      //更加判断是否为任务节点执行
      if (!isService.value) {
        //记录原来的数组长度
        let len = listen.listenersArr.length,
          tempArr: any = null;
        tempArr = listen.listenersArr.filter(
          (item) => item.eventType !== '' && item.listenerType !== '' && item.value !== ''
        );
        if (tempArr.length < len) {
          ElMessage.warning('事件类型、监听类型和值不能为空');
          return;
        }
        tempArr.forEach((item) => {
          const listener = bpmn.modeler.get('moddle').create(descriptorPrefix.value + props.type + 'Listener');
          listener['event'] = item.eventType;
          listener[item.listenerType] = item.value;
          addListenerProperties(listener, item.params, 'fields');
          extensionElements.get('values').push(listener);
        });
        //修改监听器长度
        emit('upListenerLen', tempArr.length);
      } else {
        extensionElements.values = [];
        updateProperty('class', form.formData.value, true);
        addListenerProperties(extensionElements, param.listenerParams, 'values');
        emit('upListenerLen', !!form.formData.value, isService.value);
      }
      //把创建好的bpmn2:extensionElements放到元素上
      updateProperties({
        extensionElements: extensionElements.get('values')?.length == 0 ? undefined : extensionElements,
      });
      closeDrawer();
    }
    //点击确定
    function save() {
      if (isService.value) {
        formDataRef.value.validate((val) => {
          saveFunc(val);
        });
        return;
      }
      if (!form.showForm) {
        saveFunc(true);
      } else {
        formDataRef.value.validate((val) => {
          saveFunc(val);
        });
      }
    }

    //删除监听器
    function deleteListener(index) {
      formDataRef.value.clearValidate();
      form.showForm = false;
      listen.listenersArr.splice(index, 1);
      param.listenerParams = [];
    }

    //关闭抽屉时
    function closeDrawer() {
      form.showForm = false;
      formDataRef.value.clearValidate();
      listen.listenersArr = [];
      emit('closeDraw');
    }

    //点击取消
    function cancel() {
      emit('closeDraw');
    }

    //打开抽屉时
    function openDrawer() {
      const res: any = [],
        arr = bpmn.operElement.businessObject.extensionElements?.values ?? [];
      if (isService.value) {
        param.listenerParams = arr.map((field) => {
          let fieldItem: any = Object.entries(field).find((item) => item[0] !== '$type' && item[0] !== 'name');
          return {
            name: field.name,
            paramType: fieldItem[0],
            value: fieldItem[1].body,
          };
        });
        form.formData.value = bpmn.operElement.businessObject.class;
        return;
      }
      form.showForm = false;
      // formDataRef.value.resetFields();
      form.formData = {
        eventType: '',
        listenerType: '',
        value: '',
        itemValue: '',
      };
      for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        if (item.$type === descriptorPrefix.value + props.type + 'Listener') {
          let type: any = Object.keys(item).find((item) => item !== '$type' && item !== 'event');
          let str = '';

          if (type === 'class') {
            str = valueInp.valueList.find((v) => item[type] === v.value)?.content;
          } else {
            str = item[type];
          }
          res.push({
            eventType: item.event,
            listenerType: type,
            value: item[type],
            params: item.fields?.map((field) => {
              let fieldItem: any = Object.entries(field).find((item) => item[0] !== '$type' && item[0] !== 'name');
              return {
                name: field.name,
                paramType: fieldItem[0],
                value: fieldItem[1].body,
              };
            }),
            itemValue: str,
          });
        }
      }
      listen.listenersArr = res;
    }

    //打开参数抽屉
    function openParamDraw() {
      formDataRef.value.validate((val) => {
        if (!val) return;
        param.showParamsDrawer = true;
      });
    }
    //关闭参数抽屉
    function onCloseParams() {
      param.showParamsDrawer = false;
    }

    //保存参数
    function saveParams(value) {
      param.listenerParams = value.val;
      if (isService.value) return;
      if (listen.listenersArr[value.index]) {
        listen.listenersArr[value.index].params = value.val;
      } else {
        listen.listenersArr[value.index] = {
          params: value.val,
        };
      }
    }
    return {
      ...toRefs(listen),
      ...toRefs(valueInp),
      ...toRefs(form),
      ...toRefs(param),
      typeChange,
      cleanServe,
      listenersRef,
      eventType,
      itemType,
      addListener,
      deleteListener,
      editListener,
      openParamDraw,
      paramLen,
      save,
      cancel,
      closeDrawer,
      openDrawer,
      onCloseParams,
      saveParams,
      formDataRef,
      isService,
      changValue,
    };
  },
});
</script>
