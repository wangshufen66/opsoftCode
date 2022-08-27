<template>
  <div class="property-board property-wrap">
    <el-tabs v-model="currentTab" class="property-wrap_tabs">
      <el-tab-pane label="组件属性" name="field"></el-tab-pane>
      <el-tab-pane v-if="!['page'].includes(designType)" label="表单属性" name="form"></el-tab-pane>
    </el-tabs>
    <el-scrollbar class="property-board-content">
      <template v-if="currentTab === 'field'">
        <component v-if="activeComponent" :is="componentName" :componentCfg="activeComponent"></component>
      </template>
      <!-- 表单属性 -->
      <el-form v-show="currentTab === 'form'" size="small" label-width="110px">
        <el-form-item label="表单尺寸">
          <el-radio-group v-model="formConf.size">
            <el-radio-button label="medium">中等</el-radio-button>
            <el-radio-button label="small">较小</el-radio-button>
            <el-radio-button label="mini">迷你</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签对齐">
          <el-radio-group v-model="formConf.labelPosition">
            <el-radio-button label="left">左对齐</el-radio-button>
            <el-radio-button label="right">右对齐</el-radio-button>
            <el-radio-button label="top">顶部对齐</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签宽度">
          <el-input v-model.number="formConf.labelWidth" placeholder="请输入标签宽度" />
        </el-form-item>
        <el-form-item label="弹窗模式">
          <el-radio-group v-model="formConf.dialogType" size="small" @change="formTypeChange">
            <el-radio-button label="dialog" border>弹窗</el-radio-button>
            <el-radio-button label="drawer" border>抽屉</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抽屉方向" v-if="formConf.dialogType === 'drawer'">
          <el-select v-model="formConf.direction">
            <el-option value="rtl" label="从右向左"></el-option>
            <el-option value="btt" label="从下向上"></el-option>
            <el-option value="ltr" label="从左往右"></el-option>
            <el-option value="ttb" label="从上往下"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="窗体大小">
          <el-input v-model.number="formConf.width" style="width: 150px" clearable>
            <template #append>
              <span>%</span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="禁用">
          <el-switch v-model="formConf.disabled" />
        </el-form-item>

        <template v-if="route.query.pageType && route.query.pageType === '1'">
          <el-form-item label="选择流程">
            <el-select v-model="formConf.processDefinitionId" filterable>
              <el-option
                :value="item.id"
                :label="item.name"
                v-for="(item, index) in state.flowableList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择用户组">
            <el-select v-model="formConf.userGroup" filterable clearable>
              <el-option
                :value="item.roleId"
                :label="item.roleName"
                v-for="item in state.userGroupList"
                :key="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启动按钮标题">
            <el-input v-model.number="formConf.startFlowLabel" placeholder="设置启动按钮标题" clearable />
          </el-form-item>
          <el-form-item label="选择数据复制">
            <el-select v-model="formConf.dataCopy" filterable clearable>
              <el-option
                :value="item.id"
                :label="item.modelName"
                v-for="(item, index) in state.dataCopyList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="IOT表配置">
          <!-- <el-switch @change="iotChange" v-model.number="formConf.isIot" :active-value="1" :inactive-value="0"/> -->
          <el-select @change="iotChange" v-model.number="formConf.isIot" filterable clearable>
            <el-option
              v-for="item in iotList"
              :value="item.value"
              :label="item.label"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择模型">
          <el-select v-model="formConf.functionModel" filterable>
            <el-option
              :value="item.id"
              :label="item.modelName"
              v-for="(item, index) in state.functionModelList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="formConf.isIot === 1">
          <div class="divider-wrap">数据存储</div>
          <el-form-item label="数据库">
            <el-input v-model="formConf.dataSource" laceholder="数据库表名" clearable />
          </el-form-item>
        </template>
        <el-form-item label="表单按钮">
          <el-switch v-model="formConf.showButton" />
        </el-form-item>
        <property-buttonform v-if="formConf.showButton" :formConf="formConf"></property-buttonform>
        <el-form-item label="设备维保">
          <el-switch v-model="formConf.equipMaint" />
        </el-form-item>
        <property-equipmaint v-if="formConf.equipMaint" :formConf="formConf"></property-equipmaint>
      </el-form>
    </el-scrollbar>
  </div>
  <template v-if="activeComponent">
    <icons-dialog
      v-model:visible="dialogState.iconsVisible"
      :current="activeComponent[dialogState.currentIconModel]"
      @select="setIcon"
    />
    <table-key-dialog
      v-model:visible="dialogState.tableKeyVisible"
      :componentCfg="activeComponent"
      @refresh="onRefresh"
    ></table-key-dialog>
  </template>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, provide } from "vue";
