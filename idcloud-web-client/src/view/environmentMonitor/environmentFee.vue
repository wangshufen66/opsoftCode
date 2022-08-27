<template>
  <id-bar-query-table-dia-form
    tableErrTip="费用分析"
    :selection="false"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    :tableDetailForm="tableDetailForm"
    form-label-width="80px"
    :getTable="getTable"
    :getDetail="getDetail"
    :addDetail="addDetail"
    :updateDetail="updateDetail"
    :deleteTable="deleteTable"
    @editTableDetail="editTableDetail"
    @initTableDetail="initTableDetail"
  >
  </id-bar-query-table-dia-form>
</template>

<script>
  import IdButtonConfig from "@/components/id-button/IdButtonConfig";
  import {getList,getDetail,add, batchDel, update,switchEffective} from "@/api/environmentMonitor/environmentFee";
  import IdBarQueryTableDiaForm from "@/components/id-pages/IdBarQueryTableDiaForm";
  export default {
    name: "environmentFee",
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
          new IdButtonConfig("button-delete", "删除", "delete", {styleOne:true}),
          new IdButtonConfig("button-fresh", "刷新", "fresh", {
            styleTwo: true,
            beforeIf: true,
            beforeClass: "el-icon-refresh-right",
          }),
        ],
        //列
        tableColumns: [
          {
            tag: "el-table-column",
            label: "#",
            fixed:"left",
            align:"center",
            type:'selection',
            width: 45,
            selectable:function (row, index) {
              return row.deleteable;
            }
          },
          {
            tag: "el-table-column",
            label: "收费类型",
            prop: "name",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "收费单位",
            prop: "unit",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "收费金额",
            prop: "priceUnit",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Number",
          },
          {
            tag: "el-table-column",
            label: "备注",
            prop: "note",
            minWidth: 180,
            resizable: false,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column-switch",
            label: "是否启用",
            prop: "isEffective",
            align:"center",
            width: 80,
            fixed:'right',
            resizable: false,
            showOverflowTooltip: true,
            setTrueOfFalse:switchEffective,
            comp: "Checkbox",
          },
        ],
        //弹窗内form
        tableDetailForm: {
          data: {
            id: "",
            name: "",
            unit: "",
            priceUnit: 0,
            isEffective: false,
            note: "",
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            name: [
              {required: true, message: "收费类型不能为空", trigger: "blur"},
            ],
          },
          component: [
            {
              classKey: "name",
              label: "收费类型",
              tag: "el-input",
              placeholder: "请输入",
              clearable:true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "unit",
              label: "收费单位",
              tag: "el-input",
              placeholder: "请输入",
              clearable:true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "priceUnit",
              label: "收费金额",
              tag: "el-input-number",
              placeholder: "请输入",
              controlsPosition: "right",
              min: 0,
              max: 10,
              step: 0.01,
              // precision:3,//精度
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "isEffective",
              label: "是否启用",
              tag: "el-checkbox",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "note",
              label: "备注",
              tag: "el-input",
              placeholder: "请输入",
              type: "textarea",
              rows: 3, //需要人员自己调整
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
    methods:{
      editTableDetail(data){
        this.tableDetailForm.data = {...data};
      },
      initTableDetail(){
        this.tableDetailForm.data = {
          id: "",
          name: "",
          unit: "",
          priceUnit: 0,
          isEffective: false,
          note: "",
          orgId: this.$store.state.user.userInfo.orgId,
        };
      },
    },
  }
</script>
