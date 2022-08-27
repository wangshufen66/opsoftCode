import { pageCascadeData } from "@/api/homeApi";

/**
 * 级联组件
 * @param relName 级联组件的字段名
 * @param tableName 组件关联的表名
 * @return {*}
 */
export async function cascaderInit(component?: any) {
  if (!component?.__relTable__) return;
  const { key, relName, tableName } = component.__relTable__;
  if (!key || !relName || !tableName) return;
  const params = {
    fieldName: relName,
    isLazyLoaded: 1, //是否懒加载，即是否一次性返回包括子数据的数据集 1 懒加载，0 多次加载
    pid: "0", //级联组件的父id
    tableName,
  };
  const res = await pageCascadeData(params);
  if (res.code == 200) {
    component.__attr__.options = getCascadeData(
      res.data,
      relName && relName.toLocaleUpperCase(),
      key && key.toLocaleUpperCase(),
      "children"
    );
  }
}

/**
 * 生成级联数据(属性结构数据)
 * @param responseData
 */
function getCascadeData(
  responseData: any[],
  label?: string,
  value?: string,
  children: string = "children"
) {
  if (!label || !value) return [];
  const data = responseData;
  const setTreeData = (_options: any[]) => {
    const newOption: any[] = [];
    for (let i = 0; i < _options.length; i++) {
      const op = _options[i];
      const option = {
        label: op[label],
        value: op[value],
        children: op[children] && op[children].length > 0 ? [] : undefined,
      };
      if (op[children] && op[children].length > 0) {
        (<any[]>option.children) = setTreeData(op.children);
      }
      newOption.push(option);
    }
    return newOption;
  };
  return setTreeData(data);
}
