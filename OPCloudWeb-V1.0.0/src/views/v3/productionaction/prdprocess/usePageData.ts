import { reactive, computed } from "vue";

export default function usePageData(props) {
  const tableOption = reactive({
    tableData: [],
    tableColums: [
      {
        label: "不良原因代码",
        prop: "badReasonNbr",
        minWidth: 100,
      },
      {
        label: "不良原因名称",
        prop: "badReasonName",
        minWidth: 100,
      },
      {
        label: "不良数量",
        prop: "badReasonQty",
        minWidth: 100,
      },
    ],
    selectionCol: false,
    paging: false,
    total: 0,
    tableLoading: false,
    noTableRight: false,
  });

  let pageData = props.param.entity?.processId
    ? reactive({
        formData: {
          ...props.param.entity,
          reportTime: new Date(),
          startId: computed(() => props.param.entity.id),
          employeeName: "",
          shiftGroupName: "",
          shiftSliceName: "",
          qualifiedQty: "",
          reportQty: "",
          unqualifiedQty: "",
          reportBadReasonList: [],
          machiningUnitId: "",
          alRdyQualifiedQty: "",
        },
      })
    : reactive({
        formData: {
          ...props.param.entity,
          reportTime: new Date(),
          processId: computed(() => props.param.entity.id),
          employeeName: "",
          shiftGroupName: "",
          shiftSliceName: "",
          qualifiedQty: "",
          reportQty: "",
          unqualifiedQty: "",
          reportBadReasonList: [],
          machiningUnitId: "",
          alRdyQualifiedQty: "",
        },
      });

  pageData.formData.unqualifiedQty = computed(() => {
    if (tableOption.tableData.length > 0) {
      return tableOption.tableData.reduce(
        (total, cur) => total + parseInt(cur.badReasonQty),
        0
      );
    }
  });

  pageData.formData.qualifiedQty = computed(() => {
    if (pageData.formData.reportQty && pageData.formData.unqualifiedQty) {
      return pageData.formData.reportQty - pageData.formData.unqualifiedQty;
    }
  });

  pageData.formData.reportBadReasonList = computed(() => {
    return tableOption.tableData;
  });

  function initData(obj, ...key) {
    key.forEach((i) => delete obj[i]);
  }
  initData(pageData.formData, "id", "couldStartQty");
  return {
    tableOption,
    pageData,
  };
}
