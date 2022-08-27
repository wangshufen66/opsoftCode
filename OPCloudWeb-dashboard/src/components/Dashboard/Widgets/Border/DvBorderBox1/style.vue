<template>
  <div>
    <div v-show="tab === 1">
      <!-- 基础设置 -->
      <basic-settings :activeElement="activeElement" />

    </div>
  </div>
</template>

<script>
import BasicSettings from '../../CommonModule/BasicSettings';

export default {
  name: 'borderDvBorderBox1Style',
  components: {
    BasicSettings,
  },
  props: ['activeElement', 'tab'],
};
</script>
