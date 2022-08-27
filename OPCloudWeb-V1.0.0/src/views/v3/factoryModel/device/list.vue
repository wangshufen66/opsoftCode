
y<template>
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" class="topForm" :inline="true" @submit.prevent>
                <div class="top-button">
                    <el-button @click="toEdit" type="primary" plain size="small">新增</el-button>
                    <el-button type="primary" @click="onDisable" plain size="small">禁用</el-button>
                    <el-button type="primary" @click="Enable" plain size="small">反禁用</el-button>
                    <el-button type="primary" @click="onBatchDelete" plain size="small">批量删除</el-button>
                </div>
                <div class="top-serach">
                    <el-form-item label="设备代码">
                        <el-input
                            type="text"
                            v-model.trim="searchForm.equipmentNbr"
                            @keyup.enter="tableGatherFunc.reLoadTableData"
                            clearable
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="设备名称">
                        <el-input
                            v-model.trim="searchForm.equipmentName"
                            @keyup.enter="tableGatherFunc.reLoadTableData"
                            clearable
                        ></el-input>
                    </el-form-item>

                    <el-button
                        @click="tableGatherFunc.reLoadTableData"
                        type="primary"
                        plain
                        size="small"
                    >搜索</el-button>
                </div>
            </el-form>
        </div>
        <div class="m-page-list-table" style="height:100%">
            <table-extend
                v-bind="tableOption"
                ref="listRef"
                @handleSelectionChange="handleSelectionChange"
                @pageSizeChange="tableGatherFunc.pageSizeChange"
                @currentChange="tableGatherFunc.currentChange"
                
            >
                <template
                    #col_isDisabled="{ data }"
                >{{ renderDictionTag(data.isDisabled, 'isDisabled') }}</template>
                <template #operatColumn>
                    <el-table-column label="操作" fixed="right" width="150">
                        <template #default="scope">
                            <text-button @click="editDialogFunc.show(scope.row, 2)">编辑</text-button>  <text-button @click="editDialogFunc.show(scope.row, 0)">详情</text-button>
                            <text-button @click="del(scope)">删除</text-button>
                        </template>
                    </el-table-column>
                </template>
            </table-extend>
        </div>
    </div>
    <div class="fixedDialog">
        <el-dialog v-model="editDialog.visible" :destroy-on-close="true" width="700px">
            <template #title>
                <dialog-title :title="editDialog.param.showType == 1?'新增设备':editDialog.param.showType == 2?'编辑设备':'查看设备'" ></dialog-title>
            </template>
            <edit ref="editRef" :param="editDialog.param" />
            <template #footer>
                <el-button @click="editDialogFunc.hide()">取消</el-button>
                <el-button
                    v-if="editDialog.param.showType == 2||editDialog.param.showType == 1"
                    type="primary"
                    @click="editDialogFunc.onConfirm"
                >保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import BuzApi from "@/api/controller/deviceApi";
import CommonApi from "@/api/controller/commonApi";

import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox, renderDictionTag } from "@/utils/utils";
import edit from "./edit.vue";

const emitter = getCurrentInstance()?.appContext.config.globalProperties.$emitter;

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: BuzApi.GetPageList,
    _tableColums: [
        {
            "label": "设备代码",
            "prop": "equipmentNbr",
            "minWidth": 100
        },
        {
            "label": "设备名称",
            "prop": "equipmentName",
            "minWidth": 100
        },
        {
            "label": "设备类别代码",
            "prop": "categoryNbr",
            "minWidth": 130
        },
          {
            "label": "设备类别",
            "prop": "categoryNbr",
            "minWidth": 100
        },
        {
            "label": "设备型号",
            "prop": "categoryName",
            "minWidth": 100
        },
       
        {
            "label": "部门代码",
            "prop": "deptNbr",
            "minWidth": 100
        },
        {
            "label": "部门名称",
            "prop": "deptName",
            "minWidth": 100
        },
        {
            "label": "禁用状态",
            "prop": "isDisabled",
            "minWidth": 100
        },
        {
            "label": "备注",
            "prop": "description",
            "minWidth": 100
        },

        {
            "label": "创建人",
            "prop": "createBy",
            "minWidth": 120
        },
        {
            "label": "创建时间",
            "prop": "createTime",
            "minWidth": 160
        },
        {
            "label": "修改人",
            "prop": "updateBy",
            "minWidth": 120
        },
        {
            "label": "修改时间",
            "prop": "updateTime",
            "width": 160
        },
    ]
    ,
    _searchForm: {
        equipmentName: "",
        equipmentNbr: "",
    },
});
const listRef = ref(null)

const editRef = ref(null)
const editDialog = reactive({
    visible: false,
    param: {
        showType: 0, //1新增 0查看  2编辑
        id: '',
        entity: null
    }
})
const toEdit = (row) => {
    editDialog.param.showType = 1
    // editDialog.param.id = row ? row['id'] : ''
    editDialog.param.entity = {};
    editDialog.visible = true;
};
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

let ids_arr = reactive([])
const handleSelectionChange = (vals) => {
    ids_arr = vals.map(i => i.id)
}
//禁用
const onDisable = () => {
    if (ids_arr?.length == 0) {
        messageAlert("error", "请选择要禁用的数据");
        return;
    }
    confirmBox("禁用数据", async () => {
        var res = await BuzApi.Disable(ids_arr);
        if (res.code == 200) {
            messageAlert('success', '禁用成功')
            listRef.value && listRef.value.tableRef.clearSelection()
            tableGatherFunc.reLoadTableData();
        } 
    })
}
//反禁用
const Enable = () => {
    if (ids_arr?.length == 0) {
        messageAlert("error", "请选择要反禁用的数据");
        return;
    }
    confirmBox("反禁用数据", async () => {
        var res = await BuzApi.AntiDisable(ids_arr);
        if (res.code == 200) {
            messageAlert('success', '反禁用成功')
            listRef.value && listRef.value.tableRef.clearSelection()
            tableGatherFunc.reLoadTableData();
        } 
    })
}
//批量删除
const onBatchDelete = () => {
    if (ids_arr?.length == 0) {
        messageAlert("error", "请选择要删除的数据");
        return;
    }
    confirmBox("删除数据", async () => {
        var res = await BuzApi.Delete(ids_arr);
        if (res.code == 200) {
            messageAlert('success', '删除成功')
            listRef.value && listRef.value.tableRef.clearSelection()
            tableGatherFunc.reLoadTableData();
        } 
    })
}
//删除
const del = async (scope) => {
    confirmBox("删除数据", async () => {
        const { row } = scope
        const params = [row.id]
        var res = await BuzApi.Delete(params);
        if (res.code == 200) {
            messageAlert('success', '删除成功')
            listRef.value && listRef.value.tableRef.clearSelection()
            tableGatherFunc.reLoadTableData();
        }
    })
};


onMounted(() => {
    tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>
