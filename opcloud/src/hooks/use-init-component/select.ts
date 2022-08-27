import { getRelatedBypage } from "@/api/homeApi";
import { getDictionariesInfo } from "@/api/system";
import { SelectComponent } from "@/components/designComponent/basics/select/IConfig";
import { relTableSettingTransform } from "./common";
import { getLinkageData } from "@/api/design";

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
export async function selectInit(
  component: SelectComponent,
  filter?: any,
  sourceData?: any,
  componentList?: any[]
) {
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
  //   检查组件是否有关联组件
  if (relConfig && relConfig.componentId) {
    const relComponent = componentList?.find(
      (f) => f.componentId === relConfig.componentId
    );
    // 如果联动的组件是开窗组件---------需要优化，hooks处理数据初始化联动
    if (relComponent && relComponent.componentTag === "designDialogSelect") {
      const config = relTableSettingTransform(relComponent?.selectModel);
      // config.chartFilterFields = [];
      // config.chartFilterFields.push({
      //   fieldName: relComponent.__config__.valueBindField,
      //   fieldValue: sourceData && sourceData[relComponent.__vModel__],
      // });
      config.masterFieldValue =
        sourceData && sourceData[relComponent.__vModel__];
      config.masterRelatedFieldName = relComponent.__config__.valueBindField;
      const res = await getLinkageData({
        ...config,
        pageRequest: { pageIndex: 1, pageSize: 500 },
      });
      if (res.code == 200) {
        const dialogSelectData = res.data.records[0];
        if (dialogSelectData) {
          const relValue = dialogSelectData[relConfig.field];
          relValue &&
            (filter = {
              filterCompare: "=",
              filterName: relConfig.relField,
              filterValue: [relValue],
            });
        }
      }
    }
    if (relConfig.isAbsolute && (!filter || !filter.filterValue)) {
      component.options && (component.options = elementOptions);
      return;
    }
    filter && filterParmas.push(filter);
  }
  if (tableType === TableType.BASE_INFO) {
    if (!tableName || !key || !relName) return;
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
