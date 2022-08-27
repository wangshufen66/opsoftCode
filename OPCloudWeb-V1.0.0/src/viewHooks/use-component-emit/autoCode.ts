import { autoCodeRule } from "@/api/homeApi";

/**
 * 获取自编码
 */
export async function createAutoCode({
  component: component,
  formModel: formModel,
  tableId: tableId,
}) {
  const params = {
    // 兼容原有组件配置
    tableId: tableId,
    fieldName: component.__vModel__,
    isUnique: +component.__config__.unique,
    additionalConfiguration: {
      rule: component.autorule.type,
      numberLength: component.autorule.numLen,
      defaultAlphabetal: component.autorule.letter,
      dateFormat: component.autorule.dataformat,
    },
  };
  const res = await autoCodeRule(params);
  formModel[component.__vModel__] = res.data;
}
