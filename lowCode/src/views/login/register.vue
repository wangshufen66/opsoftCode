<template>
  <div>
    <el-button @click="onBack">返回</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import mitt from 'mitt';

const props = defineProps({})

const router = useRouter()

const emitter = mitt()

function onBack() {
  router.go(-1)
}

onMounted(() => {
  emitter.on("hello1", () => {
    console.log("mitt is hello1")
  })
})

</script>
<style lang="scss" scoped>
</style>