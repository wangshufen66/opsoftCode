<template>
  <el-select class="id-group-select"
             v-model="vModel"
             v-bind="$attrs"
             v-on="$listeners"
  >
    <el-option-group
      v-for="group in options"
      :key="group.label"
      :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        v-loading="item.authority.idLoad"
        v-if="item.authority.idIf"
        v-show="item.authority.idShow"
        :disabled="item.authority.idDisable"
        :value="item.value">
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
  export default {
    name: "id-group-select",
    data() {
      return {
        vModel: '',
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
  }
</script>
