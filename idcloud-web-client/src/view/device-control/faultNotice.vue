<template>
  <id-tree-table-form-list
    tableErrTip="故障通知"
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
  } from "@/api/device-control/faultNotice";
  import {
    getList as getDeviceList,
    getGroupList as getDeviceGroupList
  } from "@/api/deviceMaintenance/deviceArchive";
  import {deviceInputPopupColumns} from "../tableColumns/deviceTableColumns";
  import {
    getList as getClerkList,
    getGroupList as getClerkGroupList
  } from "@/api/basicData/clerk";
  import {clerkInputPopupColumns} from "../tableColumns/clerkTableColumns";

  export default {
    name: "faultNotice",
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
            label: "设备代码",
            prop: "deviceNumber",
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
            label: "处理方式",
            prop: "dealName",
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
            resizable:false,
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
              archiveId:0,//设备id
              deviceNumber:'',//设备代码
              deviceName:'',//设备名称
              dealName:'',//处理方式
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
              deviceName: [{required: true, message: "设备不能为空", trigger: ['blur', 'change']}],
            },
            component: [
              //需要class化
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
                id: "",
                number: "",
                name: "",
                tableColumns:deviceInputPopupColumns,
                diaTitle: "设备",
                event: {},
              },
              {
                classKey: "dealName",
                label: "处理方式",
                tag: "el-input",
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
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
                noticeId: "",//表单Id
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
          }
        ],
      }
    },
    created() {
      let that=this;
      this.tableDetailForm.idForm.component[0].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.tableDetailForm.idForm.component[0].event.confirm = function (row) {
        that.tableDetailForm.idForm.data.archiveId = row.id;
        that.tableDetailForm.idForm.data.deviceNumber = row.number;
        that.tableDetailForm.idForm.data.deviceName = row.name;
        that.tableDetailForm.idForm.component[0].id = row.id;
        that.tableDetailForm.idForm.component[0].number = row.number;
        that.tableDetailForm.idForm.component[0].name = row.name;
      };
      this.formList[0].form.component[0].event.beforeGetTableList = function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
      this.formList[0].form.component[0].event.afterGetTablePage = function (tableData) {
        const options = ["在职","试用","实习","退休","离职","离休"];
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
    },
    methods: {
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
        } else {
          this.tableDetailForm.idForm.data = {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId,//组织
            archiveId:0,//设备id
            deviceNumber:'',//设备代码
            deviceName:'',//设备名称
            dealName:'',//处理方式
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
        this.tableDetailForm.idForm.component[0].id = this.tableDetailForm.idForm.data.archiveId;
        this.tableDetailForm.idForm.component[0].number = this.tableDetailForm.idForm.data.deviceNumber;
        this.tableDetailForm.idForm.component[0].name = this.tableDetailForm.idForm.data.deviceName;
        this.tableDetailForm.idForm.component[4].id = this.tableDetailForm.idForm.data.docMakerId;
        this.tableDetailForm.idForm.component[4].number = this.tableDetailForm.idForm.data.docMakerNumber;
        this.tableDetailForm.idForm.component[4].name = this.tableDetailForm.idForm.data.docMakerName;
        this.tableDetailForm.idForm.component[7].id = this.tableDetailForm.idForm.data.auditPersonId;
        this.tableDetailForm.idForm.component[7].number = this.tableDetailForm.idForm.data.auditPersonNumber;
        this.tableDetailForm.idForm.component[7].name = this.tableDetailForm.idForm.data.auditPersonName;
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
        this.formList.forEach((fItem)=>{
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
        data.forEach((dItem) => {
          dItem.deleteable = dItem.auditStatus !== '0';
        });
      },
      initListDetail(index, row, callBack) {
        if (row) {
          this.formList[0].form.data = {...row};
          this.formList[0].form.data.noticeId = this.tableDetailForm.idForm.data.id;
          callBack(index, this.tableDetailForm.idForm.data.auditStatus === '0');
        } else {
          this.formList[0].form.data = {
            noticeId: this.tableDetailForm.idForm.data.id,//表单Id
            id: "",
            personId: 0,//人员ID
            personNumber: "",//人员代码
            personName: "",//人员名称
            userName: "",//帐号代码
            userNumber: "",//帐号名称
            orgId: this.$store.state.user.userInfo.orgId,
          };
        }
        //处理数据点弹窗数据问题
        this.formList[0].form.component[0].id = this.formList[0].form.data.personId;
        this.formList[0].form.component[0].number = this.formList[0].form.data.personNumber;
        this.formList[0].form.component[0].name = this.formList[0].form.data.personName;
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

