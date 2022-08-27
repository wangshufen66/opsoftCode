<template>
    <!-- 工序任务下的工序开窗-->
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="工序识别码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processUniqueNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="工序代码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="工序名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processName"
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
import BuzApi from "@/api/controller/prdProcessApi";
import CommonApi from "@/api/controller/commonApi";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox } from "@/utils/utils";
import { log } from "console";

const emit = defineEmits(['row-click'])

const props = defineProps(['param'])

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: BuzApi.GetPageList,
    _tableColums: [
        {
            label: "工序识别码",
            prop: "processUniqueNbr",
            minWidth: 100,
        },
        {
            label: "工序名称",
            prop: "processName",
            minWidth: 100,
        },
        {
            label: "产品代码",
            prop: "productNbr",
            minWidth: 100,
        },
        {
            label: "产品名称",
            prop: "productName",
            minWidth: 100,
        },
        {
            label: "可开工数量",
            prop: "couldStartQty",
            minWidth: 100,
        },
    ]
    ,
    // _masterForm: {
    //     ...props.param.masterSearchForm
    // },
    _searchForm: {
        processUniqueNbr: "",
        processName: "",
        processNbr: ''
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