<template>
    <el-dialog
      :title=" '短信配置'"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="visible"
      width="60%"
      top="8vh">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="180px">
      <el-form-item :rules="$rulesFilter({required:true})" prop="aliyunAccessKeyId" label="aliyunAccessKeyId">
        <el-input v-model="dataForm.aliyunAccessKeyId" placeholder="请输入短信应用aliyunAccessKeyId"></el-input>
      </el-form-item>
      <el-form-item :rules="$rulesFilter({required:true})" prop="aliyunAccessKeySecret" label="aliyunAccessKeySecret">
        <el-input v-model="dataForm.aliyunAccessKeySecret" placeholder="请输入短信应用aliyunAccessKeySecret"></el-input>
      </el-form-item>
      <el-form-item :rules="$rulesFilter({required:true})" prop="aliyunSignName" label="短信签名">
        <el-input v-model="dataForm.aliyunSignName" placeholder="请输入短信签名"></el-input>
      </el-form-item>
      <el-form-item :rules="$rulesFilter({required:true})" prop="aliyunTemplateCode" label="短信模板ID">
        <el-input v-model="dataForm.aliyunTemplateCode" placeholder="请输入短信模板ID"></el-input>
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
    import * as API from '@/api/sys/sms'
    export default {
        mixins: [mixinFormViewModule],
        data() {
            return {
                visible: false,
                mixinViewModuleOptions: {
                    getInfoAPI: API.config, // 数据详情列表接口，API地址
                    addAPI: API.saveConfig, // 新增接口，API地址
                    updateAPI: API.update // 修改接口，API地址
                },
                dataForm: {
                    aliyunAccessKeyId: '',
                    aliyunAccessKeySecret: '',
                    aliyunSignName: '',
                    aliyunTemplateCode: ''
                }
            }
        },
        computed: {},
        methods: {
        }
    }
</script>
