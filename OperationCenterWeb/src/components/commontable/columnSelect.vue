<!--显示列设置-->
<template>
  <el-dialog title="显示列设置" v-model="visible" :append-to-body="true" width="650px" :before-close="beforeClose" @open="openDialog">
    <template v-slot:title >
            <DialogTitle dialogTitle="显示列设置"></DialogTitle>
      </template>

    <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入列名" :titles="['显示列', '隐藏列']" v-model="state.value" :props="state.dataProps" :data="state.transferData"></el-transfer>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onSoveHandler">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { messageAlert } from '@/utils/utils';
import DialogTitle from '@/components/dialogTitle/index.vue';
declare type colItem = {
  label: string;
};

const props = defineProps({
  visible: Boolean,
  colArray: Array,
  colShowList: Array,
});

const state = reactive({
  dataProps: {
    key: 'prop',
    label: 'label',
  },
  transferData: props.colArray, //所有列
  value: props.colShowList, //隐藏列的key数组
});

const emit = defineEmits(['update:visible', 'setColumn']);

const openDialog = () => {};

const beforeClose = () => {
  emit('update:visible', false);
};

// 筛选
const filterMethod = (query: string, item: colItem): boolean => {
  return item.label.indexOf(query) > -1;
};

const onSoveHandler = (): void => {
  const newCol = state.transferData?.filter(
    (item) => !state.value?.includes(item.prop)
  );
  if (!newCol || newCol.length === 0) {
    messageAlert('error', '不能设置空列！');
    return;
  }
  const hiddenCol = state.transferData?.filter((item) =>
    state.value?.includes(item.prop)
  );
  emit('setColumn', { showCol: newCol, hiddenCol: hiddenCol }); //返回新的列
};
</script>
