<template>
    <div class="search-form-wrap">
        <el-form class="search-form" size="small">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-form-item label="委外计划单号">
                        <el-input :clearable="true" v-model.trim="searchForm.outPlanNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商名称">
                        <el-input :clearable="true" v-model.trim="searchForm.supplier"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="onSearch"
                        icon="el-icon-search"
                    >查询</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="onBatchDelete"
                        icon="el-icon-delete"
                    >批量删除</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="onOutSourceReceive"
                        icon="el-icon-printer"
                    >批量接收</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <table-extend
        ref="table"
        @handleSelectionChange="handleSelectionChange"
        v-bind="tableOption"
        @pageSizeChange="pageSizeChange"
        @currentChange="currentChange"
    >
        <template #operatColumn>
            <el-table-column label="操作" fixed="right" min-width="280">
                <template #default="scope">
                    <el-button type="text" size="small" @click="onDel(scope)">删除</el-button>
                    <el-button type="text" size="small" @click="onRcv(scope)">接收</el-button>
                </template>
            </el-table-column>
        </template>
    </table-extend>
    <!-- 弹出框 -->
    <el-dialog v-model="dialogVisible" width="70%">
        <template #title>
            <dialog-title title="批量接收"></dialog-title>
        </template>
        <table-extend ref="dialogTable" v-bind="dialogTableOption">
            <template #col_rcvQty="{ data }">
                <el-input v-model="data.rcvQty"></el-input>
            </template>
            <template #col_outTime="{ data }">
                <el-date-picker
                    v-model="data.rcvTime"
                    type="datetime"
                    placeholder="Select date and time"
                ></el-date-picker>
            </template>
            <template #operatColumn>
                <el-table-column label="操作" fixed="right" min-width="280">
                    <template #default="{ $index }">
                        <el-button
                            type="text"
                            size="small"
                            @click="onDialogDel($index)"
                            @handleSelectionChange="handleDialogSelectionChange"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </template>
        </table-extend>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="rcvBatch">确认接收</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 抽屉 -->
    <div class="fixedDialog">
        <el-drawer v-model="drawer" size="85%" :direction="direction" :before-close="handleClose">
            <template #title>
                <dialog-title title="委外接收"></dialog-title>
            </template>
            <el-form
                class="preview-form"
                label-width="120px"
                label-position="right"
                ref="drawerForm"
                :model="receive"
            >
                <el-col :span="8">
                    <el-form-item label="委外接收单">
                        <el-input disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="委外发出单号" label-position="right">
                        <el-input v-model="formData.billNo" disabled></el-input>
                    </el-form-item>
                </el-col>

                <el-col>
                    <el-form-item label-width="0px">
                        <div class="item-title-wrap" @click="onExpandItems">
                            <div class="title-item" :style="style">
                                <div class="highlight" :style="highlightStyle"></div>工序任务基本信息
                            </div>
                            <i
                                class="el-icon-arrow-down expand-icon"
                                :style="`transform:rotate(${isExpand ? 0 : -90}deg);`"
                            ></i>
                        </div>
                    </el-form-item>
                </el-col>
                <el-row class="items-wrap" v-show="isExpand">
                    <el-col :span="8">
                        <el-form-item label="委外计划单号">
                            <el-input v-model="formData.outPlanNo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="生产订单号">
                            <el-input v-model="formData.icmoNbr" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工序编码">
                            <el-input v-model="formData.processCode" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工序名称">
                            <el-input v-model="formData.processName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="委外计划数量">
                            <el-input v-model="formData.planOutQty" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="委外发出数量">
                            <el-input v-model="formData.outQty" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="已接收数量">
                            <el-input v-model="formData.sumRcvGoodQty" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="接收数量" prop="rcvQty">
                            <el-input v-model="receive.rcvQty"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="接收日期" prop="rcvTime">
                            <el-date-picker v-model="receive.rcvTime" type="datetime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合格数量" prop="rcvGoodQty">
                            <el-input v-model="receive.rcvGoodQty"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="不良数量" prop="rcvUnGoodQty">
                            <el-input v-model="receive.rcvUnGoodQty" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row class="items-wrap">
                    <el-col>
                        <el-form-item label-width="0px">
                            <el-tabs v-model="activeName">
                                <el-tab-pane label="不良明细" name="first">
                                    <el-button size="small" type="primary" plain @click="onAdd">新增</el-button>
                                    <table-extend  v-bind="brTableOption">
                                        <template #operatColumn>
                                            <el-table-column
                                                label="操作"
                                                fixed="right"
                                                min-width="280"
                                            >
                                                <template #default="{ $index }">
                                                    <el-button
                                                        type="text"
                                                        size="small"
                                                        @click="onUnGoodDel($index)"
                                                        @handleSelectionChange="handleDialogSelectionChange"
                                                    >删除</el-button>
                                                    <el-button
                                                        type="text"
                                                        size="small"
                                                        @click="onUnGoodEdit($index)"
                                                        @handleSelectionChange="handleDialogSelectionChange"
                                                    >编辑</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </table-extend>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div style="text-align: center;">
                <el-button type="info" @click="rcvSingleCancel">取消</el-button>
                <el-button type="primary" @click="rcvSingleConfirm">确认</el-button>
            </div>

            <el-dialog v-model="brDialogVisible" width="70%" :before-close="brHandleClose">
                <template #title>
                    <dialog-title :title="!isEdit ? '新增信息' : '编辑信息'"></dialog-title>
                </template>

                <el-form
                    :model="badReason"
                    ref="badReasonForm"
                    :rules="badReasonRules"
                    label-width="120px"
                    label-position="right"
                    size="medium"
                >
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="不良原因代码" prop="reasonCode">
                                <el-input v-model="badReason.reasonCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="不良原因名称" prop="reasonName">
                                <el-input v-model="badReason.reasonName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="不良数量" prop="qty">
                                <el-input-number v-model="badReason.qty" @change="handleChange" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="onBrCancel">取消</el-button>
                        <el-button type="primary" @click="onBrSave">保存</el-button>
                    </span>
                </template>
            </el-dialog>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed, watch } from 'vue'
