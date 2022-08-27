<template>
  <div class="business">
    <id-tree-table-for-system ref="treeTable" :authorityName="authorityName" treeName="企业" tableName="企业" customAction isPage :actionBarConfig="actionBarConfig" :tableColumns="tableColumns" :getTreeList="getTreeList" :dropTreeItem="dropTreeItem" :getTableByTree="getTableByTree" :deleteTable="deleteTable" :suspendTable="suspendTable" :deSuspendTable="deSuspendTable" :getTableDetail="getTableDetail" @afterGetTableNoPage="afterGetTableNoPage" @tableAdd="tableAdd" @tableEdit="tableEdit">
    </id-tree-table-for-system>
    <org ref="org" :orgSaveObj="orgSaveObj" @findOrgListFunc="getTree"></org>
  </div>
</template>

<script>
import IdTreeTableForSystem from '@/components/id-pages/IdTreeTableForSystem';
import org from '@/components/diaForm/addOrEditOrg';
import IdButtonConfig from '@/components/id-button/IdButtonConfig';
import authority from '@/components/authority';
import {
  delOrg,
  deSuspendOrg,
  getOrgDetail,
  getOrgList,
  getOrgListById,
  modifyOrgParentAndLevel,
  suspendOrg,
  getTypeList,
} from '@/api/systemManagement/org';

export default {
  name: 'business_management',
  components: {
    org,
    IdTreeTableForSystem,
  },
  computed: {
    getTreeList() {
      return getOrgList;
    },
    dropTreeItem() {
      return modifyOrgParentAndLevel;
    },
    getTableByTree() {
      return getOrgListById;
    },
    deleteTable() {
      return delOrg;
    },
    suspendTable() {
      return suspendOrg;
    },
    deSuspendTable() {
      return deSuspendOrg;
    },
    getTableDetail() {
      return getOrgDetail;
    },
  },
  data() {
    return {
      actionBarConfig: [
        new IdButtonConfig('button-add', '添加', 'add', { type: 'primary' }),
        {
          tag: 'id-dropdown',
          text: '禁用',
          childButton: [
            {
              text: '禁用',
              target: 'disable',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              text: '反禁用',
              target: 'unDisable',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
          ],
        },
        new IdButtonConfig('button-fresh', '刷新', 'fresh', {
          styleTwo: true,
          beforeIf: true,
          beforeClass: 'el-icon-refresh-right',
        }),
      ], //操作行配置
      authorityName: 'business_management', //按钮权限的开头命名
      tableColumns: [
        {
          tag: 'el-table-column',
          label: '企业名称',
          prop: 'name',
          width: 240,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '企业代码',
          prop: 'number',
          width: 95,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column-status-name',
          label: '状态',
          prop: 'statusName',
          width: 80,
          comp: 'Select',
          options: [
            {
              label: '试用',
              value: '0',
              authority: new authority(),
            },
            {
              label: '正常',
              value: '1',
              authority: new authority(),
            },
            {
              label: '过期',
              value: '2',
              authority: new authority(),
            },
            {
              label: '禁用',
              value: '3',
              authority: new authority(),
            },
          ],
        },
        {
          tag: 'el-table-column',
          label: '过期时间',
          prop: 'expireTime',
          width: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '注册时间',
          prop: 'createTime',
          width: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
        {
          tag: 'el-table-column',
          label: '社会信用统一代码',
          prop: 'unifiedSocialCreditCode',
          width: 190,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '所属行业',
          prop: 'businessTypeName',
          width: 140,
          showOverflowTooltip: true,
          comp: 'SelectExpand',
          url: getTypeList,
        },
        {
          tag: 'el-table-column',
          label: '联系电话',
          prop: 'contact',
          width: 130,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '联系邮箱',
          prop: 'email',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '企业地址',
          prop: 'simpleAddress',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '详细地址',
          prop: 'address',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '备注',
          prop: 'description',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        //此列只有列权限
        // {
        //   tag: "el-table-column-template",
        //   fixed: "right",
        //   label: "操作",
        //   align: "center",
        //   width: 140,
        //   component: {
        //     tag: "id-action-bar",
        //     actionButtonSize: "mini",
        //     idConfig: [
        //       new IdButtonConfig("row-edit", "编辑", "rowEdit", { plain: true, type: "primary" }),
        //       new IdButtonConfig("row-delete", "删除", "rowDelete", { plain: true, type: "danger" }),
        //     ],
        //   },
        // },
        //该列的权限分为行权限和列权限  所以单纯列权限是无法实现的
      ], //表格列配置
      //弹窗参数——org from的弹窗
      orgSaveObj: {
        show: false,
        title: '编辑企业账号',
        data: {},
      },
    };
  },
  created() {
    //操作行权限
    this.actionBarConfig[0].idDisable =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === `${this.authorityName}_add`
      ) < 0;

    this.actionBarConfig[1].childButton[0].idDisable =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === `${this.authorityName}_suspend`
      ) < 0;

    this.actionBarConfig[1].childButton[1].idDisable =
      this.$store.state.user.accessButton.findIndex(
        (item) => item === `${this.authorityName}_deSuspend`
      ) < 0;
  },
  methods: {
    //通用方法
    getTree() {
      this.$refs.treeTable.findOrgListFunc();
    },
    afterGetTableNoPage(data) {
      const statusCompare = {
        0: '试用',
        1: '正常',
        2: '过期',
        3: '禁用',
      };
      data.forEach((item) => {
        item.statusName = statusCompare[item.status];
        item.simpleAddress = item.city
          ? item.city
          : '' + item.province
          ? item.province
          : '' + item.district
          ? item.district
          : '';
      });
    },
    tableAdd(treeSelectData) {
      if (
        treeSelectData.id === undefined &&
        this.$store.state.user.userInfo.type !== 99
      ) {
        this.$message.warning('你没有新增根企业信息的权限!');
        return;
      }
      if (treeSelectData.id) {
        this.orgSaveObj.title = '添加子节点';
        this.orgSaveObj.data = {};
        this.orgSaveObj.data.pid = treeSelectData.id;
        this.orgSaveObj.data.orgNumber = treeSelectData.number;
        this.orgSaveObj.data.level = parseInt(treeSelectData.level) + 1;
        this.orgSaveObj.data.status = String(treeSelectData.status);
        this.orgSaveObj.data.expireTime = treeSelectData.expireTime;
      } else {
        this.orgSaveObj.title = '添加根节点';
        this.orgSaveObj.data = {};
        this.orgSaveObj.data.pid = 0;
      }
      this.orgSaveObj.editAuthority =
        this.$store.state.user.userInfo.type === 99;
      this.orgSaveObj.editOrgAuthority = true;
      this.$nextTick(() => {
        this.orgSaveObj.show = true;
      });
    },
    tableEdit(data, editFormAuthority) {
      this.orgSaveObj.data = data;
      this.orgSaveObj.data.status = String(data.status);
      this.orgSaveObj.data.simpleAddress = [
        data.province,
        data.city,
        data.district,
      ];
      this.orgSaveObj.editOrgAuthority = editFormAuthority;
      this.orgSaveObj.editAuthority =
        this.$store.state.user.userInfo.type === 99;
      this.$nextTick(() => {
        this.orgSaveObj.show = true;
      });
    },
  },
};
</script>
