<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addpageRef" :rules="formRules" label-width="120px">
            <el-form-item label="班次代码" prop="shiftSliceNbr">
                <el-input v-model="pageData.formData.shiftSliceNbr"></el-input>
            </el-form-item>

            <el-form-item label="班次名称" prop="shiftSliceName">
                <el-input v-model="pageData.formData.shiftSliceName"></el-input>
            </el-form-item>

            <el-form-item label="开始时间" prop="startTime">
                <el-time-picker style="width:100%" v-model="pageData.formData.startTime"></el-time-picker>
            </el-form-item>

            <el-form-item label="结束时间" prop="endTime">
                <el-time-picker style="width:100%" v-model="pageData.formData.endTime"></el-time-picker>
            </el-form-item>

            <el-form-item label="备注" prop="description">
                <el-input type="textarea" maxlength="400"  rows="3" placeholder="请输入备注" v-model="pageData.formData.description"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BuzApi from "@/api/controller/classApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'

const props = defineProps(['param'])

const { showType, entity } = props.param

const formRules = reactive({
    shiftSliceNbr: [{ required: true, message: "请输入班次代码", trigger: "blur" }],
    shiftSliceName: [{ required: true, message: "请输入班次名称", trigger: "blur" }],
    endTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
    startTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});



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
