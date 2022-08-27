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

    <!-- <dv-scroll-board :config="config" /> -->
    <dv-scroll-ranking-board :config="config" style="width:100%;height:100%" />
  </div>
</template>

<script>
import stylec from './style.vue';
import dataControl from '../../CommonModule/mixins/dataControl';
const WIDGET_NAME = 'ScrollRankingTable';

export default {
  name: WIDGET_NAME,
  group: 'table',
  icon: require('./icon/thumb-table.png'),
  title: '排名轮播表',
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
    name: '排名轮播表', // 组件名称, 可自定义
    desc: '排名轮播表', // 描述, 可自定义
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
    thNumText: '元', // 序号显示文字
    thNumColor: '#ffffff', // 序号文本颜色
    thNumFontSize: 12, // 序号文本字体大小
    thNumWidth: 30, // 序号圆大小
    thNumType: 'circle', // 序号样式 none:无样式，circle: 圆形
    thNumBg: ['#42b983', '#c03639', '#2196f3'], // 序号背景色

    tbColor: '#f7f7f7', // 表格文本颜色
    tbFontSize: 12, // 表格文本字体大小
    carouselMode: 'single', // 轮播方式
    tbBorderRgiht: '',
    // tbPercent: '1, 1, 1, 1', // 个列比例
    tbPercent: [100, 100, 100, 100], // 个列比例
    dataLength: 5, // 表格行数
    autoSorting: true, //是否自动排序

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
    autoToolTipTime: 2000, // 自动轮播时间
    staticData: {
      data: [
        {
          name: '周口',
          value: 55,
        },
        {
          name: '南阳',
          value: 120,
        },
        {
          name: '西峡',
          value: 78,
        },
        {
          name: '驻马店',
          value: 66,
        },
        {
          name: '新乡',
          value: 80,
        },
        {
          name: '商丘',
          value: 100,
        },
        {
          name: '开封',
          value: 88,
        },
        {
          name: '洛阳',
          value: 66,
        },
        {
          name: '信阳',
          value: 77,
        },
        {
          name: '濮阳',
          value: 77,
        },
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
        data: this.val.staticData.data, //表数据
        // rowNum: 3, //表行数
        rowNum: this.val.dataLength, //表行数
        // unit: '元',
        unit: this.val.thNumText, //数值单位
        // waitTime: 2000,//轮播时间间隔(ms)
        waitTime: this.val.autoToolTipTime, //轮播时间间隔(ms)
        carousel: this.val.carouselMode,
        // carousel: 'page',
        sort: this.val.autoSorting, //自动排序
      };
    },
  },
  watch: {
    dynamicData() {},
  },
  mounted() {
    console.log(this.val);
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

<style >
</style>
<style scoped>
.gaoji {
  display: none;
}
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
