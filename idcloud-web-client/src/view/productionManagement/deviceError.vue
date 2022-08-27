<template>
  <id-bar-query-table-dia-form
    tableErrTip="设备故障维护"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    :tableDetailForm="tableDetailForm"
    form-label-width="110px"
    id-query-form-label-width="100px"
    :customWidth="'90px'"
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
  getList,
  getDetail,
  add,
  batchDel,
  update
} from "@/api/productionManagement/deviceError";
import {
  getList as getDeviceList,
  getGroupList as getDeviceGroupList
} from "@/api/deviceMaintenance/deviceArchive";
import {
  getDeviceErrorTemplate,
  importDeviceErrorTemplate
} from "@/api/productionManagement/excelupdownload";

export default {
  name: "deviceError",
  components: {
    IdBarQueryTableDiaForm
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
    }
  },
  data() {
    const validateCompare = (rule, value, callback) => {
      if (
        Date.parse(this.tableDetailForm.data.errorEndTime) <=
        Date.parse(this.tableDetailForm.data.errorStartTime)
      ) {
        callback(new Error("故障结束时间必须大于开始时间"));
      } else {
        callback();
      }
    };
    return {
      //操作栏
      actionBarConfig: [
        new IdButtonConfig("button-add", "添加", "add", { type: "primary" }),
        new IdButtonConfig("button-delete", "删除", "delete", {
          styleOne: true
        }),
        {
          tag: "id-excel",
          excelName: "设备故障维护",
          getTemplate: getDeviceErrorTemplate,
          importTemplate: importDeviceErrorTemplate
        },
        new IdButtonConfig("button-fresh", "刷新", "fresh", {
          styleTwo: true,
          beforeIf: true,
          beforeClass: "el-icon-refresh-right"
        })
      ],
      //列
      tableColumns: [
        {
          tag: "el-table-column",
          label: "设备代码",
          prop: "deviceNumber",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String"
        },
        {
          tag: "el-table-column",
          label: "设备名称",
          prop: "deviceName",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String"
        },
        {
          tag: "el-table-column",
          label: "故障代码",
          prop: "errorCode",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String"
        },
        {
          tag: "el-table-column",
          label: "故障描述",
          prop: "errorNote",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String"
        },
        {
          tag: "el-table-column",
          label: "故障开始时间",
          prop: "errorStartTime",
          minWidth: 240,
          showOverflowTooltip: true,
          comp: "Datetime"
        },
        {
          tag: "el-table-column",
          label: "故障结束时间",
          prop: "errorEndTime",
          minWidth: 240,
          showOverflowTooltip: true,
          resizable: false,
          comp: "Datetime"
        }
      ],
      //弹窗内form
      tableDetailForm: {
        data: {
          id: "",
          deviceId: 0, //设备内码
          deviceNumber: "", //设备代码
          deviceName: "", //设备名称
          errorCode: "", //故障代码
          errorNote: "", //故障描述
          errorStartTime: "", //故障开始时间
          errorEndTime: "", //故障结束时间
          orgId: this.$store.state.user.userInfo.orgId
        },
        rules: {
          deviceName: [
            { required: true, message: "设备代码不能为空", trigger: "change" }
          ],
          errorCode: [
            { required: true, message: "故障代码不能为空", trigger: "blur" }
          ],
          errorNote: [
            { required: true, message: "故障描述不能为空", trigger: "blur" }
          ],
          errorStartTime: [
            {
              required: true,
              message: "故障开始时间不能为空",
              trigger: "blur"
            },
            { validator: validateCompare, trigger: "blur" }
          ],
          errorEndTime: [{ validator: validateCompare, trigger: "blur" }]
        },
        component: [
          {
            classKey: "deviceName",
            label: "设备",
            tag: "id-input-popup",
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
            getTableList: getDeviceList,
            getTreeList: getDeviceGroupList,
            id: "",
            number: "",
            name: "",
            controlTooltipShow: true,
            //设备档案列表 需要抽离
            tableColumns: [
              {
                tag: "el-table-column",
                label: "代码",
                prop: "number",
                width: 220,
                showOverflowTooltip: true,
                comp: "String"
              },
              {
                tag: "el-table-column",
                label: "名称",
                prop: "name",
                width: 220,
                showOverflowTooltip: true,
                comp: "String"
              },
              {
                tag: "el-table-column",
                label: "规格",
                prop: "specifications",
                width: 220,
                showOverflowTooltip: true,
                comp: "String"
              },
              {
                tag: "el-table-column",
                label: "型号",
                prop: "model",
                width: 220,
                showOverflowTooltip: true,
                comp: "String"
              },
              {
                tag: "el-table-column",
                label: "备注",
                prop: "mark",
                width: 220,
                showOverflowTooltip: true,
                comp: "String"
              }
            ],
            diaTitle: "设备",
            event: {}
          },
          {
            classKey: "errorCode",
            label: "故障代码",
            tag: "el-input",
            placeholder: "请输入",
            clearable: true,
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          },
          {
            classKey: "errorNote",
            label: "故障描述",
            tag: "el-input",
            placeholder: "请输入",
            clearable: true,
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          },
          {
            classKey: "errorStartTime",
            label: "故障开始时间",
            tag: "el-date-picker",
            type: "datetime",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            placeholder: "请选择时间",
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          },
          {
            classKey: "errorEndTime",
            label: "故障结束时间",
            tag: "el-date-picker",
            type: "datetime",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            placeholder: "请选择时间",
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          }
        ]
      }
    };
  },
  created() {
    let that = this;
    this.tableDetailForm.component[0].event.beforeGetTableList = function(
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.component[0].event.confirm = function(row) {
      that.tableDetailForm.data.deviceId = row.id;
      that.tableDetailForm.data.deviceNumber = row.number;
      that.tableDetailForm.data.deviceName = row.name;
      that.tableDetailForm.component[0].id = row.id;
      that.tableDetailForm.component[0].number = row.number;
      that.tableDetailForm.component[0].name = row.name;
    };
  },
  methods: {
    editTableDetail(data) {
      this.tableDetailForm.data = {
        ...data
      };
      this.tableDetailForm.component[0].id = this.tableDetailForm.data.deviceId;
      this.tableDetailForm.component[0].number = this.tableDetailForm.data.deviceNumber;
      this.tableDetailForm.component[0].name = this.tableDetailForm.data.deviceName;
    },
    initTableDetail() {
      this.tableDetailForm.data = {
        id: "",
        deviceId: 0, //设备内码
        deviceNumber: "", //设备代码
        deviceName: "", //设备名称
        errorCode: "", //故障代码
        errorNote: "", //故障描述
        errorStartTime: "", //故障开始时间
        errorEndTime: "", //故障结束时间
        orgId: this.$store.state.user.userInfo.orgId
      };
      this.tableDetailForm.component[0].controlTooltipShow = false;
      this.tableDetailForm.component[0].id = this.tableDetailForm.data.deviceId;
      this.tableDetailForm.component[0].number = this.tableDetailForm.data.deviceNumber;
      this.tableDetailForm.component[0].name = this.tableDetailForm.data.deviceName;
      this.$nextTick(() => {
        this.tableDetailForm.component[0].controlTooltipShow = true;
      });
    }
  }
};
</script>
