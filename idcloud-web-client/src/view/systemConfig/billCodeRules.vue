<template>
  <id-tree-table-form-list
    tableErrTip="单据编码规则"
    :treeActionBar="treeActionBar"
    :getGroupList="getGroupList"
    :getTable="getTable"
    :getTableDetail="getTableDetail"
    :deleteTableDetails="deleteTableDetails"
    :addTableDetail="addTableDetail"
    :updateTableDetail="updateTableDetail"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    @beforeGetTableList="beforeGetTableList"
    @afterGetTablePage="afterGetTablePage"
    :actionBarFormConfig="actionBarFormConfig"
    :tableDetailForm="tableDetailForm"
    @initTableDetail="initTableDetail"
    @formListAlter="formListAlter"
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
    getGroupList,
    addDocRuleInfo,
    updateDocRuleInfo,
    batchDelDocRuleInfo,
  } from "@/api/systemConfig/billCodeRules";
  import {configBase} from "@/components/id-tree/idTreeConfig";
  import treeTableFormListADMixins from "@/mixins/treeTableFormListADMixins";

  export default {
    name: "billCodeRules",
    components: {
      IdTreeTableFormList,
    },
    computed: {
      getGroupList() {
        return getGroupList;
      },
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
    },
    mixins: [treeTableFormListADMixins],
    data() {
      return {
        //左树的操作栏设定
        treeActionBar: configBase,
        //操作栏相关配置----------------------------
        actionBarConfig: [
          new IdButtonConfig("button-add", "添加", "add", {type: "primary"}),
          new IdButtonConfig("button-delete", "删除", "delete", {styleOne: true}),
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
            label: "单据编码规则代码",
            prop: "number",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "单据编码规则名称",
            prop: "name",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "业务对象名称",
            prop: "businessName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "默认规则",
            prop: "isDefault",
            minWidth: 120,
            showOverflowTooltip: true,
            comp: "Checkbox",
          },
          {
            tag: "el-table-column",
            label: "编辑修改",
            prop: "allowEdit",
            minWidth: 120,
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
              number: '',//单据编码规则代码
              name: '',//单据编码规则名称
              isDefault: false,//默认规则
              allowEdit: false,//允许编辑修改
              note: '',//备注
              //需要model化
              createTime: '',//创建时间
              docMakerId: 0,//创建人id
              docMakerNumber: '',//制单人代码
              docMakerName: '',//制单人姓名
              updateTime: '',//最后更新时间
              //特别
              businessObjId: 0,//对象内码
              businessObjCode: '',//对象代码
              businessName: '',//对象名称
            },
            rules: {
              number: [{required: true, message: "单据编码规则代码不能为空", trigger: ['blur', 'change']}],
              name: [{required: true, message: "单据编码规则名称不能为空", trigger: ['blur', 'change']}],
              isDefault: [{required: true, message: "默认规则不能为空", trigger: ['blur', 'change']}],
              allowEdit: [{required: true, message: "允许编辑修改不能为空", trigger: ['blur', 'change']}],
            },
            component: [
              //需要class化
              {
                classKey: "number",
                label: "单据编码规则代码",
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
                label: "单据编码规则名称",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "isDefault",
                label: "默认规则",
                tag: "el-checkbox",
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "allowEdit",
                label: "允许编辑修改",
                tag: "el-checkbox",
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "businessName",
                label: "对象名称",
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
            ],
          },
        },
        //表体配置
        formList: [
          {
            fromList: 'ruleInfos',
            tableErrTip: '编码规则',
            actionBarConfig: [
              new IdButtonConfig("list-add", "添加", "list-add", {type: "primary"}),
              new IdButtonConfig("list-delete", "删除", "list-delete", {styleOne: true}),
            ],
            tableColumns: [
              {
                tag: "el-table-column",
                label: "类型",
                prop: "typeName",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "长度",
                prop: "length",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "格式",
                prop: "formatter",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "设置值",
                prop: "val",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "起始值",
                prop: "startValue",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "步长",
                prop: "step",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "替代符",
                prop: "substitutionCharacter",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "补位符",
                prop: "complementCharacter",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "分隔符",
                prop: "split",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "右截断",
                prop: "rightTruncatedName",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "右填充",
                prop: "rightFillName",
                minWidth: 120,
                showOverflowTooltip: true,
              },
            ],
            form: {
              data: {
                ruleId: "",//表单Id
                id: "",
                type: "",//类型 1常量、2流水号、3日期、4文本
                length: 0,//长度
                formatter: "",//格式
                val: "",//设置值
                startValue: 0,//起始值
                step: 0,//步长
                substitutionCharacter: "",//替代符
                complementCharacter: "",//补位符
                split: "",//分隔符
                rightTruncated: false,//右截断
                rightFill: false,//右填充
                orgId: this.$store.state.user.userInfo.orgId,
              },
              rules: {
                type: [{required: true, message: "类型不能为空", trigger: ["blur", "change"]}],
              },
              component: [
                {
                  classKey: "type",
                  label: "类别",
                  tag: "id-select",
                  placeholder: "请选择",
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  options: [
                    {
                      label: "常量",
                      value: "1",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "流水号",
                      value: "2",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "日期",
                      value: "3",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "文本",
                      value: "4",
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
                  classKey: "length",
                  label: "长度",
                  tag: "el-input-number",
                  placeholder: "请输入",
                  controlsPosition: "right",
                  min: 0,
                  max: 30,
                  step: 1,
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "formatter",
                  label: "格式",
                  tag: "id-select",
                  placeholder: "请选择",
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                  options: [
                    {
                      value: 'yyyy-MM-dd',
                      label: 'yyyy-MM-dd',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yyyyMMdd',
                      label: 'yyyyMMdd',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yyyy.MM.dd',
                      label: 'yyyy.MM.dd',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yy.MM.dd',
                      label: 'yy.MM.dd',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yyMMdd',
                      label: 'yyMMdd',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yy-MM-dd',
                      label: 'yy-MM-dd',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yyyy.MM',
                      label: 'yyyy.MM',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yyyy-MM',
                      label: 'yyyy-MM',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yyyyMM',
                      label: 'yyyyMM',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yy.MM',
                      label: 'yy.MM',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yyMM',
                      label: 'yyMM',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'MMyy',
                      label: 'MMyy',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yy-MM',
                      label: 'yy-MM',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yyyy',
                      label: 'yyyy',
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      value: 'yy',
                      label: 'yy',
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
                  classKey: "val",
                  label: "设置值",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "startValue",
                  label: "起始值",
                  tag: "el-input-number",
                  placeholder: "请输入",
                  controlsPosition: "right",
                  min: 0,
                  max: 100,
                  step: 1,
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "step",
                  label: "步长",
                  tag: "el-input-number",
                  placeholder: "请输入",
                  controlsPosition: "right",
                  min: 0,
                  max: 100,
                  step: 1,
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "substitutionCharacter",
                  label: "替代符",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "complementCharacter",
                  label: "补位符",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "split",
                  label: "分隔符",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "rightTruncated",
                  label: "右截断",
                  tag: "el-checkbox",
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "rightFill",
                  label: "右填充",
                  tag: "el-checkbox",
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
              ],
            },
            add: addDocRuleInfo,
            update: updateDocRuleInfo,
            delete: batchDelDocRuleInfo,
          }
        ],
      }
    },
    created() {
      //此处逻辑需要优化
      this.$watch(
        function () {
          return this.formList[0].form.data.type;
        },
        function (newValue, oldValue) {
          if (newValue !== oldValue && !this.formList[0].form.data.id && newValue) {
            this.formList[0].form.data.length = 0;//长度
            this.formList[0].form.data.formatter = "";//格式
            this.formList[0].form.data.val = "";//设置值
            this.formList[0].form.data.startValue = 0;//起始值
            this.formList[0].form.data.step = 0;//步长
            this.formList[0].form.data.substitutionCharacter = "";//替代符
            this.formList[0].form.data.complementCharacter = "";//补位符
            this.formList[0].form.data.split = "";//分隔符
            this.formList[0].form.data.rightTruncated = false;//右截断
            this.formList[0].form.data.rightFill = false;//右填充
            this.handleListComponentDisable(newValue);
          } else if (!this.formList[0].form.data.id && !newValue) {
            this.formList[0].form.component.forEach((cItem) => {
              cItem.idDisable = true;
            });
            this.formList[0].form.component[0].idDisable = false;
          } else if (this.formList[0].form.data.id && newValue && newValue !== oldValue && oldValue) {
            this.formList[0].form.data.length = 0;//长度
            this.formList[0].form.data.formatter = "";//格式
            this.formList[0].form.data.val = "";//设置值
            this.formList[0].form.data.startValue = 0;//起始值
            this.formList[0].form.data.step = 0;//步长
            this.formList[0].form.data.substitutionCharacter = "";//替代符
            this.formList[0].form.data.complementCharacter = "";//补位符
            this.formList[0].form.data.split = "";//分隔符
            this.formList[0].form.data.rightTruncated = false;//右截断
            this.formList[0].form.data.rightFill = false;//右填充
            this.handleListComponentDisable(newValue);
          } else
            this.handleListComponentDisable(newValue);
        }
      );
      this.$watch(
        function () {
          return this.formList[0].form.data.formatter;
        },
        function (newValue, oldValue) {
          if (newValue) {
            this.formList[0].form.data.length = newValue.length;
          }
        }
      );
      this.$watch(
        function () {
          return this.formList[0].form.data.val;
        },
        function (newValue, oldValue) {
          if (newValue && this.formList[0].form.data.type === '1') {
            this.formList[0].form.data.length = newValue.length;
          }
        }
      );
    },
    methods: {
      beforeGetTableList(filterData) {
        filterData.showAll = true;
        filterData.businessObjId = filterData.groupId;
        filterData.groupId = undefined;
      },
      afterGetTablePage(tableData) {
        tableData.forEach((tItem) => {
          tItem.isDefault = tItem.isDefault ? '是' : '否';
          tItem.allowEdit = tItem.allowEdit ? '是' : '否';
        });
      },
      initTableDetail(data, treeSelectData) {
        if (data) {
          this.tableDetailForm.idForm.data = data;
          this.tableDetailForm.idForm.data.isDefault = String(this.tableDetailForm.idForm.data.isDefault);
          this.tableDetailForm.idForm.data.allowEdit = String(this.tableDetailForm.idForm.data.allowEdit);
        } else {
          this.tableDetailForm.idForm.data = {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId,//组织
            number: '',//单据编码规则代码
            name: '',//单据编码规则名称
            isDefault: false,//默认规则
            allowEdit: false,//允许编辑修改
            note: '',//备注
            //需要model化
            createTime: '',//创建时间
            docMakerId: 0,//创建人id
            docMakerNumber: '',//制单人代码
            docMakerName: '',//制单人姓名
            updateTime: '',//最后更新时间
            businessObjId: treeSelectData ? treeSelectData.id : 0,//分组内码
            businessObjCode: treeSelectData ? treeSelectData.number : "",//分组代码
            businessName: treeSelectData ? treeSelectData.name : "",//分组名称
          };
        }
        //统一处理弹窗遗留问题
        this.handleInputPopup('docMakerName',
          this.tableDetailForm.idForm.data.docMakerId,
          this.tableDetailForm.idForm.data.docMakerNumber,
          this.tableDetailForm.idForm.data.docMakerName
        );
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
            new IdButtonConfig("button-delete", "删除", "form-delete", {styleOne: true}),
          ];
        } else {
          this.actionBarFormConfig = [
            new IdButtonConfig("button-add", "提交", "form-commit", {type: 'primary'}),
            new IdButtonConfig("button-create", "重置", "form-create", {styleOne: true}),
          ];
        }
      },
      formListAlter(fromList, data) {
        const types = ["0", "常量", "流水号", "日期", "文本"];
        data.forEach((dItem) => {
          dItem.typeName = types[dItem.type];
          dItem.rightTruncatedName = dItem.rightTruncated ? '是' : '否';
          dItem.rightFillName = dItem.rightFill ? '是' : '否';
        });
      },
      initListDetail(index, row, callBack) {
        if (row) {
          this.formList[0].form.data = {...row};
          this.formList[0].form.data.ruleId = this.tableDetailForm.idForm.data.id;
          this.formList[0].form.data.type = String(row.type);
          callBack(index,true);
        } else {
          this.formList[0].form.data = {
            ruleId: this.tableDetailForm.idForm.data.id,//表单Id
            id: "",
            type: "",//类型 1常量、2流水号、3日期4文本
            length: "",//长度
            formatter: "",//格式
            val: "",//设置值
            startValue: 0,//起始值
            step: 0,//步长
            substitutionCharacter: "",//替代符
            complementCharacter: "",//补位符
            split: "",//分隔符
            rightTruncated: false,//右截断
            rightFill: false,//右填充
            orgId: this.$store.state.user.userInfo.orgId,
          };
        }
        //清除弹窗
        this.clearListInputPopup();
      },
      //特殊处理 列表的弹窗组件是否disable
      handleListComponentDisable(newValue) {
        this.formList[0].form.component.forEach((cItem) => {
          cItem.idDisable = false;
        });
        switch (newValue) {
          //1常量、2流水号、3日期4文本
          case "1":
            this.formList[0].form.component[1].idDisable = true;
            this.formList[0].form.component[2].idDisable = true;
            this.formList[0].form.component[4].idDisable = true;
            this.formList[0].form.component[5].idDisable = true;
            this.formList[0].form.component[6].idDisable = true;
            this.formList[0].form.component[7].idDisable = true;
            this.formList[0].form.component[9].idDisable = true;
            this.formList[0].form.component[10].idDisable = true;
            break;
          case "2":
            this.formList[0].form.component[2].idDisable = true;
            this.formList[0].form.component[3].idDisable = true;
            this.formList[0].form.component[6].idDisable = true;
            break;
          case "3":
            this.formList[0].form.component[1].idDisable = true;
            this.formList[0].form.component[3].idDisable = true;
            this.formList[0].form.component[4].idDisable = true;
            this.formList[0].form.component[5].idDisable = true;
            this.formList[0].form.component[6].idDisable = true;
            this.formList[0].form.component[7].idDisable = true;
            this.formList[0].form.component[9].idDisable = true;
            this.formList[0].form.component[10].idDisable = true;
            break;
          case "4":
            this.formList[0].form.component[2].idDisable = true;
            this.formList[0].form.component[4].idDisable = true;
            this.formList[0].form.component[5].idDisable = true;
            this.formList[0].form.component[6].idDisable = true;
            break;
        }
      }
    }
  }
</script>

