import { computed, ref, reactive } from "vue";
import { LayoutState, PageType } from "@/shared/type";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { inject } from "vue";

export default function useState() {
  const route = useRoute();

  const router = useRouter();

  const store = useStore();

  // ================Inject==============================
  /**布局结构数据 */
  const layoutState = inject<LayoutState>("layout");

  // 当前表单弹窗ref对象
  const modelFormRef = ref<any>(null);

  const pageTableRef = ref<any>();

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
    // 导入loading
    isLoading: undefined,
    // 导入loading的提示
    msg: "数据导入中...",
    // loading背景颜色
    loadingBackColor: "rgba(0, 0, 0, 0.2)",
    title: "",
    type: "",
    size: 0,
    visible: false,
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
    tableName: undefined,
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

  /**菜单结构数据 */
  const menuLayout = computed(() => {
    return store.state.comm.menuLayout;
  });

  /**菜单结构数据是否初始化 */
  const appMenuInit = computed(() => {
    return store.state.comm.appMenuInit;
  });

  /**表名是否为工序(工序任务 t_aegongdan_mshengchanzhixing_pICMOEntry_666 和委外工序 t_en_wi_OutSourceEntry_666) */
  //工序任务和委外工序  不显示编辑和删除按钮
  //生产订单:在确认和下达状态在不显示编辑删除按钮 t_aegongdan_mshengchanzhixing_pICMO_666

  const isShowEditBtn = computed(() => {
    return (row) => {
      let regpICMO = /^t_aegongdan_mshengchanzhixing_pICMOEntry$/;
      let regOut = /^t_en_wi_OutSourceEntry$/;
      let regOrder = /^t_aegongdan_mshengchanzhixing_pICMO$/;
      if (
        regpICMO.test(pageParmas.pageTableName) ||
        regOut.test(pageParmas.pageTableName) ||
        (regOrder.test(pageParmas.pageTableName) &&
          (row.FStatus == "下达" || row.FStatus == "确认"))
      ) {
        return false;
      } else {
        return true;
      }
    };
  });

  // 委外检验单、生产检验单 隐藏 删除按钮
  //(委外检验 t_en_sn_TestReceive_666  生产检验  t_en_wi_pqualitytest_666)
  const isShowDelBtn = computed(() => {
    return (row) => {
      let regpICMO = /^t_aegongdan_mshengchanzhixing_pICMOEntry$/;
      let regOut = /^t_en_wi_OutSourceEntry$/;
      let regTestReceiv = /^t_en_sn_TestReceive$/;
      let regQualitytest = /^t_en_wi_pqualitytest$/;
      if (
        regpICMO.test(pageParmas.pageTableName) ||
        regOut.test(pageParmas.pageTableName) ||
        regTestReceiv.test(pageParmas.pageTableName) ||
        regQualitytest.test(pageParmas.pageTableName)
      ) {
        return false;
      } else {
        return true;
      }
    };
  });

  /**表名是生产汇报*/
  const isReport = computed(() => {
    return (
      (copyTableForm.tableName &&
        /^t_aegongdan_mshengchanzhixing_pReport$/.test(
          copyTableForm.tableName || ""
        )) ||
      false
    );
  });

  return {
    route,
    router,
    layoutState,
    modelFormRef,
    pageTableRef,
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
    menuLayout,
    appMenuInit,
    isShowEditBtn,
    isShowDelBtn,
    isReport
  };
}
