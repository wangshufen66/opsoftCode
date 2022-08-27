<template>
    <div class="productin-start">
        <el-form :inline="true" class="top-search">
               <el-form-item label="生产订单">
                <el-input  clearable v-model.trim="searchForm.startNbr" @keyup.enter="onSearch"></el-input>
            </el-form-item>
            <el-form-item label="产品名称">
                <el-input  clearable v-model.trim="searchForm.productName" @keyup.enter="onSearch"></el-input>
            </el-form-item>
            <el-form-item label="工序名称">
                <el-input clearable v-model.trim="searchForm.processName" @keyup.enter="onSearch"></el-input>
            </el-form-item>
            <el-button @click="onSearch" size="small" type="primary" plain icon="el-icon-search">查询</el-button>
        </el-form>

        <table-extend
            v-bind="tableOption"
            @pageSizeChange="pageSizeChange"
            @currentChange="currentChange"
        >
            <template #col_fstartTime="{ data }">
                <span>{{ formatfstartTime(data.fstartTime) }}</span>
            </template>

            <template #operatColumn>
                <el-table-column label="操作" fixed="right">
                    <template #default="scope">
                        <el-button type="text" size="small" @click="onAdjust(scope.row)">调整</el-button>
                    </template>
                </el-table-column>
            </template>
        </table-extend>
        <el-dialog v-model="dialogVisible" @close="dialogClosed" destroy-on-close width="600px">
            <template v-slot:title>
                <dialog-title title="开工数量调整"></dialog-title>
            </template>
            <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
                <el-form-item label="开工单号">
                    <el-input v-model="dataForm.startNbr" maxlength="32" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="原开工数量">
                    <el-input v-model="dataForm.startQty" maxlength="32" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="新开工数量" prop="newQuantity">
                    <el-input v-model.number="dataForm.newQuantity" clearable></el-input>
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
import tableColums from '@/config/tableConfig/adjustRecord/productionstart';
import { getStorage, messageAlert } from '@/utils/utils';
import {
    getStartsOrderList,
    adjustStartsOrder
} from '@/api/homeApi/index';
import dayjs from 'dayjs'

const tableOption = reactive({
    tableData: [],
    tableColums,
    selectionCol: true,
    paging: true,
    total: 0,
    tableLoading: false,
    noTableRight: false,
});
const nickName = ref<string>("");
const dataForm = reactive({
    startNbr: '',
    startQty: '',
    newQuantity: '',//新数量
    mark: '',
    adjustQuantity: undefined,//调整数量
    qualifiedQty: '',//合格总数
    productName: '',//产品名称
    processName: '',//工序名称
    machiningUnitName: '',//加工设备
    processingEmpName: '',//人员名称
    adjusterName: '',//调整人
    id: '',//表单id,
    timer: '',//时间定时器
    currentTime: ''//系统当前时间
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
function onSearch() {
    getDataList()
}

const formRules = reactive({
    newQuantity: [{
        required: true, message: '请输入的新的开工数量',
    },
    { type: 'number', message: '输入的开工数量必须为数字形式' }
    ],
    mark: [{ required: true, message: "请输入调整调整记录" }]

})
const searchForm = reactive({
    productName: undefined,//产品名称
    processName: undefined,//工序名称
    startNbr:undefined//生产订单

});
// 获取数据
async function getDataList() {
    tableOption.tableLoading = true;

    const params = {
        ...searchForm,
        ...pagination
    };
    const res = await getStartsOrderList(params);
    const { code, data } = res;
    if (code === 200) {
        tableOption.tableData = data.records;
        tableOption.total = data.total;
    }
    tableOption.tableLoading = false;
}


watch(() => dataForm.newQuantity, (newval, oldval) => {
    if (isNaN(parseInt(dataForm.newQuantity))) {
        return
    } else {
        dataForm.adjustQuantity = Number(dataForm.newQuantity) - Number(dataForm.startQty)
    }
})

async function onAdjust(row: any) {
    dialogVisible.value = true
    dataForm.mark = row.mark
    dataForm.startNbr = row.startNbr
    dataForm.adjustQuantity = row.adjustQuantity
    dataForm.startQty = row.startQty
    dataForm.id = row.id
    nickName.value = getStorage("nickName");
}

function onSubmitForm() {
    formRef.value.validate(async (valid) => {
        if (!valid) return;
        const params = {
            id: dataForm.id,
            newQuantity: dataForm.newQuantity,
            adjustQuantity: dataForm.adjustQuantity,
            mark: dataForm.mark,
            adjusterName: getStorage("nickName")

        };
        const res = await adjustStartsOrder(params);
        const { code, data } = res;
        if (code === 200) {
            messageAlert('success', res.msg)
            dialogVisible.value = false
            getDataList();
            tableOption.tableLoading = false;
        }
    })
}
//弹窗关闭
function dialogClosed() {
    formRef.value.resetFields();
    dataForm.newQuantity = ''
    dataForm.mark = ''
}
//格式化时间
function formatfstartTime(str) {
    if (!str) return '';
    return dayjs(str).format('YYYY-MM-DD HH:mm:ss')
}
getDataList()

</script>
<style lang="scss" scoped>
@import "@/styles/modules/quantityadjust/productionstart.scss";
</style>