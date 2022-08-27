<template>
  <div class="tool-bar">
    <div class="button-group">
      <el-button
        size="small"
        type="primary"
        plain
        icon=" el-icon-plus"
        v-if="isShowAddBtn"
        @click="onAddRow"
      >添加</el-button>
      <el-button size="small" type="primary" plain icon="el-icon-search" @click="onSearch">查询</el-button>
      <el-button
        size="small"
        type="primary"
        plain
        icon="el-icon-delete"
        @click="onBatchDelete"
        v-if="isProcess"
      >批量删除</el-button>
      <el-button
        size="small"
        type="primary"
        plain
        icon="el-icon-refresh"
        @click="onDataSync"
        v-if="isShowDataSync"
      >数据同步</el-button>
      <el-button
        v-if="isOutSourceProcess"
        size="small"
        type="primary"
        plain
        icon="el-icon-printer"
        @click="onOutSourceEMIT"
      >批量发出</el-button>
      <el-button
        v-if="isOutSourceEmit"
        size="small"
        type="primary"
        plain
        icon="el-icon-printer"
        @click="onOutSourceRECEIVE"
      >批量接收</el-button>
      <el-button
        v-if="isOutSourceCheck"
        size="small"
        type="primary"
        plain
        icon="el-icon-printer"
        @click="onOutSourceCHECK"
      >批量检验</el-button>
      <el-button
        v-if="isProductCheck"
        size="small"
        type="primary"
        plain
        icon="el-icon-printer"
        @click="onUpdateBatchEventCHECK"
      >批量检验</el-button>
      <el-button
        v-if="isWorkerOrder"
        size="small"
        type="primary"
        plain
        icon="el-icon-printer"
        @click="onBatchPrint"
      >批量打印</el-button>
      <AdvancedSearch
        class="advanced-search"
        :rowList="sceneConfig"
        :componentsConfig="sceneComponentList"
        :modulePageId="parent?.pageParmas.pageId"
        @advancedSearch="onAdvancedSearch"
      ></AdvancedSearch>
      <el-dropdown class="more-button" placement="bottom-start" style="margin-left: 10px;">
        <i class="el-icon-more" title="更多"></i>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="onDownloadTableData"
              :disabled="parent?.tableOption.tableData.length === 0"
            >下载数据</el-dropdown-item>
            <el-dropdown-item @click="onDownloadTemplate">下载模板</el-dropdown-item>
            <el-dropdown-item>
              <el-upload
                action
                ref="uploadRefPICOM"
                :before-upload="beforeUpload"
                class="upload-demo"
                accept=".xls, .xlsx"
                :http-request="uploadFunc"
                :show-file-list="false"
              >导入数据</el-upload>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 计算模型页面相关 -->
    <div class="modelcondition" v-if="modelConditionList.length > 0">
      <el-form size="small">
        <el-col v-for="(item, index) in modelConditionList" :key="index" :span="12">
          <el-form-item :label="item.opFields.fieldRemark">
            <el-input v-if="item.type == 0" size="small" v-model="item.opFields.fieldValue"></el-input>
            <el-date-picker
              v-if="item.type == 1"
              v-model="item.opFields.fieldValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import AdvancedSearch from "@/components/advancedSearch/index.vue";
import { messageAlert } from "@/utils/utils";
import {
  exportData,
  getModelConditions,
  getOrderPrintData,
  OutSourceBatchEvent,
  executeUpdateBatchEvent,
  getTempExcel,
  importExcel,
  importRoute,
  importOrder,
  getOrderRouteTempExcel,
  IotDataEvent
} from "@/api/homeApi";

const props = defineProps({
  /**场景字段列表 */
  sceneConfig: Array,
  /**场景组件配置 */
  sceneComponentList: Array,
});

const store = useStore();

const router = useRouter();

/**列表inject */
const parent = inject<Record<string, any>>("parent", {});
/**计算模型筛选条件 */
const modelConditionList = ref<any>([]);

