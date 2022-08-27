<template>
  <!--嵌套走马灯图片选择对话框-->
  <el-dialog
    :title="title"
    :visible.sync="mDialogVisible"
    :before-close="handleClose"
    :show-close="false"
    style="text-align: center;">
    <el-input
      v-model="filterNameInput"
      style="width: 60%;"
      placeholder="请输入搜索名称">
      <i slot="prefix" class="el-input__icon el-icon-search"/>
    </el-input>
    <!--:interval="4000"-->
    <el-carousel ref="carousel" :autoplay="false" type="card" height="200px" trigger="click" @change="handleCarouselChange">
      <el-carousel-item
        v-for="item in mImagesData"
        :key="item.key"
        :label="item.label"
        :name="item.label"
        class="carousel-item-container"
        style="display: flex;flex-direction: column;">
        <el-tag style="flex: 1;border: none;background: transparent;">{{ item.label }}</el-tag>
        <img :src="item.imgSrcReq" style="flex: 5;padding: 3rem;">
      </el-carousel-item>
    </el-carousel>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogHandleCancel">取 消</el-button>
      <el-button type="primary" @click="dialogHandleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'CarouselDialog',
  props: {
    // 标题
    title: {
      type: String,
      default() {
        return '提示'
      }
    },
    // 控制对话框是否显示
    dialogVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    imagesData: {
      type: Array,
      default() {
        return false
      }
    }, // 要展示的图片集合,数组成员案例：{key:"唯一id", label:"图片的标签内容",imgSrc:"图片本地地址"}
    dialogCancelCallback: {
      type: Function,
      default: null
    },
    dialogConfirmCallback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      mDialogVisible: false,
      mDialogCancelCallback: null,
      mDialogConfirmCallback: null,
      mImagesData: [], // 图片集合（用于进行过滤的原数据）
      mCurImage: { // 当前选择的图片对象
        index: -1,
        key: '', // key值一定要唯一
        label: '', // 图片标签内容
        imgSrc: '' // 图片地址原值
      },
      filterNameInput: ''
    }
  },
  watch: {
    dialogVisible: {
      handler(newVal, oldVal) {
        this.mDialogVisible = newVal
      }
    },
    dialogCancelCallback: {
      handler(newVal, oldVal) {
        this.mDialogCancelCallback = newVal
      }
    },
    dialogConfirmCallback: {
      handler(newVal, oldVal) {
        this.mDialogConfirmCallback = newVal
      }
    },
    imagesData: {
      handler(newVal, oldVal) {
        // 遍历赋值，主要为了动态引入预编译的图片路径地址
        this.mImagesData = []
        newVal.forEach((item, index) => {
          const itemTemp = {
            key: item.key, // key值一定要唯一
            label: item.label, // 图片标签内容
            imgSrc: item.imgSrc, // 记录图片地址原值
            imgSrcReq: item.imgSrc // 预处理的图片引入地址
          }
          // 添加到数组
          this.mImagesData.push(itemTemp)
        })
      }
    },
    // 搜索内容发生改变，则根据搜索内容获取当前过滤的图片数据集合
    filterNameInput: {
      handler(newVal, oldVal) {
        const itemName = this.getFilterImages(newVal)[0].label // 模糊查询出对应的集合，然后取第一个的名称
        this.$refs.carousel.setActiveItem(itemName) // 设置当前活动项
      }
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    // 普通信息对话框 右上角大叉关闭事件的关闭前处理处理机制
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //         done();
      //     })
      //     .catch(_ => {
      //     });
    },
    // 设置当前活动的图片项
    setCurImage(index) {
      try {
        const imgItem = this.mImagesData[index]
        this.mCurImage = { // 当前选择的图片对象
          index: index,
          key: imgItem.key, // key值一定要唯一
          label: imgItem.label, // 图片标签内容
          imgSrc: imgItem.imgSrc // 图片地址原值
        }

        console.log('当前图片：' + JSON.stringify(this.mCurImage))
      } catch (e) {
        console.log('异常：' + e.message)
      }
    },
    // 走马灯图片改变事件（目前激活的幻灯片的索引，原幻灯片的索引）
    // todo: BUG: 我在这加入了过滤功能后,一旦过滤数据集合，这里的索引就开始错乱，每次根据过滤数组切换UI图片后，索引都会重置将当前图片的项作为索引为0的第一项
    // todo: 解决方案——废除UI过滤功能，改为通过搜索来模糊查询出对应的图片项，然后UI切换当前活动项为模糊搜索出来的图片项
    handleCarouselChange(curIndex, oldIndex) {
      this.setCurImage(curIndex)
    },

    // 取消按钮回调
    dialogHandleCancel() {
      if (this.mDialogCancelCallback != null) {
        this.mDialogCancelCallback()
      }
    },
    // 确定按钮回调
    dialogHandleConfirm() {
      if (this.mDialogConfirmCallback != null) {
        // 回调当前活动项的对象信息
        this.mDialogConfirmCallback(this.mCurImage)
      }
    },
    // 集合过滤功能函数
    getFilterImages(search) {
      // console.log(JSON.stringify(this.componentDatas))
      // let search = this.filterComponentNameInput;
      let searchVal = []// 搜索后的数据
      if (search) {
        searchVal = this.mImagesData.filter(function(item) {
          return Object.keys(item).some(function(key) {
            // 搜索所有的内容
            // return String(item[key]).toLowerCase().indexOf(search) > -1;
            // 只搜索问题内容（某一个key）（这里按名称搜索）
            return String(item['label']).toLowerCase().indexOf(search.toLowerCase()) > -1
          })
        })
        return searchVal
      } else { // 未输入内容，则搜索所有内容
        return this.mImagesData
      }
    }
  }
}
</script>

<style lang='scss' scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }

    /*走马灯中，双数索引值的选项卡样式*/
    .el-carousel__item:nth-child(2n) {
        /*background-color: #99a9bf;*/
        background-color: transparent;
    }

    /*走马灯中，单数索引值的选项卡样式*/
    .el-carousel__item:nth-child(2n+1) {
        /*background-color: #d3dce6;*/
        background-color: transparent;
    }

    // 走马灯选项容器样式
    .carousel-item-container {
        text-align: center;
    }

    img {
        width: 60%;
        height: 80%;
        align-self: center;
    }
</style>
