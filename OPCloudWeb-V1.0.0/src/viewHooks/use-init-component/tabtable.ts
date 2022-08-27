import { getLinkageData } from "@/api/design";
import { getPageItem } from "@/api/homeApi";
import { relTableSettingTransform } from "./common";

/**
 * 多选项卡表格组件初始化
 */
export async function tabTableInit(
  row: any,
  component?: any,
  tabIndex: number = 0,
  resValue?: any
) {
  clearTabTable(component, tabIndex);
  const {
    tabOptions,
    relFields,
    selectModelList,
    dataSourceList,
    columnModelList,
  } = component;
  if (!tabOptions) {
    return;
  }
  const tabTableComponents: any = {};
  const { id } = tabOptions[tabIndex];
  if (!id) return;
  const relField = relFields?.find((f) => f.pid == id);
  if (!relField) return;
  const selectModel = selectModelList?.find((f) => f.pid == id);
  if (!selectModel || !selectModel.config) return;
  const dateSourceObj = dataSourceList?.find((f) => f.pid == id);
  if (!dateSourceObj || !dateSourceObj.dataSource) return;
  const columnModel = columnModelList?.find((f) => f.pid == id);
  if (!columnModel || !columnModel.columnConfig) return;
  // 主表字段,表格字段
  const { masterField, field } = relField;
  const config: any = relTableSettingTransform(selectModel.config);
  config.pageRequest = { pageIndex: 1, pageSize: 500 };
  // config.chartFilterFields = [
  //   {
  //     fieldName: field,
  //     fieldValue: row[masterField || "id"],
  //   },
  // ];

  config.masterFieldValue = row[masterField || "id"]
  config.masterRelatedFieldName = field

  const tableList: any = {};
  // 获取当前表格所有表ID
  const tableIds = selectModel.config.map((m) => m.id);
  selectModel.config.forEach((item) => {
    tableList[item.id] = item.tableName;
  });
  component.__config__.loading = true;
  let componentItems;
  if (resValue && resValue.length > 0) {
    const res = await Promise.all([
      getPageItem({ pageIdList: tableIds.join(",") }),
    ]);
    dateSourceObj.dataSource = resValue;
    componentItems = res[0].data; // 表格组件配置
  } else {
    const res = await Promise.all([
      getLinkageData(config),
      getPageItem({ pageIdList: tableIds.join(",") }),
    ]);
    if (res && res[0].code == 200) {
      dateSourceObj.dataSource = res[0].data.records || [];
    }
    // 获取显示的组件配置
    componentItems = res[1].data; // 表格组件配置
  }
  component.__config__.loading = false;

  const tableComponents: any = [];
  const showColumnModel: string[] = [];
  columnModel.columnConfig.forEach((item) => {
    if (item.check) showColumnModel.push(item.prop);
  });

  Object.keys(componentItems).map((key) => {
    const itemComponents = componentItems[key];
    itemComponents.components.map((component) => {
      const field =
        `${tableList[key]}__${component.__vModel__}`.toLocaleUpperCase();
      if (showColumnModel.includes(field)) {
        component.__vModel__ = field;
        tableComponents.push(component);
      }
    });
  });
  tabTableComponents[id] = tableComponents;
  return tabTableComponents;
}
/**
 * 清除主从表数据
 * @param [component]
 */
function clearTabTable(component?: any, tabIndex: number = 0) {
  const { tabOptions, dataSourceList } = component;
  const { id } = tabOptions[tabIndex];
  if (!id) return;
  const dateSourceObj = dataSourceList?.find((f) => f.pid == id);
  dateSourceObj.dataSource = [];
}
