<template>
  <id-tree-table-form-list tableErrTip="维保方案" :isTree="false" :getTable="getTable" :getTableDetail="getTableDetail" :deleteTableDetails="deleteTableDetails" :addTableDetail="addTableDetail" :updateTableDetail="updateTableDetail" :audit="audit" :antiAudit="antiAudit" :disable="disable" :antiDisable="antiDisable" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" @afterGetTablePage="afterGetTablePage" :actionBarFormConfig="actionBarFormConfig" :tableDetailForm="tableDetailForm" @initTableDetail="initTableDetail" @beforeLeave="beforeLeave" :formList="formList" @formListAlter="formListAlter" @initListDetail="initListDetail">
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
  getPlanTemplate,
  importPlanTemplate,
} from '@/api/deviceMaintenance/maintenancePlan';
import treeTableFormListADMixins from '@/mixins/treeTableFormListADMixins';
import { deviceInputPopupColumns } from '../tableColumns/deviceTableColumns';
import {
  getList as getDeviceList,
  getGroupList as getDeviceGroupList,
  getPositionList,
} from '@/api/deviceMaintenance/deviceArchive';
import { departmentInputPopupColumns } from '../tableColumns/departmentTableColumns';
import {
  getList as getDepartmentList,
  getGroupList as getDepartmentGroupList,
} from '@/api/basicData/department';
import { clerkInputPopupColumns } from '../tableColumns/clerkTableColumns';
import {
  getList as getClerkList,
  getGroupList as getClerkGroupList,
} from '@/api/basicData/clerk';

