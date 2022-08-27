<template>
  <div :ref="$options.name" class="default-profile-chart"/>
</template>

<script>
import chartDefault from './mixins/chart-default'
export default {
  name: 'DefaultProfileChart',
  mixins: [chartDefault],
  data() {
    return {
      optionName: 'defaultProfileOption'
    }
  }
}
</script>

<style lang='scss' scoped>
    .default-profile-chart {
        width: 100%;
        height: 90%;
    }
</style>
