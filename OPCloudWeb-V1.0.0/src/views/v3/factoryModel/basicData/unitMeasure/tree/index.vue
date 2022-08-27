<template>
    <div class="m-tree">
        <el-button-group class="m-tree-tool">
            <div
                v-if="activeNode && activeNode.level == -1"
                class="each"
                @click.stop="editDialog.show({ row: null, showType: 2 })"
            >
                <i class="el-icon-plus"></i>
            </div>
            <div
                v-if="activeNode && activeNode.level == 0"
                class="each"
                @click.stop="editDialog.show({ row: activeNode, showType: 2 })"
            >
                <i class="el-icon-edit" :disabled="currentNodeKey.length == 0"></i>
            </div>
            <div class="each" @click.stop="del">
                <i class="el-icon-delete"></i>
            </div>
            <div class="each" @click.stop="refresh">
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

        <!-- <div>{{ JSON.stringify(activeNode) }}</div> -->

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
        >
            <template #default="{ node, data }">
                <div
                    :class="{ 'custom-tree-node': true, active: activeNode && data.id == activeNode.id }"
                >{{ node.label }}</div>
            </template>
        </el-tree>
    </div>

    <div class="fixedDialog">
        <el-dialog
            v-model="editDialog.reactiveData.visible"
            :destroy-on-close="true"
            width="700px"
        >
            <template #title>
                <dialog-title title="新增或编辑"></dialog-title>
            </template>
            <edit ref="editRef" :param="editDialog.reactiveData.param" />
            <template #footer>
                <el-button @click="editDialog.hide()">取消</el-button>
                <el-button
                    v-if="editDialog.reactiveData.param.showType == 2 || editDialog.reactiveData.param.showType == 4"
                    type="primary"
                    @click="editDialog.onConfirm(null)"
                >保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, watch, getCurrentInstance, useSlots } from "vue";
import { useRoute, useRouter } from "vue-router";

import CommonApi from "@/api/controller/commonApi";
import GroupApi from "@/api/controller/unitMeasureGroupApi";
import useDialog from "@/views/v3/out/useDialog";
import { getStorage, messageAlert, confirmBox } from '@/utils/utils';
const props = defineProps(['fetchController'])
const fetchController = GroupApi
import edit from './edit.vue'

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

        console.log(allArr, '======data======')

        var zeroLevelArr = allArr.filter(x => (x.parentId == null || x.parentId == ''))
        zeroLevelArr.forEach(item => flatToTree(item, allArr))

        var topEntity = {
            id: '',
            code: '',
            parentId: '',
            fullName: '',
            fullPath: '',
            level: -1,
            name: '全部',
            children: []
        }
        topEntity.children = zeroLevelArr
        treeData.value = [topEntity]

        console.log(topEntity, '=======topEntity=======')
    })
}

const defaultProps = reactive({
    children: 'children',
    label: 'name'
})

var activeNode = ref({
    id: '',
    level: -1
});
var currentNodeKey = ref('')

const handleNodeClick = (node, ab) => {
    node._value = node.id
    node._text = node.name
    activeNode.value = {
        ...node
    }
    currentNodeKey.value = node.id || ''
    emit('on-node-click', node)
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

const refresh = () => {
    getFormData()
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

const editRef = ref(null)
const editDialog = useDialog({
    _param: {
        showType: 1, //1查看 2新增  4编辑
        id: '',
        entity: null
    },
    _hide: () => {
        getFormData()
    },
    _show: ({ row, showType = 0 }) => {


        editDialog.reactiveData.param.showType = showType
        editDialog.reactiveData.param.id = row ? row["id"] : '';

        //新增
        if (row == null) {

            var _newRow = {
                id: '',
                code: '',
                parentId: '',
                fullName: '',
                fullPath: '',
                level: -1,
                name: '全部',
                children: [],
                ...activeNode.value
            }

            editDialog.reactiveData.param.entity = {
                id: '',
                code: '',
                fullName: '',
                fullPath: '',
                name: '',
                children: [],
                isDeleted: '0',
                level: _newRow.level + 1,
                parentId: _newRow.id,
                parentName: _newRow.name
            };
        } else {
            editDialog.reactiveData.param.entity = {
                ...row,
            };
        }


        editDialog.reactiveData.visible = true
    },
    _onConfirm: (_rows) => {
        editRef.value.submit().then((res) => {
            getFormData()
            editDialog.reactiveData.visible = false;
        });
    }
})



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
