<template>
  <div>
    <id-tree-table-form-list
      ref="page"
      tableErrTip="生产订单"
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
      @actionBarClick="actionBarClick"
      @afterGetTablePage="afterGetTablePage"
      @initTableDetail="initTableDetail"
      @beforeSubmit="beforeSubmit"
      @beforeLeave="beforeLeave"
      :formList="formList"
      @formListAlter="formListAlter"
      @initListDetail="initListDetail"
      @beforeListFormCommit="beforeListFormCommit"
    >
      <template v-slot:formListAction0="{ row ,column ,cIndex}">
        <el-button
          v-show="row.status===1"
          type="primary"
          plain size="mini" @click="listRowAction('委外发出',row)">委外发出
        </el-button>
        <el-button
          v-show="row.status===3"
          style="margin-left: 0.2rem"
          type="primary"
          plain size="mini" @click="numFormShow('委外接受',row)">委外接受
        </el-button>
      </template>
    </id-tree-table-form-list>
    <el-dialog
      :visible.sync="numForm.show"
      @closed="formClose(numForm.tableErrTip)"
    >
      <id-form
        :ref="numForm.tableErrTip"
        class="dia-form"
        :id-form="numForm.form"
        label-width="80px"
      ></id-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ numForm.tableErrTip }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="formClose(numForm.tableErrTip)">取消</el-button>
        <el-button type="primary" @click="formConfirm(numForm.tableErrTip)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import IdTreeTableFormList from "@/components/id-pages/IdTreeTableFormList";
  import IdForm from "@/components/id-form/index";
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
    outsource,
    receive,
    issued,
    antiIssued,
    hang,
    antiHang,
    end,
    antiEnd
  } from "@/api/productionManagement/productionPlan";
  import {
    getProducePlanTemplate,
    importProducePlanTemplate,
  } from "@/api/productionManagement/excelupdownload";
  import {
    findMaterialList as getMaterialList,
    getGroupList as getMaterialGroupList
  } from "@/api/factoryModel/material";
  import {materialInputPopupColumns} from "../tableColumns/materialTableColumns";
  import {
    getList as getCustomerList,
    getGroupList as getCustomerGroupList
  } from "@/api/basicData/customer";
  import {
    getList as getProdProcessList,
    getGroupList as getProdProcessGroupList
  } from "@/api/factoryModel/prodProcess";
  import {processInputPopupColumns} from "../tableColumns/pordProcessTableColumns";
  import {
    getList as getDeviceList,
    getGroupList as getDeviceGroupList
  } from "@/api/deviceMaintenance/deviceArchive";
  import {deviceInputPopupColumns} from "../tableColumns/deviceTableColumns";

  export default {
    name: "productionPlan",
    components: {
      IdTreeTableFormList,
      IdForm,
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
        // 委外接收
        numForm: {
          show: false,
          tableErrTip: '委外接收',
          form: {
            data: {
              id: "",
              num: 0,//加工数量
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              num: [{required: true, message: "加工数量不能为空", trigger: ["blur", "change"]}],
            },
            component: [
              {
                classKey: "num",
                label: "加工数量",
                tag: "el-input-number",
                placeholder: "请输入",
                controlsPosition: "right",
                min: 1,
                max: 1000000000000,
                step: 1,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            ],
          },
        },
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
          {
            tag: "id-dropdown",
            text: '下达',
            childButton: [
              {
                text: "下达",
                target: "issued",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: "反下达",
                target: "antiIssued",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ]
          },
          {
            tag: "id-dropdown",
            text: '挂起',
            childButton: [
              {
                text: "挂起",
                target: "hang",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: "反挂起",
                target: "antiHang",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ]
          },
          {
            tag: "id-dropdown",
            text: '结案',
            childButton: [
              {
                text: "结案",
                target: "end",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: "反结案",
                target: "antiEnd",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ]
          },
          {
            tag: "id-excel",
            excelName: "生产订单",
            getTemplate: getProducePlanTemplate,
            importTemplate: importProducePlanTemplate,
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
            label: "订单号",
            prop: "orderNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "客户代码",
            prop: "clientNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "客户名称",
            prop: "clientName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "任务单编号",
            prop: "taskNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "产品代码",
            prop: "materialNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "产品名称",
            prop: "materialName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "状态",
            prop: "status",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "Select",
            options: [
              {
                label: "创建",
                value: "0",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                label: "下达",
                value: "1",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                label: "执行",
                value: "2",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                label: "结案",
                value: "3",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                label: "挂起",
                value: "4",
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
            label: "数量",
            prop: "orderNum",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "Number",
          },
          {
            tag: "el-table-column",
            label: "计划开始时间",
            prop: "planStartTime",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "计划结束时间",
            prop: "planEndTime",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "实际开始时间",
            prop: "actualStartTime",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "实际结束时间",
            prop: "actualEndTime",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "制单人代码",
            prop: "docMakePersonNo",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "制单人姓名",
            prop: "docMakePersonName",
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
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "审核状态",
            prop: "auditStatus",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "Checkbox",
          },
          {
            tag: "el-table-column",
            label: "审核人代码",
            prop: "auditPersonNo",
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
          labelWidth: '110px',
          idForm: {
            data: {
              id: '',
              orgId: this.$store.state.user.userInfo.orgId,//组织
              orderNo: '',//订单号
              clientId: 0,//客户内码
              clientNo: '',//客户代码
              clientName: '',//客户名称
              taskNo: '',//任务单编号
              materialId: 0,//产品内码
              materialNo: '',//产品代码
              materialName: '',//产品名称
              orderNum: 0,//订单产量
              status: '0',//状态
              planStartTime: '',//计划开始时间
              planEndTime: '',//计划结束时间
              planTime: [],//计划时间
              actualStartTime: '',//实际开始时间
              actualEndTime: '',//实际结束时间
              //审核相关
              createTime: '',//创建时间
              docMakerId: 0,//创建人id
              docMakerNo: '',//制单人代码
              docMakerName: '',//制单人姓名
              updateTime: '',//最后更新时间
              auditStatus: '0',//审核状态
              auditPersonId: 0,//审核人id
              auditPersonNo: '',//审核人代码
              auditPersonName: '',//审核人姓名
              auditTime: '',//审核时间
            },
            rules: {
              orderNo: [{required: true, message: "订单号不能为空", trigger: ['blur', 'change']}],
              clientName: [{required: true, message: "客户名称不能为空", trigger: ['blur', 'change']}],
              taskNo: [{required: true, message: "任务单编号不能为空", trigger: ['blur', 'change']}],
              materialName: [{required: true, message: "产品名称不能为空", trigger: ['blur', 'change']}],
              orderNum: [{required: true, message: "订单产量不能为空", trigger: ['blur', 'change']}],
              // planStartTime:[{required: true, message: "计划开始时间不能为空", trigger: ['blur', 'change']}],
              // planEndTime:[{required: true, message: "计划结束时间不能为空", trigger: ['blur', 'change']}],
              planTime: [{required: true, message: "计划时间不能为空", trigger: ['blur', 'change']}],
            },
            component: [
              //需要class化
              {
                classKey: "orderNo",
                label: "订单号",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "clientName",
                label: "客户",
                tag: "id-input-popup",
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getCustomerList,
                getTreeList: getCustomerGroupList,
                isTree: true,
                isPage: false,
                id: "",
                number: "",
                name: "",
                tableColumns: [
                  {
                    tag: "el-table-column",
                    label: "客户代码",
                    prop: "number",
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "客户名称",
                    prop: "name",
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "客户地址",
                    prop: "address",
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "客户电话",
                    prop: "phone",
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "客户传真",
                    prop: "fax",
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "客户邮箱",
                    prop: "email",
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "邮政代码",
                    prop: "postCode",
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "联系人",
                    prop: "contactName",
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "联系人电话",
                    prop: "contactPhone",
                    minWidth: 180,
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
                  }
                ],
                diaTitle: "客户",
                event: {},
              },
              {
                classKey: "taskNo",
                label: "任务单编号",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "materialName",
                label: "产品",
                tag: "id-input-popup",
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getMaterialList,
                getTreeList: getMaterialGroupList,
                isTree: true,
                isPage: false,
                id: "",
                number: "",
                name: "",
                tableColumns: materialInputPopupColumns,
                diaTitle: "产品",
                event: {},
              },
              {
                classKey: "orderNum",
                label: "订单产量",
                tag: "el-input-number",
                controlsPosition: "right",
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "status",
                label: "工单状态",
                tag: "id-select",
                options: [
                  {
                    label: "创建",
                    value: "0",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "下达",
                    value: "1",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "执行",
                    value: "2",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "结案",
                    value: "3",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "挂起",
                    value: "4",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                ],
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "planTime",
                label: "加工日期",
                tag: "el-date-picker",
                type: "daterange",
                rangeSeparator: "-",
                startPlaceholder: "开始日期",
                endPlaceholder: "结束日期",
                valueFormat: 'yyyy-MM-dd',
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "actualStartTime",
                label: "实际开始时间",
                tag: "el-date-picker",
                type: "date",
                valueFormat: 'yyyy-MM-dd',
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: "actualEndTime",
                label: "实际结束时间",
                tag: "el-date-picker",
                type: "date",
                valueFormat: 'yyyy-MM-dd',
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
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
                getTableList: getDeviceGroupList,
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
                getTableList: getDeviceGroupList,
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
            fromList: 'processList',
            tableErrTip: '生产工序',
            actionBarConfig: [
              new IdButtonConfig("list-add", "添加", "list-add", {type: "primary"}),
              new IdButtonConfig("list-delete", "删除", "list-delete", {styleOne: true}),
            ],
            tableColumns: [
              {
                tag: "el-table-column",
                label: "工序代码",
                prop: "processNo",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "工序名称",
                prop: "processName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "计划产量",
                prop: "planNum",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "实际产量",
                prop: "finishNum",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "合格数量",
                prop: "qualifiedNum",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "不良数量",
                prop: "unqualifiedNum",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "状态",
                prop: "statusName",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "标准加工时间",
                prop: "standardTime",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "加工系数",
                prop: "coefficient",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "设备",
                prop: "deviceListName",
                minWidth: 360,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "计划开始时间",
                prop: "planStartTime",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "计划结束时间",
                prop: "planEndTime",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "实际开始时间",
                prop: "actualStartTime",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "实际结束时间",
                prop: "actualEndTime",
                minWidth: 180,
                resizable: false,
                showOverflowTooltip: true,
              },
            ],
            customWidth: "180px",
            form: {
              data: {
                orderId: "",//表单Id
                id: "",
                processId: 0,
                processNo: '',
                processName: '',
                coefficient: 1,
                standardTime: 0,
                planTime: [],
                deviceList: [],
                deviceName: '',
                num: 0,//产量 委外接收时使用
                orgId: this.$store.state.user.userInfo.orgId,
              },
              rules: {
                processName: [{required: true, message: '备件不能为空', trigger: ["blur", "change"]}],
                coefficient: [{required: true, message: '系数不能为空', trigger: ["blur", "change"]}],
                planTime: [{required: true, message: '计划时间不能为空', trigger: ["blur", "change"]}],
              },
              component: [
                {
                  classKey: "processName",
                  label: "工序",
                  tag: "id-input-popup",
                  controlTooltipShow: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  getTableList: getProdProcessList,
                  getTreeList: getProdProcessGroupList,
                  isTree: true,
                  isPage: false,
                  id: "",
                  number: "",
                  name: "",
                  tableColumns: processInputPopupColumns,
                  diaTitle: "工序",
                  event: {},
                },
                {
                  classKey: "coefficient",
                  label: "加工系数",
                  tag: "el-input-number",
                  placeholder: "请输入",
                  controlsPosition: "right",
                  min: 1,
                  max: 1000000000000,
                  step: 1,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "standardTime",
                  label: "标准加工时间",
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
                {
                  classKey: "planTime",
                  label: "计划时间",
                  tag: "el-date-picker",
                  type: "datetimerange",
                  valueFormat: "yyyy-MM-dd HH:mm:ss",
                  rangeSeparator: "-",
                  startPlaceholder: "开始时间",
                  endPlaceholder: "结束时间",
                  placeholder: "选择时间范围",
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "deviceName",
                  label: "设备",
                  tag: "id-input-popup",
                  controlTooltipShow: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  getTableList: getDeviceList,
                  getTreeList: getDeviceGroupList,
                  isTree: true,
                  isPage: false,
                  isTableSelection: true,
                  id: "",
                  number: "",
                  name: "",
                  tableColumns: deviceInputPopupColumns,
                  diaTitle: "设备",
                  event: {},
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
      this.tableDetailForm.idForm.component[1].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.tableDetailForm.idForm.component[1].event.confirm = function (row) {
        that.tableDetailForm.idForm.data.clientId = row.id;
        that.tableDetailForm.idForm.data.clientNo = row.number;
        that.tableDetailForm.idForm.data.clientName = row.name;
        that.tableDetailForm.idForm.component[1].id = row.id;
        that.tableDetailForm.idForm.component[1].number = row.number;
        that.tableDetailForm.idForm.component[1].name = row.name;
      };
      this.tableDetailForm.idForm.component[3].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
        filterData.orderType = 1;
      };
      this.tableDetailForm.idForm.component[3].event.afterGetTablePage = function (tableData) {
        const options = ["外购", "自制", "委外", "虚拟件", "配置"];
        tableData.forEach((tItem) => {
          tItem.attribute = options[tItem.attribute];
          tItem.isKeyModel = tItem.isKeyModel ? '是' : '否';
          tItem.batchNumberManagementStatus = tItem.batchNumberManagementStatus ? '是' : '否';
          tItem.serialNumberManagementStatus = tItem.serialNumberManagementStatus ? '是' : '否';
        });
      };
      this.tableDetailForm.idForm.component[3].event.confirm = function (row) {
        that.tableDetailForm.idForm.data.materialId = row.id;
        that.tableDetailForm.idForm.data.materialNo = row.number;
        that.tableDetailForm.idForm.data.materialName = row.name;
        that.tableDetailForm.idForm.component[3].id = row.id;
        that.tableDetailForm.idForm.component[3].number = row.number;
        that.tableDetailForm.idForm.component[3].name = row.name;
      };

      this.formList[0].form.component[0].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.formList[0].form.component[0].event.afterGetTablePage = function (tableData) {
        tableData.forEach((dItem) => {
          dItem.isKey = dItem.isKey ? '是' : '否';
        });
      };
      this.formList[0].form.component[0].event.confirm = function (row) {
        that.formList[0].form.data.processId = row.id;
        that.formList[0].form.data.processNo = row.number;
        that.formList[0].form.data.processName = row.name;
        that.formList[0].form.component[0].id = row.id;
        that.formList[0].form.component[0].number = row.number;
        that.formList[0].form.component[0].name = row.name;
      };
      this.formList[0].form.component[4].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.formList[0].form.component[4].event.confirm = function (rows) {
        that.formList[0].form.data.deviceList = rows;
        that.formList[0].form.component[4].name = "";
        rows.forEach((rItem, rIndex) => {
          if (rIndex === 0) that.formList[0].form.component[4].name += rItem.name;
          else that.formList[0].form.component[4].name += "," + rItem.name;
        });
      };
    },
    methods: {
      // 下达|挂起|反挂起
      // 表头/表单
      actionBarClick( target, value,tableSelectData){
        switch (target) {
          case "issued":
            this.sendRequest(tableSelectData,null,issued,"下达");
            break;
          case "antiIssued":
            this.sendRequest(tableSelectData,null,antiIssued,"反下达");
            break;
          case "hang":
            this.sendRequest(tableSelectData,null,hang,"挂起");
            break;
          case "antiHang":
            this.sendRequest(tableSelectData,null,antiHang,"反挂起");
            break;
          case "end":
            this.sendRequest(tableSelectData,null,end,"结案");
            break;
          case "antiEnd":
            this.sendRequest(tableSelectData,null,antiEnd,"反结案");
            break;
          case "form-issued":
            this.sendRequest(null,1,issued,"下达");
            break;
          case "form-antiIssued":
            this.sendRequest(null,1,antiIssued,"反下达");
            break;
          case "form-hang":
            this.sendRequest(null,1,hang,"挂起");
            break;
          case "form-antiHang":
            this.sendRequest(null,1,antiHang,"反挂起");
            break;
          case "form-end":
            this.sendRequest(null,1,end,"结案");
            break;
          case "form-antiEnd":
            this.sendRequest(null,1,antiEnd,"反结案");
            break;
        }
      },
      // 请求网络
      async sendRequest(rows, flag,request,text) {
        let params = [];
        if (!rows) rows = [this.tableDetailForm.idForm.data];
        if (rows.length === 0)
          return;
        rows.forEach(item => params.push({id: item.id}));
        request(params).then(response => {
          response = response.data;
          if (response.code === 200) {
            this.$message.success(`${text}成功`);
            this.$refs['page'].handleQueryData();
            if (flag) this.$refs['page'].editTableForm(rows[0]);
          } else {
            this.$notifyError(`${text}失败`, response.msg);
          }
        }).catch(response => {
          this.$notifyError(`${text}失败`, '异常信息：' + response);
        })
      },
      //表体 完工\审核  数量
      //弹窗打开
      numFormShow(ref,row){
        this.numForm.tableErrTip = ref;
        this.numForm.form.data = {
          id: row.id,
          num: 0,//加工数量
          orgId: this.$store.state.user.userInfo.orgId,
          ...row
        };
        this.$nextTick(() => {
          this.numForm.show = true;
        });
      },
      // 弹窗关闭
      formClose(ref) {
        this.numForm.show = false;
        this.$nextTick(() => {
          this.$refs[ref].$refs['idForm'].resetFields();
        });
      },
      // 下面方法可以抽成一个
      // 弹窗确认
      async formConfirm(ref) {
        this.$refs[ref].$refs['idForm'].validate(async (valid) => {
          if (valid) {
            await receive(this.numForm.form.data).then(response => {
              response = response.data;
              if (response.code === 200) {
                this.$message.success(`${ref}成功`);
                this.formClose(ref);
                this.$refs['page'].handleQueryData();
                this.$refs['page'].editTableForm(this.tableDetailForm.idForm.data);
              } else {
                this.$notifyError(`${ref}失败`, response.msg);
              }
            }).catch(response => {
              this.$notifyError(`${ref}失败`, '异常信息：' + response);
            })
          } else {
            this.$message.error("*为必填项");
          }
        });
      },
      //表单列表自定义操作
      async listRowAction(target, row) {
        await outsource([row]).then(response => {
          response = response.data;
          if (response.code === 200) {
            this.$message.success(`${target}成功`);
            this.$refs['page'].handleQueryData();
            this.$refs['page'].editTableForm(this.tableDetailForm.idForm.data);
          } else {
            this.$notifyError(`${target}失败`, response.msg);
          }
        }).catch(response => {
          this.$notifyError(`${target}失败`, '异常信息：' + response);
        })
      },
      //自身api
      afterGetTablePage(tableData) {
        tableData.forEach((tItem) => {
          tItem.auditStatus = tItem.auditStatus ? '已审核' : '未审核';
        });
      },
      initTableDetail(data) {
        if (data) {
          this.tableDetailForm.idForm.data = data;
          this.tableDetailForm.idForm.data.orgId = this.$store.state.user.userInfo.orgId;//组织
          this.tableDetailForm.idForm.data.auditStatus = String(this.tableDetailForm.idForm.data.auditStatus);
          this.tableDetailForm.idForm.data.status = String(this.tableDetailForm.idForm.data.status);
          this.tableDetailForm.idForm.data.planTime = [
            this.tableDetailForm.idForm.data.planStartTime,
            this.tableDetailForm.idForm.data.planEndTime
          ];
        } else {
          this.tableDetailForm.idForm.data = {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId,//组织
            orderNo: '',//订单号
            clientId: 0,//客户内码
            clientNo: '',//客户代码
            clientName: '',//客户名称
            taskNo: '',//任务单编号
            materialId: 0,//产品内码
            materialNo: '',//产品代码
            materialName: '',//产品名称
            orderNum: 0,//订单产量
            status: '0',//状态
            planStartTime: '',//计划开始时间
            planEndTime: '',//计划结束时间
            planTime: [],//计划时间
            actualStartTime: '',//实际开始时间
            actualEndTime: '',//实际结束时间
            //审核相关
            createTime: '',//创建时间
            docMakerId: 0,//创建人id
            docMakerNo: '',//制单人代码
            docMakerName: '',//制单人姓名
            updateTime: '',//最后更新时间
            auditStatus: '0',//审核状态
            auditPersonId: 0,//审核人id
            auditPersonNo: '',//审核人代码
            auditPersonName: '',//审核人姓名
            auditTime: '',//审核时间
          };
        }
        //统一处理弹窗字段
        this.tableDetailForm.idForm.component[1].id = this.tableDetailForm.idForm.data.clientId;
        this.tableDetailForm.idForm.component[1].number = this.tableDetailForm.idForm.data.clientNo;
        this.tableDetailForm.idForm.component[1].name = this.tableDetailForm.idForm.data.clientName;
        this.tableDetailForm.idForm.component[3].id = this.tableDetailForm.idForm.data.materialId;
        this.tableDetailForm.idForm.component[3].number = this.tableDetailForm.idForm.data.materialNo;
        this.tableDetailForm.idForm.component[3].name = this.tableDetailForm.idForm.data.materialName;
        this.tableDetailForm.idForm.component[10].id = this.tableDetailForm.idForm.data.docMakerId;
        this.tableDetailForm.idForm.component[10].number = this.tableDetailForm.idForm.data.docMakerNo;
        this.tableDetailForm.idForm.component[10].name = this.tableDetailForm.idForm.data.docMakerName;
        this.tableDetailForm.idForm.component[13].id = this.tableDetailForm.idForm.data.auditPersonId;
        this.tableDetailForm.idForm.component[13].number = this.tableDetailForm.idForm.data.auditPersonNo;
        this.tableDetailForm.idForm.component[13].name = this.tableDetailForm.idForm.data.auditPersonName;
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
            {
              tag: "id-dropdown",
              text: '下达',
              childButton: [
                {
                  text: "下达",
                  target: "form-issued",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: this.tableDetailForm.idForm.data.auditStatus!=='1'||this.tableDetailForm.idForm.data.status!=='0',
                },
                {
                  text: "反下达",
                  target: "form-antiIssued",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: this.tableDetailForm.idForm.data.status!=='1',
                },
              ]
            },
            {
              tag: "id-dropdown",
              text: '挂起',
              childButton: [
                {
                  text: "挂起",
                  target: "form-hang",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: this.tableDetailForm.idForm.data.status!=='2',
                },
                {
                  text: "反挂起",
                  target: "form-antiHang",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: this.tableDetailForm.idForm.data.status!=='4',
                },
              ]
            },
            {
              tag: "id-dropdown",
              text: '结案',
              childButton: [
                {
                  text: "结案",
                  target: "form-end",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: false,
                },
                {
                  text: "反结案",
                  target: "form-antiEnd",
                  idLoad: false,
                  idIf: true,
                  idShow: true,
                  idDisable: this.tableDetailForm.idForm.data.status!=='3',
                },
              ]
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
            aItem.idDisable = this.tableDetailForm.idForm.data.status !== '1'&&this.tableDetailForm.idForm.data.status!=='0'
          });
        });
      },
      beforeSubmit(data) {
        data.planStartTime = data.planTime[0];
        data.planEndTime = data.planTime[1];
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
        const statuses = ['创建', '计划', '执行', '委外', '关闭'];
        data.forEach((dItem) => {
          dItem.deleteable = dItem.status !== 1&&dItem.status!==0;
          dItem.statusName = statuses[dItem.status];
          dItem.deviceListName = "";
          if (dItem.deviceList)
            dItem.deviceList.forEach((rItem, rIndex) => {
              if (rIndex === 0) dItem.deviceListName += rItem.name;
              else dItem.deviceListName += "," + rItem.name;
            });
        });
      },
      initListDetail(index, row, callBack) {
        if (row) {
          this.formList[0].form.data = {...row};
          this.formList[0].form.data.orderId = this.tableDetailForm.idForm.data.id;
          this.formList[0].form.data.planTime = [row.planStartTime, row.planEndTime];
          callBack(index, true);
        } else {
          this.formList[0].form.data = {
            orderId: this.tableDetailForm.idForm.data.id,//表单Id
            id: "",
            processId: 0,
            processNo: '',
            processName: '',
            coefficient: 1,
            standardTime: 0,
            planTime: [],
            deviceList: [],
            deviceName: '',
            num: 0,//产量 委外接收时使用
            orgId: this.$store.state.user.userInfo.orgId,
          };
        }
        //处理数据点弹窗数据问题
        this.formList[0].form.component[0].id = this.formList[0].form.data.processId;
        this.formList[0].form.component[0].numer = this.formList[0].form.data.processNo;
        this.formList[0].form.component[0].name = this.formList[0].form.data.processName;
        this.formList[0].form.component[4].name = "";
        this.formList[0].form.data.deviceList.forEach((rItem, rIndex) => {
          if (rIndex === 0) this.formList[0].form.component[4].name += rItem.name;
          else this.formList[0].form.component[4].name += "," + rItem.name;
        });
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
      beforeListFormCommit(data, index, mess) {
        data.planStartTime = data.planTime[0];
        data.planEndTime = data.planTime[1];
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
