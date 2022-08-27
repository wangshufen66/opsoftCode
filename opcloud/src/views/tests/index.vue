<template>
  <div class="test-wrap">
    <div class="loading-icon loading-icon1"></div>
    <div class="loading-icon loading-icon2"></div>
    <div class="loading-icon loading-icon3"></div>
  </div>
</template>

<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.test-wrap {
  border: 1px solid #eee;
  margin: 100px;
  width: 300px;
  height: 200px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.loading-icon {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}
.loading-icon1 {
  background-color: rgb(255, 54, 39);
  animation: loading1 2s infinite linear both;
}
.loading-icon2 {
  background-color: rgb(255, 211, 79);
  animation: loading2 2s infinite linear both;
}
.loading-icon3 {
  background-color: rgb(64, 170, 255);
  animation: loading3 2s infinite linear both;
}

@keyframes loading1 {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  33% {
    transform: translateX(119px) scale(2);
    opacity: 1;
  }
  66% {
    transform: translateX(238px) scale(1);
    opacity: 0;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes loading2 {
  0% {
    transform: translateX(0) scale(2);
    opacity: 1;
  }
  33% {
    transform: translateX(119px) scale(1);
    opacity: 0;
  }
  66% {
    transform: translateX(-119px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(0) scale(2);
    opacity: 1;
  }
}
@keyframes loading3 {
  0% {
    transform: translateX(0) scale(1);
    opacity: 0;
  }
  33% {
    transform: translateX(-238px) scale(1);
    opacity: 1;
  }
  66% {
    transform: translateX(-119px) scale(2);
    opacity: 1;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 0;
  }
}
</style>