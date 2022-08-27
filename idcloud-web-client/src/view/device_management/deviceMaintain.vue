<template>
  <div>
    <id-tree-table-form-list ref="page" tableErrTip="设备保养" :isTree="false" :getTable="getTable" :getTableDetail="getTableDetail" :deleteTableDetails="deleteTableDetails" :addTableDetail="addTableDetail" :updateTableDetail="updateTableDetail" :audit="audit" :antiAudit="antiAudit" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" @beforeGetTableList="beforeGetTableList" @afterGetTablePage="afterGetTablePage" :actionBarFormConfig="actionBarFormConfig" :tableDetailForm="tableDetailForm" @actionBarClick="actionBarClick" @initTableDetail="initTableDetail" @beforeLeave="beforeLeave" :formList="formList" @formListAlter="formListAlter" @initListDetail="initListDetail" @beforeListFormCommit="beforeListFormCommit" customAction :customWidth="'155px'">
      <template v-slot:moreAction="{ row, column, index }">
        <el-button v-show="row.status==='未派工'" type="primary" plain size="mini" @click="formShow('派工',row)">派工
        </el-button>
        <el-button v-show="row.status==='完工'" type="primary" plain size="mini" @click="formShow('验收',row)">验收
        </el-button>
      </template>
      <template v-slot:formListAction0="{ row, column, index }">
        <el-button type="primary" plain size="mini" @click="imgShow(row)">图片预览
        </el-button>
      </template>
    </id-tree-table-form-list>

    <el-dialog :visible.sync="dispatchForm.show" @closed="formClose(dispatchForm.tableErrTip)">
      <id-form :ref="dispatchForm.tableErrTip" class="dia-form" :id-form="dispatchForm.form" label-width="100px"></id-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ dispatchForm.tableErrTip }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="formClose(dispatchForm.tableErrTip)">取消</el-button>
        <el-button type="primary" @click="formConfirm(dispatchForm.tableErrTip)">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="acceptanceForm.show" @closed="formClose(acceptanceForm.tableErrTip)">
      <id-form :ref="acceptanceForm.tableErrTip" class="dia-form" :id-form="acceptanceForm.form" label-width="100px"></id-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ acceptanceForm.tableErrTip }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="formClose(acceptanceForm.tableErrTip)">取消</el-button>
        <el-button type="primary" @click="formConfirm(acceptanceForm.tableErrTip)">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="bodyImgShow" :visible.sync="bodyImgShow" title="图片预览" @closed="bodyImgShow=false" width="540px">
      <el-form ref="img" label-width="95px" size="medium" label-position="right">
        <div style="overflow: auto;display: flex;flex-direction: column;align-items: center;justify-content: flex-start;" :style="url === ''?null: 'height: 600px'">
          <div v-if="url === ''">
            没有图片
          </div>
          <div v-else style="width: 100%">
            <el-image v-for="(item,index) in url" :key="index" fit="contain" style="height: 500px;width: 500px; margin: 0 auto;" :src="item" :preview-src-list="url">
            </el-image>
          </div>
        </div>
      </el-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">图片预览</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IdTreeTableFormList from '@/components/id-pages/IdTreeTableFormList';
import IdForm from '@/components/id-form/index';
import IdButtonConfig from '@/components/id-button/IdButtonConfig';
import {
  getList,
  getDetail,
  add,
  batchDel,
  update,
  audit,
  antiAudit,
  addList,
  batchDelList,
  addList1,
  batchDelList1,
  dispatch,
  acceptance,
} from '@/api/deviceMaintenance/deviceRepair';
import { deviceInputPopupColumns } from '../tableColumns/deviceTableColumns';
import {
  getList as getDeviceList,
  getGroupList as getDeviceGroupList,
  getPositionList,
} from '@/api/deviceMaintenance/deviceArchive';
import { materialInputPopupColumns } from '../tableColumns/materialTableColumns';
import { getMaterialSparePart } from '@/api/factoryModel/material';
import { clerkInputPopupColumns } from '../tableColumns/clerkTableColumns';
import {
  getList as getClerkList,
  getGroupList as getClerkGroupList,
} from '@/api/basicData/clerk';

