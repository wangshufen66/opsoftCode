<template>
  <el-scrollbar class="component-list scrollbar">
    <template v-for="type in state.componentList" :key="type.name">
      <div class="type-wrap" @click="onExpandChange(type)">
        <div class="type-title-wrap">
          <i class="el-icon-s-grid"></i>
          <div class="title">
            {{ type.title }}
          </div>
          <i class="el-icon-arrow-down" :style="`transform:rotate(${type.show ? 0 : -90}deg);`" style="
              transform-origin: center;
              transition: transform 0.35s ease-in-out;
            "></i>
        </div>
      </div>
      <el-collapse-transition>
        <draggable v-show="type.show" class="components-draggable" :list="type.list" item-key="tag" :group="{ name: 'componentsGroup', pull: 'clone', put: false }" draggable=".components-item" :sort="false" :clone="cloneComponent" @end="onEnd">
          <template #item="{ element }">
            <div class="components-item" @click.stop="addComponent(element)">
              <div class="components-body">
                <i :class="
                    element.__config__.icon.indexOf('el-') > -1
                      ? [`${element.__config__.icon}`]
                      : ['opfont', `opicon-${element.__config__.icon}`]
                  "></i>
                {{ element.__form__.label }}
              </div>
            </div>
          </template>
        </draggable>
      </el-collapse-transition>
    </template>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from 'vuex';
import draggable from 'vuedraggable';
import { useDesign, useActiveDesignComponent } from '@/hooks/use-design';
import { deepClone } from '@/shared/utils/utils';
import { DesignComponent } from '@/components/designComponent';
import { defaultComponentList } from '@/config/component/config';

type ComponentMenu = {
  name: string;
  title: string;
  list: DesignComponent[];
  show: boolean;
};

export default defineComponent({
  components: { draggable },
  setup() {
    const store = useStore();
    const state = reactive<{ componentList: ComponentMenu[] }>({
      componentList: [
        {
          name: 'baseComponents',
          title: '基础组件',
          list: [],
          show: true,
        },
        {
          name: 'customComponents',
          title: '业务组件',
          list: [],
          show: true,
        },
        {
          name: 'LayoutComponents',
          title: '布局组件',
          list: [],
          show: true,
        },
      ],
    });

    let tempActiveData: DesignComponent;
    // 当前设计组件
    const { currentComponentList } = useDesign();
    // 激活组件use
    const { activeComponentAndPush } = useActiveDesignComponent(
      currentComponentList
    );

    function initComponentList() {
      initBasicsComponent();
      initLayoutComponent();
      initTradeComponent();
    }

    function initBasicsComponent() {
      const basicsModules: any = import.meta.glob(
        './../../designComponent/basics/*/config.ts'
      );
      loadComponent(basicsModules).then((res: any) => {
        state.componentList[0].list = res;
      });
    }

    function initLayoutComponent() {
      const layoutModules: any = import.meta.glob(
        './../../designComponent/layout/*/config.ts'
      );
      loadComponent(layoutModules).then((res: any) => {
        state.componentList[2].list = res;
      });
    }

    function initTradeComponent() {
      const tradeModules: any = import.meta.glob(
        './../../designComponent/trade/*/config.ts'
      );
      loadComponent(tradeModules).then((res: any) => {
        state.componentList[1].list = res;
      });
    }

    /**
     * 加载组件
     */
    async function loadComponent(modules: any) {
      const promiseModules: any = [];
      for (const path in modules) {
        promiseModules.push(modules[path]());
      }
      const res = await Promise.all(promiseModules);
      const componentList: any[] = [];
      res.forEach((r: any) => {
        r.defaultConfig &&
          componentList.push(r.defaultConfig.config || r.defaultConfig);
      });
      const resultComponent: any[] = [];
      // 排序
      for (let i = 0; i < defaultComponentList.length; i++) {
        const config = componentList.find(
          (f) => f.componentTag === defaultComponentList[i].tag
        );
        config && resultComponent.push(config);
      }
      if (resultComponent.length === 0) {
        resultComponent.push(...componentList);
      }
      return new Promise((resolve) => {
        resolve(resultComponent);
      });
    }

    // 点击组件给设计界面添加组件
    const addComponent = (item: any): void => {
      cloneComponent(item);
      activeComponentAndPush(tempActiveData);
    };
    // 拖拽结束
    const onEnd = (e) => {
      if (e.from !== e.to) {
        activeComponentAndPush(tempActiveData);
      }
    };

    // 复制组件
    const cloneComponent = (orgItem: any) => {
      const clone = deepClone(orgItem);
      const config = clone.__config__;
      createIdAndKey(clone);
      clone.placeholder !== undefined && (clone.placeholder += config.label);
      tempActiveData = clone;
    };

    // 列表展开事件
    function onExpandChange(type: ComponentMenu) {
      type.show = !type.show;
      // type.show &&
      //   state.componentList.forEach((component) => {
      //     component.name !== type.name && (component.show = false);
      //   });
    }

    // 设置组件ID
    function createIdAndKey(item) {
      const config = item.__config__;
      const timeStamp = +new Date();
      item.componentId = timeStamp;
      item.__vModel__ = `field${timeStamp}`;
      config.isModel === false && (item.children = []);
      if (Array.isArray(config.children)) {
        config.children = config.children.map((childItem) =>
          createIdAndKey(childItem)
        );
      }
      store.commit('design/setActiveComponent', item);
      return item;
    }

    initComponentList();

    return {
      state,
      addComponent,
      onEnd,
      cloneComponent,
      onExpandChange,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/modules/design/componentlist.scss';
</style>
