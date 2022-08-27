<!-- 表单设计 -->
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
      <design-setting></design-setting>
    </main>
  </div>
  <!-- 预览界面(当前值考虑弹窗预览) -->
  <preview
    v-model:visible="previewState.visible"
    :direction="previewState.direction"
    :type="previewState.type"
    :size="previewState.size"
  ></preview>
  <!-- 预览类型选择框 -->
  <formTypeDialog v-model:visible="formTypeVisible"></formTypeDialog>
</template>

<script lang="ts">
import designHeader from "@/components/modules/design/header.vue";
import componentList from "@/components/modules/design/component-list.vue";
import designMain from "@/components/modules/design/main.vue";
import designSetting from "@/components/modules/design/property.vue";
import preview from "@/components/modules/design/preview.vue";
import formTypeDialog from "@/components/modules/design/formTypeDialog.vue";

import { reactive, ref, onMounted, onUnmounted, provide } from "vue";
import { closeRemind } from "@/shared/utils/utils";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import {
  useDesign,
  useActiveDesignComponent,
  useBaseInfoDesign,
} from "@/hooks/use-design";
import useEitter from "@/hooks/use-core/useMitt";

import defaultComponent from "@/config/component/default";
import { getStorage, messageAlert } from "@/shared/utils/utils";
import { DesignComponent } from "@/components/designComponent";
import {
  updatePageItemById,
  tempSavePageComponet,
  getPageById,
} from "@/api/homeApi/index";
import { getDictionariesInfo } from "@/api/system";
import { getAppList } from "@/api/userApi";

