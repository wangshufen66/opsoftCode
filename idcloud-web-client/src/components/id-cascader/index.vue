<template>
  <el-cascader
    class="id-cascader"
    v-model="vModel"
    :options="options"
    v-bind="$attrs"
    v-on="$listeners"
  >
  </el-cascader>
</template>

<script>
  export default {
    name: "id-cascader",
    data() {
      return {
        vModel: [],
      }
    },
    props: {
      options: {
        type: Array,
        return() {
          return [];
        },
      },
    },
    methods: {
      setVModel(value) {
        this.vModel = value;
      },
    },
  }
</script>

<style scoped>

</style>
