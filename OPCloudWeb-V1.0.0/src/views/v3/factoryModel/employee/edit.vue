<template>
    <div class="m-page-edit">
        <el-form
            :model="pageData.formData"
            ref="addpageRef"
            :rules="formRules"
            class="form"
            label-width="100px"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="人员代码" prop="employeeNbr">
                        <el-input placeholder="请输入人员代码" v-model="pageData.formData.employeeNbr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="人员名称" prop="employeeName">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.employeeName"
                            placeholder="请输入人员名称"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别">
                        <el-select
                            style="width:100%"
                            v-model="pageData.formData.gender"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option label="男" :value="1"></el-option>
                            <el-option label="女" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="mail">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.mail"
                            placeholder="请输入"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="电话" prop="phone">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.phone"
                            placeholder="请输入电话"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="紧急联系人" prop="emergency">
                        <el-input
                            filterable
                            v-model="pageData.formData.emergency"
                            placeholder="请输入紧急"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门代码" prop="deptNbr">
                        <el-input
                            placeholder="请选择部门代码"
                            @click.stop="dialogDepartment.show"
                            filterable
                            suffix-icon="el-icon-search"
                            v-model="pageData.formData.deptNbr"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门名称" prop="deptName">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.deptName"
                            clearable
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="班组代码" prop="shiftGroupNbr">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.shiftGroupNbr"
                            placeholder="请选择班组代码"
                            clearable
                            suffix-icon="el-icon-search"
                            @click.stop="dialogGroup.show"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="班组名称" prop="shiftGroupName">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.shiftGroupName"
                            clearable
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="班次代码" prop="shiftSliceNbr">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.shiftSliceNbr"
                            placeholder="请选择班次代码"
                            clearable
                            suffix-icon="el-icon-search"
                            @click.stop="dialogClass.show"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="班次名称" prop="shiftSliceName">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.shiftSliceName"
                            clearable
                            disabled
                        ></el-input>
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
        <!-- 开窗选择班组 -->
        <div class="fixedDialog">
            <el-dialog
                v-model="dialogGroup.reactiveData.visible"
                :destroy-on-close="true"
                width="1200px"
            >
                <template #title>
                    <dialog-title title="班组选择"></dialog-title>
                </template>
                <group-list
                    @row-click="dialogGroup.onConfirm"
                    ref="dialogGroup.innerRef"
                    :param="dialogGroup.reactiveData.param"
                />
            </el-dialog>
        </div>

       

        <!-- 部门 -->
        <div clas="fixedDialog">
            <el-dialog
                v-model="dialogDepartment.reactiveData.visible"
                :destroy-on-close="true"
                width="1200px"
            >
                <template #title>
                    <dialog-title title="部门选择"></dialog-title>
                </template>
                <department-list
                    @row-click="dialogDepartment.onConfirm"
                    ref="dialogDepartment.innerRef"
                    :param="dialogDepartment.reactiveData.param"
                ></department-list>
            </el-dialog>
        </div>

         <!-- 班次 -->
        <div clas="fixedDialog">
            <el-dialog
                v-model="dialogClass.reactiveData.visible"
                :destroy-on-close="true"
                width="1200px"
            >
                <template #title>
                    <dialog-title title="班次选择"></dialog-title>
                </template>
                <class-list
                    @row-click="dialogClass.onConfirm"
                    ref="dialogClass.innerRef"
                    :param="dialogClass.reactiveData.param"
                ></class-list>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BuzApi from "@/api/controller/employeeApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'
import departmentList from "../../windowSelect/departmentList.vue";
import groupList from "../../windowSelect/groupList.vue";
import classList from "../../windowSelect/classList.vue"

import useDialog from "@/views/v3/out/useDialog";

const props = defineProps(['param'])

const { showType, entity } = props.param

const formRules = reactive({
    employeeNbr: [{ required: true, message: "请输入人员代码", trigger: "blur" }],
    employeeName: [{ required: true,message: "请输入人员名称", trigger: "blur" }],
    // shiftGroupNbr: [{ required: true, message: "请选择班组代码", trigger: "blur" }],
    mail: [
        { message: "请输入邮箱", trigger: "blur" },
        {
            pattern: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/,
            message: "输入的邮箱不正确",
            trigger: "blur",
        }
    ],
    phone: [
        { message: "请输入电话号码" },
        {
            pattern: /^1[34578][0-9]{9}$/,
            message: "输入的手机号码不正确",
            trigger: "blur",
        },
    ],

});

let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});

const dialogDepartment = useDialog({

    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的

        dialogDepartment.reactiveData.visible = false;
        pageData.formData.deptNbr = _rows[0].deptNbr
        pageData.formData.deptName = _rows[0].deptName
    }
})

const dialogGroup = useDialog({

    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的

        dialogGroup.reactiveData.visible = false;
        pageData.formData.shiftGroupNbr = _rows[0].shiftGroupNbr
        pageData.formData.shiftGroupName = _rows[0].shiftGroupName
    }
})

const dialogClass = useDialog({

    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的

        dialogClass.reactiveData.visible = false;
        pageData.formData.shiftSliceNbr = _rows[0].shiftSliceNbr
        pageData.formData.shiftSliceName = _rows[0].shiftSliceName
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


const addpageRef = ref<any>(null
)

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
