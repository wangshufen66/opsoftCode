import { getLinkageData } from "@/api/design";
import { getPageItem } from "@/api/homeApi";
import { relTableSettingTransform } from "./common";

/**
 * 多选项卡表格组件初始化
 */
export async function tabTableInit(row: any, component?: any) {
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
  for (let i = 0; i < tabOptions.length; i++) {
    const { id } = tabOptions[i];
    if (!id) continue;
    const relField = relFields?.find((f) => f.pid == id);
    if (!relField) continue;
    const selectModel = selectModelList?.find((f) => f.pid == id);
    if (!selectModel || !selectModel.config) continue;
    const dateSourceObj = dataSourceList?.find((f) => f.pid == id);
    if (!dateSourceObj || !dateSourceObj.dataSource) continue;
    const columnModel = columnModelList?.find((f) => f.pid == id);
    if (!columnModel || !columnModel.columnConfig) continue;
    // 主表字段,表格字段
    const { masterField, field } = relField;
    const config: any = relTableSettingTransform(selectModel.config);
    config.pageRequest = { pageIndex: 1, pageSize: 500 };
    config.chartFilterFields = [
      {
        fieldName: field,
        fieldValue: row[masterField || "id"],
      },
    ];
    const tableList: any = {};
    // 获取当前表格所有表ID
    const tableIds = selectModel.config.map((m) => m.id);
    selectModel.config.forEach((item) => {
      tableList[item.id] = item.tableName;
    });
    const res = await Promise.all([
      getLinkageData(config),
      getPageItem({ pageIdList: tableIds.join(",") }),
    ]);
    if (res && res[0].code == 200) {
      dateSourceObj.dataSource = res[0].data.records || [];
    }
    // 获取显示的组件配置
    const componentItems = res[1].data; // 表格组件配置
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
  }
  return tabTableComponents;
}
