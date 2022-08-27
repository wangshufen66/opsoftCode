import { getLinkageData } from "@/api/design";
import { DialogSelectComponent } from "@/components/designComponent/trade/dialogSelect/IConfig";
import { relTableSettingTransform } from "./common";

/**
 * 开窗组件数据初始化
 * @export
 * @param component
 * @param [filter]
 */
export async function getDialogSelectData(
  component: DialogSelectComponent,
  value: string | number | boolean
) {
  const config = relTableSettingTransform(component?.selectModel);
  // config.chartFilterFields = [];
  // config.chartFilterFields.push({
  //   fieldName: component.__config__.valueBindField,
  //   fieldValue: value,
  // });
  config.masterFieldValue = value;
  config.masterRelatedFieldName = component.__config__.valueBindField;
  const res = await getLinkageData({
    ...config,
    pageRequest: { pageIndex: 1, pageSize: 500 },
  });
  if (res.code == 200) {
    return res.data;
  }
  return undefined;
}
