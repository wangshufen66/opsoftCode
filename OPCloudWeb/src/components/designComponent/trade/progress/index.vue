<template>
  <div class="progress-wrap">
    <el-col v-if="dataList.length === 0" :span="component?.__attr__?.childSpan">
      <div class="no-data">暂无工序进度数据</div>
    </el-col>
    <el-col
      class="col-item"
      :span="component?.__attr__?.childSpan"
      v-for="(item, index) in dataList"
    >
      <div class="col-body">
        <label class="col-text">{{ item.progressName }}</label>
        <div class="col-progress">
          <el-progress
            :type="component?.options.type"
            :percentage="item.percentage"
            :stroke-width="5"
            :color="component?.options.color"
            :text-inside="component?.options['text-inside']"
            ref="progressRef"
            :width="60"
          ></el-progress>
          <div class="col-line" v-show="dataList.length !== index + 1"></div>
        </div>
        <p class="col-number">{{ item.current }}/{{ item.total }}</p>
      </div>
    </el-col>
  </div>
</template>

<script lang="ts">
import { PropType, onMounted, ref, watch } from "vue";
import { ProgressComponent } from "./IConfig";
export default {
  name: "designProgress",
  props: {
    component: Object as PropType<ProgressComponent>,
    model: Object,
    // dataArr:Array
  },
  setup(props) {
    const dataList = ref<any>(null);
    watch(
      () => props.model,
      (val) => {
        bindData(val);
      }
    );

    const progressRef = ref<any>(null);

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] = undefined;
      }
    }

    function bindData(val) {
      const type = Object.prototype.toString.call(val);
      if (type === "[object Array]") {
        dataList.value = val;
      } else {
        dataList.value = props.component?.__attr__.data;
      }
    }
    bindData(props.model);
    onMounted(() => {
      init();
    });

    return {
      progressRef,
      dataList,
    };
  },
};
</script>

<style lang="scss" scoped>
.progress-wrap {
  display: inline;
  flex-wrap: wrap;
  // line-height: 40px;
}
.col-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: center;
  justify-content: center;
  font-size: 10px;
}
.col-progress {
  justify-content: center;
  display: flex;
  align-items: center;
}
.col-line {
  border-bottom: 1px solid #000;
  width: 20%;
}
.el-progress--line {
  padding: 0 10px;
}
.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-progress--circle,
.el-progress--dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
