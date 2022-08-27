<template>
  <div class="tool-bar">
    <div class="button-group">
      <el-button
        size="small"
        type="primary"
        plain
        icon=" el-icon-plus"
        v-if="parent?.addable"
        @click="onAddRow"
        >添加</el-button
      >
      <el-button
        size="small"
        type="primary"
        plain
        icon="el-icon-search"
        @click="onSearch"
        >查询</el-button
      >
      <el-button
        size="small"
        type="primary"
        plain
        icon="el-icon-delete"
        @click="onBatchDelete"
        >批量删除</el-button
      >
      <el-button
        v-if="isOutSource"
        size="small"
        type="primary"
        plain
        icon="el-icon-printer"
        @click="onOutSource"
        >批量接收</el-button
      >
      <el-button
        v-if="isWorkerOrder"
        size="small"
        type="primary"
        plain
        icon="el-icon-printer"
        @click="onBatchPrint"
        >批量打印</el-button
      >
      <AdvancedSearch
        class="advanced-search"
        :rowList="sceneConfig"
        :componentsConfig="sceneComponentList"
        :modulePageId="parent?.pageParmas.pageId"
        @advancedSearch="onAdvancedSearch"
      ></AdvancedSearch>
      <el-dropdown
        class="more-button"
        placement="bottom-start"
        style="margin-left: 10px;"
      >
        <i class="el-icon-more" title="更多"></i>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="onDownloadTableData"
              :disabled="parent?.tableOption.tableData.length === 0"
              >下载数据</el-dropdown-item
            >
            <el-dropdown-item @click="onDownloadTemplate"
              >下载模板</el-dropdown-item
            >
            <el-dropdown-item>
              <el-upload
                action
                ref="uploadRefPICOM"
                :before-upload="beforeUpload"
                class="upload-demo"
                accept=".xls, .xlsx"
                :http-request="uploadFunc"
                :show-file-list="false"
                >导入数据</el-upload
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 计算模型页面相关 -->
    <div class="modelcondition" v-if="modelConditionList.length > 0">
      <el-form size="small">
        <el-col
          v-for="(item, index) in modelConditionList"
          :key="index"
          :span="12"
        >
          <el-form-item :label="item.opFields.fieldRemark">
            <el-input
              v-if="item.type == 0"
              size="small"
              v-model="item.opFields.fieldValue"
            ></el-input>
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
import AdvancedSearch from "@/components/advancedSearch/index.vue";
import { messageAlert } from "@/utils/utils";
import {
  exportData,
  getModelConditions,
  getOrderPrintData,
  OutSourceBatchEvent,
  getTempExcel,
  importExcel,
  importRoute,
  importOrder,
} from "@/api/homeApi";
import { ElMessage } from "element-plus";

const props = defineProps({
  /**场景字段列表 */
  sceneConfig: Array,
  /**场景组件配置 */
  sceneComponentList: Array,
});

/**列表inject */
const parent = inject<Record<string, any>>("parent", {});
/**计算模型筛选条件 */
const modelConditionList = ref<any>([]);

/**表名是否为工单 */
const isWorkerOrder = computed(() => {
  return /^t_aegongdan_mshengchanzhixing_pICMO(_(\opcloud|\d+))?$/.test(
    parent?.pageParmas.pageTableName
  );
});
/**表名是否为委外 */
const isOutSource = computed(() => {
  return /^t_aegongdan_mshengchanzhixing_poutsourceplan(_(\opcloud|\d+))?$/.test(
    parent?.pageParmas.pageTableName
  );
});
//工艺流程表名
const isWorkerRoute = computed(() => {
  return /^t_aegongdan_mgongchangjianmo_pProRoute(_(\opcloud|\d+))?$/.test(
    parent?.pageParmas.pageTableName
  );
});
/**添加数据 */
function onAddRow() {
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
/**查询 */
function onSearch() {
  const { reloadTable } = parent;
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

/** 批量委外 **/
async function onOutSource() {
  let parmas = {
    pageId: parent?.pageParmas.pageId,
    pageTableName: parent?.pageParmas.pageTableName,
    batchEventCode: "OUT_SOURCE_BATCH_EMIT",
    rowIds: parent?.selectIds.value,
  };
  const res = await OutSourceBatchEvent(parmas);
}

/**批量打印 */
async function onBatchPrint() {
  const { printHtlm } = parent;
  if (!parent.selectIds.value || parent.selectIds.value?.length == 0) {
    messageAlert("error", "请选择要打印的数据");
    return;
  } else {
    const res = await getOrderPrintData({ ids: parent.selectIds.value });
    if (res.code == 200) {
      parent.printData.value = res.data || [];
      nextTick(() => {
        printHtlm("#print-order-list");
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
  const res = await getTempExcel(params);
  if (res.code == 200) {
    parent.tableOption.tableLoading = false;
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
  parent.tableOption.tableLoading = true;
  const formData = new FormData();

  formData.append("file", fileOptions.file);
  formData.append("pageId", parent.pageParmas.pageId);
  formData.append("modelId", parent.pageParmas.modelId);

  if (isWorkerOrder.value) {
    //生产订单导入接口
    const res = await importOrder(formData);
    if (res.code == 200) {
      messageAlert("success", "导入成功");
      parent.tableOption.tableLoading = false;
      getPageSet();
    } else {
            messageAlert('error', res.msg)
      parent.tableOption.tableLoading = false;
    }
  } else if (isWorkerRoute.value) {
    //工艺流程导入接口
    const res = await importRoute(formData);
    if (res.code == 200) {
            messageAlert("success", "工艺流程导入数据成功");
      getPageSet();
    } else {
            messageAlert('error', res.msg)
    }
  } else {
    const res = await importExcel(formData);
    if (res.code == 200) {
      messageAlert("success", "导入成功");
      parent.tableOption.tableLoading = false;
      getPageSet();
    } else {
      ElMessage.error(res.msg);

      parent.tableOption.tableLoading = false;
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
</script>

<style lang="scss" scoped>
@import "@/styles/modules/pagelist/toolbar.scss";
</style>
