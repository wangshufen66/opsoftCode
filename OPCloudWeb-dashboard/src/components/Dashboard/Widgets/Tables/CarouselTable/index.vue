<template>
  <div :style="{
      display: val.display,
      position: 'absolute',
      width: val.width / w * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / w * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
      fontSize: val.fontSize,
      backgroundColor: val.backgroundColor,
      borderStyle: 'solid',
      borderRadius: val.radius + 'px',
      borderColor: val.borderColor,
      borderWidth: val.borderWidth + 'px',
      border: val.borderWeight + 'px ' + val.borderColor + ' solid',
      flexDirection: val.dir,
      justifyContent: val.justify,
      alignItems: val.align,
      paddingBottom: '10px'
    }" class="table">

    <div class="lay-cont"></div>
    <dv-scroll-board :config="config" />

  </div>
</template>

<script>
import stylec from './style.vue';
import dataControl from '../../CommonModule/mixins/dataControl';
const WIDGET_NAME = 'CarouselTable';

export default {
  name: WIDGET_NAME,
  group: 'table',
  icon: require('./icon/thumb-table.png'),
  title: '轮播表',
  panel: stylec,
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    hasGuide: true,
    isUpload: false,
    isChild: true,
    dragable: true,
    resizable: true,
    width: 500,
    height: 320,
    left: 100,
    top: 20,
    z: 0,
    name: '轮播表', // 组件名称, 可自定义
    desc: '新增的轮播表', // 描述, 可自定义
    belong: 'page',
    animationName: '',

    display: 'block',
    bgColor: '',
    backPic: '',
    backPicUrl: '',
    radius: 0,

    // 背景颜色、边框颜色、粗细
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWeight: '1',
    borderColor: 'rgba(0, 0, 0, 0)',
    // borderColor: '#2c213d',
    borderWidth: 0,
    dir: 'row',
    justify: 'flex-start',
    align: 'flex-start',
    fontSize: '14px',

    seriesColors: [],

    showTh: true, // 是否显示表头
    thHeight: 40, // 表头高度
    thFontSize: 12, // 表头文本大小

    thColor: '#f7f7f7', // 表头文本颜色

    showNum: true, // 是否添加序号
    thNumText: '序号', // 序号显示文字
    thNumColor: '#ffffff', // 序号文本颜色
    thNumFontSize: 12, // 序号文本字体大小
    thNumWidth: 30, // 序号圆大小
    thNumType: 'circle', // 序号样式 none:无样式，circle: 圆形
    thNumBg: ['#42b983', '#c03639', '#2196f3'], // 序号背景色

    tbColor: '#f7f7f7', // 表格文本颜色
    tbFontSize: 12, // 表格文本字体大小
    tbAlign: 'left', // 表格对齐方式
    tbBorderRgiht: '',
    // tbPercent: '1, 1, 1, 1', // 个列比例
    tbPercent: [100, 100, 100, 100], // 个列比例
    dataLength: 5, // 表格行数

    dataAPI:
      'https://easy-mock.com/mock/5c7ce20ccdc04f0e04185d9b/example/echart/CarouselTable', // API拉取地址
    dataAutoRefresh: false, // 是否自动刷新
    dataOrigin: 'local', // local 本地 api 远程接口(api/local/csv)
    dataRefreshTime: 5, // 自动刷新间隔（秒）
    dataRefresh: false, // 刷新图表, 控制面板中测试dataApi使用

    // 数据联动配置
    linkEnable: false, // 开启联动
    linkIsMain: false, // 是否是数据源
    linkMainUUID: '', // 上级的UUID, 通过此标志获取联动的数据

    keyPrimary: 'data',
    keyTarget: 'rows', // 响应数据对应的字段名
    keyXAxis: 'x', // 从该字段取x轴数据
    keyYAxis: 'y', // 从该字段取y轴数据

    csvHash: '', // 选择的 csv 数据hash值 (通过该值获取表头信息)
    csvSeries: [], // 分组标签
    // csvNum: [], // 取值标签 (堆叠图为数组)
    csvHeader: [], // 选中的表头关系
    csvGroup: 'table', // 组件分组(csv数据请求接口类型single/multiple/table/map)
    sqlQuery: '',
    thBgColor: '#eeeeee', // 表头背景色
    oddRowBGC: '#003B51', //奇数行背景色
    evenRowBGC: '#0A2732', //偶数行背景色
    autoToolTipTime: 5000, // 自动轮播时间
    staticData: {
      header: ['实施生产线名称', '计划完成率', '报废率', '停机率'],
      data: [
        ['F49衣帽架', '16.30%', '0.00%', '0.00%'],
        ['G08BEV储物盒', '11.26%', '0.02%', '0.00%'],
        ['G08平地毯', '10.25%', '0.09%', '0.00%'],
        ['G08后侧石板', '8.65%', '0.03%', '0.00%'],
        ['G08轮罩', '12.34%', '0.12%', '0.00%'],
        ['小门', '9.65%', '0.15%', '0.00%'],
        ['盖内饰-基本版', '10.06%', '0.05%', '0.00%'],
        ['G08前侧石板', '6.25%', '0.06%', '0.00%'],
        ['支撑板', '5.69%', '0.03%', '0.00%'],
        ['盖内饰-高配版', '8.22%', '0.06%', '0.00%'],
      ],
    },
  },
  mixins: [dataControl],
  props: ['w', 'h', 'val'],
  data() {
    return {
      color: '',
      timer: null,
      dynamicData: {},
    };
  },
  computed: {
    config() {
      return {
        header: this.val.staticData.header, //表头数据
        data: this.val.staticData.data, //表数据
        rowNum: this.val.dataLength, //表行数
        // rowNum: 2, //表行数
        headerBGC: this.val.thBgColor, //表头背景色
        oddRowBGC: this.val.oddRowBGC, //奇数行背景色
        evenRowBGC: this.val.evenRowBGC, //偶数行背景色
        waitTime: this.val.autoToolTipTime, //轮播时间间隔(ms)
        headerHeight: this.val.thHeight, //表头高度
        columnWidth: [50, 300, 300, 300, 600, 300, 300, 300, 300, 500, 300], //列宽度
        columnWidth: this.val.tbPercent, //列宽度
        // align: ['center', 'center', 'center', 'center'], //列对齐方式
        index: true, //显示行号
        indexHeader: '#', //行号表头
        // carousel: 'single', //轮播方式
        hoverPause: true, //悬浮暂停轮播
      };
    },
  },
  watch: {
    dynamicData() {
      // let dataLength = this.dynamicData.data.length;
      // let tbPercent = this.dynamicData.header.length;
      // console.log(dataLength);
      // console.log(tbPercent);
      // let newarr = new Array(tbPercent);
      // for (let i = 0; i < tbPercent; i++) {
      //   newarr[i] = 1;
      // }
      // let params = [
      //   {
      //     name: 'dataLength',
      //     value: dataLength,
      //   },
      //   {
      //     name: 'tbPercent',
      //     value: newarr,
      //   },
      // ];
      // console.log(params);
      // this.$vpd.commit('UPDATE_DATAS', params);
    },
  },
  mounted() {
    console.log(this.val);
    // console.log(this.val.headerArr);
    // console.log(this.val.contentData);
    if (this.$vpd.state.uuid === this.val.uuid) {
      let colors = this.$vpd.state.page.colors.value.slice(
        0,
        this.val.dataLength
      );
      let param = {
        name: 'seriesColors',
        value: colors,
      };
      this.$vpd.commit('UPDATE_ACTIVE_ELEMENT', param);
      this.$vpd.commit('UPDATE_ACTIVE_ELEMENT', {
        name: 'thBgColor',
        value: colors[0],
      });
    }
  },
};
</script>

<style scoped>
.table {
  margin: 0 auto;
}
.table-title .table-tr {
  height: 100%;
}
.table-tr {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
  border-top: 0;
}
.table-title {
  width: 100%;
}
.table-body {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.table-th,
.table-td {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
  width: 0;
}
.table-td:last-child {
  border-right: 0 !important;
}
.table-td-num {
  flex: 1;
}
.table-td-num span {
  display: block;
  text-align: center;
  line-height: 36px;
  color: #ffffff;
}
.table-th span,
.table-td span {
  width: 90%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
