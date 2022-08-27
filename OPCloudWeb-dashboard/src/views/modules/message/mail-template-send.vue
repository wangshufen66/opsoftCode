<template>
  <el-dialog
    :title="'发送邮件'"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="visible"
    top="8vh">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item prop="mailTo" label="收件人">
        <el-input v-model="dataForm.mailTo" placeholder="收件人"></el-input>
      </el-form-item>
      <el-form-item prop="mailCc" label="抄送">
        <el-input v-model="dataForm.mailCc" placeholder="抄送"></el-input>
      </el-form-item>
      <el-form-item prop="params" label="模板参数">
        <el-input v-model="dataForm.params" placeholder="模板参数"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
    import mixinFormViewModule from '@/mixins/form-view-module'
    import * as API from '@/api/sys/mailtemplate'
    export default {
        mixins: [mixinFormViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getInfoAPI: API.info, // 数据详情列表接口，API地址
                    addAPI: API.send, // 新增接口，API地址
                    updateAPI: API.send // 修改接口，API地址
                },
                visible: false,
                dataForm: {
                    id: '',
                    mailTo: '',
                    mailCc: '',
                    params: ''
                }
            }
        },
        methods: {

        }
    }
</script>
