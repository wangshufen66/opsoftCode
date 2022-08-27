<template>
    <div class="ajust-record">
        <div class="top">
            <el-tabs v-model="dataForm.activeName" @tab-click="handleClick">
                <el-tab-pane label="生产开工" name="pstart"></el-tab-pane>
                <el-tab-pane label="生产汇报" name="preport"></el-tab-pane>
                <el-tab-pane label="委外计划" name="outplan"></el-tab-pane>
                <el-tab-pane label="委外发出" name="outsend"></el-tab-pane>
                <el-tab-pane label="委外接收" name="outreceive"></el-tab-pane>
            </el-tabs>

            <div class="top-serach">
                <el-input
              type="text"

                    v-if="dataForm.activeName == 'pstart'"
                    placeholder="请输入开工单号"
                    v-model.trim="searchForm.billNo"
                    :clearable="true"
                    @keyup.enter="onSearch"

                ></el-input>
                <el-input
                    clearable
                    v-if="dataForm.activeName == 'preport'"
                    placeholder="请输入汇报单号"
                    @keyup.enter="onSearch"
                    v-model.trim="searchForm.billNo"
                ></el-input>
                <el-input
                    clearable
                    v-if="dataForm.activeName == 'outplan'"
                    v-model.trim="searchForm.billNo"
                    @keyup.enter="onSearch"
                    placeholder="请输入委外计划单号"
                ></el-input>
                <el-input
                    clearable
                    v-if="dataForm.activeName == 'outsend'"
                    @keyup.enter="onSearch"
                    placeholder="请输入委外发出单号"
                    v-model.trim="searchForm.billNo"
                ></el-input>
                <el-input
                    clearable
                    v-if="dataForm.activeName == 'outreceive'"
                    @keyup.enter="onSearch"
                    placeholder="请输入委外接收单号"
                    v-model.trim="searchForm.billNo"
                ></el-input>

                <el-button
                    class="btn-serach"
                    @click="onSearch"
                    size="small"
                    type="primary"
                    plain
                    icon="el-icon-search"
                >查询</el-button>
            </div>
        </div>

        <table-extend
            v-bind="tableOption"
            @pageSizeChange="pageSizeChange"
            @currentChange="currentChange"
        >
            <template #col_createTime="{ data }">
                <span>{{ formatCreateTime(data.createTime) }}</span>
            </template>
            <template #col_type="{ data }">
                <span>{{ data.type === 1 ? "生产开工调整" : data.type === 2 ? "生产汇报调整" : data.type === 3 ? "委外计划调整" : data.type === 4 ? "委外发出调整" : data.type === 5 ? "委外接收调整" : "" }}</span>
            </template>
        </table-extend>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import tableColums from '@/config/tableConfig/adjustRecord/adjustRecord';
import { getAdjustRecordList } from "@/api/homeApi/index";
import dayjs from 'dayjs'
const tableOption = reactive({
    tableData: [],
    tableColums,
    selectionCol: true,
    paging: true,
    total: 0,
    tableLoading: false,
    noTableRight: false,
})
//用于搜索
const searchForm = reactive({
    billNo: undefined
})

const pagination = reactive({
     current_page: 1,
    page_size: 15,
});
const dataForm = reactive({
    activeName: "pstart",
    type: 1 ,//1生产开工调整/2生产汇报调整/3委外计划调整/4委外发出调整/5委外接收调整
billNo:''
})
const activeNameList = [
    {
        value: 1,
        lable: '生产开工'
    },
    {
        value: 2,
        lable: '生产汇报'
    },
    {
        value: 3,
        lable: '委外计划'
    },
    {
        value: 4,
        lable: '委外发出'
    },
    {
        value: 5,
        lable: '委外接收'
    },

]
function pageSizeChange(options): void {
    const { pageSize } = options;
    pagination.page_size = pageSize as number;
    getDataList();
}
// 表格页码切换
function currentChange(options): void {
    const { pageIndex } = options;
    pagination.current_page = pageIndex as number;
    // getDataList();
getDataList({ type: typeList.value })

}

const typeList = ref<any>(1)


function handleClick(tab) {
    const index = Number(tab.index) + 1;
    if (index != undefined || !isNaN(index)) {
        tabChange(index);
    }
}
function tabChange(index) {
    typeList.value = activeNameList.find((i) => {
        return index === i.value
    })?.value;
    getDataList({ type: typeList.value });
}
function onSearch() {
    getDataList({type:typeList.value})
}
async function getDataList(type?: Object) {
    tableOption.tableLoading = true;
    const params = {
        ...searchForm,
        ...type,
        ...pagination
    }
    getAdjustRecordList(params).then((res: any) => {
        if (res.code == 200) {
            tableOption.tableData = res.data.records;
            tableOption.total = res.data.total
            tableOption.tableLoading = false;
        }
    })
}


//格式化时间
function formatCreateTime(str) {
    if (!str) return '';
    return dayjs(str).format('YYYY-MM-DD HH:mm:ss')
}
getDataList({ type: typeList.value })
</script>
<style lang="scss" scoped>
@import "@/styles/modules/quantityadjust/adjustrecord";
</style>