<template>
  <id-tree-table-form-list
    tableErrTip="事件执行"
    :isTree="false"
    :getTable="getTable"
    :getTableDetail="getTableDetail"
    :deleteTableDetails="deleteTableDetails"
    :addTableDetail="addTableDetail"
    :updateTableDetail="updateTableDetail"
    :audit="audit"
    :antiAudit="antiAudit"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    :actionBarFormConfig="actionBarFormConfig"
    :tableDetailForm="tableDetailForm"
    @afterGetTablePage="afterGetTablePage"
    @initTableDetail="initTableDetail"
    @beforeLeave="beforeLeave"
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
    add,
    batchDel,
    update,
    audit,
    antiAudit,
    addList,
    updateList,
    delList,
    addList1,
    updateList1,
    delList1,
  } from "@/api/device-control/eventExecute";
  import {
    getList as getClerkList,
    getGroupList as getClerkGroupList
  } from "@/api/basicData/clerk";
  import {clerkInputPopupColumns} from "../tableColumns/clerkTableColumns";
  import {
    getContainerPcAnalysisList,
  } from "@/api/device-watch/device";
  import {getPointListByContainer} from "@/api/basedata";

  export default {
    name: "eventExecute",
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
      deleteTableDetails() {
        return batchDel;
      },
      addTableDetail() {
        return add;
      },
      updateTableDetail() {
        return update;
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
          new IdButtonConfig("button-add", "添加", "add", {type: "primary"}),
          new IdButtonConfig("button-delete", "删除", "delete", {styleOne: true}),
          {
            tag: "id-dropdown",
            text: '审核',
            childButton: [
              {
                text: "审核",
                target: "audit",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: "反审核",
                target: "antiAudit",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ]
          },
          new IdButtonConfig("button-fresh", "刷新", "fresh", {
            styleTwo: true,
            beforeIf: true,
            beforeClass: "el-icon-refresh-right",
          }),
        ],
        //表格table配置
        tableColumns: [
          {
            tag: "el-table-column",
            label: "#",
            fixed: "left",
            align: "center",
            type: 'selection',
            width: 45,
            selectable: function (row, index) {
              return row.deleteable;
            }
          },
          {
            tag: "el-table-column",
            label: "事件代码",
            prop: "number",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "事件名称",
            prop: "name",
            minWidth: 240,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "处理方式",
            prop: "callbackTypeName",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "String",
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
            label: "审核状态",
            prop: "auditStatus",
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
        actionBarFormConfig: [],
        //表单配置
        tableDetailForm: {
          labelWidth: '100px',
          idForm: {
            data: {
              id: '',
              orgId: this.$store.state.user.userInfo.orgId,//组织
              number: '',//触发器代码
              name: '',//触发器代码
              callbackType: '1',//执行类型
              note: '',//备注
              //审核相关
              createTime: '',//创建时间
              docMakerId: 0,//创建人id
              docMakerNumber: '',//制单人代码
              docMakerName: '',//制单人姓名
              auditStatus: '0',//审核状态
              auditPersonId: 0,//审核人id
              auditPersonNumber: '',//审核人代码
              auditPersonName: '',//审核人姓名
              auditTime: '',//审核时间
            },
            rules: {
              number: [{required: true, message: "事件代码不能为空", trigger: ['blur', 'change']}],
              name: [{required: true, message: "事件名称不能为空", trigger: ['blur', 'change']}],
              callbackType: [{required: true, message: "处理方式不能为空", trigger: ['blur', 'change']}],
            },
            component: [
              //需要class化
              {
                classKey: "number",
                label: "事件代码",
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
                label: "事件名称",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "callbackType",
                label: "处理方式",
                tag: "id-select",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                options: [
                  {
                    label: "不执行",
                    value: "0",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "告警",
                    value: "1",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "控制",
                    value: "2",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "告警并控制",
                    value: "3",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                ],
              },
              //需要model化
              {
                classKey: "note",
                label: "备注信息",
                tag: "el-input",
                placeholder: "请输入",
                type: "textarea",
                rows: 3, //需要人员自己调整
                gridRowStart: 3,
                gridColumnStart: 3,
                maxlength: 250,
                showWordLimit: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              //写进一个地方 方便调用
              {
                classKey: "createTime",
                label: "创建时间",
                tag: "el-date-picker",
                type: "datetime",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "docMakerName",
                label: "创建人",
                tag: "id-input-popup",
                controlTooltipShow: true,
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
                isTree: false,
                getTableList: getClerkList,
                id: "",
                number: "",
                name: "",
                tableColumns: [{
                  tag: "el-table-column",
                  label: "代码",
                  prop: "number",
                  width: 180,
                  showOverflowTooltip: true,
                  comp: "String",
                }],
                diaTitle: "",
                event: {},
              },
              {
                classKey: "updateTime",
                label: "更新时间",
                tag: "el-date-picker",
                type: "datetime",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "auditStatus",
                label: "审核状态",
                tag: "id-select",
                options: [
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
                classKey: "auditPersonName",
                label: "审核人",
                tag: "id-input-popup",
                controlTooltipShow: true,
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
                isTree: false,
                getTableList: getClerkList,
                id: "",
                number: "",
                name: "",
                tableColumns: [{
                  tag: "el-table-column",
                  label: "代码",
                  prop: "number",
                  width: 180,
                  showOverflowTooltip: true,
                  comp: "String",
                }],
                diaTitle: "",
                event: {},
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
            fromList: 'notifierList',
            tableErrTip: '告警人',
            actionBarConfig: [
              new IdButtonConfig("list-add", "添加", "list-add", {type: "primary"}),
              new IdButtonConfig("list-delete", "删除", "list-delete", {styleOne: true}),
            ],
            tableColumns: [
              {
                tag: "el-table-column",
                label: "人员代码",
                prop: "personNumber",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "人员名称",
                prop: "personName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "帐号代码",
                prop: "userNumber",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "帐号名称",
                prop: "userName",
                minWidth: 180,
                resizable: false,
                showOverflowTooltip: true,
              },
            ],
            form: {
              data: {
                triggerId: "",//表单Id
                id: "",
                personId: 0,//人员ID
                personNumber: "",//人员代码
                personName: "",//人员名称
                userName: "",//帐号代码
                userNumber: "",//帐号名称
                orgId: this.$store.state.user.userInfo.orgId,
              },
              rules: {
                personName: [{required: true, message: "人员不能为空", trigger: ["blur", "change"]}],
              },
              component: [
                {
                  classKey: "personName",
                  label: "人员",
                  tag: "id-input-popup",
                  controlTooltipShow: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  getTableList: getClerkList,
                  getTreeList: getClerkGroupList,
                  isTree: true,
                  isPage: false,
                  id: "",
                  number: "",
                  name: "",
                  tableColumns: clerkInputPopupColumns,
                  diaTitle: "人员",
                  event: {},
                },
                {
                  classKey: "userNumber",
                  label: "帐号代码",
                  tag: "el-input",
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "userName",
                  label: "帐号名称",
                  tag: "el-input",
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
              ],
            },
            add: addList,
            update: updateList,
            delete: delList,
          },
          {
            fromList: 'conditionList',
            tableErrTip: '触发条件',
            actionBarConfig: [
              new IdButtonConfig("list-add", "添加", "list-add", {type: "primary"}),
              new IdButtonConfig("list-delete", "删除", "list-delete", {styleOne: true}),
            ],
            tableColumns: [
              {
                tag: "el-table-column",
                label: "告警标题",
                prop: "newsTitle",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "触发类型",
                prop: "condTypeName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "触发源代码",
                prop: "relationNumber",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "触发源代码",
                prop: "relationName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "运算符",
                prop: "condOperator",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "运算值",
                prop: "condValue",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "触发次数",
                prop: "timesCurrent",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "告警内容",
                prop: "newsContent",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "告警模版",
                prop: "templateName",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "告警级别",
                prop: "newsLevel",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "备注",
                prop: "note",
                minWidth: 180,
                resizable: false,
                showOverflowTooltip: true,
              },
            ],
            form: {
              data: {
                triggerId: "",//表单Id
                id: "",
                newsTitle: "",//告警标题
                condType: "",//触发类型
                relationId: 0,//触发源id
                relationNumber: '',//触发源代码
                relationName: '',//触发源名称
                condOperator: '>',//运算符
                condValue: '',//运算符
                newsContent: '',//告警内容
                newsTemplateId: '1',//告警模版id
                newsLevel: "一级",  //告警级别
                note: "",//备注
                orgId: this.$store.state.user.userInfo.orgId,
              },
              rules: {
                newsTitle: [{required: true, message: "告警标题不能为空", trigger: ["blur", "change"]}],
                condType: [{required: true, message: "触发类型不能为空", trigger: ["blur", "change"]}],
                relationName: [{required: true, message: "触发源不能为空", trigger: ["blur", "change"]}],
                condOperator: [{required: true, message: "运算符不能为空", trigger: ["blur", "change"]}],
                condValue: [{required: true, message: "运算值不能为空", trigger: ["blur", "change"]}],
              },
              component: [
                {
                  classKey: "newsTitle",
                  label: "告警标题",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "condType",
                  label: "触发类型",
                  tag: "id-select",
                  freeze: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  options: [
                    {
                      label: "数据点触发",
                      value: "1",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "时间触发",
                      value: "3",
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
                  classKey: "relationName",
                  label: "触发源",
                  tag: "id-input-popup",
                  controlTooltipShow: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  getTableList: getPointListByContainer,
                  getTreeList: getContainerPcAnalysisList,
                  isTree: true,
                  isPage: true,
                  id: "",
                  number: "",
                  name: "",
                  tableColumns: [
                    {
                      tag: "el-table-column",
                      label: "信息点代码",
                      prop: "ctrNumber",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "信息点名称",
                      prop: "ctrName",
                      minWidth: 180,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                    {
                      tag: "el-table-column",
                      label: "备注",
                      prop: "mark",
                      minWidth: 250,
                      resizable: false,
                      showOverflowTooltip: true,
                      comp: "String",
                    },
                  ],
                  diaTitle: "触发源",
                  event: {},
                },
                {
                  classKey: "condOperator",
                  label: "运算符",
                  tag: "id-select",
                  freeze: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  options: [
                    {
                      label: ">",
                      value: ">",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "=",
                      value: "=",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "<",
                      value: "<",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: ">=",
                      value: ">=",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "=<",
                      value: "=<",
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
                  classKey: "condValue",
                  label: "运算值",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "newsContent",
                  label: "告警内容",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "newsTemplateId",
                  label: "告警模版",
                  tag: "id-select",
                  freeze: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  options: [
                    {
                      label: "预警通知",
                      value: "1",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "告警通知",
                      value: "2",
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
                  classKey: "newsLevel",
                  label: "告警级别",
                  tag: "id-select",
                  freeze: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  options: [
                    {
                      label: "一级",
                      value: "一级",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "二级",
                      value: "二级",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "三级",
                      value: "三级",
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
                  classKey: "note",
                  label: "备注",
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
            add: addList1,
            update: updateList1,
            delete: delList1,
          },
          // {
          //   fromList: 'controlList',
          //   tableErrTip: '触发日志',
          //   actionBarConfig: [],
          //   tableColumns: [
          //     {
          //       tag: "el-table-column",
          //       label: "触发类型",
          //       prop: "collectionNumber",
          //       minWidth: 180,
          //       showOverflowTooltip: true,
          //     },
          //     {
          //       tag: "el-table-column",
          //       label: "触发源代码",
          //       prop: "pointNumber",
          //       minWidth: 180,
          //       showOverflowTooltip: true,
          //     },
          //     {
          //       tag: "el-table-column",
          //       label: "触发源名称",
          //       prop: "pointName",
          //       minWidth: 180,
          //       showOverflowTooltip: true,
          //     },
          //     {
          //       tag: "el-table-column",
          //       label: "所属容器",
          //       prop: "pointValue",
          //       minWidth: 180,
          //       showOverflowTooltip: true,
          //     },
          //     {
          //       tag: "el-table-column",
          //       label: "触发条件",
          //       prop: "pointValue",
          //       minWidth: 180,
          //       showOverflowTooltip: true,
          //     },
          //     {
          //       tag: "el-table-column",
          //       label: "触发值",
          //       prop: "pointValue",
          //       minWidth: 180,
          //       showOverflowTooltip: true,
          //     },
          //     {
          //       tag: "el-table-column",
          //       label: "触发时间",
          //       prop: "pointValue",
          //       minWidth: 180,
          //       showOverflowTooltip: true,
          //     },
          //     {
          //       tag: "el-table-column",
          //       label: "持续时间",
          //       prop: "pointValue",
          //       minWidth: 180,
          //       showOverflowTooltip: true,
          //     },
          //     {
          //       tag: "el-table-column",
          //       label: "结束时间",
          //       prop: "pointValue",
          //       minWidth: 120,
          //       showOverflowTooltip: true,
          //     },
          //   ],
          //   form: {},
          //   add: null,
          //   update: null,
          //   delete: null,
          // },
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
        const options = ["在职", "试用", "实习", "退休", "离职", "离休"];
        tableData.forEach((dItem) => {
          dItem.type = options[dItem.type];
        });
      };
      this.formList[0].form.component[0].event.confirm = function (row) {
        that.formList[0].form.data.personId = row.id;
        that.formList[0].form.data.personNumber = row.number;
        that.formList[0].form.data.personName = row.name;
        that.formList[0].form.data.userName = row.userName;
        that.formList[0].form.data.userNumber = row.userNumber;
        that.formList[0].form.component[0].id = row.id;
        that.formList[0].form.component[0].number = row.number;
        that.formList[0].form.component[0].name = row.name;
      };
      this.formList[1].form.component[2].event.beforeGetTableList = function (filterData) {
        filterData.orgId = that.$store.state.user.userInfo.orgId;
        filterData.id = filterData.groupId;
        filterData.groupId = undefined;
        // filterData.showAll = undefined;
      };
      this.formList[1].form.component[2].event.afterGetTreeList = function (tableData) {
        tableData.forEach((i) => {
          i.name = i.ctrName;
          i.pid = String(i.ctrParent);
        });
      };
      this.formList[1].form.component[2].event.confirm = function (row) {
        that.formList[1].form.data.relationId = row.id;
        that.formList[1].form.data.relationNumber = row.ctrNumber;
        that.formList[1].form.data.relationName = row.ctrName;
        that.formList[1].form.component[2].id = row.id;
        that.formList[1].form.component[2].number = row.ctrNumber;
        that.formList[1].form.component[2].name = row.ctrName;
      };
      this.$watch(
        function () {
          return this.formList[1].form.data.condType;
        },
        function (newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue === '1' && oldValue === '3') {//数据点触发
              this.formList[1].form.data.condValue = "";
              this.formList[1].form.component[4] = {
                classKey: "condValue",
                label: "运算值",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              };
              this.formList[1].form.component[2].idDisable = false;
              this.formList[1].form.component[3].idDisable = false;
              this.formList[1].form.rules.condOperator = [{
                required: true,
                message: "运算符不能为空",
                trigger: ["blur", "change"]
              }];
              this.formList[1].form.rules.relationName = [{
                required: true,
                message: "触发源不能为空",
                trigger: ["blur", "change"]
              }];
            } else if (newValue === '3' && oldValue === '1') {//时间触发
              this.formList[1].form.data.condValue = "";
              this.formList[1].form.component[4] = {
                classKey: "condValue",
                label: "运算值",
                tag: "el-date-picker",
                type: "datetime",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              };
              this.formList[1].form.component[2].idDisable = true;
              this.formList[1].form.component[3].idDisable = true;
              this.formList[1].form.rules.condOperator = [];
              this.formList[1].form.rules.relationName = [];
            }
          }
        }
      );
    },
    methods: {
      afterGetTablePage(tableData) {
        const options = ["不执行", "告警", "控制", "告警并控制"];
        tableData.forEach((tItem) => {
          tItem.auditStatus = tItem.auditStatus ? '已审核' : '未审核';
          tItem.callbackTypeName = options[tItem.callbackType];
        });
      },
      initTableDetail(data) {
        if (data) {
          this.tableDetailForm.idForm.data = data;
          this.tableDetailForm.idForm.data.orgId = this.$store.state.user.userInfo.orgId;//组织
          this.tableDetailForm.idForm.data.auditStatus = String(this.tableDetailForm.idForm.data.auditStatus);
          this.tableDetailForm.idForm.data.callbackType = String(this.tableDetailForm.idForm.data.callbackType);
        } else {
          this.tableDetailForm.idForm.data = {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId,//组织
            number: '',//触发器代码
            name: '',//触发器代码
            callbackType: '1',//执行类型
            note: '',//备注
            //审核相关
            createTime: '',//创建时间
            docMakerId: 0,//创建人id
            docMakerNumber: '',//制单人代码
            docMakerName: '',//制单人姓名
            auditStatus: '0',//审核状态
            auditPersonId: 0,//审核人id
            auditPersonNumber: '',//审核人代码
            auditPersonName: '',//审核人姓名
            auditTime: '',//审核时间
          };
        }
        //统一处理弹窗字段
        this.tableDetailForm.idForm.component[5].id = this.tableDetailForm.idForm.data.docMakerId;
        this.tableDetailForm.idForm.component[5].number = this.tableDetailForm.idForm.data.docMakerNumber;
        this.tableDetailForm.idForm.component[5].name = this.tableDetailForm.idForm.data.docMakerName;
        this.tableDetailForm.idForm.component[8].id = this.tableDetailForm.idForm.data.auditPersonId;
        this.tableDetailForm.idForm.component[8].number = this.tableDetailForm.idForm.data.auditPersonNumber;
        this.tableDetailForm.idForm.component[8].name = this.tableDetailForm.idForm.data.auditPersonName;
        //统一处理表单工具条展示问题
        if (this.tableDetailForm.idForm.data.id) {
          this.actionBarFormConfig = [
            new IdButtonConfig("button-add", "提交", "form-commit", {type: 'primary'}),
            {
              tag: "id-group-button",
              classKey: "create",
              childButton: [
                {
                  text: "新建",
                  target: "form-create",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: false,
                },
                {
                  text: "复制",
                  target: "form-copy",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: false,
                },
              ],
            },
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
              text: "审核",
              childButton: [
                {
                  text: "审核",
                  target: "form-audit",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: this.tableDetailForm.idForm.data.auditStatus === '1',
                },
                {
                  text: "反审核",
                  target: "form-antiAudit",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: this.tableDetailForm.idForm.data.auditStatus === '0',
                },
              ],
            },
            new IdButtonConfig("button-delete", "删除", "form-delete", {styleOne: true}),
          ];
        } else {
          this.actionBarFormConfig = [
            new IdButtonConfig("button-add", "提交", "form-commit", {type: 'primary'}),
            new IdButtonConfig("button-create", "重置", "form-create", {styleOne: true}),
          ];
        }
        //统一处理获取数据时的组件状态（根据审核\禁用状态）
        if (this.tableDetailForm.idForm.data.auditStatus === '0') {
          this.tableDetailForm.idForm.component.forEach((cItem) => cItem.idDisable = !!cItem.freeze);
        } else {
          this.tableDetailForm.idForm.component.forEach((cItem) => cItem.idDisable = true);
        }
        //处理审核后的表体操作栏问题
        this.formList.forEach((fItem) => {
          fItem.actionBarConfig.forEach((aItem) => {
            aItem.idDisable = this.tableDetailForm.idForm.data.auditStatus === '1'
          });
        });
      },
      beforeLeave() {
        this.tableDetailForm.idForm.component.forEach((cItem) => {
          if (cItem.tag === 'id-input-popup') {
            cItem.controlTooltipShow = false;
          }
        });
        this.$nextTick(() => {
          this.tableDetailForm.idForm.component.forEach((cItem) => {
            if (cItem.tag === 'id-input-popup') {
              cItem.controlTooltipShow = true;
            }
          });
        });
      },
      formListAlter(fromList, data, index) {
        if (index === 1) {
          const types = ["0", "数据点触发", "其他触发器触发", "时间触发"];
          data.forEach((dItem) => {
            dItem.condTypeName = types[dItem.condType];
          });
        }
        data.forEach((dItem) => {
          dItem.deleteable = dItem.auditStatus !== '0';
        });
      },
      initListDetail(index, row, callBack) {
        if (row) {
          if (index === 2) {
            callBack(index, false);
            return;
          }
          this.formList[index].form.data = {...row};
          this.formList[index].form.data.triggerId = this.tableDetailForm.idForm.data.id;
          callBack(index, this.tableDetailForm.idForm.data.auditStatus === '0');
          if (index === 1) {
            this.formList[1].form.data.newsTemplateId =
              String(this.formList[1].form.data.newsTemplateId
                ? this.formList[1].form.data.newsTemplateId : 1);
            this.formList[1].form.data.condType = String(this.formList[1].form.data.condType);

            //初始化 运算值组件 以及 组件的状态
            if (this.formList[1].form.data.condType === '1') {
              this.formList[1].form.component[4] = {
                classKey: "condValue",
                label: "运算值",
                tag: "el-date-picker",
                type: "datetime",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              };
              this.formList[1].form.component[2].idDisable = false;
              this.formList[1].form.component[3].idDisable = false;
              this.formList[1].form.rules.condOperator = [{
                required: true,
                message: "运算符不能为空",
                trigger: ["blur", "change"]
              }];
              this.formList[1].form.rules.relationName = [{
                required: true,
                message: "触发源不能为空",
                trigger: ["blur", "change"]
              }];
            } else {
              this.formList[1].form.component[4] = {
                classKey: "condValue",
                label: "运算值",
                tag: "el-date-picker",
                type: "datetime",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              };
              this.formList[1].form.component[2].idDisable = true;
              this.formList[1].form.component[3].idDisable = true;
              this.formList[1].form.rules.condOperator = [];
              this.formList[1].form.rules.relationName = [];
            }
          }
        } else {
          if (index === 0) {
            this.formList[0].form.data = {
              triggerId: this.tableDetailForm.idForm.data.id,//表单Id
              id: "",
              personId: 0,//人员ID
              personNumber: "",//人员代码
              personName: "",//人员名称
              userName: "",//帐号代码
              userNumber: "",//帐号名称
              orgId: this.$store.state.user.userInfo.orgId,
            };
          } else if (index === 1) {
            this.formList[1].form.data = {
              triggerId: this.tableDetailForm.idForm.data.id,//表单Id
              id: "",
              newsTitle: "",//告警标题
              condType: "",//触发类型
              relationId: 0,//触发源id
              relationNumber: '',//触发源代码
              relationName: '',//触发源名称
              condOperator: '>',//运算符
              condValue: '',//运算符
              newsContent: '',//告警内容
              newsTemplateId: '1',//告警模版id
              newsLevel: "一级",  //告警级别
              note: "",//备注
              orgId: this.$store.state.user.userInfo.orgId,
            };
          }
        }

        if (index === 0) {
          //处理数据点弹窗数据问题
          this.formList[0].form.component[0].id = this.formList[0].form.data.personId;
          this.formList[0].form.component[0].number = this.formList[0].form.data.personNumber;
          this.formList[0].form.component[0].name = this.formList[0].form.data.personName;
        } else if (index === 1) {
          //处理数据点弹窗数据问题
          this.formList[1].form.component[2].id = this.formList[1].form.data.relationId;
          this.formList[1].form.component[2].number = this.formList[1].form.data.relationNumber;
          this.formList[1].form.component[2].name = this.formList[1].form.data.relationName;
        }
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
