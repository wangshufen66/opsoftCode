<template>
  <id-tree-table-form-list-Cloudbox tableErrTip="C8303清单" :isTree="false" :getTable="getTable" :getTableDetail="getTableDetail" :getInfoPointData="getInfoPointData" :deleteTableDetails="deleteTableDetails" :addTableDetail="addTableDetail" :updateTableDetail="updateTableDetail" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" :actionBarFormConfig="actionBarFormConfig" :tableDetailForm="tableDetailForm" @initTableDetail="initTableDetail" @beforeLeave="beforeLeave" :formList="formList" @initListDetail="initListDetail">
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
  audit,
  antiAudit,
  disable,
  antiDisable,
  addList,
  updateList,
  batchDelList,
} from '@/api/deviceMaintenance/partManagement';

import {
  findMoList,
  findMoDetail,
  addMo,
  updateMo,
  deleteMo,
} from '@/api/iot-hub/x8303boxList';

import {
  addOne,
  updateOne,
  deleteOne,
  deleteOneMore,
} from '@/api/iot-hub/x8303boxPointConfig';

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
import box8303BrandTableColumns from './../tableColumns/box8303BrandTableColumns';
import { getMaterialSparePart } from '@/api/factoryModel/material';
import { findMoList as get8303boxBrandList } from '@/api/iot-hub/x8303boxBrand';
import { getInfoPoint } from '@/api/iot-hub/x8302boxPointConfig';
import materialInputPopupColumns from './../tableColumns/infoPointTableColumns';

