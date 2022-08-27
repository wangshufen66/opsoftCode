<template>
  <id-tree-table-form
    tableErrTip="部门"
    :treeType="10"
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
  >
  </id-tree-table-form>
</template>

<script>
  import IdTreeTableForm from "@/components/id-pages/IdTreeTableForm";
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
    getGroupList
  } from "@/api/basicData/department";
  import {configAll} from "@/components/id-tree/idTreeConfig";
  import {
    getDepartmentTemplate,
    importDepartmentTemplate,
  } from "@/api/basicData/excelupdownload";
  import treeTableFormADMixins from "@/mixins/treeTableFormADMixins";
  import {clerkInputPopupColumns} from "../tableColumns/clerkTableColumns";
  import {getList as getClerkList,getGroupList as getClerkGroupList} from "@/api/basicData/clerk";
  import departmentTableColumns from "../tableColumns/departmentTableColumns";

  export default {
    name: "department",
    components: {
      IdTreeTableForm,
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
    mixins: [treeTableFormADMixins],
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
            excelName: "部门",
            getTemplate: getDepartmentTemplate,
            importTemplate: importDepartmentTemplate,
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
          ...departmentTableColumns
        ], //测试表格列配置
        //表单工具行配置
        actionBarFormConfig: [],
        //表单配置
        tableDetailForm: {
          labelWidth: '120px',
          idForm: {
            data: {
              id: '',
              orgId: this.$store.state.user.userInfo.orgId,//组织
              number: '',//部门代码
              name: '',//部门名称
              type: '0',//部门类别
              managerId: 0,//负责人内码
              managerNumber: '',//负责人代码
              managerName: '',//负责人名称
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
              name: [{required: true, message: "部门名称不能为空", trigger: ['blur', 'change']}],
              type: [{required: true, message: "部门属性不能为空", trigger: ['blur', 'change']}],
            },
            component: [
              //需要class化
              {
                classKey: "number",
                label: "部门代码",
                tag: "el-input",
                placeholder: "可自动生成",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "name",
                label: "部门名称",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "type",
                label: "部门属性",
                tag: "id-select",
                placeholder: "请选择",
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                options: [
                  {
                    label: "生产类",
                    value: "0",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "管理类",
                    value: "1",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: "辅助类",
                    value: "2",
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  }
                ],
              },
              {
                classKey: "managerName",
                label: "班长",
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
                diaTitle: "员工",
                event: {},
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
      }
    },
    created() {
      let that = this;
      this.tableDetailForm.idForm.component[3].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.tableDetailForm.idForm.component[3].event.afterGetTablePage = function (tableData) {
        const options = ["在职","试用","实习","退休","离职","离休"];
        tableData.forEach((tItem) => {
          tItem.type = options[tItem.type];
        });
      };
      this.tableDetailForm.idForm.component[3].event.confirm = function (row) {
        that.tableDetailForm.idForm.data.managerId = row.id;
        that.tableDetailForm.idForm.data.managerNumber = row.number;
        that.tableDetailForm.idForm.data.managerName = row.name;
        that.tableDetailForm.idForm.component[3].id = row.id;
        that.tableDetailForm.idForm.component[3].number = row.number;
        that.tableDetailForm.idForm.component[3].name = row.name;
      };
      this.tableDetailForm.idForm.component[4].event.confirm = function (row) {
        that.tableDetailForm.idForm.data.groupId = row.id;
        that.tableDetailForm.idForm.data.groupNumber = row.number;
        that.tableDetailForm.idForm.data.groupName = row.name;
        that.tableDetailForm.idForm.component[4].id = row.id;
        that.tableDetailForm.idForm.component[4].number = row.number;
        that.tableDetailForm.idForm.component[4].name = row.name;
      };
    },
    methods: {
      beforeGetTableList(filterData) {
        filterData.showAll = this.actionBarConfig[5].vModel;
      },
      afterGetTablePage(tableData) {
        const options = ["生产类", "管理类", "辅助类"];
        tableData.forEach((tItem) => {
          tItem.auditStatus = tItem.auditStatus ? '已审核' : '未审核';
          tItem.isDisable = tItem.isDisable ? '已禁用' : '未禁用';
          tItem.type = options[tItem.type];
        });
      },
      initTableDetail(data,treeSelectData) {
        if (data) {
          this.tableDetailForm.idForm.data = data;
          this.tableDetailForm.idForm.data.auditStatus = String(this.tableDetailForm.idForm.data.auditStatus);
          this.tableDetailForm.idForm.data.isDisable = String(this.tableDetailForm.idForm.data.isDisable);
          this.tableDetailForm.idForm.data.type = String(this.tableDetailForm.idForm.data.type);
        } else {
          this.tableDetailForm.idForm.data = {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId,//组织
            number: '',//部门代码
            name: '',//部门名称
            type: '0',//部门类别
            managerId: 0,//负责人内码
            managerNumber: '',//负责人代码
            managerName: '',//负责人名称
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
            groupId: treeSelectData?treeSelectData.id:0,//分组内码
            groupNumber: treeSelectData?treeSelectData.number:"000",//分组代码
            groupName: treeSelectData?treeSelectData.name:"部门",//分组名称
          };
        }
        //统一处理字段的可编辑
        this.handleCompDisable(
          this.tableDetailForm.idForm.data.auditStatus,
          this.tableDetailForm.idForm.data.isDisable
        );
        //修改负责人弹窗问题
        this.handleInputPopup('managerName',
          this.tableDetailForm.idForm.data.managerId,
          this.tableDetailForm.idForm.data.managerNumber,
          this.tableDetailForm.idForm.data.managerName
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
        //统一处理工具条展示问题
        this.handleBarFormConfig(
          this.tableDetailForm.idForm.data.auditStatus,
          this.tableDetailForm.idForm.data.isDisable
        );
      },
    }
  }
</script>
