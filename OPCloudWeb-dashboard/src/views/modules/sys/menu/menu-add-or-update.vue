<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="visible"
    width="80%"
    top="8vh">
    <el-form v-loading="formLoading" ref="dataForm" :model="dataForm" :size="size" label-width="120px"
             @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="0">一级菜单</el-radio>
          <el-radio :label="1">子菜单</el-radio>
          <el-radio :label="2">按钮/权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :rules="$rulesFilter({required:true, trigger: 'blur'})" :label="dataForm.type===2?'按钮名称':'菜单名称'"
                    prop="name">
        <el-input v-model="dataForm.name"/>
      </el-form-item>
      <el-form-item v-show="dataForm.type !== 0" label="父级菜单" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            ref="menuListTree"
            :data="menuList"
            :props="menuListTreeProps"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            node-key="id"
            style="height:300px;overflow-y:auto;"
            @current-change="menuListTreeCurrentChangeHandle"/>
        </el-popover>
        <el-input v-popover:menuListPopover v-model="dataForm.parentName" :readonly="true" placeholder="请选择父级菜单"
                  class="menu-list__input"/>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2"
                    :rules="$rulesFilter({required:true, validator: validateUrl, trigger: 'blur'})" label="菜单路由"
                    prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由"/>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" :rules="$rulesFilter({required: true, trigger: 'blur'})" label="前端组件"
                    prop="component">
        <el-input v-model="dataForm.component" placeholder="前端组件"/>
      </el-form-item>

      <el-form-item v-if="dataForm.type !== 2" :rules="$rulesFilter({required: true, trigger: 'blur'})" label="默认跳转地址"
                    prop="redirect">
        <el-input v-model="dataForm.redirect" placeholder="请输入路由参数 redirect"/>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 2" label="授权标识" prop="permissions">
        <el-input v-model="dataForm.permissions" placeholder="多个用逗号分隔, 如: user:list,user:create"/>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  :class="{ 'is-active': item === dataForm.icon }"
                  @click="iconActiveHandle(item)">
                  <svg-icon :icon-class="item"/>
                </el-button>
              </div>
            </el-popover>
            <el-input v-popover:iconListPopover v-model="dataForm.icon" :readonly="true" placeholder="菜单图标名称"
                      class="icon-list__input"/>
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="https://www.iconfont.cn" target="_blank">iconfont</a>描述
              </div>
              <i class="el-icon-warning"/>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="sort">
        <el-input-number v-model="dataForm.sort" :min="0" controls-position="right" label="排序号"/>
      </el-form-item>

      <el-form-item v-if="dataForm.type !== 2" label="是否路由菜单" prop="isRoute">
        <el-switch
          v-model="dataForm.isRoute"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>

      <el-form-item v-if="dataForm.type !== 2" label="隐藏路由" prop="hidden">
        <el-switch
          v-model="dataForm.hidden"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>

      <el-form-item v-if="dataForm.type !== 2" label="是否缓存路由" prop="keepAlive">
        <el-switch
          v-model="dataForm.keepAlive"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>

      <el-form-item v-if="dataForm.type !== 2" label="聚合路由" prop="alwaysShow">
        <el-switch
          v-model="dataForm.alwaysShow"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import mixinFormViewModule from '@/mixins/form-view-module'
    import * as API from '@/api/sys/menu'
    import Icon from '@/icons'

    export default {
        mixins: [mixinFormViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getInfoAPI: API.getMenuInfo, // 数据详情列表接口，API地址
                    addAPI: API.addMenu, // 新增接口，API地址
                    updateAPI: API.updMenu // 修改接口，API地址
                },

                dataForm: {
                    id: 0,
                    type: 0,
                    typeList: ['一级菜单', '子菜单', '按钮/权限'],
                    name: '',
                    pid: 0,
                    parentName: '',
                    url: '',
                    component: '',
                    permissions: '',
                    sort: 0,
                    icon: '',
                    isRoute: '',
                    hidden: '',
                    keepAlive: '',
                    isLeaf: '',
                    isUniapp: '',
                    alwaysShow: '',
                    redirect: '',
                    permsType: '',
                    ruleFlag: '',
                    iconList: []

                },
                menuList: [],
                menuListTreeProps: {
                    label: 'name',
                    children: 'children'
                },

                validateUrl: (rule, value, callback) => {
                    if (this.dataForm.type === 1 && !/\S/.test(value)) {
                        callback(new Error('菜单URL不能为空'))
                    } else {
                        callback()
                    }
                }
            }
        },
        created() {
            this.iconList = Icon.getNameList()
        },
        methods: {
            init(id) {
                this.dataForm.id = id || undefined
                // 获取菜单
                API.getMenuList().then(response => {
                    this.menuList = response.data
                    console.log(this.menuList)
                }).then(() => {
                    this.visible = true
                    this.$nextTick(() => {
                        this.$refs['dataForm'].resetFields()
                    })
                }).then(() => {
                    if (!this.dataForm.id) {
                        // 新增
                        this.menuListTreeSetCurrentNode()
                    } else {
                        // 修改
                        API.getMenuInfo(this.dataForm.id).then(res => {
                            this.dataForm = res.data
                            this.menuListTreeSetCurrentNode()
                        })
                    }
                })
            },
            // 菜单树选中
            menuListTreeCurrentChangeHandle(data, node) {
                this.dataForm.pid = data.id
                this.dataForm.parentName = data.name
            },
            // 菜单树设置当前选中节点
            menuListTreeSetCurrentNode() {
                this.$refs.menuListTree.setCurrentKey(this.dataForm.pid)
                this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
            },
            // 图标选中
            iconActiveHandle(iconName) {
                this.dataForm.icon = iconName
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const postData = Object.assign({}, this.dataForm)
                        postData.id = this.dataForm.id || undefined
                        //            delete postData.id;
                        delete postData.typeList
                        delete postData.parentName
                        delete postData.iconList

                        API[`${this.dataForm.id ? 'updMenu' : 'addMenu'}`](postData).then((data) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }

    &__icon-popover {
      max-width: 370px;
    }

    &__icon-list {
      height: 180px;
      overflow-y: auto;
      padding: 0;
      margin: -8px 0 0 -8px;

      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;

        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }

    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