import tableColums from '@/config/tableConfig/outsend/outsend';
import dialogTableColums from '@/config/tableConfig/outsend/dialogOutsend';
import badReasonColums from '@/config/tableConfig/outsend/badReason';
import { getSend, rcvSave, sendDel, sendBatchDel } from '@/api/out'
import { messageAlert, deepClone, confirmBox } from "@/utils/utils";
const dialogVisible = ref(false);
const brDialogVisible = ref(false)
const drawerForm = ref(null)

const badReasonForm = ref(null)
const pagination = reactive({
    current_page: 1,
    page_size: 15
})

const drawer = ref(false)
const dialogTable = ref(null)
const table = ref(null)
const activeName = ref('first')

const formData = reactive({
    billNo: '',
    outPlanNo: '',
    icmoNbr: '',
    processCode: '',
    processName: '',
    planOutQty: '',
    outQty: '',
    sumRcvGoodQty: '',

})

const isExpand = ref(true)

function onExpandItems() {
    isExpand.value = !isExpand.value;
}

/**不良表体验证规则*/
const badReasonRules = {
    reasonCode: [
        {
            required: true,
            message: '不良原因代码不能为空',
            trigger: 'blur'
        }
    ],
    reasonName: [
        {
            required: true,
            message: '不良原因名称不能为空',
            trigger: 'blur'
        }
    ]
}

const tableOption = reactive({
    tableData: [],
    tableColums,
    selectionCol: true,
    paging: true,
    total: 0,
    tableLoading: false,
    noTableRight: false,
})

const badReason = reactive({
    reasonCode: '',
    reasonName: '',
    qty: ''
})

/**多选的数据 */
let selectData = reactive([])



