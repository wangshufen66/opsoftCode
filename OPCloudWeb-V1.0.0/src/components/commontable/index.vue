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
        <template v-if="item.isFile">
          <el-table-column v-bind="item">
            <template #default="scope">
              <template v-if="isImage(item.prop) && scope.row[item.prop]">
                <text-button @click="onPreviewPicture(scope.row[item.prop])">查看图片</text-button>
              </template>
              <template v-else-if="isFile(item.prop) && scope.row[item.prop]">
                <text-button @click="downLoadFiles(scope.row[item.prop])">下载文件</text-button>
              </template>
              <template v-else>
                <text-button disabled>--</text-button>
              </template>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.isHtml">
          <el-table-column v-bind="item">
            <template #default="scope">
              <div v-html="scope.row[item.prop]"></div>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.isProgress">
          <el-table-column v-bind="item" width="700">
            <template #default="scope">
              <el-progress
                style="margin-right: 30px"
                :text-inside="true"
                :stroke-width="20"
                :percentage="scope.row[item.prop]"
                :status="
                  scope.row[item.prop] <= 50
                    ? 'exception'
                    : scope.row[item.prop] > 50 && scope.row[item.prop] <= 70
                      ? 'warning'
                      : 'success'
                "
              ></el-progress>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.isProcess">
          <el-table-column v-bind="item">
            <template #default="scope">
              <component
                :is="componentList?.get(item.prop).componentTag"
                :component="item.componentOption"
                :model="scope.row.progressData"
              ></component>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column v-if="item.init" v-bind="item">
            <template #default="scope">
              <slot :name="`col_${item.prop}`" :data="scope.row">
                <template
                  v-if="
                    scope.row[item.prop] &&
                    typeof scope.row[item.prop] === 'object'
                  "
                >
                  <template
                    v-if="!rowHasPenetrate(item.prop)"
                  >{{ scope.row[item.prop].disPlayedValue }}</template>
                  <template v-else>
                    <span
                      class="has-more"
                      @click="columnItemClick(scope.row, item.prop)"
                    >{{ scope.row[item.prop].disPlayedValue }}</span>
                  </template>
                </template>
                <template v-else>
                  <template v-if="!rowHasPenetrate(item.prop)">{{ scope.row[item.prop] }}</template>
                  <template v-else>
                    <span
                      class="has-more"
                      @click="columnItemClick(scope.row, item.prop)"
                    >{{ scope.row[item.prop] }}</span>
                  </template>
                </template>
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
    <el-popover placement="bottom" title="列显示设置" trigger="click">
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
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from "vue";
import useFile from "@/use/useFile";
import useTable from "./useTable";
import useProps from './useProps';
import useProvies from './useProvies'

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

const { columnItemClick, rowHasPenetrate, isImage, isFile, componentList } = useProvies();

const { downLoadFiles } = useFile();

const tableRef = ref(null);

const imageViewerRef = ref(null);

tableAttribute.value = { ...defalutTableAttr, ...props.options };

/**显示列设置-全选 */
const checkAllColumns = ref<boolean>(true);
/**显示列设置-全选状态 */
const isIndeterminate = ref<boolean>(false);
/**列设置-选中列 */
const checkColumnProp = ref<Array<string | undefined>>([]);

defineExpose({
  tableRef
})

watch(
  () => props.tableColums,
  () => {
    columnConfig.showColumn = props.tableColums;
    checkColumnProp.value = columnConfig.showColumn.map((m) => m.prop);
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

/**
 * 设置表格列
 */
function setTableColumn(setting): void {
  columnConfig.showColumn = setting.showCol;
  columnConfig.hiddenColumn = setting.hiddenCol;
  colSetDialogOption.value = false;
}

/**
 * 图片视图
 */
function onPreviewPicture(files: any[]) {
  if (!files) return;
  imageViewer.show = true;
  imageViewer.filePathList = files.map((m) => m.url);
}

/**显示列全选 */
function onCheckAllColumnChange(e: boolean) {
  if (e) {
    columnConfig.showColumn = props.tableColums as any[];
    checkColumnProp.value = columnConfig.showColumn.map((m) => m.prop);
  } else {
    checkColumnProp.value = [];
    columnConfig.showColumn = [];
  }
}

/**显示列设置-列显示/隐藏切换 */
function onCheckedColumnChange(colProps: Array<string>) {
  columnConfig.showColumn = <any>props.tableColums.filter((f: any) => colProps.includes(f.prop));
  const checkedCount = colProps.length;
  checkAllColumns.value = checkedCount === props.tableColums.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.tableColums.length;
}

onMounted((): void => {
  nextTick(() => {
    columnConfig.showColumn = props.tableColums as any[];
    checkColumnProp.value = columnConfig.showColumn.map((m) => m.prop);
  })
})
</script>

<style lang="scss">
@import "@/styles/components/table-extend.scss";
</style>