/**表名是否为工序(工序任务    t_aegongdan_mshengchanzhixing_pICMOEntry_666 和委外工序 t_en_wi_OutSourceEntry_666) */
// parent?.addable
const isProcess = computed(() => {
  let regpICMO = /^t_aegongdan_mshengchanzhixing_pICMOEntry$/;
  let regOut = /^t_en_wi_OutSourceEntry$/;
  if (parent?.addable) {
    if (regpICMO.test(parent?.pageParmas.pageTableName) || regOut.test(parent?.pageParmas.pageTableName)) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
});
/**表名是否为工序任务,委外工序,委外检验,生产检验,委外发出,委外接收, 这4个页面隐藏 添加按钮
 * (工序任务  t_aegongdan_mshengchanzhixing_pICMOEntry_666  委外工序 t_en_wi_OutSourceEntry_666)
 * (委外检验 t_en_sn_TestReceive_666  生产检验  t_en_wi_pqualitytest_666)
 * (委外发出 t_en_wi_Issue_666  委外接收 t_en_wi_Receive_666) */
// parent?.addable
const isShowAddBtn = computed(() => {
  let regpICMO = /^t_aegongdan_mshengchanzhixing_pICMOEntry$/;
  let regOut = /^t_en_wi_OutSourceEntry$/;
  let regTestReceiv = /^t_en_sn_TestReceive$/;
  let regQualitytest = /^t_en_wi_pqualitytest$/;
  let reIssue = /^t_en_wi_Issue$/;
  let regReceive = /^t_en_wi_Receive$/;

  if (parent?.addable) {
    if (regpICMO.test(parent?.pageParmas.pageTableName) || regOut.test(parent?.pageParmas.pageTableName) || regTestReceiv.test(parent?.pageParmas.pageTableName) || regQualitytest.test(parent?.pageParmas.pageTableName) || reIssue.test(parent?.pageParmas.pageTableName) || regReceive.test(parent?.pageParmas.pageTableName)) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
});



/**表名是否为工单 */
const isWorkerOrder = computed(() => {
  return /^t_aegongdan_mshengchanzhixing_pICMO$/.test(
    parent?.pageParmas.pageTableName
  );
});

/**表名是否为委外工序 -->批量发出 */
const isOutSourceProcess = computed(() => {
  // "t_en_wi_OutSourceEntry_666"  委外工序表名
  return /^t_en_wi_OutSourceEntry(_(opcloud|\d+))?$/.test(
    parent?.pageParmas.pageTableName
  );
});
/**表名是否为委外发出 -->批量接收 */
const isOutSourceEmit = computed(() => {
  // "t_en_wi_Issue_666"  委外发出表名
  return /^t_en_wi_Issue(_(opcloud|\d+))?$/.test(
    parent?.pageParmas.pageTableName
  );
});
/**表名是否为委外检验单 -->批量(委外)检验 */
const isOutSourceCheck = computed(() => {
  // "t_en_sn_TestReceive_666"  委外检验表名
  return /^t_en_sn_TestReceive(_(opcloud|\d+))?$/.test(
    parent?.pageParmas.pageTableName
  );
});
/**表名是否为生产检验 -->批量(生产)检验 */
const isProductCheck = computed(() => {
  // "t_en_wi_pqualitytest_666"  生产检验表名
  return /^t_en_wi_pqualitytest(_(opcloud|\d+))?$/.test(
    parent?.pageParmas.pageTableName
  );
});

//工艺流程表名
const isWorkerRoute = computed(() => {
  return /^t_aegongdan_mgongchangjianmo_pProRoute$/.test(
    parent?.pageParmas.pageTableName
  );
});

//op_iothub_box_666 云盒清单表格  显示数据同步按钮
const isShowDataSync = computed(() => {
  return /^op_iothub_box$/.test(
    parent?.pageParmas.pageTableName
  );
});

/**添加数据 */
function onAddRow() {
  if (parent.pageSetting) {
    parent.pageSetting.formConf.disabled = false
  }
  if (parent?.pageSetting.formConf.dialogType === "page") {
    // 打开页面
    const current = router.currentRoute.value;
    const path = `/appadd/${current.params.appid}/${current.params.modelid}/${current.params.pageid}`;
    router.push(path);
    const label = parent?.layoutState.pageTabList.value.find(
      (f) => f.path === current.path
    )?.label;
    const name = `${parent?.menuLayout.value.activeMenu}_add`;
    if (!parent?.layoutState.pageTabList.value.some((f) => f.name === name)) {
      parent?.layoutState.pageTabList.value.push({
        label: `${label || ""} 新增`,
        name,
        path,
      });
    }
  } else {
    // 弹窗/抽屉形式
    const {
      initComponentData,
      multipleValueComponentTransform,
      autoCreateData,
    } = parent;
    initComponentData(parent?.pageSetting.componentList, "add");
    multipleValueComponentTransform(parent?.pageSetting.componentList);
    parent.pageSetting.title = `新增 ${parent?.currentPage.appName} / ${parent?.pageParmas.modelName} / ${parent?.pageParmas.pageName}`;
    parent.pageSetting.visible = true;
    parent.currentFormData.value["id"] = undefined;
    parent.exectId.value = undefined;
    // 自编码数据
    autoCreateData(parent?.pageSetting.componentList);
  }
}
const { reloadTable } = parent;
/**查询 */
function onSearch() {
  modelConditionList.value.forEach((element, index) => {
    parent.requestConditions.value.push({
      fieldName: element.opFields.fieldName,
      type: element.type,
      param:
        element.type == 0
          ? element.opFields.fieldValue
            ? element.opFields.fieldValue.split(",")
            : []
          : element.opFields.fieldValue,
    });
  });

  // filterColumns = parent.topSetting.formData || {};
  parent.pageSetting.reload = false;
  reloadTable();
}
/**批量删除 */
function onBatchDelete() {
  const { delDatas } = parent;
  if (!parent.selectIds.value || parent.selectIds.value?.length == 0) {
    messageAlert("error", "请选择要删除的数据");
    return;
  } else {
    delDatas();
  }
}

/** 批量委外发出 **/
//t_en_wi_pweiwaijihuagongxubiaoti_666  委外工序表单-->批量委外发出
async function onOutSourceEMIT() {
  let parmas = {
    pageId: parent?.pageParmas.pageId,
    pageTableName: parent?.pageParmas.pageTableName,
    batchEventCode: "OUT_SOURCE_BATCH_EMIT",
    rowIds: parent?.selectIds.value,
  };
  const res = await OutSourceBatchEvent(parmas);
  if (res.code == 200) {
    messageAlert("success", res.msg);
    reloadTable();
  }
}

/** 批量委外接收 **/
//t_aegongdan_mshengchanzhixing_poutsource_666  委外发出表单-->批量委外接收
async function onOutSourceRECEIVE() {
  let parmas = {
    pageId: parent?.pageParmas.pageId,
    pageTableName: parent?.pageParmas.pageTableName,
    batchEventCode: "OUT_SOURCE_BATCH_RECEIVE",
    rowIds: parent?.selectIds.value,
  };
  const res = await OutSourceBatchEvent(parmas);
  if (res.code == 200) {
    messageAlert("success", res.msg);
    reloadTable();
  }
}

/** 批量 委外检验 **/
async function onOutSourceCHECK() {
  let parmas = {
    pageId: parent?.pageParmas.pageId,
    pageTableName: parent?.pageParmas.pageTableName,
    batchEventCode: "OUT_SOURCE_BATCH_CHECK",
    rowIds: parent?.selectIds.value,
  };
  const res = await OutSourceBatchEvent(parmas);
  if (res.code == 200) {
    messageAlert("success", res.msg);
    reloadTable();
  }
}

/** 批量 生产检验 **/
async function onUpdateBatchEventCHECK() {
  let eventBatchBeanVoList = [] as any;
  parent?.selectIds.value.forEach((element) => {
    eventBatchBeanVoList.push({
      pageTableName: parent?.pageParmas.pageTableName,
      pageId: parent?.pageParmas.pageId,
      rowId: element,
      fieldValueChangeList: [{ field: "FTestStatus", value: "已检" }],
    });
  });
  let parmas = { eventBatchBeanVoList };
  const res = await executeUpdateBatchEvent(parmas);
  if (res.code == 200) {
    messageAlert("success", res.msg);
    reloadTable();
  }
}

/**批量打印 */
async function onBatchPrint() {
  const { printHtml } = parent;
  if (!parent.selectIds.value || parent.selectIds.value?.length == 0) {
    messageAlert("error", "请选择要打印的数据");
    return;
  } else {
    const res = await getOrderPrintData({ ids: parent.selectIds.value });
    if (res.code == 200) {
      parent.printOrderData.value = res.data || [];
      nextTick(() => {
        printHtml("#print-order-list");
      });
    }
  }
}
/**下载数据 */
async function onDownloadTableData() {
  const { reloadPage } = parent;
  // filterColumns = parent.topSetting.formData || {};
  parent.pageSetting.reload = false;
  parent.pageSetting.visible = false;
  parent.pageSetting.type = "";
  parent.pageSetting.size = 0;
  parent.pageSetting.formConf = undefined;
  parent.pageSetting.componentList = [];
  parent.tableOption.tableLoading = true;
  let para = {
    dataRequest: {
      modelId: parent.pageParmas.modelId,
      pageId: parent.pageParmas.pageId,
      // filterColumns,
      sortFileId: parent.pageSetting.sortField,
      sortOrder: parent.pageSetting.sortType,
    },
    pageRequest: parent.pageRequest,
  };

  const res = await exportData(para);

  if (res.code == 200) {
    parent.tableOption.tableLoading = false;
    reloadPage();
  }
}

/**下载模板 */
async function onDownloadTemplate() {
  let params = {
    pageId: parent.pageParmas.pageId,
  };
  // 生产订单模板下载
  if (isWorkerOrder.value || isWorkerRoute.value) {
    const res = await getOrderRouteTempExcel(params)
    parent.pageSetting.isLoading = false
    if (res.code == 200) {
      messageAlert("success", "下载成功")
    } else {
      messageAlert("error", res.msg);
    }
  } else {
    const res = await getTempExcel(params);
    if (res.code == 200) {
      parent.tableOption.tableLoading = false;
    }
  }


}

function beforeUpload(file: any) {
  let isExcel = true;
  const typeList = ["xlsx", "xls"];
  const Excel = file.name.substring(file.name.lastIndexOf(".") + 1);
  const isLt2M = file.size / 1024 <= 500;

  if (!typeList.includes(Excel)) {
    messageAlert("error", "请先下载模板再上传的文件,且只能是xlsx或者是xls格式");
    isExcel = false;
  }
  if (!isLt2M) {
    messageAlert("error", "上传的文件excel文件大小不能超过500M");
  }
  return isLt2M && isExcel;
}

async function uploadFunc(fileOptions: any): Promise<void> {
  const { getPageSet } = parent;
  const formData = new FormData();

  formData.append("file", fileOptions.file);
  formData.append("pageId", parent.pageParmas.pageId);
  formData.append("modelId", parent.pageParmas.modelId);
  parent.pageSetting.isLoading = true
  if (isWorkerOrder.value) {
    //生产订单导入接口
    const res = await importOrder(formData);
    parent.pageSetting.isLoading = false
    if (res.code == 200) {
      messageAlert("success", "导入成功");
      getPageSet();
    } else {
      messageAlert("error", res.msg);
    }
  } else if (isWorkerRoute.value) {
    //工艺流程导入接口
    const res = await importRoute(formData);
    parent.pageSetting.isLoading = false
    if (res.code == 200) {
      messageAlert("success", "工艺流程导入数据成功");
      getPageSet();
    } else {
      messageAlert("error", res.msg);
    }
  } else {
    const res = await importExcel(formData);
    parent.pageSetting.isLoading = false
    if (res.code == 200) {
      messageAlert("success", "导入成功");

      getPageSet();
    } else {
      messageAlert("error", res.msg);

    }
  }
}

function onAdvancedSearch(value) {
  const { reloadTable } = parent;
  parent.advancedCondition.value = value;
  reloadTable();
}

/**
 * 模型筛选条件
 */
async function ModelConditions() {
  const res = await getModelConditions({ pageId: parent.pageParmas.pageId });
  if (res.code == 200) {
    modelConditionList.value = [];
    res.data.forEach((element) => {
      modelConditionList.value.push(element);
    });
  }
}

async function onDataSync() {
  const res = await IotDataEvent();
  if (res.code == 200) {
    messageAlert("success", res.msg);
  } else {
    messageAlert("error", res.msg);
  }
}

</script>

<style lang="scss" scoped>
@import "@/styles/modules/pagelist/toolbar.scss";
</style>
