<template>
  <div>
    <id-tree-table-form-list tableErrTip="设备档案" ref="tableFormList" :treeType="22" :treeActionBar="treeActionBar" :getTable="getTable" :getTableDetail="getTableDetail" :deleteTableDetails="deleteTableDetails" :addTableDetail="addTableDetail" :updateTableDetail="updateTableDetail" :audit="audit" :antiAudit="antiAudit" :disable="disable" :antiDisable="antiDisable" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" @beforeGetTableList="beforeGetTableList" @afterGetTablePage="afterGetTablePage" :actionBarFormConfig="actionBarFormConfig" :tableDetailForm="tableDetailForm" @listBarClick="listBarClick" @initTableDetail="initTableDetail" @beforeLeave="beforeLeave" :formList="formList" @initListDetail="initListDetail">
    </id-tree-table-form-list>

    <el-dialog :visible.sync="attacheDialog.v">
      <el-form :model="attacheFormValidate" :rules="attacheFormRules" ref="attacheForm" label-width="100px" size="small">
        <el-form-item label="附件代码" prop="number">
          <el-input v-model="attacheFormValidate.number"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input type="textarea" maxlength="250" show-word-limit v-model="attacheFormValidate.mark"></el-input>
        </el-form-item>
      </el-form>
      <el-upload :http-request="() => {}" action="https://jsonplaceholder.typicode.com/posts/" drag :before-upload="beforeAttacheUpload" :show-file-list="false">
        <i class="el-icon-upload"></i>
        <div v-if="this.attacheDialog.rawFile.name" style="margin-top: 12px">
          <span>已选择文件: </span>
          <span>{{ this.attacheDialog.rawFile.name }}</span>
        </div>
        <div v-else class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ attacheDialog.title }}</span>
      </div>
      <span slot="footer" class="diaFooter">
        <el-button @click="postAttachCancel">取 消</el-button>
        <el-button type="primary" @click="postAttach">确 定</el-button>
      </span>
    </el-dialog>
  </div>
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
  getGroupList,
  getDeviceTemplate,
  importDeviceTemplate,
  getDeviceGroup,
  addList,
  updateList,
  delList,
  addList1,
  updateList1,
  delList1,
  addList2,
  updateList2,
  delList2,
  addList3,
  updateList3,
  delList3,
} from '@/api/deviceMaintenance/deviceArchive';
import { configAll } from '@/components/id-tree/idTreeConfig';
import treeTableFormListADMixins from '@/mixins/treeTableFormListADMixins';
import deviceTableColumns, {
  deviceInputPopupColumns,
} from '../tableColumns/deviceTableColumns';
import { additionalInfoInputPopupColumns } from '../tableColumns/additionalInfoTableColumns';
import {
  getList as getAdditionalInfoList,
  getGroupList as getAdditionalInfoGroupList,
} from '@/api/basicData/additionalInfo';
import { clerkInputPopupColumns } from '../tableColumns/clerkTableColumns';
import {
  getList as getClerkList,
  getGroupList as getClerkGroupList,
} from '@/api/basicData/clerk';
import { supplierInputPopupColumns } from '../tableColumns/supplierTableColumns';
import {
  getList as getSupplierList,
  getGroupList as getSupplierGroupList,
} from '@/api/basicData/supplier';
import { departmentInputPopupColumns } from '../tableColumns/departmentTableColumns';
import {
  getList as getDepartmentList,
  getGroupList as getDepartmentGroupList,
} from '@/api/basicData/department';
import { getContainerPcAnalysisList } from '@/api/device-watch/device';
import { findContainerList } from '@/api/basedata';
import { warehouseInputPopupColumns } from '../tableColumns/warehouseTableColumns';
import {
  getList as getWarehouseList,
  getGroupList as getWarehouseGroupList,
} from '@/api/basicData/warehouse';
import { uploadFile } from '@/api/publicApis';

