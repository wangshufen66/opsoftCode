<template>
    <div class="productin-start">
        <el-form :inline="true" class="top-search">
            <el-form-item label="生产订单">
                <el-input clearable  v-model.trim="searchForm.icmoNumber"  @keyup.enter="onSearch"></el-input>
            </el-form-item>
            <el-form-item label="产品名称">
                <el-input  clearable v-model.trim="searchForm.productName"  @keyup.enter="onSearch"></el-input>
            </el-form-item>
            <el-form-item label="工序名称">
                <el-input  clearable v-model.trim="searchForm.processName" ></el-input>
            </el-form-item>
            <el-button @click="onSearch" size="small" type="primary" plain icon="el-icon-search">查询</el-button>
        </el-form>
        <table-extend
            v-bind="tableOption"
            @pageSizeChange="pageSizeChange"
            @currentChange="currentChange"
        >
            <template #operatColumn>
                <el-table-column label="操作" fixed="right">
                    <template #default="scope">
                        <el-button type="text" size="small" @click="onAdjust(scope.row)">调整</el-button>
                    </template>
                </el-table-column>
            </template>
        </table-extend>
        <el-dialog v-model="dialogVisible" @close="dialogClosed" destroy-on-close width="620px">
            <template v-slot:title>
                <dialog-title title="委外数量调整"></dialog-title>
            </template>
            <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="130px">
                <el-form-item label="委外计划单号">
                    <el-input v-model="dataForm.planNumber" maxlength="32" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="委外计划数量">
                    <el-input v-model.number="dataForm.planOutQty" maxlength="32" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="新委外计划数量" prop="newQuantity">
                    <el-input v-model.number="dataForm.newQuantity" maxlength="32" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="mark">
                    <el-input
                        type="textarea"
                        v-model="dataForm.mark"
                        maxlength="50"
                        clearable
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="调整数量">
                    <el-input v-model="dataForm.adjustQuantity" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="调整人">
                    <el-input v-model="nickName" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="调整时间">
                    <el-input v-model="dataForm.currentTime" clearable disabled></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmitForm">保 存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import tableColums from '@/config/tableConfig/adjustRecord/outplan';
import { getOutsourceProcess, adjustOutsourceProcess } from "@/api/homeApi/index"
import { getStorage, messageAlert } from "@/utils/utils"
import dayjs from 'dayjs'

import { nextTick } from 'process';
const tableOption = reactive({
    tableData: [],
    tableColums,
    selectionCol: true,
    paging: true,
    total: 0,
    tableLoading: false,
    noTableRight: false,
});
const dataForm = reactive({
    id: "",// 表单id
    icmoNumber: "",//  生产订单号
    planNumber: "", // 委外计划单号
    processNumber: "", // 工序代码
    processName: "", // 工序名称
    productNumber: "", // 产品代码
    productName: "", // 产品名称
    planOutQty: "", // 计划数量
    actualOutQty: "", // 发出总数
    price: "", // 单价
    amount: "",//  金额
    status: "", // 状态
    supplyNumber: "", // 供应商代码
    supplyName: "", // 供应商名称
    deptNumber: "",//  申请部门代码
    deptName: "", // 申请部门名称
    planOutTimeStart: "",
    newQuantity: "",
    mark: "",
    adjusterName: "",
    adjustQuantity: '',//调整数量
    timer: '',
    currentTime: ''

});
onMounted(() => {
    dataForm.timer = setInterval(() => {
        dataForm.currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
    }, 1000)
})
onUnmounted(() => {
    if (dataForm.timer) {
        clearInterval(dataForm.timer);
    }
})

const nickName = ref<any>("")
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//表单ref
const formRef = ref<any>(null)
const pagination = reactive({
    current_page: 1,
    page_size: 15,
});

// 表格pagesize
function pageSizeChange(options): void {
    const { pageSize } = options;
    pagination.page_size = pageSize as number;
    getDataList();
}
// 表格页码切换
function currentChange(options): void {
    const { pageIndex } = options;
    pagination.current_page = pageIndex as number;
    getDataList();
}
const formRules = reactive({
    newQuantity: [{
        required: true, message: '请输入的新的委外数量',
    },
        //{ type: 'number', message: '输入的委外数量必须为数字形式' }
    ],
    mark: [{ required: true, message: "请输入调整记录" }]
})
watch(() => dataForm.newQuantity, (newVal, oldVal) => {
    if (isNaN(parseInt(dataForm.newQuantity))) {
        return
    } else {
        dataForm.adjustQuantity = Number(dataForm.newQuantity) - Number(dataForm.planOutQty)
    }
})
const searchForm = reactive({
    productName:undefined,
    processName:undefined,
    icmoNumber:undefined
});
// 获取数据
async function getDataList() {
    tableOption.tableLoading = true;
    const params = {
        ...searchForm,
        ...pagination,
    };
    const res = await getOutsourceProcess(params);
    const { code, data } = res;
    if (code === 200) {
        tableOption.tableData = data.records;
        tableOption.total = data.total;
    }
    tableOption.tableLoading = false;
}
async function onAdjust(row: any) {
    dialogVisible.value = true
    nextTick(() => {
        dataForm.planNumber = row.planNumber
        dataForm.planOutQty = row.planOutQty
        dataForm.id = row.id
        dataForm.adjustQuantity = row.adjustQuantity
        nickName.value = getStorage("nickName")
    })


}
function onSubmitForm() {
    formRef.value.validate(async (valid: boolean) => {
        if (!valid) return
        const params = {
            id: dataForm.id,
            newQuantity: dataForm.newQuantity,
            adjustQuantity: dataForm.adjustQuantity,
            mark: dataForm.mark,
            adjusterName: getStorage("nickName")
        }
        const res = await adjustOutsourceProcess(params)
        if (res.code == 200) {
            messageAlert('success', res.msg);
            dialogVisible.value = false;
            getDataList();
            tableOption.tableLoading = false
        }
    })
}
//弹窗关闭
function dialogClosed() {
    formRef.value.resetFields();
    dataForm.newQuantity = ''
    dataForm.mark = ''
}
function onSearch() {
    getDataList()
}

getDataList()
</script>
<style lang="scss" scoped>
@import "@/styles/modules/quantityadjust/productionstart.scss";
</style>