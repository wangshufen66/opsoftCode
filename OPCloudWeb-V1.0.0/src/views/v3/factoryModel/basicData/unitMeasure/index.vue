<template>
    <div class="tree-page">
        <div class="tree-page-left">
            <tree @on-node-click="onNodeClick"></tree>
        </div>
        <div class="tree-page-right">
            <div class="m-page-list">
                <div class="m-page-list-search">
                    <el-form mode="topForm" :inline="true">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="代码" @submit.prevent>
                                    <el-input
                                        type="text"
                                        v-model="searchForm.measureNbr"
                                        @keyup.enter="tableGatherFunc.reLoadTableData"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="名称" @submit.prevent>
                                    <el-input
                                        type="text"
                                        v-model="searchForm.measureName"
                                        @keyup.enter="tableGatherFunc.reLoadTableData"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="禁用状态" @submit.prevent>
                                    <el-select
                                        v-model="searchForm.isDisabled"
                                        placeholder="请选择"
                                        style="width:100%"
                                        clearable
                                    >
                                        <el-option
                                            v-for="item in EnumMap.isDisabled"
                                            :key="item.value"
                                            :label="item.text"
                                            :value="item.value"
                                        ></el-option>
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
                            @click="add"
                            type="primary"
                            plain
                            size="small"
                            :disabled="searchForm.groupId"
                        >新增</el-button>
                        <el-button
                            @click="del(multipleSelection)"
                            type="primary"
                            plain
                            size="small"
                        >删除</el-button>
                        <el-button
                            @click="toDisabled(multipleSelection)"
                            type="primary"
                            plain
                            size="small"
                        >禁用</el-button>
                        <el-button
                            @click="toEnabled(multipleSelection)"
                            type="primary"
                            plain
                            size="small"
                        >反禁用</el-button>

                        <!-- <el-button type="primary" @click="tableGatherFunc.reLoadTableData" plain size="small">批量删除</el-button> -->
                    </div>
                    <div class="m-page-list-tool-bar-right">
                        <el-button
                            @click="tableGatherFunc.reLoadTableData"
                            type="primary"
                            plain
                            size="small"
                            disabled
                        >导出</el-button>
                    </div>
                </div>
                <div class="m-page-list-table" style="height:100%">
                    <table-extend
                        v-bind="tableOption"
                        @pageSizeChange="tableGatherFunc.pageSizeChange"
                        @currentChange="tableGatherFunc.currentChange"
                        @rowDblClick="rowDbClick"
                        @handleSelectionChange="handleSelectionChange"
                    >
                        <template #col_sex="{ data }">{{ renderDictionTag(data.sex, 'sex') }}</template>
                        <template
                            #col_isDeleted="{ data }"
                        >{{ renderDictionTag(data.isDeleted, 'isDeleted') }}</template>

                        <template
                            #col_isDisabled="{ data }"
                        >{{ renderDictionTag(data.isDisabled, 'isDisabled') }}</template>

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
        </div>
    </div>

    <div class="fixedDialog">
        <el-dialog v-model="editDialog.reactiveData.visible" :destroy-on-close="true" width="700px">
            <template #title>
                <dialog-title :title="getDialogTypeName(editDialog.reactiveData.param.showType)"></dialog-title>
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
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance, watch } from "vue";
import BuzApi from "@/api/controller/unitMeasureApi";
import CommonApi from "@/api/controller/commonApi";
import useDialog from "@/views/v3/out/useDialog";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox, renderDictionTag, getDialogTypeName } from "@/utils/utils";
import edit from "./edit.vue";
import tree from './tree/index.vue'

const props = defineProps(['treeInject'])

console.log(props, '===props===')


var EnumMap = {
    isDisabled: [{
        text: "启用",
        value: 0
    }, {
        text: "禁用",
        value: 1
    }]
}


const { tableOption, tableGatherFunc, searchForm, multipleSelection } = useHook({
    _getTableList: BuzApi.GetPageList,
    _tableColums: [
        {
            "label": "单位代码",
            "prop": "measureNbr",
            "minWidth": 100
        },
        {
            "label": "单位名称",
            "prop": "measureName",
            "minWidth": 100
        },
        {
            "label": "单位分组代码",
            "prop": "groupNbr",
            "minWidth": 100
        },
        {
            "label": "单位分组名称",
            "prop": "groupName",
            "minWidth": 100
        },
        {
            "label": "基准计量单位",
            "prop": "referenceMeasureUnit",
            "minWidth": 120
        },
        {
            "label": "单位换算率",
            "prop": "unitConversionRate",
            "minWidth": 120
        },
        {
            "label": "备注",
            "prop": "description",
            "minWidth": 120
        },

        {
            "label": "是否禁用",
            "prop": "isDisabled",
            "minWidth": 100
        }

    ],
    _searchForm: {
        groupId: "",
        isDisabled: "",
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
    _show: ({ row, showType = 4 }) => {
        editDialog.reactiveData.param.showType = showType
        editDialog.reactiveData.param.id = row ? row["id"] : '';
        if (row) {
            //如果编辑页单独请求的话,这个不要传
            editDialog.reactiveData.param.entity = { ...row };
        } else {
            //新增
            editDialog.reactiveData.param.entity = { ...row };
        }

        editDialog.reactiveData.visible = true
    },
    _onConfirm: (_rows) => {
        editRef.value.submit().then((res) => {
            editDialog.reactiveData.visible = false;
            tableGatherFunc.reLoadTableData();
        });
    }
})

const rowDbClick = (row) => {
    editDialog.show({ row: row, showType: 1 })
}

const add = () => {
    editDialog.show({ row: { groupId: activeNode.value.id, groupName: activeNode.value.name }, showType: 2 })
}

const handleSelectionChange = (rows) => {
    multipleSelection.value = rows.map(x => x)
}

//删除
const del = async (rows) => {

    rows = rows || multipleSelection.value

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

const toDisabled = (rows) => {
    rows = rows || multipleSelection.value

    var ids_arr = rows.map(x => x.id);
    if (ids_arr.length == 0) {
        messageAlert('error', "请至少勾选一行")
        return false
    }

    confirmBox("禁用", async () => {
        var res = await BuzApi.Disable(ids_arr);
        if (res.code == 200) {
            messageAlert('success', '操作成功')
            tableGatherFunc.reLoadTableData();
        } else {
            messageAlert('error', res.msg)
        }
        console.log(res, '====changeStatus=======')
    })
}


const toEnabled = (rows) => {
    rows = rows || multipleSelection.value

    var ids_arr = rows.map(x => x.id);
    if (ids_arr.length == 0) {
        messageAlert('error', "请至少勾选一行")
        return false
    }

    confirmBox("反禁用", async () => {
        var res = await BuzApi.AntiDisable(ids_arr);
        if (res.code == 200) {
            messageAlert('success', '操作成功')
            tableGatherFunc.reLoadTableData();
        } else {
            messageAlert('error', res.msg)
        }
        console.log(res, '====changeStatus=======')
    })
}


//编辑的保存
const onSave = () => {
    editRef?.value.submit().then((res) => {
        editDialog.visible = false;
        tableGatherFunc.reLoadTableData();
    });
};

let activeNode = ref(null)

const onNodeClick = (node) => {
    activeNode.value = node;
    searchForm.groupId = node._value
    tableGatherFunc.reLoadTableData();
}

onMounted(() => {
    tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>