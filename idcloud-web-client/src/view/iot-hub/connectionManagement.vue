<template>
  <id-bar-query-table-dia-form
    tableErrTip="数据通道管理"
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
  import {getList, getDetail, add, batchDel, update, switchEffective} from "@/api/iot-hub/connectionManagement";
  import connectionManagementTableColumns from "../tableColumns/connectionManagementTableColumns"

  export default {
    name: "connectionManagement",
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
        tableColumns: [
          {
            tag: "el-table-column-switch",
            label: "是否启用",
            prop: "status",
            align: "center",
            fixed: 'right',
            width: 80,
            resizable: false,
            showOverflowTooltip: true,
            setTrueOfFalse: switchEffective,
            comp: "Checkbox",
          },
          ...connectionManagementTableColumns
        ],
        //弹窗内form
        tableDetailForm: {
          data: {
            id: "",
            number: "",
            name: "",
            ip: "",
            port: "",
            databaseName: "",
            databaseType: "",
            databaseAccount: "",
            databasePassword: "",
            status: false,
            mark: "",
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            number: [{required: true, message: "通道代码不能为空", trigger: "blur"}],
            name: [{required: true, message: "通道名称不能为空", trigger: "blur"}],
            ip: [{required: true, message: "ip地址不能为空", trigger: "blur"}],
            port: [{required: true, message: "端口号不能为空", trigger: "blur"}],
            databaseName: [{required: true, message: "数据库名称不能为空", trigger: "blur"}],
            databaseType: [{required: true, message: "数据库类型不能为空", trigger: "blur"}],
            databaseAccount: [{required: true, message: "数据库帐号不能为空", trigger: "blur"}],
            databasePassword: [{required: true, message: "数据库密码不能为空", trigger: "blur"}],
          },
          component: [
            {
              classKey: "number",
              label: "通道代码",
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
              label: "通道名称",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "ip",
              label: "ip地址",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "port",
              label: "端口号",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "databaseName",
              label: "数据库名称",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "databaseType",
              label: "数据库类型",
              tag: "id-select",
              placeholder: "请选择",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              options: [
                {
                  value: "0",
                  label: "mysql",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  value: "1",
                  label: "oracle",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  value: "2",
                  label: "sqlserver",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
              ]
            },
            {
              classKey: "databaseAccount",
              label: "数据库帐号",
              tag: "el-input",
              placeholder: "请输入",
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "databasePassword",
              label: "数据库密码",
              tag: "el-input",
              placeholder: "请输入",
              showPassword: true,
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "status",
              label: "是否启用",
              tag: "el-checkbox",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
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
    methods: {
      afterGetTablePage(data) {
        const options = ["mysql", "oracle", "sqlserver"];
        data.forEach((dItem) => {
          dItem.status = dItem.status === 1;
          dItem.databaseType = options[dItem.databaseType];
        });
      },
      editTableDetail(data) {
        this.tableDetailForm.data = {...data};
        this.tableDetailForm.data.databaseType = String(this.tableDetailForm.data.databaseType);
        this.tableDetailForm.data.status = this.tableDetailForm.data.status === 1;
      },
      initTableDetail() {
        this.tableDetailForm.data = {
          id: "",
          number: "",
          name: "",
          ip: "",
          port: "",
          databaseName: "",
          databaseType: "",
          databaseAccount: "",
          databasePassword: "",
          status: false,
          mark: "",
          orgId: this.$store.state.user.userInfo.orgId,
        };
      },
    },
  }
</script>
