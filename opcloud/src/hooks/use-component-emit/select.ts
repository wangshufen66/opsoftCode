import useInitComponentData from "../use-init-component";

// 组件数据初始化
const { selectInit } = useInitComponentData();

/**
 * 下拉组件change事件钩子
 * @param e
 */
export function selectChange(obj) {
  const { value, components, componentCfg } = obj;
  const { componentId } = componentCfg;
  const componentList = components;
  for (let i = 0; i < componentList.length; i++) {
    const component: any = componentList[i];
    if (componentId === component.componentId) {
      continue;
    }
    const relComponentCfg = component.__config__.relComponent;
    if (!relComponentCfg || !relComponentCfg.componentId) continue;
    if (componentId === relComponentCfg.componentId) {
      if (component.componentTag === "designSelect") {
        // 关联字段的值
        const relValue = value;
        // 联动组件字段=关联字段的值
        const filter = {
          filterName: relComponentCfg.relField,
          filterCompare: "=",
          filterValue: relValue,
        };
        // 执行下拉数据源获取
        selectInit(component, filter);
      }
    }
  }
}
