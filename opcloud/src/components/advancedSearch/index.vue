<template>
  <div>
    <el-form :inline="true" size="small" label-width="90px">
      <el-form-item label="场景查询">
        <el-select
          v-model="sceneName"
          placeholder="请选择"
          clearable
          @change="onchangeoption"
        >
          <el-option-group
            v-for="group in groupOptions"
            :key="group.id"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="onChangeScene(item)"
              :class="item.scene == 'manage' ? [item.value] : ''"
            >
              <el-button
                size="medium"
                type="text"
                icon="el-icon-plus"
                v-if="item.value == 'newscene'"
                >{{ item.label }}</el-button
              >
              <el-button
                size="medium"
                type="text"
                icon="el-icon-setting"
                v-if="item.value == 'managescene'"
                >{{ item.label }}</el-button
              >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <el-dialog v-model="dialogVisible" width="900px">
      <template #title>
        <dialog-title :title="title"></dialog-title>
      </template>
      <el-form
        ref="formRef"
        label-position="left"
        label-width="80px"
        :model="searchTerms"
        :rules="formRules"
      >
        <el-form-item label="场景名称" prop="scenario">
          <el-input
            v-model="searchTerms.scenario"
            size="medium"
            placeholder="请输入场景名字"
            class="advancedSearch_input"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="筛选条件"
          prop="conditionList"
          v-for="(item, index) of searchTerms.conditionList"
        >
          <!-- 筛选字段 -->
          <el-select
            v-model="item.fieldCode"
            placeholder="请选择需要筛选的字段名"
            @change="onChange(item, $event)"
            clearable
          >
            <el-option
              v-for="option in rowList"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              @click="componentType(item, option.type, option)"
            ></el-option>
          </el-select>
          <!--   筛选条件 > = <...  -->
          <el-select
            v-model="item.symbolCode"
            placeholder="请选择条件"
            style="margin: 0 20px;"
          >
            <el-option
              v-for="option in filterCompare.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
          <!-- 筛选类型 根据字段判断-->
          <template v-if="item.valueType !== 'date'">
            <el-input
              v-model="item.value1"
              size="medium"
              placeholder="请输入内容"
              v-if="item.valueType == 'text'"
              class="advancedSearch_input"
            ></el-input>
            <el-select
              v-model="item.value1"
              placeholder="请选择"
              v-if="item.valueType === 'select'"
              clearable
              @change="filterValueOptionChange(item)"
            >
              <el-option
                v-for="option in item.filterValueOption"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="item.value1"
              placeholder="请选择"
              v-if="item.valueType == 'multipleselect'"
              multiple
              clearable
            >
              <el-option
                v-for="option in item.filterValueOption"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
            <el-input-number
              v-if="item.valueType === 'number'"
              v-model="item.value1"
              clearable
            ></el-input-number>
            <el-time-picker
              v-if="item.valueType === 'time'"
              v-model="item.value1"
            ></el-time-picker>
          </template>

          <i class="el-icon-remove-outline" @click="deleteList(index)"></i>
        </el-form-item>
      </el-form>
      <el-button type="text" @click="addCondition">添加筛选条件</el-button>

      <br />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="manageVisible" width="600px">
      <template #title>
        <dialog-title title="管理场景"></dialog-title>
      </template>
      <table-extend v-bind="tableOption">
        <template #operatColumn>
          <el-table-column
            label="操作"
            fixed="right"
            min-width="100"
            width="150px"
          >
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click="onEditScene(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="onDeleteScene(scope.row, scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </template>
      </table-extend>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="manageVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { messageAlert } from "@/shared/utils/utils";
import useEitter from "@/hooks/use-core/useMitt";
import useInitComponentData from "@/hooks/use-init-component";

import dayjs from "dayjs";
import {
  getQueryList,
  insertQueryScheme,
  updateQueryScheme,
  getQuerySchemeList,
  deleteScheme,
} from "@/api/homeApi/index";

const props = defineProps({
  rowList: Array,
  modulePageId: [String, Number],
  componentsConfig: Array,
});
// 事件定义
const emit = defineEmits(["advancedSearch"]);
// 组件数据初始化
const { selectInit } = useInitComponentData();

const dialogVisible = ref(false);
const manageVisible = ref(false);
const sceneName = ref("");
const filterCompare = reactive({
  options: [],
});
const mitter = useEitter();
useEitter([{ key: "on-advanced-search", value: QuerySchemeList }]);

const searchTerms = reactive({
  id: "",
  scenario: "",
  conditionList: [
    {
      fieldCode: "",
      symbolCode: "",
      valueType: "",
      value1: "",
      value2: "",
      filterValueOption: [],
    },
  ],
});

const groupOptions = ref([
  {
    label: "",
    id: +new Date(),
    options: [
      {
        scene: "manage",
        value: "newscene",
        label: "新增场景",
      },
      {
        scene: "manage",
        value: "managescene",
        label: "管理场景",
      },
    ],
  },
]);

const tableOption = reactive({
  tableData: [],
  tableColums: [
    {
      prop: "queryName",
      label: "场景名称",
      width: 150,
      showOverflowTooltip: true,
    },
  ],
  selectionCol: false,
  paging: false,
  total: 0,
  tableLoading: false,
});
const formRef = ref<any>(null);
const formRules = reactive({
  scenario: [{ required: true, message: "请输入场景名称", trigger: "blur" }],
  conditionList: [
    { required: true, validator: validateFilterCfg, trigger: "blur" },
  ],
});
function validateFilterCfg(rule, value, callback) {
  if (value && value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (!item["fieldCode"] || !item["symbolCode"]) {
        callback(new Error("请填写完整的过滤条件"));
        return;
      }
    }
  }
  callback();
}
const componentType = (item, type, options) => {
  item.type = type;
  item.symbolCode = "";
  item.value1 = "";
  item.value2 = "";
};
function onChangeScene(item) {
  if (item.value == "newscene") {
    sceneName.value = "";
    addScene();
  }
  if (item.value == "managescene") {
    manageVisible.value = true;
    sceneName.value = "";
  }
  emit("advancedSearch", item.queryCondition);
}
function onchangeoption(e) {
  if (!e) {
    emit("advancedSearch", "");
  }
}

