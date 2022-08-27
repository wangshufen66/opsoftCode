import { reactive, ref, onMounted, nextTick } from "vue";

export default function useTabTableHook(param) {
  const {
    _tableColums,
    _getTableList,
    _searchForm = {},
    _sortChange,
    _sortMap,
    _masterForm,
  } = param;

  const searchForm = reactive(_searchForm);

  const searchCount = ref(1);

  const loadTableData = () => {
    tableOption.tableLoading = true;
    let param = {
      ...searchForm,
      current_page: tableOption.pager.current,
      page_size: tableOption.pager.size,
      ..._masterForm,

      // current_page: tableOption.pager.current,
      // page_size: tableOption.pager.size,
    };
    _getTableList(param).then((res: any) => {
      searchCount.value = searchCount.value + 1;
      if (param["mock_num"] == 2) {
        res = {
          code: 200,
          msg: "操作成功",
          data: {
            total: 2,
            list: [
              {
                supplyName: "苏州中外贸有限公司",
                supplyCode: "SZZWM",
              },
              {
                supplyName: "上海海关总公司",
                supplyCode: "SHHG",
              },
            ],
          },
        };
      } else {
      }

      if (res.code == 200) {
        tableOption.tableData =
          res.data["records"] || res.data["list"] || res.data;
        tableOption.total = res.data.total;
      }
      tableOption.tableLoading = false;
    });
  };

  const tableOption = reactive({
    tableData: [],
    tableColums: _tableColums,
    selectionCol: true,
    paging: true,
    total: 0,
    tableLoading: false,
    noTableRight: false,
    pager: {
      current: 1,
      size: 15,
    },
  });
  ` `;
  const tableGatherFunc = {
    pageSizeChange: (option) => {
      tableOption.pager.size = option.pageSize;
      loadTableData();
    },
    currentChange: (option) => {
      tableOption.pager.current = option.pageIndex;
      loadTableData();
    },
    reLoadTableData: () => {
      tableOption.pager.current = 1;
      loadTableData();
    },
    loadTableData: loadTableData,
  };

  const multipleSelection = ref([]);

  return {
    tableOption,
    tableGatherFunc,
    searchForm,
    searchCount,
    multipleSelection,
  };
}
