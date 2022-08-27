<template>
  <el-drawer @closed="closeDrawer" :model-value="show" title="编辑按钮" @opened="openDrawer">
    <div style="padding: 10px">
      <el-table ref="buttonsRef" :data="buttonsArr" border fit highlight-current-row @row-click="editButton">
        <el-table-column prop="value" label="按钮类型" align="center">
          <template #default="scope">
            <span>{{ itemType(scope.row.value) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nameSpace" label="显示名称" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button icon="el-icon-delete" @click.stop="deleteButton(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="showForm" class="bpmn-button">
        <el-divider></el-divider>
        <el-form :model="formData" ref="formDataRef" :rules="fromRules" label-width="80px">
          <el-form-item label="按钮类型" prop="value">
            <el-select v-model="formData.value" placeholder="请选择">
              <el-option v-for="item in buttonTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="显示名称" prop="nameSpace">
            <el-input v-model="formData.nameSpace" rows="3" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="text-align: center; padding: 10px">
      <el-button icon="el-icon-plus" type="primary" @click="addButton">添加</el-button>
      <el-button icon="el-icon-close" @click="cancel">取消</el-button>
      <el-button icon="el-icon-check" type="primary" @click="save">确定</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, inject } from 'vue';
import useBpmnFunc from '@/use/useBpmnFunc';
import { ElMessage } from 'element-plus';
import { btn } from '@/interfaces/flowableConfig';

export default defineComponent({
  name: 'extendBtn',
  props: {
    show: Boolean,
    descriptor: {
      type: String,
      default: 'flowable',
    },
  },
  emits: ['closeDraw', 'refreshButtonList'],
  setup(props, { emit }) {
    const bpmn: any = inject('flow-modeler');
    const { descriptorPrefix, updateProperties, updateProperty } = useBpmnFunc(bpmn, props.descriptor);
    const btn = reactive<btn>({
      buttonsArr: [],
      buttonTypes: [
        { value: 'approve', label: '完成' },
        { value: 'reject', label: '退回' },
        { value: 'save', label: '保存' },
      ],
    });

    const buttonsRef = ref<any>(null);

    //事件类型表单
    const form = reactive({
      showForm: false,
      formData: {
        value: '', //按钮类型
        nameSpace: '', //显示名称
        name: 'processButton',
      },
      fromRules: {
        value: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
        nameSpace: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
      },
    });
    const formDataRef = ref<any>(null);

    //下拉列表参数翻译
    const itemType = function (type: string) {
      switch (type) {
        case 'approve':
          return '完成';
        case 'reject':
          return '退回';
        case 'save':
          return '保存';
      }
    };
    function addFunc(valied: boolean) {
      if (!valied) return;
      form.showForm = true;
      let val = {
        name: 'processButton',
        value: '',
        nameSpace: '',
      };
      btn.buttonsArr.push(val);
      form.formData = val;
      buttonsRef.value.setCurrentRow(val, true);
    }
    //添加事件
    function addButton() {
      if (!form.showForm) {
        addFunc(true);
      } else {
        formDataRef.value.validate((val) => {
          addFunc(val);
        });
      }
    }
    //点击表格编辑监听事件
    function editButton(row) {
      formDataRef.value.clearValidate();
      form.showForm = true;
      form.formData = row;
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
        extensionElements.values?.filter((item) => item.$type !== descriptorPrefix.value + 'ButtonParam') ?? [];
      let len = btn.buttonsArr.length,
        tempArr: any = null;
      tempArr = btn.buttonsArr.filter((item) => item.nameSpace !== '' && item.value !== '');
      if (tempArr.length < len) {
        ElMessage.warning('按钮类型和显示名称不能为空');
        return;
      }
      tempArr.forEach((item) => {
        const btns = bpmn.modeler.get('moddle').create(descriptorPrefix.value + 'ButtonParam');
        btns['name'] = item.name;
        btns['nameSpace'] = item.nameSpace;
        btns['value'] = item.value;
        extensionElements.get('values').push(btns);
      });
      //修改按钮列表
      emit('refreshButtonList', tempArr);
      //把创建好的bpmn2:extensionElements放到元素上
      updateProperties({
        extensionElements: extensionElements.get('values')?.length == 0 ? undefined : extensionElements,
      });
      closeDrawer();
    }
    //点击确定
    function save() {
      if (!form.showForm) {
        saveFunc(true);
      } else {
        formDataRef.value.validate((val) => {
          saveFunc(val);
        });
      }
    }

    //删除监听器
    function deleteButton(index) {
      formDataRef.value.clearValidate();
      form.showForm = false;
      btn.buttonsArr.splice(index, 1);
    }

    //关闭抽屉时
    function closeDrawer() {
      form.showForm = false;
      formDataRef.value.clearValidate();
      btn.buttonsArr = [];
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
      form.showForm = false;
      form.formData = {
        value: '',
        nameSpace: '',
        name: '',
      };
      for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        item.$type;
        if (item.$type === descriptorPrefix.value + 'ButtonParam') {
          res.push({
            name: item.name,
            nameSpace: item.nameSpace,
            value: item.value,
          });
        }
      }
      btn.buttonsArr = res;
    }

    return {
      ...toRefs(btn),
      ...toRefs(form),
      buttonsRef,
      itemType,
      addButton,
      deleteButton,
      editButton,
      save,
      cancel,
      closeDrawer,
      openDrawer,
      formDataRef,
    };
  },
});
</script>