function onChange(item, val) {
  const component: any = props.componentsConfig?.find(
    (f) => f.__vModel__ === val
  );
  if (component) {
    const componentTag = component.componentTag;
    if (
      ["designMoreSelect", "designMultiDatePicker", "designCheckBox"].includes(
        componentTag
      )
    ) {
      // item.filterCompareType = "multiple";
      item.valueType = "multipleselect";
      // 获取值选项
      getSelectData(item, component);
    } else if (
      ["designDatePicker", "designDateRangePicker"].includes(componentTag)
    ) {
      // item.filterCompareType = "date";
      // 第三列不显示
      item.valueType = "data";
    } else if (["designTimePicker"].includes(componentTag)) {
      // item.filterCompareType = 'value';
      item.valueType = "time";
    } else {
      // item.filterCompareType = "value";
      if (
        ["designSelect", "designSwitch", "designRadio"].includes(componentTag)
      ) {
        item.valueType = "select";
        getSelectData(item, component);
      } else if (["designNumber"].includes(componentTag)) {
        item.valueType = "number";
      } else {
        item.valueType = "text";
      }
    }
  }

  getQueryList({ pageId: props.modulePageId, fieldCode: val }).then((res) => {
    filterCompare.options = res.data.condition.map((m) => {
      return {
        value: m.code,
        label: m.name,
      };
    });
  });
}

