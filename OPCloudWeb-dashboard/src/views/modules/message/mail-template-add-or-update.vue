<template>
    <el-dialog
      :title="!dataForm.id ? '新增': '修改'"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="visible"
      width="60%"
      top="8vh">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item prop="name" label="名称">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="subject" label="主题">
        <el-input v-model="dataForm.subject" placeholder="主题"></el-input>
      </el-form-item>
      <el-form-item prop="content" label="内容">
        <wangeditor :getEditConts="getEditConts"></wangeditor>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
    import wangeditor from '@/components/wangeditor'
    import mixinFormViewModule from '@/mixins/form-view-module'
    import * as API from '@/api/sys/mailtemplate'
    export default {
        mixins: [mixinFormViewModule],
        data() {
            return {

                mixinViewModuleOptions: {
                    getInfoAPI: API.info, // 数据详情列表接口，API地址
                    addAPI: API.add, // 新增接口，API地址
                    updateAPI: API.update // 修改接口，API地址
                },
                visible: false,
                dataForm: {
                    id: '',
                    name: '',
                    subject: '',
                    content: ''
                }
            }
        },
        computed: {},
        components: {
            wangeditor
        },
        methods: {
            //获取编辑器内容 格式为html
            getEditConts(value) {
                this.dataForm.content = value;
            },

        }
    }
</script>
