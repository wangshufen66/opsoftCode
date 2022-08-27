<template>
  <div>
    <id-tree-table-form-list ref="page" tableErrTip="设备加工任务" :isTree="false" :getTable="getTable" :getTableDetail="getTableDetail" :deleteTableDetails="deleteTableDetails" :addTableDetail="addTableDetail" :updateTableDetail="updateTableDetail" :audit="audit" :antiAudit="antiAudit" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" :actionBarFormConfig="actionBarFormConfig" :tableDetailForm="tableDetailForm" @afterGetTablePage="afterGetTablePage" :span-method="objectSpanMethod" @initTableDetail="initTableDetail" @beforeLeave="beforeLeave" :formList="formList" @formListAlter="formListAlter" @initListDetail="initListDetail">
      <template v-slot:formListAction0="{ row, column, cIndex }">
        <el-button v-show="row.status === 0" type="primary" plain size="mini" @click="listRowAction('开工', row)">开工
        </el-button>
        <el-button v-show="row.status === 1" style="margin-left: 0.2rem" type="primary" plain size="mini" @click="formShow('完工', row)">完工
        </el-button>
        <el-button v-show="row.status === 2" style="margin-left: 0.2rem" type="primary" plain size="mini" @click="formShow('审核', row)">审核
        </el-button>
      </template>
    </id-tree-table-form-list>

    <el-dialog :visible.sync="numForm.show" @closed="formClose(numForm.tableErrTip)">
      <id-form :ref="numForm.tableErrTip" class="dia-form" :id-form="numForm.form" label-width="80px"></id-form>
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
  updateList,
  delList,
  startWork,
  finishWork,
  bodyAudit,
  getProcessList,
} from '@/api/productionManagement/equipmentProcessTask';
import {
  getProduceTaskTemplate,
  importProduceTaskTemplate,
} from '@/api/productionManagement/excelupdownload';
import {
  getList as getDeviceList,
  getGroupList as getDeviceGroupList,
} from '@/api/deviceMaintenance/deviceArchive';
import { deviceInputPopupColumns } from '../tableColumns/deviceTableColumns';
import {
  getList as getTeamList,
  getGroupList as getTeamGroupList,
} from '@/api/factoryModel/team';
import { teamInputPopupColumns } from '../tableColumns/teamTableColumns';
import {
  getList as getClerkList,
  getGroupList as getClerkGroupList,
} from '@/api/basicData/clerk';
import { clerkInputPopupColumns } from '../tableColumns/clerkTableColumns';

