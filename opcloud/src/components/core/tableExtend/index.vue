<template>
  <div class="table-extend">
    <el-table
      ref="tableRef"
      v-bind="tableAttribute"
      row-key="id"
      :data="tableData"
      v-loading="tableLoading"
      height="100%"
      @sort-change="tableSort"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @row-dblclick="rowDblClick"
    >
      <el-table-column v-if="selectionCol" type="selection" width="48"></el-table-column>
      <el-table-column v-if="indexCol" class="table-index" type="index" width="58"></el-table-column>
      <template v-for="item in colSettingList" :key="item.prop">
        <el-table-column v-if="isUpload(item.prop)" v-bind="item">
          <template #default="scope">
            <file-col v-bind="{ row: scope.row, colCfg: item }"></file-col>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.isHtml" v-bind="item">
          <template #default="scope">
            <div v-html="item.prop && scope.row[item.prop]"></div>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.isProgress" v-bind="item" width="700">
          <template #default="scope">
            <progress-col v-bind="{ row: scope.row, colCfg: item }"></progress-col>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.isProcess" v-bind="item">
          <template #default="scope">
            <component
              :is="componentList?.get(item.prop).componentTag"
              :component="item.componentOption"
              :model="scope.row.progressData"
            ></component>
          </template>
        </el-table-column>
        <template v-else>
          <el-table-column v-if="item.init" v-bind="item">
            <template #default="scope">
              <slot :name="`col_${item.prop}`" :data="scope.row">
                <value-col v-bind="{ row: scope.row, colCfg: item }"></value-col>
              </slot>
            </template>
          </el-table-column>
        </template>
      </template>
      <slot name="operatColumn"></slot>
      <!-- 空 -->
      <template #empty>
        <el-empty :image-size="60"></el-empty>
      </template>
    </el-table>
    <el-pagination
      v-if="paging"
      background
      @size-change="pageSizeChange"
      @current-change="currentChange"
      :current-page="pagination.pageIndex"
      :page-sizes="sizeList"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-image-viewer
      v-if="hasImageViewer"
      ref="imageViewerRef"
      v-show="imageViewer.show"
      :url-list="imageViewer.filePathList"
      :initial-index="imageViewer.index"
      hide-on-click-modal
      @close="imageViewer.show = false"
    ></el-image-viewer>
    <col-visible-setting></col-visible-setting>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch, provide, toRef } from "vue";
import useFile from "@/hooks/use-file";
import useTable from "./useTable";
import type { TableProvies } from "./type";
import useProps from './useProps';
import useProvies from './useProvies'
import FileCol from './fileCol.vue';
import ProgressCol from './progressCol.vue';
import ValueCol from './valueCol.vue';
import ColVisibleSetting from './colVisible.vue';

const props = defineProps(useProps());

const emit = defineEmits([
  "tableSort",
  "handleSelectionChange",
  "currentChange",
  "pageSizeChange",
  "rowClick",
  "rowDblClick"
]);

const {
  defalutTableAttr,
  selectionOptions,
  tableAttribute,
  colSetDialogOption,
  pagination,
  imageViewer,
  columnConfig,
  colSettingList,
  hasImageViewer,
} = useTable();

provide<TableProvies>("table-props", {
  imageViewer,
  tableColums: toRef(props, "tableColums"),
  columnConfig,
});

const { isUpload, isImage, isFile, componentList } = useProvies();

const tableRef = ref(null);

const imageViewerRef = ref(null);

tableAttribute.value = { ...defalutTableAttr, ...props.options };

defineExpose({
  tableRef,
  gotoPage,
})

watch(
  () => props.tableColums,
  () => {
    columnConfig.showColumn = props.tableColums;
  }
)

/**
 * 排序
 */
function tableSort(column: any) {
  emit("tableSort", {
    sortName: column.prop,
    sortType:
      column.order === "descending"
        ? "desc"
        : column.order === "ascending"
          ? "asc"
          : "",
  });
}

/**
 * 行勾选事件
 */
function handleSelectionChange(rows) {
  selectionOptions.rows = rows;
  selectionOptions.count = rows && rows.length;
  emit("handleSelectionChange", rows);
}

/**
 * 行点击事件
 */
function rowClick(rows) {
  emit("rowClick", rows);
}

/**
 * 双击事件
 */
function rowDblClick(rows) {
  emit('rowDblClick', rows);
}

/**
 * 当前页改变
 */
function currentChange(current: number): void {
  if (!current) return;
  pagination.pageIndex = current;
  emit("currentChange", pagination);
}

/**
 * 页面大小改变
 */
function pageSizeChange(pagesize: number): void {
  if (!pagesize) return;
  pagination.pageIndex = 1;
  pagination.pageSize = pagesize;
  emit("pageSizeChange", pagination);
}

function gotoPage(pageindex: number = 1, pagesize: number) {
  pagination.pageIndex = pageindex;
  pagesize && (pagination.pageSize = pagesize)
}

/**
 * 设置表格列
 */
function setTableColumn(setting): void {
  columnConfig.showColumn = setting.showCol;
  columnConfig.hiddenColumn = setting.hiddenCol;
  colSetDialogOption.value = false;
}

onMounted((): void => {
  nextTick(() => {
    props.tableColums && props.tableColums.length > 0 && (columnConfig.showColumn = props.tableColums);
  })
})
</script>

<style lang="scss">
@import "./styles/table-extend.scss";
</style>
