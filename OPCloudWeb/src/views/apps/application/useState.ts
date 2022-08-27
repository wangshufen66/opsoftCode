import { computed, ref, reactive } from "vue";
import { PageType } from "@/interfaces/type";
import { useRoute } from "vue-router";

export default function useState() {
  const route = useRoute();

  /**当前页面表单结构 */
  const currentFormData = ref<Record<string, any>>({});

  /**场景条件 */
  const advancedCondition = ref<Record<string, any>>();

  /**表格分页配置 */
  const pageRequest = reactive({ pageIndex: 1, pageSize: 15 });

  // 控制添加按钮，默认为true
  const addable = ref<boolean>(true);

  /**工单打印数据列表 */
  const printOrderData = ref<any[]>([]);

  const requestConditions = ref<any[]>([]);

  /**当前页面所属应用模块信息 */
  const currentPage = reactive({
    appName: undefined,
    models: [] as any[],
    pageType: PageType.FORM_PAGE,
    loading: false,
  });

  /**顶部搜索栏 */
  const searchForm = reactive({
    formConf: undefined,
    componentList: [],
    formData: {},
  });

  /**页面、弹框配置数据 */
  const pageSetting = reactive<Record<string, any>>({
    visible: false,
    title: "",
    type: "",
    size: 0,
    formConf: undefined,
    componentList: [],
    reload: false,
    formType: "baseInfo",
    sortField: undefined,
    sortType: undefined,
  });

  /**页面参数 */
  const pageParmas = reactive({
    pageName: "",
    pageTableName: "",
    modelName: "",
    modelId: route.query.modelid || "",
    pageId: "",
    file: "",
  });

  /**工作流表单页面 */
  const flowFormTabs = reactive({
    formList: [],
    imageUrl: "",
  });

  /**嵌入页面 */
  const embedPage = reactive({
    // 嵌入页面URL
    url: "",
    //是否在本页面通过iframe展示
    iframeShow: false,
  });

  /**搜索表单筛选条件 */
  const filterColumns = computed(() => {
    return searchForm.formData || {};
  });

  /**场景可设置组件配置 */
  const sceneComponentList = computed(() => {
    return pageSetting.componentList;
  });

  /**场景配置 */
  const sceneConfig = computed(() => {
    const componentList = pageSetting.componentList;
    const scenes: any = [];
    componentList &&
      componentList.forEach((element) => {
        scenes.push({
          label: element.__form__.label,
          value: element.__vModel__,
          type: element.componentTag,
        });
      });
    return scenes;
  });

  /**主从表页面表单 */
  const tableForm = reactive({
    visible: false,
    title: "",
    type: "",
    size: 0,
    formType: 1, // 1：新增；2：编辑
    formConf: undefined,
    tableId: undefined,
    componentList: [],
    formData: {},
    options: {},
  });

  /**其他页面表单 */
  const copyTableForm = reactive({
    visible: false,
    title: "",
    type: "",
    size: 0,
    formType: 1, // 1：新增；2：编辑
    formConf: undefined,
    tableId: undefined,
    componentList: [],
    formData: {},
    options: {},
  });
  /**表格数据过滤条件集合 */
  const filterlist = reactive({
    filterName: "",
    filterCompare: "",
    private: [],
  });

  return {
    addable,
    currentPage,
    searchForm,
    pageSetting,
    currentFormData,
    filterColumns,
    pageParmas,
    pageRequest,
    requestConditions,
    advancedCondition,
    sceneComponentList,
    sceneConfig,
    flowFormTabs,
    embedPage,
    printOrderData,
    tableForm,
    copyTableForm,
    filterlist,
  };
}
