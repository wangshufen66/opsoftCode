<template>
  <div class="login-container">
    <div class="banner-wrap"></div>
    <div class="login-wrap"></div>
    <el-button @click="onRegister">注册</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, useSlots, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import mitt from 'mitt';
import { fetch } from '@/shared/utils/request'

const props = defineProps({})

const router = useRouter()

const emitter = mitt()

const formRef = ref<any>(null);

const formModel = reactive({
  name: "luhuiming"
})

// 注册
function onRegister(): void {
  router.push('/register')
}

onMounted(() => {
  emitter.on("hello", () => {
    console.log("mitt is hello")
  })
  fetch("get", '/api/opcloud/application/apps/getUserMenuList', { params: { a: "a0" } }).then(res => {
    debugger
  })
  fetch("get", '/api/opcloud/application/apps/getUserMenuList', { params: { a: "a1" } }).then(res => {
    debugger
  }).catch((err) => {
    debugger
  })
  fetch("get", '/api/opcloud/application/apps/getUserMenuList', { params: { a: "a2" } }).then(res => {
    debugger
  }).catch(() => {
    debugger
  })
  fetch("get", '/api/opcloud/application/apps/getUserMenuList', { params: { a: "a3" } }).then(res => {
    debugger
  }).catch(() => {
    debugger
  })
})

</script>

<style lang="scss" scoped>
@import "@/styles/modules/login.scss";
</style>