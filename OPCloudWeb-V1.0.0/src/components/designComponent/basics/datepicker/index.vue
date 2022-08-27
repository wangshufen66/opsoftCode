<template>
  <el-date-picker
    v-model="model[component.__vModel__]"
    :type="component.__config__.type"
    v-bind="component.__attr__"
    :shortcuts="shortcuts"
  ></el-date-picker>
</template>

<script lang="ts">
import { PropType, onMounted, ref } from 'vue';
import { DatePickerComponent } from './IConfig';
import dayjs from 'dayjs';

type Shortcut = {
  text?: string;
  value?: Date | string;
};

export default {
  name: 'designDatePicker',
  props: {
    component: Object as PropType<DatePickerComponent>,
    model: Object,
  },
  setup(props) {

    const shortcuts = ref<Shortcut[]>([
      {
        text: '今日',
        value: dayjs(new Date()).format('YYYY-MM-DD'),
      },
      {
        text: '昨日',
        value: (() => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return dayjs(date).format('YYYY-MM-DD');
        })(),
      },
      {
        text: '明天',
        value: (() => {
          const date = new Date();
          date.setTime(date.getTime() + 3600 * 1000 * 24);
          return dayjs(date).format('YYYY-MM-DD');
        })()
      },
      {
        text: '上个月',
        value: (() => {
          const date = new Date();
          let year: number = date.getFullYear();
          let month: number = date.getMonth();
          if (month == 0) {  // month 的取值范围为0-11
            year--;
            month = 11
          }
          else {
            month--;
          }
          date.setMonth(month);
          date.setFullYear(year);
          return dayjs(date).format('YYYY-MM-DD');
        })()
      },
      {
        text: '下个月',
        value: (() => {
          const date = new Date();
          let year: number = date.getFullYear();
          let month: number = date.getMonth();
          if (month == 11) {
            year++;
            month = 0;
          } else {
            month++;
          }
          date.setMonth(month);
          date.setFullYear(year);
          return dayjs(date).format('YYYY-MM-DD');
        })()
      }
    ]);

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.component.__config__.defaultValue === 1 ? new Date() : undefined;
      }
    }

    onMounted(() => {
      init();
    });

    return {
      shortcuts,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>