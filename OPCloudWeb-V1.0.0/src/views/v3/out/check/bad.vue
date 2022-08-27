<template>
  <div class="m-page-edit">
    <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="不良代码" prop="title">
            <el-input v-model="pageData.formData.reasonCode" @click.stop="openDialog2.show()"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="不良原因" prop="title">
            <el-input v-model="pageData.formData.reasonName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="不良数量" prop="title">
            <el-input-number v-model="pageData.formData.qty" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="fixedDialog">
      <el-dialog v-model="openDialog2.visible" destroy-on-close>
        <bad-list ref="supplierRef" :select-param="openDialog2.selectParam" />
        <template #footer>
          <el-button @click="openDialog2.visible = false">取消</el-button>
          <el-button type="primary" @click.stop="openDialog2.onConfirm">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" >
import { reactive, ref, onMounted } from "vue";
import badList from "../ForSelectList/badList.vue";
export default {
  components: {
    badList
  },
  props: {
    _param: Object,
    toEntity: Object
  },
  setup(props) {
    console.log(props._param);

    const formRules = reactive({
      'pageData.formData.qty': [{ required: true, message: "该字段必填", trigger: "blur" }],
    });

    let pageData = reactive({
      formData: {
        reasonCode: '',
        reasonName: '',
        qty: '',
        ...props._param
      }
    });

    const tableOption = reactive({
      tableData: [],
      tableColums: [
        {
          label: "不良原因代码",
          prop: "reasonCode",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String",
        },
        {
          label: "不良原因名称",
          prop: "reasonName",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String",
        },
        {
          label: "不良数量",
          prop: "qty",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String",
        },
      ],
      selectionCol: false,
      paging: false,
      total: 0,
      tableLoading: false,
      noTableRight: false,
    });

    const getResult = () => {
      return {
        ...pageData.formData
      }
    };

    const supplierRef = ref(null);
    const openDialog2 = reactive({
      visible: false,
      show: () => {
        openDialog2.visible = true
      },
      hidden: () => {
      },
      onConfirm: () => {
        var rows = supplierRef.value?.getResult()
        if (rows.length == 0) {
          return false;
        }
        console.log(rows, '=====row=====')
        pageData.formData.reasonCode = rows[0].FNUMBER;
        pageData.formData.reasonName = rows[0].FBADREASONSNAME;
        openDialog2.visible = false;
      },
      selectParam: {
        master: [{ id: 1001 }],
        selectedRowKeys: [],
      }
    })

    return {
      pageData,
      formRules,
      getResult,
      tableOption,
      openDialog2,
      supplierRef
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>
