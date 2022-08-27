<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="formRef" :rules="formRules" label-width="120px">
            <el-form-item label="单位代码" prop="measureNbr">
                <el-input v-model="pageData.formData.measureNbr"></el-input>
            </el-form-item>

            <el-form-item label="单位名称" prop="measureName">
                <el-input v-model="pageData.formData.measureName"></el-input>
            </el-form-item>

            <el-form-item label="基准计量单位" prop="referenceMeasureUnit">
                <el-select
                    v-model="pageData.formData.referenceMeasureUnit"
                    placeholder="请选择"
                    style="width:100%"
                >
                    <el-option
                        v-for="item in unitMeasureList"
                        :key="item.id"
                        :label="item.measureName"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="单位换算率" prop="unitConversionRate">
                <el-input-number
                    v-model="pageData.formData.unitConversionRate"
                    :precision="4"
                    :step="1"
                    :min="0"
                />
            </el-form-item>

            <el-form-item label="分组名称" prop="groupId">
                <el-input v-model="pageData.formData.groupName" disabled></el-input>
            </el-form-item>
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
        </el-form>
        <!-- <div>{{ JSON.stringify(EnumMap) }}</div>-->
        <!-- <div>{{ JSON.stringify(pageData.formData) }}</div> -->
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import BuzApi from "@/api/controller/unitMeasureApi";
import UnitMeasureGroupApi from "@/api/controller/unitMeasureGroupApi";
import UnitMeasureApi from "@/api/controller/unitMeasureApi";
import CommonApi from "@/api/controller/commonApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'

import useDialog from "@/views/v3/out/useDialog";


var EnumMap = {
    isDisabled: [{
        text: "启用",
        value: 0
    }, {
        text: "禁用",
        value: 1
    }]
}

const unitMeasureList = ref([])

const props = defineProps(['param'])

const { showType = 0, entity } = props.param

const formRef = ref<any>(null)
const formRules = reactive({
    measureNbr: [{ required: true, message: "该字段必填", trigger: "blur" }],
    measureName: [{ required: true, message: "该字段必填", trigger: "blur" }],
    isDisabled: [{ required: true, message: "该字段必填", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        ...props.param.entity,
        groupName: props.param.entity.groupName || "顶级"
    }
});

const getFormData = async () => {
    if (props.param.id.length > 0) {
        var res = await BuzApi.GetOne({
            id: props.param.entity.id,
        });

        pageData.formData = res.data


        pageData.formData.groupName = props.param.entity.groupName || "顶级"
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
        pageData.formData.classifyId = _rows[0].id
        pageData.formData.classifyName = _rows[0].categoryName
    }
})

const dialog2 = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    },
    _onConfirm: (_rows) => {
        console.log(_rows, '====_onConfirm====')
        dialog2.reactiveData.visible = false;
        pageData.formData.groupId = _rows[0]._value
        pageData.formData.groupName = _rows[0]._text
    }
})


const submit = () => {
    return new Promise(async (resolve, reject) => {
        formRef.value.validate(async (valid: boolean) => {
            console.log(valid)
            if (!valid) return;
            var postParam = {
                ...pageData.formData,
                groupId: pageData.formData.groupId == -1 ? null : pageData.formData.groupId
            }
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

    UnitMeasureApi.GetList({
        groupId: props.param.entity.groupId
    }).then(res => {
        unitMeasureList.value = res.data
    })
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

@import "@/styles/modules/page_edit_new.scss";
