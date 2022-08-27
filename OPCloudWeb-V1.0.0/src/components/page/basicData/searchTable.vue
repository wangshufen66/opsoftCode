<template>
    <div class="search-form-wrap">
        <div class="search-form-left">
            <div>
                <el-button size="small" type="primary" plain @click="onAdd" icon="el-icon-search">添加</el-button>
            </div>
            <div>
                <el-button size="small" type="primary" plain @click="onDel" icon="el-icon-search">删除</el-button>
            </div>
        </div>

        <div class="search-form-right">
            <el-col class="search-form-item" :span="4" v-for="item in searchFormConfig">
                <el-form :model="searchForm">
                    <el-form-item v-bind="item">
                        <el-input v-model="searchForm[item.prop]"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <div>
                <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="onSearch"
                    icon="el-icon-search"
                >搜索</el-button>
            </div>
        </div>
    </div>
    <table-extend v-bind="tableOption"></table-extend>
</template>

<script setup lang="ts">
import tableExtend from '@/components/commontable/index.vue';
// import sidebarTree from '@/components/sidebarTrsee/index.vue';
import { reactive } from 'vue';
interface searFormCfg {
    label: string,
    prop: string
}

const props = defineProps(['tableOption', 'searchFormConfig'])
const emits = defineEmits(['onSearch','onAdd','onDel'])

function prop2obj(arr: searFormCfg[]) {
    const obj = {}
    arr.forEach(i => {
        obj[i.prop] = ''
    })
    return obj
}

const searchForm = reactive(prop2obj(props.searchFormConfig))



const onSearch = () => {
    emits('onSearch', searchForm)
}


</script>

<style scoped lang="scss">
.search-form-wrap {
    display: flex;
    justify-content: space-between;
    .search-form-left {
        display: flex;
        div {
            margin-right: 10px;
        }
    }
    .search-form-right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        .search-form-item {
            margin-right: 10px;
        }
    }
}
</style>