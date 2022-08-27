<template>
  <div id="card-container">
    <Card class="main-card">
      <div class="title-wrapper">
        <p v-text="cardHeadTitle" class="card-title"></p>
        <p v-if="hasHeadSubTitle" v-text="cardSubTitleData" class="card-sub-title" :style='{ "color" : color}'></p>
      </div>
      <div class="body-wrapper">
        <div class="body-title-wrapper">
          <!--<i :class="iconName" ></i>-->
          <el-image class="icon-style" style="width: 15px; height: 22px;display: block" :src="cardIcon"/>
          <p v-text="cardBodyTitle" class="body-title">  </p>
        </div>
        <p class="body-number"><strong>{{number+' '+cardBodyUnit}}</strong></p>
      </div>
      <Divider/>
      <div class="footer-wrapper">
        <el-button v-if="hasEditAccess" class="el-icon-edit card-edit" type="text" @click="editCard"> 编辑</el-button>
        <Divider type="vertical" class="card-vertical-divider" :style="{marginLeft:hasEditAccess?'0px':'-30px'}"/>
        <el-button class="el-icon-more-outline card-detail" type="text" @click="detailCard"> 详情</el-button>
        <Divider type="vertical" class="card-vertical-divider"/>
        <div>
          <el-popover
            placement="top"
            width="160"
            v-model="visible">
            <p class="text-style">确定删除吗</p>
            <div class="popover-btn-wrapper">
              <el-button size="mini" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteCard">确定</el-button>
            </div>
            <el-button disabled slot="reference" class="el-icon-delete card-delete" type="text"> 删除</el-button>
          </el-popover>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: {
      hasEditAccess: {
        type: Boolean,
        default() {
          return false
        }
      },
      //这张卡片的所有数据 存储在这里
      cardOriginData: {
        type: Object,
        default() {
          return {}
        }
      },
      cardHeadTitle: {
        type: String,
        default() {
          return ''
        }
      },
      cardSubTitle: {
        type: String,
        default() {
          return ''
        }
      },
      cardBodyTitle: {
        type: String,
        default() {
          return ''
        }
      },
      cardBodyNumber: {
        type: String,
        default() {
          return ''
        }
      },
      cardBodyUnit: {
        type: String,
        default() {
          return ''
        }
      },
      hasHeadSubTitle: {
        type: Boolean,
        default() {
          return true
        }
      },
      //是否格式化数字
      hasFormatNumber: {
        type: Boolean,
        default() {
          return true
        }
      },
      // 用于关联数据和实际显示区域的关联器
      //cardTitle    卡片左上角标签
      //cardSubTitle    右上角 输入字符串，可任意输入，如果关键字在线或者离线，则会变色
      //cardBodyTitle    数据主题的标题
      //cardBodyNumber    数据
      //cardBodyUnit    单位 （字符串）
      cardKey: {
        type: Object,
        default() {
          return {
            cardTitle: '',
            cardSubTitle: '',
            cardBodyTitle: '',
            cardBodyNumber: '',
            cardBodyUnit: ''
          }
        }
      },
      cardIcon: {
        type: String,
        default() {
          return ''
        }
      }

    },
    mounted() {
      this.initData()
    },
    data() {
      return {
        // iconName: '',
        //默认颜色为黑 即不填
        color: '',
        number: '',
        visible: false,
        cardSubTitleData: this.cardSubTitle
      }
    },
    methods: {
      initData() {
        this.initSubTitleColor()
        this.numberFormat(this.cardBodyNumber)
        // this.getIcon()
      },
      initSubTitleColor() {
        //这里条件写死了，在线subTitle变为绿色，离线变为红色
        switch (this.cardSubTitle) {
          case '离线':
            this.cardSubTitleData = '● ' + this.cardSubTitleData
            this.color = 'red'
            break;
          case '在线':
            this.cardSubTitleData = '● ' + this.cardSubTitleData
            this.color = '#2FD900'
            break;
          case '0':
            this.cardSubTitleData = '● 离线'
            this.color = 'red'
            break;
          case '1':
            this.cardSubTitleData = '● 在线'
            this.color = '#2FD900'
            break;
          default:
            break;
        }
      },
      //格式化字符串，使得3位加逗号  number 一定是字符串格式，否则会报错
      numberFormat(number) {
        const numArr = number.split('.')
        switch (numArr.length) {
          case 1:
            this.number = this.hasFormatNumber ? (number || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : number
            break;
          case 2:
            const formattedNum = (numArr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + numArr[1]
            this.number = this.hasFormatNumber ? formattedNum : number
            break;
        }
      },
      // getIcon() {
      //   // this.iconName = this.cardIcon + ' icon-style'
      //   this.iconName = this.cardIcon
      //   console.log(this.cardIcon)
      // },
      editCard() {
        this.$emit('editCard', this.cardOriginData)
      },
      detailCard() {
        this.$emit('detailCard', this.cardOriginData)
      },
      deleteCard() {
        this.visible = false
        this.$emit('deleteCard', this.cardOriginData)
      },
    }
  }
</script>

<style lang="less">
  #card-container {
    .ivu-card-body {
      padding: 0;
    }

    .ivu-divider-horizontal {
      margin: 0.2rem 0
    }
  }
</style>
<style lang="less" scoped>
  .main-card {
    width: 350px;
    margin: 0 1rem 1rem 1rem;
  }

  .title-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding-bottom: 0.8rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    margin: 0.8rem 1.2rem 0 1.2rem;

    .card-title {
      /*width: 80px;*/
      font-size: 21px;
      font-weight: 500;
    }

    .card-sub-title {
      text-align: center;
      line-height: 28px;
    }
  }

  .body-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;

    .body-title-wrapper {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: center;

      .icon-style {
        margin: 0.45rem 0.4rem 0 0;
      }

      .body-title {
        margin: 0.5rem 0 0 0;
        padding-right: 1.2rem;
        font-size: 14px;
        font-weight: normal;
        color: #ff9f43;
      }
    }

    .body-number {
      font-size: xx-large;
      font-weight: normal;
      margin-bottom: 0.8rem;
      color: #00a8ff;
    }
  }

  .footer-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: nowrap;
    margin-bottom: 0.2rem;

    .card-vertical-divider {
      align-self: center;
    }

    .card-edit {
      font-size: 15px;
      color: black;
      margin-left: 1rem;
    }

    .card-edit:hover {
      color: #3498db;
    }

    .card-detail {
      font-size: 15px;
      color: black;
    }

    .card-detail:hover {
      color: #f0932b;
    }

    .card-delete {
      font-size: 15px;
      color: black;
      margin-right: 1rem;
    }

    .card-delete:hover {
      color: #eb4d4b;
    }
  }

  .text-style {
    font-size: small;
    line-height: 16px;
    text-align: center;
    margin: 0.5rem 0 1rem 0;
  }

  .popover-btn-wrapper {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
  }
</style>
