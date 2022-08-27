<template>
  <el-radio-group class="id-radio" v-model="vModel" v-bind="$attrs" v-on="$listeners">
    <!--
    暂时只有 el-radio-button  版本
    后续的人可以补上 el-radio 版本   用动态组件做即可
    -->
    <el-radio-button
      v-for="(item,index) in options"
      :key="index"
      v-loading="item.authority.idLoad"
      v-if="item.authority.idIf"
      v-show="item.authority.idShow"
      :disabled="item.authority.idDisable"
      :label="item.label"
    >
    </el-radio-button>
  </el-radio-group>
</template>
<style lang="less" scoped>
  .id-radio {
    margin-right: 6px;
  }

  /deep/ .el-radio-button__inner, .el-radio-group {
    vertical-align: 0;
  }

  /deep/ .el-radio-button__inner {
    border: 0 !important;
    font-size: 14px;
  }
  /deep/.el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
    box-shadow: 0 0 0 0 transparent !important;
  }
</style>
<script>
  export default {
    name: "id-radio",
    props: {
      options: {
        type: Array,
        return() {
          return [];
        },
      },
      defaultValue: {type: String, default: '',}
    },
    data() {
      return {
        vModel: "",
      }
    },
    created() {
      this.vModel = this.defaultValue;
    },
    methods:{
      setVModelEmpty(){
        this.vModel="";
      },
    }
  }
</script>
