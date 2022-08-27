<template>
  <div class="main-container">
    <page-tabs
      class="page-tabs"
      :activeName="activePageTab"
      :tabs="layoutState?.pageTabList.value"
      @on-tab-click="onPageTabClick"
      @on-tab-remove="onPageTabRemove"
    ></page-tabs>
    <div class="route-container" :style="homeStyle">
      <router-view v-if="routeViewDisplay" v-slot="{ Component }">
        <!-- <transition name="scale-slide"> -->
        <!-- <keep-alive> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
        <!-- </transition> -->
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import PageTabs from '@/components/pageTab/index.vue';
import useLayout from '@/hooks/use-layout';

const { layoutState, menuLayout, activePageTab, routeViewDisplay, loadTabRoute, closeTab } = useLayout();

const route = useRoute();

const homeStyle = computed(() => {
  return route.path === '/home' && {
    padding: 0,
    backgroundColor: 'initial'
  } || {}
})

function onPageTabClick(tab) {
  loadTabRoute(tab);
}

function onPageTabRemove(name: string) {
  closeTab(name);
}

</script>
