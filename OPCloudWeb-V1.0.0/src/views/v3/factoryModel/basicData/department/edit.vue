<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="formRef" :rules="formRules" label-width="120px">
            <el-form-item label="部门代码" prop="deptNbr">
                <el-input v-model="pageData.formData.deptNbr"></el-input>
            </el-form-item>

            <el-form-item label="部门名称" prop="deptName">
                <el-input v-model="pageData.formData.deptName"></el-input>
            </el-form-item>

            <el-form-item label="所属分组" prop="parentDeptId">
                <el-input
                    v-model="pageData.formData.parentDeptName"
                    @click.stop="dialog2.show"
                    suffix-icon="el-icon-search"
                ></el-input>
            </el-form-item>

            <el-form-item label="负责人" prop="directorId">
                <el-input
                    v-model="pageData.formData.directorName"
                    @click.stop="dialog.show"
                    suffix-icon="el-icon-search"
                ></el-input>
            </el-form-item>

            <el-form-item label="备注" prop="description">
                <el-input
                    type="textarea"
                    rows="3"
                    show-word-limit
                    maxlength="400"
                    v-model="pageData.formData.description"
                ></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="fixedDialog">
        <el-dialog
            v-model="dialog.reactiveData.visible"
            title="负责人选择"
            :destroy-on-close="true"
            width="1400px"
        >
            <employee-list
                style="height:600px"
                @row-click="dialog.onConfirm"
                ref="dialog.innerRef"
                :param="dialog.reactiveData.param"
            />
        </el-dialog>
    </div>

    <div class="fixedDialog">
        <el-dialog
            v-model="dialog2.reactiveData.visible"
            title="部门选择"
            :destroy-on-close="true"
            width="1400px"
        >
            <dept-select
                style="height:600px"
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

import BuzApi from "@/api/controller/departmentApi";
import CommonApi from "@/api/controller/commonApi";
import { getStorage, messageAlert } from '@/utils/utils';

import deptSelect from "@/views/v3/windowSelect/departmentSelect/index.vue";
import employeeList from "@/views/v3/windowSelect/employeeList.vue";

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
    deptNbr: [{ required: true, message: "该字段必填", trigger: "blur" }],
    materialName: [{ required: true, message: "该字段必填", trigger: "blur" }],
    isDisabled: [{ required: true, message: "该字段必填", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        parentDeptId: '',
        parentDeptName: '',
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
        console.log(_rows, '=======_rows=======')
        dialog.reactiveData.visible = false;
        pageData.formData.directorId = _rows[0]._value
        pageData.formData.directorName = _rows[0]._text
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
        pageData.formData.parentDeptId = _rows[0]._value
        pageData.formData.parentDeptName = _rows[0]._text
        pageData.formData.parentDeptNbr = _rows[0].code
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

})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

@import "@/styles/modules/page_edit_new.scss";
