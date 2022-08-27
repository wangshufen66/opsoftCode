<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="formRef" :rules="formRules" label-width="120px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="不良代码" prop="badReasonNbr">
                        <el-input v-model="pageData.formData.badReasonNbr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="不良名称" prop="badReasonName">
                        <el-input v-model="pageData.formData.badReasonName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="所属分组" prop="treeGroupId">
                        <el-input
                            v-model="pageData.formData.treeGroupName"
                            @click.stop="dialog2.show"
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

    <div class="fixedDialog">
        <el-dialog
            v-model="dialog2.reactiveData.visible"
            title="所属分组"
            :destroy-on-close="true"
            width="1400px"
        >
            <badReason-group-select
                style="height:600px;"
                @row-click="dialog2.onConfirm"
                ref="dialog.innerRef"
                :param="dialog2.reactiveData.param"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import BuzApi from "@/api/controller/badReasonApi";
import BadReasonGroupApi from "@/api/controller/badReasonGroupApi";
import CommonApi from "@/api/controller/commonApi";
import { getStorage, messageAlert } from '@/utils/utils';
import badReasonGroupSelect from "@/views/v3/windowSelect/badReasonGroupSelect/index.vue";

import useDialog from "@/views/v3/out/useDialog";
import _Row from "element-plus/lib/components/row";

var EnumMap = {
    isDisabled: [{
        text: "启用",
        value: 0
    }, {
        text: "禁用",
        value: 1
    }]
}

var badReasonGroupList = ref([])


const props = defineProps(['param'])

const { showType = 0, entity } = props.param

const formRef = ref<any>(null)
const formRules = reactive({
    badReasonNbr: [{ required: true, message: "该字段必填", trigger: "blur" }],
    badReasonName: [{ required: true, message: "该字段必填", trigger: "blur" }],
    isDisabled: [{ required: true, message: "该字段必填", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});


const getFormData = async () => {
    if (props.param.id.length > 0) {
        var res = await BuzApi.GetOne({
            id: props.param.entity.id,
        });

        pageData.formData = res.data

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
        dialog2.reactiveData.visible = false;
        console.log(_rows, '=======_rows=======')
        pageData.formData.treeGroupId = _rows[0]._value
        pageData.formData.treeGroupName = _rows[0]._text
        pageData.formData.treeGroupNumber = _rows[0].code
    }
})


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
        })
    });
};

defineExpose({
    submit
})
onMounted(() => {
    getFormData();

    BadReasonGroupApi.GetList({}).then(res => {

        badReasonGroupList.value = res.data
    })

})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

@import "@/styles/modules/page_edit_new.scss";
