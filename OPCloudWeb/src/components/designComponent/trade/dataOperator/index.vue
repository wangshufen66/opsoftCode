<template>
  <div class="operate-wrap">
    <el-col v-if="component.__attr__.creator" :span="component?.__attr__?.childSpan">
      <el-form-item label="创建人" prop="CREATE_BY">
        <el-input v-model="model['CREATE_BY']" disabled></el-input>
      </el-form-item>
    </el-col>
    <el-col v-if="component.__attr__.createTime" :span="component?.__attr__?.childSpan">
      <el-form-item label="创建时间" prop="OP_CREATE_TIME">
        <el-input v-model="model['OP_CREATE_TIME']" disabled></el-input>
      </el-form-item>
    </el-col>
    <el-col v-if="component.__attr__.updater" :span="component?.__attr__?.childSpan">
      <el-form-item label="更新人" prop="UPDATE_BY">
        <el-input v-model="model['UPDATE_BY']" disabled></el-input>
      </el-form-item>
    </el-col>
    <el-col v-if="component.__attr__.updateTime" :span="component?.__attr__?.childSpan">
      <el-form-item label="更新时间" prop="UPDATE_TIME">
        <el-input v-model="model['UPDATE_TIME']" disabled></el-input>
      </el-form-item>
    </el-col>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { DataOperatorComponent } from './IConfig';

export default {
  name: 'designDataOperator',
  props: {
    component: Object as PropType<DataOperatorComponent>,
    model: Object,
  },
  setup(props) {
    console.log('model', props.model);
  },
};
</script>

<style lang="scss" scoped>
.operate-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
