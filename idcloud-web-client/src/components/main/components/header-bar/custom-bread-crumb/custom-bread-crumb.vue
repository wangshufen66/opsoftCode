<template>
  <div class="custom-bread-crumb">
    <el-breadcrumb>
      <el-breadcrumb-item
        v-for="item in list"
        :to="item.to"
        :key="`bread-crumb-${item.name}`"
      >
        <i :class="item.icon || ''"></i>
        <span> {{ showTitle(item) }}</span>
        <!--'{{' 前有个空格-->
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { showTitle } from "@/libs/util";

export default {
  name: "customBreadCrumb",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    showTitle(item) {
      return showTitle(item, this);
    },
  },
};
</script>
