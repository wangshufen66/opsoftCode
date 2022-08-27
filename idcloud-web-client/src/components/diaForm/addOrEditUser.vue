<template>
  <div>
    <el-dialog v-model="accountSaveObj.show" :visible.sync="accountSaveObj.show" :title="accountSaveObj.title"
               top="30px" :close-on-press-escape="closeOnPressEscape"
               @closed="closeFunc('accountRef')">
      <el-form ref="accountRef" :model="accountSaveObj.data" :rules="accountSaveRules" label-width="140px" size="medium"
               label-position="right">
        <el-form-item label="登录账号" prop="account">
          <el-input :disabled="accountSaveObj.data.id!==undefined" v-model.trim="accountSaveObj.data.account"/>
        </el-form-item>
        <el-form-item v-if="!accountSaveObj.data.id" label="登录密码" prop="password">
          <el-input :disabled="!accountSaveObj.editUserAuthority" placeholder="请输入密码"
                    v-model.trim="accountSaveObj.data.password" show-password/>
        </el-form-item>
        <el-form-item v-if="!accountSaveObj.data.id" label="确认密码" prop="passwordConfirm">
          <el-input :disabled="!accountSaveObj.editUserAuthority" placeholder="请确认密码"
                    v-model.trim="accountSaveObj.data.passwordConfirm" show-password/>
        </el-form-item>
        <el-form-item label="用户姓名" prop="name">
          <el-input :disabled="!accountSaveObj.editUserAuthority" v-model.trim="accountSaveObj.data.name"/>
        </el-form-item>
        <el-form-item label="用户代码" prop="number">
          <el-input :disabled="!accountSaveObj.editUserAuthority" v-model.trim="accountSaveObj.data.number"/>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input :disabled="!accountSaveObj.editUserAuthority" v-model.trim="accountSaveObj.data.email"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input :disabled="!accountSaveObj.editUserAuthority" v-model.trim="accountSaveObj.data.phone"/>
        </el-form-item>
        <el-form-item label="账户类型" prop="type">
          <!--<el-input v-model.trim="accountSaveObj.data.type"/>-->
          <el-select :disabled="!accountSaveObj.editUserAuthority" v-model.trim="accountSaveObj.data.type"
                     placeholder="账户类型">
            <el-option label="普通用户" value="0"></el-option>
            <el-option :disabled="userInfo.type!==99" label="企业管理员" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工绑定" prop="personName">
          <el-input
            :readonly="true"
            v-model.trim="accountSaveObj.data.showPerson"
            size="small"
            placeholder="请选择员工">
            <template slot="append">
              <el-button style="background-color: #e6f7ff;" size="small" class="el-icon-more"
                         @click="selectClerk(0)"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="accountSaveObj.data.id" label="账户状态" prop="status">
          <!--<el-input v-model.trim="accountSaveObj.data.status"/>-->
          <el-select :disabled="!accountSaveObj.editUserAuthority" v-model.trim="accountSaveObj.data.status"
                     placeholder="账户状态">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input :disabled="!accountSaveObj.editUserAuthority" v-model.trim="accountSaveObj.data.description"/>
        </el-form-item>
      </el-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{accountSaveObj.title}}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="closeFunc('accountRef')">取消</el-button>
        <el-button type="primary" :disabled="!accountSaveObj.editUserAuthority" @click="saveFunc('accountRef')">确定
        </el-button>
      </div>
    </el-dialog>
    <table-modal
      ref="tableModal"
      :table-uni-key="tableModalTableUniKey"
      :show="tableModalShow"
      :is-show-search="tableModalShowSearch"
      :inner-show="tableModelInnerShow"
      :title="tableModelTitle"
      :inner-title="tableModelInnerTitle"
      :inner-message="tableModelInnerMessage"
      :has-action-column="tableModelActionColumn"
      :cancel-label="tableModalCancelLabel"
      :confirm-label="tableModalConfirmLabel"
      :table-highlight-row="tableModalHighlightRowEnable"
      :server-page="tableModalServerPage"
      :table-tag="tableModalTableTag"
      :hasSelectColumn="tableModalHasSelectColumn"
      :hasSearchInput="tableModalHasSearchInput"
      :hasSearchInputSelect="tableModalHasSearchInputSelect"
      :hasSearchTypeSelect="tableModalHasSearchTypeSelect"
      :searchTypeConfig="tableModalSearchTypeConfig"
      :hasSearchButton="tableModalHasSearchButton"
      :hasSelectClearButton="tableModalHasSelectClearButton"
      :modal-show="tableModalModalShow"
      @requestTablePageData="handleTableModalRequestTablePageData"
      @OnCurrentHighlightRowChange="handleTableModalCurrentHighlightRowChange"
      @OnRowDbclick="handleTableModalRowDbclick"
      @innerConfirm="handleTableModalInnerConfirm" @innerCancel="handleTableModalInnerCancel"
      @confirm="handleTableModalConfirm" @cancel="handleTableModalCancel"/>
  </div>
