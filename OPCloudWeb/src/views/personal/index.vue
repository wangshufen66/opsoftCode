<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
// import { reactive, ref, onBeforeMount, watch } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
// import menuHeader from '@/components/moduleMenu/header.vue';
// import moduleMenu from '@/components/moduleMenu/menus.vue';

// const router = useRouter();
// const route = useRoute();

// const activeIndex = ref<string>('1');
// const currentTab = ref<string>('个人信息管理');

// const paths = ref<string[]>([]);

// // 菜单点击
// const onTabClick = (item) => {
//   router.push(item.path);
//   // activeIndex.value = `${item.key}`;
// };

// watch(
//   () => route.path,
//   (newVal, oldVal) => {
//     console.log(newVal);
//     console.log(oldVal);

//     if (newVal != oldVal) {
//       if (route.path.indexOf('/personal/infoMange') > -1) {
//         activeIndex.value = '1';
//       }
//       if (route.path.indexOf('/personal/changePwd') > -1) {
//         activeIndex.value = '2';
//       }
//     }
//   }
// );

// const tabList = reactive([
//   {
//     key: 1,
//     title: '个人信息管理',
//     path: '/personal/infoMange',
//     icon: 'opfont opiconxty-caidanlan1',
//   },
//   {
//     key: 2,
//     title: '修改密码',
//     path: '/personal/changePwd',
//     icon: 'opfont opiconxty-caidanlan1',
//   },
// ]);
</script>

<style lang="scss" scoped></style>
