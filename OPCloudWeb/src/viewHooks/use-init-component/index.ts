import { selectInit } from "./select";
import { cascaderInit } from "./cascader";
import { tabTableInit } from "./tabtable";
import { treeInit } from "./tree";
import { getDialogSelectData } from "./dialogSelect";
import { processFlowInit } from "./processFlow";
import dayjs from "dayjs";

/**
 * 应用表单组件初始化
 * @export
 * @return {*}
 */
export default function useInitComponentData() {
  /**
   * 初始化组件数据
   */
  async function initComponentData(
    valueList,
    type?: "add" | "edit",
    rowData?: any
  ) {
    for (let i = 0; i < valueList.length; i++) {
      const element = valueList[i] as any;
      const tag = element.componentTag;
      if (tag === "designSelect") {
        await selectInit(element, null);
      } else if (tag === "designMoreSelect") {
        await selectInit(element, null);
      } else if (tag === "designCascader") {
        await cascaderInit(element);
      } else if (tag === "designTabTable") {
        if (type === "add") {
          element.dataSourceList?.forEach((item) => {
            item.dataSource && (item.dataSource = []);
          });
        }
      } else if (tag === "designRadio") {
        await selectInit(element);
      } else if (tag === "designCheckBox") {
        await selectInit(element);
      } else if (tag === "designUpload") {
        await selectInit(element);
      } else if (tag === "designProgress") {
        // if ( === "edit") {
        // await progressInit(element, type, rowData, pageParmas.pageId);
        // }
      }
    }
  }

  /**
   * 数据源设置类型表格数据转换
   * @param components 组件配置
   * @param tableData 表格数据
   */
  function transformDataSourceOfTableData(components: any[], tableData: any[]) {
    for (let i = 0; i < tableData.length; i++) {
      const row = tableData[i];
      Object.keys(row).forEach((key) => {
        const component = components.find(
          (f) => f.__vModel__ === key.toLocaleUpperCase()
        );
        if (component) {
          const tag = component.componentTag;
          if (["designSelect", "designRadio"].includes(tag)) {
            const option =
              row[key] &&
              component.options.find((option) => option.value == row[key]);
            row[key] = option && option.label;
            row[`${key}_key`] = option && option.value;
          } else if (["designSwitch"].includes(tag)) {
            row[`${key}_key`] = row[key];
            row[key] =
              row[key] === 1
                ? component.__config__.activeText
                : component.__config__.inactiveText;
          } else if (["designMoreSelect", "designCheckBox"].includes(tag)) {
            const value = (row[key] && JSON.parse(row[key])) || row[key];
            const labelList: any[] =
              (value &&
                component.options.filter((f) => value.includes(f.value))) ||
              [];
            row[key] = labelList.map((m) => m.label).join(",");
            row[`${key}_key`] = value || [];
          } else if (["designTimePicker", "designDatePicker"].includes(tag)) {
            if (row[key]) {
              let date = row[key];
              tag === "designTimePicker" && (row[`${key}_key`] = date);
              row[key] = date && dayjs(date).format(component.__attr__.format);
            }
          } else if (["designMultiDatePicker"].includes(tag)) {
            if (row[key]) {
              const value = JSON.parse(row[key]);
              row[`${key}_key`] = value || [];
              row[key] = value
                .map((m) => dayjs(m).format(component.__attr__.format))
                .join(",");
            }
          } else if (["designDialogSelect"].includes(tag)) {
            getDialogSelectData(component, row[key]).then((res) => {
              if (res && res.records.length > 0) {
                const dataRow = res.records[0];
                row[`${key}_dialogSelect`] =
                  dataRow[component.__config__.valueBindField];
                row[key] = dataRow[component.__config__.textBindField];
              }
            });
          }
        }
      });
    }
  }

  return {
    initComponentData,
    selectInit,
    tabTableInit,
    treeInit,
    cascaderInit,
    transformDataSourceOfTableData,
    processFlowInit,
  };
}