/**查询*/
const onSearch = () => {
    getSendData()
}

/**批量接收 */
const rcvBatch = () => {
    const params = dialogTableOption.tableData.map(i => {
        return {
            outId: i.id,
            rcvQty: i.rcvQty,
            rcvTime: i.rcvTime
        }
    })
    const obj = {
        receives: undefined
    }
    obj.receives = params
    console.log(obj)
    rcvSave(obj)
}

/**单个接收 */
const onRcv = (scope) => {
    drawer.value = true
    const { row } = scope
    for (const key in row) {
        formData[key] = row[key]
    }
}

/**单个接收确认按钮 */
const rcvSingleConfirm = async () => {
    if (receive.rcvUnGoodQty > receive.rcvQty) {
        messageAlert("error", "不良数量不可大于接收数量");
    } else {
        const params = {
            receives: [receive],
            badReasons: brTableOption.tableData
        }
        const res = await rcvSave(params)
        if (res.code === 200) {
            messageAlert("success", "新增成功");
            drawer.value = false
            nextTick(() => drawerForm.value?.resetFields())
            getSendData()
        } else {
            messageAlert("error", res.msg);
            // drawer.value = false
        }
        brTableOption.tableData = []
    }


}

/**抽屉取消 */
const handleClose = () => {
    drawer.value = false
    nextTick(() => drawerForm.value?.resetFields())
    brTableOption.tableData = []
}

/**单个接收取消 */
const rcvSingleCancel = () => {
    drawer.value = false
    nextTick(() => drawerForm.value?.resetFields())
    brTableOption.tableData = []
}

