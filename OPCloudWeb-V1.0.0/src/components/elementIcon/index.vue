<template>
    <el-icon :size="size" :color="color">
        <component :is="name"></component>
    </el-icon>
</template>

<script lang="ts">

export default {
    name: 'Icon',
    props: {
        /**图标颜色 */
        color: String,
        /**图标大小 */
        size: Number,
        /**图标名称，名称严格遵守https://element-plus.org/#/zh-CN/component/icon#svg-tu-biao-ji-he */
        name: String,
    }
}
</script>