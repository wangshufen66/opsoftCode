<template>
    <!-- 班组 -->
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="人员代码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.employeeNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="人员名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.employeeName"
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
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import BuzApi from "@/api/controller/employeeApi";
import CommonApi from "@/api/controller/commonApi";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox } from "@/utils/utils";
const emit = defineEmits(['row-click'])

const props = defineProps(['param'])

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: BuzApi.GetPageList,
    _tableColums: [
        {
            "label": "人员代码",
            "prop": "employeeNbr",
            "minWidth": 100
        },
        {
            "label": "人员名称",
            "prop": "employeeName",
            "minWidth": 100
        },

        {
            "label": "班组代码",
            "prop": "shiftGroupNbr",
            "minWidth": 100
        },
        {
            "label": "班组名称",
            "prop": "shiftGroupName",
            "minWidth": 100
        },
        {
            "label": "部门代码",
            "prop": "departmentId",
            "minWidth": 100
        },
        {
            "label": "部门名称",
            "prop": "departmentName",
            "minWidth": 100
        },
        {
            "label": "班次代码",
            "prop": "shiftSliceNbr",
            "minWidth": 100
        },
    ]
    ,
    // _masterForm: {
    //     ...props.param.masterSearchForm
    // },
    _searchForm: {
        employeeName: "",
        employeeNbr: "",
    },
});

let selectRows = reactive([]);
const rowClick = (row) => {
    //是否存在
    row._text = row.employeeName;
    row._value = row.id
    selectRows = [{
        ...row
    }]
    emit('row-click', [row])
};

//对外暴露方法
const getResult = () => {
    console.log(selectRows)
    return {
        rows: selectRows,
    }
};

onMounted(() => {
    tableGatherFunc.loadTableData();
});

defineExpose({
    getResult
})

</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>