/**单个删除 */
const onDel = (scope) => {
    const { row } = scope
    confirmBox("删除数据", async () => {
        const params = [row.id]
        const res = await sendDel(params)
        if (res.code == 200) {
            messageAlert("success", "删除成功");
            getSendData()
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
        const res = await sendBatchDel(selectData)
        if (res.code == 200) {
            messageAlert("success", "删除成功");
        }
    })

}

const rcvUnGoodQty = computed(_ => brTableOption.tableData.length !== 0 ? brTableOption.tableData.reduce((total, cur) => total + cur.qty
    , 0) : null
)

const onAdd = () => {
    brDialogVisible.value = true
}






/**不良明细从表删除 */
const onUnGoodDel = ($index) => {
    brTableOption.tableData.splice($index, 1)
}

const rcvGoodQty = computed(() => {
    if (receive.rcvUnGoodQty || receive.rcvQty) {
        return receive.rcvQty - receive.rcvUnGoodQty
    }
})

const receive = reactive({
    outId: computed(() => formData.id),
    rcvQty: null,
    rcvTime: new Date(),
    rcvGoodQty,
    rcvUnGoodQty
})

const isEdit = ref(false)

/**不良明细从表编辑 */
// const onUnGoodEdit = ($index) => {
//     console.log($index)
//     badReason.reasonCode = brTableOption.tableData[$index].reasonCode
//     badReason.reasonName = brTableOption.tableData[$index].reasonName
//     badReason.qty = brTableOption.tableData[$index].qty
// }

/**不良表体需要编辑的index */
let changeRowIndex;

/**不良表体编辑 */
const onUnGoodEdit = ($index) => {
    isEdit.value = true
    changeRowIndex = $index
    badReason.reasonCode = brTableOption.tableData[$index].reasonCode
    badReason.reasonName = brTableOption.tableData[$index].reasonName
    badReason.qty = brTableOption.tableData[$index].qty
    brDialogVisible.value = true
}


const searchForm = reactive({
    outPlanNo: '',
    supplier: ''
})

const dialogTableOption = reactive({
    tableData: [],
    tableColums: dialogTableColums,
    selectionCol: false,
    paging: false,
    total: 0,
    tableLoading: false,
    noTableRight: false,
})

const brTableOption = reactive({
    tableData: [],
    tableColums: badReasonColums,
    selectionCol: false,
    paging: false,
    total: 0,
    tableLoading: false,
    noTableRight: false,
})

// watch(rcvUnGoodQty, (newVal, oldVal) => {
//     if (receive.rcvQty) {
//         if (newVal > receive.rcvQty) {
//             messageAlert("error", "不良数量不可大于接收数量");
//             return
//         }
//     }
// })

// let visualBadGoodSum = 0

const onBrSave = () => {
    badReasonForm.value?.validate((valid) => {
        if (valid) {
            if (!isEdit.value) {
                const cloneBadReasonFormData = deepClone(badReason)
                // visualBadGoodSum += cloneBadReasonFormData.qty
                // if (receive.rcvQty) {
                //     if (visualBadGoodSum > receive.rcvQty) {
                //         messageAlert("error", "不合格数不可大于接收数");
                //         visualBadGoodSum = 0
                //         return
                //     }
                // }
                brTableOption.tableData.push(cloneBadReasonFormData as never)

                badReasonForm.value?.resetFields()
            } else {
                brTableOption.tableData[changeRowIndex].reasonCode = badReason.reasonCode
                brTableOption.tableData[changeRowIndex].reasonName = badReason.reasonName
                brTableOption.tableData[changeRowIndex].qty = badReason.qty
            }
            for (const key in badReason) {
                badReason[key] = undefined
            }
            nextTick(() => {
                isEdit.value = false
                brDialogVisible.value = false
            })
        } else {
            return false
        }
    })

}

const onBrCancel = () => {
    for (const key in badReason) {
        badReason[key] = undefined
    }
    brDialogVisible.value = false
    nextTick(() => {
        isEdit.value = false
    });
}

const brHandleClose = () => {
    for (const key in badReason) {
        badReason[key] = undefined
    }
    isEdit.value = false
    brDialogVisible.value = false
}

const style = {
    backgroundColor: "rgba(255,255,255,0)",
    color: "#333",
    fontSize: '14px',
}

const highlightStyle = {
    backgroundColor: "#539af8",
    width: '4px',
    height: '14px'
}


/**获取数据 */
const getSendData = async () => {
    tableOption.tableLoading = true;
    const params = {
        ...searchForm,
        ...pagination
    }
    const res = await getSend(params)
    const { data } = res
    if (res.code === 200) {
        tableOption.tableData = data.records
        tableOption.total = data.total
        tableOption.tableLoading = false;
    }
}

/**初始化*/
getSendData()




// 页面大小改变
const pageSizeChange = (e): void => {
    pagination.page_size = e.pageSize;
    getSendData();
};
// 页码改变
const currentChange = (e): void => {
    pagination.current_page = e.pageIndex;
    getSendData();
};


// searchForm 按钮功能
const onOutSourceReceive = () => {
    if (dialogTableOption.tableData.length == 0) {
        messageAlert("error", "请选择要接收的数据");
        return;
    } else {
        dialogVisible.value = true
    }
}

const handleSelectionChange = (vals) => {
    selectData = vals.map(i => i.id)
    const postRcvData = reactive({
        rcvQty: null,
        rcvTime: new Date()
    })
    vals.forEach(i => {
        Object.assign(i, postRcvData)
    })

    dialogTableOption.tableData = vals
}

const handleDialogSelectionChange = () => {
    console.log()
}

const onDialogDel = (index) => {
    console.log(table.value)
    dialogTableOption.tableData.splice(index, 1)
}


</script>

<style scoped lang="scss">
@import "@/styles/modules/design/preview.scss";

.fixedDialog {
    .table-extend {
        margin-top: 16px;
    }
}
.items-wrap {
    max-width: 100%;
    width: 100%;
}
.item-title-wrap {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.expand-icon {
    transform-origin: center;
    transition: transform 0.35s ease-in-out;
}

.title-item {
    display: flex;
    align-items: center;
    padding: 0 5px;
}
.highlight {
    margin-right: 10px;
    border-radius: 4px;
}
</style>
