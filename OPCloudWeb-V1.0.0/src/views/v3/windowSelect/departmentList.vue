<template>
    <!-- 部门 -->
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="部门代码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.deptNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="部门名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.deptName"
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
import BuzApi from "@/api/controller/departmentApi";
import CommonApi from "@/api/controller/commonApi";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox } from "@/utils/utils";
const emit = defineEmits(['row-click'])
const props = defineProps(['param'])

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: BuzApi.GetPageList,
    _tableColums: [
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
    ]
    ,
    // _masterForm: {
    //     ...props.param.masterSearchForm
    // },
    _searchForm: {
        deptName: "",
        deptNbr: "",
    },
});


let selectRows = reactive([]);
const rowClick = (row) => {
    //是否存在
    selectRows = [{
        ...row
    }]
    emit('row-click', [row])
};

//对外暴露方法
const getResult = () => {
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