<template>
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加工单元" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.billNo"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加工人员" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.billNo"
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

                <template #operatColumn>
                    <el-table-column label="操作" fixed="right" width="150">
                        <template #default="scope">
                            <text-button @click="editDialogFunc.show(scope.row, 1)">编辑</text-button>
                            <text-button @click="del([scope.row])">删除</text-button>
                        </template>
                    </el-table-column>
                </template>
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
import BuzApi from "@/api/controller/demoUserApi";
import CommonApi from "@/api/controller/commonApi";

import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox, renderDictionTag } from "@/utils/utils";
import edit from "./edit.vue";

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: BuzApi.GetPageList,
    _tableColums: [
        {
            "label": "编号",
            "prop": "no",
            "minWidth": 120
        },
        {
            "label": "姓名",
            "prop": "name",
            "minWidth": 100
        },
        {
            "label": "性别",
            "prop": "sex",
            "minWidth": 100
        },
        {
            "label": "地址",
            "prop": "address",
            "showOverflowTooltip": true,
            comp: "String",
        },
        {
            "label": "是否删除",
            "prop": "isDeleted",
            "minWidth": 100,

        },
        {
            "label": "创建人",
            "prop": "createBy",
            "minWidth": 80
        },
        {
            "label": "创建时间",
            "prop": "createTime",
            "minWidth": 200
        }
    ]
    ,
    _searchForm: {
        billNo: "",
        status: "",
        // mock_num: 1,
    },
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