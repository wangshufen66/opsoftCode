<template>
    <div class="m-page-edit">
        <el-form
            :model="pageData.formData"
            ref="addpageRef"
            :rules="formRules"
            label-width="100px"
            class="form"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="客户代码" prop="customerNbr">
                        <el-input placeholder="请输入客户代码" v-model="pageData.formData.customerNbr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户名称" prop="customerName">
                        <el-input
                            filterable
                            allow-create
                            v-model="pageData.formData.customerName"
                            placeholder="请输入客户名称"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="简称" prop="shortName">
                        <el-input v-model="pageData.formData.shortName" placeholder="请输入简称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="英文简称" prop="englishShortName">
                        <el-input
                            v-model="pageData.formData.englishShortName"
                            placeholder="请输入英文简称"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地区" prop="address">
                        <el-cascader
                            style="width: 100%"
                            v-model="pageData.formData.provinces"
                            :options="cityMap"
                        ></el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="详细地址" prop="detailAddress">
                        <el-input v-model="pageData.formData.detailAddress" placeholder="请输入详细地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系人" prop="contactName">
                        <el-input v-model="pageData.formData.contactName" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系电话" prop="contactPhone">
                        <el-input v-model="pageData.formData.contactPhone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="pageData.formData.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="传真" prop="fax">
                        <el-input v-model="pageData.formData.fax" placeholder="请输入传真"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="description">
                        <el-input
                            type="textarea"
                            maxlength="400"
                            rows="3"
                            placeholder="请输入备注"
                            v-model="pageData.formData.description"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BuzApi from "@/api/controller/customerApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'
import cityMap from "@/assets/pc-code.json";

const props = defineProps(['param'])

const { showType, entity } = props.param

const formRules = reactive({
    customerNbr: [{ required: true, message: "请输入客户代码", trigger: "blur" }],
    customerName: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
    email: [
        { message: "请输入邮箱", },
        {
            pattern: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/,
            message: "输入的邮箱不正确",
            trigger: "blur",
        }
    ],
    contactPhone: [
        { message: "请输入电话号码" },
        {
            pattern: /^1[\d]{10}$/i,
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
