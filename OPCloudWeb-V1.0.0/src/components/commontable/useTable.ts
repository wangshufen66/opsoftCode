import { getCurrentInstance, ref, reactive, computed } from "vue";
import type { ColumnConfig, Pagination, TableAttr } from "./type";
import { FileType, ITableColunmSetting } from "@/interfaces/ITableConfig";

/**
 * useTable
 */
export default function useTable() {
  const props: any = getCurrentInstance()?.props;
  /**
   * 默认外观配置
   * @type {*}
   */
  const defalutTableAttr: TableAttr = {
    "element-loading-text": "加载中…",
    "element-loading-background": "rgba(0, 0, 0, 0.2)",
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

  /**表格属性 */
  const tableAttribute = ref({});

  // 列设置
  const colSetDialogOption = ref(false);

  /** 选中行 */
  const selectionOptions = reactive({
    count: 0,
    rows: [],
  });

  /**分页设置 */
  const pagination = reactive<Pagination>({
    pageIndex: 1,
    pageSize: (props && props.sizeList && props.sizeList[0]) || 15,
  });

  /**图片视图配置 */
  const imageViewer = reactive({
    /**是否显示 */
    show: false,
    /**图片路径 */
    filePathList: [] as any[],
    /**显示图片的索引 */
    index: 0,
  });

  /**显示、隐藏列 */
  const columnConfig = reactive<ColumnConfig>({
    showColumn: [],
    hiddenColumn: [],
  });

  /**
   * 表格显示列
   * @type {*}
   */
  const colSettingList = computed<ITableColunmSetting[]>(() => {
    const colList = columnConfig.showColumn.map(
      (item: ITableColunmSetting, index: number) => {
        if (index === columnConfig.showColumn.length - 1) {
          item.minWidth = item.width;
          delete item.width;
        }
        return { ...defColSetting, ...item };
      }
    );
    // 设置默认显示列(显示优化)
    if (!colList || colList.length === 0) {
      return [
        {
          prop: "default-prop",
          init: true,
          label: "",
        },
      ];
    }
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
    /**表格配置属性 */
    tableAttribute,
    colSetDialogOption,
    pagination,
    imageViewer,
    columnConfig,
    colSettingList,
    hasImageViewer,
  };
}
