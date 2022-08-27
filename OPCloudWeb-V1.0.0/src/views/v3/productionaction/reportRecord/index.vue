<template>
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="产品代码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.productNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="产品名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.productName"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="工序识别码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processUniqueNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
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
                <el-button @click="editDialogFunc.show" type="primary" plain size="small">添加</el-button>
                <el-button
                    @click="tableGatherFunc.reLoadTableData"
                    type="primary"
                    plain
                    size="small"
                >搜索</el-button>
            </div>
        </div>
        <div class="m-page-list-table" style="height:100%">
            <table-extend
                v-bind="tableOption"
                @pageSizeChange="tableGatherFunc.pageSizeChange"
                @currentChange="tableGatherFunc.currentChange"
            >
                <template #operatColumn>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template #default="scope">
                            <text-button
                                @click="editDialogFuncDetail.show(scope.row, 1), selectedRow = scope.row"
                            >详情</text-button>
                        </template>
                    </el-table-column>
                </template>
            </table-extend>
        </div>
    </div>
    <div class="fixedDialog">
        <el-dialog v-model="editDialog.visible" :destroy-on-close="true" width="1400px">
            <template #title>
                <dialog-title title="添加生产汇报"></dialog-title>
            </template>
            <edit :param="editDialog.param" ref="editRef"></edit>
            <template #footer>
                <el-button @click="editDialogFunc.hide">取消</el-button>
                <el-button type="primary" @click="editDialogFunc.onConfirm">保存</el-button>
            </template>
        </el-dialog>
    </div>
    <div class="fixedDialog">
        <el-dialog v-model="editDialogDetail.visible" :destroy-on-close="true" width="1400px">
            <template #title>
                <dialog-title title="汇报记录详情"></dialog-title>
            </template>
            <edit-detail :param="editDialogDetail.param" ref="editRef"></edit-detail>
            <template #footer>
                <el-button @click="editDialogFuncDetail.hide">取消</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import BuzApi from "@/api/controller/prdReportApi";
import CommonApi from "@/api/controller/commonApi";
import _tableColums from "@/config/tableConfig/productionAction/reportRecord"
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox, renderDictionTag } from "@/utils/utils";
import edit from './edit.vue'
import editDetail from './editDetail.vue'

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: BuzApi.GetPageList,
    _tableColums,
    _searchForm: {
        productNbr: "",
        productName: "",
        processUniqueNbr: "",
        processName: ""

        // mock_num: 1,
    },
});

const editRef = ref(null)

const editDialog = reactive({
    visible: false,
    param: {
        showType: 1, //1新增 0查看  2编辑
        id: '',
        entity: null
    }
})

const editDialogDetail = reactive({
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



const editDialogFunc = EditDialogFunc(editDialog, editRef)
const editDialogFuncDetail = EditDialogFunc(editDialogDetail, editRef)
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