<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="formRef" :rules="formRules" label-width="120px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="pageData.formData.code"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="pageData.formData.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="父级" prop="title">
                        <el-input disabled v-model="pageData.formData.parentName"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="备注" prop="title">
                        <el-input
                            v-model="pageData.formData.description"
                            type="textarea"
                            rows="3"
                            show-word-limit
                            maxlength="400"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <!-- <div>{{ JSON.stringify(pageData.formData) }}</div> -->
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import BuzApi from "@/api/controller/unitMeasureGroupApi";
import CommonApi from "@/api/controller/commonApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'


const props = defineProps(['param'])

const { showType = 0, entity = {} } = props.param

const formRules = reactive({
    code: [{ required: true, message: "请输入设备代码", trigger: "blur" }],
    name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        id: '',
        ...props.param.entity
    }
});

const getParentName = (_fullName) => {
    _fullName = _fullName || ''
    var _fullNameArr = _fullName.split(',')
    _fullNameArr.pop()
    return _fullNameArr.pop() || '顶级'
}

const getFormData = async () => {
    // alert(JSON.stringify(props.param.entity))
    if (props.param.id.length > 0) {
        var res = await BuzApi.GetOne({
            id: props.param.entity.id,
        });
        pageData.formData = {
            ...res.data,
            parentName: getParentName(res.data.fullName)
        }
    }
};

const openSelectRef = ref(null);
const openSelectDialog = reactive({
    visible: false,
    param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    }
})

const OpenSelectDialogFunc = function (dialog, dialogRef) {
    return {
        show: (row, index = 0) => {
            dialog.visible = true
        },
        hide: () => {
            dialog.visible = false
        },
        onConfirm: () => {
            var { rows, rowIndex } = dialogRef.value.getResult()
            dialog.visible = false;
            pageData.formData.name = rows[0].name + '_开窗回调'
        },
    }
}
const openSelectDialogFunc = OpenSelectDialogFunc(openSelectDialog, openSelectRef)

const formRef = ref<any>(null)
const submit = () => {



    return new Promise(async (resolve, reject) => {


        formRef.value.validate(async (valid: boolean) => {
            console.log(valid)
            if (!valid) return;

            var postParam = { ...pageData.formData }
            var res = await BuzApi.SaveOrUpdate(postParam);
            if (res.code == 200) {
                messageAlert('success', '保存成功')
                resolve(true);
            } else {
                messageAlert('error', res.msg)
            }
        });



    });



};
defineExpose({
    submit
})
onMounted(() => {
    getFormData();
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

