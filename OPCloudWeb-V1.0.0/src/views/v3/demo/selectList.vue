<template>
    <div class="m-page-list">
        <div class="m-page-list-search">
            <el-form mode="topForm" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="搜索条件" @submit.prevent>
                            <el-input
                                type="text"
                                v-model="searchForm.name"
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
import BuzApi from "@/api/controller/demoUserApi";
import CommonApi from "@/api/controller/commonApi";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox } from "@/utils/utils";

const emit = defineEmits(['row-click'])

const props = defineProps(['param'])

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
    ]
    ,
    _masterForm: {
        ...props.param.masterSearchForm
    },
    _searchForm: {
        name: "",
        status: "",
        // mock_num: 1,
    },
});


let selectRows = reactive([]);
const rowClick = (row) => {
    //要分单选还是多选
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