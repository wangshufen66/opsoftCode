<template>
  <div class="container">
    <div class="header-wrapper">
      <div class="select-wrapper">
        <el-dropdown @command="requestEnvironmentAnalysisLocationTableData">
          <el-button size="small" type="primary">
            {{selectLeftColumn}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in selectLeftSelections"
                              :key="index"
                              :value="item.value"
                              :command="item.value">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="search-wrapper">
        <Select
          v-model="selectSearchColumn"
          style="width: 7.9rem"
        >
          <Option
            v-for="(item, index) in selectSearchColumnSelections"
            :key="index"
            :value="item.key"
          >{{ item.title }}
          </Option>
        </Select>
        <Input
          v-model="search"
          clearable
          placeholder="请输入"
          class="option-input"
          style="width:14rem;margin-left: 4px;"
          @on-enter="handleSearch"
        />
        <el-button
          class="search-btn"
          ref="searchButton"
          type="primary"
          circle
          icon="el-icon-search"
          size="mini"
          style="margin: 0.1rem 0.45rem 0.15rem 0.55rem;"
          @click="handleSearch"
        ></el-button>
      </div>
    </div>
    <div class="body-wrapper" v-loading="mapLoading" :style="mapStyle" id="body-wrapper">
    </div>
  </div>
</template>

<script>
  import {location} from "@/api/environmentMonitor/environmentAnalysis"
  // import AMap from 'AMap'; //在页面中引入高德地图
  // import AMapUI from 'AMapUI'; //在页面中引入高德地图组件

  export default {
    name: "monitoring_point_location",
    data() {
      return {
        //左侧选择栏
        selectLeftColumn: '用电监测点',
        selectLeftSelections: [
          // {
          //   value: '0',
          //   label: '全部监测点',
          // },
          {
            value: '3',
            label: '用电监测点',
          },
          {
            value: '4',
            label: '用水监测点',
          },
          {
            value: '5',
            label: '气压监测点',
          },
          {
            value: '6',
            label: '温度监测点',
          },
          {
            value: '7',
            label: '湿度监测点',
          },
          {
            value: '8',
            label: '燃气监测点',
          },
        ],
        //右侧搜索框
        selectSearchColumn: 'monitorNumber',
        selectSearchColumnSelections: [
          // {
          //   title: '监测点代码',
          //   key: 'monitorNumber',
          //   width: '250',
          //   type: 'text',
          // },
          // {
          //   title: '监测点名称',
          //   key: 'monitorName',
          //   width: '250',
          //   type: 'text',
          // }
        ],
        search: '',
        //地图相关
        mapLoading: false,
        map: null,
        mapStyle: {
          width: 100 + '%',
          height: `${document.documentElement.clientHeight}` - 180 + 'px',
        },//map样式
      }
    },
    mounted() {
      // this.getContainerTreeFunc()  //
      this.initAMap()   //加载地图和相关组件
    },
    destroy() {
      this.map.destroy()
    },
    methods: {
      handleSearch() {
        alert(this.search)
      },
      //地图初始化
      initAMap() {
        let that = this
        that.map = new AMap.Map('body-wrapper', {
          // center:[108.076325,39.000252],
          // zoom:4
          resizeEnable: true
        });
        that.map.on('complete', function () {
          // 地图图块加载完成后触发
          that.requestEnvironmentAnalysisLocationTableData(3)//加载地图标点数据 add cdh 20200215
          // that.isLoading=false
        });
        //加载各种插件
        AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.Geolocation"], function () {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：5s
            buttonPosition: 'RB',    //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(15, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
          });
          that.map.addControl(geolocation);

          that.map.addControl(new AMap.Scale());

          // that.map.addControl(new AMap.ToolBar({
          //   liteStyle: true,
          //   offset: new AMap.Pixel(10, 140),
          // }));

          that.map.addControl(new AMap.ToolBar({
            position: 'LT',
            offset: new AMap.Pixel(10, 20),
          }));
        });
        //缩放控件
        AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
          const zoomCtrl = new BasicControl.Zoom({
            position: {
              bottom: 65 + 'px',
              right: 16 + 'px'
            },
            showZoomNum: true
          });
          that.map.addControl(zoomCtrl);
        });
        // //覆盖默认的dom结构  即覆盖SimpleInfoWindow这样的信息窗体
        // AMapUI.defineTpl("ui/overlay/SimpleInfoWindow/tpl/container.html", [], function () {
        //   return document.getElementById('my-infowin-tpl').innerHTML;
        // });
        // AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
        //   const marker = new AMap.Marker({
        //       map: that.map,
        //       zIndex: 9999999,
        //       position: that.map.getCenter()
        //     });
        //   const infoWindow = new SimpleInfoWindow({
        //       myCustomHeader: that.deviceList[0],
        //       myCustomFooter: '地理位置'+'仅供参考',
        //       // myCustomFooter: '苏州南门汽车客运站',
        //       // infoTitle: '<strong>这里是标题</strong>',
        //       // infoBody: '<p class="my-desc"><strong>这里是内容。</strong></p>',
        //       //基点指向marker的头部位置
        //       offset: new AMap.Pixel(0, -31)
        //     });
        //
        //     function openInfoWin() {
        //       infoWindow.open(that.map, marker.getPosition());
        //     }
        //
        //     //marker 点击时打开
        //     AMap.event.addListener(marker, 'click', function() {
        //       openInfoWin();
        //     });
        //     openInfoWin();
        // });
        //修改默认marker标记

        //搜索框 UI组件-PoiPicker
        // AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
        //   const poiPicker = new PoiPicker({
        //     input: 'pickerInput',
        //   })
        //   that.poiPickerReady(poiPicker);
        // });

        // that.map.on('click', this.showInfoClick);
        //
        // that.map.on('zoomchange', this.mapZoom);
      },

      // 请求<工序汇报>页签下的表格数据
      requestEnvironmentAnalysisLocationTableData(command) {
        this.selectLeftColumn=this.selectLeftSelections[this.selectLeftSelections.findIndex(item=>item.value===String(command))].label;
        // 请求参数
        const param = {
          showType: command,
          orgId: this.$store.state.user.userInfo.orgId
        }
        // this.appendRequestFilterParams('environmentAnalysisType', environmentAnalysisTypeParam)
        let promiseArray = [
          //列表请求
          location(param)
        ]
        this.mapLoading = true
        Promise.all(promiseArray).then(response => {
          // console.log(JSON.stringify(response))
          let [environmentAnalysisTypeResponse] = response

          // 接收页签的表格数据（后台数据）
          this.receiveEnvironmentAnalysisLocationTableData(environmentAnalysisTypeResponse)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.mapLoading = false
        })
      },

      receiveEnvironmentAnalysisLocationTableData(response) {
        response = response.data
        if (response.code !== 200) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: `原因：${response.msg}`
          })
        } else if (!response.hasOwnProperty('data') ) {
          //||
          // !response.data.hasOwnProperty('records') ||
          // !response.data.records
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的反馈数据为NULL'
          })
        } else {
          let tableData = response.data

          this.map.clearMap();  // 清除地图覆盖物
          //添加多个例子
          tableData.forEach(item => {
            if (item.latitude !== null && item.longitude !== null) {
              new AMap.Marker({
                map: this.map,
                icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
                position: [item.longitude, item.latitude],
                offset: new AMap.Pixel(-13, -30)
              });
            }
          })
          // this.addMarker(121.787,32.3169)
          this.map.setFitView()
        }
      },
      //添加单个标记  范例
      addMarker(latitude, longitude) {
        const marker = new AMap.Marker({
          icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
          position: [latitude, longitude],
          offset: new AMap.Pixel(-13, -30)
        });
        marker.setMap(this.map);
      },

    },
  }
</script>

<style lang="less" scoped>
  .header-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    height: 4rem;

    .search-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      flex-grow: 1;
    }
  }
</style>