import { useDesign, useActiveDesignComponent } from "@/use/useDesign";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import IconsDialog from "@/components/iconSelect/index.vue";
import tableKeyDialog from "./tableKeyDialog.vue";
import useEitter from "@/use/useEitter";
import { getFlowablelist } from "@/api/flowable";
import { getUserGroupList } from "@/api/homeApi";
import { getDataCopyList } from "@/api/homeApi";
import { getModelList } from "@/api/functionModel";

type iotList = {
  value: number | string;
  label: string;
  key: number;
};

const currentTab = ref<string>("field");

const foreignTableFields = ref<any[]>([]);

provide('foreignTableFields', foreignTableFields);

const route = useRoute();
const store = useStore();
const { designType, formConf } = useDesign();
const { activeComponent } = useActiveDesignComponent(undefined);


/**配置相关数据 */
const state = reactive({
  flowableList: [],
  userGroupList: [],
  dataCopyList: [],
  functionModelList: [],
});
// 弹窗状态
const dialogState = reactive({
  iconsVisible: false,
  currentIconModel: "",
  tableKeyVisible: false,
  dataSourceVisible: false,
});

let IconSetParmams: any = undefined;

/**iot配置表下拉数据*/
const iotList = ref<iotList[]>([
  {
    label: "IoT-云盒清单",
    value: 1,
    key: 1,
  },
  {
    label: "IoT-云盒数据点",
    value: 2,
    key: 2,
  },
  {
    label: "IoT-基站清单",
    value: 3,
    key: 3,
  },
  {
    label: "IoT-基础信息点",
    value: 4,
    key: 4,
  },
  {
    label: "事件触发",
    value: 5,
    key: 5,
  },
  {
    label: "事件触发-通知人",
    value: 6,
    key: 6,
  },
  {
    label: "事件触发-触发源",
    value: 7,
    key: 7,
  },
  {
    label: "预警日志",
    value: 8,
    key: 8,
  },
  {
    label: "故障日志",
    value: 9,
    key: 9,
  },
  {
    label: "运行切片图",
    value: 10,
    key: 10,
  },
  {
    label: "运行状态占比",
    value: 11,
    key: 11,
  },
]);

const componentName = computed(() => {
  const tag = activeComponent.value.componentTag;
  return `${tag.replace("design", "")}Property`;
});

useEitter([
  { key: "on-property-setIcon", value: openIconDialog },
  { key: "on-property-reltable", value: openRelTableDialog },
]);

const openRelTableCallBack = ref<any>()

provide('property', {
  propertySetting: state
})

function formTypeChange() { }

function openIconDialog(obj: any) {
  const { parent, node } = obj;
  dialogState.iconsVisible = true;
  IconSetParmams = {
    parent,
    node,
  };
}

//iot选择改变
function iotChange() {
  formConf.value.isIot =
    formConf.value.isIot === "" ? null : formConf.value.isIot;
  if (formConf.value.isIot !== 1) {
    formConf.value.dataSource = "";
  }
}

function openRelTableDialog(callback) {
  dialogState.tableKeyVisible = true;
  openRelTableCallBack.value = callback
}

function onRefresh() {
  openRelTableCallBack.value && openRelTableCallBack.value();
}

function setIcon(val: string) {
  IconSetParmams &&
    (activeComponent.value[IconSetParmams.parent][IconSetParmams.node] = val);
}

function getFlowable() {
  getFlowablelist({}).then((res) => {
    if (res.code == 200) {
      state.flowableList = res.data;
    }
  });
}

function getDataCopy() {
  getDataCopyList({}).then((res) => {
    if (res.code == 200) {
      state.dataCopyList = res.data.records;
    }
  });
}

function getFunctionModel() {
  getModelList({ "current_page": 1, "page_size": 500 }).then((res) => {
    if (res.code == 200) {
      state.functionModelList = res.data.records;
    }
  });
}

function getUserGroup() {
  let para = {
    current: 1,
    size: 10000,
  };
  getUserGroupList(para).then((res) => {
    if (res.code == 200) {
      state.userGroupList = res.data.records;
    }
  });
}
if (route.query.pageType == "1") {
  getFlowable();
  getUserGroup();
  getDataCopy();
}
getFunctionModel();
</script>

<style lang="scss">
@import "@/styles/modules/design/property.scss";
</style>
