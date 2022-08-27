<template>
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="委外接收单号" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.billNo"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="产品名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.billNo"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="工序名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.billNo"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="检验状态" @submit.prevent>
                            <el-select
                                v-model="searchForm.status"
                                placeholder="状态"
                                clearable
                                style="width: 100%"
                            >
                                <el-option label="待检验" :value="10"></el-option>
                                <el-option label="已检验" :value="20"></el-option>
                            </el-select>
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
                <el-button
                    @click="editDialog.show({ row: null, showType: 2 })"
                    type="primary"
                    plain
                    size="small"
                >新增</el-button>
            </div>

            <div class="m-page-list-tool-bar-right">
                <el-button
                    @click="tableGatherFunc.reLoadTableData"
                    type="primary"
                    plain
                    size="small"
                >导出</el-button>
            </div>
        </div>
        <div class="m-page-list-table" style="height:100%">
            <table-extend
                v-bind="tableOption"
                @pageSizeChange="tableGatherFunc.pageSizeChange"
                @currentChange="tableGatherFunc.currentChange"
                @rowDblClick="rowDbClick"
            >
                <template #col_sex="{ data }">{{ renderDictionTag(data.sex, 'sex') }}</template>
                <template
                    #col_isDeleted="{ data }"
                >{{ renderDictionTag(data.isDeleted, 'isDeleted') }}</template>

                <template #operatColumn>
                    <el-table-column label="操作" fixed="right" width="100">
                        <template #default="scope">
                            <text-button
                                @click="editDialog.show({ row: scope.row, showType: 4 })"
                            >编辑</text-button>
                            <text-button @click="del([scope.row])">删除</text-button>
                        </template>
                    </el-table-column>
                </template>
            </table-extend>
        </div>
    </div>
    <div class="fixedDialog">
        <el-dialog
            v-model="editDialog.reactiveData.visible"
            :destroy-on-close="true"
            width="1400px"
        >
            <template #title>
                <dialog-title title="新增或编辑"></dialog-title>
            </template>
            <edit ref="editRef" :param="editDialog.reactiveData.param" />
            <template #footer>
                <el-button @click="editDialog.hide()">取消</el-button>
                <el-button
                    v-if="editDialog.reactiveData.param.showType == 2 || editDialog.reactiveData.param.showType == 4"
                    type="primary"
                    @click="editDialog.onConfirm(null)"
                >保存</el-button>
            </template>
        </el-dialog>
    </div>
    <div>{{ JSON.stringify(editDialog.reactiveData) }}</div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import BuzApi from "@/api/controller/demoUserApi";
import CommonApi from "@/api/controller/commonApi";
import useDialog from "@/views/v3/out/useDialog";

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
    ],
    _searchForm: {
        billNo: "",
        status: "",
        // mock_num: 1,
    },
});

const editRef = ref(null)
const editDialog = useDialog({
    _param: {
        showType: 1, //1查看 2新增  4编辑
        id: '',
        entity: null
    },
    _hide: () => {
        tableGatherFunc.loadTableData();
    },
    _show: ({ row, showType = 0 }) => {
        editDialog.reactiveData.param.showType = showType
        editDialog.reactiveData.param.id = row ? row["id"] : '';
        //如果编辑页单独请求的话,这个不要传
        editDialog.reactiveData.param.entity = { ...row };
        editDialog.reactiveData.visible = true
    },
    _onConfirm: (_rows) => {
        editRef.value.submit().then((res) => {
            tableGatherFunc.reLoadTableData();
            editDialog.reactiveData.visible = false;
        });
    }
})

const rowDbClick = (row) => {
    editDialog.show({ row: row, showType: 1 })
}


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


onMounted(() => {
    tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>