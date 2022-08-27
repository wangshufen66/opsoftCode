<template>
  <id-bar-query-table-dia-form
    tableErrTip="信息点绑定"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    :tableDetailForm="tableDetailForm"
    form-label-width="100px"
    id-query-form-label-width="90px"
    :getTable="getTable"
    :getDetail="getDetail"
    :addDetail="addDetail"
    :updateDetail="updateDetail"
    :deleteTable="deleteTable"
    @afterGetTablePage="afterGetTablePage"
    @editTableDetail="editTableDetail"
    @initTableDetail="initTableDetail"
  >
  </id-bar-query-table-dia-form>
</template>

<script>
  import IdButtonConfig from "@/components/id-button/IdButtonConfig";
  import IdBarQueryTableDiaForm from "@/components/id-pages/IdBarQueryTableDiaForm";
  import {getList, getDetail, add, batchDel, update} from "@/api/iot-hub/infoPoint";
  import {unitInputPopupColumns} from "../tableColumns/unitTableColumns";
  import {getList as getUnitList, getGroupList as getUnitGroupList} from "@/api/basicData/unit";
  import infoPointTableColumns from "../tableColumns/infoPointTableColumns";

  export default {
    name: "infoPoint",
    components: {
      IdBarQueryTableDiaForm,
    },
    computed: {
      getTable() {
        return getList;
      },
      getDetail() {
        return getDetail;
      },
      updateDetail() {
        return update;
      },
      addDetail() {
        return add;
      },
      deleteTable() {
        return batchDel;
      },
    },
    data() {
      return {
        //操作栏
        actionBarConfig: [
          new IdButtonConfig("button-add", "添加", "add", {type: "primary"}),
          new IdButtonConfig("button-delete", "删除", "delete", {styleOne: true}),
          new IdButtonConfig("button-fresh", "刷新", "fresh", {
            styleTwo: true,
            beforeIf: true,
            beforeClass: "el-icon-refresh-right",
          }),
        ],
        //列
        tableColumns: infoPointTableColumns,
        //弹窗内form
        tableDetailForm: {
          data: {
            id: "",
            number: "",
            name: "",
            unitId: "",
            unitNumber: "",
            unitName: "",
            type: "",
            mark: "",
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            number: [{required: true, message: "信息点代码不能为空", trigger: "blur"}],
            name: [{required: true, message: "信息点名称不能为空", trigger: "blur"}],
            unitName: [{required: true, message: "信息点单位不能为空", trigger: "change"}],
          },
          component: [
            {
              classKey: "number",
              label: "信息点代码",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "name",
              label: "信息点名称",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "unitName",
              label: "信息点单位",
              tag: "id-input-popup",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getUnitList,
              getTreeList: getUnitGroupList,
              id: "",
              number: "",
              name: "",
              controlTooltipShow: true,
              tableColumns: unitInputPopupColumns,
              diaTitle: "计量单位",
              event: {},
            },
            {
              classKey: "type",
              label: "显示类型",
              tag: "id-select",
              placeholder: "请选择",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              options: [
                {
                  label: "瞬时值",
                  value: "0",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: "区间值",
                  value: "1",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                }
              ]
            },
            {
              classKey: "mark",
              label: "备注",
              tag: "el-input",
              placeholder: "请输入",
              type: "textarea",
              rows: 2, //需要人员自己调整
              gridRowStart: 2,
              gridColumnStart: 1,
              maxlength: 250,
              showWordLimit: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
          ],
        },
      };
    },
    created() {
      let that = this;
      this.tableDetailForm.component[2].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.tableDetailForm.component[2].event.afterGetTablePage = function (tableData) {
        tableData.forEach((tItem) => {
          tItem.isBaseUnit = tItem.isBaseUnit ? '是' : '否';
        });
      };
      this.tableDetailForm.component[2].event.confirm = function (row) {
        that.tableDetailForm.data.unitId = row.id;
        that.tableDetailForm.data.unitNumber = row.number;
        that.tableDetailForm.data.unitName = row.name;
        that.tableDetailForm.component[2].id = row.id;
        that.tableDetailForm.component[2].number = row.number;
        that.tableDetailForm.component[2].name = row.name;
      };
    },
    methods: {
      afterGetTablePage(data) {
        const options = ["瞬时值", "区间值"];
        data.forEach((dItem) => {
          dItem.type = options[dItem.type];
        });
      },
      editTableDetail(data) {
        this.tableDetailForm.data = {...data};
        this.tableDetailForm.data.type = String(this.tableDetailForm.data.type);
        this.tableDetailForm.component[2].id = this.tableDetailForm.data.unitId;
        this.tableDetailForm.component[2].number = this.tableDetailForm.data.unitNumber;
        this.tableDetailForm.component[2].name = this.tableDetailForm.data.unitName;
      },
      initTableDetail() {
        this.tableDetailForm.data = {
          id: "",
          number: "",
          name: "",
          unitId: "",
          unitNumber: "",
          unitName: "",
          type: "",
          mark: "",
          orgId: this.$store.state.user.userInfo.orgId,
        };
        this.tableDetailForm.component[2].controlTooltipShow = false;
        this.tableDetailForm.component[2].id = this.tableDetailForm.data.unitId;
        this.tableDetailForm.component[2].number = this.tableDetailForm.data.unitNumber;
        this.tableDetailForm.component[2].name = this.tableDetailForm.data.unitName;
        this.$nextTick(() => {
          this.tableDetailForm.component[2].controlTooltipShow = true;
        });
      },
    },
  }
</script>
