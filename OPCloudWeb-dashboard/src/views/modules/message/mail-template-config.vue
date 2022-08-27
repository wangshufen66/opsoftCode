<template>
  <el-dialog
    :title="'邮件配置'"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="visible"
    width="60%"
    top="8vh">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item prop="smtp" :rules="$rulesFilter({required:true})" label="邮件配置">
        <el-input v-model="dataForm.smtp" placeholder="邮件配置"></el-input>
      </el-form-item>
      <el-form-item prop="port" :rules="$rulesFilter({required:true})" label="端口号">
        <el-input v-model="dataForm.port" placeholder="端口号"></el-input>
      </el-form-item>
      <el-form-item prop="username" :rules="$rulesFilter({required:true})" label="邮箱账号">
        <el-input v-model="dataForm.username" placeholder="邮箱账号"></el-input>
      </el-form-item>
      <el-form-item prop="password" :rules="$rulesFilter({required:true})" label="邮箱密码">
        <el-input type="password" v-model="dataForm.password" placeholder="邮箱密码"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
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
                    getInfoAPI: API.config, // 数据详情列表接口，API地址
                    addAPI: API.saveConfig, // 新增接口，API地址
                    updateAPI: API.update // 修改接口，API地址
                },
                visible: false,
                dataForm: {
                    smtp: '',
                    port: '',
                    username: '',
                    password: ''
                }
            }
        },
        computed: {},
        methods: {}
    }
</script>
