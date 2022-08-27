<template>
    <div class="search-form-wrap">
        <el-form class="search-form" size="small">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-form-item label="生产订单号">
                        <el-input :clearable="true" v-model.trim="searchForm.icmoNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="工序名称">
                        <el-input :clearable="true" v-model.trim="searchForm.processName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        icon="el-icon-search"
                        @click="onsearch"
                    >查询</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        icon="el-icon-delete"
                        @click="onBatchDelete"
                    >批量删除</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog v-model="dialogVisible" width="900px">
            <template #title>
                <dialog-title :title="title"></dialog-title>
            </template>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <table-extend
        v-bind="tableOption"
        @pageSizeChange="pageSizeChange"
        @currentChange="currentChange"
        @handleSelectionChange="handleSelectionChange"
    >
        <template #operatColumn>
            <el-table-column label="操作" fixed="right" min-width="280">
                <template #default="{ row }">
                    <el-button type="text" size="small" @click="onDel(row)">删除</el-button>
                </template>
            </el-table-column>
        </template>
    </table-extend>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import tableColums from '@/config/tableConfig/outreceive';
import { getRcv, rcvDel, rcvBatchDel } from '@/api/out'
import { messageAlert, confirmBox } from "@/utils/utils";


const tableOption = reactive({
    tableData: [],
    tableColums,
    selectionCol: true,
    paging: true,
    total: 0,
    tableLoading: false,
    noTableRight: false,
});

const pagination = reactive({
    current_page: 1,
    page_size: 15
})

const searchForm = reactive({
    icmoNo: '',
    processName: ''
})

// 页面大小改变
const pageSizeChange = (e): void => {
    pagination.page_size = e.pageSize;
    getRcvData();
};
// 页码改变
const currentChange = (e): void => {
    pagination.current_page = e.pageIndex;
    getRcvData();
};

let selectData = reactive([])

/**获取数据 */
const getRcvData = async () => {
    tableOption.tableLoading = true;
    const params = {
        ...searchForm,
        ...pagination
    }
    const res = await getRcv(params)
    const { data } = res
    if (res.code === 200) {
        tableOption.tableData = data.records
        tableOption.total = data.total
        tableOption.tableLoading = false;
    }

}

/**查询 */
const onsearch = () => {
    getRcvData()
}

/**单个删除 */
const onDel = (row) => {
    confirmBox("删除数据", async () => {
        const params = [row.id]
        const res = await rcvDel(params)
        if (res.code == 200) {
            messageAlert("success", "删除成功");
            getRcvData()
        }
    })

}
/**批量删除 */
const onBatchDelete = () => {
    if (selectData?.length == 0) {
        messageAlert("error", "请选择要删除的数据");
        return;
    }
    confirmBox("删除数据", async () => {
        const res = await rcvBatchDel(selectData)
        if (res.code == 200) {
            messageAlert("success", "删除成功");
            getRcvData()
        }
    })
}

/**多选 */
const handleSelectionChange = (vals) => {
    selectData = vals.map(i => i.id)
}

/**初始化*/
getRcvData()
</script>

<style scoped>
</style>