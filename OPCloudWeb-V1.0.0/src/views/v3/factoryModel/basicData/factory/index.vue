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
                                <el-form-item label="当前父级" @submit.prevent>
                                    <el-input
                                        type="text"
                                        disabled
                                        v-model="activeNode.modelName"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="代码" @submit.prevent>
                                    <el-input
                                        type="text"
                                        v-model="searchForm.modelNbr"
                                        @keyup.enter="tableGatherFunc.reLoadTableData"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="名称" @submit.prevent>
                                    <el-input
                                        type="text"
                                        v-model="searchForm.modelName"
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
                            @click="editDialog.show({ row: null, showType: 2 })"
                            type="primary"
                            plain
                            size="small"
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
                        v-bind="getTableOption"
                        @pageSizeChange="tableGatherFunc.pageSizeChange"
                        @currentChange="tableGatherFunc.currentChange"
                        @rowDblClick="rowDbClick"
                        @handleSelectionChange="handleSelectionChange"
                    >
                        <template
                            #col_modelType="{ data }"
                        >{{ renderDictionTag(data.modelType, 'modelType') }}</template>

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
    <!-- <div
        style="position:absolute;top:10px; left:100px;background-color:#ccc;padding:10px;"
    >{{ JSON.stringify(activeNode) }}</div>-->
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance, watch, computed } from "vue";
import BuzApi from "@/api/controller/facotryApi";
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
            "label": "代码",
            "prop": "modelNbr",
            "minWidth": 100
        },
        {
            "label": "名称",
            "prop": "modelName",
            "minWidth": 100
        },
        {
            "label": "类型",
            "prop": "modelType",
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
        },
        {
            "label": "设备id",
            "prop": "equipmentId",
            "minWidth": 100
        },
        {
            "label": "人员id",
            "prop": "employeeId",
            "minWidth": 100
        }
    ],
    _searchForm: {
        // billNo: "",
        isDisabled: "",
        // mock_num: 1,
    },
});

const getTableOption = computed(() => {

    // var colArr = tableOption.tableColums

    // var colArr2 = colArr.concat([{
    //     "label": "设备id",
    //     "prop": "equipmentId",
    //     "minWidth": 100
    // },
    // {
    //     "label": "人员id",
    //     "prop": "employeeId",
    //     "minWidth": 100
    // }])

    // if (activeNode.modelType == 40) {
    //     tableOption.tableColums = colArr
    //     return
    // } else {
    //     tableOption.tableColums = colArr2
    // }
    return tableOption
})

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
        //新增一定要右侧激活 带入父级

        if (row) {
            editDialog.reactiveData.param.id = row["id"]
        } else {
            editDialog.reactiveData.param.id = ''
            editDialog.reactiveData.param.entity = {
                "id": null,
                "parentId": activeNode.id,
                "parentName": activeNode.modelName,
                "parentModelType": activeNode.modelType - 1,
                "modelNbr": "",
                "modelName": "",
                "modelType": null,
                "description": null,
                "isDeleted": 0,
                "createBy": null,
                "createTime": "2021-12-02T10:34:01",
                "updateBy": null,
                "updateTime": "2021-12-02T10:34:01",
                "isDisabled": 0,
                "equipmentId": null,
                "employeeId": null,
                "fullPath": null,
                "fullName": null,
                "level": 0
            };
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
    editDialog.show({
        row: row,
        showType: 1
    })
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

var activeNode = reactive({
    "id": "",
    "parentId": '',
    "parentName": '',
    "modelNbr": "",
    "modelName": "全部",
    "modelType": 0,
    "description": null,
    "isDeleted": 0,
    "createBy": null,
    "createTime": null,
    "updateBy": null,
    "updateTime": null,
    "isDisabled": 0,
    "equipmentId": null,
    "employeeId": null,
    "fullPath": null,
    "fullName": null,
    "level": 0
})

const onNodeClick = (node) => {
    console.log(node)
    activeNode.modelName = node.modelName
    activeNode.id = node.id
    activeNode.modelType = node.modelType

    searchForm.groupId = node._value
    if (searchForm.groupId == '') {
        searchForm.groupId = null
    }
    tableGatherFunc.reLoadTableData();
}

onMounted(() => {
    tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>