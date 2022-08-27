<template>
  <id-bar-query-table-dia-form
    tableErrTip="C8302品牌型号库"
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
    @editTableDetail="editTableDetail"
    @initTableDetail="initTableDetail"
  >
  </id-bar-query-table-dia-form>
</template>
<script>
  import IdButtonConfig from "@/components/id-button/IdButtonConfig";
  import IdBarQueryTableDiaForm from "@/components/id-pages/IdBarQueryTableDiaForm";
  import {
    findMoList as getList,
    findMoDetail as getDetail,
    addMo as add,
    deleteMo as batchDel,
    updateMo as update
  } from "@/api/iot-hub/x8302boxBrand";
  import box8302BrandTableColumns from "../tableColumns/box8302BrandTableColumns";

  export default {
    name: "x8302boxBrand",
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
        tableColumns: box8302BrandTableColumns,
        //弹窗内form
        tableDetailForm: {
          data: {
            id: "",
            number:"",//型号代码
            name:"",//型号描述
            di:0,//di
            dio:0,//do
            ip:'',//基站ip
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            number: [{required: true, message: "型号代码不能为空", trigger: ["blur","change"]}],
            name: [{required: true, message: "型号描述不能为空", trigger: ["blur","change"]}],
            di: [{required: true, message: "DI通道数不能为空", trigger: ["blur","change"]}],
            dio: [{required: true, message: "DO通道数不能为空", trigger: ["blur","change"]}],
            ip: [{required: true, message: "基站ip不能为空", trigger: ["blur","change"]}],
          },
          component: [
            {
              classKey: "number",
              label: "型号代码",
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
              label: "型号描述",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "di",
              label: "DI通道数",
              tag: "el-input-number",
              placeholder: "请输入",
              controlsPosition: "right",
              min: 0,
              max: 100000,
              step: 1,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "dio",
              label: "DO通道数",
              tag: "el-input-number",
              placeholder: "请输入",
              controlsPosition: "right",
              min: 0,
              max: 100000,
              step: 1,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "ip",
              label: "基站ip",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
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
    },
    methods: {
      editTableDetail(data) {
        this.tableDetailForm.data = {...data};
      },
      initTableDetail() {
        this.tableDetailForm.data = {
          id: "",
          number:"",//型号代码
          name:"",//型号描述
          di:0,//di
          dio:0,//do
          ip:'',//基站ip
          orgId: this.$store.state.user.userInfo.orgId,
        };
      },
    },
  }
</script>

