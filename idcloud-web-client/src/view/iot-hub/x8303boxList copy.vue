<template>
  <id-tree-table-form-list-Cloudbox tableErrTip="C8303清单" :isTree="false" :getTable="getTable" :getTableDetail="getTableDetail" :deleteTableDetails="deleteTableDetails" :addTableDetail="addTableDetail" :updateTableDetail="updateTableDetail" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" @afterGetTablePage="afterGetTablePage" :actionBarFormConfig="actionBarFormConfig" :tableDetailForm="tableDetailForm" @initTableDetail="initTableDetail" @beforeLeave="beforeLeave" :formList="formList" @initListDetail="initListDetail">
  </id-tree-table-form-list-Cloudbox>
</template>

<script>
import IdTreeTableFormListCloudbox from '@/components/id-pages/IdTreeTableFormListCloudbox';
import IdButtonConfig from '@/components/id-button/IdButtonConfig';
import {
  getList,
  getDetail,
  add,
  batchDel,
  update,
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
import { findMoList as get8303boxBrandList } from '@/api/iot-hub/x8303boxBrand';
import { getMaterialSparePart } from '@/api/factoryModel/material';
//
import connectionManagementTableColumns from '../tableColumns/connectionManagementTableColumns';
import { materialInputPopupColumns } from '../tableColumns/materialTableColumns';
import { deviceInputPopupColumns } from '../tableColumns/deviceTableColumns';
import {
  getList as getDeviceList,
  getGroupList as getDeviceGroupList,
} from '@/api/deviceMaintenance/deviceArchive';

export default {
  name: 'partManagement',
  components: {
    IdTreeTableFormListCloudbox,
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
  mixins: [treeTableFormListADMixins],
  data() {
    return {
      //操作栏相关配置----------------------------
      actionBarConfig: [
        new IdButtonConfig('button-add', '添加', 'add', { type: 'primary' }),
        new IdButtonConfig('button-delete', '删除', 'delete', {
          styleOne: true,
        }),

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
          label: '云盒代码',
          prop: 'number',
          minWidth: 240,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '云盒品牌',
          prop: 'box8303BrandName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },

        {
          tag: 'el-table-column',
          label: '云盒ID',
          prop: 'boxId',
          minWidth: 180,
          // showOverflowTooltip: true,
          comp: 'Number',
        },
        {
          tag: 'el-table-column',
          label: '备注信息',
          prop: 'mark',
          minWidth: 240,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 240,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '修改时间',
          prop: 'updateTime',
          minWidth: 240,
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
            number: '', //云盒代码
            boxId: '', //云盒ID
            box8303BrandId: 0, //云盒品牌ID
            box8303BrandName: '', //马尔品牌
            box8303Model: '', //云盒型号
            connectionId: 0, //连接通道ID
            connectionCompleteNumber: '', //连接通道number
            connectionCompleteName: '', //连接通道name
            stationAddress: 0, //站地址
            mark: '',
            orgId: this.$store.state.user.userInfo.orgId,
            // id: '',
            // orgId: this.$store.state.user.userInfo.orgId, //组织
            // number: '', //方案
            // recipientPersonId: 0, //领用人id
            // recipientPersonNumber: '', //领用人代码
            // recipientPersonName: '', //领用人名称
            // recipientDate: '', //领用时间
            // //需要model化
            // createTime: '', //创建时间
            // docMakerId: 0, //创建人id
            // docMakerNumber: '', //制单人代码
            // docMakerName: '', //制单人姓名
            // auditStatus: '0', //审核状态
            // auditPersonId: 0, //审核人id
            // auditPersonNumber: '', //审核人代码
            // auditPersonName: '', //审核人姓名
            // auditTime: '', //审核时间
            // isDisable: '0', //禁用状态
            // disablePersonId: 0, //禁用人id
            // disablePersonNumber: '', //禁用人代码
            // disablePersonName: '', //禁用人姓名
            // disableTime: '', //禁用时间
            updateTime: '', //最后更新时间
          },
          rules: {
            number: [
              {
                required: true,
                message: '云盒代码不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            box8303BrandName: [
              {
                required: true,
                message: '马尔品牌不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            boxId: [
              {
                required: true,
                message: '云盒ID不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            createTime: [
              {
                required: true,
                message: '创建时间不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            updataTime: [
              {
                required: true,
                message: '修改时间不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            //需要class化
            {
              classKey: 'number',
              label: '云盒代码',
              tag: 'el-input-number',
              placeholder: '请输入',
              controlsPosition: 'right',
              min: 0,
              max: 999999,
              step: 1,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'box8303BrandName',
              label: '云盒品牌',
              tag: 'id-input-popup',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: get8303boxBrandList,
              isTree: false,
              isPage: false,
              id: '',
              number: '',
              name: '',
              controlTooltipShow: true,
              tableColumns: box8303BrandTableColumns,
              diaTitle: '云盒品牌',
              event: {},
            },
            {
              classKey: 'boxId',
              label: '云盒ID',
              tag: 'el-input',
              placeholder: '请输入云盒ID',

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
              label: '数据点代码',
              prop: 'materialNumber',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '数据点名称',
              prop: 'materialName',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '显示样式',
              prop: 'materialSpecifications',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '备注信息',
              prop: 'mark',
              minWidth: 180,
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
    console.log(this.formList.form.component);
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
          // auditStatus: '0', //审核状态
          // auditPersonId: 0, //审核人id
          // auditPersonNumber: '', //审核人代码
          // auditPersonName: '', //审核人姓名
          // auditTime: '', //审核时间
          // isDisable: '0', //禁用状态
          // disablePersonId: 0, //禁用人id
          // disablePersonNumber: '', //禁用人代码
          // disablePersonName: '', //禁用人姓名
          // disableTime: '', //禁用时间
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
<template>
  <div>
    <id-bar-query-table-dia-form ref="tableDiaForm" tableErrTip="C8303清单" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" :tableDetailForm="tableDetailForm" form-label-width="100px" id-query-form-label-width="90px" :getTable="getTable" :getDetail="getDetail" :addDetail="addDetail" :updateDetail="updateDetail" :deleteTable="deleteTable" @actionBarClick="actionBarClick" @editTableDetail="editTableDetail" @initTableDetail="initTableDetail">
    </id-bar-query-table-dia-form>

    <!-- <el-dialog :visible.sync="diaForm.show" @closed="diaCloseFunc(diaForm.ref)">
      <id-form :ref="diaForm.ref" class="more-query-form" :id-form="diaForm.form" v-bind="diaForm" :label-width="diaForm.labelWidth"></id-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">C8303清单</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="diaCloseFunc(diaForm.ref)">取消</el-button>
        <el-button type="primary" @click="diaSaveFunc(diaForm.ref)">确认</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import IdButtonConfig from '@/components/id-button/IdButtonConfig';
import IdBarQueryTableDiaForm from '@/components/id-pages/IdBarQueryTableDiaForm';
import {
  findMoList as getList,
  findMoDetail as getDetail,
  addMo as add,
  deleteMo as batchDel,
  updateMo as update,
  addX8303boxBatch,
} from '@/api/iot-hub/x8303boxList';
import box8303BrandTableColumns from '../tableColumns/box8303BrandTableColumns';
import { findMoList as get8303boxBrandList } from '@/api/iot-hub/x8303boxBrand';
import connectionManagementTableColumns from '../tableColumns/connectionManagementTableColumns';
import { getList as getConnectionManagementList } from '@/api/iot-hub/connectionManagement';
import IdForm from '@/components/id-form/index';

export default {
  name: 'x8303boxList',
  components: {
    IdBarQueryTableDiaForm,
    IdForm,
  },
  computed: {
    getTable() {
      return getList;
    },
    getDetail() {
      return getDetail;
    },
    updateDetail() {
      return update;
    },
    addDetail() {
      return add;
    },
    deleteTable() {
      return batchDel;
    },
  },
  data() {
    return {
      //操作栏
      actionBarConfig: [
        new IdButtonConfig('button-add', '添加', 'add', { type: 'primary' }),
        new IdButtonConfig('button-add', '批量添加', 'moreAdd', {
          type: 'primary',
        }),
        new IdButtonConfig('button-delete', '删除', 'delete', {
          styleOne: true,
        }),
        new IdButtonConfig('button-fresh', '刷新', 'fresh', {
          styleTwo: true,
          beforeIf: true,
          beforeClass: 'el-icon-refresh-right',
        }),
      ],
      //列
      tableColumns: [
        {
          tag: 'el-table-column',
          label: '云盒代码',
          prop: 'number',
          minWidth: 240,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '云盒品牌',
          prop: 'box8303BrandName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },

        {
          tag: 'el-table-column',
          label: '云盒ID',
          prop: 'boxId',
          minWidth: 180,
          // showOverflowTooltip: true,
          comp: 'Number',
        },
        {
          tag: 'el-table-column',
          label: '备注信息',
          prop: 'mark',
          minWidth: 240,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 240,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '修改时间',
          prop: 'updateTime',
          minWidth: 240,
          resizable: false,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
      ],
      //弹窗内form
      tableDetailForm: {
        data: {
          id: '',
          number: '', //云盒代码
          boxId: '', //云盒ID
          box8303BrandId: 0, //云盒品牌ID
          box8303BrandName: '', //马尔品牌
          box8303Model: '', //云盒型号
          connectionId: 0, //连接通道ID
          connectionCompleteNumber: '', //连接通道number
          connectionCompleteName: '', //连接通道name
          stationAddress: 0, //站地址
          mark: '',
          orgId: this.$store.state.user.userInfo.orgId,
        },
        rules: {
          number: [
            {
              required: true,
              message: '云盒代码不能为空',
              trigger: ['blur', 'change'],
            },
          ],
          box8303BrandName: [
            {
              required: true,
              message: '马尔品牌不能为空',
              trigger: ['blur', 'change'],
            },
          ],
          boxId: [
            {
              required: true,
              message: '云盒ID不能为空',
              trigger: ['blur', 'change'],
            },
          ],
          connectionCompleteName: [
            {
              required: true,
              message: '连接通道不能为空',
              trigger: ['blur', 'change'],
            },
          ],
          stationAddress: [
            {
              required: true,
              message: '站地址不能为空',
              trigger: ['blur', 'change'],
            },
          ],
        },
        component: [
          {
            classKey: 'number',
            label: '云盒代码',
            tag: 'el-input-number',
            placeholder: '请输入',
            controlsPosition: 'right',
            min: 0,
            max: 999999,
            step: 1,
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
          },
          {
            classKey: 'box8303BrandName',
            label: '云盒品牌',
            tag: 'id-input-popup',
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
            getTableList: get8303boxBrandList,
            isTree: false,
            isPage: false,
            id: '',
            number: '',
            name: '',
            controlTooltipShow: true,
            tableColumns: box8303BrandTableColumns,
            diaTitle: '云盒品牌',
            event: {},
          },
          {
            classKey: 'boxId',
            label: '云盒ID',
            tag: 'el-input',
            placeholder: '请输入云盒ID',

            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
          },
          {
            classKey: 'connectionCompleteName',
            label: '连接通道',
            tag: 'id-input-popup',
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
            getTableList: getConnectionManagementList,
            isTree: false,
            isPage: false,
            id: '',
            number: '',
            name: '',
            controlTooltipShow: true,
            tableColumns: connectionManagementTableColumns,
            diaTitle: '连接通道',
            event: {},
          },
          {
            classKey: 'stationAddress',
            label: '站地址',
            tag: 'el-input-number',
            placeholder: '请输入',
            controlsPosition: 'right',
            min: 0,
            max: 999999,
            step: 1,
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
      //拓展弹窗
      diaForm: {
        show: false,
        ref: 'moreForm',
        size: 'default',
        labelWidth: '100px',
        form: {
          data: {
            id: '',
            box8303BrandId: 0, //云盒品牌ID
            boxId: '', //云盒ID
            box8303BrandName: '', //马尔品牌
            box8303Model: '', //云盒型号
            connectionId: 0, //连接通道ID
            connectionCompleteNumber: '', //连接通道number
            connectionCompleteName: '', //连接通道name
            number: 1, //起始号
            num: 1, //数量
            stationAddress: 0, //站地址
            mark: '',
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            number: [
              {
                required: true,
                message: '起始号不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            box8303BrandName: [
              {
                required: true,
                message: '马尔品牌不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            boxId: [
              {
                required: true,
                message: '云盒ID不能为空',
                trigger: ['blur', 'change'],
              },
            ],
            connectionCompleteName: [
              {
                required: true,
                message: '连接通道不能为空',
                trigger: ['blur', 'change'],
              },
            ],
          },
          component: [
            {
              classKey: 'box8303BrandName',
              label: '云盒品牌',
              tag: 'id-input-popup',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: get8303boxBrandList,
              isTree: false,
              isPage: false,
              id: '',
              number: '',
              name: '',
              controlTooltipShow: true,
              tableColumns: box8303BrandTableColumns,
              diaTitle: '云盒品牌',
              event: {},
            },
            {
              classKey: 'connectionCompleteName',
              label: '连接通道',
              tag: 'id-input-popup',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getConnectionManagementList,
              isTree: false,
              isPage: false,
              id: '',
              number: '',
              name: '',
              controlTooltipShow: true,
              tableColumns: connectionManagementTableColumns,
              diaTitle: '连接通道',
              event: {},
            },
            {
              classKey: 'number',
              label: '云盒代码',
              tag: 'el-input-number',
              placeholder: '请输入',
              controlsPosition: 'right',
              min: 1,
              max: 999999,
              step: 1,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'num',
              label: '数量',
              tag: 'el-input-number',
              placeholder: '请输入',
              controlsPosition: 'right',
              min: 1,
              max: 999999,
              step: 1,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'stationAddress',
              label: '站地址',
              tag: 'el-input-number',
              placeholder: '请输入',
              controlsPosition: 'right',
              min: 0,
              max: 999999,
              step: 1,
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
    console.log(this.tableDetailForm.component);
    let that = this;
    this.tableDetailForm.component[1].event.confirm = function (row) {
      that.tableDetailForm.data.box8303BrandId = row.id;
      that.tableDetailForm.data.box8303Model = row.number;
      that.tableDetailForm.data.box8303BrandName = row.name;
      that.tableDetailForm.component[1].id = row.id;
      that.tableDetailForm.component[1].number = row.number;
      that.tableDetailForm.component[1].name = row.name;
    };
    this.tableDetailForm.component[3].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['mysql', 'oracle', 'sqlserver'];
      tableData.forEach((dItem) => {
        dItem.databaseType = options[dItem.databaseType];
      });
    };
    this.tableDetailForm.component[3].event.confirm = function (row) {
      that.tableDetailForm.data.connectionId = row.id;
      that.tableDetailForm.data.connectionCompleteNumber = row.number;
      that.tableDetailForm.data.connectionCompleteName = row.name;
      that.tableDetailForm.component[3].id = row.id;
      that.tableDetailForm.component[3].number = row.number;
      that.tableDetailForm.component[3].name = row.name;
    };

    this.diaForm.form.component[0].event.confirm = function (row) {
      that.diaForm.form.data.box8303BrandId = row.id;
      that.diaForm.form.data.box8303Model = row.number;
      that.diaForm.form.data.box8303BrandName = row.name;
      that.diaForm.form.component[0].id = row.id;
      that.diaForm.form.component[0].number = row.number;
      that.diaForm.form.component[0].name = row.name;
    };
    this.diaForm.form.component[1].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['mysql', 'oracle', 'sqlserver'];
      tableData.forEach((dItem) => {
        dItem.databaseType = options[dItem.databaseType];
      });
    };
    this.diaForm.form.component[1].event.confirm = function (row) {
      that.diaForm.form.data.connectionId = row.id;
      that.diaForm.form.data.connectionCompleteNumber = row.number;
      that.diaForm.form.data.connectionCompleteName = row.name;
      that.diaForm.form.component[1].id = row.id;
      that.diaForm.form.component[1].number = row.number;

      that.diaForm.form.component[1].name = row.name;
    };
  },
  methods: {
    //新增弹窗
    actionBarClick() {
      this.diaForm.show = true;
    },
    // 关闭弹窗窗口
    diaCloseFunc(ref) {
      this.diaForm.show = false;
      this.$nextTick(() => {
        this.diaForm.form.data = {
          id: '',
          box8303BrandId: 0, //云盒品牌ID
          box8303BrandName: '', //马尔品牌
          box8303Model: '', //云盒型号
          connectionId: 0, //连接通道ID
          connectionCompleteNumber: '', //连接通道number
          connectionCompleteName: '', //连接通道name
          number: 1, //起始号
          num: 1, //数量
          stationAddress: 0, //站地址
          mark: '',
          orgId: this.$store.state.user.userInfo.orgId,
        };
        this.diaForm.form.component[0].id =
          this.diaForm.form.data.box8303BrandId;
        this.diaForm.form.component[0].number =
          this.diaForm.form.data.box8303Model;
        this.diaForm.form.component[0].name =
          this.diaForm.form.data.box8303BrandName;
        this.diaForm.form.component[0].controlTooltipShow = false;
        this.diaForm.form.component[1].id = this.diaForm.form.data.connectionId;
        this.diaForm.form.component[1].number =
          this.diaForm.form.data.connectionCompleteNumber;
        this.diaForm.form.component[1].name =
          this.diaForm.form.data.connectionCompleteName;
        this.diaForm.form.component[1].controlTooltipShow = false;
        this.$nextTick(() => {
          this.diaForm.form.component[0].controlTooltipShow = true;
          this.diaForm.form.component[1].controlTooltipShow = true;
        });
        this.$refs[ref].$refs['idForm'].resetFields();
      });
    },
    // 数据校验=》保存或者更新数据
    async diaSaveFunc(ref) {
      this.$refs[ref].$refs['idForm'].validate(async (valid) => {
        if (valid) {
          await addX8303boxBatch(this.diaForm.form.data).then((res) => {
            if (res.data.code === 200 && res.status === 200) {
              this.$message.success('提交成功!');
              this.diaCloseFunc(ref);
              this.$refs['tableDiaForm'].handleQueryData();
            } else {
              this.$notifyError('提交失败!', res.data.msg);
            }
          });
        } else {
          this.$message.error('*为必填项');
        }
      });
    },
    // 普通接口
    editTableDetail(data) {
      this.tableDetailForm.component[0] = {
        classKey: 'number',
        label: '云盒代码',
        tag: 'el-input',
        placeholder: '请输入',
        clearable: true,
        idLoad: false,
        idIf: true,
        idDisable: false,
        idShow: true,
      };

      this.tableDetailForm.data = { ...data.records[0] };
      this.tableDetailForm.data.orgId = this.$store.state.user.userInfo.orgId;
      this.tableDetailForm.component[1].id =
        this.tableDetailForm.data.box8303BrandId;
      this.tableDetailForm.component[1].number =
        this.tableDetailForm.data.box8303Model;
      this.tableDetailForm.component[1].name =
        this.tableDetailForm.data.box8303BrandName;
      this.tableDetailForm.component[3].id =
        this.tableDetailForm.data.connectionId;
      this.tableDetailForm.component[3].number =
        this.tableDetailForm.data.connectionCompleteNumber;
      this.tableDetailForm.component[3].name =
        this.tableDetailForm.data.connectionCompleteName;
    },
    initTableDetail() {
      this.tableDetailForm.component[0] = {
        classKey: 'number',
        label: '信息点代码',
        tag: 'el-input-number',
        placeholder: '请输入',
        controlsPosition: 'right',
        min: 0,
        max: 999999,
        step: 1,
        idLoad: false,
        idIf: true,
        idDisable: false,
        idShow: true,
      };

      this.tableDetailForm.data = {
        id: '',
        number: '', //云盒代码
        box8303BrandId: 0, //云盒品牌ID
        box8303BrandName: '', //马尔品牌
        box8303Model: '', //云盒型号
        connectionId: 0, //连接通道ID
        connectionCompleteNumber: '', //连接通道number
        connectionCompleteName: '', //连接通道name
        stationAddress: 0, //站地址
        mark: '',
        orgId: this.$store.state.user.userInfo.orgId,
      };
      this.tableDetailForm.component[1].id =
        this.tableDetailForm.data.box8303BrandId;
      this.tableDetailForm.component[1].number =
        this.tableDetailForm.data.box8303Model;
      this.tableDetailForm.component[1].name =
        this.tableDetailForm.data.box8303BrandName;
      this.tableDetailForm.component[1].controlTooltipShow = false;
      this.tableDetailForm.component[3].id =
        this.tableDetailForm.data.connectionId;
      this.tableDetailForm.component[3].number =
        this.tableDetailForm.data.connectionCompleteNumber;
      this.tableDetailForm.component[3].name =
        this.tableDetailForm.data.connectionCompleteName;
      this.tableDetailForm.component[3].controlTooltipShow = false;
      this.$nextTick(() => {
        this.tableDetailForm.component[1].controlTooltipShow = true;
        this.tableDetailForm.component[3].controlTooltipShow = true;
      });
    },
  },
};
</script>
<style lang="less" scoped>
//暂时就这样  需要优化的
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
