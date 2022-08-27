<template>
    <el-row>
        <div class="area-title" @click="isExpand = !isExpand">
            <div class="area-title-left">
                <div class="area-title-left-icon"></div>
            </div>
            <div class="area-title-content">{{ title }}</div>
            <i
                class="el-icon-arrow-down expand-icon"
                :style="`transform:rotate(${isExpand ? 0 : -90}deg);`"
            ></i>
        </div>
    </el-row>
    <el-row v-show="isExpand">
        <slot></slot>
    </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps(['title'])
const isExpand = ref(true)

</script>

<style scoped lang="scss">
.area-title {
    height: 40px;
    cursor: pointer;

    // background-color: #f2f2f2;
    display: flex;
    align-items: center;
    padding: 10px 0px;
    width: 100%;
    margin: 5px 0px 15px 0px;

    &-left {
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &-icon {
            height: 14px;
            width: 4px;
            background-color: rgb(83, 154, 248);
            border-radius: 4px;
        }
    }

    &-content {
        display: flex;
        flex: 1;
    }

    &-rigth {
        height: 100%;
        width: 100px;
        background-color: blue;
        border-radius: 40%;
    }
}
.expand-icon {
    transform-origin: center;
    transition: transform 0.35s ease-in-out;
}
</style>