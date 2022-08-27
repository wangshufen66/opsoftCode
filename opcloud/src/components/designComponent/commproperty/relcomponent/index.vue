<!-- 组件属性配置 — 关联组件设置 -->
<template>
  <template v-if="componentCfg.__config__.relComponent">
    <div class="divider-wrap">联动设置</div>
    <el-form-item label="关联组件">
      <el-select v-model="componentCfg.__config__.relComponent.componentId" filterable clearable>
        <el-option
          v-for="item in relModelList"
          :key="item.componentId"
          :value="item.componentId"
          :label="item.__form__?.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- 关联组件是开窗组件，需要设置关联字段 -->
    <template v-if="relComponentTag === 'designDialogSelect'">
      <el-form-item label="关联字段">
        <el-select v-model="componentCfg.__config__.relComponent.field" filterable clearable>
          <el-option
            v-for="item in currentRelComponentFields"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
    <!-- 下拉组件 -->
    <template v-if="['designSelect', 'designDialogSelect'].includes(componentCfg.componentTag)">
      <el-form-item>
        <template #label>
          联动字段
          <el-tooltip placement="bottom">
            <template #content>
              1.可选当前组件对应外键表的字段；
              <br />
              <br />2.不设置则默认当前组件的值；
            </template>
            <i class="header-icon el-icon-info"></i>
          </el-tooltip>
        </template>
        <!-- 下拉组件 -->
        <template v-if="componentCfg.componentTag === 'designSelect'">
          <el-select v-model="componentCfg.__config__.relComponent.relField" filterable clearable>
            <el-option
              v-for="item in selectComponentFields"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </template>
        <!-- 开窗组件 -->
        <template v-else-if="componentCfg.componentTag === 'designDialogSelect'">
          <el-select
            v-model="componentCfg.__config__.relComponent.relField"
            filterable
            clearable
            placeholder="选择回显文本字段"
          >
            <el-option
              v-for="item in componentCfg.columnModel"
              :key="item.prop"
              :value="item.prop"
              :label="item.label"
            ></el-option>
          </el-select>
        </template>
      </el-form-item>
    </template>
    <el-form-item>
      <template #label>
        绝对联动
        <el-tooltip placement="bottom">
          <template #content>
            1.绝对联动：如果联动组件值不存在，则当前组件值也不存在；
            <br />
            <br />2.非绝对联动：如果联动组件值不存在，当前组件也可以设置自身数据源数据；
          </template>
          <i class="header-icon el-icon-info"></i>
        </el-tooltip>
      </template>
      <el-switch v-model="componentCfg.__config__.relComponent.isAbsolute" />
    </el-form-item>
  </template>
</template>

<script lang="ts">
import { useDesign } from '@/hooks/use-design';
import { computed, inject, ref, watch } from 'vue';

export default {
  name: 'PropertyRelComponent',
  props: {
    componentCfg: Object,
  },
  setup(props) {

    const foreignTableFields = inject('foreignTableFields', [] as any)

    const { currentComponentList } = useDesign();

    const selectComponentFields = computed(() => {
      return foreignTableFields && foreignTableFields.value
    });

    // 关联组件选择列表
    const relModelList = computed(() => {
      return currentComponentList.value.filter(f => f.componentId !== props.componentCfg.componentId)
    });

    // 当前组件关联的组件
    const currentRelComponent = computed(() => {
      return currentComponentList.value.find(
        f => f.componentId === props.componentCfg.__config__.relComponent.componentId)
    })

    // 关联组件的类型
    const relComponentTag = computed(() => {
      return currentRelComponent.value?.componentTag
    })
    // 当前组件关联组件的数据源字段，针对开窗组件
    const currentRelComponentFields = computed(() => {
      const component = currentRelComponent.value
      if (
        component && component.columnModel &&
        component.columnModel.length > 0
      ) {
        return component.columnModel.map((m) => {
          return {
            value: m.prop,
            label: m.label,
          };
        });
      }
      return undefined
    })
    // 监听外键表的变化，获取外键表的字段
    watch(
      () => foreignTableFields,
      (value) => {
        if (value) {
          
        }
      })

    return {
      relModelList,
      currentRelComponent,
      relComponentTag,
      currentRelComponentFields,
      selectComponentFields,
      foreignTableFields
    };
  },
};
</script>
