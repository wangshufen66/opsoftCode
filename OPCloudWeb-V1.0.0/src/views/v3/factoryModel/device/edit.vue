<template>
    <div class="m-page-edit">
        <el-form
            :model="pageData.formData"
            ref="addpageRef"
            :rules="formRules"
            label-width="100px"
            class="form"
        >
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="设备代码" prop="equipmentNbr">
                        <el-input placeholder="请输入设备代码" v-model="pageData.formData.equipmentNbr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="设备名称" prop="equipmentName">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.equipmentName"
                            placeholder="请输入设备名称"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item prop="categoryNbr" label="设备类别">
                        <el-input
                        suffix-icon="el-icon-search"
                            filterable
                            allow-create
                            @click.stop="dialog.show"
                            v-model="pageData.formData.categoryNbr"
                        ></el-input>
             
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="设备型号">
                        <el-input v-model="pageData.formData.categoryName" disabled></el-input>
                       
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="部门代码">
                        <el-input
                        suffix-icon="el-icon-search"
                            @click.stop="dialogDepartment.show"
                            v-model="pageData.formData.deptNbr"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="部门名称">
                        <el-input v-model="pageData.formData.deptName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="description">
                        <el-input
                            type="textarea"
                            maxlength="400"  rows="3" placeholder="请输入备注"
                            v-model="pageData.formData.description"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <!-- 设备开窗选择 -->
    <div clas="fixedDialog">
        <el-dialog v-model="dialog.reactiveData.visible" :destroy-on-close="true" width="700px">
            <template #title>
                <dialog-title title="设备类别选择"></dialog-title>
            </template>
            <device-list
                @row-click="dialog.onConfirm"
                ref="dialog.innerRef"
                :param="dialog.reactiveData.param"
            ></device-list>
        </el-dialog>
    </div>
    <!-- 部门 -->
    <div clas="fixedDialog">
        <el-dialog
            v-model="dialogDepartment.reactiveData.visible"
            :destroy-on-close="true"
            width="700px"
        >
            <template #title>
                <dialog-title title="部门选择"></dialog-title>
            </template>
            <department-list
                @row-click="dialogDepartment.onConfirm"
                ref="dialog.innerRef"
                :param="dialogDepartment.reactiveData.param"
            ></department-list>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BuzApi from "@/api/controller/deviceApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs';
import deviceList from "../../windowSelect/deviceList.vue";

import departmentList from "../../windowSelect/departmentList.vue";

// import openWindow from "@/views/v3/components/openWindow.vue";

import useDialog from "@/views/v3/out/useDialog";

const props = defineProps(['param'])

const { showType, entity } = props.param

const formRules = reactive({
    equipmentNbr: [{ required: true, message: "请输入设备代码", trigger: "blur" }],
    equipmentName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});
const deviceCatepory = reactive({
    categoryNbr: '',
    categoryName: ''
})
const _tableColums = [
    {
        "label": "设备型号",
        "prop": "categoryName",
        "minWidth": 100
    },
    {
        "label": "设备类别",
        "prop": "categoryNbr",
        "minWidth": 100
    },

]
const clickWindow = (val) => {
    deviceCatepory.categoryNbr = val.categoryNbr
    deviceCatepory.categoryName = val.categoryName

}

const openSelectRef = ref(null);
const openSelectDialog = reactive({
    visible: false,
    param: {
        masterSearchForm: {
            //必须的搜索条件
        }
    }
})
const dialog = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    },
    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的

        dialog.reactiveData.visible = false;
        pageData.formData.categoryNbr = _rows[0].categoryNbr
        pageData.formData.categoryName = _rows[0].categoryName
    }
})

const dialogDepartment = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    },
    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的

        dialogDepartment.reactiveData.visible = false;
        pageData.formData.deptNbr = _rows[0].deptNbr
        pageData.formData.deptName = _rows[0].deptName
    }
})


const tableOption = reactive({
    tableData: [],
    tableColums: [],
    selectionCol: false,
    paging: false,
    total: 0,
    tableLoading: false,
    noTableRight: false,
});


const addpageRef = ref<any>(null)

function submit() {

    return new Promise(async (resolve, reject) => {
        addpageRef.value.validate(async (valid: boolean) => {
            if (!valid) return;
            var postParam = { ...pageData.formData }
            // postParam.memberList = tableOption.tableData
            var res = await BuzApi.SaveOrUpdate(postParam);
            if (res.code == 200) {
                messageAlert('success', '保存成功')
                resolve(true);
            }
            else {
                messageAlert('error', res.msg)
            }
        });
    })
};


defineExpose({
    submit
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>
