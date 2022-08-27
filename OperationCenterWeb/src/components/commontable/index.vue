<template>
  <div class="table-extend">
    <el-table
      height="100%"
      ref="tableRef"
      v-bind="tableAttribute"
      :data="tableData"
      v-loading="tableLoading"
      element-loading-text="数据加载中…"
      element-loading-background="rgba(0, 0, 0, 0.2)"
      @sort-change="tableSort"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @row-dblclick="rowDbClick"
      :header-cell-style="{ background: '#F5F7FA', color: '#555' }"
    >
      <el-table-column v-if="selectionCol" type="selection" width="48"></el-table-column>
      <el-table-column v-if="indexCol" class="table-index" type="index" width="58"></el-table-column>
      <template v-for="item in colSettingList" :key="item.prop">
        <!-- 附件列 -->
        <template v-if="item.isFile">
          <el-table-column v-bind="item">
            <template #default="scope">
              <template v-if="item.fileType === 1 && scope.row[item.prop]">
                <el-button type="text" @click="onPreviewPicture(scope.row[item.prop])">查看图片</el-button>
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
          <el-table-column v-bind="item">
            <template #default="scope">
              <el-progress
                style="margin-right:30px"
                :text-inside="true"
                :stroke-width="20"
                :percentage="scope.row[item.prop]"
                :status="scope.row[item.prop] <= 50 ? 'exception' : scope.row[item.prop] > 50 && scope.row[item.prop] <= 70 ? 'warning' : 'success'"
              ></el-progress>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column v-if="item.init" v-bind="item">
            <template #default="scope">
              <slot :name="`col_${item.prop}`" :data="scope.row">
                <template
                  v-if="scope.row[item.prop] && typeof scope.row[item.prop] === 'object'"
                >{{ scope.row[item.prop] }}</template>

                <template v-else>{{ scope.row[item.prop] }}</template>
              </slot>
            </template>
          </el-table-column>
        </template>
      </template>
      <!-- <el-table-column class-name="no-right"></el-table-column> -->
      <slot name="operatColumn"></slot>
      <!-- <el-table-column fixed="right" width="40" v-if="isSetColumn">
        <template #header>
          <i class="btn-col-setting el-icon-setting" @click="setColumnHandler"></i>
        </template>
      </el-table-column>-->

      <!-- 空 -->
      <template #empty>
        <el-empty :image-size="100"></el-empty>
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
  </div>
</template>


<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
// import columnSelect from './columnSelect.vue';
import useFile from '@/use/useFile';
import { useTable, useProps } from './useTable';

export default defineComponent({
  name: 'tableExtend',
  props: useProps(),
  emits: [
    'tableSort',
    'handleSelectionChange',
    'currentChange',
    'pageSizeChange',
    'dataDelete',
    'rowClick',
    'rowDbClick'
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

    const tableRef = ref(null);
    const imageViewerRef = ref(null);

    tableAttribute.value = { ...defalutTableAttr, ...props.options };

    const { downLoadFiles } = useFile();

    watch(
      () => props.tableColums,
      (val) => {
        columnConfig.showColumn = props.tableColums as never[];
      }
    );

    // 排序方法
    const tableSort = (column: any) => {
      emit('tableSort', {
        sortName: column.prop,
        sortType:
          column.order === 'descending'
            ? 'desc'
            : column.order === 'ascending'
              ? 'asc'
              : '',
      });
    };
    // 行勾选事件
    const handleSelectionChange = (rows) => {
      selectionOptions.rows = rows;
      selectionOptions.count = rows && rows.length;
      emit('handleSelectionChange', rows);
    };
    // 点击事件
    const rowClick = (rows) => {
      emit('rowClick', rows);
    };
    // 双击事件
    const rowDbClick = (rows) => {
      emit('rowDbClick', rows);
    };
    //批量删除
    const dataDelete = () => {
      emit('dataDelete', selectionOptions.rows);
    };
    // 页面大小改变
    const pageSizeChange = (pagesize: number): void => {
      pagination.pageIndex = 1;
      pagination.pageSize = pagesize;
      emit('pageSizeChange', pagination);
    };
    // 当前页改变
    const currentChange = (current: number): void => {
      pagination.pageIndex = current;
      emit('currentChange', pagination);

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

    onMounted((): void => {
      nextTick((): void => {
        columnConfig.showColumn = props.tableColums as never[];
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
      tableSort,
      handleSelectionChange,
      rowClick,
      rowDbClick,
      dataDelete,
      currentChange,
      pageSizeChange,
      setTableColumn,
      setColumnHandler,
      clearSelect,
      onPreviewPicture,
      downLoadFiles
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/components/table-extend.scss";
</style>
