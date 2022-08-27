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

// 获取页面配置
async function getPageConfig() {

}

getPageConfig()

</script>
<style lang="scss" scoped>
@import "@/styles/modules/pagelist/appdetail.scss";
</style>