<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="子组件栅格">
      <el-slider v-model="componentCfg.__attr__.childSpan" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <div class="divider-wrap progress-list-header">基本信息</div>
    <el-form-item label="进度条类型">
      <el-select v-model="selectProgress.type" style="width: 100%" @change="typeChange">
        <el-option label="线形" value="line"></el-option>
        <el-option label="环形" value="circle"></el-option>
        <el-option label="仪表盘形" value="dashboard"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="进度条粗细">
      <el-input type="number" max="100" min="0" v-model.number="selectProgress['stroke-width']" @input="widthChange(selectProgress['stroke-width'])"></el-input>
    </el-form-item>
    <el-form-item label="进度条文字" v-show="selectProgress.type === 'line'">
      <el-select v-model.boolean="selectProgress['text-inside']" style="width: 100%">
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="工序1进度">
      <el-input type="number" max="100" min="0" v-model.number="selectData.percentage" @input="percentageChange(selectData.percentage)"></el-input>
    </el-form-item>
    <el-form-item label="工序预览数">
      <el-input type="number" max="6" min="1" v-model.number="selectProgress.count" @change="countChange(selectProgress.count)"></el-input>
    </el-form-item>
    <div class="divider-wrap progress-list-header">进度条颜色</div>
    <el-row v-for="(item, index) in selectProgress.color" class="progress-color-item">
      <el-col :span="1">
        <p class="color-index">{{ index + 1 }}</p>
      </el-col>
      <el-col :span="8">
        <el-form-item label="起始" label-width="35px">
          <el-input type="number" max="100" min="0" v-model.number="item.begin" :disabled="index === 0" @change="colorBeginChange(item, index)"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="结束" label-width="35px">
          <el-input type="number" max="100" min="0" v-model.number="item.end" @change="colorEndChange(item, index)"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="颜色" label-width="35px">
          <el-color-picker v-model="item.color"></el-color-picker>
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <div class="remove-color">
          <i class="el-icon-remove-outline" @click="removeColor(index)"></i>
        </div>
      </el-col>
    </el-row>
    <div class="color-additem">
      <el-button class="btn-operate" icon="el-icon-circle-plus-outline" type="text" @click="addColorRange">添加</el-button>
    </div>
  </el-form>
  <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>
</template>

<script lang="ts">
import { PropType, reactive, ref, watch } from "vue";
import draggable from "vuedraggable";
import { ProgressComponent } from "./IConfig";
import { ElMessage } from "element-plus";

