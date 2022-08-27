<template>
    <div class="app-detail">
        <el-page-header title="返回" :content="pageName"></el-page-header>
        <model-form class="detail-form" v-bind="formConfig"></model-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import ModelForm from '@/components/moduleform/form.vue';
import { getPageSetData } from '@/api/homeApi';

const props = defineProps({})

const route = useRoute();
// 页面参数
const pageParams = reactive({
    appid: route.params.appid,
    modelid: route.params.modelid,
    pageid: route.params.pageid,
    dataid: route.query.id
})

const pageName = ref<string>('');

const formConfig = reactive({
    formConf: undefined,
    componentList: [],
    formData: {}
})

// 获取页面数据
async function getPageData() {
    const params = {
        dataRequest: {
            modelId: pageParams.modelid,
            pageId: pageParams.pageid,
            filterColumns: {
                id: pageParams.dataid
            }
        },
        pageRequest: { pageIndex: 1, pageSize: 1 }
    }
    const res = await getPageSetData(params);
    if (res.code == 200) {
        const { columnDatas, pageItems } = res.data.appPageData;
        formConfig.formData = columnDatas[0] || {};
        formConfig.formConf = pageItems.formConf;
        formConfig.componentList = pageItems.components;
    }
}

getPageData()

</script>
<style lang="scss" scoped>
@import "@/styles/modules/pagelist/appdetail.scss";
</style>