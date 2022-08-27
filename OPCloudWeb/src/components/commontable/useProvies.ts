import { computed, inject } from "vue";

/**
 * 表格provies操作
 */
export function useProvies() {
  const parent = inject("parent", {} as any);
  const tableComponents = inject("table-components", {} as any);

  /**组件列表Map形式（key为__vModel__属性） */
  const componentList = computed<Map<any, any> | undefined>(() => {
    const components = tableComponents.componentList;
    if (components && components.length > 0) {
      const map = new Map();
      for (let i = 0; i < components.length; i++) {
        const component = components[i];
        map.set(component.__vModel__, component);
      }
      return map;
    }
    return undefined;
  });

  /**
   * 列是否具有穿透功能
   * @param prop
   */
  function rowHasPenetrate(prop: string) {
    const component = componentList.value && componentList.value.get(prop);
    return !!(
      component &&
      component.__config__.penetrate &&
      component.__config__.penetrate.page
    );
  }

  /**
   * 设置了数据穿透的单元格点击事件
   * @param row
   * @param prop
   */
  function columnItemClick(row: any, prop: string) {
    const component = componentList.value && componentList.value.get(prop);
    if (component && component.__config__.penetrate) {
      const penetrate = component.__config__.penetrate;
      const page = penetrate.page;
      const params: any = {};
      // 携带ID
      if (penetrate.portId && penetrate.relIdField) {
        row.id && (params[penetrate.relIdField.toLocaleUpperCase()] = row.id);
      }
      if (penetrate.relCfg && penetrate.relCfg.length > 0) {
        penetrate.relCfg.forEach((item) => {
          // 关联字段，如果字段值值未设置，则默认当前列的值
          item.relField &&
            (params[item.relField.toLocaleUpperCase()] =
              (item.valueField && row[item.valueField]) || row[prop]);
        });
      }
      parent && parent.tableRowClick(page, params, penetrate.type);
    }
  }

  return {
    componentList,
    columnItemClick,
    rowHasPenetrate,
  };
}
