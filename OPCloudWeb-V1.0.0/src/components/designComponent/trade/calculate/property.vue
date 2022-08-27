<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="字段名">
      <el-input
        v-model="componentCfg.__vModel__"
        :disabled="componentCfg.__runtime__?.fieldDisabled"
        placeholder="请输入字段名"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <el-form-item label="占位文本">
      <el-input v-model="componentCfg.__attr__.placeholder" placeholder="设置占位文本" clearable></el-input>
    </el-form-item>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="显示标题">
          <el-switch v-model="componentCfg.__form__.showLabel" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格展示">
          <el-switch v-model="componentCfg.__config__.inTable" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表单展示">
          <el-switch v-model="componentCfg.__config__.inForm" />
        </el-form-item>
      </el-col>
    </div>
    <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>
    <div class="divider-wrap">公式设置</div>
    <el-form-item label="公式设置">
      <el-input v-model="componentCfg.__config__.formula" disabled>
        <template #append>
          <el-button title="设置外键" icon="el-icon-s-unfold" @click.stop="onSetFielClick"></el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="结果类型">
      <el-select v-model="componentCfg.__config__.resultType" filterable clearable>
        <el-option :value="1" label="值"></el-option>
        <el-option :value="2" label="百分比"></el-option>
      </el-select>
    </el-form-item>
  </el-form>

  <div class="fixedDialog">
    <el-dialog title="换算属性设置" v-model="dialogVisible">
      <template v-slot:title>
        <dialog-title title="换算属性设置"></dialog-title>
      </template>

      <div class="formula-con">
        <el-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          size="small"
          label-width="120px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="保留小数">
                <el-select v-model="formModel.decimalSize" filterable clearable>
                  <el-option value="0" label="不保留"></el-option>
                  <el-option value="1" label="1"></el-option>
                  <el-option value="2" label="2"></el-option>
                  <el-option value="3" label="3"></el-option>
                  <el-option value="4" label="4"></el-option>
                  <el-option value="5" label="5"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <template #label>
                  公式预览
                  <el-tooltip content="#仅用做公式字段标识" placement="top" effect="light">
                    <i class="header-icon el-icon-info"></i>
                  </el-tooltip>
                </template>
                <el-input v-model="formModel.formula" disabled />
              </el-form-item>
              <el-form-item>
                <el-button @click="formModel.formula = ''" type="danger">清空</el-button>
                <el-button @click="ruleValid" type="primary">校验</el-button>
              </el-form-item>

              <el-form-item label="关联表" prop="tableId">
                <!-- <el-select v-model="formModel.tableId" clearable filterable @change="onFtableChange"> -->
                <!-- <el-option v-for="table in pageData.tableList" :key="table.id" :value="table.id" :label="table.tableRemark"></el-option> -->
                <!-- </el-select> -->
                <el-input v-model="formModel.tableId" disabled />
              </el-form-item>
              <el-form-item label="名称字段" prop="relName">
                <el-select v-model="formModel.relName" clearable filterable>
                  <el-option
                    v-for="item in fieldList"
                    :key="item.field"
                    :value="item.field"
                    :label="item.name"
                  ></el-option>
                </el-select>
                <el-button
                  type="primary"
                  @click="ruleAdd(`#{${formModel.relName}}`)"
                  :disabled="!formModel.relName"
                >添加</el-button>
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
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { getCalTablesBypage, getCheckFormula } from "@/api/homeApi/index";
import { messageAlert } from "@/utils/utils";
import { useDesign } from "@/use/useDesign";

export default {
  name: "CalculateProperty",
  props: {
    componentCfg: Object,
  },
  setup(props, { emit }) {
    const activeName = ref<string>("0");

    const { currentComponentList } = useDesign();

    const route = useRoute();
    const formModel = reactive<any>({
      tableType: 1, // 表类型：1、基础信息表 2、字典表
      tableId: undefined,
      tableName: undefined,
      key: "id",
      relName: undefined,
      dictType: undefined,
      formula: "",
      decimalSize: "0",
    });

    const formRules = reactive({
      relName: [{ required: true, message: "请选择名称字段", trigger: "blur" }],
    });

    const formRef = ref<any>(null);
    const dialogVisible = ref<boolean>(false);
    // 表列表  字段列表
    const pageData = reactive({
      tableList: [],
      tableFieldList: [],
      tableRemark: "",
    });

    const fieldList = computed(() => {
      return currentComponentList.value.map((m) => {
        return {
          field: m.__vModel__,
          name: m.__form__?.label,
        };
      });
    });

    // 获取外键表数据
    async function getTables(): Promise<void> {
      let para = {
        tableId: route.query.appPageId,
      };
      const res = await getCalTablesBypage(para);
      if (res.code === 200) {
        formModel.tableId = res.data && res.data.pageRemark;
      }
    }

    function onSetFielClick() {
      formModel.decimalSize = props.componentCfg?.__config__.decimalSize;
      formModel.formula = props.componentCfg?.__config__.formula;
      formModel.key = "id";
      dialogVisible.value = true;
      getTables();
    }

    function ruleValid() {
      let ruleItem = formModel.formula;
      if (!ruleItem) {
        messageAlert("error", "公式不能为空");
        return;
      }
      let formula = ruleItem.replace(/#\{.*?\}/g, "#{value}");
      getCheckFormula({ formula: formula }).then((res: any) => {
        if (res.code == 200) {
          messageAlert("success", "验证通过");
        }
      });
    }

    function ruleAdd(val) {
      formModel.formula = formModel.formula + val;
    }

    function submit(): void {
      formRef.value?.validate((valid) => {
        if (valid) {
          if (props.componentCfg) {
            props.componentCfg.__config__.decimalSize = formModel.decimalSize;
            props.componentCfg.__config__.formula = formModel.formula;
          }
          dialogVisible.value = false;
        }
      });
    }

    return {
      activeName,
      formModel,
      formRules,
      fieldList,
      onSetFielClick,
      formRef,
      dialogVisible,
      pageData,
      ruleValid,
      ruleAdd,
      submit,
    };
  },
};
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
