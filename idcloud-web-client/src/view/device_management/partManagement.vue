<template>
  <id-tree-table-form-list tableErrTip="备件管理" :isTree="false" :getTable="getTable" :getTableDetail="getTableDetail" :deleteTableDetails="deleteTableDetails" :addTableDetail="addTableDetail" :updateTableDetail="updateTableDetail" :audit="audit" :antiAudit="antiAudit" :disable="disable" :antiDisable="antiDisable" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" @afterGetTablePage="afterGetTablePage" :actionBarFormConfig="actionBarFormConfig" :tableDetailForm="tableDetailForm" @initTableDetail="initTableDetail" @beforeLeave="beforeLeave" :formList="formList" @initListDetail="initListDetail">
  </id-tree-table-form-list>
</template>

<script>
import IdTreeTableFormList from '@/components/id-pages/IdTreeTableFormList';
import IdButtonConfig from '@/components/id-button/IdButtonConfig';
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
  addList,
  updateList,
  batchDelList,
} from '@/api/deviceMaintenance/partManagement';
import treeTableFormListADMixins from '@/mixins/treeTableFormListADMixins';
import { clerkInputPopupColumns } from '../tableColumns/clerkTableColumns';
import {
  getList as getClerkList,
  getGroupList as getClerkGroupList,
} from '@/api/basicData/clerk';
import {
  getList as getWorkOrderList,
  // getGroupList as getWorkOrderGroupList
} from '@/api/deviceMaintenance/deviceRepair';
import { getMaterialSparePart } from '@/api/factoryModel/material';
import { materialInputPopupColumns } from '../tableColumns/materialTableColumns';
import { deviceInputPopupColumns } from '../tableColumns/deviceTableColumns';
import {
  getList as getDeviceList,
  getGroupList as getDeviceGroupList,
} from '@/api/deviceMaintenance/deviceArchive';

