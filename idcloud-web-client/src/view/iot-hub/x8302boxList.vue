<template>
  <div>
    <id-bar-query-table-dia-form ref="tableDiaForm" tableErrTip="C8302清单" :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" :tableDetailForm="tableDetailForm" form-label-width="100px" id-query-form-label-width="90px" :getTable="getTable" :getDetail="getDetail" :addDetail="addDetail" :updateDetail="updateDetail" :deleteTable="deleteTable" @actionBarClick="actionBarClick" @editTableDetail="editTableDetail" @initTableDetail="initTableDetail">
    </id-bar-query-table-dia-form>

    <el-dialog :visible.sync="diaForm.show" @closed="diaCloseFunc(diaForm.ref)">
      <id-form :ref="diaForm.ref" class="more-query-form" :id-form="diaForm.form" v-bind="diaForm" :label-width="diaForm.labelWidth"></id-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">C8302清单</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="diaCloseFunc(diaForm.ref)">取消</el-button>
        <el-button type="primary" @click="diaSaveFunc(diaForm.ref)">确认</el-button>
      </div>
    </el-dialog>
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
  addX8302boxBatch,
} from '@/api/iot-hub/x8302boxList';
import box8302BrandTableColumns from '../tableColumns/box8302BrandTableColumns';
import { findMoList as get8302boxBrandList } from '@/api/iot-hub/x8302boxBrand';
import connectionManagementTableColumns from '../tableColumns/connectionManagementTableColumns';
import { getList as getConnectionManagementList } from '@/api/iot-hub/connectionManagement';
import IdForm from '@/components/id-form/index';

export default {
  name: 'x8302boxList',
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
          prop: 'box8302BrandName',
          minWidth: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '连接通道',
          prop: 'connectionCompleteName',
          minWidth: 420,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '站地址',
          prop: 'stationAddress',
          minWidth: 180,
          showOverflowTooltip: true,
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
          box8302BrandId: 0, //云盒品牌ID
          box8302BrandName: '', //马尔品牌
          box8302Model: '', //云盒型号
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
          box8302BrandName: [
            {
              required: true,
              message: '马尔品牌不能为空',
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
            classKey: 'box8302BrandName',
            label: '云盒品牌',
            tag: 'id-input-popup',
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
            getTableList: get8302boxBrandList,
            isTree: false,
            isPage: false,
            id: '',
            number: '',
            name: '',
            controlTooltipShow: true,
            tableColumns: box8302BrandTableColumns,
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
            box8302BrandId: 0, //云盒品牌ID
            box8302BrandName: '', //马尔品牌
            box8302Model: '', //云盒型号
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
            box8302BrandName: [
              {
                required: true,
                message: '马尔品牌不能为空',
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
              classKey: 'box8302BrandName',
              label: '云盒品牌',
              tag: 'id-input-popup',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: get8302boxBrandList,
              isTree: false,
              isPage: false,
              id: '',
              number: '',
              name: '',
              controlTooltipShow: true,
              tableColumns: box8302BrandTableColumns,
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
    };
  },
  created() {
    let that = this;
    this.tableDetailForm.component[1].event.confirm = function (row) {
      console.log(row);
      that.tableDetailForm.data.box8302BrandId = row.id;
      that.tableDetailForm.data.box8302Model = row.number;
      that.tableDetailForm.data.box8302BrandName = row.name;
      that.tableDetailForm.component[1].id = row.id;
      that.tableDetailForm.component[1].number = row.number;
      that.tableDetailForm.component[1].name = row.name;
    };
    this.tableDetailForm.component[2].event.afterGetTablePage = function (
      tableData
    ) {
      const options = ['mysql', 'oracle', 'sqlserver'];
      tableData.forEach((dItem) => {
        dItem.databaseType = options[dItem.databaseType];
      });
    };
    this.tableDetailForm.component[2].event.confirm = function (row) {
      that.tableDetailForm.data.connectionId = row.id;
      that.tableDetailForm.data.connectionCompleteNumber = row.number;
      that.tableDetailForm.data.connectionCompleteName = row.name;
      that.tableDetailForm.component[2].id = row.id;
      that.tableDetailForm.component[2].number = row.number;
      that.tableDetailForm.component[2].name = row.name;
    };

    this.diaForm.form.component[0].event.confirm = function (row) {
      that.diaForm.form.data.box8302BrandId = row.id;
      that.diaForm.form.data.box8302Model = row.number;
      that.diaForm.form.data.box8302BrandName = row.name;
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
          box8302BrandId: 0, //云盒品牌ID
          box8302BrandName: '', //马尔品牌
          box8302Model: '', //云盒型号
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
          this.diaForm.form.data.box8302BrandId;
        this.diaForm.form.component[0].number =
          this.diaForm.form.data.box8302Model;
        this.diaForm.form.component[0].name =
          this.diaForm.form.data.box8302BrandName;
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
          await addX8302boxBatch(this.diaForm.form.data).then((res) => {
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
      console.log('2222');
      console.log(this.tableDetailForm);
      console.log(data);
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
        this.tableDetailForm.data.box8302BrandId;
      this.tableDetailForm.component[1].number =
        this.tableDetailForm.data.box8302Model;
      this.tableDetailForm.component[1].name =
        this.tableDetailForm.data.box8302BrandName;
      this.tableDetailForm.component[2].id =
        this.tableDetailForm.data.connectionId;
      this.tableDetailForm.component[2].number =
        this.tableDetailForm.data.connectionCompleteNumber;
      this.tableDetailForm.component[2].name =
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
        box8302BrandId: 0, //云盒品牌ID
        box8302BrandName: '', //马尔品牌
        box8302Model: '', //云盒型号
        connectionId: 0, //连接通道ID
        connectionCompleteNumber: '', //连接通道number
        connectionCompleteName: '', //连接通道name
        stationAddress: 0, //站地址
        mark: '',
        orgId: this.$store.state.user.userInfo.orgId,
      };
      this.tableDetailForm.component[1].id =
        this.tableDetailForm.data.box8302BrandId;
      this.tableDetailForm.component[1].number =
        this.tableDetailForm.data.box8302Model;
      this.tableDetailForm.component[1].name =
        this.tableDetailForm.data.box8302BrandName;
      this.tableDetailForm.component[1].controlTooltipShow = false;
      this.tableDetailForm.component[2].id =
        this.tableDetailForm.data.connectionId;
      this.tableDetailForm.component[2].number =
        this.tableDetailForm.data.connectionCompleteNumber;
      this.tableDetailForm.component[2].name =
        this.tableDetailForm.data.connectionCompleteName;
      this.tableDetailForm.component[2].controlTooltipShow = false;
      this.$nextTick(() => {
        this.tableDetailForm.component[1].controlTooltipShow = true;
        this.tableDetailForm.component[2].controlTooltipShow = true;
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
