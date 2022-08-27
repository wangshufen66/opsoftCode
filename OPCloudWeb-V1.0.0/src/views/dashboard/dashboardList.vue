<template>
  <!-- <div>大屏设计</div> -->
  <div style="width: 100%; height: 100%">
    <!-- <iframe
      src="http://192.168.0.73:9188/#/datav/project"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe> -->
    <iframe
      :src="srcifrime()"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>
<script lang="ts" setup>
function srcifrime() {
  if (window.location.host.indexOf("localhost") > -1) {
    return "http://localhost:9001/#/datav/project";
  } else if (window.location.host.indexOf("192.168.0.145") > -1) {
    return "http://192.168.0.145:9188/#/datav/project";
  } else if (window.location.host.indexOf("192.168.0.73") > -1) {
    return "http://192.168.0.73:9188/#/datav/project";
  } else if (window.location.host.indexOf("demo.opsoft.com.cn") > -1) {
    return "http://demo.opsoft.com.cn:9900/dashboard/#/datav/project";
  }else if (window.location.host.indexOf("test.opcloud.com") > -1) {
    return "http://test.opcloud.com:9188/dashboard/#/datav/project";
  }
}
</script>
