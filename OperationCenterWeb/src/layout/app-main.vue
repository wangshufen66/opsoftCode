<template>
  <div class="main-container">
    <div class="main-wrap">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>
