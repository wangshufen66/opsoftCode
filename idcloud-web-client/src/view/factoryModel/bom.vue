<template>
  <id-tree-table-form-list
    tableErrTip="BOM"
    :treeType="17"
    :treeActionBar="treeActionBar"
    :getTable="getTable"
    :getTableDetail="getTableDetail"
    :deleteTableDetails="deleteTableDetails"
    :addTableDetail="addTableDetail"
    :updateTableDetail="updateTableDetail"
    :audit="audit"
    :antiAudit="antiAudit"
    :disable="disable"
    :antiDisable="antiDisable"
    :setFieldList="setFieldList"
    :getFieldList="getFieldList"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    @beforeGetTableList="beforeGetTableList"
    @afterGetTablePage="afterGetTablePage"
    :actionBarFormConfig="actionBarFormConfig"
    :tableDetailForm="tableDetailForm"
    @initTableDetail="initTableDetail"
    @beforeLeave="beforeLeave"
    :formList="formList"
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
    disable,
    antiDisable,
    getFieldList,
    setFieldList,
    getGroupList,
    addBomInfo,
    updateBomInfo,
    batchDelBomInfo,
  } from "@/api/factoryModel/bom";
  import {configAll} from "@/components/id-tree/idTreeConfig";
  import {
    getBomTemplate,
    importBomTemplate,
  } from "@/api/factoryModel/excelupdownload";
  import treeTableFormListADMixins from "@/mixins/treeTableFormListADMixins";
  import {materialInputPopupColumns} from "../tableColumns/materialTableColumns";
  import {
    findMaterialList as getMaterialList,
    getGroupList as getMaterialGroupList
  } from "@/api/factoryModel/material";
  import {processInputPopupColumns} from "../tableColumns/pordProcessTableColumns";
  import {
    getList as getProcessList,
    getGroupList as getProcessGroupList
  } from "@/api/factoryModel/prodProcess";

  export default {
    name: "bom",
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
      disable() {
        return disable;
      },
      antiDisable() {
        return antiDisable;
      },
      getFieldList() {
        return getFieldList;
      },
      setFieldList() {
        return setFieldList;
      },
    },
    mixins: [treeTableFormListADMixins],
    data() {
      return {
        //左树的操作栏设定
        treeActionBar: configAll,
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
            text: '禁用',
            childButton: [
              {
                text: "禁用",
                target: "disable",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: "反禁用",
                target: "antiDisable",
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ]
          },
          {
            tag: "id-excel",
            excelName: "BOM",
            getTemplate: getBomTemplate,
            importTemplate: importBomTemplate,
          },
          {
            tag: "el-checkbox",
            classKey: "showAll",
            label: "显示所有",
            target: "showAll",
            vModel: false,
            styleTwo: true,
          },
          // new IdButtonConfig("button-set", "显示字段设置", "set", {
          //   styleTwo: true,
          //   beforeIf: true,
          //   beforeClass: "el-icon-setting",
          // }),
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
            label: "BOM代码",
            prop: "number",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "是否跳层",
            prop: "isJumpLevel",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "Checkbox",
          },
          {
            tag: "el-table-column",
            label: "版本号",
            prop: "version",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "产品代码",
            prop: "productNumber",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "产品名称",
            prop: "productName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "产品规格型号",
            prop: "specification",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "产品类型",
            prop: "materialAttribute",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Select",
            options: [
              {
                label: "外购",
                value: "0",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                label: "自制",
                value: "1",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                label: "委外",
                value: "2",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                label: "虚拟件",
                value: "3",
                authority: {
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
              },
              {
                label: "配置",
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
            label: "计量单位",
            prop: "unitName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "数量",
            prop: "quantity",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "Number",
          },
          {
            tag: "el-table-column",
            label: "成品率",
            prop: "yieldRate",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "Number",
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
        ], //测试表格列配置
        //表单工具行配置
        actionBarFormConfig: [],
        //表单配置
        tableDetailForm: {
          labelWidth: '140px',
          idForm: {
            data: {
              id: '',
              orgId: this.$store.state.user.userInfo.orgId,//组织
              number: '',//BOM代码
              version: '',//版本号
              isJumpLevel: false,//是否跳层
              productId: 0,//产品id（即物料）
              productNumber: '',//产品代码
              productName: '',//产品名称
              specification: '',//物料规格型号
              materialType: '',//物料类型
              unitId: 0,//计量单位ID
              unitName: '',//计量单位
              quantity: 0,//数量
              yieldRate: 0,//成品率
              note: '',//备注
              //需要model化
              createTime: '',//创建时间
              docMakerId: 0,//创建人id
              docMakerNumber: '',//制单人代码
              docMakerName: '',//制单人姓名
              auditStatus: '0',//审核状态
              auditPersonId: 0,//审核人id
              auditPersonNumber: '',//审核人代码
              auditPersonName: '',//审核人姓名
              auditTime: '',//审核时间
              isDisable: "false",//禁用状态
              disablePersonId: 0,//禁用人id
              disablePersonNumber: '',//禁用人代码
              disablePersonName: '',//禁用人姓名
              disableTime: '',//禁用时间
              updateTime: '',//最后更新时间
              groupId: 0,//分组内码
              groupNumber: '',//分组代码
              groupName: '',//分组名称
            },
            rules: {
              productName: [{required: true, message: "产品名称不能为空", trigger: ['blur', 'change']}],
              quantity: [{required: true, message: "数量不能为空", trigger: ['blur', 'change']}],
            },
            component: [
              //需要class化
              {
                classKey: "number",
                label: "BOM代码",
                tag: "el-input",
                placeholder: "可自动生成",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "version",
                label: "版本号",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "isJumpLevel",
                label: "是否跳层",
                tag: "el-checkbox",
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "productName",
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
                classKey: "specification",
                label: "产品规格型号",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "materialType",
                label: "产品类型",
                tag: "id-select",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                options: [
                  {
                    label: "外购",
                    value: "0",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "自制",
                    value: "1",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "委外",
                    value: "2",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "虚拟件",
                    value: "3",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "配置",
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
                classKey: "unitName",
                label: "计量单位",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "quantity",
                label: "数量",
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
                classKey: "yieldRate",
                label: "成品率",
                tag: "el-input-number",
                placeholder: "请输入",
                controlsPosition: "right",
                min: 0,
                max: 100,
                step: 0.01,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              //需要model化
              {
                classKey: "groupName",
                label: "分组",
                tag: "id-input-popup",
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getGroupList,
                isTree: false,
                isPage: true,
                id: "",
                number: "",
                name: "",
                //设备档案列表 需要抽离
                tableColumns: [
                  {
                    tag: "el-table-column",
                    label: "代码",
                    prop: "number",
                    width: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "名称",
                    prop: "name",
                    width: 180,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                  {
                    tag: "el-table-column",
                    label: "备注",
                    prop: "mark",
                    width: 500,
                    showOverflowTooltip: true,
                    comp: "String",
                  },
                ],
                diaTitle: "分组",
                event: {},
              },
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
              //需要写进一个地方  方便调用
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
                getTableList: getGroupList,
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
                getTableList: getGroupList,
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
              {
                classKey: "isDisable",
                label: "禁用状态",
                tag: "id-select",
                options: [
                  {
                    value: "false",
                    label: "未禁用",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    value: "true",
                    label: "已禁用",
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
                classKey: "disablePersonName",
                label: "禁用人",
                tag: "id-input-popup",
                controlTooltipShow: true,
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
                isTree: false,
                getTableList: getGroupList,
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
                classKey: "disableTime",
                label: "禁用时间",
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
            fromList: 'bomInfoList',
            tableErrTip: '物料',
            actionBarConfig: [
              new IdButtonConfig("list-add", "添加", "list-add", {type: "primary"}),
              new IdButtonConfig("list-delete", "删除", "list-delete", {styleOne: true}),
            ],
            tableColumns: [
              {
                tag: "el-table-column",
                label: "物料代码",
                prop: "materialNumber",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "物料名称",
                prop: "materialName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "计量单位代码",
                prop: "materialUnitNumber",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "计量单位名称",
                prop: "materialUnitName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "用量",
                prop: "usageAmount",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "损耗率",
                prop: "lossRate",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "工序代码",
                prop: "workProcessNumber",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "工序名称",
                prop: "workProcessName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "工位号",
                prop: "workstationNo",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "备注",
                prop: "note",
                minWidth: 240,
                showOverflowTooltip: true,
              },
            ],
            form: {
              data: {
                bomId: "",//表单Id
                id: "",
                materialId: 0,//物料
                materialNumber: "",
                materialName: "",
                materialUnitId: 0,//单位
                materialUnitNumber: "",
                materialUnitName: "",
                usageAmount: 0,//用量
                lossRate: 0,//损耗率
                workProcessId: 0,//工序
                workProcessNumber: "",
                workProcessName: "",
                workstationNo: 0,//工位号
                note: "",
                orgId: this.$store.state.user.userInfo.orgId,
              },
              rules: {
                materialName: [{required: true, message: "物料不能为空", trigger: ["blur", "change"]}],
                usageAmount: [{required: true, message: "用量不能为空", trigger: ["blur", "change"]}],
              },
              component: [
                {
                  classKey: "materialName",
                  label: "物料",
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
                  diaTitle: "物料",
                  event: {},
                },
                {
                  classKey: "materialUnitNumber",
                  label: "计量单位代码",
                  tag: "el-input",
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "materialUnitName",
                  label: "计量单位名称",
                  tag: "el-input",
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "usageAmount",
                  label: "用量",
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
                  classKey: "lossRate",
                  label: "损耗率",
                  tag: "el-input-number",
                  placeholder: "请输入",
                  controlsPosition: "right",
                  min: 0,
                  max: 100,
                  step: 0.01,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "workProcessName",
                  label: "工序",
                  tag: "id-input-popup",
                  controlTooltipShow: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  getTableList: getProcessList,
                  getTreeList: getProcessGroupList,
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
                  classKey: "workstationNo",
                  label: "工位号",
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
                  classKey: "note",
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
            add: addBomInfo,
            update: updateBomInfo,
            delete: batchDelBomInfo,
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
        const options = ["外购", "自制", "委外", "虚拟件", "配置"];
        tableData.forEach((tItem) => {
          tItem.attribute = options[tItem.attribute];
          tItem.isKeyModel = tItem.isKeyModel ? '是' : '否';
          tItem.batchNumberManagementStatus = tItem.batchNumberManagementStatus ? '是' : '否';
          tItem.serialNumberManagementStatus = tItem.serialNumberManagementStatus ? '是' : '否';
        });
      };
      this.formList[0].form.component[0].event.confirm = function (row) {
        that.formList[0].form.data.materialId = row.id;
        that.formList[0].form.data.materialNumber = row.number;
        that.formList[0].form.data.materialName = row.name;
        that.formList[0].form.data.materialUnitId = row.unitId;
        that.formList[0].form.data.materialUnitNumber = row.unitNumber;
        that.formList[0].form.data.materialUnitName = row.unitName;
        that.formList[0].form.component[0].id = row.id;
        that.formList[0].form.component[0].number = row.number;
        that.formList[0].form.component[0].name = row.name;
      };
      this.formList[0].form.component[5].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.formList[0].form.component[5].event.afterGetTablePage = function (tableData) {
        tableData.forEach((tItem) => {
          tItem.isKey = tItem.isKey ? '是' : '否';
        });
      };
      this.formList[0].form.component[5].event.confirm = function (row) {
        that.formList[0].form.data.workProcessId = row.id;
        that.formList[0].form.data.workProcessNumber = row.number;
        that.formList[0].form.data.workProcessName = row.name;
        that.formList[0].form.component[5].id = row.id;
        that.formList[0].form.component[5].number = row.number;
        that.formList[0].form.component[5].name = row.name;
      };
      this.tableDetailForm.idForm.component[3].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
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
        that.tableDetailForm.idForm.data.productId = row.id;
        that.tableDetailForm.idForm.data.productNumber = row.number;
        that.tableDetailForm.idForm.data.productName = row.name;
        that.tableDetailForm.idForm.data.specification = row.specification;
        that.tableDetailForm.idForm.data.materialType = String(row.attribute);
        that.tableDetailForm.idForm.data.unitId = row.unitId;//计量单位ID
        that.tableDetailForm.idForm.data.unitName = row.unitName;
        that.tableDetailForm.idForm.component[3].id = row.id;
        that.tableDetailForm.idForm.component[3].number = row.number;
        that.tableDetailForm.idForm.component[3].name = row.name;
      };
      this.tableDetailForm.idForm.component[9].event.confirm = function (row) {
        that.tableDetailForm.idForm.data.groupId = row.id;
        that.tableDetailForm.idForm.data.groupNumber = row.number;
        that.tableDetailForm.idForm.data.groupName = row.name;
        that.tableDetailForm.idForm.component[9].id = row.id;
        that.tableDetailForm.idForm.component[9].number = row.number;
        that.tableDetailForm.idForm.component[9].name = row.name;
      };
    },
    methods: {
      beforeGetTableList(filterData) {
        filterData.showAll = this.actionBarConfig[5].vModel;
      },
      afterGetTablePage(tableData) {
        const options = ["外购", "自制", "委外", "虚拟件", "配置"];
        tableData.forEach((tItem) => {
          tItem.auditStatus = tItem.auditStatus ? '已审核' : '未审核';
          tItem.isDisable = tItem.isDisable ? '已禁用' : '未禁用';
          tItem.materialAttribute = options[tItem.materialAttribute];
          tItem.isJumpLevel = tItem.isJumpLevel ? '是' : '否';
        });
      },
      initTableDetail(data, treeSelectData) {
        if (data) {
          this.tableDetailForm.idForm.data = data;
          this.tableDetailForm.idForm.data.auditStatus = String(this.tableDetailForm.idForm.data.auditStatus);
          this.tableDetailForm.idForm.data.isDisable = String(this.tableDetailForm.idForm.data.isDisable);
          this.tableDetailForm.idForm.data.materialType = String(this.tableDetailForm.idForm.data.materialAttribute);
        } else {
          this.tableDetailForm.idForm.data = {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId,//组织
            number: '',//BOM代码
            version: '',//版本号
            isJumpLevel: false,//是否跳层
            productId: 0,//产品id（即物料）
            productNumber: '',//产品代码
            productName: '',//产品名称
            specification: '',//物料规格型号
            materialType: '',//物料类型
            unitName: '',//计量单位
            quantity: 0,//数量
            yieldRate: 0,//成品率
            note: '',//备注
            //需要model化
            createTime: '',//创建时间
            docMakerId: 0,//创建人id
            docMakerNumber: '',//制单人代码
            docMakerName: '',//制单人姓名
            auditStatus: '0',//审核状态
            auditPersonId: 0,//审核人id
            auditPersonNumber: '',//审核人代码
            auditPersonName: '',//审核人姓名
            auditTime: '',//审核时间
            isDisable: "false",//禁用状态
            disablePersonId: 0,//禁用人id
            disablePersonNumber: '',//禁用人代码
            disablePersonName: '',//禁用人姓名
            disableTime: '',//禁用时间
            updateTime: '',//最后更新时间
            groupId: treeSelectData ? treeSelectData.id : 0,//分组内码
            groupNumber: treeSelectData ? treeSelectData.number : "000",//分组代码
            groupName: treeSelectData ? treeSelectData.name : "BOM",//分组名称
          };
        }
        //统一处理字段的可编辑
        this.handleCompDisable(
          this.tableDetailForm.idForm.data.auditStatus,
          this.tableDetailForm.idForm.data.isDisable
        );
        //处理产品弹窗遗留问题
        this.handleInputPopup('productName',
          this.tableDetailForm.idForm.data.productId,
          this.tableDetailForm.idForm.data.productNumber,
          this.tableDetailForm.idForm.data.productName
        );
        //统一处理弹窗遗留问题
        this.handleInputPopup('groupName',
          this.tableDetailForm.idForm.data.groupId,
          this.tableDetailForm.idForm.data.groupNumber,
          this.tableDetailForm.idForm.data.groupName
        );
        this.handleInputPopup('docMakerName',
          this.tableDetailForm.idForm.data.docMakerId,
          this.tableDetailForm.idForm.data.docMakerNumber,
          this.tableDetailForm.idForm.data.docMakerName
        );
        this.handleInputPopup('auditPersonName',
          this.tableDetailForm.idForm.data.auditPersonId,
          this.tableDetailForm.idForm.data.auditPersonNumber,
          this.tableDetailForm.idForm.data.auditPersonName
        );
        this.handleInputPopup('disablePersonName',
          this.tableDetailForm.idForm.data.disablePersonId,
          this.tableDetailForm.idForm.data.disablePersonNumber,
          this.tableDetailForm.idForm.data.disablePersonName
        );
      },
      initListDetail(index, row, callBack) {
        if (row) {
          this.formList[0].form.data = row;
          this.formList[0].form.data.bomId = this.tableDetailForm.idForm.data.id;
          if (this.tableDetailForm.idForm.data.auditStatus === '0' &&
            this.tableDetailForm.idForm.data.isDisable === 'false')
            callBack(index, true);
        } else {
          this.formList[0].form.data = {
            bomId: this.tableDetailForm.idForm.data.id,//表单Id
            id: "",
            materialId: 0,//物料
            materialNumber: "",
            materialName: "",
            materialUnitId: 0,//单位
            materialUnitNumber: "",
            materialUnitName: "",
            usageAmount: 0,//用量
            lossRate: 0,//损耗率
            workProcessId: 0,//工序
            workProcessNumber: "",
            workProcessName: "",
            workstationNo: 0,//工位号
            note: "",
            orgId: this.$store.state.user.userInfo.orgId,
          };
        }
        //统一处理弹窗遗留问题
        this.handleListInputPopup('materialName', 0,
          this.formList[0].form.data.materialId,
          this.formList[0].form.data.materialNumber,
          this.formList[0].form.data.materialName
        );
        this.handleListInputPopup('workProcessName', 0,
          this.formList[0].form.data.workProcessId,
          this.formList[0].form.data.workProcessNumber,
          this.formList[0].form.data.workProcessName
        );
        //清除弹窗
        this.clearListInputPopup();
      }
    }
  }
</script>