export default {
  components: {
    designHeader,
    componentList,
    designMain,
    designSetting,
    preview,
    formTypeDialog,
  },
  setup() {
    const { initDesign, defaultRegexList, appList } = useDesign();
    const { setActiveComponent } = useActiveDesignComponent();
    const { getDesignComponentConfig } = useBaseInfoDesign();

    // 初始化设计器
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    // 页面ID
    const pageid = <string>route.query.appPageId;
    provide("pageid", pageid);

    // 查询后的组件id数组
    const fieldlist = reactive({
      currentfields: [],
    });
    // 表单类型弹窗
    const formTypeVisible = ref<boolean>(false);
    // 预览配置
    const previewState = reactive({
      visible: false,
      type: "",
      size: 0,
      direction: "",
    });
    // 全局事件定义
    useEitter([
      { key: "on-preview-page", value: setPreviewVisible },
      { key: "on-formtype-dialog", value: setFormTypeVisible },
      { key: "on-components-save", value: saveForm },
    ]);

    /**
     * 预览
     */
    function setPreviewVisible(e): void {
      const { visible, showType, direction, size } = e;
      previewState.visible = visible;
      if (showType) {
        previewState.direction = direction;
        previewState.type = showType;
        previewState.size = size;
      }
    }
    /**
     * 预览方式
     */
    function setFormTypeVisible(visible: boolean): void {
      formTypeVisible.value = visible;
    }

    /**
     * 提交表单数据
     */
    async function saveForm({ saveType, config, callback }) {
      const curPageDesign = getStorage("curPageDesign");
      const { modelid, appPageId, isUsing, pageType, pageName } = route.query;
      const { pageSource, pageTableName, ord } = curPageDesign;
      // 流程表单需要选择  所属流程、 所属用户组
      if (pageType == "1") {
        if (!config.formConf.processDefinitionId) {
          messageAlert("warning", "请在表单属性中选择所属流程");
          callback();
          return;
        }
      }
      let params = {
        pageType: pageType,
        modelId: modelid,
        id: appPageId,
        isUsing: isUsing,
        pageName,
        pageSource,
        pageTableName,
        ord,
        isIot: config.formConf.isIot,
        dataSource: config.formConf?.dataSource,
        pageItems: config,
        itemsFields: [] as any,
        codeRuleGenerateList: undefined as any,
      };
      const components = config.components;

      params.itemsFields = getDesignComponentConfig(
        pageid,
        components,
        fieldlist.currentfields
      );
      /******************************************************************/
      const codeRule: any[] = [];

      for (let index = 0; index < components.length; index++) {
        const component = components[index];
        if (component.componentTag === "designButton") {
          if (component.__config__.eventCode == "") {
            messageAlert("warning", `${component.__config__?.title}未设置事件`);
            callback();
            return;
          }
        }
      }
      const formConf = config.formConf;

      if (formConf.showButton && formConf.buttonList) {
        for (let index = 0; index < formConf.buttonList.length; index++) {
          const buttonitem = formConf.buttonList[index];
          if (buttonitem.eventCode == "") {
            messageAlert("warning", `${buttonitem?.title}未设置事件`);
            callback();
            return;
          }
        }
      }

      params.codeRuleGenerateList =
        (codeRule.length > 0 && codeRule) || undefined;
      /******************************************************************/
      try {
        const res =
          saveType === 1
            ? await updatePageItemById(params)
            : await tempSavePageComponet(params);
        if (res.code == 200) {
          messageAlert("success", saveType === 1 ? "保存成功" : "暂存成功");
          setTimeout(() => {
            saveType === 1 && router.go(-1);
          }, 2000);
        }
      } finally {
        callback();
      }
    }

    /**
     * 获取页面配置
     */
    async function getPageConfig() {
      let para = {
        pageId: pageid,
      };
      const res = await getPageById(para);
      if (res.code == 200) {
        if (res.data.pageItems) {
          const { components, formConf } = res.data.pageItems;
          // 当前页面的组件ids
          fieldlist.currentfields = res.data.itemsFields;
          components.map((m) => {
            m.__runtime__ = { fieldDisabled: true };
          });
          store.commit("design/setCurrentComponents", components);
          store.commit("design/setActiveComponent", components[0]);
          store.commit("design/setFormConfig", formConf);
        } else {
          store.commit("design/setFormConfig", {
            size: "medium",
            labelPosition: "right",
            labelWidth: 120,
            disabled: false,
            width: 70,
            dialogType: "dialog",
            direction: "rtl",
            processDefinitionId: "", //所属流程、
            userGroup: "", //所属用户组
            startFlowLabel: "启动流程",
            showButton: false, //表单设置按钮
            buttonList: [], //按钮列表
            equipMaint: false,
            equipMaintForm: {},
            isIot: null,
            dataSource: "",
          });
        }
      }
      initDesign();
    }

    /**
     * 设置默认正则校验规则
     */
    async function setDefaultRegex() {
      const res = await getDictionariesInfo({
        dictionaryCode: "basicRegex",
        current: 1,
        size: 100,
      });
      if (res.code == 200) {
        const dictlist = res.data.records;
        let defaultRegex = [];
        if (dictlist) {
          defaultRegex = dictlist.map((item) => {
            return {
              codeInfoId: item.codeInfoId,
              code: item.code,
              name: item.name,
              remark: item.remark,
            };
          });
        }
        defaultRegexList.value = defaultRegex;
      }
    }

    if (route.query.isNull === "false") {
      setActiveComponent(<DesignComponent>defaultComponent);
      getPageConfig();
    } else {
      initDesign();
    }

    /**
     * 获取系统应用列表
     */
    async function getAllAppList() {
      const res = await getAppList();
      if (res.code == 200) {
        appList.value = res.data.map((m) => {
          return {
            id: m.id,
            appName: m.appName,
          };
        });
      }
    }

    /**
     * 页面初始化
     */
    function init() {
      setDefaultRegex();
      getAllAppList();
      const { appid, modelid, appPageId } = route.query;
      store.commit("design/setPage", [appid, modelid, appPageId]);
    }

    init();

    /** 关闭询问 */
    onMounted(() => {
      closeRemind();
    });

    onUnmounted(() => {
      window.onbeforeunload = null;
    });

    return {
      previewState,
      formTypeVisible,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/design/index.scss";
</style>
