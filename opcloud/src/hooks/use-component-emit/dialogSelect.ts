import useInitComponentData from "../use-init-component";
import { getLinkageData } from "@/api/design";
import { getPageItem } from "@/api/homeApi";

// 组件数据初始化
const { initComponentData, selectInit, transformDataSourceOfTableData } =
  useInitComponentData();

/**
 * 加载开窗组件
 * @param parmas
 */
export function loadDialogSelectData(dialogSelectCfg: any) {
  /**开窗配置 */
  const { config, model, components, componentCfg, callback } = dialogSelectCfg;
  // 联动检测
  const relConfig = componentCfg.__config__.relComponent;
  if (relConfig && relConfig.componentId) {
    const relComponent = components.find(
      (f) => f.componentId == relConfig.componentId
    );
    if (relComponent) {
      // 绝对联动
      if (relConfig.isAbsolute) {
        config.masterFieldValue = model[relComponent.__vModel__];
        config.masterRelatedFieldName = relConfig.relField;
        // config.chartFilterFields.push({
        //   fieldName: relConfig.relField,
        //   fieldValue: model[relComponent.__vModel__],
        // });
      } else {
        model[relComponent.__vModel__] &&
          ((config.masterFieldValue = model[relComponent.__vModel__]),
          (config.masterRelatedFieldName = relConfig.relField));
        // config.chartFilterFields.push({
        //   fieldName: relConfig.relField,
        //   fieldValue: model[relComponent.__vModel__],
        // });
      }
    }
  }
  const selectModel = componentCfg.selectModel;

  const tableList: any = {};
  selectModel.forEach((item) => {
    tableList[item.id] = item.tableName;
  });
  Promise.all([
    getLinkageData(config), //获取开窗表格数据
    getPageItem({ pageIdList: Object.keys(tableList).join(",") }),
  ]).then((res) => {
    const tableData = res[0].data;
    // 获取选中列对应组件的配置
    const searchColumns: any = [],
      showColumns: any = [];
    for (let i = 0; i < componentCfg.columnModel.length; i++) {
      const item = componentCfg.columnModel[i];
      item.insearh && searchColumns.push(item);
      item.check && showColumns.push(item);
    }
    const searchModel: string[] = searchColumns.map((m) => m.prop) || [];
    const columnModel: string[] = showColumns.map((m) => m.prop) || [];
    // 获取显示的组件配置
    const componentItems = res[1].data; // 表格组件配置
    const searchFormComponents: any = [];
    const tableComponents: any = [];
    Object.keys(componentItems).map((key) => {
      const itemComponents = componentItems[key];
      itemComponents.components.map((component) => {
        const field =
          `${tableList[key]}__${component.__vModel__}`.toLocaleUpperCase();
        if (searchModel.includes(field)) {
          component.__vModel__ = field;
          searchFormComponents.push(component);
        } else if (columnModel.includes(field)) {
          component.__vModel__ = field;
          tableComponents.push(component);
        }
      });
    });
    // 初始化组件
    initComponentData(tableComponents).then(() => {
      // 根据组件类型，处理表格数据
      transformDataSourceOfTableData(
        tableComponents,
        tableData.records || []
      ).then(() => {
        callback({
          tableData,
          searchFormComponents,
          tableList,
        });
      });
    });
  });
}

/**
 * 开窗组件开窗表格选择的数据回填
 */
export function fillDialogSelectData({ row, model, components, componentCfg }) {
  if (!components || components.length === 0) return;
  const componentList = components;
  /**开窗组件 */
  let masterComponent = componentCfg;
  let masterValue = undefined;

  const { componentId } = componentCfg;
  masterValue = model[masterComponent.__vModel__];
  for (let i = 0; i < componentList.length; i++) {
    const component: any = componentList[i];
    if (componentId === component.componentId) {
      continue;
    }
    const relComponentCfg = component.__config__.relComponent;
    if (!relComponentCfg || !relComponentCfg.componentId) continue;
    if (componentId === relComponentCfg.componentId) {
      if (component.componentTag === "designInput") {
        // 文本输入框，直接填充数据
        model[component.__vModel__] = row[relComponentCfg.field];
      } else if (component.componentTag === "designSelect") {
        // 关联字段的值
        const relValue =
          row[`${relComponentCfg.field}_key`] != undefined
            ? row[`${relComponentCfg.field}_key`]
            : row[relComponentCfg.field];
        // 联动组件字段=关联字段的值
        const filter = {
          filterName: relComponentCfg.relField,
          filterCompare: "=",
          filterValue: [relValue],
        };
        // 执行下拉数据源获取
        selectInit(component, filter);
      }
    }
  }
}
