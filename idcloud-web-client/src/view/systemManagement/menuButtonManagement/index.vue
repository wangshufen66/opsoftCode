<template>
  <div id="container">
    <el-dialog :title="dia.dialogFormText" :visible.sync="dia.dialogFormVisible" @closed="closeFunc" top="30px">
      <el-form :model="dia.dialogForm" :rules="dia.dialogFormRules" ref="dialogForm" label-width="140px"
               controls-position="right">
        <el-form-item label="类型" prop="authorityType">
          <!--<el-input v-model="dia.dialogForm.authorityType" ></el-input>-->
          <el-select v-model.trim="dia.dialogForm.authorityType" placeholder="请选择" @change="typeChange">
            <el-option label="菜单" value="1"></el-option>
            <el-option label="按钮" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属菜单" prop="authorityParent">
          <!--<el-input v-model="dia.dialogForm.authorityParent"></el-input>-->
          <el-select v-model.trim="dia.dialogForm.authorityParent" placeholder="请选择">
            <el-option
              v-for="item in menuOptions"
              :key="item.number"
              :label="item.name"
              :value="item.number">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代码" prop="authorityNo">
          <el-input v-model="dia.dialogForm.authorityNo"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="authorityCode">
          <el-input v-model="dia.dialogForm.authorityCode"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="authorityName">
          <el-input v-model="dia.dialogForm.authorityName"></el-input>
        </el-form-item>
        <el-form-item label="请求URL" prop="authorityUrl">
          <el-input v-model="dia.dialogForm.authorityUrl"></el-input>
        </el-form-item>
        <el-form-item label="前端路由地址" prop="authorityPath">
          <el-input v-model="dia.dialogForm.authorityPath"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="authorityIcon">
          <el-input v-model="dia.dialogForm.authorityIcon"></el-input>
        </el-form-item>
        <el-form-item label="菜单组件" prop="authorityComponent">
          <el-input v-model="dia.dialogForm.authorityComponent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{dia.dialogFormText}}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="closeFunc">取消</el-button>
        <el-button type="primary" @click="submitDialogForm('dialogForm')">确定</el-button>
      </div>
    </el-dialog>

    <el-button type="primary" size="small" style="margin-top: 16px;margin-bottom: 10px" @click="addData">
      添加
    </el-button>
    <el-table
      border
      v-loading="tableLoading"
      :data="menuButtonList"
      :height="tableHeight"
      row-key="id"
    >
      <!--:columns="columns"-->
      <el-table-column
        v-for="(item,index) in columns"
        :key="index"
        :label="item.title"
        :prop="item.key"
        :width="item.width"
      >
      </el-table-column>
      <!--@on-current-change="currentChange"  highlight-row row-key="id"-->
      <!--<template slot-scope="{ row }" slot="action">-->
      <el-table-column
        fixed="right"
        label="操作"
        width="140">
        <template slot-scope="scope">
          <!-- 此处代码不灵活，暂时无时间修改 -->
          <el-button type="primary" size="small" plain @click="editData(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button style="margin-left: 0.2rem" type="danger" size="small" plain
                     @click="deleteData(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  import {
    findMenuButtonManagementList,
    findButtonList,
    findMenuList,
    deleteMenuButtonManagement,
    findMenuButtonManagementDetail,
    updateMenuButtonManagement,
    addMenuButtonManagement
  } from "@/api/systemManagement/menuButtonManagement"

  export default {
    name: "menu_button_management",
    data() {
      return {
        //---------------add cdh 20200228  新增参数区域----------------------------------------
        dia: {
          dialogFormVisible: false,
          dialogFormText: '新增/修改',
          dialogForm: {
            id: '',
            authorityNo: '',
            authorityParent: '',
            authorityCode: '',
            authorityName: '',
            authorityUrl: '',
            authorityType: '',
            authorityPath: '',
            authorityIcon: '',
            authorityComponent: ''
          },
          dialogFormRules: {
            authorityNo: {},
            authorityParent: {},
            authorityCode: {},
            authorityName: {},
            authorityUrl: {},
            authorityType: {},
            authorityPath: {},
            authorityIcon: {},
            authorityComponent: {}
          },
        },
        //-------------------------------------------------------------------------------------
        tableHeight: 0,
        tableLoading: false,
        columns: [
          {
            title: '代码',
            key: 'number',
            width: 160,
            tree: true
          },
          {
            title: '父级代码',
            width: 95,
            key: 'pNumber',
            tooltip: true
          },
          {
            title: '权限标识',
            key: 'code',
            tooltip: true
          },
          {
            title: '菜单名称',
            key: 'name',
            tooltip: true
          },
          {
            title: '请求URL',
            key: 'url',
            tooltip: true
          },
          {
            title: '权限类型',
            key: 'typeName',
            tooltip: true
          },
          {
            title: '前端路由地址',
            key: 'path',
            tooltip: true
          },
          {
            title: '菜单图标',
            key: 'icon',
            tooltip: true
          },
          {
            title: '菜单组件',
            key: 'component',
            tooltip: true
          },
          // {
          //   title: "操作",
          //   slot: "action",
          //   fixed:"right",
          //   width: 160,
          //   align: "center"
          // }
        ],
        menuButtonList: [],
        menuList: [],
        menuOptions: [],
        // ,
        // tableCurrentRow:{},
      }
    },
    created() {
      this.getMenuList()
      this.getTableHeight()
    },
    mounted() {
      this.getMenuButtonList()
    },
    computed: {},
    methods: {
      // currentChange(currentRow,oldCurrentRow){
      //   this.tableCurrentRow=currentRow
      // },
      typeChange() {
        // if(this.dia.dialogForm.authorityType==='1'){
        //   this.menuOptions=this.menuList.filter(item=>item.type===1)
        //   this.menuOptions.splice(0,0,{
        //     name: "顶级菜单",
        //     number: "0",
        //     level:0
        //   })
        // }else {
        //   this.menuOptions=this.menuList.filter(item=>item.type===2)
        // }
        this.menuOptions = this.menuList
        this.menuOptions.push({
          name: "顶级菜单",
          number: "0",
          level: 0
        })
      },
      getMenuList() {
        findMenuList().then(res => {
          if (res.status === 200 && res.data.code === 200) {
            this.menuList = res.data.data
            this.menuOptions = this.menuList
          } else {
            // 操作成功回调
            this.$notify({
              title: '获取菜单列表失败',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
        })
      },
      //保存
      submitDialogForm() {
        let params = {
          id: this.dia.dialogForm.id,
          number: this.dia.dialogForm.authorityNo,
          pNumber: this.dia.dialogForm.authorityParent,
          code: this.dia.dialogForm.authorityCode,
          name: this.dia.dialogForm.authorityName,
          url: this.dia.dialogForm.authorityUrl,
          type: this.dia.dialogForm.authorityType,
          path: this.dia.dialogForm.authorityPath,
          icon: this.dia.dialogForm.authorityIcon,
          authorityComponent: this.dia.dialogForm.authorityComponent,
        }
        if (this.dia.dialogForm.id === '') {
          params.level = this.menuOptions[this.menuOptions.findIndex(item => item.number === this.dia.dialogForm.authorityParent)].level + 1
          addMenuButtonManagement(params).then(res => {
            if (res.status === 200 && res.data.code===200) {
              this.$Notice.success({
                title: '新增成功'
              })
              this.closeFunc()
              this.getMenuList()
              this.getMenuButtonList()
            } else {
              // 操作成功回调
              this.$notify({
                title: '操作失败',
                dangerouslyUseHTMLString: true,
                message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
                type: 'error'
              })
            }
          })
        } else {
          params.level = this.dia.dialogForm.level
          updateMenuButtonManagement(params).then(res => {
            if (res.status === 200 && res.data.code===200) {
              this.$Notice.success({
                title: '更新成功'
              })
              this.closeFunc()
              this.getMenuList()
              this.getMenuButtonList()
            } else {
              // 操作成功回调
              this.$notify({
                title: '操作失败',
                dangerouslyUseHTMLString: true,
                message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
                type: 'error'
              })
            }
          })
        }
      },
      //删除
      deleteData(index, row) {
        this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenuButtonManagement({id: row.id}).then(res => {
            if (res.status === 200 && res.data.code) {
              this.$Notice.success({
                title: '删除成功'
              })
              this.getMenuList()
              this.getMenuButtonList()
            } else {
              // 操作成功回调
              this.$notify({
                title: '操作失败',
                dangerouslyUseHTMLString: true,
                message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //修改
      editData(index, row) {
        // if(row.type===1){
        //   this.menuOptions=this.menuList.filter(item=>item.type===1)
        //   this.menuOptions.splice(0,0,{
        //     name: "顶级菜单",
        //     number: "0",
        //     level:0
        //   })
        // }else {
        //   this.menuOptions=this.menuList.filter(item=>item.type===2)
        // }
        this.menuOptions = this.menuList
        this.menuOptions.push({
          name: "顶级菜单",
          number: "0",
          level: 0
        })
        this.dia.dialogForm = {
          id: row.id,
          authorityNo: row.number,
          authorityParent: row.pNumber,
          authorityCode: row.code,
          authorityName: row.name,
          authorityUrl: row.url,
          authorityType: row.type !== null ? row.type.toString() : '',
          authorityPath: row.path,
          authorityIcon: row.icon,
          authorityComponent: row.authorityComponent,
          level: row.level
        }
        this.dia.dialogFormText = "编辑"
        this.dia.dialogFormVisible = true
      },
      // 关闭窗口
      closeFunc() {
        this.dia.dialogFormVisible = false
        this.$refs.dialogForm.resetFields()
      }
      ,
      //新增
      addData() {
        this.dia.dialogFormText = "新增"
        this.dia.dialogForm = {
          id: '',
          authorityNo: '',
          authorityParent: '',
          authorityCode: '',
          authorityName: '',
          authorityUrl: '',
          authorityType: '',
          authorityPath: '',
          authorityIcon: '',
          authorityComponent: ''
        }
        this.menuOptions = []
        this.dia.dialogFormVisible = true
      }
      ,
      /* 获取企业列表 */
      getMenuButtonList() {
        this.tableLoading = true
        findMenuButtonManagementList().then(res => {
          if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data)
            for (let item of res.data.data) {
              if (item.type === 1)
                item.typeName = "菜单"
              else if (item.type === 2)
                item.typeName = "按钮"
            }
            let orginalData = res.data.data
            let data = {
              rawdata: orginalData,
              children: [],
              parent: [],
              expand: true
            }
            data.children = this.$utils.toTreeChildrenFunc(orginalData, 'number')
            data.parent = this.$utils.toTreeParentFunc(orginalData, 'pNumber')
            this.menuButtonList = this.$utils.toTreeDataFunc(data)
            // this.menuButtonList=res.data.data
            // console.log(JSON.stringify(this.menuButtonList))
          } else {
            // 操作成功回调
            this.$notify({
              title: '获取企业列表失败',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
        }).finally(
          this.tableLoading = false
        )
      }
      ,
      /* 获取表格的高度 */
      getTableHeight() {
        this.tableHeight = `${document.documentElement.clientHeight}` - 150 + 'px'
        // let _this = this
        // window.onresize = function () {
        //   _this.tableHeight = `${document.documentElement.clientHeight}` - 150
        // }
      }
      ,

    }
  }
</script>

<style lang="less" scoped>
  .el-dialog {
    .el-form {
      .el-form-item {
        .el-input {
          width: 75%;
        }

        .el-select {
          width: 75%
        }

        .el-cascader {
          width: 75%
        }

        .el-autocomplete {
          width: 75%
        }
      }
    }
  }

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