export default {
  name: 'equipmentProcessTask',
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
      // 完工\审核 数量表单
      numForm: {
        show: false,
        tableErrTip: '完工',
        form: {
          data: {
            id: '',
            num: 0, //加工数量
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            num: [
              {
                required: true,
                message: '加工数量不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            {
              classKey: 'num',
              label: '加工数量',
              tag: 'el-input-number',
              placeholder: '请输入',
              controlsPosition: 'right',
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
          tag: 'id-excel',
          excelName: '设备加工任务',
          getTemplate: getProduceTaskTemplate,
          importTemplate: importProduceTaskTemplate,
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
          label: '设备代码',
          prop: 'deviceNo',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '设备名称',
          prop: 'deviceName',
          minWidth: 240,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '加工日期',
          prop: 'processTime',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '人员代码',
          prop: 'personNo',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '人员名称',
          prop: 'personName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '班次代码',
          prop: 'teamNo',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '班次名称',
          prop: 'teamName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '任务单编号',
          prop: 'taskNo',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '物料代码',
          prop: 'materialNo',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '物料名称',
          prop: 'materialName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '工序代码',
          prop: 'processNo',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '工序名称',
          prop: 'processName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '状态',
          prop: 'status',
          minWidth: 120,
          showOverflowTooltip: true,
          comp: 'Select',
          options: [
            {
              value: '0',
              label: '新建',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              value: '1',
              label: '开工',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              value: '2',
              label: '完工',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              value: '3',
              label: '审核',
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              value: '4',
              label: '已质检',
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
          label: '产量',
          prop: 'num',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Number',
        },
        {
          tag: 'el-table-column',
          label: '开始时间',
          prop: 'startTime',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '结束时间',
          prop: 'endTime',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '制单人代码',
          prop: 'docMakePersonNo',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '制单人姓名',
          prop: 'docMakePersonName',
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
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '审核状态',
          prop: 'auditStatus',
          minWidth: 120,
          showOverflowTooltip: true,
          comp: 'Checkbox',
        },
        {
          tag: 'el-table-column',
          label: '审核人代码',
          prop: 'auditPersonNo',
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
          resizable: false,
          showOverflowTooltip: true,
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
            deviceId: 0, //设备内码
            deviceNo: '', //设备代码
            deviceName: '', //设备名称
            processTime: '', //加工日期
            teamId: 0, //班次内码
            teamNo: '', //班次代码
            teamName: '', //班次名称
            personId: 0, //人员内码
            personNo: '', //人员代码
            personName: '', //人员名称
            //审核相关
            createTime: '', //创建时间
            docMakerId: 0, //创建人id
            docMakerNo: '', //制单人代码
            docMakerName: '', //制单人姓名
            updateTime: '', //最后更新时间
            auditStatus: '0', //审核状态
            auditPersonId: 0, //审核人id
            auditPersonNo: '', //审核人代码
            auditPersonName: '', //审核人姓名
            auditTime: '', //审核时间
          },
          rules: {
            deviceName: [
              {
                required: true,
                message: '设备不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            teamName: [
              {
                required: true,
                message: '班组不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            personName: [
              {
                required: true,
                message: '人员不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            processTime: [
              {
                required: true,
                message: '加工日期不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            //需要class化
            {
              classKey: 'deviceName',
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
              classKey: 'processTime',
              label: '加工日期',
              tag: 'el-date-picker',
              type: 'date',
              valueFormat: 'yyyy-MM-dd',
              placeholder: '请输入',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'teamName',
              label: '班组',
              tag: 'id-input-popup',
              controlTooltipShow: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getTeamList,
              getTreeList: getTeamGroupList,
              isTree: true,
              isPage: false,
              id: '',
              number: '',
              name: '',
              tableColumns: teamInputPopupColumns,
              diaTitle: '班组',
              event: {},
            },
            {
              classKey: 'personName',
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
            //需要model化
            //写进一个地方 方便调用
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
              getTableList: getDeviceGroupList,
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
              getTableList: getDeviceGroupList,
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
          fromList: 'taskList',
          tableErrTip: '设备加工物料',
          actionBarConfig: [
            new IdButtonConfig('list-add', '添加', 'list-add', {
              type: 'primary',
            }),
            new IdButtonConfig('list-delete', '删除', 'list-delete', {
              styleOne: true,
            }),
          ],
          selection: false,
          tableColumns: [
            {
              tag: 'el-table-column',
              label: '#',
              fixed: 'left',
              align: 'center',
              type: 'selection',
              width: 45,
              selectable: function (row, index) {
                return !row.deleteable;
              },
            },
            {
              tag: 'el-table-column',
              label: '任务单代码',
              prop: 'taskNo',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '物料代码',
              prop: 'materialNo',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '物料名称',
              prop: 'materialName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '工序代码',
              prop: 'processNo',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '工序名称',
              prop: 'processName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '加工状态',
              prop: 'statusName',
              minWidth: 120,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '开工时间',
              prop: 'startTime',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '完工时间',
              prop: 'endTime',
              minWidth: 180,
              resizable: false,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '加工数量',
              prop: 'num',
              minWidth: 120,
              resizable: false,
              showOverflowTooltip: true,
            },
          ],
          customWidth: '150px',
          form: {
            data: {
              productionDeviceId: '', //表单Id
              id: '',
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              materialName: [
                {
                  required: true,
                  message: '物料不能为空',
                  trigger: ['blur', 'change'],
                },
              ],
            },
            component: [
              {
                classKey: 'materialName',
                label: '任务单',
                tag: 'id-input-popup',
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getProcessList,
                isTree: false,
                isPage: false,
                id: '',
                number: '',
                name: '',
                tableColumns: [
                  {
                    tag: 'el-table-column',
                    label: '任务单编号',
                    prop: 'taskNo',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                  {
                    tag: 'el-table-column',
                    label: '物料代码',
                    prop: 'materialNo',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                  {
                    tag: 'el-table-column',
                    label: '物料名称',
                    prop: 'materialName',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                  {
                    tag: 'el-table-column',
                    label: '工序代码',
                    prop: 'processNo',
                    minWidth: 180,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                  {
                    tag: 'el-table-column',
                    label: '工序名称',
                    prop: 'processName',
                    minWidth: 180,
                    resizable: false,
                    showOverflowTooltip: true,
                    comp: 'String',
                  },
                ],
                diaTitle: '任务单',
                event: {},
              },
            ],
          },
          add: addList,
          update: updateList,
          delete: delList,
        },
      ],
    };
  },
  created() {
    let that = this;
    this.tableDetailForm.idForm.component[0].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[0].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.deviceId = row.id;
      that.tableDetailForm.idForm.data.deviceNo = row.number;
      that.tableDetailForm.idForm.data.deviceName = row.name;
      that.tableDetailForm.idForm.component[0].id = row.id;
      that.tableDetailForm.idForm.component[0].number = row.number;
      that.tableDetailForm.idForm.component[0].name = row.name;
    };
    this.tableDetailForm.idForm.component[2].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[2].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.teamId = row.id;
      that.tableDetailForm.idForm.data.teamNo = row.number;
      that.tableDetailForm.idForm.data.teamName = row.name;
      that.tableDetailForm.idForm.component[2].id = row.id;
      that.tableDetailForm.idForm.component[2].number = row.number;
      that.tableDetailForm.idForm.component[2].name = row.name;
    };
    this.tableDetailForm.idForm.component[3].event.beforeGetTableList = function (
      filterData
    ) {
      filterData.auditStatus = 1;
      filterData.isDisable = false;
    };
    this.tableDetailForm.idForm.component[3].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['在职', '试用', '实习', '退休', '离职', '离休'];
      tableData.forEach((dItem) => {
        dItem.type = options[dItem.type];
      });
    };
    this.tableDetailForm.idForm.component[3].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.personId = row.id;
      that.tableDetailForm.idForm.data.personNo = row.number;
      that.tableDetailForm.idForm.data.personName = row.name;
      that.tableDetailForm.idForm.component[3].id = row.id;
      that.tableDetailForm.idForm.component[3].number = row.number;
      that.tableDetailForm.idForm.component[3].name = row.name;
    };

    this.formList[0].form.component[0].event.confirm = function (row) {
      that.formList[0].form.data = {
        ...that.formList[0].form.data,
        ...row,
        status: 0,
      };
      // that.formList[0].form.component[0].id = row.id;
      // that.formList[0].form.component[0].number = row.number;
      that.formList[0].form.component[0].name = row.taskNo;
    };
  },
  methods: {
    //表体 完工\审核  数量
    //弹窗打开
    formShow(ref, row) {
      if (ref === '完工') {
        this.numForm.tableErrTip = '完工';
        this.numFormShow(row);
      } else {
        this.numForm.tableErrTip = '审核';
        this.$confirm('审核时是否需要调整加工数量, 是否继续?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        })
          .then(() => {
            this.numFormShow(row);
          })
          .catch((action) => {
            if (action === 'cancel') {
              bodyAudit({ num: 0, ...row })
                .then((response) => {
                  response = response.data;
                  if (response.code === 200) {
                    this.$message.success(`${ref}成功`);
                    this.formClose(ref);
                    this.$refs['page'].handleQueryData();
                    this.$refs['page'].editTableForm(
                      this.tableDetailForm.idForm.data
                    );
                  } else {
                    this.$notifyError(`${ref}失败`, response.msg);
                  }
                })
                .catch((response) => {
                  this.$notifyError(`${ref}失败`, '异常信息：' + response);
                });
            }
          });
      }
    },
    //抽一个函数
    numFormShow(row) {
      this.numForm.form.data = {
        id: row.id,
        num: 0, //加工数量
        orgId: this.$store.state.user.userInfo.orgId,
        ...row,
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
    // 弹窗确认
    async formConfirm(ref) {
      this.$refs[ref].$refs['idForm'].validate(async (valid) => {
        if (valid) {
          let request = null;
          if (ref === '完工') {
            request = finishWork;
          } else {
            request = bodyAudit;
          }
          await request(this.numForm.form.data)
            .then((response) => {
              response = response.data;
              if (response.code === 200) {
                this.$message.success(`${ref}成功`);
                this.formClose(ref);
                this.$refs['page'].handleQueryData();
                this.$refs['page'].editTableForm(
                  this.tableDetailForm.idForm.data
                );
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
    //table 列合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 4 ||
        columnIndex === 5 ||
        columnIndex === 6 ||
        columnIndex === 7 ||
        columnIndex === 8
      ) {
        if (row['dIndex'] === 0) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        } else if (row['dIndex'] === -1) {
          return {
            rowspan: 1,
            colspan: 1,
          };
        } else {
          return {
            rowspan: row['dIndex'] + 1,
            colspan: 1,
          };
        }
      }
    },
    //表单列表自定义操作
    async listRowAction(target, row) {
      await startWork(row)
        .then((response) => {
          response = response.data;
          if (response.code === 200) {
            this.$message.success(`${target}成功`);
            this.$refs['page'].handleQueryData();
            this.$refs['page'].editTableForm(this.tableDetailForm.idForm.data);
          } else {
            this.$notifyError(`${target}失败`, response.msg);
          }
        })
        .catch((response) => {
          this.$notifyError(`${target}失败`, '异常信息：' + response);
        });
    },
    //自身api
    afterGetTablePage(tableData) {
      tableData.forEach((tItem, tIndex) => {
        tItem.auditStatus = tItem.auditStatus ? '已审核' : '未审核';
        //处理列合并
        const index = tableData.findIndex((item) => item.id === tItem.id);
        const count = tableData.reduce((sum, curr) => {
          return sum + (curr.id === tItem.id ? 1 : 0);
        }, 0);
        if (count === 1) {
          tItem.dIndex = -1;
        } else {
          if (index === tIndex) {
            tItem.dIndex = count - 1;
          } else {
            tItem.dIndex = 0;
          }
        }
      });
    },
    initTableDetail(data) {
      if (data) {
        this.tableDetailForm.idForm.data = data;
        this.tableDetailForm.idForm.data.orgId = this.$store.state.user.userInfo.orgId; //组织
        this.tableDetailForm.idForm.data.auditStatus = String(
          this.tableDetailForm.idForm.data.auditStatus
        );
      } else {
        this.tableDetailForm.idForm.data = {
          id: '',
          orgId: this.$store.state.user.userInfo.orgId, //组织
          deviceId: 0, //设备内码
          deviceNo: '', //设备代码
          deviceName: '', //设备名称
          processTime: '', //加工日期
          teamId: 0, //班次内码
          teamNo: '', //班次代码
          teamName: '', //班次名称
          personId: 0, //人员内码
          personNo: '', //人员代码
          personName: '', //人员名称
          //审核相关
          createTime: '', //创建时间
          docMakerId: 0, //创建人id
          docMakerNo: '', //制单人代码
          docMakerName: '', //制单人姓名
          updateTime: '', //最后更新时间
          auditStatus: '0', //审核状态
          auditPersonId: 0, //审核人id
          auditPersonNo: '', //审核人代码
          auditPersonName: '', //审核人姓名
          auditTime: '', //审核时间
        };
      }
      //统一处理弹窗字段
      this.tableDetailForm.idForm.component[0].id = this.tableDetailForm.idForm.data.archiveId;
      this.tableDetailForm.idForm.component[0].number = this.tableDetailForm.idForm.data.deviceNo;
      this.tableDetailForm.idForm.component[0].name = this.tableDetailForm.idForm.data.deviceName;
      this.tableDetailForm.idForm.component[2].id = this.tableDetailForm.idForm.data.teamId;
      this.tableDetailForm.idForm.component[2].number = this.tableDetailForm.idForm.data.teamNo;
      this.tableDetailForm.idForm.component[2].name = this.tableDetailForm.idForm.data.teamName;
      this.tableDetailForm.idForm.component[3].id = this.tableDetailForm.idForm.data.personId;
      this.tableDetailForm.idForm.component[3].number = this.tableDetailForm.idForm.data.personNo;
      this.tableDetailForm.idForm.component[3].name = this.tableDetailForm.idForm.data.personName;
      this.tableDetailForm.idForm.component[5].id = this.tableDetailForm.idForm.data.docMakerId;
      this.tableDetailForm.idForm.component[5].number = this.tableDetailForm.idForm.data.docMakerNo;
      this.tableDetailForm.idForm.component[5].name = this.tableDetailForm.idForm.data.docMakerName;
      this.tableDetailForm.idForm.component[8].id = this.tableDetailForm.idForm.data.auditPersonId;
      this.tableDetailForm.idForm.component[8].number = this.tableDetailForm.idForm.data.auditPersonNo;
      this.tableDetailForm.idForm.component[8].name = this.tableDetailForm.idForm.data.auditPersonName;
      //统一处理表单工具条展示问题
      if (this.tableDetailForm.idForm.data.id) {
        this.actionBarFormConfig = [
          new IdButtonConfig('button-add', '提交', 'form-commit', {
            type: 'primary',
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
                idDisable: this.tableDetailForm.idForm.data.auditStatus === '1',
              },
              {
                text: '反审核',
                target: 'form-antiAudit',
                idLoad: false,
                idIf: true,
                idShow: true,
                idDisable: this.tableDetailForm.idForm.data.auditStatus === '0',
              },
            ],
          },
          new IdButtonConfig('button-delete', '删除', 'form-delete', {
            styleOne: true,
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
      //统一处理获取数据时的组件状态（根据审核\禁用状态）
      if (this.tableDetailForm.idForm.data.auditStatus === '0') {
        this.tableDetailForm.idForm.component.forEach(
          (cItem) => (cItem.idDisable = !!cItem.freeze)
        );
      } else {
        this.tableDetailForm.idForm.component.forEach(
          (cItem) => (cItem.idDisable = true)
        );
      }
      // //处理审核后的表体操作栏问题
      // this.formList.forEach((fItem)=>{
      //   fItem.actionBarConfig.forEach((aItem) => {
      //     aItem.idDisable = this.tableDetailForm.idForm.data.auditStatus === '1'
      //   });
      // });
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
      const statuses = ['新建', '开工', '完工', '审核', '已质检'];
      data.forEach((dItem) => {
        dItem.deleteable = dItem.status !== 0;
        dItem.statusName = statuses[dItem.status];
      });
    },
    initListDetail(index, row, callBack) {
      if (row) {
        this.formList[0].form.data = { ...row };
        this.formList[0].form.data.productionDeviceId = this.tableDetailForm.idForm.data.id;
        callBack(index, false);
      } else {
        this.formList[0].form.data = {
          productionDeviceId: this.tableDetailForm.idForm.data.id, //表单Id
          id: '',
          orgId: this.$store.state.user.userInfo.orgId,
        };
      }
      //处理数据点弹窗数据问题
      // this.formList[0].form.component[0].id = this.formList[0].form.data.materialId;
      // this.formList[0].form.component[0].number = this.formList[0].form.data.materialNumber;
      this.formList[0].form.component[0].name = '';
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