export default {
  name: "ProgressProperty",
  components: { draggable },
  props: {
    componentCfg: Object as PropType<ProgressComponent>,
  },
  setup(props, { emit }) {
    const formModel = reactive({});

    const formRules = reactive({});

    /**工序进度样式配置*/
    const selectProgress = ref<any>(props.componentCfg?.options);

    /**选中的工序数据 */
    const selectData = ref<any>(props.componentCfg?.__attr__.data[0]);

    watch(
      () => props.componentCfg?.componentId,
      () => {
        selectProgress.value = props.componentCfg?.options;
        selectData.value = props.componentCfg?.__attr__.data[0];
      }
    );

    /**进度条类型改变*/
    function typeChange() {
      if (selectProgress.value.type !== "line") {
        selectProgress.value["text-inside"] = false;
      }
    }

    /**进度条粗细改变*/
    function widthChange(val) {
      if (val > 100) {
        selectProgress.value["stroke-width"] = 100;
      } else if (val < 0 || val === "") {
        selectProgress.value["stroke-width"] = 0;
      }
    }
    /**进度条值改变*/
    function percentageChange(val) {
      selectData.value.current = val;
      if (val > 100) {
        selectData.value.percentage = 100;
        selectData.value.current = 100;
      } else if (val < 0 || val === "") {
        selectData.value.percentage = 0;
        selectData.value.current = 0;
      }
    }
    /**生成随机数据数组*/
    function randomDate(num) {
      return Array.from(Array(num), (v, k) => {
        let randomNumber = Math.round(Math.random() * (100 - 10) + 10);
        return {
          progressName: `工序${k + 2}`,
          current: randomNumber,
          total: 100,
          percentage: randomNumber,
        };
      });
    }

    /**工序进度预览数改变*/
    function countChange(num) {
      if (num > 6) {
        ElMessage.warning("最多生成6个预览的工序");
        selectProgress.value.count = 6;
      } else if (num <= 0 || num === "") {
        selectProgress.value.count = 1;
      }
      props.componentCfg?.__attr__.data.splice(1);
      if (num === 1) {
        return;
      }
      props.componentCfg?.__attr__.data.push(
        ...randomDate(selectProgress.value.count - 1)
      );
      // selectData.value = props.componentCfg?.__attr__.data[0];
    }

    /**添加颜色*/
    function addColorRange() {
      const length = selectProgress.value.color.length;
      let begin = 0,
        end = 1;
      if (length >= 1) {
        const value = selectProgress.value.color[length - 1].end;
        if (value === 100) {
          ElMessage.warning("结束值已满不能继续添加");
          return;
        }
        begin = value + 1;
        end = value + 2;
      }
      selectProgress.value.color.push({
        percentage: end + 1,
        color: "",
        begin,
        end,
      });
    }

    /**颜色起始值改变*/
    function colorBeginChange(obj, index) {
      const { begin, end } = obj;
      //上一条数据的结束值
      const prevVal = selectProgress.value.color[index - 1];

      if (begin >= end) {
        selectProgress.value.color[index].begin = end - 1;
        ElMessage.warning("起始值不能大于结束值");
      } else if (begin < 0 || begin === "") {
        //没有值输入
        selectProgress.value.color[index].begin = prevVal.end + 1;
      } else if (begin <= prevVal.end) {
        ElMessage.warning("起始值不能小于等于上一条数据的结束值");
        selectProgress.value.color[index].begin = prevVal.end + 1;
      }
      selectProgress.value.color[index].percentage =
        selectProgress.value.color[index].end + 1;
    }
    /**颜色结束值改变*/
    function colorEndChange(obj, index) {
      const { begin, end } = obj;
      if (end > 100) {
        selectProgress.value.color[index].end = 100;
      } else if (end < 0 || end === "") {
        selectProgress.value.color[index].end = 0;
      }
      if (end <= begin) {
        ElMessage.warning("结束值不能小于起始值");
        selectProgress.value.color[index].end = begin + 1;
        return;
      }

      // 判断是不是最后一条
      if (index !== selectProgress.value.color.length - 1) {
        //获取下一段颜色的值
        const nextVal = selectProgress.value.color[index + 1];
        if (end >= nextVal.begin) {
          selectProgress.value.color[index].end = nextVal.begin - 1;
          ElMessage.warning(
            "结束值不能大于等于下一条数据的起始值,请删除下一条数据或重新输入"
          );
          return;
        }
      }
      selectProgress.value.color[index].percentage =
        selectProgress.value.color[index].end + 1;
    }
    /**删除颜色*/
    function removeColor(index) {
      const tempArr = selectProgress.value.color;
      if (tempArr.length === 1) {
        ElMessage.warning("至少保留一条颜色信息");
        return;
      }
      if (index !== tempArr.length - 1) {
        tempArr[index + 1].begin = tempArr[index].begin;
      }
      selectProgress.value.color.splice(index, 1);
    }

    return {
      formModel,
      formRules,
      selectProgress,
      selectData,
      countChange,
      typeChange,
      widthChange,
      percentageChange,
      colorBeginChange,
      colorEndChange,
      addColorRange,
      removeColor,
    };
  },
};
</script>
<style lang="scss" scoped>
.progress-list-header {
  padding: 0;
}

.color-index {
  transform: translateY(25%);
  font-size: 15px;
}
.color-additem {
  transform: translateY(-10px);
}
.remove-color {
  color: #f86a6a;
  transform: translateY(25%);
  cursor: pointer;
}
</style>
