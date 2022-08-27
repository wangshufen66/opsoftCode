<template>
    <div class="page-list-container">
        <div class="search-wrap">
            <div class="form-wrap">
                <el-form :inline="true">
                    <el-form-item label="模板名称">
                        <el-input type="text" v-model="searchForm.templateCode" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="应用页面">
                        <el-cascader
                            v-model="searchForm.pageId"
                            :props="{ lazy: true, emitPath: false, lazyLoad: cascaderLazyLoad }"
                            separator="-"
                        ></el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <div class="button-wrap">
                <el-button type="primary" plain icon="el-icon-search" @click="onSearch">搜索</el-button>
                <el-button type="primary" plain icon=" el-icon-plus" @click="onAdd">新增</el-button>
            </div>
        </div>
        <table-extend
            v-bind="tableOption"
            @pageSizeChange="pageSizeChange"
            @currentChange="currentChange"
        >
            <template #operatColumn>
                <el-table-column label="操作" min-width="100" fixed="right">
                    <template #default="scope">
                        <text-button @click="onTemplateDesign(scope.row)">模板配置</text-button>
                        <text-button @click="onEdit(scope.row)">编辑</text-button>
                        <text-button @click="onDelete(scope.row)">删除</text-button>
                    </template>
                </el-table-column>
            </template>
        </table-extend>
        <el-dialog
            v-model="formDialoagVisible"
            @close="dialoagClose"
            destroy-on-close
            width="600px"
        >
            <template v-slot:title>
                <dialog-title :title="formTitle"></dialog-title>
            </template>
            <el-form :model="formModel" ref="formRef" :rules="formRules" label-width="120px">
                <el-form-item label="模板代码" prop="templateCode">
                    <el-input v-model="formModel.templateCode" placeholder="请输入模板代码" clearable></el-input>
                </el-form-item>
                <el-form-item label="模板名称" prop="templateName">
                    <el-input v-model="formModel.templateName" placeholder="请输入模板名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-cascader
                        v-model="formModel.pageId"
                        :props="{ lazy: true, emitPath: false, lazyLoad: cascaderLazyLoad }"
                        separator="-"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="formDialoagVisible = false">取 消</el-button>
                <el-button type="primary" :loading="submitLoading" @click="onSubmitForm">保 存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import tableColums from '@/config/tableConfig/sysPrintTemplateList';
import { getAppList, getModelByApp, getPageByModel } from '@/api/userApi';
import { confirmBox, messageAlert } from '@/shared/utils/utils';

const router = useRouter()

const formDialoagVisible = ref<boolean>(false);

const submitLoading = ref<boolean>(false);

const formRef = ref<any>(null);

const formTitle = ref<string>('');

// 查询表单参数
const searchForm = reactive({
    templateCode: undefined,
    pageId: undefined,
});

//列表配置项
const tableOption = reactive({
    tableData: [],
    tableColums: tableColums,
    selectionCol: false,
    paging: true,
    total: 0,
    tableLoading: false,
});

const pagination = reactive({
    current: 1,
    size: 15,
});

//表单结构
const formModel = reactive({
    templateCode: undefined,
    templateName: undefined,
    pageId: undefined,
    pageName: undefined
})

//添加和编辑表单的验证规则
const formRules = reactive({
    templateCode: [
        { required: true, message: '请输入模板代码', trigger: 'blur' },
    ],
    templateName: [
        { required: true, message: '请输入模板名称', trigger: 'blur' },
    ],
});

// 查询
function onSearch() {
    pagination.current = 1;
    getDataList();
}

// 添加
function onAdd() {
    formTitle.value = '新增模板';
    formDialoagVisible.value = true;
}

function onSubmitForm() {
    submitLoading.value = true;
    formRef.value.validate(async (val) => {
        if (!val) {
            submitLoading.value = false;
            return;
        }
        submitLoading.value = false;
        formDialoagVisible.value = false;
    })
}

/**模板设计 */
function onTemplateDesign(row: any) {
    router.push({ path: '/design-print-template', query: { id: row.id } });

}

/**编辑 */
function onEdit(row: any) {
    formTitle.value = '编辑模板';
    formDialoagVisible.value = true;
}

/**删除 */
function onDelete(row: any) {
    confirmBox('删除该数据', async () => {
        const res = await delDictionariesType({ ids: row.id });
        if (res.code === 200) {
            messageAlert('success', '删除成功')
            getDataList();
        }
    });
}

function dialoagClose() {
    formRef.value.clearValidate();
    formRef.value.resetFields();
}

// 获取数据
async function getDataList() {
    tableOption.tableLoading = true;
    const params = {
        ...searchForm,
        ...pagination,
    };
    const res = await getProcessDefinitionList(params);
    const { code, data } = res;
    if (code === 200) {
        tableOption.tableData = data.records;
        tableOption.total = data.total;
    }
    tableOption.tableLoading = true;
}

// 表格pagesize
function pageSizeChange(options): void {
    const { pageSize } = options;
    pagination.current = 1
    pagination.size = pageSize;
    getDataList();
}
// 表格页码切换
function currentChange(options): void {
    const { pageIndex } = options;
    pagination.current = pageIndex;
    getDataList();
}


async function cascaderLazyLoad(node, resolve) {
    const { level, value } = node;
    if (level === 0) {
        const res = await getAppList();
        if (res.code == 200) {
            const nodes = res.data && res.data.map((m) => {
                return {
                    label: m.appName,
                    value: m.id,
                    leaf: level >= 2,
                };
            });
            resolve(nodes);
        }
    } else if (level === 1) {
        // 加载模块
        const res = await getModelByApp({ appId: value });
        if (res.code == 200) {
            const nodes = res.data.map((m) => {
                return {
                    label: m.modelName,
                    value: m.id,
                    leaf: level >= 2,
                };
            });
            resolve(nodes);
        }
    } else if (level === 2) {
        // 加载页面
        const res = await getPageByModel({ modelId: value });
        if (res.code == 200) {
            const nodes = res.data.map((m) => {
                return {
                    label: m.pageName,
                    value: m.id,
                    leaf: level >= 2,
                };
            });
            resolve(nodes);
        }
    }
}

getDataList();
</script>
  
  <style lang="scss" scoped>
@import "@/styles/modules/system/comlist.scss";
</style>
  