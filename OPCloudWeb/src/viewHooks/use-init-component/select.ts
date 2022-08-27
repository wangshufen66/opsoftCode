import { getRelatedBypage } from "@/api/homeApi";
import { getDictionariesInfo } from "@/api/system";
import { SelectComponent } from "@/components/designComponent/basics/select/IConfig";

/**
 * 关联外键表类型
 * @enum {number}
 */
enum TableType {
  /**基础信息 */
  BASE_INFO = 1,
  /**字典 */
  DICT_INFO = 2,
}

/**
 * 下拉组件初始化
 * @param component 下拉组件配置
 */
export async function selectInit(component: SelectComponent, filter?: any) {
  let elementOptions: any[] = [];
  if (!component.__relTable__) return;
  const { tableType, dictType, key, relName, tableName, filterConfig } =
    component.__relTable__;
  const filterParmas =
    filterConfig?.map((m: any) => {
      return {
        filterName: m.filterName || m.field,
        filterCompare: m.filterCompare || m.type,
        filterValue: m.filterValue || m.value,
        valueType: m.valueType,
      };
    }) || [];
  const relConfig = component.__config__.relComponent;
  if (relConfig && relConfig.componentId) {
    if (relConfig.isAbsolute && (!filter || !filter.filterValue)) {
      component.options && (component.options = elementOptions);
      return;
    }
    filter && filterParmas.push(filter);
  }
  if (tableType === TableType.BASE_INFO) {
    if (!tableName || !key || !relName) return;
    //   检查组件是否有关联组件
    elementOptions = await getRelBaseInfoData(
      key,
      relName,
      tableName,
      filterParmas
    );
  } else if (tableType === TableType.DICT_INFO) {
    if (!key || !relName) return;
    elementOptions = await getRelDictData(dictType, key, relName);
  }
  component.options && (component.options = elementOptions);
}

/**
 * 获取基础信息关联信息
 * @param key
 * @param relName
 * @param [tableName]
 * @return {*}
 */
async function getRelBaseInfoData(
  key?: string,
  relName?: string,
  tableName?: string,
  filterParmas?: any[]
) {
  if (!tableName || !key || !relName) return [];
  const params = {
    columns: [key, relName],
    pageRequest: { pageIndex: 1, pageSize: 1000 },
    tableName,
    filterParmas,
  };
  // 获取关联外键数据
  const res = await getRelatedBypage(params);
  if (res.code == 200) {
    const responseData = res.data;
    return responseData.map((m) => {
      return {
        label: m[relName.toLocaleUpperCase()],
        value: m[key.toLocaleUpperCase()],
      };
    });
  }
  return [];
}

/**
 * 获取关联的字典类型数据
 * @param [dictType]
 * @param [key]
 * @param [relName]
 * @return {*}
 */
async function getRelDictData(
  dictType?: string,
  key?: string,
  relName?: string
) {
  if (!dictType || !key || !relName) return [];
  // 查询字典数据
  const params = {
    dictionaryCode: dictType,
    current: 1,
    size: 200,
  };
  const res = await getDictionariesInfo(params);

  if (res.code == 200) {
    const responseData = res.data?.records;
    return responseData.map((m) => {
      return {
        label: m[relName],
        value: m[key],
      };
    });
  }
  return [];
}
