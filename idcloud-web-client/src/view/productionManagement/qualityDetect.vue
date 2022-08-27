<template>
  <id-tree-table-form-list
    ref="page"
    tableErrTip="质量监测"
    :isTree="false"
    :getTable="getTable"
    :getTableDetail="getTableDetail"
    :audit="audit"
    :antiAudit="antiAudit"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    :tableCustomAction="false"
    :actionBarFormConfig="actionBarFormConfig"
    :tableDetailForm="tableDetailForm"
    @actionBarClick="actionBarClick"
    @afterGetTablePage="afterGetTablePage"
    @initTableDetail="initTableDetail"
    :formList="formList"
    @formListAlter="formListAlter"
    @initListDetail="initListDetail"
  >
  </id-tree-table-form-list>
</template>

<script>
  import IdTreeTableFormList from "@/components/id-pages/IdTreeTableFormList";
  import IdButtonConfig from "@/components/id-button/IdButtonConfig";
  import {
    getList,
    getDetail,
    audit,
    antiAudit,
    qualityInspection,
    antiQualityInspection,
    addList,
    updateList,
    delList,
  } from "@/api/productionManagement/qualityDetect";
  import {
    getList as getCauseList,
    getGroupList as getCauseGroupList
  } from "@/api/basicData/cause";

  export default {
    name: "qualityDetect",
    components: {
      IdTreeTableFormList,
    },
    computed: {
      getTable() {
        return getList;
      },
      getTableDetail() {
        return getDetail;
      },
      audit() {
        return audit;
      },
      antiAudit() {
        return antiAudit;
      },
    },
    mixins: [],
    data() {
      return {
        //操作栏相关配置----------------------------
        actionBarConfig: [
          new IdButtonConfig("button-fresh", "刷新", "fresh", {
            styleTwo: true, beforeIf: true,
            beforeClass: "el-icon-refresh-right",
          }),
        ],
        //表格table配置
        tableColumns: [
          {
            tag: "el-table-column",
            label: "任务单编号",
            prop: "taskNo",
            minWidth: 240,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "设备代码",
            prop: "deviceNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "设备名称",
            prop: "deviceName",
            minWidth: 240,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "物料代码",
            prop: "materialNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "物料名称",
            prop: "materialName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "工序代码",
            prop: "processNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "工序名称",
            prop: "processName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "质检状态",
            prop: "status",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "Select",
            options: [
              {
                value: "3",
                label: "未质检",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                value: "4",
                label: "已质检",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
            ],
          },
          {
            tag: "el-table-column",
            label: "加工人员代码",
            prop: "personNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "加工人员名称",
            prop: "personName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "加工日期",
            prop: "processTime",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "班次代码",
            prop: "teamNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "班次名称",
            prop: "teamName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "完工数量",
            prop: "num",
            width: 120,
            showOverflowTooltip: true,
            comp: "Number",
          },
          {
            tag: "el-table-column",
            label: "合格数量",
            prop: "qualifiedNum",
            width: 120,
            showOverflowTooltip: true,
            comp: "Number",
          },
          {
            tag: "el-table-column",
            label: "不良数量",
            prop: "unqualifiedNum",
            width: 120,
            showOverflowTooltip: true,
            comp: "Number",
          },
          {
            tag: "el-table-column",
            label: "报废数量",
            prop: "scrapNum",
            width: 120,
            showOverflowTooltip: true,
            comp: "Number",
          },
          {
            tag: "el-table-column",
            label: "质检人代码",
            prop: "qualityPersonNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "质检人名称",
            prop: "qualityPersonName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "质检时间",
            prop: "qualityTime",
            minWidth: 180,
            resizable: false,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "审核状态",
            prop: "qualityAuditStatus",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Checkbox",
          },
          {
            tag: "el-table-column",
            label: "审核人代码",
            prop: "auditPersonNumber",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "审核人姓名",
            prop: "auditPersonName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "审核时间",
            prop: "auditTime",
            minWidth: 180,
            resizable: false,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
        ], //测试表格列配置
        //表单工具行配置
        actionBarFormConfig: [
          {
            tag: "id-group-button",
            classKey: "sheet",
            childButton: [
              {
                text: "上页",
                target: "form-previous",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: "下页",
                target: "form-next",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ],
          },
          {
            tag: "id-dropdown",
            text: "质检",
            childButton: [
              {
                text: "质检",
                target: "form-quality",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: "反质检",
                target: "form-antiQuality",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ],
          },
          {
            tag: "id-dropdown",
            text: "审核",
            childButton: [
              {
                text: "审核",
                target: "form-audit",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: "反审核",
                target: "form-antiAudit",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ],
          },
        ],
        //表单配置
        tableDetailForm: {
          labelWidth: '100px',
          idForm: {
            data: {
              id: '',
              orgId: this.$store.state.user.userInfo.orgId,//组织
              taskNo: '',//任务单编号
              deviceId: 0, //设备内码
              deviceNo: '', //设备代码
              deviceName: '', //设备名称
              processTime: '', //加工日期
              teamId: 0, //班次内码
              teamNo: '', //班次代码
              teamName: '', //班次名称
              materialId: 0, //物料内码
              materialNo: '', //物料代码
              materialName: '', //物料名称
              processId: 0,//工序内码
              processNo: '', //工序代码
              processName: '', //工序名称
              personId: 0, //人员内码
              personNo: '', //人员代码
              personName: '', //人员名称
              num: 0,//完工数量
              qualifiedNum: 0,//合格数量
              unqualifiedNum: 0,//不良数量
              scrapNum: 0,//报废数量
              //审核相关
              status: '3',//质检状态
              qualityPersonId: 0,//质检人id
              qualityPersonNo: '',//质检人代码
              qualityPersonName: '',//质检人名称
              qualityTime: '',//质检时间
              qualityAuditStatus: '0',//审核状态
              auditPersonId: 0,//审核人id
              auditPersonNumber: '',//审核人代码
              auditPersonName: '',//审核人姓名
              auditTime: '',//审核时间
            },
            rules: {},
            component: [
              {
                classKey: "taskNo",
                label: "任务单编号",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "deviceNo",
                label: "设备代码",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "deviceName",
                label: "设备名称",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "processTime",
                label: "加工日期",
                tag: "el-date-picker",
                type: "datetime",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "teamNo",
                label: "班次代码",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "teamName",
                label: "班次名称",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "materialNo",
                label: "物料代码",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "materialName",
                label: "物料名称",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "processNo",
                label: "工序代码",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "processName",
                label: "工序名称",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "personNo",
                label: "人员代码",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "personName",
                label: "人员名称",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "num",
                label: "完工数量",
                tag: "el-input-number",
                controlsPosition: "right",
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "qualifiedNum",
                label: "合格数量",
                tag: "el-input-number",
                controlsPosition: "right",
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "unqualifiedNum",
                label: "不良数量",
                tag: "el-input-number",
                controlsPosition: "right",
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "scrapNum",
                label: "报废数量",
                tag: "el-input-number",
                controlsPosition: "right",
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "status",
                label: "质检状态",
                tag: "id-select",
                options: [
                  {
                    value: "3",
                    label: "未质检",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    value: "4",
                    label: "已质检",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  }
                ],
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "qualityPersonNo",
                label: "质检人代码",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "qualityPersonName",
                label: "质检人名称",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "qualityTime",
                label: "质检时间",
                tag: "el-date-picker",
                type: "datetime",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "qualityAuditStatus",
                label: "审核状态",
                tag: "id-select",
                options: [
                  {
                    value: "null",
                    label: "未审核",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    value: "0",
                    label: "未审核",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    value: "1",
                    label: "已审核",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  }
                ],
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "auditPersonNumber",
                label: "审核人代码",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "auditPersonName",
                label: "审核人姓名",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "auditTime",
                label: "审核时间",
                tag: "el-date-picker",
                type: "datetime",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
            ],
          },
        },
        //表体配置
        formList: [
          {
            fromList: 'qualityList',
            tableErrTip: '不良原因',
            actionBarConfig: [
              new IdButtonConfig("list-add", "添加", "list-add", {type: "primary"}),
              new IdButtonConfig("list-delete", "删除", "list-delete", {styleOne: true}),
            ],
            tableColumns: [
              {
                tag: "el-table-column",
                label: "不良原因代码",
                prop: "causeNo",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "不良原因名称",
                prop: "causeName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "不良原因类别",
                prop: "groupName",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "是否报废",
                prop: "scrapStatusName",
                minWidth: 120,
                resizable: false,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "不良数量",
                prop: "num",
                minWidth: 120,
                resizable: false,
                showOverflowTooltip: true,
              },
            ],
            form: {
              data: {
                taskMaterialId: "",//表单Id
                id: "",
                causeId: 0,//不良原因
                causeNo: "",
                causeName: "",
                scrapStatus: 0,//不良原因
                num: 0,//不良数量
                orgId: this.$store.state.user.userInfo.orgId,
              },
              rules: {
                causeName: [{required: true, message: "不良原因不能为空", trigger: ["blur", "change"]}],
                num: [
                  {required: true, message: "不良数量不能为空", trigger: ["blur", "change"]},
                  {
                    validator: (rule, value, callback) => {
                      this.checkNum(rule, value, callback);
                    },
                    trigger: ["change", "blur"],
                  },
                ],
              },
              component: [
                {
                  classKey: "causeName",
                  label: "不良原因",
                  tag: "id-input-popup",
                  controlTooltipShow: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  getTableList: getCauseList,
                  getTreeList: getCauseGroupList,
                  isTree: true,
                  isPage: false,
                  id: "",
                  number: "",
                  name: "",
                  tableColumns: [
                    {
                      tag: "el-table-column",
                      label: "不良原因代码",
                      prop: "number",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "不良原因名称",
                      prop: "name",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "是否报废",
                      prop: "scrapStatus",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "Checkbox",
                    },
                    {
                      tag: "el-table-column",
                      label: "备注",
                      prop: "note",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "制单人代码",
                      prop: "docMakerNumber",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "制单人姓名",
                      prop: "docMakerName",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "创建时间",
                      prop: "createTime",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "Datetime",
                    },
                    {
                      tag: "el-table-column",
                      label: "更新时间",
                      prop: "updateTime",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      resizable: false,
                      comp: "Datetime",
                    },
                    {
                      tag: "el-table-column",
                      label: "审核状态",
                      prop: "qualityAuditStatus",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "Checkbox",
                    },
                    {
                      tag: "el-table-column",
                      label: "审核人代码",
                      prop: "auditPersonNumber",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "审核人姓名",
                      prop: "auditPersonName",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "审核时间",
                      prop: "auditTime",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "Datetime",
                    },
                    {
                      tag: "el-table-column",
                      label: "禁用状态",
                      prop: "isDisable",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "Checkbox",
                    },
                    {
                      tag: "el-table-column",
                      label: "禁用人代码",
                      prop: "disablePersonNumber",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "禁用人姓名",
                      prop: "disablePersonName",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "禁用时间",
                      prop: "disableTime",
                      minWidth: 180,
                      resizable: false,
                      showOverflowTooltip: true,
                      comp: "Datetime",
                    },
                  ],
                  diaTitle: "不良原因",
                  event: {},
                },
                {
                  classKey: "num",
                  label: "不良数量",
                  tag: "el-input-number",
                  placeholder: "请输入",
                  controlsPosition: "right",
                  min: 0,
                  max: 1000000000000,
                  step: 1,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              ],
            },
            add: addList,
            update: updateList,
            delete: delList,
          }
        ],
      }
    },
    created() {
      let that = this;
      this.formList[0].form.component[0].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.formList[0].form.component[0].event.afterGetTablePage = function (tableData) {
        tableData.forEach((dItem) => {
          dItem.scrapStatus = dItem.scrapStatus ? '是' : '否';
        });
      };
      this.formList[0].form.component[0].event.confirm = function (row) {
        that.formList[0].form.data.causeId = row.id;
        that.formList[0].form.data.causeNo = row.number;
        that.formList[0].form.data.causeName = row.name;
        that.formList[0].form.data.scrapStatus = row.scrapStatus === '是' ? 1 : 0;
        that.formList[0].form.component[0].id = row.id;
        that.formList[0].form.component[0].number = row.number;
        that.formList[0].form.component[0].name = row.name;
      };
    },
    methods: {
      //不良原因/报废 数量验证
      checkNum(rule, value, callback) {
        if (!this.formList[0].form.data.id) {
          if (this.tableDetailForm.idForm.data.unqualifiedNum + value >
            this.tableDetailForm.idForm.data.num) {
            callback(new Error("不良原因数量加报废数量已超出产量!"));
          }
        } else {
          if (this.tableDetailForm.idForm.data.unqualifiedNum -
            this.formList[0].form.data.num + value >
            this.tableDetailForm.idForm.data.num) {
            callback(new Error("不良原因数量加报废数量已超出产量!"));
          }
        }
        callback();
      },
      //自身api
      async actionBarClick(target, value) {
        let mess = "";
        let check = null;
        if (target === 'form-quality') {
          mess = "质检";
          check = qualityInspection;
        } else if (target === 'form-antiQuality') {
          mess = "反质检";
          check = antiQualityInspection;
        } else {
          return;
        }
        let params = [{id: this.tableDetailForm.idForm.data.id}];
        await check(params).then(response => {
          response = response.data;
          if (response.code === 200) {
            this.$message.success(`${mess}成功`);
            this.$refs['page'].handleQueryData();
            this.$refs['page'].editTableForm(params[0]);
          } else {
            this.$notifyError(`${mess}失败`, response.msg);
          }
        }).catch(response => {
          this.$notifyError(`${mess}失败`, '异常信息：' + response);
        })
      },
      afterGetTablePage(tableData) {
        const statuses=[null,null,null,"未质检","已质检"];
        tableData.forEach((tItem) => {
          tItem.qualityAuditStatus = tItem.qualityAuditStatus ? '已审核' : '未审核';
          tItem.status = statuses[tItem.status];
        });
      },
      initTableDetail(data) {
        if (data) {
          this.tableDetailForm.idForm.data = data;
          this.tableDetailForm.idForm.data.orgId = this.$store.state.user.userInfo.orgId;//组织
          this.tableDetailForm.idForm.data.qualityAuditStatus = String(this.tableDetailForm.idForm.data.qualityAuditStatus);
          this.tableDetailForm.idForm.data.status = String(this.tableDetailForm.idForm.data.status);
        } else {
          this.tableDetailForm.idForm.data = {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId,//组织
            taskNo: '',//任务单编号
            deviceId: 0, //设备内码
            deviceNo: '', //设备代码
            deviceName: '', //设备名称
            processTime: '', //加工日期
            teamId: 0, //班次内码
            teamNo: '', //班次代码
            teamName: '', //班次名称
            materialId: 0, //物料内码
            materialNo: '', //物料代码
            materialName: '', //物料名称
            processId: 0,//工序内码
            processNo: '', //工序代码
            processName: '', //工序名称
            personId: 0, //人员内码
            personNo: '', //人员代码
            personName: '', //人员名称
            num: 0,//完工数量
            qualifiedNum: 0,//合格数量
            unqualifiedNum: 0,//不良数量
            scrapNum: 0,//报废数量
            //审核相关
            status: '3',//质检状态
            qualityPersonId: 0,//质检人id
            qualityPersonNo: '',//质检人代码
            qualityPersonName: '',//质检人名称
            qualityTime: '',//质检时间
            qualityAuditStatus: '0',//审核状态
            auditPersonId: 0,//审核人id
            auditPersonNumber: '',//审核人代码
            auditPersonName: '',//审核人姓名
            auditTime: '',//审核时间
          };
        }
        //处理表单状态改变后的表单操作栏状态
        this.actionBarFormConfig[1].childButton[0].idDisable=this.tableDetailForm.idForm.data.status === '4';
        this.actionBarFormConfig[1].childButton[1].idDisable=
          this.tableDetailForm.idForm.data.status === '3'
          ||this.tableDetailForm.idForm.data.qualityAuditStatus === '1';
        this.actionBarFormConfig[2].childButton[0].idDisable=
          this.tableDetailForm.idForm.data.status === '3'
          ||this.tableDetailForm.idForm.data.qualityAuditStatus === '1';
        this.actionBarFormConfig[2].childButton[1].idDisable=
          this.tableDetailForm.idForm.data.qualityAuditStatus === '0';
        //处理审核后的表体操作栏问题
        this.formList.forEach((fItem) => {
          fItem.actionBarConfig.forEach((aItem) => {
            aItem.idDisable = this.tableDetailForm.idForm.data.status === '4'
          });
        });
      },
      formListAlter(fromList, data, index) {
        data.forEach((dItem) => {
          dItem.deleteable = this.tableDetailForm.idForm.data.status === '4';
          dItem.scrapStatusName = dItem.scrapStatus ? '是' : '否';
        });
      },
      initListDetail(index, row, callBack) {
        if (row) {
          this.formList[0].form.data = {...row};
          this.formList[0].form.data.taskMaterialId = this.tableDetailForm.idForm.data.id;
          callBack(index, true);
        } else {
          this.formList[0].form.data = {
            taskMaterialId: this.tableDetailForm.idForm.data.id,//表单Id
            id: "",
            causeId: 0,//不良原因
            causeNo: "",
            causeName: "",
            scrapStatus: 0,//不良原因
            num: 0,//不良数量
            orgId: this.$store.state.user.userInfo.orgId,
          };
        }
        //处理数据点弹窗数据问题
        this.formList[0].form.component[0].id = this.formList[0].form.data.causeId;
        this.formList[0].form.component[0].number = this.formList[0].form.data.causeNo;
        this.formList[0].form.component[0].name = this.formList[0].form.data.causeName;
        //清除弹窗
        this.formList.forEach((fItem) => {
          fItem.form.component.forEach((cItem) => {
            if (cItem.tag === 'id-input-popup') {
              cItem.controlTooltipShow = false;
            }
          });
        });
        this.$nextTick(() => {
          this.formList.forEach((fItem) => {
            fItem.form.component.forEach((cItem) => {
              if (cItem.tag === 'id-input-popup') {
                cItem.controlTooltipShow = true;
              }
            });
          });
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  //没有树的时候消除样式问题
  ::v-deep .el-tabs__content {
    margin-left: -10px;
  }

  ::v-deep .el-pane-form {
    margin-left: 10px;
  }
</style>
