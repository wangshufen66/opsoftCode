<template>
  <el-drawer
    title="参数维护"
    :append-to-body="true"
    :model-value="show"
    direction="rtl"
    @closed="closeDraw"
    @open="openDraw"
  >
    <!-- @open="init" -->
    <div style="padding: 10px">
      <el-table
        ref="paramsRef"
        :data="tableData"
        border
        fit
        highlight-current-row
        @row-click="editParam"
      >
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column prop="paramType" label="类型" align="center">
          <template #default="scope">
            <span>{{ itemType(scope.row.paramType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="值" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button icon="el-icon-delete" @click.stop="deleteParam(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="showForm" class="bpmn-listener">
        <el-divider></el-divider>
        <el-form :model="formData" ref="formDataRef" :rules="fromRules" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="类型" prop="paramType">
            <el-select v-model="formData.paramType" placeholder="请选择">
              <el-option
                v-for="item in paramTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input v-model="formData.value" type="textarea" rows="3" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="text-align: center; padding: 10px">
      <el-button icon="el-icon-plus" type="primary" @click="addParam">添加</el-button>
      <el-button icon="el-icon-close" @click="closeDraw">取消</el-button>
      <el-button icon="el-icon-check" type="primary" @click="save">确定</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: 'listenerparam',
  props: {
    show: Boolean,
    editIndex: Number,
    listenerParams: {
      type: Object,
      default: {},
    },
  },
  emits: ['closeParamsDraw', 'saveParams'],
  setup(props, { emit }) {
    //页面表格数据
    const tableData: any = ref([]);
    //页面表单相关数据
    const form = reactive({
      //表单显示
      showForm: false,
      //下拉框参数
      paramTypes: [
        { value: 'string', label: '字符串' },
        { value: 'expression', label: '表达式' },
      ],
      //表单数据
      formData: {
        name: '',
        paramType: '',
        value: '',
      },
      fromRules: {
        name: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          // {
          //   pattern: /^[\u4E00-\u9FA5\w]{1,500}$/,
          //   message: '只能输入数字、字母、下划线和中文字符且长度不能超过500',
          //   trigger: 'blur',
          // },
        ],
        paramType: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
        value: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          // {
          //   pattern: /^[\u4E00-\u9FA5\w]{1,500}$/,
          //   message: '只能输入数字、字母、下划线和中文字符且长度不能超过500',
          //   trigger: 'blur',
          // },
        ],
      },
    });

    const formDataRef = ref<any>(null);

    //table元素标签
    const paramsRef = ref<Element | null>(null);

    //计算table下拉显示
    const itemType = computed(() => {
      return function (type: string) {
        switch (type) {
          case 'string':
            return '字符串';
          case 'expression':
            return '表达式';
        }
      };
    });

    //点击table编辑参数
    function editParam(row) {
      formDataRef.value.clearValidate();
      form.showForm = true;
      form.formData = row;
    }

    function addFunc(valied: boolean) {
      if (!valied) return;
      form.showForm = true;
      let val = {
        name: '',
        paramType: '',
        value: '',
      };
      tableData.value.push(val);
      form.formData = val;
      paramsRef.value?.setCurrentRow(val, true);
    }

    //添加参数按钮
    function addParam() {
      if (!form.showForm) {
        addFunc(true);
      } else {
        formDataRef.value.validate((val) => {
          addFunc(val);
        });
      }
    }
    //点击删除参数
    function deleteParam(index) {
      formDataRef.value.clearValidate();
      tableData.value.splice(index, 1);
      form.showForm = false;
    }

    function saveFunc(val) {
      if (!val) return;
      let len = tableData.value.length,
        tempArr: any = null;
      tempArr = tableData.value.filter(
        (item) => item.paramType !== '' && item.name !== '' && item.value !== ''
      );
      if (tempArr.length < len) {
        ElMessage({
          type: 'warning',
          showClose: true,
          message: '名称、类型和值不能为空',
          duration: 1500,
        });
        return;
      }
      emit('saveParams', { val: tableData.value, index: props.editIndex });
      closeDraw();
    }
    //保存参数按钮
    function save() {
      if (!form.showForm) {
        saveFunc(true);
      } else {
        formDataRef.value.validate((val) => {
          saveFunc(val);
        });
      }
    }

    //打开抽屉
    function openDraw() {
      tableData.value = [...props.listenerParams];
      form.showForm = false;
      // formDataRef.value.resetFields();
      form.formData = {
        name: '',
        paramType: '',
        value: '',
      };
    }
    //关闭抽屉
    function closeDraw() {
      form.showForm = false;
      formDataRef.value.clearValidate();
      emit('closeParamsDraw');
    }

    return {
      tableData,
      ...toRefs(form),
      editParam,
      itemType,
      addParam,
      deleteParam,
      openDraw,
      save,
      closeDraw,
      paramsRef,
      formDataRef,
    };
  },
});
</script>
