<template>
    <div class="system-component-cfg">
        <div class="search-wrap">
            <div class="form-wrap">
                <el-form mode="topForm" :inline="true" @submit.prevent>
                    <el-form-item label="页面名称">
                        <el-input
                            type="text"
                            placeholder="页面名称"
                            v-model="searchForm.pageName"
                            clearable
                            @keyup.enter="onSearch"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="button-wrap">
                <el-button class="btn-search" type="primary" plain @click="onSearch">查询</el-button>
                <el-button
                    class="btn-search"
                    type="primary"
                    plain
                    @click="updateAllVisible = true"
                >批量修改</el-button>
            </div>
        </div>
        <table-extend
            v-bind="tableOption"
            @pageSizeChange="pageSizeChange"
            @currentChange="currentChange"
        >
            <template #col_PAGEITEMS="{ data }">
                <el-button type="text" size="mini" @click="onDetailItems(data)">查看</el-button>
            </template>
        </table-extend>
        <div class="fixedDialog">
            <el-dialog v-model="updateAllVisible">
                <template v-slot:title>
                    <dialog-title title="组件配置批量修改"></dialog-title>
                </template>
                <el-alert
                    class="comment"
                    title="此操作请确保无其他数据库新增、删除操作"
                    type="error"
                    :closable="false"
                ></el-alert>
                <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
                    <el-form-item label="配置类型" prop="cfgType">
                        <el-radio-group v-model="editForm.cfgType">
                            <el-radio :label="1">组件配置</el-radio>
                            <el-radio :label="2">页面配置</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="节点" prop="key">
                        <el-input
                            v-model="editForm.key"
                            placeholder="所有节点,逗号连接,如:__config__,text。不填写则默认为根节点"
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-if="editForm.cfgType === 1" label="指定组件" prop="tag">
                        <el-input
                            v-model="editForm.tag"
                            placeholder="指定组件tag,逗号连接,如:designInput,designSelect。不填写则默认所有类型组件"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="修改类型" prop="type">
                        <el-radio-group v-model="editForm.type">
                            <el-radio :label="1">新增</el-radio>
                            <el-radio :label="2">删除</el-radio>
                            <el-radio :label="3">修改</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="节点值" prop="value">
                        <el-input
                            type="textarea"
                            :rows="4"
                            v-model="editForm.value"
                            placeholder="JSON字符串"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="updateAllVisible = false">取 消</el-button>
                    <el-button type="primary" :loading="updateAllLoading" @click="onSubmit">保 存</el-button>
                </template>
            </el-dialog>
        </div>
        <div class="fixedDialog">
            <el-dialog v-model="detailVisible" width="1200px">
                <template v-slot:title>
                    <dialog-title title="组件配置"></dialog-title>
                </template>
                <el-input type="textarea" :rows="25" v-model="detailItems"></el-input>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import tableColums from "@/config/tableConfig/sysComponentCfg";
import { getComponentcfg, updateComponentCfg } from '@/api/middleware'

enum EditType {
    ADD = 1,
    DELETE = 2,
    EDIT = 3
}

const searchForm = reactive({
    pageName: undefined
})

const tableloading = ref<boolean>(false);
const updateAllVisible = ref<boolean>(false);
const updateAllLoading = ref<boolean>(false);
const detailVisible = ref<boolean>(false);
const detailItems = ref<string>();

const editFormRef = ref<any>(null);

const editForm = reactive<any>({
    type: EditType.ADD,
    cfgType: 1,
    key: undefined,
    tag: undefined,
    value: undefined
})

//列表配置项
const tableOption = reactive({
    tableData: [],
    tableColums,
    selectionCol: false,
    paging: true,
    total: 0,
    tableLoading: false,
    noTableRight: false,
});

const pagination = { pageIndex: 1, pageSize: 15 };

const formRules = reactive({
    cfgType: [
        { required: true, message: "配置类型必须选择", trigger: "blur" }
    ],
    type: [
        { required: true, message: "修改类型必须选择", trigger: "blur" }
    ],
    value: [
        {
            validator: (rule, value, callback) => {
                if (editForm.type !== EditType.DELETE && (!value || !value.trim())) {
                    callback(new Error('新增或修改时，节点值必须填写！'));
                    return;
                }
                callback();
            }, trigger: "blur"
        }
    ]
})

function onSearch() {
    pagination.pageIndex = 1;
    getDataList();
}

function pageSizeChange(options): void {
    const { pageSize } = options;
    pagination.pageSize = pageSize as number;
    getDataList();
}

function currentChange(options): void {
    const { pageIndex } = options;
    pagination.pageIndex = pageIndex as number;
    getDataList();
}

async function getDataList() {
    tableOption.tableLoading = true;
    const params = {
        ...searchForm,
        ...pagination
    };
    const res = await getComponentcfg(params);
    const { code, data } = res;
    if (code === 200) {
        tableOption.tableData = data.records || [];
        tableOption.total = data.total;
    }
    tableOption.tableLoading = false;
}

function onSubmit() {
    editFormRef.value?.validate(async (valid) => {
        if (valid) {
            const res = await updateComponentCfg(editForm)
        }
    })
}

function onDetailItems(row) {
    detailVisible.value = true
    const json = JSON.parse(row.PAGEITEMS)
    detailItems.value = JSON.stringify(json, null, "\t")
}

getDataList()
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/componentcfg.scss";
</style>