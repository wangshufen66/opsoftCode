<template>
  <div class="fixedDialog">
    <el-dialog :model-value="visible" title="表格列设置" width="1000px" destroy-on-close @close="onClose">
      <template v-slot:title >
            <DialogTitle dialogTitle="表格列设置"></DialogTitle>
      </template>

      <div class="title">请勾选要显示的列</div>
      <el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <draggable class="column-list" :list="columnSetting" item-key="componentId" group="componentsGroup" :sort="true" :animation="400">
        <template #item="{ element }">
          <el-checkbox class="check-item" :label="element.prop" v-model="element.check" @change="onCheckChange">
            <div class="column-item-wrap">
              <div class="column-item">
                <label>显示名称</label>
                <el-input v-model="element.label" placeholder="请设置列显示名称"></el-input>
              </div>
              <div class="column-item">
                <label>宽度</label>
                <el-input v-model="element.width" placeholder="请设置列显示宽度"></el-input>
              </div>
              <div class="column-item">
                <label>表格搜索</label>
                <el-select class="search" v-model="element.insearh">
                  <el-option :value="1" label="是"></el-option>
                  <el-option :value="0" label="否"></el-option>
                </el-select>
              </div>
              <div class="column-item">
                <label>表格排序</label>
                <el-select class="search" v-model="element.sortable">
                  <el-option :value="true" label="是"></el-option>
                  <el-option :value="false" label="否"></el-option>
                </el-select>
              </div>
            </div>
          </el-checkbox>
        </template>
      </draggable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onClose">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, PropType, ref, watch } from 'vue';
import { ITableColunmSetting } from '@/interfaces/ITableConfig';
import draggable from 'vuedraggable';
import DialogTitle from '@/components/dialogTitle/index.vue';
export default {
  props: {
    /**是否显示 */
    visible: Boolean,
    // 所有的数据列
    columnSetting: Array as PropType<ITableColunmSetting[]>,
  },
  components: { draggable,DialogTitle },
  emits: ['update:visible', 'onSubmit'],
  setup(props, { emit }) {
    const checkAll = ref<boolean>(false);
    const isIndeterminate = ref<boolean>(true);

    watch(
      () => props.visible,
      (value) => {
        if (value) {
          init();
        }
      }
    );

    /**
     * 全选
     */
    function handleCheckAllChange(val: boolean) {
      props.columnSetting?.map((m) => {
        m.check = val;
      });
      isIndeterminate.value = false;
    }
    /**
     * checkbox change
     */
    function onCheckChange() {
      const columnLen = props.columnSetting?.length || 0;
      const checkCount =
        props.columnSetting?.filter((f) => f.check === true).length || 0;
      checkAll.value = checkCount === columnLen;
      isIndeterminate.value = checkCount > 0 && checkCount < columnLen;
    }

    // 关闭
    function onClose() {
      emit('update:visible', false);
    }

    // 提交
    function onSubmit() {
      onClose();
    }

    function init() {
      onCheckChange();
    }

    return {
      checkAll,
      isIndeterminate,
      onClose,
      onSubmit,
      handleCheckAllChange,
      onCheckChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: #f56c6c;
  margin-bottom: 20px;
}
.column-list {
  display: flex;
  flex-direction: column;
  .column-item-wrap {
    display: flex;
    align-items: center;
  }
  .column-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    &:nth-child(2) {
      width: 150px;
    }
    & > label {
      margin-right: 8px;
    }
    .search {
      width: 100px;
    }
  }
}
.check-item {
  padding: 8px 10px;
  border-bottom: 1px solid #f7f7f7 !important;
  &:last-child {
    border-bottom: none;
  }
}
.check-all {
  padding: 8px 10px;
}
</style>
