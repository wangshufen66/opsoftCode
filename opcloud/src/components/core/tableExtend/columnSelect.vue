<!--显示列设置-->
<template>
  <el-popover placement="bottom" title="列显示设置" :width="200" trigger="click">
    <template #reference>
      <i class="btn-col-setting el-icon-setting"></i>
    </template>
    <div class="set-column-list-wrap">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAllColumns"
        @change="onCheckAllColumnChange"
      >全选</el-checkbox>
      <el-checkbox-group
        class="set-column-check-group"
        v-model="checkColumnProp"
        @change="onCheckedColumnChange"
      >
        <el-checkbox
          class="set-column-check"
          v-for="colum in tableColums"
          :label="colum.prop"
          :key="colum.prop"
        >{{ colum.label }}</el-checkbox>
      </el-checkbox-group>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import useTable from "./useTable";

const props = defineProps({
  tableColums: Array
})

/**显示列设置-全选 */
const checkAllColumns = ref<boolean>(true);
/**显示列设置-全选状态 */
const isIndeterminate = ref<boolean>(false);

const checkColumnProp = ref<Array<string | undefined>>([]);

const { columnConfig } = useTable();


function onCheckAllColumnChange(e: boolean) {
  if (e) {
    columnConfig.showColumn = props.tableColums as any[]
    checkColumnProp.value = columnConfig.showColumn.map(m => m.prop)
  } else {
    checkColumnProp.value = []
    columnConfig.showColumn = []
  }
}

function onCheckedColumnChange(colProps: Array<string>) {
  if (props.tableColums) {
    columnConfig.showColumn = props.tableColums.filter(f => colProps.includes(f.prop)) as any;
    const checkedCount = colProps.length;
    checkAllColumns.value = checkedCount === props.tableColums.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < props.tableColums.length;
  }
}

onMounted(() => {
  nextTick(() => {
    checkColumnProp.value = columnConfig.showColumn.map(m => m.prop)
  })
})

</script>
