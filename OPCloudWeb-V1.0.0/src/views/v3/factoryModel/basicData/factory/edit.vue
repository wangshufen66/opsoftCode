<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="formRef" :rules="formRules" label-width="120px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="所属父级" prop="parentId">
                        <el-input disabled v-model="pageData.formData.parentName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="类型" prop="modelType">
                        <el-select
                            v-model="pageData.formData.modelType"
                            placeholder="请选择"
                            style="width:100%"
                            :disabled="pageData.formData.id != '' && pageData.formData.id != null"
                        >
                            <el-option
                                v-for="item in EnumMap.modelType.filter(x => x.value > pageData.formData.parentModelType)"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="代码" prop="modelNbr">
                        <el-input v-model="pageData.formData.modelNbr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="名称" prop="modelName">
                        <el-input
                            v-if="pageData.formData.modelType != 40"
                            v-model="pageData.formData.modelName"
                        ></el-input>
                        <el-input
                            v-if="pageData.formData.modelType == 40"
                            v-model="pageData.formData.modelName"
                            @click.stop="dialog.show({ row: null })"
                            suffix-icon="el-icon-search"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="description">
                        <el-input
                            type="textarea"
                            maxlength="400"
                            placeholder="请输入备注..."
                            show-word-limit
                            rows="3"
                            v-model="pageData.formData.description"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div class="fixedDialog dialog_body_padding_5">
        <el-dialog
            v-model="dialog.reactiveData.visible"
            title="开窗选择"
            :destroy-on-close="true"
            width="1000px"
        >
            <material-category-list
                style="height: 500px;"
                @row-click="dialog.onConfirm"
                ref="dialog.innerRef"
                :param="dialog.reactiveData.param"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BuzApi from "@/api/controller/facotryApi";
import CommonApi from "@/api/controller/commonApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'

import materialCategoryList from "@/views/v3/windowSelect/deviceWithEmployeeSelect.vue";

import useDialog from "@/views/v3/out/useDialog";
import _Row from "element-plus/lib/components/row";

var EnumMap = {
    isDisabled: [{
        text: "启用",
        value: 0
    }, {
        text: "禁用",
        value: 1
    }],
    modelType: [{
        text: "区域",
        value: 10,
    }, {
        text: "车间",
        value: 20
    }, {
        text: "产线",
        value: 30
    }, {
        text: "加工单元",
        value: 40
    }]
}

const props = defineProps(['param'])

const { showType = 0, entity } = props.param

const formRef = ref<any>(null)
const formRules = reactive({
    modelNbr: [{ required: true, message: "该字段必填", trigger: "blur" }],
    modelName: [{ required: true, message: "该字段必填", trigger: "blur" }],
    isDisabled: [{ required: true, message: "该字段必填", trigger: "blur" }],
    modelType: [{ required: true, message: "该字段必填", trigger: "blur" }]
});

let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});


watch(() => pageData.formData.modelType, (v) => {
    if (v != 40) {
        pageData.formData._unitId = null
        pageData.formData._unitName = null
        pageData.formData._unitType = ''

        pageData.formData.modelName = ''
    }
})


const getParentName = (_fullName) => {
    _fullName = _fullName || ''
    var _fullNameArr = _fullName.split(',')
    _fullNameArr.pop()
    return _fullNameArr.pop() || '顶级'
}

const getFormData = async () => {
    if (props.param.id.length > 0) {
        var res = await BuzApi.GetOne({
            id: props.param.id,
        });
        pageData.formData = res.data
        pageData.formData.parentName = getParentName(res.data.fullName)
        pageData.formData.parentModelType = res.data.modelType - 1

        pageData.formData._unitId = null
        pageData.formData._unitName = null
        pageData.formData._unitType = 0


    }
};

const dialog = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    },
    _onConfirm: (_rows) => {

        dialog.reactiveData.visible = false;
        pageData.formData._unitId = _rows[0]._value
        pageData.formData._unitName = _rows[0]._text
        pageData.formData._unitType = _rows[0]._unitType

        pageData.formData.modelName = _rows[0]._text


    }
})



const submit = () => {
    return new Promise(async (resolve, reject) => {
        formRef.value.validate(async (valid: boolean) => {
            console.log(valid)
            if (!valid) return;
            var postParam = { ...pageData.formData }


            if (pageData.formData.modelType == 40) {
                if (pageData.formData._unitType == 'device') {

                    postParam.equipmentId = pageData.formData._unitId
                    postParam.employeeId = ''
                }
                if (pageData.formData._unitType == 'employee') {

                    postParam.employeeId = pageData.formData._unitId
                    postParam.equipmentId = ''
                }
            }

            pageData.formData._unitId = null
            pageData.formData._unitName = null
            pageData.formData._unitType = ''

            delete postParam["_unitId"]
            delete postParam["_unitName"]
            delete postParam["_unitType"]
            delete postParam["createTime"]
            delete postParam["updateTime"]

            var res = await BuzApi.SaveOrUpdate(postParam);
            if (res.code == 200) {
                messageAlert('success', '保存成功')
                resolve(true);
            } else {
                messageAlert('error', res.msg)
            }
        })
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

@import "@/styles/modules/page_edit_new.scss";
