import { FileType, ITableColunmSetting } from "@/interfaces/ITableConfig";
import { getCurrentInstance, ref } from "vue";
import { PropType, reactive, computed } from "vue";

// 定义可设置table属性的结构
export type tableAttr = {
  /**rowKey */
  rowKey?: string;
  /**loading显示文本 */
  elementLoadingText?: string;
  /**loading 图标 */
  elementLoadingSpinner?: string;
  /**loading 遮罩背景色 */
  elementLoadingBackground?: string;
  /** 选中行高亮*/
  highlightCurrentRow?: boolean;
  /**斑马样式 */
  stripe?: boolean;
  /**边框 */
  border?: boolean;
  /**空数据显示文本 */
  emptyText?: string;
  /**列合并方法 */
  spanMethod?: Function;
  /**合计列计算方法 */
  summaryMethod?: Function;
  /**大小 */
  size: "medium" | "small" | "mini";
};

export type Pagination = {
  pageIndex: number | unknown;
  pageSize: number | unknown;
};

export type ColumnConfig = {
  showColumn: ITableColunmSetting[];
  hiddenColumn: ITableColunmSetting[];
};

/**
 * useTable
 */
export function useTable() {
  const props = getCurrentInstance()?.props;
  /**
   * 默认外观配置
   * @type {*}
   */
  const defalutTableAttr: tableAttr = {
    // rowKey: 'id',
    elementLoadingText: "加载中…",
    elementLoadingSpinner: "el-icon-loading",
    elementLoadingBackground: "rgba(0, 0, 0, 0.2)",
    highlightCurrentRow: true,
    stripe: true,
    border: true,
    emptyText: "暂无数据",
    size: "medium",
  };
  /**
   * 默认列配置
   * @type {*}
   */
  const defColSetting: ITableColunmSetting = {
    headerAlign: undefined,
    align: undefined,
    prop: undefined,
    label: undefined,
    init: true,
    width: undefined,
    showoverflowtooltip: true,
    sortable: undefined,
    fixed: undefined,
  };
  /** 选中行 */
  const selectionOptions = reactive({
    count: 0,
    rows: [],
  });

  /**表格属性 */
  const tableAttribute = ref({});
  // 列设置
  const colSetDialogOption = ref(false);

  // 分页设置
  const pagination = reactive<Pagination>({
    pageIndex: 1,
    pageSize: (props && props.sizeList && props.sizeList[0]) || 15,
  });
  /**图片视图配置 */
  const imageViewer = reactive({
    show: false,
    filePathList: [] as any[],
    index: 0,
  });

  // 显示、隐藏列
  const columnConfig = reactive<ColumnConfig>({
    showColumn: [],
    hiddenColumn: [],
  });
  /**
   * 表格显示列
   * @type {*}
   */
  const colSettingList = computed(() => {
    const colList = columnConfig.showColumn.map(
      (item: ITableColunmSetting, index: number) => {
        if (index === columnConfig.showColumn.length - 1) {
          item.minWidth = item.width;
          delete item.width;
        }
        return { ...defColSetting, ...item };
      }
    );
    return colList;
  });
  /**
   * 是否包含图片预览功能
   * @type {*}
   */
  const hasImageViewer = computed<boolean>(() => {
    return colSettingList.value.some(
      (f: ITableColunmSetting) => f.fileType == FileType.PICTURE
    );
  });

  return {
    defalutTableAttr,
    defColSetting,
    selectionOptions,
    tableAttribute,
    colSetDialogOption,
    pagination,
    imageViewer,
    columnConfig,
    colSettingList,
    hasImageViewer,
  };
}

export function useProps() {
  return {
    options: {
      type: Object as PropType<tableAttr>,
      default: () => {
        return {};
      },
    },
    /**表格数据源 */
    tableData: {
      type: Array,
      default: [],
    },
    // 表格列
    tableColums: {
      type: Array,
      default: () => [],
    },
    tableLoading: Boolean,
    // 是否显示列check
    selectionCol: {
      type: Boolean,
      default: () => true,
    },
    batchDelete: {
      type: Boolean,
      default: () => false,
    },
    // 是否显示索引列
    indexCol: {
      type: Boolean,
      default: () => true,
    },
    // 是否能设置表格列
    isSetColumn: {
      type: Boolean,
      default: () => true,
    },
    // 是否显示分页
    paging: {
      type: Boolean,
      default: () => false,
    },
    total: Number,
    //可选页面大小
    sizeList: {
      type: Array,
      default: () => [15, 20, 30],
    },
    //table是否没有td右边框
    noTableRight: {
      type: Boolean,
      default: () => true,
    },
  };
}