function QuerySchemeList() {
  sceneName.value = "";
  groupOptions.value.length == 2 && groupOptions.value.splice(0, 1);
  getQuerySchemeList({ pageId: props.modulePageId }).then((res) => {
    if (res.code == 200) {
      tableOption.tableData = res.data;
      let newOptions = [];
      newOptions = res.data.map((item) => {
        return {
          label: item.queryName,
          value: item.id,
          queryCondition: Object.values(item.queryCondition),
        };
      });

      if (newOptions.length > 0) {
        groupOptions.value.unshift({
          label: "",
          id: +new Date(),
          options: newOptions,
        });
      }
      groupOptions.value.length > 2 && groupOptions.value.splice(1, 1);
      groupOptions.value[0].options.length == 0 && groupOptions.value.shift();
    }
  });
}
// QuerySchemeList();
const deleteList = (index) => {
  searchTerms.conditionList.splice(index, 1);
};
const addCondition = () => {
  searchTerms.conditionList.push({
    fieldCode: "",
    symbolCode: "",
    valueType: "",
    value1: "",
    value2: "",
    filterValueOption: [],
  });
};
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      searchTerms.conditionList.forEach((item) => {
        let tomorrow = new Date().setDate(new Date().getDate() + 1);
        if (item.symbolCode == "30") {
          //今天:symbolCode=30
          item.value1 = dayjs(new Date()).format("YYYY-MM-DD 00:00:00");
          item.value2 = dayjs(tomorrow).format("YYYY-MM-DD 00:00:00");
        } else if (item.symbolCode == "31") {
          //本周:symbolCode=30
          let weekday = new Date().getDay() || 7;
          let thisweek = new Date().setDate(new Date().getDate() - weekday + 1);
          item.value1 = dayjs(thisweek).format("YYYY-MM-DD 00:00:00");
          item.value2 = dayjs(tomorrow).format("YYYY-MM-DD 00:00:00");
        } else if (item.symbolCode == "32") {
          //本月:symbolCode=32
          item.value1 = dayjs(new Date()).format("YYYY-MM-01 00:00:00");
          item.value2 = dayjs(tomorrow).format("YYYY-MM-DD 00:00:00");
        } else if (item.symbolCode == "33") {
          //本年:symbolCode=33
          item.value1 = dayjs(new Date()).format("YYYY-01-01 00:00:00");
          item.value2 = dayjs(tomorrow).format("YYYY-MM-DD 00:00:00");
        }
      });
      let condition = {};
      for (let key in searchTerms.conditionList) {
        condition[key] = searchTerms.conditionList[key];
      }
      let param = {
        id: searchTerms.id,
        pageId: props.modulePageId,
        queryName: searchTerms.scenario,
        queryCondition: condition,
      };
      if (param.id) {
        updateQueryScheme(param).then((res) => {
          if (res.code == 200) {
            messageAlert("success", "更新成功");
            QuerySchemeList();
            dialogVisible.value = false;
          } else {
            messageAlert("error", "更新失败");
            QuerySchemeList();
            dialogVisible.value = false;
          }
        });
      } else {
        insertQueryScheme(param).then((res) => {
          if (res.code == 200) {
            messageAlert("success", "保存成功");
            QuerySchemeList();
            dialogVisible.value = false;
            searchTerms.scenario = "";
            searchTerms.conditionList = [
              {
                fieldCode: "",
                symbolCode: "",
                valueType: "",
                value1: "",
                value2: "",
                filterValueOption: [],
              },
            ];
          } else {
            messageAlert("error", "保存失败");
            dialogVisible.value = false;
          }
        });
      }
    }
  });
};
const title = ref<string>("新增场景");
function addScene() {
  title.value = "新增场景";
  searchTerms.scenario = "";
  searchTerms.conditionList = [
    {
      fieldCode: "",
      symbolCode: "",
      valueType: "",
      value1: "",
      value2: "",
      filterValueOption: [],
    },
  ];
  dialogVisible.value = true;
}
//编辑场景
function onEditScene(row) {
  title.value = "编辑场景";
  searchTerms.id = row.id;
  searchTerms.scenario = row.queryName;
  searchTerms.conditionList = Object.values(row.queryCondition);
  searchTerms.conditionList.forEach((item) => {
    getQueryList({
      pageId: props.modulePageId,
      fieldCode: item.fieldCode,
    }).then((res) => {
      filterCompare.options = res.data.condition.map((m) => {
        return {
          value: m.code,
          label: m.name,
        };
      });
    });
  });

  dialogVisible.value = true;
}
//删除场景
async function onDeleteScene(row, rowIndex) {
  const { id } = row;
  const res = await deleteScheme({ id });
  if (res.code == 200) {
    messageAlert("success", res.msg || "");
    for (let i = 0; i < groupOptions.value.length; i++) {
      const options = groupOptions.value[i].options;
      const index = options.findIndex((f) => f.value === id);
      if (index > -1) {
        options.splice(index, 1);
        break;
      }
    }
    tableOption.tableData.splice(rowIndex, 1);
    groupOptions.value[0].options.length == 0 && groupOptions.value.shift();
  }
}
function getSelectData(item: any, component: any) {
  if (component && component.__relTable__ && component.__relTable__.key) {
    // 动态数据
    selectInit(component).then(() => {
      item.filterValueOption = component.options;
    });
  } else {
    // 静态数据
    if (component.componentTag === "designSwitch") {
      const config: any = component.__config__;
      item.filterValueOption = [
        { label: config.activeText, value: 1 },
        { label: config.inactiveText, value: 0 },
      ];
    } else {
      item.filterValueOption = component.options;
    }
  }
}
function filterValueOptionChange(item) {}
</script>

<style scoped>
.advancedSearch_input {
  width: 200px;
}
.managescene,
.newscene {
  color: #2362fb;
}
.iconLabel {
  margin-left: 10px;
  font-size: 15px;
  font-weight: bold;
}
</style>
