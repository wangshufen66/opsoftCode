<template>
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="产品代码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.productNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="产品名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.productName"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="工序识别码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processUniqueNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="状态" @submit.prevent>
                            <el-select
                                v-model="searchForm.status"
                                placeholder="状态"
                                clearable
                                style="width: 100%"
                            >
                                <el-option label="初始" :value="10"></el-option>
                                <el-option label="执行中" :value="20"></el-option>
                                <el-option label="挂起" :value="25"></el-option>
                                <el-option label="已关闭" :value="30"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="工序名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processName"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="m-page-list-tool-bar">
            <div class="m-page-list-tool-bar-left">
                <el-button
                    @click="tableGatherFunc.reLoadTableData"
                    type="primary"
                    plain
                    size="small"
                >查询</el-button>
            </div>
            <!-- <div class="m-page-list-tool-bar-right">
                <el-button
                    @click="tableGatherFunc.reLoadTableData"
                    type="primary"
                    plain
                    size="small"
                >导出</el-button>
            </div>-->
        </div>
        <div class="m-page-list-table" style="height:100%">
            <table-extend
                v-bind="tableOption"
                @pageSizeChange="tableGatherFunc.pageSizeChange"
                @currentChange="tableGatherFunc.currentChange"
            >
                <template #operatColumn>
                    <el-table-column label="操作" fixed="right" style="width: 200px;">
                        <template #default="scope">
                            <text-button
                                @click="editDialogFunc.show(scope.row, 1), selectedRow = scope.row"
                            >详情</text-button>
                            <text-button
                                @click="editDialogFuncStart.show(scope.row, 1)"
                                v-if="scope.row.startBtnShow"
                            >开工</text-button>
                            <text-button
                                @click="isStartReport(scope.row)"
                                v-show="scope.row.reportBtnShow"
                            >汇报</text-button>
                            <text-button
                                @click="editDialogFuncRecord.show(scope.row, 1)"
                                v-if="scope.row.reportLogBtnShow"
                            >汇报记录</text-button>
                        </template>
                    </el-table-column>
                </template>
            </table-extend>
        </div>
    </div>
    <div class="fixedDialog">
        <el-dialog
            v-model="editDialogDetail.visible"
            :destroy-on-close="true"
            width="1400px"
            custom-class="dialog_body_padding_5"
        >
            <template #title>
                <dialog-title title="工序详情"></dialog-title>
            </template>
            <edit :param="editDialogDetail.param"></edit>
            <template #footer>
                <el-button @click="editDialogFunc.hide()">取消</el-button>
                <el-button
                    type="primary"
                    @click="editDialogFuncStart.show(editDialogDetail.param.entity)"
                    v-if="startBtnShow"
                >开工</el-button>
                <el-button
                    type="primary"
                    @click="isStartReport(selectedRow)"
                    v-if="reportBtnShow"
                >汇报</el-button>
                <el-button
                    type="primary"
                    @click="editDialogFuncRecord.show"
                    v-if="reportLogBtnShow"
                >汇报记录</el-button>
            </template>
        </el-dialog>
        <el-dialog
            v-model="editDialogStart.visible"
            :destroy-on-close="true"
            width="1400px"
            custom-class="dialog_body_padding_5"
        >
            <template #title>
                <dialog-title title="工序开工"></dialog-title>
            </template>
            <edit-start :param="editDialogStart.param" ref="editRef"></edit-start>
            <template #footer>
                <el-button @click="editDialogFuncStart.hide">取消</el-button>
                <el-button type="primary" @click="editDialogFuncStart.onConfirm">保存</el-button>
            </template>
        </el-dialog>
        <!-- 有开工单 isSart 1 -->
        <el-dialog
            v-model="editDialogReport.visible"
            :destroy-on-close="true"
            width="1400px"
            custom-class="dialog_body_padding_5"
        >
            <template #title>
                <dialog-title title="生产汇报"></dialog-title>
            </template>
            <edit-report :param="editDialogReport.param" ref="editRef"></edit-report>
            <template #footer>
                <el-button @click="editDialogFuncReport.hide" ref="editRef">取消</el-button>
                <el-button type="primary" @click="editDialogFuncReport.onConfirm">保存</el-button>
            </template>
        </el-dialog>
        <!-- 无开工单 isSart 0 -->
        <el-dialog
            v-model="editDialogReportUnStart.visible"
            :destroy-on-close="true"
            width="1400px"
            custom-class="dialog_body_padding_5"
        >
            <template #title>
                <dialog-title title="生产汇报"></dialog-title>
            </template>
            <edit-report-unstart :param="editDialogReportUnStart.param" ref="editRef"></edit-report-unstart>
            <template #footer>
                <el-button @click="editDialogFuncReportUnStart.hide">取消</el-button>
                <el-button type="primary" @click="editDialogFuncReportUnStart.onConfirm">保存</el-button>
            </template>
        </el-dialog>
        <el-dialog
            v-model="editDialogRecord.visible"
            :destroy-on-close="true"
            width="1400px"
            custom-class="dialog_body_padding_5"
        >
            <template #title>
                <dialog-title title="汇报记录"></dialog-title>
            </template>
            <edit-record :param="editDialogRecord.param"></edit-record>
            <template #footer>
                <el-button type="primary" @click="editDialogFuncRecord.hide">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from "vue";