import { deviceInputPopupColumns } from './../tableColumns/deviceTableColumns';
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
      return findMoList;
    },
    getTableDetail() {
      return findMoDetail;
    },
    deleteTableDetails() {
      return deleteMo;
    },
    addTableDetail() {
      return addMo;
    },
    updateTableDetail() {
      return updateMo;
    },
    getInfoPointData() {
      return getInfoPoint;
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
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '备注信息',
          prop: 'mark',
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
          label: '修改时间',
          prop: 'updateTime',
          minWidth: 180,
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
            boxId: '',
            id: '',
            name: '',
            number: '', //云盒代码
            box8303BrandId: 0, //云盒品牌ID
            box8303BrandName: '', //云盒品牌
            box8303Model: '', //云盒型号
            connectionId: 0, //连接通道ID
            connectionCompleteNumber: '', //连接通道number
            connectionCompleteName: '', //连接通道name
            stationAddress: 0, //站地址
            mark: '',
            style: '',
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
                message: '品牌名称不能为空',
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
            stationAddress: [
              {
                required: true,
                message: '站地址不能为空',
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
              placeholder: '请输入',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            // {
            //   classKey: 'stationAddress',
            //   label: '站地址',
            //   tag: 'el-input-number',
            //   placeholder: '请输入',
            //   controlsPosition: 'right',
            //   min: 0,
            //   max: 999999,
            //   step: 1,
            //   idLoad: false,
            //   idIf: true,
            //   idDisable: false,
            //   idShow: true,
            // },
            {
              classKey: 'createTime',
              label: '创建时间',
              tag: 'el-date-picker',
              type: 'datetime',
              placeholder: '请选择',
              clearable: true,
              idLoad: false,
              idIf: true,
              idDisable: true,
              idShow: true,
              freeze: true, //修改的时候变成灰色
            },
            //需要写进一个地方  方便调用

            {
              classKey: 'updateTime',
              label: '修改时间',
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
          fromList: 'pointList',
          tableErrTip: '数据点',
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
              prop: 'number',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '数据点名称',
              prop: 'name',
              minWidth: 180,
              showOverflowTooltip: true,
            },
            {
              tag: 'el-table-column',
              label: '显示样式',
              prop: 'style',
              minWidth: 180,
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
              name: '', //信息点名称
              number: '', //代码
              style: '', //显示样式
              unitName: '', //显示单位
              mark: '', //备注信息
              box8303Id: '', //表头ID
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {},
            // 标体弹出对话框字段设置
            component: [
              {
                classKey: 'number',
                label: '代码',
                tag: 'id-input-popup',
                controlTooltipShow: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getInfoPoint,
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
                classKey: 'name',
                label: '信息点名称',
                tag: 'el-input',
                step: 1,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: 'unitName',
                label: '显示单位',
                tag: 'el-input',
                freeze: true,
                idLoad: false,
                idIf: true,
                idDisable: true,
                idShow: true,
              },
              {
                classKey: 'style',
                label: '显示样式',
                tag: 'id-select',
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                width: '250',
                options: [
                  {
                    label: '默认',
                    value: 1,
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '电表',
                    value: 2,
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '水表',
                    value: 3,
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '气表 ',

                    value: 4,
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '温度',
                    value: 5,
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '湿度',
                    value: 6,
                    authority: {
                      idLoad: false,
                      idIf: true,
                      idDisable: false,
                      idShow: true,
                    },
                  },
                  {
                    label: '燃气',
                    value: 7,
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
                classKey: 'mark',
                label: '备注',
                tag: 'el-input',
                placeholder: '请输入',
                type: 'textarea',

                maxlength: 250,
                showWordLimit: true,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            ],
          },
          add: addOne,
          update: updateOne,
          delete: deleteOne,
        },
      ],
    };
  },
  created() {
    console.log(this.$store.state.user.userInfo.orgId);
    console.log(this.tableDetailForm.idForm.data.box8303BrandName);

    let that = this;
    // console.log(this.formList[0].form.component);
    this.formList[0].form.component[0].event.confirm = function (row) {
      console.log(row);

      that.formList[0].form.component[0].id = row.id;
      that.formList[0].form.component[0].number = row.number;
      that.formList[0].form.component[0].name = row.name;

      that.formList[0].form.data.number = row.number;
      that.formList[0].form.data.name = row.name;
      that.formList[0].form.data.unitName = row.unitName;
      that.formList[0].form.data.mark = row.mark;

      console.log(that.formList);
    };

    this.tableDetailForm.idForm.component[1].event.confirm = function (row) {
      that.tableDetailForm.idForm.data.box8303BrandId = row.id;
      that.tableDetailForm.idForm.data.box8303Model = row.number;
      that.tableDetailForm.idForm.data.box8303BrandName = row.name;
      that.tableDetailForm.idForm.component[1].id = row.id;
      that.tableDetailForm.idForm.component[1].number = row.number;
      that.tableDetailForm.idForm.component[1].name = row.name;
    };
  },
  methods: {
    initTableDetail(data) {
      console.log(data);
      if (data) {
        this.tableDetailForm.idForm.data = data;
        data.orgId = this.$store.state.user.userInfo.orgId;
        this.tableDetailForm.idForm.component[0] = {
          classKey: 'number',
          label: '云盒代码',
          tag: 'el-input',
          min: 0,
          max: 999999,
          placeholder: '请输入',
          clearable: true,
          idLoad: false,
          idIf: true,
          idDisable: false,
          idShow: true,
        };

        this.tableDetailForm.idForm.component[1].id =
          this.tableDetailForm.idForm.data.box8303BrandId;
        this.tableDetailForm.idForm.component[1].name =
          this.tableDetailForm.idForm.data.box8303BrandName;
        this.tableDetailForm.idForm.component[1].number =
          this.tableDetailForm.idForm.data.box8303BrandName;

        this.tableDetailForm.idForm.component[2].id =
          this.tableDetailForm.idForm.data.connectionId;
        this.tableDetailForm.idForm.component[2].number =
          this.tableDetailForm.idForm.data.connectionCompleteNumber;
        this.tableDetailForm.idForm.component[2].name =
          this.tableDetailForm.idForm.data.connectionCompleteName;
      } else {
        this.tableDetailForm.idForm.component[0] = {
          classKey: 'number',
          label: '云盒代码',
          tag: 'el-input-number',
          placeholder: '请输入',
          min: 0,
          max: 999999,
          clearable: true,
          idLoad: false,
          idIf: true,
          idDisable: false,
          idShow: true,
        };

        this.tableDetailForm.idForm.data = {
          boxId: '',
          id: '',
          number: '', //云盒代码
          box8303BrandId: 0, //云盒品牌ID
          box8303BrandName: '', //云盒品牌
          box8303Model: '', //云盒型号
          // connectionId: 0, //连接通道ID
          // connectionCompleteNumber: '', //连接通道number
          // connectionCompleteName: '', //连接通道name
          stationAddress: 0, //站地址
          mark: '',
          orgId: this.$store.state.user.userInfo.orgId,
        };

        this.tableDetailForm.idForm.component[1].id =
          this.tableDetailForm.idForm.data.box8303BrandId;
        this.tableDetailForm.idForm.component[1].number =
          this.tableDetailForm.idForm.data.box8303Model;
        this.tableDetailForm.idForm.component[1].name =
          this.tableDetailForm.idForm.data.box8303BrandName;

        // this.tableDetailForm.idForm.component[2].id =
        //   this.tableDetailForm.idForm.data.connectionId;
        // this.tableDetailForm.idForm.component[2].number =
        //   this.tableDetailForm.idForm.data.connectionCompleteNumber;
        // this.tableDetailForm.idForm.component[2].name =
        //   this.tableDetailForm.idForm.data.connectionCompleteName;
      }
      //统一处理字段的可编辑
      this.handleCompDisable('0', '0');
      //处理产品弹窗遗留问题
      // this.handleInputPopup(
      //   'recipientPersonName',
      //   this.tableDetailForm.idForm.data.recipientPersonId,
      //   this.tableDetailForm.idForm.data.recipientPersonNumber,
      //   this.tableDetailForm.idForm.data.recipientPersonName
      // );
      // this.handleInputPopup(
      //   'number',
      //   null,
      //   null,
      //   this.tableDetailForm.idForm.data.number
      // );
      //统一处理弹窗遗留问题
      // this.handleInputPopup(
      //   'docMakerName',
      //   this.tableDetailForm.idForm.data.docMakerId,
      //   this.tableDetailForm.idForm.data.docMakerNumber,
      //   this.tableDetailForm.idForm.data.docMakerName
      // );
      // this.handleInputPopup(
      //   'auditPersonName',
      //   this.tableDetailForm.idForm.data.auditPersonId,
      //   this.tableDetailForm.idForm.data.auditPersonNumber,
      //   this.tableDetailForm.idForm.data.auditPersonName
      // );
      // this.handleInputPopup(
      //   'disablePersonName',
      //   this.tableDetailForm.idForm.data.disablePersonId,
      //   this.tableDetailForm.idForm.data.disablePersonNumber,
      //   this.tableDetailForm.idForm.data.disablePersonName
      // );
    },
    initListDetail(index, row, callBack) {
      if (row) {
        this.formList[index].form.data = row;
        // this.formList[index].form.data.mark = row.mark;
        // console.log(this.formList[index].form.data.mark);
        callBack(index, true);
      } else {
        this.formList[index].form.data = {
          name: '', //信息点名称
          number: '', //代码
          style: '', //显示样式
          unitName: '', //unitName
          mark: '', //备注信息
          box8303Id: this.tableDetailForm.idForm.data.id,
          orgId: this.$store.state.user.userInfo.orgId,
        };
        this.formList[index].form.component[0].id = '';
        this.formList[index].form.component[0].number = '';
        this.formList[index].form.component[0].name = '';
      }
      //统一处理弹窗遗留问题
      if (row) {
        this.formList[index].form.component[0].id = row.id;
        this.formList[index].form.component[0].number = row.number;
        this.formList[index].form.component[0].name = row.name;
      }
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
