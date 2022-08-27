<template>
    <div class="log-list">
        <div class="search-wrap">
            <el-form class="form-wrap" :model="searchForm" :inline="true" @submit.prevent>
                <el-form-item label="时间">
                    <el-date-picker
                        v-model="searchForm.createTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="searchForm.logType" clearable placeholder="请选择日志类型">
                        <el-option label="登录日志" :value="1"></el-option>
                        <el-option label="操作日志" :value="2"></el-option>
                        <el-option label="错误日志" :value="3"></el-option>
                        <el-option label="系统执行日志" :value="4"></el-option>
                        <el-option label="其他" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input v-model="searchForm.userId" clearable placeholder="请输入操作人"></el-input>
                    <!-- <el-select v-model="searchForm.userId" clearable placeholder="请选择操作人">
                        <el-option
                            v-for="item in users"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                        ></el-option>
                    </el-select>-->
                </el-form-item>
            </el-form>
            <div class="button-wrap">
                <el-button
                    class="btn-search"
                    type="primary"
                    plain
                    icon="Search"
                    @click="onSearch"
                >查询</el-button>
            </div>
        </div>
        <table-extend v-bind="tableOption" @pageSizeChange="logList" @currentChange="logList">
            <template #operatColumn>
                <el-table-column fixed="left" label="操作" width="90" min-width="300">
                    <template #default="scope">
                        <el-button
                            type="primary"
                            plain
                            size="small"
                            @click="onLogContentDetail(scope.row)"
                        >查看</el-button>
                    </template>
                </el-table-column>
            </template>
        </table-extend>
        <div class="fixedDialog">
            <el-dialog v-model="dialogVisible" width="50%" :before-close="beforeClose">
                <template v-slot:title>
                    <DialogTitle dialogTitle="日志详情"></DialogTitle>
                </template>
                <div class="detail" v-html="dialogContent"></div>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import dayjs from "dayjs";
import tableColums from "@/config/tableConfig/sysLogList";
import { getLogList, getStaffList } from "@/api/system";
import DialogTitle from '@/components/dialogTitle/index.vue';

type SearchForm = {
    createTime: Date[] | undefined;
    logType: number | undefined;
    userId: string | undefined;
};
/**分页 */
type Pagination = {
    /**页码 */
    pageIndex: number | undefined;
    /**每页显示数量 */
    pageSize: number | undefined;
};

const users = ref<any[]>();

const dialogVisible = ref<boolean>(false);

const dialogContent = ref<string>()

const searchForm = reactive<SearchForm>({
    createTime: undefined,
    logType: undefined,
    userId: undefined,
});

//列表配置项
const tableOption = reactive({
    tableData: [],
    tableColums,
    selectionCol: false,
    paging: true,
    total: 0,
    tableLoading: false,
});

function onSearch() {
    logList({ pageIndex: 1, pageSize: 15 })
}

function onLogContentDetail(row: any): void {
    dialogVisible.value = true;
    dialogContent.value = `
    <div class="item">记录时间：${row.createTime || "--"}</div>
    <div class="item">日志内容：${row.logContent || "--"}</div>
    <div class="item">日志类型：${row.logType || "--"}</div>
    <div class="item">操作结果：${row.operateResult || "--"}</div>
    <div class="item">接口地址：${row.requestUrl || "--"}</div>
    <div class="item">客户端IP：${row.ip || "--"}</div>
    <div class="item">客户端信息：${row.userAgent || "--"}</div>
    `
}

function beforeClose(done) {
    dialogContent.value = ""
    done()
}

function getLogType(type: string): string {
    switch (type) {
        case "1":
            return "登录日志";
        case "2":
            return "操作日志";
        case "3":
            return "错误日志";
        case "4":
            return "系统执行日志";
        case "5":
            return "其他";
        default:
            return "--";
    }
}

async function logList(pagination: Pagination = { pageIndex: 1, pageSize: 15 }): Promise<void> {
    const pageSize = pagination?.pageSize || 15, pageIndex = ((pagination?.pageIndex || 1) - 1) * (pagination.pageSize || 15)
    const params = {
        ...{
            createStart: searchForm.createTime && +searchForm.createTime?.[0],
            createEnd: searchForm.createTime && +searchForm.createTime?.[1],
            logType: searchForm.logType,
            userId: searchForm.userId,
        },
        ...{ pageIndex, pageSize }
    };
    tableOption.tableLoading = true;
    const res = await getLogList(params);
    if (res.code == 200) {
        const { hits } = res.data;
        const { hits: rows, total } = hits;
        tableOption.tableData = rows.map(m => ({
            ...m._source, ...{
                id: m._id,
                logType: getLogType(m._source.logType),
                logContent: m._source.logContent,
                createTime: dayjs(new Date(m._source.createTime)).format("YYYY-MM-DD HH:mm:ss"),
                userId: m._source.userId === "null" ? "system" : m._source.userId
            }
        }))
        tableOption.total = total.value;
        tableOption.tableLoading = false;
    }
}

async function getusers() {
    const res = await getStaffList({ currentPage: 1, pageSize: 500 })
    if (res.code == 200) {
        users.value = res.data.records.map(m => ({ key: m.userId, value: m.nickName }))
    }
}

function init() {
    getusers();
    onSearch();
}

init();
</script>
<style lang="scss" scoped>
@import "@/styles/modules/system/log.scss";
</style>
