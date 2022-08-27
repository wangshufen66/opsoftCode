<template>
<transition>
  <keep-alive :max="10">
    <router-view></router-view>
  </keep-alive>
</transition>
</template>

<script>
export default {
}
</script>

<style>

</style>
