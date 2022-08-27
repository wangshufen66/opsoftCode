<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less" scoped>
#app {
  ::v-deep {
    .ivu-layout-header {
      height: 50px;
    }
    .ivu-layout {
      background: #fff;
    }
  }
}
</style>
<style lang="less">
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
  scrollbar-arrow-color: red;
}
* {
  font-family: PingFangSC, PingFangSC-Regular;
}

::v-deep {
  .ivu-select-selected-value {
    line-height: 28px;
  }
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
  scrollbar-arrow-color: red;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: #ffffff;
}

.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
#app {
  .size;
  overflow-y: scroll;
}
</style>
