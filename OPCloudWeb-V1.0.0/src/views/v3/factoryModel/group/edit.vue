<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addpageRef" :rules="formRules" label-width="100px">
            <el-form-item label="班组代码" prop="shiftGroupNbr">
                <el-input v-model="pageData.formData.shiftGroupNbr"></el-input>
            </el-form-item>
            <el-form-item label="班组名称" prop="shiftGroupName">
                <el-input v-model="pageData.formData.shiftGroupName"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="description">
                <el-input
                    type="textarea"
                    maxlength="400"
                    rows="3"
                    placeholder="请输入备注"
                    v-model="pageData.formData.description"
                ></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BuzApi from "@/api/controller/ShiftGroupApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'

const props = defineProps(['param'])

const { showType, entity } = props.param

const formRules = reactive({
    shiftGroupNbr: [{ required: true, message: "请输入班组代码", trigger: "blur" }],
    shiftGroupName: [{ required: true, message: "请输入班组名称", trigger: "blur" }],
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

const addpageRef = ref(null)

function submit() {

    return new Promise(async (resolve, reject) => {
        addpageRef.value.validate(async (valid: boolean) => {
            if (!valid) return;
            var postParam = { ...pageData.formData }
            postParam.memberList = tableOption.tableData
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
