<template>
  <el-dialog
    :title="'短信发送'"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="visible"
    top="8vh">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item prop="mobile" :rules="$rulesFilter({required:true,type:'mobile'})" label="手机号">
        <el-input v-model="dataForm.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="params" :rules="$rulesFilter({required:true})" label="参数">
        <el-input v-model="dataForm.params" placeholder="如：{code：123456}"></el-input>
      </el-form-item>
      <el-form-item prop="templateCode" :rules="$rulesFilter({required:true})" label="短信模板Code">
        <el-input v-model="dataForm.templateCode" placeholder="如：SMS_175535743"></el-input>
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
    import * as API from '@/api/sys/sms'
    export default {
        mixins: [mixinFormViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getInfoAPI: API.info, // 数据详情列表接口，API地址
                    addAPI: API.send, // 新增接口，API地址
                    updateAPI: API.update // 修改接口，API地址
                },
                visible: false,
                dataForm: {
                    mobile: '',
                    params: '',
                    templateCode: '',
                }
            }
        },

        methods: {}
    }
</script>
