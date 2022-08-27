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
                                <el-form-item label="父级" @submit.prevent>
                                    <el-input
                                        type="text"
                                        disabled
                                        v-model="searchForm.groupName"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="物料代码" @submit.prevent>
                                    <el-input
                                        type="text"
                                        v-model="searchForm.materialNbr"
                                        @keyup.enter="tableGatherFunc.reLoadTableData"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="物料名称" @submit.prevent>
                                    <el-input
                                        type="text"
                                        v-model="searchForm.billNo"
                                        @keyup.enter="tableGatherFunc.reLoadTableData"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-button
                                    type="primary"
                                    @click="tableGatherFunc.reLoadTableData"
                                >查询</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <div class="m-page-list-table" style="height:100%">
                    <table-extend
                        v-bind="tableOption"
                        @pageSizeChange="tableGatherFunc.pageSizeChange"
                        @currentChange="tableGatherFunc.currentChange"
                        @rowClick="rowClick"
                    >
                        <template
                            #col_fullName="{ data }"
                        >{{ data.fullName ? data.fullName.split(',').join(' - ') : '--' }}</template>
                    </table-extend>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance, watch } from "vue";
import BuzApi from "@/api/controller/badReasonGroupApi";
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
            "label": "编码",
            "prop": "code",
            "minWidth": 100
        },
        {
            "label": "全名称",
            "prop": "fullName",
            "minWidth": 100
        },
        {
            "label": "层级",
            "prop": "level",
            "minWidth": 100
        }
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

    row._text = row.name
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