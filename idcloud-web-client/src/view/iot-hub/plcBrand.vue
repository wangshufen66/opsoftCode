<template>
  <id-tree-table-form-list
    tableErrTip="plc品牌型号"
    :isTree="false"
    :getTable="getTable"
    :getTableDetail="getTableDetail"
    :deleteTableDetails="deleteTableDetails"
    :addTableDetail="addTableDetail"
    :updateTableDetail="updateTableDetail"
    :actionBarConfig="actionBarConfig"
    :tableColumns="tableColumns"
    :actionBarFormConfig="actionBarFormConfig"
    :tableDetailForm="tableDetailForm"
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
    findMoList as getList,
    findMoDetail as getDetail,
    addMo as add,
    deleteMo as batchDel,
    updateMo as update,
    addList,
    updateList,
    delList,
  } from "@/api/iot-hub/plcBrand";
  import plcBrandTableColumns from "../tableColumns/plcBrandTableColumns";
  import infoPointTableColumns from "../tableColumns/infoPointTableColumns";
  import {getList as getPointList} from "@/api/iot-hub/infoPoint";

  export default {
    name: "plcBrand",
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
    },
    mixins: [],
    data() {
      return {
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
          ...plcBrandTableColumns
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
              number: '',//plc品牌型号代码
              plcBrand: '',//plc品牌
              plcModel: '',//plc型号
              name: '',//plc品牌型号描述
              note: '',//备注
            },
            rules: {
              number: [{required: true, message: "plc品牌型号代码不能为空", trigger: ['blur', 'change']}],
              plcBrand: [{required: true, message: "plc品牌不能为空", trigger: ['blur', 'change']}],
              plcModel: [{required: true, message: "plc型号不能为空", trigger: ['blur', 'change']}],
              name: [{required: true, message: "plc品牌型号描述不能为空", trigger: ['blur', 'change']}],
            },
            component: [
              //需要class化
              {
                classKey: "number",
                label: "plc品牌型号代码",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "plcBrand",
                label: "plc品牌",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "plcModel",
                label: "plc型号",
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
                label: "plc品牌型号描述",
                tag: "el-input",
                placeholder: "请输入",
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
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
            ],
          },
        },
        //表体配置
        formList: [
          {
            fromList: 'pointList',
            tableErrTip: '数据点',
            actionBarConfig: [
              new IdButtonConfig("list-add", "添加", "list-add", {type: "primary"}),
              new IdButtonConfig("list-delete", "删除", "list-delete", {styleOne: true}),
            ],
            tableColumns: [
              {
                tag: "el-table-column",
                label: "数据点代码",
                prop: "pointCodeNumber",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "数据点名称",
                prop: "pointCodeName",
                minWidth: 180,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "排序",
                prop: "sort",
                minWidth: 120,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "字段ID",
                prop: "hisCodeId",
                minWidth: 120,
                resizable: false,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "显示单位",
                prop: "unit",
                minWidth: 120,
                resizable: false,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "默认样式",
                prop: "styleName",
                minWidth: 120,
                resizable: false,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "on转义",
                prop: "escapeOn",
                minWidth: 120,
                resizable: false,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "off转义",
                prop: "escapeOff",
                minWidth: 120,
                resizable: false,
                showOverflowTooltip: true,
              },
              {
                tag: "el-table-column",
                label: "备注",
                prop: "mark",
                minWidth: 240,
                resizable: false,
                showOverflowTooltip: true,
              },
            ],
            form: {
              data: {
                plcBrandId: "",//表单Id
                id: "",
                collectionNumber: "",//云盒代码
                pointCodeId: 0,//数据点ID
                pointCodeNumber: "",//数据点代码
                pointCodeName: "",//数据点名称
                unit: "",//单位
                sort: 0,//排序
                hisCodeId: 0,//字段id
                style: '1',//显示样式
                escapeOn: "",//on转义
                escapeOff: "",//off转义
                mark: "",//备注
                orgId: this.$store.state.user.userInfo.orgId,
              },
              rules: {
                pointCodeName: [{required: true, message: "数据点名称不能为空", trigger: ["blur", "change"]}],
                sort: [{required: true, message: "排序不能为空", trigger: ["blur", "change"]}],
                hisCodeId: [{required: true, message: "字段ID不能为空", trigger: ["blur", "change"]}],
              },
              component: [
                {
                  classKey: "pointCodeName",
                  label: "数据点",
                  tag: "id-input-popup",
                  controlTooltipShow: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  getTableList: getPointList,
                  isTree: false,
                  isPage: false,
                  id: "",
                  number: "",
                  name: "",
                  tableColumns: infoPointTableColumns,
                  diaTitle: "控制点",
                  event: {},
                },
                {
                  classKey: "unit",
                  label: "单位",
                  tag: "el-input",
                  idLoad: false,
                  idIf: true,
                  idDisable: true,
                  idShow: true,
                },
                {
                  classKey: "sort",
                  label: "排序",
                  tag: "el-input-number",
                  placeholder: "请输入",
                  controlsPosition: "right",
                  min: 0,
                  max: 1000000000,
                  step: 1,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "hisCodeId",
                  label: "字段ID",
                  tag: "el-input-number",
                  placeholder: "请输入",
                  controlsPosition: "right",
                  min: 0,
                  max: 1000000000,
                  step: 1,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "style",
                  label: "显示样式",
                  tag: "id-select",
                  placeholder: "请选择",
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                  options: [
                    {
                      label: "默认",
                      value: "1",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "电表",
                      value: "2",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "水表",
                      value: "3",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "气表",
                      value: "4",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "温度",
                      value: "5",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "湿度",
                      value: "6",
                      authority: {
                        idLoad: false,
                        idIf: true,
                        idDisable: false,
                        idShow: true,
                      },
                    },
                    {
                      label: "燃气",
                      value: "7",
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
                  classKey: "escapeOn",
                  label: "on转义",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
                  idLoad: false,
                  idIf: true,
                  idDisable: false,
                  idShow: true,
                },
                {
                  classKey: "escapeOff",
                  label: "off转义",
                  tag: "el-input",
                  placeholder: "请输入",
                  clearable: true,
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
                  clearable: true,
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
      let that=this;
      this.formList[0].form.component[0].event.afterGetTablePage = function (tableData) {
        const options = ["瞬时值", "区间值"];
        tableData.forEach((dItem) => {
          dItem.type = options[dItem.type];
        });
      };
      this.formList[0].form.component[0].event.confirm = function (row) {
        that.formList[0].form.data.pointCodeId = row.id;
        that.formList[0].form.data.pointCodeNumber = row.number;
        that.formList[0].form.data.pointCodeName = row.name;
        that.formList[0].form.data.unit = row.unitName;
        that.formList[0].form.component[0].id = row.id;
        that.formList[0].form.component[0].number = row.number;
        that.formList[0].form.component[0].name = row.name;
      };
    },
    methods: {
      initTableDetail(data) {
        if (data) {
          this.tableDetailForm.idForm.data = data;
          this.tableDetailForm.idForm.data.orgId = this.$store.state.user.userInfo.orgId;//组织
        } else {
          this.tableDetailForm.idForm.data = {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId,//组织
            number: '',//plc品牌型号代码
            plcBrand: '',//plc品牌
            plcModel: '',//plc型号
            name: '',//plc品牌型号描述
            note: '',//备注
          };
        }
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
      formListAlter(fromList, data) {
        const types = ["0","默认", "电表", "水表", "气表", "温度" ,"湿度" , "燃气"];
        data.forEach((dItem) => {
          dItem.styleName = types[dItem.style];
        });
      },
      initListDetail(index, row, callBack) {
        if (row) {
          this.formList[0].form.data = {...row};
          this.formList[0].form.data.ruleId = this.tableDetailForm.idForm.data.id;
          this.formList[0].form.data.style = String(this.formList[0].form.data.style);
          callBack(index, true);
        } else {
          this.formList[0].form.data = {
            plcBrandId: this.tableDetailForm.idForm.data.id,//表单Id
            id: "",
            collectionNumber: "",//云盒代码
            pointCodeId: 0,//数据点ID
            pointCodeNumber: "",//数据点代码
            pointCodeName: "",//数据点名称
            unit: "",//单位
            sort: 0,//排序
            hisCodeId: 0,//字段id
            style: "1",//显示样式
            escapeOn: "",//on转义
            escapeOff: "",//off转义
            mark: "",//备注
            orgId: this.$store.state.user.userInfo.orgId,
          };
        }
        //处理数据点弹窗数据问题
        this.formList[0].form.component[0].id = this.formList[0].form.data.pointCodeId;
        this.formList[0].form.component[0].number = this.formList[0].form.data.pointCodeNumber;
        this.formList[0].form.component[0].name = this.formList[0].form.data.pointCodeName;
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
