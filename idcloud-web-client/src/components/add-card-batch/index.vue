<template>
  <div id="add-card-batch-container">
    <div class="add-card-header-wrapper" v-if="hasHeader">
      <!--<p class="header-title" v-text="monitorTitle"></p>-->
      <div class="btn-group-wrapper">
        <!--        暂时disabled 添加功能-->
        <el-button v-if="hasAddCardAccess" type="primary" size="small" class="btn-add" disabled @click="addCard">添加
        </el-button>
        <div class="switch-wrapper">
          <!--<el-switch-->
          <!--:disabled="switchDisabled"-->
          <!--class="switch-style"-->
          <!--style="display: block"-->
          <!--v-model="switchValue"-->
          <!--active-color="#13ce66"-->
          <!--inactive-color="#ff4949"-->
          <!--:active-text="switchConfig.activeText"-->
          <!--:inactive-text="switchConfig.inactiveText"></el-switch>-->
          <el-image
            v-show="switchValue"
            :disabled="switchDisabled"
            style="width: 25px; height: 25px"
            @click="handleSwitch"
            :src="iconList">
          </el-image>
          <el-image
            v-show="!switchValue"
            :disabled="switchDisabled"
            style="width: 25px; height: 25px"
            @click="handleSwitch"
            :src="iconCard">
          </el-image>
          <div
            v-if="switchValue"
            @click="handleClickRefresh"
            style="line-height: 28px;margin-left: 19px; cursor: pointer;"
          >
            <i class="el-icon-refresh-right"></i>
            <span style="margin-left: 4px">刷新</span>
          </div>
        </div>
      </div>
      <div class="search-wrapper" v-show="switchValue">
        <!--<el-input v-model="searchInput" :placeholder="searchInputName" class="input-search" size="small" clearable-->
        <!--@clear="clearInput"></el-input>-->
        <!--<el-button type="primary" size="small" class="btn-search" @click="handleSearch">查询</el-button>-->
        <Select
          v-model="tableConfig.selectSearchColumn"
          style="width: 118px"
          :placeholder="tableConfig.searchPlaceholder"
        >
          <Option
            v-for="(item, index) in tableConfig.selectSearchColumnSelections"
            :key="index"
            :value="item.key"
          >{{ item.title }}
          </Option>
        </Select>
        <Input
          v-model="tableConfig.search"
          clearable
          :placeholder="tableConfig.searchPlaceholder"
          class="option-input"
          style="width:180px;margin-left: 10px;"
          @on-enter="handleSearch"
        />
        <el-button
          class="search-btn"
          ref="searchButton"
          type="primary"
          circle
          icon="el-icon-search"
          size="mini"
          style="width: 28px;height:28px;margin: 2px 0 0 6px;"
          @click="handleSearch"
        ></el-button>
        <div style="width: 15px"></div>
      </div>
    </div>
    <div class="inner-wrapper">
      <!--v-infinite-scroll="getMoreCards" infinite-scroll-immediate="false"-->
      <div v-show="switchValue&&inputCardData.length!==0">
        <div :style="{height:cardHeight+'px'}">
          <ul id="present-card-layout-wrapper" class="present-card-layout-wrapper infinite-list">
            <li v-for="(item,index) in inputCardData">
              <present-card :key="index" :cardKey="cardKey" :cardHeadTitle="item.cardTitle"
                            :cardSubTitle="item.cardSubTitle"
                            :cardBodyTitle="item.cardBodyTitle"
                            :cardBodyNumber="item.cardBodyNumber" :cardBodyUnit="item.cardBodyUnit"
                            :hasHeadSubTitle="hasHeadSubTitle" :cardOriginData="cardOriginData[index]"
                            :cardIcon="cardIcon"
                            @editCard="handleEdit" @deleteCard="handleDelete" @detailCard="handleDetail"
                            class="present-card"/>
            </li>
          </ul>
        </div>
        <Page
        class="common-page-style page-container"
        v-if="hasPageBar"
        :total="serverPage?tableConfig.countTotal:tableConfig.filterData.length"
        :show-total="tableConfig.showTotal"
        :current="tableConfig.curPage"
        show-sizer
        :show-elevator="tableConfig.showPageInput"
        align="center"
        :page-size="tableConfig.pageSize"
        :page-size-opts="tableConfig.pageSizeOpts"
        @on-change="changeCurrentPage"
        @on-page-size-change="changPageSize"
      />
      </div>
      <div v-show="switchValue&&inputCardData.length===0&&!switchDisabled"
           style="display: flex;flex-direction: row;justify-content: center;align-self: center;align-items: center"
           :style="{height:cardHeight+'px'}">
        <el-image
          style="width: 250px; height: 340px"
          :src="defaultPage">
        </el-image>
        <div>暂无监测点数据!</div>
      </div>
      <div v-show="!switchValue">
        <slot name="switchOptions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import presentCard from '@/components/present-card/index.vue'
  import iconList from '@/assets/images/environmentMonitor/icon-list.png'
  import iconCard from '@/assets/images/environmentMonitor/icon-card.png'
  import defaultPage from '@/assets/images/environmentMonitor/defaultPage.png'


  export default {
    name: "index",
    components: {
      presentCard
    },
    data() {
      return {
        cardHeight:0,
        iconList,
        iconCard,
        defaultPage,
        //搜索框相关
        // searchTextContentConfig: {
        //   value: "",
        //   placeholder: ""
        // },
        //
        searchInput: '',
        inputCardData: [],
        // pageCount: 1,
        cardOriginData: [],
        switchValue: true,
      }
    },
    props: {
      //是否有分页控件
      hasPageBar: {
        type: Boolean,
        default() {
          return false;
        }
      },
      // 分页方式：false = 前端分页，true=后台分页（需要自己绑定分页函数，自己实现分页功能）
      serverPage: {
        type: Boolean,
        default() {
          return false;
        }
      },
      //搜索框相关
      tableConfig: {
        type: Object,
        default() {
          return {
            //搜索相关
            search: '', // 输入的搜索名称
            searchPlaceholder: '请输入', // 搜索输入栏的提示
            selectSearchColumnSelections: [],
            selectSearchColumn: '',//已经选择项
            //分页
            showTotal: true, // 是否显示 总数
            showPageInput: true, // 是否显示页码跳转输入框
            curPage: 1,
            pageSize: 8, // 每页最多显示行数`
            pageSizeOpts: [2, 4, 6, 8],
            countTotal: 0, // 数据总数，《后台分页功能》下会使用此变量显示总数
            filterData: [], // 根据当前搜索内容进行过滤的表格数据
          };
        }
      },
      //----------
      hasAddCardAccess: {
        type: Boolean,
        default() {
          return false
        }
      },
      hasHeader: {
        type: Boolean,
        default() {
          return true
        }
      },
      switchDisabled: {
        type: Boolean,
        default() {
          return false
        }
      },
      switchConfig: {
        type: Object,
        default() {
          return {
            activeText: '卡片',
            inactiveText: '表格'
          }
        }
      },
      searchInputName: {
        type: String,
        default() {
          return '监测点名称'
        }
      },
      // monitorTitle: {
      //   type: String,
      //   default() {
      //     return '监测点信息'
      //   }
      // },
      //传入卡片的数据，因为层数太多，所以不可靠，可以从watch中取newV
      cardData: {
        type: Array,
        default() {
          return []
        }
      },
      hasHeadSubTitle: {
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
    watch: {
      cardData(newV) {
        this.cardOriginData = newV
        this.cardKeyHandler(newV)
      }
    },
    computed: {},
    created(){
      this.getClientHeight()
    },
    methods: {
      // 点击刷新的事件
      handleClickRefresh() {
        this.$emit("requestAgain");
      },
      // 获取树形目录窗口高度
      getClientHeight() {
        const _this = this
        this.cardHeight = `${document.documentElement.clientHeight* 0.7}`-7
        window.onresize = () => {
          _this.cardHeight = `${document.documentElement.clientHeight* 0.7}`-7
        }
      },
      changeCurrentPage(curPage) {
        this.$emit('changeCurrentPage', curPage)
      },
      changPageSize(pageSize) {
        this.$emit('changPageSize', pageSize)
      },
      // getWindowSize() {
      //   let o = document.getElementById("present-card-layout-wrapper")
      //   const w = o.offsetWidth
      //   let h = document.body.scrollHeight - 100
      //   if (h < 0)
      //     h = h + 100
      //   const cardsEachRow = Math.floor(w / 392)
      //   const cardRowsCount = Math.ceil(h / 230.55)
      //   // console.log(cardsEachRow)
      //   // console.log(cardRowsCount)
      //   return cardsEachRow * cardRowsCount
      // },
      // getCurrentPage() {
      //   return this.pageCount
      // },
      // getMoreCards() {
      //   this.pageCount++
      //   this.$emit('requestAgain')
      // },
      cardKeyHandler(newV) {
        let resultArr = []
        for (let obj of newV) {
          let title = ''
          let sTitle = ''
          let bName = ''
          let bNum = ''
          let unit = ''
          for (let i = 0; i < Object.keys(obj).length; i++) {
            if (Object.keys(obj)[i] === this.cardKey.cardTitle) {
              if (Object.values(obj)[i] === null) {
                title = ''
              } else {
                title = Object.values(obj)[i]
              }
            }
            if (Object.keys(obj)[i] === this.cardKey.cardSubTitle) {
              if (Object.values(obj)[i] === null) {
                sTitle = ''
              } else {
                sTitle = Object.values(obj)[i]
              }
            }
            if (Object.keys(obj)[i] === this.cardKey.cardBodyTitle) {
              if (Object.values(obj)[i] === null) {
                bName = ''
              } else {
                bName = Object.values(obj)[i]
              }
            }
            if (Object.keys(obj)[i] === this.cardKey.cardBodyNumber) {
              if (Object.values(obj)[i] === null) {
                bNum = ''
              } else {
                bNum = Object.values(obj)[i]
              }
            }
            if (Object.keys(obj)[i] === this.cardKey.cardBodyUnit) {
              if (Object.values(obj)[i] === null) {
                unit = ''
              } else {
                unit = Object.values(obj)[i]
              }
            }
          }
          resultArr.push({
            cardTitle: title + '',
            cardSubTitle: sTitle + '',
            cardBodyTitle: bName + '',
            cardBodyNumber: bNum + '',
            cardBodyUnit: unit + ''
          })
        }
        this.inputCardData = resultArr
      },
      addCard() {
        this.$emit('handleAdd')
      },
      handleEdit(data) {
        this.$emit('handleEdit', data)
      },
      handleDelete(data) {
        this.$emit('handleDelete', data)
      },
      handleDetail(data) {
        this.$emit('handleDetail', data)
      },
      handleSearch() {
        this.$emit('handleSearch', this.searchInput)
      },
      clearInput() {
        this.$emit('handClearInput')
      },
      handleSwitch() {
        // this.pageCount = 1
        this.switchValue = !this.switchValue;
        // if(!this.switchValue)
        //   this.cardHeight=0
        // else
        //   this.cardHeight=`${document.documentElement.clientHeight}`-220
        // console.log(this.cardHeight)
        this.$emit('handleSwitch', this.switchValue)
      }
    }
  }
</script>
<style lang="less" scoped>
  #add-card-batch-container {
    .ivu-scroll-container {
      overflow-y: paged-y;
    }
  }
</style>
<style lang="less" scoped>
  .scroll-wrapper {
    height: 600px;
  }

  .present-card-layout-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
    overflow: auto;
  }


  .add-card-header-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 32px;
    line-height: 32px;
    margin: 1rem 0 2rem 0;


    .header-title {
      width: 300px;
      font-size: 22px;
      font-weight: 500;
    }

    .search-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      /*margin-right: 150px;*/

      .input-search {
        width: 150px;
        height: 30px;

        .btn-search {
          height: 32px;
        }
      }
    }

    .switch-wrapper {
      margin: 0 1rem;
      display: flex;
      flex-direction: row;
    }


    .btn-group-wrapper {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
    }
  }


</style>
