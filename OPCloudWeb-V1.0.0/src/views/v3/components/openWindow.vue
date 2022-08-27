<template>
    <div class="open-window">
        <el-input @click="visible = !visible" v-model="windowVal" prefix-icon="el-icon-search"></el-input>
        <div class="fixed-dialog">
            <el-dialog v-model="visible" :destroy-on-close="true">
                <el-form class="topForm" :inline="true">
                    <div class="top-serach">
                        <el-row>
                            <!-- <el-form-item label="班组代码">
                            <el-input
                                type="text"
                                v-model.trim="searchForm.shiftGroupNbr"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="班组名称">
                            <el-input
                                type="text"
                                v-model.trim="searchForm.shiftGroupName"
                                @keyup.enter="tableGatherFunc.reLoadTableData"
                                clearable
                            ></el-input>
                            </el-form-item>-->
                            <el-form-item
                                :label="i.label"
                                v-for="i in (_tableColums.filter(i => i.isSearchParam === true))"
                            >
                                <el-input
                                    type="text"
                                    v-model.trim="searchForm[i.prop]"
                                    @keyup.enter="tableGatherFunc.reLoadTableData"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-button
                                @click="tableGatherFunc.reLoadTableData"
                                type="primary"
                                plain
                                size="small"
                            >查询</el-button>
                        </el-row>
                    </div>
                </el-form>
                <template #title>
                    <dialog-title title="开窗"></dialog-title>
                </template>
                <table-extend @row-click="click" v-bind="tableOption"></table-extend>
                <template #footer>
                    <el-button type="primary" @click="visible = false">取消</el-button>
                    <el-button type="primary">保存</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import baseFunc from '@/api/controller/baseFunc';
import useHook from "@/views/v3/out/useHook";

const emit = defineEmits(['row-click'])

const click = (e) => {
    visible.value = false
    emit('row-click', e)
}
const props = defineProps({
    baseUrl: {
        type: String,
        required: true
    },
    _tableColums: {
        type: Object,
        required: true
    },
    windowVal: {
        type: String
    }
})

const baseUrl = `/api/opcloud/lcdp/${props.baseUrl}`;
// tBdEmployee
// const tableData = baseFunc(baseUrl).GetPageList()

const { tableOption, tableGatherFunc, searchForm } = useHook({
    _getTableList: baseFunc(baseUrl).GetPageList,
    _tableColums: props._tableColums,
    _searchForm: {
    },
});
tableGatherFunc.loadTableData();
const visible = ref(false)

</script>

<style scoped>
</style>