import BuzApi from "@/api/controller/prdProcessApi";
import _tableColums from "@/config/tableConfig/productionAction/operationTask"
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox, renderDictionTag } from "@/utils/utils";
import edit from './edit.vue'
import editStart from './editStart.vue'
import editReport from './editReport.vue'
import editReportUnstart from './editReportUnstart.vue'
import editRecord from './editRecord.vue'
import rowButtonsVue from "../../../../components/modules/apps/rowButtons.vue";


/**基于是否开工的汇报 */
const isStartReport = (row) => {
    if (row.isStart == 1) {
        editDialogFuncReport.show(row, 1)
    } else {
        editDialogFuncReportUnStart.show(row, 1)
    }
}

// 选择列
const selectedRow = ref(null)

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: BuzApi.GetPageList,
    _tableColums,
    _searchForm: {
        productNbr: "",
        productName: "",
        processUniqueNbr: "",
        status: "",
        processName: ""
        // mock_num: 1,
    },
});

const editRef = ref(null)
const editDialogDetail = reactive({
    visible: false,
    param: {
        showType: 1, //1新增 0查看  2编辑
        id: '',
        entity: null
    }
})
const startBtnShow = computed(() => editDialogDetail.param.entity?.startBtnShow)
const reportBtnShow = computed(() => editDialogDetail.param.entity?.reportBtnShow)
const reportLogBtnShow = computed(() => editDialogDetail.param.entity?.reportLogBtnShow)

const editDialogStart = reactive({
    visible: false,
    param: {
        showType: 1, //1新增 0查看  2编辑
        id: '',
        entity: null
    }
})
const editDialogReport = reactive({
    visible: false,
    param: {
        showType: 1, //1新增 0查看  2编辑
        id: '',
        entity: null
    }
})
const editDialogReportUnStart = reactive({
    visible: false,
    param: {
        showType: 1, //1新增 0查看  2编辑
        id: '',
        entity: null
    }
})
const editDialogRecord = reactive({
    visible: false,
    param: {
        showType: 1, //1新增 0查看  2编辑
        id: '',
        entity: null
    }
})
const EditDialogFunc = function (dialog, innerRef) {
    return {
        show: (row, _showType = 0) => {
            console.log(row)
            dialog.param.showType = _showType
            dialog.param.id = row["id"] || '';
            //如果编辑页单独请求的话,这个不要传
            dialog.param.entity = { ...row };
            dialog.visible = true
        },
        hide: () => {
            dialog.visible = false
            tableGatherFunc.loadTableData();
        },
        onConfirm: () => {
            innerRef.value.submit().then((res) => {
                dialog.visible = false;
                tableGatherFunc.reLoadTableData();
            });
        },
    }
}
const editDialogFunc = EditDialogFunc(editDialogDetail, editRef)
const editDialogFuncStart = EditDialogFunc(editDialogStart, editRef)
const editDialogFuncReport = EditDialogFunc(editDialogReport, editRef)
const editDialogFuncReportUnStart = EditDialogFunc(editDialogReportUnStart, editRef)
const editDialogFuncRecord = EditDialogFunc(editDialogRecord, editRef)

//编辑的保存
const onSave = () => {
    editRef?.value.submit().then((res) => {
        editVisible.value = false;
        tableGatherFunc.reLoadTableData();
    });
};


onMounted(() => {
    tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>