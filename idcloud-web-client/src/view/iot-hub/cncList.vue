<template>
  <div>
    <id-bar-query-table-dia-form
      ref="tableDiaForm"
      tableErrTip="cnc清单"
      :actionBarConfig="actionBarConfig"
      :tableColumns="tableColumns"
      :tableDetailForm="tableDetailForm"
      form-label-width="100px"
      id-query-form-label-width="90px"
      :getTable="getTable"
      :getDetail="getDetail"
      :addDetail="addDetail"
      :updateDetail="updateDetail"
      :deleteTable="deleteTable"
      @actionBarClick="actionBarClick"
      @editTableDetail="editTableDetail"
      @initTableDetail="initTableDetail"
    >
    </id-bar-query-table-dia-form>

    <el-dialog
      :visible.sync="diaForm.show"
      @closed="diaCloseFunc(diaForm.ref)"
    >
      <id-form
        :ref="diaForm.ref"
        class="more-query-form"
        :id-form="diaForm.form"
        v-bind="diaForm"
        :label-width="diaForm.labelWidth"
      ></id-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">cnc清单</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="diaCloseFunc(diaForm.ref)">取消</el-button>
        <el-button type="primary" @click="diaSaveFunc(diaForm.ref)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import IdButtonConfig from "@/components/id-button/IdButtonConfig";
  import IdBarQueryTableDiaForm from "@/components/id-pages/IdBarQueryTableDiaForm";
  import {
    findMoList as getList,
    findMoDetail as getDetail,
    addMo as add,
    deleteMo as batchDel,
    updateMo as update,
    addCncBatch
  } from "@/api/iot-hub/cncList";
  import cncBrandTableColumns from "../tableColumns/cncBrandTableColumns";
  import {findMoList as getCncBrandList} from "@/api/iot-hub/cncBrand";
  import connectionManagementTableColumns from "../tableColumns/connectionManagementTableColumns";
  import {getList as getConnectionManagementList} from "@/api/iot-hub/connectionManagement";
  import IdForm from "@/components/id-form/index";

  export default {
    name: "cncList",
    components: {
      IdBarQueryTableDiaForm,
      IdForm
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
          new IdButtonConfig("button-add", "添加", "add", {type: "primary"}),
          new IdButtonConfig("button-add", "批量添加", "moreAdd", {type: "primary"}),
          new IdButtonConfig("button-delete", "删除", "delete", {styleOne: true}),
          new IdButtonConfig("button-fresh", "刷新", "fresh", {
            styleTwo: true,
            beforeIf: true,
            beforeClass: "el-icon-refresh-right",
          }),
        ],
        //列
        tableColumns: [
          {
            tag: "el-table-column",
            label: "机床代码",
            prop: "number",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "机床型号",
            prop: "machineModel",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "cnc品牌",
            prop: "cncBrandName",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "cnc型号",
            prop: "cncModel",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "IP地址",
            prop: "ip",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "端口号",
            prop: "port",
            minWidth: 180,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "连接通道",
            prop: "connectionCompleteName",
            minWidth: 420,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "备注信息",
            prop: "mark",
            minWidth: 240,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "创建时间",
            prop: "createTime",
            minWidth: 240,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
          {
            tag: "el-table-column",
            label: "修改时间",
            prop: "updateTime",
            minWidth: 240,
            resizable: false,
            showOverflowTooltip: true,
            comp: "Datetime",
          },
        ],
        //弹窗内form
        tableDetailForm: {
          data: {
            id: "",
            number: "",//机床代码
            machineModel:"",//机床型号
            cncBrandId: 0,//数控系统品牌ID
            cncBrandName: "",//数控系统品牌
            cncModel: "",//数控系统型号
            ip:"",//IP地址
            port:"",//端口号
            connectionId: 0,//连接通道ID
            connectionCompleteNumber: "",//连接通道number
            connectionCompleteName: "",//连接通道name
            mark: "",
            orgId: this.$store.state.user.userInfo.orgId,
          },
          rules: {
            number: [{required: true, message: "量具代码不能为空", trigger: ["blur", "change"]}],
            cncBrandName: [{required: true, message: "cnc品牌不能为空", trigger: ["blur", "change"]}],
            connectionCompleteName: [{required: true, message: "连接通道不能为空", trigger: ["blur", "change"]}],
            ip: [{required: true, message: "ip地址不能为空", trigger: ["blur", "change"]}],
          },
          component: [
            {
              classKey: "number",
              label: "机床代码",
              tag: "el-input-number",
              placeholder: "请输入",
              controlsPosition: "right",
              min: 0,
              max: 999999,
              step: 1,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "machineModel",
              label: "机床型号",
              tag: "el-input",
              placeholder: "请输入",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "cncBrandName",
              label: "cnc品牌",
              tag: "id-input-popup",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getCncBrandList,
              isTree: false,
              isPage: false,
              id: "",
              number: "",
              name: "",
              controlTooltipShow: true,
              tableColumns: cncBrandTableColumns,
              diaTitle: "cnc品牌型号库",
              event: {},
            },
            {
              classKey: "ip",
              label: "IP地址",
              tag: "el-input",
              placeholder: "请输入",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "port",
              label: "端口号",
              tag: "el-input-number",
              placeholder: "请输入",
              controlsPosition: "right",
              min: 1,
              max: 999999,
              step: 1,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: "connectionCompleteName",
              label: "连接通道",
              tag: "id-input-popup",
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
              getTableList: getConnectionManagementList,
              isTree: false,
              isPage: false,
              id: "",
              number: "",
              name: "",
              controlTooltipShow: true,
              tableColumns: connectionManagementTableColumns,
              diaTitle: "连接通道",
              event: {},
            },
            {
              classKey: "mark",
              label: "备注",
              tag: "el-input",
              placeholder: "请输入",
              type: "textarea",
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
          labelWidth: '120px',
          form: {
            data: {
              id: "",
              cncBrandId: 0,//量具品牌ID
              cncBrandName: "",//数控系统品牌
              cncModel: "",//量具型号
              machineModel:"",//机床型号
              number: 1,//起始号
              port:1,//端口号
              num: 1,//数量
              connectionId: 0,//连接通道ID
              connectionCompleteNumber: "",//连接通道number
              connectionCompleteName: "",//连接通道name
              mark: "",
              orgId: this.$store.state.user.userInfo.orgId,
            },
            rules: {
              number: [{required: true, message: "起始号不能为空", trigger: ["blur", "change"]}],
              cncBrandName: [{required: true, message: "cnc品牌不能为空", trigger: ["blur", "change"]}],
              connectionCompleteName: [{required: true, message: "连接通道不能为空", trigger: ["blur", "change"]}],
              port: [{required: true, message: "端口号不能为空", trigger: ["blur", "change"]}],
              ip: [{required: true, message: "ip地址不能为空", trigger: ["blur", "change"]}],
            },
            component: [
              {
                classKey: "cncBrandName",
                label: "cnc品牌",
                tag: "id-input-popup",
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getCncBrandList,
                isTree: false,
                isPage: false,
                id: "",
                number: "",
                name: "",
                controlTooltipShow: true,
                tableColumns: cncBrandTableColumns,
                diaTitle: "cnc品牌型号库",
                event: {},
              },
              {
                classKey: "machineModel",
                label: "机床型号",
                tag: "el-input",
                placeholder: "请输入",
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "number",
                label: "起始号",
                tag: "el-input-number",
                placeholder: "请输入",
                controlsPosition: "right",
                min: 1,
                max: 999999,
                step: 1,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "port",
                label: "端口号",
                tag: "el-input-number",
                placeholder: "请输入",
                controlsPosition: "right",
                min: 1,
                max: 999999,
                step: 1,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "num",
                label: "数量",
                tag: "el-input-number",
                placeholder: "请输入",
                controlsPosition: "right",
                min: 1,
                max: 999999,
                step: 1,
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "ip",
                label: "IP地址",
                tag: "el-input",
                placeholder: "请输入",
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              {
                classKey: "connectionCompleteName",
                label: "连接通道",
                tag: "id-input-popup",
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
                getTableList: getConnectionManagementList,
                isTree: false,
                isPage: false,
                id: "",
                number: "",
                name: "",
                controlTooltipShow: true,
                tableColumns: connectionManagementTableColumns,
                diaTitle: "连接通道",
                event: {},
              },
              {
                classKey: "mark",
                label: "备注",
                tag: "el-input",
                placeholder: "请输入",
                type: "textarea",
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
      this.tableDetailForm.component[2].event.confirm = function (row) {
        that.tableDetailForm.data.cncBrandId = row.id;
        that.tableDetailForm.data.cncModel = row.cncModel;
        that.tableDetailForm.data.cncBrandName = row.cncBrand;
        that.tableDetailForm.component[2].id = row.id;
        that.tableDetailForm.component[2].number = row.cncModel;
        that.tableDetailForm.component[2].name = row.cncBrand;
      };
      this.tableDetailForm.component[5].event.afterGetTablePage = function (tableData) {
        const options = ["mysql", "oracle", "sqlserver"];
        tableData.forEach((dItem) => {
          dItem.databaseType = options[dItem.databaseType];
        });
      };
      this.tableDetailForm.component[5].event.confirm = function (row) {
        that.tableDetailForm.data.connectionId = row.id;
        that.tableDetailForm.data.connectionCompleteNumber = row.number;
        that.tableDetailForm.data.connectionCompleteName = row.name;
        that.tableDetailForm.component[5].id = row.id;
        that.tableDetailForm.component[5].number = row.number;
        that.tableDetailForm.component[5].name = row.name;
      };

      this.diaForm.form.component[0].event.confirm = function (row) {
        that.diaForm.form.data.cncBrandId = row.id;
        that.diaForm.form.data.cncModel = row.cncModel;
        that.diaForm.form.data.cncBrandName = row.cncBrand;
        that.diaForm.form.component[0].id = row.id;
        that.diaForm.form.component[0].number = row.cncModel;
        that.diaForm.form.component[0].name = row.cncBrand;
      };
      this.diaForm.form.component[6].event.afterGetTablePage = function (tableData) {
        const options = ["mysql", "oracle", "sqlserver"];
        tableData.forEach((dItem) => {
          dItem.databaseType = options[dItem.databaseType];
        });
      };
      this.diaForm.form.component[6].event.confirm = function (row) {
        that.diaForm.form.data.connectionId = row.id;
        that.diaForm.form.data.connectionCompleteNumber = row.number;
        that.diaForm.form.data.connectionCompleteName = row.name;
        that.diaForm.form.component[6].id = row.id;
        that.diaForm.form.component[6].number = row.number;
        that.diaForm.form.component[6].name = row.name;
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
            id: "",
            cncBrandId: 0,//量具品牌ID
            cncBrandName: "",//数控系统品牌
            cncModel: "",//量具型号
            machineModel:"",//机床型号
            number: 1,//起始号
            port:1,//端口号
            num: 1,//数量
            connectionId: 0,//连接通道ID
            connectionCompleteNumber: "",//连接通道number
            connectionCompleteName: "",//连接通道name
            mark: "",
            orgId: this.$store.state.user.userInfo.orgId,
          };
          this.diaForm.form.component[0].id = this.diaForm.form.data.cncBrandId;
          this.diaForm.form.component[0].number = this.diaForm.form.data.cncModel;
          this.diaForm.form.component[0].name = this.diaForm.form.data.cncBrandName;
          this.diaForm.form.component[0].controlTooltipShow = false;
          this.diaForm.form.component[6].id = this.diaForm.form.data.connectionId;
          this.diaForm.form.component[6].number = this.diaForm.form.data.connectionCompleteNumber;
          this.diaForm.form.component[6].name = this.diaForm.form.data.connectionCompleteName;
          this.diaForm.form.component[6].controlTooltipShow = false;
          this.$nextTick(() => {
            this.diaForm.form.component[0].controlTooltipShow = true;
            this.diaForm.form.component[6].controlTooltipShow = true;
          });
          this.$refs[ref].$refs['idForm'].resetFields();
        });
      },
      // 数据校验=》保存或者更新数据
      async diaSaveFunc(ref) {
        this.$refs[ref].$refs['idForm'].validate(async (valid) => {
          if (valid) {
            await addCncBatch(this.diaForm.form.data).then((res) => {
              if (res.data.code === 200 && res.status === 200) {
                this.$message.success("提交成功!");
                this.diaCloseFunc(ref);
                this.$refs['tableDiaForm'].handleQueryData();
              } else {
                this.$notifyError("提交失败!", res.data.msg);
              }
            });
          } else {
            this.$message.error("*为必填项");
          }
        });
      },
      // 普通接口
      editTableDetail(data) {
        this.tableDetailForm.component[0] = {
          classKey: "number",
          label: "机床代码",
          tag: "el-input",
          placeholder: "请输入",
          clearable: true,
          idLoad: false,
          idIf: true,
          idDisable: false,
          idShow: true,
        };

        this.tableDetailForm.data = {...data.records[0]};
        this.tableDetailForm.data.orgId = this.$store.state.user.userInfo.orgId;
        this.tableDetailForm.component[2].id = this.tableDetailForm.data.cncBrandId;
        this.tableDetailForm.component[2].number = this.tableDetailForm.data.cncModel;
        this.tableDetailForm.component[2].name = this.tableDetailForm.data.cncBrandName;
        this.tableDetailForm.component[5].id = this.tableDetailForm.data.connectionId;
        this.tableDetailForm.component[5].number = this.tableDetailForm.data.connectionCompleteNumber;
        this.tableDetailForm.component[5].name = this.tableDetailForm.data.connectionCompleteName;
      },
      initTableDetail() {
        this.tableDetailForm.component[0] = {
          classKey: "number",
          label: "机床代码",
          tag: "el-input-number",
          placeholder: "请输入",
          controlsPosition: "right",
          min: 0,
          max: 999999,
          step: 1,
          idLoad: false,
          idIf: true,
          idDisable: false,
          idShow: true,
        };

        this.tableDetailForm.data = {
          id: "",
          number: "",//机床代码
          machineModel:"",//机床型号
          cncBrandId: 0,//数控系统品牌ID
          cncBrandName: "",//数控系统品牌
          cncModel: "",//数控系统型号
          ip:"",//IP地址
          port:"",//端口号
          connectionId: 0,//连接通道ID
          connectionCompleteNumber: "",//连接通道number
          connectionCompleteName: "",//连接通道name
          mark: "",
          orgId: this.$store.state.user.userInfo.orgId,
        };
        this.tableDetailForm.component[2].id = this.tableDetailForm.data.cncBrandId;
        this.tableDetailForm.component[2].number = this.tableDetailForm.data.cncModel;
        this.tableDetailForm.component[2].name = this.tableDetailForm.data.cncBrandName;
        this.tableDetailForm.component[2].controlTooltipShow = false;
        this.tableDetailForm.component[5].id = this.tableDetailForm.data.connectionId;
        this.tableDetailForm.component[5].number = this.tableDetailForm.data.connectionCompleteNumber;
        this.tableDetailForm.component[5].name = this.tableDetailForm.data.connectionCompleteName;
        this.tableDetailForm.component[5].controlTooltipShow = false;
        this.$nextTick(() => {
          this.tableDetailForm.component[2].controlTooltipShow = true;
          this.tableDetailForm.component[5].controlTooltipShow = true;
        });
      },
    },
  }
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
      margin-right: 16px
    }
  }
</style>
