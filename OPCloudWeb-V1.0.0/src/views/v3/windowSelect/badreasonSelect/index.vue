<template>
    <div class="tree-page">
        <div class="tree-page-left">
            <tree @on-node-click="onNodeClick"></tree>
        </div>
        <!-- 不良原因 -->
        <div class="tree-page-right">
         <div class="m-page-list">
                <div class="m-page-list-search">
                    <el-form mode="topForm" :inline="true" v-model="treeRef">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="不良原因代码" @submit.prevent>
                                    <el-input
                                        type="text"
                                        v-model="searchForm.badReasonNbr"
                                        @keyup.enter="tableGatherFunc.reLoadTableData"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="不良原因名称" @submit.prevent>
                                    <el-input
                                        type="text"
                                        v-model="searchForm.badReasonName"
                                        @keyup.enter="tableGatherFunc.reLoadTableData"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-button
                                    @click="tableGatherFunc.reLoadTableData"
                                    type="primary"
                                    plain
                                    size="small"
                                >查询</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <table-extend
                    v-bind="tableOption"
                    @pageSizeChange="tableGatherFunc.pageSizeChange"
                    @currentChange="tableGatherFunc.currentChange"
                    @rowClick="rowClick"
                ></table-extend>
            </div>
            </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance, watch } from "vue";
import BuzApi from "@/api/controller/badReasonApi";
import CommonApi from "@/api/controller/commonApi";
import useDialog from "@/views/v3/out/useDialog";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox, renderDictionTag } from "@/utils/utils";
const emit = defineEmits(['row-click'])

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
            "label": "不良原因代码",
            "prop": "badReasonNbr",
            "minWidth": 100
        }, {
            "label": "不良原因名称",
            "prop": "badReasonName",
            "minWidth": 100
        },

        {
            "label": "备注",
            "prop": "description",
            "minWidth": 100
        },
    ]
    ,
    _searchForm: {
        // billNo: "",
        isDisabled: "0",
        groupId: null,
        groupName: '全部'
    },
});

let selectRows = reactive([]);
const rowClick = (row) => {
    //要分单选还是多选
    console.log(row, '--row----')

    row._text = row.materialName
    row._value = row.id
    selectRows = [{
        ...row
    }]
    emit('row-click', selectRows)
};

const onNodeClick = (node) => {
    searchForm.groupId = node._value
    searchForm.groupName = node._text
    tableGatherFunc.reLoadTableData();
}

onMounted(() => {
    tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>