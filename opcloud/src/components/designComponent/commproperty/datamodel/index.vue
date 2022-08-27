<template>
  <div class="divider-wrap">计算模型</div>
  <div class="setting-item" v-for="(item, index) in componentCfg.__config__.dataModel" :key="item.id">
    <span class="close-btn" @click="deleteModel(index)">
      <i class="el-icon-remove-outline" />
    </span>
    <el-form-item label="选择模型">
      <el-select v-model="item.type" @change="onModelChange">
        <el-option v-for="model in dataModelList" :key="model.id" :value="model.id" :label="model.modelName">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="对应字段">
      <el-select v-model="item.field">
        <el-option v-for="field in getFieldList(item.type)" :key="field.modelKey" :value="field.modelKey" :label="field.remark">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
  <div class="property-additem">
    <el-button class="btn-operate" icon="el-icon-circle-plus-outline" type="text" @click="addModelItem">
      添加模型
    </el-button>
  </div>
</template>

<script lang="ts">
import { useDesign } from '@/hooks/use-design';
import { messageAlert } from '@/shared/utils/utils';

export default {
  name: 'PropertyDataModel',
  props: {
    componentCfg: Object,
  },
  setup(props) {
    const { dataModelList } = useDesign();

    function onModelChange(e: string) {
      // if(props.componentCfg?.__config__.dataModel.length===0){
      //   props.componentCfg?.__form__.regList
      // }
      // 检测当前组件是否已选择该模型
      const has = props.componentCfg?.__config__.dataModel.filter(
        (f) => f.type === e
      );
      if (has.length > 1) {
        return messageAlert('error', '不能设置多个相同的模型');
      }
      if (props.componentCfg?.__config__.dataModel.length > 0) {
        props.componentCfg && (props.componentCfg.__attr__.readonly = true);
      }
    }

    function getFieldList(type: string) {
      const model = dataModelList.value.find((f) => f.id === type);
      return (model && model.infoList) || [];
    }

    function addModelItem() {
      const component = props.componentCfg;
      component?.__config__ &&
        component.__config__.dataModel &&
        component.__config__.dataModel.push({
          id: `${+new Date()}`,
          type: undefined,
          field: undefined,
        });
    }

    function deleteModel(index) {
      const component = props.componentCfg;
      if (component) {
        component.__config__.dataModel.splice(index, 1);
        if (
          component.__config__.dataModel.length === 0 ||
          component.__config__.dataModel.filter((f) => f.type).length === 0
        ) {
          component.__attr__.readonly = false;
        }
      }
    }
    
    function init() {}

    return {
      addModelItem,
      dataModelList,
      getFieldList,
      onModelChange,
      deleteModel,
    };
  },
};
</script>
