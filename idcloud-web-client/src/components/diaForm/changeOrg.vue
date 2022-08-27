<template>
  <div>
    <el-dialog
      v-model="orgChangeObj.show"
      :visible.sync="orgChangeObj.show"
      :title="orgChangeObj.title"
      :width="orgChangeObj.width"
      @closed="orgChangeObj.show = false"
    >
      <el-cascader-panel
        v-model="orgChangeObj.data.orgId"
        :props="{ checkStrictly: true, emitPath: false }"
        :options="orgChangeObj.data.orgOptions"
      ></el-cascader-panel>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ orgChangeObj.title }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="orgChangeObj.show = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "changeOrg",
  data() {
    return {};
  },
  props: {
    orgChangeObj: {
      type: Object,
    },
  },
  created() {},
  mounted() {},
  methods: {
    confirm() {
      this.$emit("confirmChangeOrg");
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../styles/diaForm.less";
</style>
