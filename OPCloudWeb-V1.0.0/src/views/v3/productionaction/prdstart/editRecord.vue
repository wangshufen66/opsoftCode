<template>
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加工单元" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.machiningUnitName"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加工人员" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processingEmpName"
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
        </div>
        <div class="m-page-list-table" style="height:100%">
            <table-extend
                v-bind="tableOption"
                @pageSizeChange="tableGatherFunc.pageSizeChange"
                @currentChange="tableGatherFunc.currentChange"
                @rowDblClick="editDialogFunc.show"
            >
                <template #col_sex="{ data }">{{ renderDictionTag(data.sex, 'sex') }}</template>
                <template
                    #col_isDeleted="{ data }"
                >{{ renderDictionTag(data.isDeleted, 'isDeleted') }}</template>
            </table-extend>
        </div>
    </div>
    <div class="fixedDialog">
        <el-dialog v-model="editDialog.visible" :destroy-on-close="true" width="1400px">
            <template #title>
                <dialog-title title="生产检验"></dialog-title>
            </template>
            <edit ref="editRef" :param="editDialog.param" />
            <template #footer>
                <el-button @click="editDialogFunc.hide()">取消</el-button>
                <el-button
                    v-if="editDialog.param.showType == 1"
                    type="primary"
                    @click="editDialogFunc.onConfirm"
                >保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import BuzApi from "@/api/controller/prdReportApi";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox, renderDictionTag } from "@/utils/utils";
import edit from "./edit.vue";

const props = defineProps(['param'])

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: BuzApi.GetList,
    _tableColums: [
        {
            "label": "开工单号",
            "prop": "startNbr",
            "minWidth": 120
        },
        {
            "label": "加工单元",
            "prop": "machiningUnitName",
            "minWidth": 100
        },
        {
            "label": "加工人员",
            "prop": "processingEmpName",
            "minWidth": 100
        },
        {
            "label": "开工数量",
            "prop": "startQty",
            "minWidth": 100
        },
        {
            "label": "汇报数量",
            "prop": "reportQty",
            "minWidth": 100,

        },
        {
            "label": "合格数量",
            "prop": "qualifiedQty",
            "minWidth": 80
        },
        {
            "label": "不良数量",
            "prop": "badReasonQty",
            "minWidth": 200
        },
        {
            "label": "开工时间",
            "prop": "startTime",
            "minWidth": 200
        },
        {
            "label": "汇报时间",
            "prop": "reportTime",
            "minWidth": 200
        },
        {
            "label": "班组",
            "prop": "shiftGroupName",
            "minWidth": 200
        },
        {
            "label": "班次",
            "prop": "shiftSliceName",
            "minWidth": 200
        }
    ]
    ,
    _searchForm: {
        machiningUnitName: "",
        processingEmpName: "",
        // mock_num: 1,
    },
    _masterForm: {
        processId: props.param.entity?.processId,
        startId: props.param.entity?.id
    }
});

const editRef = ref(null)
const editDialog = reactive({
    visible: false,
    param: {
        showType: 0, //1新增 0查看  2编辑
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
                editDialog.visible = false;
                tableGatherFunc.reLoadTableData();
            });
        },
    }
}
const editDialogFunc = EditDialogFunc(editDialog, editRef)


//删除
const del = async (rows) => {
    var ids_arr = rows.map(x => x.id);
    if (ids_arr.length == 0) {
        messageAlert('error', "请至少勾选一行")
        return false
    }

    confirmBox("删除数据", async () => {
        var res = await BuzApi.Delete(ids_arr);
        if (res.code == 200) {
            messageAlert('success', '保存成功')
            tableGatherFunc.reLoadTableData();
        } else {
            messageAlert('error', res.msg)
        }
        console.log(res, '====changeStatus=======')
    })
};

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