export default {
  name: 'maintenancePlan',
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
        {
          tag: 'id-excel',
          excelName: 'BOM',
          getTemplate: getPlanTemplate,
          importTemplate: importPlanTemplate,
        },
        // new IdButtonConfig("button-set", "显示字段设置", "set", {
        //   styleTwo: true,
        //   beforeIf: true,
        //   beforeClass: "el-icon-setting",
        // }),
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
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '设备代码',
          prop: 'equipmentNumber',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '设备名称',
          prop: 'equipmentName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '设备型号',
          prop: 'equipmentMode',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '部门代码',
          prop: 'departmentNumber',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '部门名称',
          prop: 'departmentName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '备注',
          prop: 'mark',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
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
            equipmentId: 0, //设备id
            equipmentNumber: '', //设备代码
            equipmentName: '', //设备名称
            equipmentMode: '', //设备型号
            departmentId: 0, //部门ID
            departmentNumber: '', //部门代码
            departmentName: '', //部门名称
            mark: '', //备注
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
                required: false,
                message: '方案代码不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            equipmentName: [
              {
                required: true,
                message: '设备不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            //需要class化
            {
              classKey: 'number',
              label: '方案代码',
              tag: 'el-input',
              placeholder: '代码自动生成',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'equipmentName',
              label: '设备',
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
              diaTitle: '设备',
              event: {},
            },
            {
              classKey: 'equipmentMode',
              label: '设备型号',
              tag: 'el-input',
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'departmentName',
              label: '部门',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getDepartmentList,
              getTreeList: getDepartmentGroupList,
              isTree: true,
              isPage: false,
              id: '',
              number: '',
              name: '',
              tableColumns: departmentInputPopupColumns,
              diaTitle: '部门',
              event: {},
            },
            //需要model化
            {
              classKey: 'mark',
              label: '备注信息',
              tag: 'el-input',
              placeholder: '请输入',
              type: 'textarea',
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
          fromList: 'planMaintainPartList',
          tableErrTip: '保养方案',
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
              label: '部位代码',
              prop: 'partNumber',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '部位名称',
              prop: 'partName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '内容',
              prop: 'content',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '标准',
              prop: 'standard',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '周期',
              prop: 'cycle',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '单位',
              prop: 'cycleUnitName',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '工时',
              prop: 'workHours',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '负责人代码',
              prop: 'headPersonNumber',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '负责人名称',
              prop: 'headPersonName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '是否停机',
              prop: 'downStatusName',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '上次保养时间',
              prop: 'maintainTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '总运行时间',
              prop: 'runTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '当前状态',
              prop: 'currentStatus',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '下次保养时间',
              prop: 'nextMaintainTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备注',
              prop: 'note',
              minWidth: 240,
              resizable: false,
              showOverflowTooltip: true,
            },
          ],
          form: {
            data: {
              workPlanId: 0, //表单Id
              type: 0, //区分是保养方案还是点检方案
              id: '',
              archivesPartId: 0, //部位
              partNumber: '',
              partName: '',
              content: '', //内容以及要求
              standard: '', //标准
              workHours: 0, //工时
              cycle: 0, //周期
              cycleUnit: '1', //单位周期
              downStatus: '0', //是否停机
              headPersonId: 0, //负责人
              headPersonNumber: '',
              headPersonName: '',
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              partName: [
                {
                  required: true,
                  message: '部位不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              content: [
                {
                  required: true,
                  message: '内容以及要求不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              downStatus: [
                {
                  required: true,
                  message: '是否停机不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            component: [
              {
                classKey: 'partName',
                label: '部位',
                tag: 'id-input-popup',
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getPositionList,
                isTree: false,
                isPage: true,
                id: '',
                number: '',
                name: '',
                tableColumns: [
                  {
                    tag: 'el-table-column',
                    label: '参数代码',
                    prop: 'number',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                  {
                    tag: 'el-table-column',
                    label: '参数名称',
                    prop: 'name',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                  {
                    tag: 'el-table-column',
                    label: '测量日期',
                    prop: 'enableTime',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'Datetime',
                  },
                  {
                    tag: 'el-table-column',
                    label: '备注',
                    prop: 'mark',
                    resizable: false,
                    minWidth: 240,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                ],
                diaTitle: '部位',
                event: {},
              },
              {
                classKey: 'content',
                label: '内容以及要求',
                tag: 'el-input',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'standard',
                label: '标准',
                tag: 'el-input',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'workHours',
                label: '工时',
                tag: 'el-input-number',
                placeholder: '请输入',
                controlsPosition: 'right',
                min: 0,
                max: 1000000000000,
                step: 0.01,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'cycle',
                label: '周期',
                tag: 'el-input-number',
                placeholder: '请输入',
                controlsPosition: 'right',
                min: 0.1,
                max: 100000,
                step: 0.1,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'cycleUnit',
                label: '单位周期',
                tag: 'id-select',
                placeholder: '请选择',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                options: [
                  {
                    label: '小时',
                    value: '1',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '周',
                    value: '2',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '日',
                    value: '3',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '月',
                    value: '4',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '运行时间(小时)',
                    value: '5',
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
                classKey: 'downStatus',
                label: '是否停机',
                tag: 'id-select',
                placeholder: '请选择',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                options: [
                  {
                    label: '否',
                    value: '0',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '是',
                    value: '1',
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
                classKey: 'headPersonName',
                label: '人员',
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
                diaTitle: '人员',
                event: {},
              },
            ],
          },
          add: addList,
          update: updateList,
          delete: batchDelList,
        },
        {
          fromList: 'planTallyPartList',
          tableErrTip: '点检方案',
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
              label: '部位代码',
              prop: 'partNumber',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '部位名称',
              prop: 'partName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '内容',
              prop: 'content',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '标准',
              prop: 'standard',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '周期',
              prop: 'cycle',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '单位',
              prop: 'cycleUnitName',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '工时',
              prop: 'workHours',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '负责人代码',
              prop: 'headPersonNumber',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '负责人名称',
              prop: 'headPersonName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '是否停机',
              prop: 'downStatusName',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '上次保养时间',
              prop: 'maintainTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '总运行时间',
              prop: 'runTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '当前状态',
              prop: 'currentStatus',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '下次保养时间',
              prop: 'nextMaintainTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备注',
              prop: 'note',
              minWidth: 240,
              resizable: false,
              showOverflowTooltip: true,
            },
          ],
          form: {
            data: {
              workPlanId: 0, //表单Id
              type: 0, //区分是保养方案还是点检方案
              id: '',
              archivesPartId: 0, //部位
              partNumber: '',
              partName: '',
              content: '', //内容以及要求
              standard: '', //标准
              workHours: 0, //工时
              cycle: 0, //周期
              cycleUnit: '1', //单位周期
              downStatus: '0', //是否停机
              headPersonId: 0, //负责人
              headPersonNumber: '',
              headPersonName: '',
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              partName: [
                {
                  required: true,
                  message: '部位不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              content: [
                {
                  required: true,
                  message: '内容以及要求不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              downStatus: [
                {
                  required: true,
                  message: '是否停机不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            component: [
              {
                classKey: 'partName',
                label: '部位',
                tag: 'id-input-popup',
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getPositionList,
                isTree: false,
                isPage: true,
                id: '',
                number: '',
                name: '',
                tableColumns: [
                  {
                    tag: 'el-table-column',
                    label: '参数代码',
                    prop: 'number',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                  {
                    tag: 'el-table-column',
                    label: '参数名称',
                    prop: 'name',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                  {
                    tag: 'el-table-column',
                    label: '测量日期',
                    prop: 'enableTime',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'Datetime',
                  },
                  {
                    tag: 'el-table-column',
                    label: '备注',
                    prop: 'mark',
                    resizable: false,
                    minWidth: 240,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                ],
                diaTitle: '部位',
                event: {},
              },
              {
                classKey: 'content',
                label: '内容以及要求',
                tag: 'el-input',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'standard',
                label: '标准',
                tag: 'el-input',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'workHours',
                label: '工时',
                tag: 'el-input-number',
                placeholder: '请输入',
                controlsPosition: 'right',
                min: 0,
                max: 1000000000000,
                step: 0.01,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'cycle',
                label: '周期',
                tag: 'el-input-number',
                placeholder: '请输入',
                controlsPosition: 'right',
                min: 0.1,
                max: 100000,
                step: 0.1,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'cycleUnit',
                label: '单位周期',
                tag: 'id-select',
                placeholder: '请选择',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                options: [
                  {
                    label: '小时',
                    value: '1',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '周',
                    value: '2',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '日',
                    value: '3',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '月',
                    value: '4',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '运行时间(小时)',
                    value: '5',
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
                classKey: 'downStatus',
                label: '是否停机',
                tag: 'id-select',
                placeholder: '请选择',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                options: [
                  {
                    label: '否',
                    value: '0',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '是',
                    value: '1',
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
                classKey: 'headPersonName',
                label: '人员',
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
                diaTitle: '人员',
                event: {},
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
    this.formList[0].form.component[0].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.orgId = undefined;
      filterData.archivesId = that.tableDetailForm.idForm.data.equipmentId;
    };
    this.formList[0].form.component[0].event.confirm = function (row) {
      that.formList[0].form.data.archivesPartId = row.id;
      that.formList[0].form.data.partNumber = row.number;
      that.formList[0].form.data.partName = row.name;
      that.formList[0].form.component[0].id = row.id;
      that.formList[0].form.component[0].number = row.number;
      that.formList[0].form.component[0].name = row.name;
    };
    this.formList[0].form.component[7].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.formList[0].form.component[7].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['在职', '试用', '实习', '退休', '离职', '离休'];
      tableData.forEach((tItem) => {
        tItem.type = options[tItem.type];
      });
    };
    this.formList[0].form.component[7].event.confirm = function (row) {
      that.formList[0].form.data.headPersonId = row.id;
      that.formList[0].form.data.headPersonNumber = row.number;
      that.formList[0].form.data.headPersonName = row.name;
      that.formList[0].form.component[7].id = row.id;
      that.formList[0].form.component[7].number = row.number;
      that.formList[0].form.component[7].name = row.name;
    };

    this.formList[1].form.component[0].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.orgId = undefined;
      filterData.archivesId = that.tableDetailForm.idForm.data.equipmentId;
    };
    this.formList[1].form.component[0].event.confirm = function (row) {
      that.formList[1].form.data.archivesPartId = row.id;
      that.formList[1].form.data.partNumber = row.number;
      that.formList[1].form.data.partName = row.name;
      that.formList[1].form.component[0].id = row.id;
      that.formList[1].form.component[0].number = row.number;
      that.formList[1].form.component[0].name = row.name;
    };
    this.formList[1].form.component[7].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.formList[1].form.component[7].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['在职', '试用', '实习', '退休', '离职', '离休'];
      tableData.forEach((tItem) => {
        tItem.type = options[tItem.type];
      });
    };
    this.formList[1].form.component[7].event.confirm = function (row) {
      that.formList[1].form.data.headPersonId = row.id;
      that.formList[1].form.data.headPersonNumber = row.number;
      that.formList[1].form.data.headPersonName = row.name;
      that.formList[1].form.component[7].id = row.id;
      that.formList[1].form.component[7].number = row.number;
      that.formList[1].form.component[7].name = row.name;
    };

    this.tableDetailForm.idForm.component[1].event.beforeGetTableList =
      function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = 0;
      };
    this.tableDetailForm.idForm.component[1].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.equipmentId = row.id;
      that.tableDetailForm.idForm.data.equipmentNumber = row.number;
      that.tableDetailForm.idForm.data.equipmentName = row.name;
      that.tableDetailForm.idForm.data.equipmentMode = row.model;
      that.tableDetailForm.idForm.component[1].id = row.id;
      that.tableDetailForm.idForm.component[1].number = row.number;
      that.tableDetailForm.idForm.component[1].name = row.name;
    };
    this.tableDetailForm.idForm.component[3].event.beforeGetTableList =
      function (filterData) {
        filterData.auditStatus = 1;
        filterData.isDisable = false;
      };
    this.tableDetailForm.idForm.component[3].event.afterGetTablePage =
      function (tableData) {
        const options = ['生产类', '管理类', '辅助类'];
        tableData.forEach((tItem) => {
          tItem.type = options[tItem.type];
        });
      };
    this.tableDetailForm.idForm.component[3].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.departmentId = row.id;
      that.tableDetailForm.idForm.data.departmentNumber = row.number;
      that.tableDetailForm.idForm.data.departmentName = row.name;
      that.tableDetailForm.idForm.component[3].id = row.id;
      that.tableDetailForm.idForm.component[3].number = row.number;
      that.tableDetailForm.idForm.component[3].name = row.name;
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
          equipmentId: 0, //设备id
          equipmentNumber: '', //设备代码
          equipmentName: '', //设备名称
          equipmentMode: '', //设备型号
          departmentId: 0, //部门ID
          departmentNumber: '', //部门代码
          departmentName: '', //部门名称
          mark: '', //备注
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
        'departmentName',
        this.tableDetailForm.idForm.data.departmentId,
        this.tableDetailForm.idForm.data.departmentNumber,
        this.tableDetailForm.idForm.data.departmentName
      );
      this.handleInputPopup(
        'equipmentName',
        this.tableDetailForm.idForm.data.equipmentId,
        this.tableDetailForm.idForm.data.equipmentNumber,
        this.tableDetailForm.idForm.data.equipmentName
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
    formListAlter(fromList, data, index) {
      // while (true){
      //   const tIndex=data.findIndex((dItem)=>dItem.type=index);
      //   if(tIndex>=0){
      //     data.splice(tIndex,tIndex+1);
      //   }else
      //     break;
      // }
      const types = ['0', '小时', '周', '日', '月', '运行时间(小时)'];
      const status = ['否', '是'];
      data.forEach((dItem) => {
        dItem.cycleUnitName = types[dItem.cycleUnit];
        dItem.downStatusName = status[dItem.downStatus];
      });
    },
    initListDetail(index, row, callBack) {
      if (row) {
        this.formList[index].form.data = row;
        this.formList[index].form.data.workPlanId =
          this.tableDetailForm.idForm.data.id;
        this.formList[index].form.data.cycleUnit = String(
          this.formList[index].form.data.cycleUnit
        );
        this.formList[index].form.data.downStatus = String(
          this.formList[index].form.data.downStatus
        );
        if (
          this.tableDetailForm.idForm.data.auditStatus === '0' &&
          this.tableDetailForm.idForm.data.isDisable === '0'
        )
          callBack(index, true);
      } else {
        this.formList[index].form.data = {
          workPlanId: this.tableDetailForm.idForm.data.id, //表单Id
          type: index, //区分是保养方案还是点检方案
          id: '',
          archivesPartId: 0, //部位
          partNumber: '',
          partName: '',
          content: '', //内容以及要求
          standard: '', //标准
          workHours: 0, //工时
          cycle: 0, //周期
          cycleUnit: '1', //单位周期
          downStatus: '0', //是否停机
          headPersonId: 0, //负责人
          headPersonNumber: '',
          headPersonName: '',
          orgId: this.$store.state.user.userInfo.orgId,
        };
      }
      console.log(this.formList[index].form);
      //统一处理弹窗遗留问题
      this.handleListInputPopup(
        'partName',
        index,
        this.formList[index].form.data.archivesPartId,
        this.formList[index].form.data.partNumber,
        this.formList[index].form.data.partName
      );
      this.handleListInputPopup(
        'headPersonName',
        index,
        this.formList[index].form.data.headPersonId,
        this.formList[index].form.data.headPersonNumber,
        this.formList[index].form.data.headPersonName
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

