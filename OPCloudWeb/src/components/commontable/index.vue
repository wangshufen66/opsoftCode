<template>
  <div class="table-extend">
    <el-table
      ref="tableRef"
      v-bind="tableAttribute"
      :data="tableData"
      v-loading="tableLoading"
      element-loading-text="数据加载中…"
      element-loading-background="rgba(0, 0, 0, 0.2)"
      height="100%"
      @sort-change="tableSort"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @row-dblclick="rowDblClick"
    >
      <el-table-column v-if="selectionCol" type="selection" width="48"></el-table-column>
      <el-table-column v-if="indexCol" class="table-index" type="index" width="58"></el-table-column>
      <template v-for="item in colSettingList" :key="item.prop">
        <!-- 附件列 -->
        <template v-if="item.isFile"> 
          <!-- v-if="componentList && componentList.get(item.prop).componentTag === 'designUpload'" -->
          <el-table-column v-bind="item">
            <template #default="scope">
              <template v-if="item.fileType === 1 && scope.row[item.prop]">
                <el-button type="text" @click="onPreviewPicture(scope.row[item.prop])">查看图片</el-button>
              </template>
              <template v-else-if="item.fileType === 2 && scope.row[item.prop]"></template>
              <template v-else-if="item.fileType === 3 && scope.row[item.prop]">
                <el-button type="text" @click="downLoadFiles(scope.row[item.prop])">下载文件</el-button>
              </template>
              <template v-else>
                <el-button type="text" disabled>--</el-button>
              </template>
            </template>
          </el-table-column>
        </template>
        <!-- HTML格式 -->
        <template v-else-if="item.isHtml">
          <el-table-column v-bind="item">
            <template #default="scope">
              <div v-html="scope.row[item.prop]"></div>
            </template>
          </el-table-column>
        </template>
        <!-- 进度条 -->
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
        <!-- 工序进度 -->
        <template v-else-if="item.isProcess">
          <el-table-column v-bind="item">
            <template #default="scope">
              <component
                :is="item.componentOption.componentTag"
                :component="item.componentOption"
                :model="scope.row.progressData"
              ></component>
            </template>
          </el-table-column>
        </template>
        <!-- 普通类型 -->
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
                  <!-- 不含穿透 -->
                  <template
                    v-if="!rowHasPenetrate(item.prop)"
                  >{{ scope.row[item.prop].disPlayedValue }}</template>
                  <!-- 穿透情况 -->
                  <template v-else>
                    <span
                      class="has-more"
                      @click="columnItemClick(scope.row, item.prop)"
                    >{{ scope.row[item.prop].disPlayedValue }}</span>
                  </template>
                </template>
                <template v-else>
                  <!-- 不含穿透 -->
                  <template v-if="!rowHasPenetrate(item.prop)">{{ scope.row[item.prop] }}</template>
                  <!-- 穿透情况 -->
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
    <!-- <column-select v-model:visible="colSetDialogOption" :colArray="tableColums" @setColumn="setTableColumn">
    </column-select>-->
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

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from "vue";
import useFile from "@/use/useFile";
import { useTable, useProps } from "./useTable";
import { useProvies } from './useProvies'


export default defineComponent({
  name: "tableExtend",
  props: useProps(),
  emits: [
    "tableSort",
    "handleSelectionChange",
    "currentChange",
    "pageSizeChange",
    "rowClick",
    "rowDblClick",
  ],
  setup(props, { emit }) {
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

    const { columnItemClick, rowHasPenetrate, componentList } = useProvies();

    const tableRef = ref(null);
    const imageViewerRef = ref(null);

    tableAttribute.value = { ...defalutTableAttr, ...props.options };

    const { downLoadFiles } = useFile();

    /**显示列设置-全选 */
    const checkAllColumns = ref<boolean>(true);
    /**显示列设置-全选状态 */
    const isIndeterminate = ref<boolean>(false);

    const checkColumnProp = ref<Array<string | undefined>>([]);

    watch(
      () => props.tableColums,
      () => {
        columnConfig.showColumn = props.tableColums as never[];
      }
    );
    // 排序方法
    const tableSort = (column: any) => {
      emit("tableSort", {
        sortName: column.prop,
        sortType:
          column.order === "descending"
            ? "desc"
            : column.order === "ascending"
              ? "asc"
              : "",
      });
    };
    // 行勾选事件
    const handleSelectionChange = (rows) => {
      selectionOptions.rows = rows;
      selectionOptions.count = rows && rows.length;
      emit("handleSelectionChange", rows);
    };
    // 行点击事件
    const rowClick = (rows) => {
      emit("rowClick", rows);
    };
    // 双击事件
    const rowDblClick = (rows) => {
      emit('rowDblClick', rows);
    };
    // 当前页改变
    const currentChange = (current: number): void => {
      if (!current) return;
      pagination.pageIndex = current;
      emit("currentChange", pagination);
    };
    // 页面大小改变
    const pageSizeChange = (pagesize: number): void => {
      if (!pagesize) return;
      pagination.pageIndex = 1;
      pagination.pageSize = pagesize;
      emit("pageSizeChange", pagination);
    };
    // 设置表格列
    const setTableColumn = (setting): void => {
      columnConfig.showColumn = setting.showCol;
      columnConfig.hiddenColumn = setting.hiddenCol;
      colSetDialogOption.value = false;
    };
    // 设置显示列
    const setColumnHandler = (): void => {
      colSetDialogOption.value = true;
    };
    // 清空勾选
    const clearSelect = () => {
      selectionOptions.rows = [];
      selectionOptions.count = 0;
      (<any>tableRef.value).clearSelection();
    };

    function onPreviewPicture(files: any[]) {
      if (!files) return;
      imageViewer.show = true;
      imageViewer.filePathList = files.map((m) => m.url);
    }

    function onCheckAllColumnChange(e: boolean) {
      if (e) {
        columnConfig.showColumn = props.tableColums;
        checkColumnProp.value = columnConfig.showColumn.map((m) => m.prop);
      } else {
        checkColumnProp.value = [];
        columnConfig.showColumn = [];
      }
    }

    function onCheckedColumnChange(colProps: Array<string>) {
      columnConfig.showColumn = props.tableColums.filter(f => colProps.includes(f.prop));
      const checkedCount = colProps.length;
      checkAllColumns.value = checkedCount === props.tableColums.length;
      isIndeterminate.value = checkedCount > 0 && checkedCount < props.tableColums.length;
    }

    onMounted((): void => {
      nextTick((): void => {
        columnConfig.showColumn = props.tableColums as any[];
        checkColumnProp.value = columnConfig.showColumn.map((m) => m.prop);
      });
    });

    return {
      imageViewerRef,
      tableRef,
      tableAttribute,
      selectionOptions,
      pagination,
      imageViewer,
      colSetDialogOption,
      colSettingList,
      hasImageViewer,
      checkAllColumns,
      isIndeterminate,
      columnConfig,
      checkColumnProp,
      tableSort,
      handleSelectionChange,
      rowClick,
      rowDblClick,
      currentChange,
      pageSizeChange,
      setTableColumn,
      setColumnHandler,
      clearSelect,
      onPreviewPicture,
      downLoadFiles,
      onCheckAllColumnChange,
      onCheckedColumnChange,
      columnItemClick,
      rowHasPenetrate
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/table-extend.scss";
</style>
