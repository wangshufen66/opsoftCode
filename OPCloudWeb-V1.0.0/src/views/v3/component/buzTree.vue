<template>
    <div class="m-tree">
        <el-button-group class="m-tree-tool">
            <div class="each" @click="onCmd('add')">
                <i class="el-icon-plus"></i>
            </div>
            <div class="each" @click="onCmd('edit')">
                <i class="el-icon-edit" :disabled="currentNodeKey.length == 0"></i>
            </div>
            <div class="each" @click="del">
                <i class="el-icon-delete"></i>
            </div>
            <div class="each" @click="refresh">
                <i class="el-icon-refresh"></i>
            </div>
        </el-button-group>
        <div class="m-tree-search">
            <el-input
                style="margin:0px"
                suffix-icon="el-icon-search"
                v-model="searchKey"
                placeholder="搜索暂不可用"
            />
        </div>

        <el-tree
            ref="treeRef"
            :data="treeData"
            @node-click="handleNodeClick"
            :props="defaultProps"
            node-key="id"
            :default-expand-all="defaultExpandAll"
            :current-node-key="currentNodeKey"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :default-expanded-keys="['']"
        ></el-tree>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, watch, getCurrentInstance, useSlots } from "vue";
import { useRoute, useRouter } from "vue-router";

import CommonApi from "@/api/controller/commonApi";

import { getStorage, messageAlert, confirmBox } from '@/utils/utils';
const props = defineProps(['fetchController', 'cmdSub'])
const fetchController = props.fetchController
const emit = defineEmits(['on-node-click', 'on-cmd'])

var treeData = ref([]);

const flatToTree = (item, arr) => {
    var sonArr = arr.filter(x => x.parentId == item.id)
    sonArr.forEach(one => {
        flatToTree(one, arr)
    })
    item['children'] = sonArr
}

const getFormData = () => {
    fetchController.GetList({}).then(res => {
        var allArr = res.data
        var zeroLevelArr = allArr.filter(x => (x.parentId == null || x.parentId == ''))
        zeroLevelArr.forEach(item => flatToTree(item, allArr))

        var topEntity = {
            id: '',
            code: '',
            parentId: '',
            fullName: '',
            fullPath: '',
            level: -1,
            name: '全部', children: []
        }
        topEntity.children = zeroLevelArr
        treeData.value = [topEntity]
    })
}

watch(() => props.cmdSub, () => {
    refresh()
})

const defaultProps = reactive({
    children: 'children',
    label: 'name'
})

var activeNode = ref(null);
var currentNodeKey = ref('')

const handleNodeClick = (node) => {
    emit('on-node-click', node)

    console.log(node, '0000000000000')

    activeNode.value = {
        ...node,
        _value: node.id,
        _text: node.name,
    }
    currentNodeKey.value = node.id || ''
}

const searchKey = ref(null)
const treeRef = ref(null)
const defaultExpandAll = ref(false)

const expandAll = (b) => {
    defaultExpandAll.value = b
}

watch(() => searchKey.value, (val) => treeRef.value.filter(val))

const filterNode = (value, data) => {
    if (!value) return true
    return data.name.indexOf(value) !== -1
}

//删除
const del = async () => {
    var _currentNodeKey = currentNodeKey.value || ''
    if (_currentNodeKey.length == 0) {
        messageAlert('error', "请至少勾选一行")
        return false
    }

    var ids_arr = [_currentNodeKey]
    confirmBox("删除数据", async () => {
        var res = await fetchController.Delete(ids_arr);
        if (res.code == 200) {
            messageAlert('success', '保存成功')
            getFormData()
        } else {
            messageAlert('error', res.msg)
        }
        console.log(res, '====changeStatus=======')
    })
};

const refresh = () => {
    getFormData()
}

const onCmd = (obj) => {
    emit('on-cmd', obj)
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

    height: 100%;
    position: relative;
}

.el-tree-node {
    position: relative;
}

.right-more {
    width: 16px;
    height: 16px;
    background-color: #ccc;
    position: absolute;
    right: 8px;
    top: 12px;
}
.m-tree-search {
    width: calc(100% - 12px);
    margin: 6px auto;
}

.m-tree-tool {
    width: 100%;
    margin-bottom: 0px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px #ccc solid;
    height: 44px;

    .each {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        height: 100%;

        &:hover {
            background-color: #f2f2f2;
        }

        &:active {
            background-color: #ccc;
        }
    }
}

.m-tree {
    .el-tree-node__content {
        height: 40px;
    }
}
</style>
