<template>
  <div class="fixedDialog">
    <el-dialog :modelValue="visible" @closed="closeDialog" destroy-on-close width="1000px">
      <template v-slot:title>
        <dialog-title title="公式设置"></dialog-title>
      </template>
      <el-button type="primary" @click="onAddRow">添加参数</el-button>
      <table-extend v-bind="tableOption">
        <template #col_paramType="{ data }">
          <span v-if="data.paramType == 0">{{ "字符型" }}</span>
          <span v-if="data.paramType == 1">{{ "数字型" }}</span>
          <span v-if="data.paramType == 2">{{ "布尔型" }}</span>
          <span v-if="data.paramType == 3">{{ "日期型" }}</span>
        </template>
        <template #col_isResult="{ data }">{{ data.isResult == 0 ? "否" : "是" }}</template>
        <template #operatColumn>
          <el-table-column label="操作" fixed="right" min-width="280">
            <template #default="scope">
              <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-extend>

      <div class="formula-con">
        <el-form ref="formRef" :model="formulasetform" size="small" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <template #label>
                  公式预览
                  <el-tooltip content="#仅用做公式字段标识" placement="top" effect="light">
                    <i class="header-icon el-icon-info"></i>
                  </el-tooltip>
                </template>
                <el-input v-model="formulasetform.formula" disabled />
              </el-form-item>
              <el-form-item>
                <el-button @click="formulasetform.formula = ''" type="danger">清空</el-button>
                <el-button @click="ruleValid" type="primary">校验</el-button>
              </el-form-item>

              <el-form-item label="公式字段">
                <el-select v-model="formulasetform.formulaField" clearable filterable>
                  <el-option
                    v-for="(item, index) in formulaList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
                <el-button
                  type="primary"
                  @click="ruleAdd(`#{${formulasetform.formulaField}}`)"
                  :disabled="!formulasetform.formulaField"
                >添加</el-button>
              </el-form-item>
              <el-form-item label="筛选条件">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  type="text"
                  @click="addFilterCondition"
                  style="display: block; margin: 5px 0"
                >添加筛选条件</el-button>
                <div
                  v-for="(item, index) in formulasetform.filterConditionList"
                  :key="index"
                  style="display: flex; margin: 5px 0px"
                >
                  <el-select v-model="item.id" clearable filterable>
                    <el-option
                      v-for="ele in fieldList"
                      :key="ele.value"
                      :value="ele.value"
                      :label="ele.label"
                    ></el-option>
                  </el-select>
                  <div style="margin: 0 10px">
                    <span>是否范围</span>
                    <el-switch v-model="item.conditionType" :active-value="1" :inactive-value="0" />
                  </div>
                  <span
                    class="close-btn"
                    @click="formulasetform.filterConditionList.splice(index, 1)"
                    v-if="formulasetform.filterConditionList.length > 1"
                  >
                    <i class="el-icon-remove-outline" />
                  </span>
                </div>
              </el-form-item>

              <el-form-item label="汇总条件">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  type="text"
                  @click="addSummaryCondition"
                  style="display: block; margin: 5px 0"
                >添加汇总条件</el-button>
                <div
                  v-for="(item, index) in formulasetform.summaryConditionList"
                  :key="index"
                  style="display: flex; margin: 5px 0px"
                >
                  <el-select v-model="item.id" clearable filterable>
                    <el-option
                      v-for="ele in fieldList"
                      :key="ele.value"
                      :value="ele.value"
                      :label="ele.label"
                    ></el-option>
                  </el-select>
                  <span
                    class="close-btn"
                    @click="
                    formulasetform.summaryConditionList.splice(index, 1)
                    "
                    v-if="formulasetform.summaryConditionList.length > 1"
                  >
                    <i class="el-icon-remove-outline" />
                  </span>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <div class="btnList">
                <el-button @click="ruleAdd('0')">0</el-button>
                <el-button @click="ruleAdd('1')">1</el-button>
                <el-button @click="ruleAdd('2')">2</el-button>
                <el-button @click="ruleAdd('3')">3</el-button>
                <el-button @click="ruleAdd('4')">4</el-button>
                <el-button @click="ruleAdd('5')">5</el-button>
                <el-button @click="ruleAdd('6')">6</el-button>
                <el-button @click="ruleAdd('7')">7</el-button>
                <el-button @click="ruleAdd('8')">8</el-button>
                <el-button @click="ruleAdd('9')">9</el-button>
                <el-button @click="ruleAdd('00')">00</el-button>
                <el-button @click="ruleAdd('+')">+</el-button>
                <el-button @click="ruleAdd('-')">-</el-button>
                <el-button @click="ruleAdd('*')">*</el-button>
                <el-button @click="ruleAdd('/')">/</el-button>
                <el-button @click="ruleAdd('(')">(</el-button>
                <el-button @click="ruleAdd(')')">)</el-button>
                <el-button @click="ruleAdd('sum')">sum</el-button>
                <el-button @click="ruleAdd('count')">count</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="onFormulaForm(formulasetform)">保 存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      :title="isEdit ? '编辑参数' : '新增参数'"
      v-model="paramvisible"
      destroy-on-close
      @close="onClose"
      width="600px"
    >
      <el-form :model="paramForm" ref="paramformRef" :rules="formRules" label-width="120px">
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="paramForm.paramName" clearable placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item label="字段" prop="modelKey">
          <el-input v-model="paramForm.modelKey" clearable placeholder="请输入字段"></el-input>
        </el-form-item>
        <el-form-item label="字段类型" prop="paramType">
          <el-select v-model="paramForm.paramType" placeholder="请选择字段类型" clearable>
            <el-option label="字符型" :value="0"></el-option>
            <el-option label="数字型" :value="1"></el-option>
            <el-option label="布尔型" :value="2"></el-option>
            <el-option label="日期型" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否结果">
          <el-switch v-model="paramForm.isResult" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="paramvisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, nextTick, ref, watch } from "vue";
