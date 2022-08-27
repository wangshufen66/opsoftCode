import {
  getFirstTreeData,
  getReportFirstTreeData,
  getTreeData,
} from "@/api/homeApi";
import { PageType } from "@/interfaces/type";

/**
 * 树形组件数据
 */
export async function treeInit(obj, curpageType: number) {
  const { component, node, resolve } = obj;
  const len = component.options.length;
  if (node.level === 0) {
    const res =
      curpageType !== PageType.REPORT_PAGE
        ? await getFirstTreeData({ fieldCode: component.__vModel__ })
        : await getReportFirstTreeData({
            chartDesignTreeId: component.chartId,
          });
    if (res.code === 200) {
      const resData = res.data;
      const arr =
        resData && resData.map((item) => ({ ...item, leaf: len === 1 }));
      if (arr) {
        return resolve(arr);
      }
    }
  }
  if (node.level >= 1 && node.level < len) {
    const { id, fieldId } = node.data;
    const nextRes = await getTreeData({
      levelType: node.level + 1,
      fieldId,
      id,
    });
    if (nextRes.code === 200) {
      const nextArr =
        nextRes.data &&
        nextRes.data.map((item) => ({
          ...item,
          leaf: node.level + 1 >= len,
        }));
      if (nextArr) {
        return resolve(nextArr);
      }
    }
  }
}
