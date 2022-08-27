<template>
  <div></div>
</template>

<script>
// import AMap from "AMap";
// import AMapUI from "AMapUI";
export default {
  mounted() {
    if (AMap) {
      AMap.plugin('AMap.Geolocation', () => {
        new AMap.Geolocation().getCurrentPosition((status, result) => {
          console.log('result', result);
          this.$store.commit('setUserLocation', {
            province: result.addressComponent
              ? result.addressComponent.province
              : '',
            city: result.addressComponent ? result.addressComponent.city : '',
            district: result.addressComponent
              ? result.addressComponent.district
              : '',
            formattedAddress: result.formattedAddress,
            lng: result.position.lng + '',
            lat: result.position.lat + '',
          });
        });
      });
    }
  },
};
</script>

<style></style>