export default {
  name: 'partManagement',
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
  },
  mixins: [treeTableFormListADMixins],
  data() {
    return {
      //操作栏相关配置----------------------------
      actionBarConfig: [
        new IdButtonConfig('button-add', '添加', 'add', { type: 'primary' }),
        new IdButtonConfig('button-delete', '删除', 'delete', {
          styleOne: true,
        }),
        {
          tag: 'id-dropdown',
          text: '审核',
          childButton: [
            {
              text: '审核',
              target: 'audit',
              idLoad: false,
              idIf: true,
              idShow: true,
              idDisable: false,
            },
            {
              text: '反审核',
              target: 'antiAudit',
              idLoad: false,
              idIf: true,
              idShow: true,
              idDisable: false,
            },
          ],
        },
        {
          tag: 'id-dropdown',
          text: '禁用',
          childButton: [
            {
              text: '禁用',
              target: 'disable',
              idLoad: false,
              idIf: true,
              idShow: true,
              idDisable: false,
            },
            {
              text: '反禁用',
              target: 'antiDisable',
              idLoad: false,
              idIf: true,
              idShow: true,
              idDisable: false,
            },
          ],
        },
        new IdButtonConfig('button-fresh', '刷新', 'fresh', {
          styleTwo: true,
          beforeIf: true,
          beforeClass: 'el-icon-refresh-right',
        }),
      ],
      //表格table配置
      tableColumns: [
        {
          tag: 'el-table-column',
          label: '#',
          fixed: 'left',
          align: 'center',
          type: 'selection',
          width: 45,
          selectable: function (row, index) {
            return row.deleteable;
          },
        },
        {
          tag: 'el-table-column',
          label: '方案代码',
          prop: 'number',
          minWidth: 240,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '领用人代码',
          prop: 'recipientPersonNumber',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '领用人名称',
          prop: 'recipientPersonName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '领用时间',
          prop: 'recipientDate',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '制单人代码',
          prop: 'docMakerNumber',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '制单人姓名',
          prop: 'docMakerName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '审核状态',
          prop: 'auditStatus',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Checkbox',
        },
        {
          tag: 'el-table-column',
          label: '审核人代码',
          prop: 'auditPersonNumber',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '审核人姓名',
          prop: 'auditPersonName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '审核时间',
          prop: 'auditTime',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '禁用状态',
          prop: 'isDisable',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Checkbox',
        },
        {
          tag: 'el-table-column',
          label: '禁用人代码',
          prop: 'disablePersonNumber',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '禁用人姓名',
          prop: 'disablePersonName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '禁用时间',
          prop: 'disableTime',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 180,
          showOverflowTooltip: true,
          resizable: false,
          comp: 'Datetime',
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
            orgId: this.$store.state.user.userInfo.orgId, //组织
            number: '', //方案
            recipientPersonId: 0, //领用人id
            recipientPersonNumber: '', //领用人代码
            recipientPersonName: '', //领用人名称
            recipientDate: '', //领用时间
            //需要model化
            createTime: '', //创建时间
            docMakerId: 0, //创建人id
            docMakerNumber: '', //制单人代码
            docMakerName: '', //制单人姓名
            auditStatus: '0', //审核状态
            auditPersonId: 0, //审核人id
            auditPersonNumber: '', //审核人代码
            auditPersonName: '', //审核人姓名
            auditTime: '', //审核时间
            isDisable: '0', //禁用状态
            disablePersonId: 0, //禁用人id
            disablePersonNumber: '', //禁用人代码
            disablePersonName: '', //禁用人姓名
            disableTime: '', //禁用时间
            updateTime: '', //最后更新时间
          },
          rules: {
            number: [
              {
                required: true,
                message: '工单代码不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            recipientPersonName: [
              {
                required: true,
                message: '领用人不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            recipientDate: [
              {
                required: true,
                message: '领用时间不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            //需要class化
            {
              classKey: 'number',
              label: '工单',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getWorkOrderList,
              // getTreeList: getWorkOrderGroupList,

              isTree: false,
              isPage: false,
              id: '',
              number: '',
              name: '',
              tableColumns: [
                {
                  tag: 'el-table-column',
                  label: '工单代码',
                  prop: 'number',
                  minWidth: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
                {
                  tag: 'el-table-column',
                  label: '设备代码',
                  prop: 'archivesNumber',
                  minWidth: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
                {
                  tag: 'el-table-column',
                  label: '设备名称',
                  prop: 'archivesName',
                  minWidth: 180,
                  showOverflowTooltip: true,
                  comp: 'Datetime',
                },
                {
                  tag: 'el-table-column',
                  label: '部位代码',
                  prop: 'partNumber',
                  minWidth: 180,
                  showOverflowTooltip: true,
                  comp: 'Datetime',
                },
                {
                  tag: 'el-table-column',
                  label: '部位名称',
                  prop: 'partName',
                  resizable: false,
                  minWidth: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
              ],
              diaTitle: '工单',
              event: {},
            },
            {
              classKey: 'recipientPersonName',
              label: '领用人',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getClerkList,
              getTreeList: getClerkGroupList,
              isTree: true,
              isPage: false,
              id: '',
              number: '',
              name: '',
              tableColumns: clerkInputPopupColumns,
              diaTitle: '领用人',
              event: {},
            },
            {
              classKey: 'recipientDate',
              label: '领用时间',
              tag: 'el-date-picker',
              type: 'datetime',
              placeholder: '请选择',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            //需要写进一个地方  方便调用
            {
              classKey: 'createTime',
              label: '创建时间',
              tag: 'el-date-picker',
              type: 'datetime',
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: true,
            },
            {
              classKey: 'docMakerName',
              label: '创建人',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: true,
              isTree: false,
              getTableList: getList,
              id: '',
              number: '',
              name: '',
              tableColumns: [
                {
                  tag: 'el-table-column',
                  label: '代码',
                  prop: 'number',
                  width: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
              ],
              diaTitle: '',
              event: {},
            },
            {
              classKey: 'updateTime',
              label: '更新时间',
              tag: 'el-date-picker',
              type: 'datetime',
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: true,
            },
            {
              classKey: 'auditStatus',
              label: '审核状态',
              tag: 'id-select',
              options: [
                {
                  value: '0',
                  label: '未审核',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  value: '1',
                  label: '已审核',
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
              classKey: 'auditPersonName',
              label: '审核人',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: true,
              isTree: false,
              getTableList: getList,
              id: '',
              number: '',
              name: '',
              tableColumns: [
                {
                  tag: 'el-table-column',
                  label: '代码',
                  prop: 'number',
                  width: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
              ],
              diaTitle: '',
              event: {},
            },
            {
              classKey: 'auditTime',
              label: '审核时间',
              tag: 'el-date-picker',
              type: 'datetime',
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: true,
            },
            {
              classKey: 'isDisable',
              label: '禁用状态',
              tag: 'id-select',
              options: [
                {
                  value: '0',
                  label: '未禁用',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  value: '1',
                  label: '已禁用',
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
              classKey: 'disablePersonName',
              label: '禁用人',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: true,
              isTree: false,
              getTableList: getList,
              id: '',
              number: '',
              name: '',
              tableColumns: [
                {
                  tag: 'el-table-column',
                  label: '代码',
                  prop: 'number',
                  width: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
              ],
              diaTitle: '',
              event: {},
            },
            {
              classKey: 'disableTime',
              label: '禁用时间',
              tag: 'el-date-picker',
              type: 'datetime',
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
          fromList: 'sparePartList',
          tableErrTip: '物料信息',
          actionBarConfig: [
            new IdButtonConfig('list-add', '添加', 'list-add', {
              type: 'primary',
            }),
            new IdButtonConfig('list-delete', '删除', 'list-delete', {
              styleOne: true,
            }),
          ],
          tableColumns: [
            {
              tag: 'el-table-column',
              label: '备件代码',
              prop: 'materialNumber',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备件名称',
              prop: 'materialName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备件规格',
              prop: 'materialSpecifications',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '数量',
              prop: 'num',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '应用设备代码',
              prop: 'archivesNumber',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '应用设备名称',
              prop: 'archivesName',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备注',
              prop: 'mark',
              minWidth: 240,
              resizable: false,
              showOverflowTooltip: true,
            },
          ],
          form: {
            data: {
              workSparePartId: 0, //表单Id
              id: '',
              materialId: 0, //备件
              materialNumber: '',
              materialName: '',
              materialSpecifications: '', //规格型号
              num: 0, //数量
              archivesId: 0, //应用设备
              archivesNumber: '',
              archivesName: '',
              mark: '', //备注
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              materialName: [
                {
                  required: true,
                  message: '备件不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              num: [
                {
                  required: true,
                  message: '数量不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            // 标体弹出对话框字段设置
            component: [
              {
                classKey: 'materialName',
                label: '物料',
                tag: 'id-input-popup',
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getMaterialSparePart,
                isTree: false,
                isPage: true,
                id: '',
                number: '',
                name: '',
                tableColumns: materialInputPopupColumns,
                diaTitle: '部位',
                event: {},
              },
              {
                classKey: 'materialSpecifications',
                label: '规格型号',
                tag: 'el-input',
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: 'num',
                label: '数量',
                tag: 'el-input-number',
                placeholder: '请输入',
                controlsPosition: 'right',
                min: 0,
                max: 1000000000000,
                step: 1,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'archivesName',
                label: '应用设备',
                tag: 'id-input-popup',
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getDeviceList,
                getTreeList: getDeviceGroupList,
                isTree: true,
                isPage: false,
                id: '',
                number: '',
                name: '',
                tableColumns: deviceInputPopupColumns,
                diaTitle: '应用设备',
                event: {},
              },
              {
                classKey: 'mark',
                label: '备注',
                tag: 'el-input',
                placeholder: '请输入',
                type: 'textarea',
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
          add: addList,
          update: updateList,
          delete: batchDelList,
        },
      ],
    };
  },
  created() {
    let that = this;
    this.formList[0].form.component[0].event.confirm = function (row) {
      that.formList[0].form.data.materialId = row.id;
      that.formList[0].form.data.materialNumber = row.number;
      that.formList[0].form.data.materialName = row.name;
      that.formList[0].form.data.materialSpecifications =
        row.materialSpecifications;
      that.formList[0].form.component[0].id = row.id;
      that.formList[0].form.component[0].number = row.number;
      that.formList[0].form.component[0].name = row.name;
    };
    this.formList[0].form.component[3].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.formList[0].form.component[3].event.confirm = function (row) {
      that.formList[0].form.data.archivesId = row.id;
      that.formList[0].form.data.archivesNumber = row.number;
      that.formList[0].form.data.archivesName = row.name;
      that.formList[0].form.component[3].id = row.id;
      that.formList[0].form.component[3].number = row.number;
      that.formList[0].form.component[3].name = row.name;
    };

    this.tableDetailForm.idForm.component[0].event.beforeGetTableList =
      function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = 0;
        filterData.replace = true;
      };
    this.tableDetailForm.idForm.component[0].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.number = row.number;
      that.tableDetailForm.idForm.component[0].name = row.number;
    };
    this.tableDetailForm.idForm.component[1].event.beforeGetTableList =
      function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
    this.tableDetailForm.idForm.component[1].event.afterGetTablePage =
      function (tableData) {
        const options = ['在职', '试用', '实习', '退休', '离职', '离休'];
        tableData.forEach((tItem) => {
          tItem.type = options[tItem.type];
        });
      };
    this.tableDetailForm.idForm.component[1].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.recipientPersonId = row.id;
      that.tableDetailForm.idForm.data.recipientPersonNumber = row.number;
      that.tableDetailForm.idForm.data.recipientPersonName = row.name;
      that.tableDetailForm.idForm.component[1].id = row.id;
      that.tableDetailForm.idForm.component[1].number = row.number;
      that.tableDetailForm.idForm.component[1].name = row.name;
    };
  },
  methods: {
    afterGetTablePage(tableData) {
      tableData.forEach((tItem) => {
        tItem.auditStatus = tItem.auditStatus ? '已审核' : '未审核';
        tItem.isDisable = tItem.isDisable ? '已禁用' : '未禁用';
      });
    },
    initTableDetail(data) {
      if (data) {
        this.tableDetailForm.idForm.data = data;
        this.tableDetailForm.idForm.data.auditStatus = String(
          this.tableDetailForm.idForm.data.auditStatus
        );
        this.tableDetailForm.idForm.data.isDisable = String(
          this.tableDetailForm.idForm.data.isDisable
        );
      } else {
        this.tableDetailForm.idForm.data = {
          id: '',
          orgId: this.$store.state.user.userInfo.orgId, //组织
          number: '', //方案
          recipientPersonId: 0, //领用人id
          recipientPersonNumber: '', //领用人代码
          recipientPersonName: '', //领用人名称
          recipientDate: '', //领用时间
          //需要model化
          createTime: '', //创建时间
          docMakerId: 0, //创建人id
          docMakerNumber: '', //制单人代码
          docMakerName: '', //制单人姓名
          auditStatus: '0', //审核状态
          auditPersonId: 0, //审核人id
          auditPersonNumber: '', //审核人代码
          auditPersonName: '', //审核人姓名
          auditTime: '', //审核时间
          isDisable: '0', //禁用状态
          disablePersonId: 0, //禁用人id
          disablePersonNumber: '', //禁用人代码
          disablePersonName: '', //禁用人姓名
          disableTime: '', //禁用时间
          updateTime: '', //最后更新时间
        };
      }
      //统一处理字段的可编辑
      this.handleCompDisable(
        this.tableDetailForm.idForm.data.auditStatus,
        this.tableDetailForm.idForm.data.isDisable
      );
      //处理产品弹窗遗留问题
      this.handleInputPopup(
        'recipientPersonName',
        this.tableDetailForm.idForm.data.recipientPersonId,
        this.tableDetailForm.idForm.data.recipientPersonNumber,
        this.tableDetailForm.idForm.data.recipientPersonName
      );
      this.handleInputPopup(
        'number',
        null,
        null,
        this.tableDetailForm.idForm.data.number
      );
      //统一处理弹窗遗留问题
      this.handleInputPopup(
        'docMakerName',
        this.tableDetailForm.idForm.data.docMakerId,
        this.tableDetailForm.idForm.data.docMakerNumber,
        this.tableDetailForm.idForm.data.docMakerName
      );
      this.handleInputPopup(
        'auditPersonName',
        this.tableDetailForm.idForm.data.auditPersonId,
        this.tableDetailForm.idForm.data.auditPersonNumber,
        this.tableDetailForm.idForm.data.auditPersonName
      );
      this.handleInputPopup(
        'disablePersonName',
        this.tableDetailForm.idForm.data.disablePersonId,
        this.tableDetailForm.idForm.data.disablePersonNumber,
        this.tableDetailForm.idForm.data.disablePersonName
      );
    },
    initListDetail(index, row, callBack) {
      if (row) {
        this.formList[index].form.data = row;
        this.formList[index].form.data.workSparePartId =
          this.tableDetailForm.idForm.data.id;
        if (
          this.tableDetailForm.idForm.data.auditStatus === '0' &&
          this.tableDetailForm.idForm.data.isDisable === '0'
        )
          callBack(index, true);
      } else {
        this.formList[index].form.data = {
          workSparePartId: this.tableDetailForm.idForm.data.id, //表单Id
          id: '',
          materialId: 0, //备件
          materialNumber: '',
          materialName: '',
          materialSpecifications: '', //规格型号
          num: 0, //数量
          archivesId: 0, //应用设备
          archivesNumber: '',
          archivesName: '',
          mark: '', //备注
          orgId: this.$store.state.user.userInfo.orgId,
        };
      }
      //统一处理弹窗遗留问题
      this.handleListInputPopup(
        'materialName',
        index,
        this.formList[index].form.data.materialId,
        this.formList[index].form.data.materialNumber,
        this.formList[index].form.data.materialName
      );
      this.handleListInputPopup(
        'archivesName',
        index,
        this.formList[index].form.data.archivesId,
        this.formList[index].form.data.archivesNumber,
        this.formList[index].form.data.archivesName
      );
      //清除弹窗
      this.clearListInputPopup();
    },
  },
};
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
