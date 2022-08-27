<!-- 图表页面设计 -->
<template>
  <div class="design-container">
    <!-- 头部 -->
    <design-header></design-header>
    <main>
      <!-- 组件列表 -->
      <component-list></component-list>
      <!-- 设计区域 -->
      <design-main></design-main>
      <!-- 组件属性 -->
      <design-property></design-property>
    </main>
  </div>
  <!-- 预览界面 -->
  <preview v-model:visible="previewState.visible"></preview>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import { useDesignChart } from "@/hooks/use-designChart";
import useEitter from "@/hooks/use-core/useMitt";
import designHeader from "@/components/modules/designChart/header.vue";
import componentList from "@/components/modules/designChart/component-list.vue";
import designMain from "@/components/modules/designChart/main.vue";
import designProperty from "@/components/modules/designChart/property.vue";
import preview from "@/components/modules/designChart/preview.vue";

import {
  addEchartsList,
  updateEchartsList,
  getEchartsDetail,
} from "@/api/homeApi/index";
import { messageAlert } from "@/shared/utils/utils";

const store = useStore();
const route = useRoute();
const router = useRouter();

// 当前的chartDesignId ，也就是是否有图表设计id,pageitem可为空
const curchartDesignId = ref<any>(null);

declare type previewType = {
  visible: boolean;
};

const previewState = reactive({
  visible: false,
});

// 初始化设计器
const { initDesign, panelConf } = useDesignChart();

function setPreviewVisible(e: boolean): void {
  previewState.visible = e;
}

// 全局事件定义

useEitter([
  { key: "on-report-design-preview", value: setPreviewVisible },
  { key: "on-report-design-save", value: saveForm },
]);

/**
 * 提交报表设计数据
 */
async function saveForm({ currentChartList, panelCfg, callback }) {
  // 总数据源配置参数
  const dataSourceConfigs: any = [];
  let opPagesTree: any = [];
  for (let i = 0; i < currentChartList.length; i++) {
    const element = currentChartList[i];
    // 图表类型设置参数
    if (['chart', 'card'].includes(element.type)) {
      const dataSource = getComponentDataSource(element)
      dataSourceConfigs.push(dataSource)
    } else if (element.type === 'container') {
      element.children && element.children.forEach((child) => {
        const dataSource = getComponentDataSource(child)
        dataSourceConfigs.push(dataSource)
      })
    } else if (element.type === 'tree') {
      const options = element.options;
      if (!options) return;
      opPagesTree = options.map((item) => ({
        fieldId: Number(element.chartId),
        levelType: item.levelType,
        fieldForeignCode: item.fieldForeignCode ?? null,
        fieldCode: item.fieldCode,
        pageTableName: item.pageTableName,
      }));
    }
  }
  let para = {
    chartDesign: {
      pageItem: { currentChartList, panelCfg },
      pageId: route.query.appPageId,
      id: curchartDesignId.value,
    },
    dataSourceConfigs: dataSourceConfigs,
    opPagesTree,
  };

  try {
    if (curchartDesignId.value) {
      const res = await updateEchartsList(para);
      if (res.code == 200) {
        messageAlert('success', "保存成功");
        setTimeout(() => {
          router.go(-1);
        }, 2000);
      }
    } else {
      const res = await addEchartsList(para);
      if (res.code == 200) {
        messageAlert('success', "新增成功");
        setTimeout(() => {
          router.go(-1);
        }, 2000);
      }
    }
  } finally {
    callback();
  }
}
// 获取组件数据源配置
function getComponentDataSource(element) {
  const newCollection: any = [];
  if (element.type === 'chart') {
    for (let j = 0; j < element.series.length; j++) {
      const chartItem = element.series[j];
      const newChartChild = {
        chartCollectionId: chartItem.id,
        dataType: element.__config__.dataType[j],
        sqlString: element.__config__.dataOrg[j],
      };
      newCollection.push(newChartChild);
    }
  } else if (element.type === 'card') {
    newCollection.push({
      dataType: "0",
      chartCollectionId: element.chartId,
      sqlString: element.__config__.dataSql,
    })
  }
  const oneParams = {
    chartType: 0,
    chartId: element.chartId,
    chartDesignId: curchartDesignId.value,
    chartPropertyCollection: newCollection,
  };
  return oneParams
}

// 获取页面详情
async function getDetail() {
  let para = {
    pageId: route.query.appPageId,
  };
  const res = await getEchartsDetail(para);
  if (res.code == 200) {
    if (res.data) {
      if (res.data.chartDesign) {
        curchartDesignId.value = res.data.chartDesign.id;

        const { currentChartList, panelCfg } = res.data.chartDesign.pageItem;

        if (currentChartList && currentChartList.length > 0) {
          store.commit("designChart/setCurrentCharts", currentChartList);
          store.commit("designChart/setActiveChart", currentChartList[0]);
        }
        if (panelCfg) {
          store.commit("designChart/setChartPanel", panelCfg);
        }
        initDesign();
      }
    } else {
      store.commit("designChart/setCurrentCharts", []);
      store.commit("designChart/setActiveChart", undefined);
    }
  }
}

function init() {
  store.commit("designChart/setChartPanel", undefined);
  getDetail();
}

init();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/design/index.scss";
</style>
