<template>
  <!-- <div>大屏设计design</div> -->
  <!-- <iframe src="http://192.168.0.73:9188/#/datav/template" width="100%" height="100%" frameborder="0"></iframe> -->
  <iframe
    :src="ifrimesrc()"
    width="100%"
    height="101%"
    frameborder="0"
  ></iframe>
</template>

<script lang="ts" setup>
function ifrimesrc() {
  if (window.location.host.indexOf("localhost") > -1) {
    return "http://localhost:9001/#/datav/template";
  } else if (window.location.host.indexOf("192.168.0.145") > -1) {
    return "http://192.168.0.145:9188/#/datav/template";
  } else if (window.location.host.indexOf("192.168.0.73") > -1) {
    return "http://192.168.0.73:9188/#/datav/template";
  } else if (window.location.host.indexOf("demo.opsoft.com.cn") > -1) {
    return "http://demo.opsoft.com.cn:9900/dashboard/#/datav/template";
  }else if (window.location.host.indexOf("test.opcloud.com") > -1) {
    return "http://test.opcloud.com:9188/dashboard/#/datav/template";
  }
}
</script>
