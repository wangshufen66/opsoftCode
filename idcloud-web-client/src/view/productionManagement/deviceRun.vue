<template>
  <id-bar-query-table-dia-form
    tableErrTip="设备运行维护"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    :tableDetailForm="tableDetailForm"
    form-label-width="110px"
    id-query-form-label-width="100px"
    customWidth="90px"
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
} from "@/api/productionManagement/deviceRun";
import {
  getList as getDeviceList,
  getGroupList as getDeviceGroupList
} from "@/api/deviceMaintenance/deviceArchive";
import {
  getList as getTeamList,
  getGroupList as getTeamGroupList
} from "@/api/factoryModel/team";
import {
  getDeviceRunTemplate,
  importDeviceRunTemplate
} from "@/api/productionManagement/excelupdownload";
import { teamInputPopupColumns } from "../tableColumns/teamTableColumns";

export default {
  name: "deviceRun",
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
    const validNumberCompare = (rule, value, callback) => {
      if (
        this.tableDetailForm.data.waitingProportion +
          this.tableDetailForm.data.adjustProportion +
          this.tableDetailForm.data.errorProportion +
          this.tableDetailForm.data.offlineProportion +
          this.tableDetailForm.data.runningProportion !==
        100
      ) {
        callback(new Error("合计占比必须达到100%"));
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
          excelName: "设备运行维护",
          getTemplate: getDeviceRunTemplate,
          importTemplate: importDeviceRunTemplate
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
          label: "班次代码",
          prop: "teamNumber",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String"
        },
        {
          tag: "el-table-column",
          label: "班次名称",
          prop: "teamName",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String"
        },
        {
          tag: "el-table-column",
          label: "加工日期",
          prop: "processDate",
          minWidth: 240,
          showOverflowTooltip: true,
          comp: "Datetime"
        },
        {
          tag: "el-table-column",
          label: "运行占比(%)",
          prop: "runningProportion",
          minWidth: 120,
          showOverflowTooltip: true,
          comp: "Number"
        },
        {
          tag: "el-table-column",
          label: "待机占比(%)",
          prop: "waitingProportion",
          minWidth: 120,
          showOverflowTooltip: true,
          comp: "Number"
        },
        {
          tag: "el-table-column",
          label: "调机占比(%)",
          prop: "adjustProportion",
          minWidth: 120,
          showOverflowTooltip: true,
          comp: "Number"
        },
        {
          tag: "el-table-column",
          label: "故障占比(%)",
          prop: "errorProportion",
          minWidth: 120,
          showOverflowTooltip: true,
          comp: "Number"
        },
        {
          tag: "el-table-column",
          label: "离线占比(%)",
          prop: "offlineProportion",
          minWidth: 120,
          showOverflowTooltip: true,
          resizable: false,
          comp: "Number"
        }
      ],
      //弹窗内form
      tableDetailForm: {
        data: {
          id: "",
          deviceId: 0, //设备内码
          deviceNumber: "", //设备代码
          deviceName: "", //设备名称
          teamId: 0, //班次内码
          teamNumber: "", //班次代码
          teamName: "", //班次名称
          processDate: "", //加工日期
          waitingProportion: 0, //待机占比
          adjustProportion: 0, //调机占比
          errorProportion: 0, //故障占比
          offlineProportion: 0, //离线占比
          runningProportion: 0, //运行占比
          orgId: this.$store.state.user.userInfo.orgId
        },
        rules: {
          deviceName: [
            { required: true, message: "设备代码不能为空", trigger: "change" }
          ],
          teamName: [
            { required: true, message: "班次代码不能为空", trigger: "change" }
          ],
          processDate: [
            { required: true, message: "加工日期不能为空", trigger: "change" }
          ],
          waitingProportion: [
            { validator: validNumberCompare, trigger: "blur" },
            { required: true, message: "待机占比不能为空", trigger: "change" }
          ], //待机占比
          adjustProportion: [
            { validator: validNumberCompare, trigger: "blur" },
            { required: true, message: "调机占比不能为空", trigger: "change" }
          ], //调机占比
          errorProportion: [
            { validator: validNumberCompare, trigger: "blur" },
            { required: true, message: "故障占比不能为空", trigger: "change" }
          ], //故障占比
          offlineProportion: [
            { validator: validNumberCompare, trigger: "blur" },
            { required: true, message: "离线占比不能为空", trigger: "change" }
          ], //离线占比
          runningProportion: [
            { validator: validNumberCompare, trigger: "blur" },
            { required: true, message: "运行占比不能为空", trigger: "change" }
          ] //运行占比
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
            classKey: "teamName",
            label: "班次",
            tag: "id-input-popup",
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
            getTableList: getTeamList,
            getTreeList: getTeamGroupList,
            id: "",
            number: "",
            name: "",
            controlTooltipShow: true,
            tableColumns: teamInputPopupColumns,
            diaTitle: "设备",
            event: {}
          },
          {
            classKey: "processDate",
            label: "加工日期",
            tag: "el-date-picker",
            type: "date",
            valueFormat: "yyyy-MM-dd",
            placeholder: "请选择日期",
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          },
          {
            classKey: "runningProportion",
            label: "运行占比",
            tag: "el-input-number",
            placeholder: "请输入",
            controlsPosition: "right",
            min: 0,
            max: 100,
            step: 0.01,
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          },
          {
            classKey: "waitingProportion",
            label: "待机占比",
            tag: "el-input-number",
            placeholder: "请输入",
            controlsPosition: "right",
            min: 0,
            max: 100,
            step: 0.01,
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          },
          {
            classKey: "adjustProportion",
            label: "调机占比",
            tag: "el-input-number",
            placeholder: "请输入",
            controlsPosition: "right",
            min: 0,
            max: 100,
            step: 0.01,
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          },
          {
            classKey: "errorProportion",
            label: "故障占比",
            tag: "el-input-number",
            placeholder: "请输入",
            controlsPosition: "right",
            min: 0,
            max: 100,
            step: 0.01,
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true
          },
          {
            classKey: "offlineProportion",
            label: "离线占比",
            tag: "el-input-number",
            placeholder: "请输入",
            controlsPosition: "right",
            min: 0,
            max: 100,
            step: 0.01,
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
    this.tableDetailForm.component[1].event.beforeGetTableList = function(
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.component[1].event.confirm = function(row) {
      that.tableDetailForm.data.teamId = row.id;
      that.tableDetailForm.data.teamNumber = row.number;
      that.tableDetailForm.data.teamName = row.name;
      that.tableDetailForm.component[1].id = row.id;
      that.tableDetailForm.component[1].number = row.number;
      that.tableDetailForm.component[1].name = row.name;
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
      this.tableDetailForm.component[1].id = this.tableDetailForm.data.teamId;
      this.tableDetailForm.component[1].number = this.tableDetailForm.data.teamNumber;
      this.tableDetailForm.component[1].name = this.tableDetailForm.data.teamName;
    },
    initTableDetail() {
      this.tableDetailForm.data = {
        id: "",
        deviceId: 0, //设备内码
        deviceNumber: "", //设备代码
        deviceName: "", //设备名称
        teamId: 0, //班次内码
        teamNumber: "", //班次代码
        teamName: "", //班次名称
        processDate: "", //加工日期
        waitingProportion: 0, //待机占比
        adjustProportion: 0, //调机占比
        errorProportion: 0, //故障占比
        offlineProportion: 0, //离线占比
        runningProportion: 0, //运行占比
        orgId: this.$store.state.user.userInfo.orgId
      };
      this.tableDetailForm.component[0].controlTooltipShow = false;
      this.tableDetailForm.component[1].controlTooltipShow = false;
      this.tableDetailForm.component[0].id = this.tableDetailForm.data.deviceId;
      this.tableDetailForm.component[0].number = this.tableDetailForm.data.deviceNumber;
      this.tableDetailForm.component[0].name = this.tableDetailForm.data.deviceName;
      this.tableDetailForm.component[1].id = this.tableDetailForm.data.teamId;
      this.tableDetailForm.component[1].number = this.tableDetailForm.data.teamNumber;
      this.tableDetailForm.component[1].name = this.tableDetailForm.data.teamName;
      this.$nextTick(() => {
        this.tableDetailForm.component[0].controlTooltipShow = true;
        this.tableDetailForm.component[1].controlTooltipShow = true;
      });
    }
  }
};
</script>
