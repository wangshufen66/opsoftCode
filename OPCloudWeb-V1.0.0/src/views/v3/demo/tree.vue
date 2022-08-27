<template>
    <div class="m-tree">
        <el-input v-model="searchKey" placeholder="输入关键字进行搜索" />
        <el-tree
            ref="treeRef"
            :data="treeData"
            @node-click="handleNodeClick"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
        />
    </div>
</template>
<!-- :default-expanded-keys="defaultExpandedKeys" -->
<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BuzApi from "@/api/controller/demoUserApi";
import CommonApi from "@/api/controller/commonApi";

import { getStorage, messageAlert } from '@/utils/utils';

var treeData = ref([]);

const getFormData = () => {
    treeData.value = [{
        name: '中国',
        code: 10,
        children: [
            {
                name: '湖北',
                code: 101,
                children: [
                    {
                        code: 103,
                        name: '黄冈市',
                    },
                    {
                        code: 104,
                        name: '咸宁市',
                    },
                ],
            }, {
                name: '湖南',
                code: 102,
                children: [
                    {
                        code: 105,
                        name: '黄冈市',
                    },
                    {
                        code: 106,
                        name: '咸宁市',
                    },
                ],
            },
        ],
    }]
}

const defaultProps = reactive({
    children: 'children',
    label: 'name'
})

const handleNodeClick = (data) => {
    console.log(data)
}

const defaultExpandedKeys = ref([2, 3])

const searchKey = ref(null)
const treeRef = ref(null)


watch(() => searchKey, (newValue) => { //直接监听
    treeRef.tree.filter(newValue)
});

const filterNode = (value, data) => {
    if (!value) return true
    return data.label.indexOf(value) !== -1
}

onMounted(() => {
    getFormData();
})




</script>

<style lang="scss">
.m-tree {
    .el-tree-node__content {
        height: 40px;
    }
}
</style>
