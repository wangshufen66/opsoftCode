<template>
    <div class="module-header">
        <i :class="headerClass" @click="menuExpand = !menuExpand"></i>
        <el-breadcrumb class="breadcrumb-separator">
            <template v-for="item in paths" :key="item.name">
                <el-breadcrumb-item v-if="!item.path" class="path-item">{{ item.name }}</el-breadcrumb-item>
                <el-breadcrumb-item v-else class="path-item" :to="item.path" replace>{{ item.name }}</el-breadcrumb-item>
            </template>
        </el-breadcrumb>
    </div>
</template>
  
  <script lang="ts" setup>
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';
import { useStore } from 'vuex';
import type { Breadcrumb } from './type';

const props = defineProps({
    paths: Array as PropType<Breadcrumb[]>,
})

const store = useStore();

// 菜单栏状态
const menuExpand = computed<boolean>({
    get() {
        return store.state.comm.menuExpand;
    }, set(value) {
        store.commit('comm/setMenuExpand', value);
    }
})

const headerClass = computed<string[]>(() => {
    return [
        'breadcrumb-expand',
        'opfont',
        menuExpand.value ? 'opicon-group-left' : 'opicon-group-right'
    ]
})

</script>
  
  <style lang="scss" scoped>
.module-header {
    display: flex;
    height: 48px;
    min-height: 48px;
    align-items: center;
    padding: 0 20px;
}
.breadcrumb-expand {
    margin-right: 15px;
    cursor: pointer;
}
.path-item {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
}
</style>