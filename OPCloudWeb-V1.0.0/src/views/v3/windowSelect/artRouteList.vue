<template>
<!-- 工艺路线-->
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="工艺路线名称" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processRouteName"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="6">
                        <el-form-item label="工艺路线代码" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.processRouteNbr"
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
import BuzApi from "@/api/controller/routeApi";
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
        "label": "工艺路线名称",
        "prop": "processRouteName",
        "minWidth": 100
    },
    {
        "label": "工艺路线代码",
        "prop": "processRouteNbr",
        "minWidth": 100
    },
    {
        "label": "物料名称",
        "prop": "materialName",
        "minWidth": 120
    },
    {
        "label": "物料代码",
        "prop": "materialNbr",
        "minWidth": 120
    },
    {
        "label": "是否控制工序流转",
        "prop": "isControlOrder" ,
        "minWidth": 120
    },
    ]
    ,
 
    _searchForm: {
        processRouteNbr: "",
        processRouteName: "",
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