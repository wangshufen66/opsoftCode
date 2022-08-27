<template>
  <el-select class="id-select" v-bind="$attrs" v-on="$listeners">
    <el-option v-for="item in options" :key="item.value" v-loading="item.authority.idLoad" v-if="item.authority.idIf" v-show="item.authority.idShow" :disabled="item.authority.idDisable" :label="item.label" :value="item.value">
      <slot name="options" :item="item"></slot>
      <!--<span>{{ item.label }}</span>-->
      <!--<span>{{ item.value }}</span>-->
    </el-option>
    <slot name="page"></slot>
  </el-select>
</template>

<script>
export default {
  name: 'id-select',
  props: {
    options: {
      type: Array,
      return() {
        return [];
      },
    },
  },
};
</script>
