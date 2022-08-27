import { createStore, ModuleTree } from "vuex";

const storeModules = import.meta.globEager<{ default: unknown[] }>(
  "./modules/**.ts"
);

const stores = Object.keys(storeModules).reduce<any>(
  (modules: any[], path: string): any[] => {
    const moduleName: string = path.replace(/^\.\/.*\/(.*)\.\w+$/, "$1");
    modules[moduleName] = storeModules[path].default;
    return modules;
  },
  {}
);

const modules: ModuleTree<any> = stores as ModuleTree<any>;

const store = createStore({
  modules: modules,
});

export default store;