import tableColums from "@/config/tableConfig/formulaSet";
import { getCheckFormula } from "@/api/homeApi/index";
import { getDesignModelType, DesignModelType } from "@/api/functionModel";
import { messageAlert } from "@/utils/utils";

export default defineComponent({
  props: {
    visible: Boolean,
    params: Object,
  },
  setup(props, { emit }) {

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          formModel.value.id = props.params?.id;
          formModel.value.id && getDetail();
        }
      }
    );
    const paramformTitle = ref<string>("");
    const isEdit = ref<Boolean>(false);
    const formModel = ref<any>({
      id: undefined,
    });
    const formulasetform = reactive<any>({
      formula: "",
      filterConditionList: [],
      summaryConditionList: [],
      formulaField: "",
    });

    const pageData = reactive({
      tableList: [],
      tableFieldList: [],
      tableRemark: "",
    });
    const tableOption = reactive({
      tableData: [],
      tableColums: tableColums,
      selectionCol: false,
      paging: false,
      total: 0,
      tableLoading: false,
    });
    // 表单验证规则
    const formRules = reactive({
      paramName: [
        { required: true, message: "请输入参数名称", trigger: "blur" },
      ],
      modelKey: [{ required: true, message: "请输入字段", trigger: "blur" }],
      paramType: [
        { required: true, message: "请选择字段类型", trigger: "blur" },
      ],
    });
    const fieldList = ref<any>([]);

    const formulaList = ref<any>([]);
    /**
     * 获取字段配置
     */
    async function getDetail() {
      const res = await getDesignModelType({ id: formModel.value.id });
      if (res.code == 200) {
        tableOption.tableData = res.data || [];
        fieldList.value = res.data.map((item) => {
          return {
            value: item.id,
            label: item.paramName,
          };
        });
        formulaList.value = res.data.map((item) => {
          return {
            id: item.id,
            value: item.modelKey,
            label: item.paramName,
          };
        });
        formulasetform.filterConditionList = res.data.filter(
          (item) => item.isCondition == 1
        );
        formulasetform.summaryConditionList = res.data.filter(
          (item) => item.isCollect == 1
        );
        res.data.forEach((item) => {
          formulasetform.formula = "";
          if (item.isResult == 1) {
            formulasetform.formula = item.formula;
          }
        });
      }
    }

    function ruleAdd(val) {
      formulasetform.formula = formulasetform.formula + val;
    }
    function ruleValid() {
      let ruleItem = formulasetform.formula;
      if (!ruleItem) {
        messageAlert("error", "公式不能为空");
        return;
      }
      if (ruleItem.indexOf("sum") > -1) {
        ruleItem = ruleItem.replace("sum", "");
      }
      if (ruleItem.indexOf("count") > -1) {
        ruleItem = ruleItem.replace("count", "");
      }
      let formula = ruleItem.replace(/#\{.*?\}/g, "#{value}");
      getCheckFormula({ formula: formula }).then((res: any) => {
        if (res.code == 200) {
          messageAlert("success", "验证通过");
        }
      });
    }

    const paramForm = reactive({
      id: "",
      paramName: "",
      modelKey: "",
      paramType: "",
      isResult: "",
      num: "",
      isCondition: "",
      conditionType: "",
      isCollect: "",
    });

    // 是否显示编辑弹框
    const paramvisible = ref<boolean>(false);
    /**
     * 编辑
     */
    function onEdit(row: any) {
      isEdit.value = true;
      paramformTitle.value = "编辑参数";
      paramvisible.value = true;
      paramForm.id = row.id;
      paramForm.paramName = row.paramName;
      paramForm.modelKey = row.modelKey;
      paramForm.paramType = row.paramType;
      paramForm.isResult = row.isResult;
      paramForm.isCondition = row.isCondition;
      paramForm.conditionType = row.conditionType;
      paramForm.isCollect = row.isCollect;
      paramForm.num = row.num;
    }

    /**
     * 删除
     */
    function onDelete(row: any) {
      let findex;
      if (row.id) {
        findex = tableOption.tableData.findIndex((v) => v.id === row.id);
      } else {
        findex = tableOption.tableData.findIndex((v) => v.num === row.num);
      }
      tableOption.tableData.splice(findex, 1);
    }

    const onAddRow = () => {
      isEdit.value = false;
      paramvisible.value = true;
      paramformTitle.value = "添加模块";
      paramForm.id = "";
      paramForm.paramName = "";
      paramForm.modelKey = "";
      paramForm.paramType = "";
      paramForm.isResult = "";
      paramForm.isCondition = "";
      paramForm.conditionType = "";
      paramForm.isCollect = "";
    };
    const formRef = ref<any>(null);
    const paramformRef = ref<any>(null);
    // 弹框关闭事件
    function onClose() {
      paramformRef.value?.resetFields();
    }
    // 点击提交模块表单
    const onSubmitForm = (): void => {
      paramformRef.value.validate((valid: boolean) => {
        if (!valid) return;
        if (isEdit.value) {
          let findex2;
          if (paramForm.id) {
            findex2 = tableOption.tableData.findIndex((f) => {
              return f.id === paramForm.id;
            });
          } else {
            findex2 = tableOption.tableData.findIndex((f) => {
              return f.num === paramForm.num;
            });
          }
          console.log("findex2", findex2);

          tableOption.tableData[findex2].paramName = paramForm.paramName;
          tableOption.tableData[findex2].modelKey = paramForm.modelKey;
          tableOption.tableData[findex2].paramType = paramForm.paramType;
          tableOption.tableData[findex2].isResult = paramForm.isResult;
        } else {
          tableOption.tableData.push({
            id: null,
            paramName: paramForm.paramName,
            modelKey: paramForm.modelKey,
            paramType: paramForm.paramType,
            isCollect: "",
            modelTypeId:
              tableOption.tableData[0]?.modelTypeId || formModel.value.id,
            isResult: paramForm.isResult,
            isCondition: "",
            conditionType: "",
            formula: "",
            num: new Date().getTime(),
          });
        }

        formulaList.value = tableOption.tableData.map((item) => {
          return {
            // value: item.id || item.num,
            id: item.id || item.num,
            value: item.modelKey,
            label: item.paramName,
          };
        });

        fieldList.value = tableOption.tableData.map((item) => {
          return {
            value: item.id || item.num,
            label: item.paramName,
          };
        });

        paramvisible.value = false;
      });
    };

    const onFormulaForm = (formulasetform): void => {

      tableOption.tableData.forEach((item) => {
        item.isCondition = 0;
        item.isCollect = 0;
        if (item.isResult == 1) {
          item.formula = formulasetform.formula;
        }
        formulasetform.filterConditionList.forEach((element, len) => {
          if (item.id == element.id || item.num == element.id) {
            item.isCondition = 1;
            item.conditionType = element.conditionType;
          }
        });
        formulasetform.summaryConditionList.forEach((ele) => {
          if (item.id == ele.id || item.num == ele.id) {
            item.isCollect = 1;
          }
        });
      });

      DesignModelType(tableOption.tableData).then((res) => {
        if (res.code == 200) {
          messageAlert("success", "保存成功");
          closeDialog();
        } else {
          messageAlert("error", "保存失败");
          closeDialog();
        }
      });


    };

    /**
     * 关闭弹窗
     */
    function closeDialog() {
      nextTick(() => {
        emit("update:visible", false);
      });
    }
    /**
     * 添加过滤条件
     */
    const addFilterCondition = () => {
      console.log("33", formulasetform.filterConditionList);
      if (formulasetform.filterConditionList) {
        formulasetform.filterConditionList.push({});
      }
    };
    /**
     * 添加汇总条件
     */
    const addSummaryCondition = () => {
      console.log("44", formulasetform.summaryConditionList);
      if (formulasetform.summaryConditionList) {
        formulasetform.summaryConditionList.push({});
      }
    };

    return {
      closeDialog,
      tableOption,
      formModel,
      formulasetform,
      formRules,
      ruleAdd,
      ruleValid,
      fieldList,
      pageData,
      onEdit,
      paramvisible,
      paramForm,
      onClose,
      formRef,
      onAddRow,
      paramformTitle,
      onSubmitForm,
      onFormulaForm,
      onDelete,
      addFilterCondition,
      addSummaryCondition,
      isEdit,
      formulaList,
      paramformRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.formula-con {
  .btnList {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .el-button {
    margin: 5px 10px;
  }
}
</style>
