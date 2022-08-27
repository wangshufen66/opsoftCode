import commonTable from '@/components/commontable/index.vue';

export default function (app) {

  const components = import.meta.globEager(
    './../components/designComponent/*/*/index.vue'
  );

  const propertys: any = import.meta.globEager(
    './../components/designComponent/*/*/property.vue'
  );

  const configs: any = import.meta.globEager(
    './../components/designComponent/*/*/config.ts'
  );
  // 设计组件
  for (const path in components) {
    const component = (<any>components[path]).default;
    app.component(component.name, component);
  }
  // 属性组件
  for (const path in propertys) {
    const component = (<any>propertys[path]).default;
    app.component(component.name, component);
  }

  app.config.globalProperties.componentClass = {};
  for (const path in configs) {
    const config = (<any>configs[path]);
    if (config.defaultConfig && config.defaultConfig.config) {
      const name = config.defaultConfig.config.name;
      app.config.globalProperties.componentClass[name] = config[name];
    }
  }

  app.component(commonTable.name, commonTable);
}