export default {
  name: 'deviceMaintain',
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
  data() {
    return {
      //图片预览
      bodyImgShow: false,
      url: '',
      //派工
      dispatchForm: {
        show: false,
        tableErrTip: '派工',
        form: {
          data: {
            id: '',
            chargePersonId: 0, //派工人
            chargePersonNumber: '',
            chargePersonName: '',
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            chargePersonName: [
              {
                required: true,
                message: '派工人不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            {
              classKey: 'chargePersonName',
              label: '派工人',
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
              diaTitle: '派工人',
              event: {},
            },
          ],
        },
      },
      //工单验收
      acceptanceForm: {
        show: false,
        tableErrTip: '验收',
        form: {
          data: {
            id: '',
            reworkCount: 0, //返工次数
            acceptanceResult: '0', //验收结果  0不通过   1通过
            acceptanceFeedback: '', //验收反馈
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            acceptanceResult: [
              {
                required: true,
                message: '验收结果不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            acceptanceFeedback: [
              {
                required: true,
                message: '验收反馈不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            {
              classKey: 'acceptanceResult',
              label: '验收结果',
              tag: 'id-select',
              placeholder: '请选择',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              options: [
                {
                  label: '不通过',
                  value: '0',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '通过',
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
              classKey: 'acceptanceFeedback',
              label: '验收反馈',
              tag: 'el-input',
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
          label: '工单代码',
          prop: 'number',
          minWidth: 240,
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
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '部位代码',
          prop: 'partNumber',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '部位名称',
          prop: 'partName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '工单状态',
          prop: 'status',
          minWidth: 120,
          showOverflowTooltip: true,
          comp: 'Select',
          options: [
            {
              label: '未派工',
              value: '0',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '未开工',
              value: '1',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '执行中',
              value: '2',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '完工',
              value: '3',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '验收',
              value: '4',
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
          tag: 'el-table-column',
          label: '工单日期',
          prop: 'orderTime',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '工单来源',
          prop: 'source',
          minWidth: 120,
          showOverflowTooltip: true,
          comp: 'Select',
          options: [
            {
              label: '点检',
              value: '0',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '手动添加',
              value: '1',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '返工',
              value: '2',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '自动生成',
              value: '3',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '返工',
              value: '4',
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
          tag: 'el-table-column',
          label: '内容以及要求',
          prop: 'content',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '负责人代码',
          prop: 'chargePersonNumber',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '负责人名称',
          prop: 'chargePersonName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '停机状态',
          prop: 'downStatus',
          minWidth: 120,
          showOverflowTooltip: true,
          comp: 'Select',
          options: [
            {
              label: '不停机',
              value: '0',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              label: '停机',
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
        labelWidth: '120px',
        idForm: {
          data: {
            id: '',
            orgId: this.$store.state.user.userInfo.orgId, //组织
            type: 2, //类型2 设备保养
            number: '', //代码
            equipmentId: 0, //设备
            archivesNumber: '',
            archivesName: '',
            partId: 0, //部位
            partNumber: '',
            partName: '',
            status: '0', //工单状态
            orderTime: '', //工单日期
            source: '0', //工单来源
            content: '', //内容以及要求
            chargePersonId: 0, //负责人
            chargePersonNumber: '',
            chargePersonName: '',
            downStatus: '0', //停机
            //隐藏字段
            reworkCount: 0, //验收次数
            acceptanceResult: '', //验收结果
            acceptanceFeedback: '', //验收反馈
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
            updateTime: '', //最后更新时间
          },
          rules: {
            archivesName: [
              {
                required: true,
                message: '设备不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            orderTime: [
              {
                required: true,
                message: '工单日期不能为空',
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
            chargePersonName: [
              {
                required: true,
                message: '负责人不能为空',
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
            //需要class化
            {
              classKey: 'number',
              label: '工单代码',
              tag: 'el-input',
              placeholder: '可自动生成',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'archivesName',
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
              classKey: 'status',
              label: '工单状态',
              tag: 'id-select',
              options: [
                {
                  label: '未派工',
                  value: '0',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '未开工',
                  value: '1',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '执行中',
                  value: '2',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '完工',
                  value: '3',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '验收',
                  value: '4',
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
              classKey: 'orderTime',
              label: '工单日期',
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
              classKey: 'source',
              label: '工单来源',
              tag: 'id-select',
              options: [
                {
                  label: '点检',
                  value: '0',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '手动添加',
                  value: '1',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '返工',
                  value: '2',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '自动生成',
                  value: '3',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '返工',
                  value: '4',
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
              classKey: 'content',
              label: '内容以及要求',
              tag: 'el-input',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'chargePersonName',
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
              classKey: 'downStatus',
              label: '是否停机',
              tag: 'id-select',
              options: [
                {
                  label: '不停机',
                  value: '0',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '停机',
                  value: '1',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
              ],
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'reworkCount',
              label: '验收次数',
              tag: 'el-input',
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: false,
            },
            {
              classKey: 'acceptanceResult',
              label: '验收结果',
              tag: 'id-select',
              options: [
                {
                  label: '不通过',
                  value: '0',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  label: '通过',
                  value: '1',
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
              idShow: false,
            },
            {
              classKey: 'acceptanceFeedback',
              label: '验收反馈',
              tag: 'el-input',
              type: 'textarea',
              rows: 3, //需要人员自己调整
              gridRowStart: 3,
              gridColumnStart: 3,
              maxlength: 250,
              showWordLimit: true,
              freeze: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: false,
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
          ],
        },
      },
      //表体配置
      formList: [
        {
          fromList: 'reportList',
          tableErrTip: '工单汇报',
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
              label: '执行结果',
              prop: 'executionResultName',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '汇报内容',
              prop: 'content',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '开始时间',
              prop: 'workStartTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '执行时长(分)',
              prop: 'workTime',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '结束时间',
              prop: 'workEndTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '停机开始时间',
              prop: 'stopTimeStart',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '停机时长(分)',
              prop: 'stopTime',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '停机结束时间',
              prop: 'stopTimeEnd',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '汇报人代码',
              prop: 'personNumber',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '汇报人名称',
              prop: 'personName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
          ],
          customWidth: '170px',
          form: {
            data: {
              workOrderId: 0, //表单Id
              id: '',
              workTimes: [], //实际时间
              workStartTime: '', //实际开始时间
              workEndTime: '', //实际结束时间
              stopTimes: [], //停机时间
              stopTimeStart: '', //停机开始时间
              stopTimeEnd: '', //停机结束时间
              executionResult: '0', //执行结果
              content: '', //执行内容
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              workTimes: [
                {
                  required: true,
                  message: '实际时间不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              stopTimes: [],
              executionResult: [
                {
                  required: true,
                  message: '执行结果不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              content: [
                {
                  required: true,
                  message: '执行内容不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            component: [
              {
                classKey: 'workTimes',
                label: '实际时间',
                tag: 'el-date-picker',
                type: 'datetimerange',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                rangeSeparator: '-',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间',
                placeholder: '选择时间范围',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'stopTimes',
                label: '停机时间',
                tag: 'el-date-picker',
                type: 'datetimerange',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                rangeSeparator: '-',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间',
                placeholder: '选择时间范围',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'executionResult',
                label: '执行结果',
                tag: 'id-select',
                placeholder: '请选择',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                options: [
                  {
                    label: '执行中',
                    value: '0',
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '完成',
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
                classKey: 'content',
                label: '工单内容',
                tag: 'el-input',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            ],
          },
          add: addList,
          update: null,
          delete: batchDelList,
        },
        {
          fromList: 'partDTOList',
          tableErrTip: '备件领用',
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
              label: '数量',
              prop: 'num',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '领用人代码',
              prop: 'recipientNumber',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '领用人名称',
              prop: 'recipientName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '领用时间',
              prop: 'recipientDate',
              minWidth: 180,
              showOverflowTooltip: true,
            },
          ],
          form: {
            data: {
              workOrderId: 0, //表单Id
              id: '',
              materialId: 0, //备件
              materialNumber: '',
              materialName: '',
              num: 0, //领用数量
              recipientId: 0, //领用人
              recipientNumber: '',
              recipientName: '',
              recipientDate: '', //领用时间
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
                  message: '领用数量不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
              recipientName: [
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
              {
                classKey: 'partName',
                label: '备件',
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
                diaTitle: '备件',
                event: {},
              },
              {
                classKey: 'num',
                label: '领用数量',
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
                classKey: 'recipientName',
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
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                placeholder: '请选择时间',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            ],
          },
          add: addList1,
          update: null,
          delete: batchDelList1,
        },
      ],
    };
  },
  created() {
    this.$watch(
      function () {
        return this.tableDetailForm.idForm.data.downStatus;
      },
      function (newValue, oldValue) {
        this.formList[0].form.rules.stopTimes =
          newValue === '1'
            ? [
                {
                  required: true,
                  message: '停机时间不能为空',
                  trigger: ['blur', 'change'],
                },
              ]
            : [];
      }
    );

    let that = this;
    this.dispatchForm.form.component[0].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.dispatchForm.form.component[0].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['在职', '试用', '实习', '退休', '离职', '离休'];
      tableData.forEach((tItem) => {
        tItem.type = options[tItem.type];
      });
    };
    this.dispatchForm.form.component[0].event.confirm = function (row) {
      that.dispatchForm.form.data.chargePersonId = row.id;
      that.dispatchForm.form.data.chargePersonNumber = row.number;
      that.dispatchForm.form.data.chargePersonName = row.name;
      that.dispatchForm.form.component[0].id = row.id;
      // that.dispatchForm.form.component[0].number = row.number;
      that.dispatchForm.form.component[0].name = row.name;
    };

    this.formList[1].form.component[0].event.confirm = function (row) {
      that.formList[1].form.data.materialId = row.id;
      that.formList[1].form.data.materialNumber = row.number;
      that.formList[1].form.data.materialName = row.name;
      that.formList[1].form.component[0].id = row.id;
      that.formList[1].form.component[0].number = row.number;
      that.formList[1].form.component[0].name = row.name;
    };
    this.formList[1].form.component[2].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.formList[1].form.component[2].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['在职', '试用', '实习', '退休', '离职', '离休'];
      tableData.forEach((tItem) => {
        tItem.type = options[tItem.type];
      });
    };
    this.formList[1].form.component[2].event.confirm = function (row) {
      that.formList[1].form.data.recipientId = row.id;
      that.formList[1].form.data.recipientNumber = row.number;
      that.formList[1].form.data.recipientName = row.name;
      that.formList[1].form.component[2].id = row.id;
      that.formList[1].form.component[2].number = row.number;
      that.formList[1].form.component[2].name = row.name;
    };

    this.tableDetailForm.idForm.component[1].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[1].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.equipmentId = row.id;
      that.tableDetailForm.idForm.data.archivesNumber = row.number;
      that.tableDetailForm.idForm.data.archivesName = row.name;
      that.tableDetailForm.idForm.component[1].id = row.id;
      that.tableDetailForm.idForm.component[1].number = row.number;
      that.tableDetailForm.idForm.component[1].name = row.name;
    };
    this.tableDetailForm.idForm.component[2].event.beforeGetTableList = function (
      filterData
    ) {
      // filterData.auditStatus = 1;
      // filterData.isDisable = false;
      filterData.orgId = undefined;
      filterData.archivesId = that.tableDetailForm.idForm.data.equipmentId;
    };
    this.tableDetailForm.idForm.component[2].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.partId = row.id;
      that.tableDetailForm.idForm.data.partNumber = row.number;
      that.tableDetailForm.idForm.data.partName = row.name;
      that.tableDetailForm.idForm.component[2].id = row.id;
      that.tableDetailForm.idForm.component[2].number = row.number;
      that.tableDetailForm.idForm.component[2].name = row.name;
    };
    this.tableDetailForm.idForm.component[7].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[7].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['在职', '试用', '实习', '退休', '离职', '离休'];
      tableData.forEach((tItem) => {
        tItem.type = options[tItem.type];
      });
    };
    this.tableDetailForm.idForm.component[7].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.chargePersonId = row.id;
      that.tableDetailForm.idForm.data.chargePersonNumber = row.number;
      that.tableDetailForm.idForm.data.chargePersonName = row.name;
      that.tableDetailForm.idForm.component[7].id = row.id;
      that.tableDetailForm.idForm.component[7].number = row.number;
      that.tableDetailForm.idForm.component[7].name = row.name;
    };
  },
  methods: {
    //图片预览弹窗打开
    imgShow(rows) {
      this.url = rows.imgUrl.length === 0 ? '' : rows.imgUrl;
      this.$nextTick(() => {
        this.bodyImgShow = true;
      });
    },
    //弹窗打开
    formShow(ref, row) {
      if (ref === '派工') {
        this.dispatchForm.form.data = {
          id: row.id,
          chargePersonId: 0, //派工人
          chargePersonNumber: '',
          chargePersonName: '',
          orgId: this.$store.state.user.userInfo.orgId,
        };
        this.dispatchForm.form.component[0].id = 0;
        this.dispatchForm.form.component[0].name = '';
        this.$nextTick(() => {
          this.dispatchForm.show = true;
        });
      } else {
        this.acceptanceForm.form.data = {
          id: row.id,
          reworkCount: row.reworkCount, //返工次数
          acceptanceResult: '0', //验收结果  0不通过   1通过
          acceptanceFeedback: '', //验收反馈
          orgId: this.$store.state.user.userInfo.orgId,
        };
        this.$nextTick(() => {
          this.acceptanceForm.show = true;
        });
      }
    },
    // 弹窗关闭
    formClose(ref) {
      if (ref === '派工') {
        this.dispatchForm.form.component[0].id = 0;
        this.dispatchForm.form.component[0].name = '';
        this.dispatchForm.show = false;
      } else {
        this.acceptanceForm.show = false;
      }
      this.$nextTick(() => {
        this.$refs[ref].$refs['idForm'].resetFields();
      });
    },
    // 弹窗确认
    async formConfirm(ref) {
      this.$refs[ref].$refs['idForm'].validate(async (valid) => {
        if (valid) {
          let request = null;
          let data = null;
          if (ref === '派工') {
            request = dispatch;
            data = this.dispatchForm.form.data;
          } else {
            request = acceptance;
            data = this.acceptanceForm.form.data;
          }
          await request(data)
            .then((response) => {
              response = response.data;
              if (response.code === 200) {
                this.$message.success(`${ref}成功`);
                this.formClose(ref);
                this.$refs['page'].handleQueryData();
              } else {
                this.$notifyError(`${ref}失败`, response.msg);
              }
            })
            .catch((response) => {
              this.$notifyError(`${ref}失败`, '异常信息：' + response);
            });
        } else {
          this.$message.error('*为必填项');
        }
      });
    },
    // 原有api
    beforeGetTableList(filterData) {
      filterData.type = 2;
    },
    afterGetTablePage(tableData) {
      const sources = ['点检', '手动添加', '返工', '自动生成', '返工'];
      const statuses = ['未派工', '未开工', '执行中', '完工', '验收'];
      tableData.forEach((tItem) => {
        tItem.auditStatus = tItem.auditStatus ? '已审核' : '未审核';
        tItem.downStatus = tItem.downStatus ? '不停机' : '停机';
        tItem.source = sources[tItem.downStatus];
        tItem.status = statuses[tItem.status];
      });
    },
    actionBarClick(target, value) {
      if (target === 'form-dispatch') {
        this.formShow('派工', this.tableDetailForm.idForm.data);
      } else if (target === 'form-acceptance') {
        this.formShow('验收', this.tableDetailForm.idForm.data);
      }
    },
    initTableDetail(data) {
      if (data) {
        this.tableDetailForm.idForm.data = data;
        this.tableDetailForm.idForm.data.auditStatus = String(
          this.tableDetailForm.idForm.data.auditStatus
        );
        this.tableDetailForm.idForm.data.status = String(
          this.tableDetailForm.idForm.data.status
        );
        this.tableDetailForm.idForm.data.source = String(
          this.tableDetailForm.idForm.data.source
        );
        this.tableDetailForm.idForm.data.downStatus = String(
          this.tableDetailForm.idForm.data.downStatus
        );
        this.tableDetailForm.idForm.data.acceptanceResult = String(
          this.tableDetailForm.idForm.data.acceptanceResult
        );
      } else {
        this.tableDetailForm.idForm.data = {
          id: '',
          orgId: this.$store.state.user.userInfo.orgId, //组织
          type: 2, //类型2 设备保养
          number: '', //代码
          equipmentId: 0, //设备
          archivesNumber: '', //
          archivesName: '', //
          partId: 0, //部位
          partNumber: '',
          partName: '',
          status: '0', //工单状态
          orderTime: '', //工单日期
          source: '0', //工单来源
          content: '', //内容以及要求
          chargePersonId: 0, //负责人
          chargePersonNumber: '',
          chargePersonName: '',
          downStatus: '0', //停机
          reworkCount: 0, //验收次数
          acceptanceResult: '', //验收结果
          acceptanceFeedback: '', //验收反馈
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
          updateTime: '', //最后更新时间
        };
      }
      // this.formValidate.orderStatus === '4',label: "验收结果",
      // this.formValidate.source === '2',label: "验收次数",
      // this.formValidate.orderStatus === '4' ,label: "验收反馈",
      this.tableDetailForm.idForm.component[9].idShow =
        this.tableDetailForm.idForm.data.source === '2';
      this.tableDetailForm.idForm.component[10].idShow =
        this.tableDetailForm.idForm.data.status === '4';
      this.tableDetailForm.idForm.component[11].idShow =
        this.tableDetailForm.idForm.data.status === '4';
      //统一处理字段的可编辑 (审核状态 + 工单状态)
      this.handleCompDisable(
        this.tableDetailForm.idForm.data.auditStatus,
        this.tableDetailForm.idForm.data.status
      );
      //处理产品弹窗遗留问题
      this.tableDetailForm.idForm.component[1].id = this.tableDetailForm.idForm.data.equipmentId;
      this.tableDetailForm.idForm.component[1].number = this.tableDetailForm.idForm.data.archivesNumber;
      this.tableDetailForm.idForm.component[1].name = this.tableDetailForm.idForm.data.archivesName;
      this.tableDetailForm.idForm.component[2].id = this.tableDetailForm.idForm.data.partId;
      this.tableDetailForm.idForm.component[2].number = this.tableDetailForm.idForm.data.partNumber;
      this.tableDetailForm.idForm.component[2].name = this.tableDetailForm.idForm.data.partName;
      this.tableDetailForm.idForm.component[7].id = this.tableDetailForm.idForm.data.chargePersonId;
      this.tableDetailForm.idForm.component[7].number = this.tableDetailForm.idForm.data.chargePersonNumber;
      this.tableDetailForm.idForm.component[7].name = this.tableDetailForm.idForm.data.chargePersonName;
      this.tableDetailForm.idForm.component[13].id = this.tableDetailForm.idForm.data.docMakerId;
      this.tableDetailForm.idForm.component[13].number = this.tableDetailForm.idForm.data.docMakerNumber;
      this.tableDetailForm.idForm.component[13].name = this.tableDetailForm.idForm.data.docMakerName;
      this.tableDetailForm.idForm.component[16].id = this.tableDetailForm.idForm.data.auditPersonId;
      this.tableDetailForm.idForm.component[16].number = this.tableDetailForm.idForm.data.auditPersonNumber;
      this.tableDetailForm.idForm.component[16].name = this.tableDetailForm.idForm.data.auditPersonName;
    },
    formListAlter(fromList, data, index) {
      const auditStatus = this.tableDetailForm.idForm.data.auditStatus;
      const status = this.tableDetailForm.idForm.data.status;
      if (index === 0) {
        const types = ['执行中', '完成'];
        data.forEach((dItem) => {
          dItem.executionResultName = types[dItem.executionResult];
          dItem.deleteable = !(
            auditStatus === '1' &&
            (status === '1' || status === '2')
          );
        });
      } else {
        data.forEach((dItem) => {
          dItem.deleteable = !(
            auditStatus === '1' &&
            (status === '1' || status === '2')
          );
        });
      }
    },
    initListDetail(index, row, callBack) {
      if (row) {
        callBack(index, false);
      } else {
        if (index === 0) {
          this.formList[index].form.data = {
            workOrderId: this.tableDetailForm.idForm.data.id, //表单Id
            id: '',
            workTimes: [], //实际时间
            workStartTime: '', //实际开始时间
            workEndTime: '', //实际结束时间
            stopTimes: [], //停机时间
            stopTimeStart: '', //停机开始时间
            stopTimeEnd: '', //停机结束时间
            executionResult: '0', //执行结果
            content: '', //执行内容
            orgId: this.$store.state.user.userInfo.orgId,
          };
          this.formList[index].form.component[1].idShow =
            this.tableDetailForm.idForm.data.downStatus === '1';
        } else {
          this.formList[index].form.data = {
            workOrderId: this.tableDetailForm.idForm.data.id, //表单Id
            id: '',
            materialId: 0, //备件
            materialNumber: '',
            materialName: '',
            num: 0, //领用数量
            recipientId: 0, //领用人
            recipientNumber: '',
            recipientName: '',
            recipientDate: '', //领用时间
            orgId: this.$store.state.user.userInfo.orgId,
          };
          //统一处理弹窗遗留问题
          this.formList[index].form.component[0].id = 0;
          this.formList[index].form.component[0].number = '';
          this.formList[index].form.component[0].name = '';
          this.formList[index].form.component[2].id = 0;
          this.formList[index].form.component[2].number = '';
          this.formList[index].form.component[2].name = '';
        }
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
    beforeListFormCommit(data, index, mess) {
      if (index === 0) {
        data.workStartTime = data.workTimes[0];
        data.workEndTime = data.workTimes[1];
        if (data.stopTimes.length > 0) {
          data.stopTimeStart = data.stopTimes[0];
          data.stopTimeEnd = data.stopTimes[1];
        }
      }
    },
    //统一处理获取数据时的组件状态 （根据审核状态 + 工单状态） + 工具条状态
    handleCompDisable(auditStatus, status) {
      if (auditStatus === '0') {
        //统一处理表单组件是否编辑
        this.tableDetailForm.idForm.component.forEach(
          (cItem) => (cItem.idDisable = !!cItem.freeze)
        );
      } else {
        //统一处理表单组件是否编辑
        this.tableDetailForm.idForm.component.forEach(
          (cItem) => (cItem.idDisable = true)
        );
      }
      //统一处理表单工具条展示问题
      if (this.tableDetailForm.idForm.data.id) {
        this.actionBarFormConfig = [
          new IdButtonConfig('button-add', '提交', 'form-commit', {
            type: 'primary',
            idDisable: auditStatus === '1',
          }),
          {
            tag: 'id-group-button',
            classKey: 'create',
            childButton: [
              {
                text: '新建',
                target: 'form-create',
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: '复制',
                target: 'form-copy',
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ],
          },
          {
            tag: 'id-group-button',
            classKey: 'sheet',
            childButton: [
              {
                text: '上页',
                target: 'form-previous',
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
              {
                text: '下页',
                target: 'form-next',
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: false,
              },
            ],
          },
          {
            tag: 'id-dropdown',
            text: '审核',
            childButton: [
              {
                text: '审核',
                target: 'form-audit',
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: auditStatus !== '0' || status !== '1',
              },
              {
                text: '反审核',
                target: 'form-antiAudit',
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: auditStatus !== '1' || status !== '1',
              },
            ],
          },
          new IdButtonConfig('button-dispatch', '派工', 'form-dispatch', {
            styleOne: true,
            idShow: status === '0',
          }),
          new IdButtonConfig('button-acceptance', '验收', 'form-acceptance', {
            styleOne: true,
            idShow: status === '3',
          }),
          new IdButtonConfig('button-delete', '删除', 'form-delete', {
            styleOne: true,
            idDisable: auditStatus === '1',
          }),
        ];
      } else {
        this.actionBarFormConfig = [
          new IdButtonConfig('button-add', '提交', 'form-commit', {
            type: 'primary',
          }),
          new IdButtonConfig('button-create', '重置', 'form-create', {
            styleOne: true,
          }),
        ];
      }
      //统一处理表体组件问题
      this.formList.forEach((fItem) => {
        fItem.actionBarConfig.forEach((aItem) => {
          aItem.idDisable = !(
            auditStatus === '1' &&
            (status === '1' || status === '2')
          );
        });
      });
    },
    //统一处理表单的弹窗问题
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
</style>
