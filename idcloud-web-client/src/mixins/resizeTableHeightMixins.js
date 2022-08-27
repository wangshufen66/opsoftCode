const { body } = document;
export default {
  //屏幕自适应事件
  // beforeMount() {
  //   window.addEventListener("resize", this.isMobile);
  // },
  data(){
    return{
      tableHeight:0,
    }
  },
  created() {
    window.addEventListener("resize", this.getTableHeight);
    this.getTableHeight();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getTableHeight);
  },
  methods: {
    getTableHeight() {
      this.tableHeight = `${document.documentElement.clientHeight}` - 220
    }
  }
};
