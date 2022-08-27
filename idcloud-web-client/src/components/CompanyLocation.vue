<template>
  <div style="width: 250px; height: 250px;" :id="`mapContainer${uid}`"></div>
</template>

<script>
// import AMap from "AMap";
// import AMapUI from "AMapUI";


export default {
  data() {
    return {};
  },
  props: {
    uid: 0,
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      try {
        //   公司经纬度
        const ns = ["120.73243", "31.264719"];
        let map = new AMap.Map(`mapContainer${this.uid}`, {
          resizeEnable: true, //是否监控地图容器尺寸变化
          zoom: 18, //初始化地图层级
          center: ns, //初始化地图中心点
        });
        map.clearMap();
        let marker = new AMap.Marker({
          map: map,
          title: "江苏欧软信息科技有限公司",
          icon:
            "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
          position: ns,
          offset: new AMap.Pixel(-24, -58),
        });
        marker.on("click", (m) => {
          AMap.plugin("AMap.Geolocation", () => {
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,
              timeout: 10000,
              //   buttonPosition: "RB",
              //   buttonOffset: new AMap.Pixel(10, 20),
              panToLocation: false,
              zoomToAccuracy: false,
              showButton: false,
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition((status, result) => {
              if (status == "complete") {
                window.open(
                  `https://uri.amap.com/navigation?from=${result.position.lng},${result.position.lat},startpoint&to=${ns[0]},${ns[1]},endpoint&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`
                );
              } else {
                window.open(
                  `https://uri.amap.com/marker?position=${ns[0]},${ns[1]}&name=欧软信息科技有限公司&src=mypage&coordinate=gaode&callnative=0`
                );
              }
            });
          });
        });
        map.setFitView();
      } catch (e) {
        console.log(e);
        this.$message("初始化地图失败");
      }
    },
  },
};
</script>

<style>
</style>