</template>

<script>
  import {
    // findAllUserList,
    getUserListByOrg,
    // findEnterpriseList,
    // saveUser,
    editUser,
    addUser,
    delUser
  } from '@/api/systemManagement/user'
  import TableModal from "../table-modal";
  import {getList as getClerkList} from "@/api/basicData/clerk"

  export default {
    name: "AddOrEditUser",
    components: {TableModal},
    data() {
      return {
        tableModalTableUniKey: 'id',
        tableModalCurParams: {},  // 组件中对话看的当前参数相关
        tableModalShowSearch: true,
        tableModalHasSearchButton: true,
        tableModalHasSearchInput: true,
        tableModalHasSearchInputSelect: true,
        tableModalHasSelectClearButton: false,
        tableModalHasSearchTypeSelect: false,
        tableModalHasSelectColumn: false,
        tableModalSearchTypeConfig: {
          value: '1',
          placeholder: '',
          selections: [
            // {
            //   key: '',
            //   title: ''
            // }
          ],
          // 这里为了分清监听选择器当前所属的输入栏位，而做标识，每次弹窗会标注属于那个输入框
          tag: ''
        },
        tableModalOptionFlag: '', // 父组件使用该对话框时，每次弹出表格对话框前，可以为此附加一个唯一标识，然后在确定按钮回调函数中以此进行判定，执行相应的操作
        tableModalShow: false,
        tableModalModalShow: true,//是否显示遮罩层
        tableModelTitle: '查阅',
        tableModelInnerShow: false,
        tableModelInnerTitle: '提交',
        tableModelInnerMessage: '确定要提交数据吗？', // 表格对话框的内层对话框显示信息内容
        tableModelActionColumn: false,  // 目前暂且不需要操作列
        tableModalCancelLabel: '取消',
        tableModalConfirmLabel: '确定',
        tableModalHighlightRowEnable: true,  // 是否开启点击行高亮功能，开启后每点击一行都会激活  函数
        tableModalCurHighlightRow: null, // 开启上面点击行高亮功能后，会在点击行事件中记录下当前高亮的行数据对象
        tableModalServerPage: false,  // 表格对话框的后台分页开关
        tableModalTableTag: '', // 后台分页开启后，回调给父组件进行判定执行相应操作的标识（这个标识在父组件调用显示对话框时，会事先让父组件附上自己的唯一标识）
        accountSaveRules: {
          account: [
            {required: true, message: '登录账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '登录密码不能为空', trigger: 'blur'}
          ],
          passwordConfirm: [
            {required: true, message: '确认密码不能为空', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                this.validatePasswordConfirm(rule, value, callback)
              }, trigger: 'blur'
            }
          ],
          name: [
            {required: true, message: '用户姓名不能为空', trigger: 'blur'}
          ],
          number: [
            {required: true, message: '用户代码不能为空', trigger: 'blur'}
          ],
          email: [
            {type: 'email', required: true, message: '电子邮件不能为空', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '联系电话不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择账户类型', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '账户状态不能为空', trigger: 'blur'}
          ]
        },
        closeOnPressEscape: false,
      }
    },
    props: {
      accountSaveObj: {
        editUserAuthority: false,
        type: Object
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo;
      }
    },
    methods: {
      selectClerk() {
        const optionFlag = "clerk"; // 此标识不能乱改，弹框的回调操作将以此作为判定的依据
        const title = "职员-(双击选择)";
        const highlightRowEnable = true;
        const serverPage = true;
        const searchColumnSelections = [
          {
            title: '代码',
            key: 'number',
            width: '240',
            type: 'text',
          },
          {
            title: '名称',
            key: 'name',
            width: '240',
            type: 'text',
          }
        ];
        // 每次弹窗前，先清理对话框列表，避免出现残留数据
        this.$refs['tableModal'].tableConfig.countTotal = 0;
        // 调用子组件 tableModal 执行重绘表格数据
        this.$refs['tableModal'].drawTableData([], []);
        // 筛选栏显示控制
        // this.tableModalShowSearch = true;
        this.$refs['tableModal'].tableConfig.searchColumnSelections = searchColumnSelections;
        // 下拉选择框的默认选项，即 column 的 key 值
        this.$refs['tableModal'].tableConfig.selectSearchColumn = '';
        this.$refs['tableModal'].tableConfig.pageSize = 8;
        // 显示表格对话框
        // this.curTableModalOptionType = this.tableModalOptionTypes.customOption;  // 设置自定义操作后，点击确定按钮会回调给父组件绑定的函数
        this.tableModalOptionFlag = optionFlag;  // 点击确定按钮后回调父组件绑定函数中会带有此参数，父组件可以以此作为判别依据，执行相应的操作
        this.tableModalTableTag = optionFlag;  // 后台分页的标识也设为同上的值
        this.tableModalServerPage = serverPage;  // 是否后台分页
        this.tableModalHighlightRowEnable = highlightRowEnable;  // 是否开启点击行高亮功能，开启后每点击一行都会激活  函数
        this.tableModalCurHighlightRow = null; // 每次初次显示表格对话框时，事先清空高亮行记录值
        this.tableModelTitle = title;
        this.tableModalCancelLabel = '取消';
        this.tableModalConfirmLabel = '确定';
        this.tableModalShow = true;
        this.requestClerkTableData(1, 8, "", "");
      },
      // 表格对话框，开启点击行高亮后，每次点击行都会激活此函数
      handleTableModalCurrentHighlightRowChange(currentRow, oldCurrentRow) {
        // 记录下当前高亮行
        this.tableModalCurHighlightRow = currentRow
      },
      // 表格对话框内层对话框 取消按钮 点击事件
      handleTableModalInnerCancel() {
        // 关闭表格内层对话框
        this.tableModelInnerShow = false
      },
      handleTableModalInnerConfirm(tableColumns, tableData) {

        // ** 方案修改：直接在第一层表格对话框点击确定按钮后，提交数据到后台，不再显示这一层提示对话框，太繁琐

        // // 点击表格对话框后的最终操作：提交数据到父组件，让父组件提交到后台
        // this.confirmToCommitData(tableColumns,tableData)
      },
      // 表格对话框 取消按钮 点击事件
      handleTableModalCancel() {
        // 关闭表格对话框
        this.tableModalShow = false
      },
      //以下方法中的参数跟表单方法不太一致 需要注意
      // 请求<clerk>的表格数据
      requestClerkTableData(curPage, curPageSize, search, selectSearchColumn) {
        // 请求参数
        const params = {
          current_page: curPage,
          page_size: curPageSize,
          orgId: this.accountSaveObj.data.orgId,
          showAll: true,
          groupId: 0,
          auditStatus: 1,
          isDisable: false,
          excludePersonInAccount: 1,
        };
        if (!((search === null || search === '' || search === undefined)
          && (selectSearchColumn === null || selectSearchColumn === '' || selectSearchColumn === undefined)))
          params[selectSearchColumn] = search;
        let promiseArray = [
          //列表请求
          getClerkList(params)
        ];

        this.$refs['tableModal'].tableConfig.loading = true;
        Promise.all(promiseArray)
          .then(response => {
            // console.log(JSON.stringify(response))
            let [dataResponse] = response;

            // 接收页签的表格数据（后台数据）
            this.receiveClerkTableData(dataResponse);
          })
          .catch(() => {
            this.$notifyError("网络请求失败!", "");
          })
          .finally(() => {
            this.$refs['tableModal'].tableConfig.loading = false;
          });
      },
      // 接收<clerk>页签的表格数据（后台数据）
      receiveClerkTableData(response) {
        // console.log(JSON.stringify(response))
        response = response.data;

        if (response.code !== 200) {
          this.$notifyError("获取人员列表失败", response.msg);
        } else if (
          !response.hasOwnProperty("data") ||
          !response.data.hasOwnProperty("records") ||
          !response.data.records
        ) {
          this.$notifyError("失败", "请求到的反馈数据为NULL");
        } else {
          let tableData = response.data.records;
          // this.tabs.group.tableConfig.columnsStd = this.$store.state['mo'].groupColumns.columnsStd
          // this.tabs.group.tableConfig.columns = this.$store.state['mo'].groupColumns.columns
          const countTotal = response.data.total;
          // const columns = [...this.$store.state['billOfMaterial'].billOfMaterialColumns.columns]
          const columns = [
            {
              title: '代码',
              key: 'number',
              width: '250',
              type: 'text',
            },
            {
              title: '名称',
              key: 'name',
              width: '250',
              type: 'text',
            },
            {
              title: '所属部门代码',
              key: 'departmentNumber',
              width: '250',
              type: 'text',
            },
            {
              title: '所属部门名称',
              key: 'departmentName',
              width: '250',
              type: 'text',
            },
            {
              title: '所属班组代码',
              key: 'teamNumber',
              width: '250',
              type: 'text',
            },
            {
              title: '所属班组名称',
              key: 'teamName',
              width: '250',
              type: 'text',
            },
            {
              title: '邮箱',
              key: 'email',
              width: '250',
              type: 'text',
            },
            {
              title: '地址',
              key: 'address',
              width: '250',
              type: 'text',
            },
            {
              title: '电话',
              key: 'phone',
              width: '250',
              type: 'text',
            },
            {
              title: '备注',
              key: 'note',
              width: '320',
            },
          ];
          this.$refs['tableModal'].tableConfig.countTotal = countTotal;
          // 调用子组件 tableModal 执行重绘表格数据
          this.$refs['tableModal'].drawTableData(columns, tableData);
        }
      },
      // 表格对话框后台分页时，请求后台数据事件
      handleTableModalRequestTablePageData(tableTag, curPage, pageSize, search, selectSearchColumn) {
        // console.log(tableTag)
        switch (tableTag) {
          case 'clerk':
            this.requestClerkTableData(curPage, pageSize, search, selectSearchColumn)
            break
        }
      },
      // 表格对话框行双击事件
      handleTableModalRowDbclick(tableModalFlag, curRow, index, callback) {
        this.confirmModalSelectedRow(tableModalFlag, curRow, index, callback);
        this.$refs['tableModal'].dealSthWhenClose();
        // 关闭表格对话框
        this.tableModalShow = false;
      },
      // 表格对话框的 确定按钮 回调事件
      handleTableModalConfirm(tableModalFlag, tableModalCurHighlightRow, selectedRows, index) {
        this.confirmModalSelectedRow(tableModalFlag, tableModalCurHighlightRow, -1, null);
        this.$refs['tableModal'].dealSthWhenClose();
        // 关闭表格对话框
        this.tableModalShow = false;
      },
      // 表格对话框行确认事件
      confirmModalSelectedRow(tableModalFlag, curRow, index, callback) {
        if (tableModalFlag.length === undefined)
          this.selectedTableModalClerkFormData(
            tableModalFlag.id,
            tableModalFlag.number,
            tableModalFlag.name
          );
        if (!callback) {
        } else {
          // 回调true，则双击后关闭对话框
          callback(true);
        }
      },
      // 表格对话框行去确认后接受数据事件
      selectedTableModalClerkFormData(rowId, rowCode, rowName) {
        if (!rowId) {
          this.$message.error("数据错误，数据 ID 为 NULL");
        } else {
          this.accountSaveObj.data.personId = rowId;
          // this.accountSaveObj.data.personNumber = rowCode;
          // this.accountSaveObj.data.personName = rowName;
          this.accountSaveObj.data.showPerson = rowCode + '【' + rowName + '】';
        }
      },

      //确认密码验证
      validatePasswordConfirm(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.accountSaveObj.data.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      // 关闭窗口
      closeFunc(data) {
        this.accountSaveObj.show = false
        this.$refs[data].resetFields()
      },
      // 保存 表单验证
      saveFunc(data) {
        this.$refs[data].validate((valid) => {
          if (valid) {
            this.saveSureFunc(data)
          } else {
            this.$message.error('*为必填项')
          }
        })
      },
      // 保存 提交后台
      saveSureFunc(data) {
        if (!this.accountSaveObj.data.id) {
          this.accountSaveObj.data.username = this.accountSaveObj.data.account
          addUser(this.accountSaveObj.data).then(res => {
            if (res.data.code === 200 && res.status === 200) {
              this.$message.success("提交成功!");
              this.accountSaveObj.show = false
              this.$emit('getUserListByOrgFunc')
            } else {
              this.$notifyError("操作失败!", res.data.msg);
            }
          })
        } else {
          editUser(this.accountSaveObj.data).then(res => {
            if (res.data.code === 200 && res.status === 200) {
              this.$message.success("提交成功!");
              this.accountSaveObj.show = false
              this.$emit('getUserListByOrgFunc')
            } else {
              this.$notifyError("操作失败!", res.data.msg);
            }
          })
        }
      },

    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/diaForm.less";

  /deep/ .dialog-footer {

    .el-button {
      content: '';
      position: relative;
      width: 40px;
      height: 40px;
    }

    .el-button::before,
    .el-button::after {
      position: absolute;
      content: '';
      background-color: #8f9298;
      left: 20px;
      width: 1.2px;
      height: 15px;
    }

    .el-button::before {
      transform: rotate(45deg);
    }

    .el-button::after {
      transform: rotate(-45deg);
    }

    .el-button:hover {
      color: #ffffff;
      background-color: #ffffff;
    }

    .el-button--error {
      top: 5px;
      right: 15px;
      position: absolute;
      width: 30px;
      height: 40px;
      border: 0;
      border-radius: 50%;

      span {
        display: none;
      }

      /*span {*/
      /*content: '';*/
      /*position: relative;*/
      /*width: 40px;*/
      /*height: 40px;*/
      /*}*/

      /*span::before,*/
      /*span::after {*/
      /*position: absolute;*/
      /*content: '';*/
      /*background-color: red;*/
      /*left: 20px;*/
      /*width: 1px;*/
      /*height: 40px;*/
      /*}*/

      /*span::before {*/
      /*transform: rotate(45deg);*/
      /*}*/

      /*span::after {*/
      /*transform: rotate(-45deg);*/
      /*}*/
    }

    .el-button--primary {
      display: none;
    }
  }
</style>