export default {
  //界面特殊点 禁用状态isDisable是 禁用1 未禁用0
  name: 'deviceArchive',
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
      //附件上传-----------------CC代码
      attacheDialog: {
        title: '上传附件',
        v: false,
        picFile: '',
        rawFile: '',
        attacheId: '',
      },
      attacheFormValidate: {
        number: '',
        mark: '',
      },
      attacheFormRules: {
        number: [
          {
            required: true,
            message: '此项必填',
            trigger: 'blur',
          },
        ],
      },
      attacheTableSelection: [],
      //——————————————————————————————————————————————-
      //左树的操作栏设定
      treeActionBar: configAll,
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
          excelName: '设备',
          getTemplate: getDeviceTemplate,
          importTemplate: importDeviceTemplate,
        },
        {
          tag: 'el-checkbox',
          classKey: 'showAll',
          label: '显示所有',
          target: 'showAll',
          vModel: false,
          styleTwo: true,
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
        ...deviceTableColumns,
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
            number: '', //设备代码
            name: '', //设备名称
            type: 0, //设备类别id
            typeNumber: '', //设备类别number
            typeName: '', //设备类别name
            specifications: '', //规格
            model: '', //型号
            personId: 0, //负责人
            personNumber: '', //负责人number
            personName: '', //负责人name
            madeCountry: '', //生产国别
            manufacturersId: 0, //生产厂商id
            manufacturerNumber: '', //生产厂商number
            manufacturerName: '', //生产厂商name
            supplierId: 0, //原材料id
            supplierNumber: '', //原材料number
            supplierName: '', //原材料name
            departmentId: 0, //部门id
            departmentNumber: '', //部门number
            // departmentName: '', //部门name
            factoryNumber: '', //出厂代码
            manufactureDate: '', //出厂日期
            installationDate: '', //安装日期
            commissioningDate: '', //启用日期
            containerId: '', //数采结构id
            containerNumber: '', //数采结构number
            containerName: '', //数采结构name
            // weight: 0, //重量（T）
            // power: 0, //功率（KW）
            // overallDimensions: '', //外形尺寸
            // originalValue: '', //设备原值
            // sources: '', //设备来源
            warehouseId: 0, //存放位置id
            warehouseNumber: '', //存放位置number
            // warehouseName: '', //存放位置name
            pid: 0, //父设备号id
            pNumber: '', //父设备号number
            // pName: '', //父设备号name
            // fileNo: "", //图号/档案号
            note: '', //备注
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
            groupId: 0, //分组内码
            groupNumber: '', //分组代码
            groupName: '', //分组名称
          },
          rules: {
            name: [
              {
                required: true,
                message: '设备名称不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            //需要class化
            {
              classKey: 'number',
              label: '设备代码',
              tag: 'el-input',
              placeholder: '可自动生成',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'name',
              label: '设备名称',
              tag: 'el-input',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'typeName',
              label: '设备类别',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getDeviceGroup,
              isTree: false,
              isPage: true,
              id: '',
              number: '',
              name: '',
              tableColumns: additionalInfoInputPopupColumns,
              diaTitle: '设备类别',
              event: {},
            },
            {
              classKey: 'specifications',
              label: '规格',
              tag: 'el-input',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'model',
              label: '型号',
              tag: 'el-input',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'personName',
              label: '负责人',
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
              diaTitle: '负责人',
              event: {},
            },
            {
              classKey: 'madeCountry',
              label: '生产国别',
              tag: 'el-input',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'manufacturerName',
              label: '生产厂商',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getSupplierList,
              getTreeList: getSupplierGroupList,
              isTree: true,
              isPage: false,
              id: '',
              number: '',
              name: '',
              tableColumns: supplierInputPopupColumns,
              diaTitle: '生产厂商',
              event: {},
            },
            {
              classKey: 'supplierName',
              label: '供应厂商',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getSupplierList,
              getTreeList: getSupplierGroupList,
              isTree: true,
              isPage: false,
              id: '',
              number: '',
              name: '',
              tableColumns: supplierInputPopupColumns,
              diaTitle: '供应厂商',
              event: {},
            },
            // {
            //   classKey: 'departmentName',
            //   label: '部门',
            //   tag: 'id-input-popup',
            //   controlTooltipShow: true,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            //   getTableList: getDepartmentList,
            //   getTreeList: getDepartmentGroupList,
            //   isTree: true,
            //   isPage: false,
            //   id: '',
            //   number: '',
            //   name: '',
            //   tableColumns: departmentInputPopupColumns,
            //   diaTitle: '部门',
            //   event: {},
            // },
            {
              classKey: 'factoryNumber',
              label: '出厂代码',
              tag: 'el-input',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'manufactureDate',
              label: '出厂日期',
              tag: 'el-date-picker',
              type: 'datetime',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'installationDate',
              label: '安装日期',
              tag: 'el-date-picker',
              type: 'datetime',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'commissioningDate',
              label: '启用日期',
              tag: 'el-date-picker',
              type: 'datetime',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'containerName',
              label: '数采结构',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: findContainerList,
              getTreeList: getContainerPcAnalysisList,
              isTree: true,
              isPage: true,
              id: '',
              number: '',
              name: '',
              tableColumns: [
                {
                  tag: 'el-table-column',
                  label: '容器代码',
                  prop: 'ctrNumber',
                  minWidth: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
                {
                  tag: 'el-table-column',
                  label: '容器名称',
                  prop: 'ctrName',
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
              ],
              diaTitle: '数采结构',
              event: {},
            },
            // {
            //   classKey: 'weight',
            //   label: '重量(T)',
            //   tag: 'el-input-number',
            //   placeholder: '请输入',
            //   controlsPosition: 'right',
            //   min: 0,
            //   max: 1000000000000,
            //   step: 0.01,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            // },
            // {
            //   classKey: 'power',
            //   label: '功率(kW)',
            //   tag: 'el-input-number',
            //   placeholder: '请输入',
            //   controlsPosition: 'right',
            //   min: 0,
            //   max: 1000000000000,
            //   step: 0.01,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            // },
            // {
            //   classKey: 'overallDimensions',
            //   label: '外形尺寸',
            //   tag: 'el-input',
            //   placeholder: '请输入',
            //   clearable: true,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            // },
            // {
            //   classKey: 'originalValue',
            //   label: '设备原值',
            //   tag: 'el-input',
            //   placeholder: '请输入',
            //   clearable: true,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            // },
            // {
            //   classKey: 'sources',
            //   label: '设备来源',
            //   tag: 'el-input',
            //   placeholder: '请输入',
            //   clearable: true,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            // },
            // {
            //   classKey: 'warehouseName',
            //   label: '存放位置',
            //   tag: 'id-input-popup',
            //   controlTooltipShow: true,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            //   getTableList: getWarehouseList,
            //   getTreeList: getWarehouseGroupList,
            //   isTree: true,
            //   isPage: false,
            //   id: '',
            //   number: '',
            //   name: '',
            //   tableColumns: warehouseInputPopupColumns,
            //   diaTitle: '存放位置',
            //   event: {},
            // },
            // {
            //   classKey: 'pName',
            //   label: '父设备',
            //   tag: 'id-input-popup',
            //   controlTooltipShow: true,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            //   getTableList: getList,
            //   getTreeList: getGroupList,
            //   isTree: true,
            //   isPage: false,
            //   id: '',
            //   number: '',
            //   name: '',
            //   tableColumns: deviceInputPopupColumns,
            //   diaTitle: '父设备',
            //   event: {},
            // },
            // {
            //   classKey: "fileNo",
            //   label: "图号/档案号",
            //   tag: "el-input",
            //   placeholder: "请输入",
            //   clearable: true,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true
            // },
            //需要model化
            {
              classKey: 'groupName',
              label: '分组',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getGroupList,
              isTree: false,
              isPage: true,
              id: '',
              number: '',
              name: '',
              //设备档案列表 需要抽离
              tableColumns: [
                {
                  tag: 'el-table-column',
                  label: '代码',
                  prop: 'number',
                  width: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
                {
                  tag: 'el-table-column',
                  label: '名称',
                  prop: 'name',
                  width: 180,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
                {
                  tag: 'el-table-column',
                  label: '备注',
                  prop: 'mark',
                  width: 500,
                  showOverflowTooltip: true,
                  comp: 'String',
                },
              ],
              diaTitle: '分组',
              event: {},
            },
            {
              classKey: 'note',
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
              getTableList: getGroupList,
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
              getTableList: getGroupList,
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
                  value: 'false',
                  label: '未禁用',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  value: 'true',
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
              getTableList: getGroupList,
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
          fromList: 'partList',
          tableErrTip: '部位',
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
              prop: 'number',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '部位名称',
              prop: 'name',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '测量日期',
              prop: 'enableTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备注',
              prop: 'mark',
              resizable: false,
              minWidth: 240,
              showOverflowTooltip: true,
            },
          ],
          form: {
            data: {
              archivesId: '', //表单Id
              id: '',
              number: '', //部位代码
              name: '', //部位名称
              enableTime: '', //启用日期
              mark: '',
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              number: [
                {
                  required: true,
                  message: '部位代码不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              name: [
                {
                  required: true,
                  message: '部位名称不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            component: [
              {
                classKey: 'number',
                label: '部位代码',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'name',
                label: '部位名称',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'enableTime',
                label: '启用日期',
                tag: 'el-date-picker',
                type: 'datetime',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
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
          add: addList2,
          update: updateList2,
          delete: delList2,
        },
        {
          fromList: 'attachmentList',
          tableErrTip: '附件信息',
          actionBarConfig: [
            new IdButtonConfig('list-upload', '上传附件', 'list-upload', {
              type: 'primary',
              beforeIf: true,
              beforeClass: 'el-icon-upload2',
            }),
            new IdButtonConfig('list-download', '下载附件', 'list-download', {
              type: 'primary',
              beforeIf: true,
              beforeClass: 'el-icon-download',
            }),
            new IdButtonConfig('list-delete', '删除', 'list-delete', {
              styleOne: true,
            }),
          ],
          tableColumns: [
            {
              tag: 'el-table-column',
              label: '附件代码',
              prop: 'number',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '附件名称',
              prop: 'fileName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备注',
              prop: 'mark',
              resizable: false,
              minWidth: 240,
              showOverflowTooltip: true,
            },
          ],
          form: {
            data: {
              archivesId: '', //表单Id
              id: '',
              number: '',
              fileName: '',
              mark: '',
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              number: [
                {
                  required: true,
                  message: '附件代码不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            component: [
              {
                classKey: 'number',
                label: '附件代码代码',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: 'fileName',
                label: '附件',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
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
          delete: delList,
        },
        {
          fromList: 'parameterList',
          tableErrTip: '技术参数',
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
              label: '参数代码',
              prop: 'number',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '参数名称',
              prop: 'name',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '标准值',
              prop: 'standard',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '实测值',
              prop: 'actual',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '测量日期',
              prop: 'measureTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备注',
              prop: 'mark',
              resizable: false,
              minWidth: 240,
              showOverflowTooltip: true,
            },
          ],
          form: {
            data: {
              archivesId: '', //表单Id
              id: '',
              number: '', //参数代码
              name: '', //参数名称
              standard: '', //标准值
              actual: '', //实测值
              measureTime: '', //测量日期
              mark: '',
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              number: [
                {
                  required: true,
                  message: '参数代码不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              name: [
                {
                  required: true,
                  message: '参数名称不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              standard: [
                {
                  required: true,
                  message: '标准值不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              actual: [
                {
                  required: true,
                  message: '实测值不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              measureTime: [
                {
                  required: true,
                  message: '测量日期不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            component: [
              {
                classKey: 'number',
                label: '参数代码',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'name',
                label: '参数名称',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'standard',
                label: '标准值',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'actual',
                label: '实测值',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'measureTime',
                label: '测量日期',
                tag: 'el-date-picker',
                type: 'datetime',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
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
          add: addList1,
          update: updateList1,
          delete: delList1,
        },

        {
          fromList: 'instructionsList',
          tableErrTip: '设备安全说明',
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
              label: '安全说明',
              prop: 'name',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备注',
              prop: 'mark',
              resizable: false,
              minWidth: 240,
              showOverflowTooltip: true,
            },
          ],
          form: {
            data: {
              archivesId: '', //表单Id
              id: '',
              name: '', //安全说明
              mark: '',
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              name: [
                {
                  required: true,
                  message: '安全说明不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            component: [
              {
                classKey: 'name',
                label: '安全说明',
                tag: 'el-input',
                placeholder: '请输入',
                clearable: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
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
          add: addList2,
          update: updateList2,
          delete: delList2,
        },
      ],
    };
  },
  created() {
    let that = this;
    console.log(this.tableDetailForm.idForm.component);
    this.tableDetailForm.idForm.component[2].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[2].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.type = row.id;
      that.tableDetailForm.idForm.data.typeNumber = row.number;
      that.tableDetailForm.idForm.data.typeName = row.name;
      that.tableDetailForm.idForm.component[2].id = row.id;
      that.tableDetailForm.idForm.component[2].number = row.number;
      that.tableDetailForm.idForm.component[2].name = row.name;
    };
    this.tableDetailForm.idForm.component[5].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[5].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['在职', '试用', '实习', '退休', '离职', '离休'];
      tableData.forEach((tItem) => {
        tItem.type = options[tItem.type];
      });
    };
    this.tableDetailForm.idForm.component[5].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.personId = row.id;
      that.tableDetailForm.idForm.data.personNumber = row.number;
      that.tableDetailForm.idForm.data.personName = row.name;
      that.tableDetailForm.idForm.component[5].id = row.id;
      that.tableDetailForm.idForm.component[5].number = row.number;
      that.tableDetailForm.idForm.component[5].name = row.name;
    };
    this.tableDetailForm.idForm.component[7].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[7].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.manufacturersId = row.id;
      that.tableDetailForm.idForm.data.manufacturerNumber = row.number;
      that.tableDetailForm.idForm.data.manufacturerName = row.name;
      that.tableDetailForm.idForm.component[7].id = row.id;
      that.tableDetailForm.idForm.component[7].number = row.number;
      that.tableDetailForm.idForm.component[7].name = row.name;
    };
    this.tableDetailForm.idForm.component[8].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[8].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.supplierId = row.id;
      that.tableDetailForm.idForm.data.supplierNumber = row.number;
      that.tableDetailForm.idForm.data.supplierName = row.name;
      that.tableDetailForm.idForm.component[8].id = row.id;
      that.tableDetailForm.idForm.component[8].number = row.number;
      that.tableDetailForm.idForm.component[8].name = row.name;
    };
    // this.tableDetailForm.idForm.component[9].event.beforeGetTableList = function (
    //   filterData
    // ) {
    //   filterData.auditStatus = 1;
    //   filterData.isDisable = false;
    // };
    // this.tableDetailForm.idForm.component[9].event.afterGetTablePage = function (
    //   tableData
    // ) {
    //   const options = ['生产类', '管理类', '辅助类'];
    //   tableData.forEach((tItem) => {
    //     tItem.type = options[tItem.type];
    //   });
    // };
    // this.tableDetailForm.idForm.component[9].event.confirm = function (row) {
    //   that.tableDetailForm.idForm.data.departmentId = row.id;
    //   that.tableDetailForm.idForm.data.departmentNumber = row.number;
    //   // that.tableDetailForm.idForm.data.departmentName = row.name;
    //   that.tableDetailForm.idForm.component[9].id = row.id;
    //   that.tableDetailForm.idForm.component[9].number = row.number;
    //   that.tableDetailForm.idForm.component[9].name = row.name;
    // };
    this.tableDetailForm.idForm.component[13].event.beforeGetTreeList = function (
      filterData
    ) {
      filterData.noDevice = true;
    };
    this.tableDetailForm.idForm.component[13].event.afterGetTreeList = function (
      tableData
    ) {
      tableData.forEach((i) => {
        i.name = i.ctrName;
        i.pid = String(i.ctrParent);
      });
    };
    this.tableDetailForm.idForm.component[13].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.unBind = true;
      filterData.ctrType = 3;
      filterData.ctrParent = filterData.groupId;
      filterData.groupId = undefined;
    };
    this.tableDetailForm.idForm.component[13].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.containerId = row.id;
      that.tableDetailForm.idForm.data.containerNumber = row.ctrNumber;
      that.tableDetailForm.idForm.data.containerName = row.ctrName;
      that.tableDetailForm.idForm.component[13].id = row.id;
      that.tableDetailForm.idForm.component[13].number = row.ctrNumber;
      that.tableDetailForm.idForm.component[13].name = row.ctrName;
    };
    // this.tableDetailForm.idForm.component[20].event.beforeGetTableList = function (
    //   filterData
    // ) {
    //   filterData.auditStatus = 1;
    //   filterData.isDisable = false;
    // };
    // this.tableDetailForm.idForm.component[20].event.afterGetTablePage = function (
    //   tableData
    // ) {
    //   const options = ['普通仓', '车间仓', '客户仓', '供应商仓'];
    //   tableData.forEach((tItem) => {
    //     tItem.type = options[tItem.type];
    //   });
    // };
    // this.tableDetailForm.idForm.component[20].event.confirm = function (row) {
    //   that.tableDetailForm.idForm.data.warehouseId = row.id;
    //   that.tableDetailForm.idForm.data.warehouseNumber = row.number;
    //   // that.tableDetailForm.idForm.data.warehouseName = row.name;
    //   that.tableDetailForm.idForm.component[20].id = row.id;
    //   that.tableDetailForm.idForm.component[20].number = row.number;
    //   that.tableDetailForm.idForm.component[20].name = row.name;
    // };
    // this.tableDetailForm.idForm.component[21].event.beforeGetTableList = function (
    //   filterData
    // ) {
    //   filterData.auditStatus = 1;
    //   filterData.isDisable = false;
    // };
    // this.tableDetailForm.idForm.component[21].event.confirm = function (row) {
    //   that.tableDetailForm.idForm.data.pId = row.id;
    //   that.tableDetailForm.idForm.data.pNumber = row.number;
    //   that.tableDetailForm.idForm.data.pName = row.name;
    //   that.tableDetailForm.idForm.component[21].id = row.id;
    //   that.tableDetailForm.idForm.component[21].number = row.number;
    //   that.tableDetailForm.idForm.component[21].name = row.name;
    // };
    // this.tableDetailForm.idForm.component[23].event.confirm = function (row) {
    //   that.tableDetailForm.idForm.data.groupId = row.id;
    //   that.tableDetailForm.idForm.data.groupNumber = row.number;
    //   that.tableDetailForm.idForm.data.groupName = row.name;
    //   that.tableDetailForm.idForm.component[23].id = row.id;
    //   that.tableDetailForm.idForm.component[23].number = row.number;
    //   that.tableDetailForm.idForm.component[23].name = row.name;
    // };
  },
  methods: {
    //附件上传-----------------CC代码
    clearAttacheFunc() {
      this.attacheFormValidate = {
        number: '',
        mark: '',
      };
      this.attacheTableSelection = [];
      this.attacheDialog = {
        title: '上传附件',
        v: false,
        picFile: '',
        rawFile: '',
        attacheId: '',
      };
    },
    handleAttacheDialogOpen() {
      this.attacheDialog.v = true;
    },
    beforeAttacheUpload(file) {
      this.attacheDialog.rawFile = file;
    },
    postAttach() {
      this.$refs.attacheForm.validate(async (valid) => {
        if (valid) {
          if (!this.attacheDialog.rawFile.size) {
            this.$message('请上传一个附件');
          } else {
            this.attacheDialog.btnDisabled = true;
            let res = await Promise.resolve(
              uploadFile(this.attacheDialog.rawFile)
            );
            this.postAttachCancel();
            this.attacheDialog.btnDisabled = false;
            if (res.data.code !== 200) return -1;
            const id = res.data.data.id;
            await this.addOneAttachRecord(id);
          }
        }
      });
    },
    postAttachCancel() {
      this.attacheDialog.v = false;
      this.attacheDialog.picFile = '';
      this.attacheDialog.rawFile = {};
    },
    async addOneAttachRecord(id) {
      const param = {
        ...this.attacheFormValidate,
        archivesId: this.tableDetailForm.idForm.data.id,
        fdfsId: id,
      };
      let res = await Promise.resolve(addList(param));
      if (res.data.code === 200) {
        this.$message.success(res.data.msg);
        this.clearAttacheFunc();
        this.$refs['tableFormList'].editTableForm(
          this.tableDetailForm.idForm.data
        );
      } else {
        this.$notifyError('错误', res.data.msg);
      }
    },
    //——————————
    beforeGetTableList(filterData) {
      filterData.showAll = this.actionBarConfig[5].vModel;
    },
    afterGetTablePage(tableData) {
      tableData.forEach((tItem) => {
        tItem.auditStatus = tItem.auditStatus ? '已审核' : '未审核';
        tItem.isDisable = tItem.isDisable ? '已禁用' : '未禁用';
      });
    },
    listBarClick(target, index, page) {
      if (index === 0) {
        switch (target) {
          case 'list-download':
            this.listDownload(page);
            break;
          case 'list-upload':
            this.handleAttacheDialogOpen();
            break;
        }
      }
    },
    listDownload(page) {
      if (page.tableSelectData.length === 0) return;
      page.tableSelectData.forEach((i) => {
        fetch(i.fileUrl).then((res) =>
          res.blob().then((blob) => {
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(blob);
            var filename = i.fileName;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          })
        );
      });
    },
    initTableDetail(data, treeSelectData) {
      if (data) {
        this.tableDetailForm.idForm.data = data;
        this.tableDetailForm.idForm.data.auditStatus = String(
          this.tableDetailForm.idForm.data.auditStatus
        );
        this.tableDetailForm.idForm.data.isDisable = String(
          this.tableDetailForm.idForm.data.isDisable
        );
        this.tableDetailForm.idForm.data.materialType = String(
          this.tableDetailForm.idForm.data.materialAttribute
        );
      } else {
        this.tableDetailForm.idForm.data = {
          id: '',
          orgId: this.$store.state.user.userInfo.orgId, //组织
          number: '', //设备代码
          name: '', //设备名称
          type: 0, //设备类别id
          typeNumber: '', //设备类别number
          typeName: '', //设备类别name
          specifications: '', //规格
          model: '', //型号
          personId: 0, //负责人
          personNumber: '', //负责人number
          personName: '', //负责人name
          madeCountry: '', //生产国别
          manufacturersId: 0, //生产厂商id
          manufacturerNumber: '', //生产厂商number
          manufacturerName: '', //生产厂商name
          supplierId: 0, //原材料id
          supplierNumber: '', //原材料number
          supplierName: '', //原材料name
          departmentId: 0, //部门id
          departmentNumber: '', //部门number
          // departmentName: '', //部门name
          factoryNumber: '', //出厂代码
          manufactureDate: '', //出厂日期
          installationDate: '', //安装日期
          commissioningDate: '', //启用日期
          containerId: '', //数采结构id
          containerNumber: '', //数采结构number
          containerName: '', //数采结构name
          // weight: 0, //重量（T）
          // power: 0, //功率（KW）
          // overallDimensions: '', //外形尺寸
          // originalValue: '', //设备原值
          // sources: '', //设备来源
          warehouseId: 0, //存放位置id
          warehouseNumber: '', //存放位置number
          // warehouseName: '', //存放位置name
          pid: 0, //父设备号id
          pNumber: '', //父设备号number
          // pName: '', //父设备号name
          // fileNo: "", //图号/档案号
          note: '', //备注
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
          groupId: treeSelectData ? treeSelectData.id : 0, //分组内码
          groupNumber: treeSelectData ? treeSelectData.number : '000', //分组代码
          groupName: treeSelectData ? treeSelectData.name : '设备档案', //分组名称
        };
      }
      //统一处理字段的可编辑
      this.handleCompDisable(
        this.tableDetailForm.idForm.data.auditStatus,
        this.tableDetailForm.idForm.data.isDisable
      );
      //处理产品弹窗遗留问题
      this.handleInputPopup(
        'typeName',
        this.tableDetailForm.idForm.data.type,
        this.tableDetailForm.idForm.data.typeNumber,
        this.tableDetailForm.idForm.data.typeName
      );
      this.handleInputPopup(
        'personName',
        this.tableDetailForm.idForm.data.personId,
        this.tableDetailForm.idForm.data.personNumber,
        this.tableDetailForm.idForm.data.personName
      );
      this.handleInputPopup(
        'manufacturerName',
        this.tableDetailForm.idForm.data.manufacturersId,
        this.tableDetailForm.idForm.data.manufacturerNumber,
        this.tableDetailForm.idForm.data.manufacturerName
      );
      this.handleInputPopup(
        'supplierName',
        this.tableDetailForm.idForm.data.supplierId,
        this.tableDetailForm.idForm.data.supplierNumber,
        this.tableDetailForm.idForm.data.supplierName
      );
      // this.handleInputPopup(
      //   'departmentName',
      //   this.tableDetailForm.idForm.data.departmentId,
      //   this.tableDetailForm.idForm.data.departmentNumber,
      //   this.tableDetailForm.idForm.data.departmentName
      // );
      this.handleInputPopup(
        'containerName',
        this.tableDetailForm.idForm.data.containerId,
        this.tableDetailForm.idForm.data.containerNumber,
        this.tableDetailForm.idForm.data.containerName
      );
      // this.handleInputPopup(
      //   'warehouseName',
      //   this.tableDetailForm.idForm.data.warehouseId,
      //   this.tableDetailForm.idForm.data.warehouseNumber,
      //   this.tableDetailForm.idForm.data.warehouseName
      // );
      // this.handleInputPopup(
      //   'pName',
      //   this.tableDetailForm.idForm.data.pid,
      //   this.tableDetailForm.idForm.data.pNumber,
      //   this.tableDetailForm.idForm.data.pName
      // );
      //统一处理弹窗遗留问题
      this.handleInputPopup(
        'groupName',
        this.tableDetailForm.idForm.data.groupId,
        this.tableDetailForm.idForm.data.groupNumber,
        this.tableDetailForm.idForm.data.groupName
      );
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
        this.formList[
          index
        ].form.data.archivesId = this.tableDetailForm.idForm.data.id;
        if (
          this.tableDetailForm.idForm.data.auditStatus === '0' &&
          this.tableDetailForm.idForm.data.isDisable === '0'
        )
          callBack(index, true);
      } else {
        for (let sub in this.formList[index].form.data) {
          if (typeof this.formList[index].form.data[sub] === 'string') {
            this.formList[index].form.data[sub] = '';
          } else if (typeof this.formList[index].form.data[sub] === 'number') {
            this.formList[index].form.data[sub] = 0;
          }
        }
        this.formList[index].form.data = {
          ...this.formList[index].form.data,
          archivesId: this.tableDetailForm.idForm.data.id, //表单Id
          orgId: this.$store.state.user.userInfo.orgId,
        };
      }
    },
  },
};
</script>
<style lang="less" scoped>
.diaTitle {
  border-bottom: 1px solid #c4c4c4;
  height: 60px;
  margin: -20px -20px -10px -20px;
  padding-left: 25px;
  padding-top: 19px;
}

.diaTitleText {
  font-size: 16px;
  line-height: 22px;
  font-weight: bolder;
  font-family: 微软雅黑, serif;
}

.diaFooter {
  margin-top: -30px;

  .el-button {
    margin-right: 16px;
  }
}

::v-deep .el-upload {
  display: block;
}
::v-deep .el-upload-dragger {
  width: calc(~'100% - 100px');
  margin-left: 100px;
}
</style>
