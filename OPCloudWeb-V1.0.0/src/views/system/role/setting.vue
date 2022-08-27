<template>
    <el-dialog v-model="visible" @close="onClose" destroy-on-close width="800px">
        <template v-slot:title>
            <dialog-title title="角色授权"></dialog-title>
        </template>
        <el-scrollbar height="60vh">
            <el-tree
                ref="treeRef"
                :data="menu.data"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :default-checked-keys="menu.checks"
            ></el-tree>
        </el-scrollbar>
        <template #footer>
            <el-button @click="onCloseAll">收缩</el-button>
            <el-button @click="onExpend">展开</el-button>
            <el-button @click="onClose">取 消</el-button>
            <el-button type="primary" :loading="saveLoading" @click="onSave">保 存</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { getRoleAuthList, givePermissions } from '@/api/system';
import { messageAlert } from '@/utils/utils';
import { ref, reactive, watch } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: () => false
    },
    rkey: String
})

function onExpend() {
    const nodes = treeRef.value.store.nodesMap;
    Object.keys(nodes).forEach(key => {
        nodes[key].expanded = true
    })
}

function onCloseAll() {
    const rootNodes = treeRef.value.store.root.childNodes;
    rootNodes.forEach(node => {
        node.expanded = false
    });
}

const emit = defineEmits(["update:visible"])

const treeRef = ref<any>();

const saveLoading = ref<boolean>(false);
//菜单树
const menu = reactive<Record<string, any[]>>({
    data: [],
    checks: [],
});

watch(() => props.visible, (visible) => {
    visible && roleAuthList()
})

// 关闭
function onClose() {
    menu.data = []
    menu.checks = []
    emit("update:visible", false);
}

//获取菜单树
async function roleAuthList() {
    const res = await getRoleAuthList({ roleId: props.rkey });
    if (res.code === 200) {
        const { permissionTree, permissions } = res.data;
        // 数据处理
        const treeData = [{
            id: "1",
            isLeaf: false,
            label: "应用菜单",
            children: permissionTree[1],
        }, {
            id: "0",
            isLeaf: false,
            label: "系统菜单",
            children: permissionTree[0]
        }]
        menu.data = treeData
        menu.checks = res.data?.permissions || [];
    }
}

//保存授权
async function onSave() {
    saveLoading.value = true;
    const menuOrFuncId: string[] = treeRef.value.getCheckedKeys(true);
    let res = await givePermissions({
        menuOrFuncId: menuOrFuncId.toString(),
        roleId: props.rkey,
    });
    saveLoading.value = false;
    if (res.code === 200) {
        messageAlert('success', res.msg)
        onClose()
    }
}
</script>

<style lang="scss" scoped>
</style>