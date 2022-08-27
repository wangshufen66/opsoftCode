<template>
  <div class="main-container"
       v-loading="loading"
       element-loading-text=""
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.2)">
    <div :class="{'title-tab-container':titleStyle==='tab'}">
      <h3 class="title">{{title}}</h3>
    </div>

    <div v-if="false" class="time-range">
      <el-form :model="searchForm" :rules="searchFormRules" ref="searchForm" label-width="100px" class="search-form">
        <el-form-item label="" prop="startDateTime" class="search-item start-date">
          <el-date-picker
            v-model="searchForm.startDateTime"
            type="datetime"
            size="samll"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <span style="margin-left: 0.6rem;margin-top: 0.5rem;margin-right: 0.6rem;">至</span>
        <el-form-item label="" prop="endDateTime" class="search-item end-date">
          <el-date-picker
            v-model="searchForm.endDateTime"
            type="datetime"
            size="samll"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCommit('searchForm')" circle class="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="false" class="setting">
      <span>最大显示数量</span>
      <el-select class="count-select" size="mini" v-model="maxCount" placeholder="请选择">
        <el-option
          v-for="item in maxCountOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="time-line-list" ref="timeLineList" :style="{'height': timeLineListHeight+'px'}">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(timeItem,index) of itemList" :key="index"
                          v-if="index < parseInt(maxCount) && timeItem.startAnimation"
                          :timestamp="timeItem.timestamp" placement="top"
                          :color="index===(itemList.length-1)?'#f9ca24':'#dfe6e9'">
          <el-card
            class="fadeInRight">
            <div class="card">
              <div v-for="col of timeItem.columns" class="column">
                <h4>{{col.label}}</h4>
                <p>{{col.content}}</p>
              </div>
              <i v-if="timeItem.showEdit" class="el-icon-edit edit-style" @click="$emit('onEditClick',timeItem)"></i>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
  import {dateCompare} from '@/utils/dateUtils'

  export default {
    name: "TimeLineList",
    props:{
      // 标题样式
      // 目前已完成样式有：
      // （1）'tab' => 页签标题样式，适合用于表体
      titleStyle:{
        type: String,
        default() {
          return 'tab'
        }
      }
    },
    data() {
      const validateStartDateTime = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入时间'));
        } else if (dateCompare(value, this.searchForm.endDateTime) === 1) {
          callback(new Error('开始时间不能超过结束时间'));
        } else {
          callback();
        }
      }

      const validateEndDateTime = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入时间'));
        } else if (dateCompare(this.searchForm.startDateTime, value) === 1) {
          callback(new Error('开始时间不能超过结束时间'));
        } else {
          callback();
        }
      }

      return {
        timerComm: null,
        loading: false,
        timeLineListHeightUnit: 135,  // 135 是经过测试，一行卡片最合适的高度，即单位高度，后续需要根据此高度值进行计算，当前最大显示数量最合适的高度
        timeLineListHeight: 135 * 5,
        // tmpCount: 0,
        title: '记录',
        pickerOptions: {
          shortcuts: [{
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        searchForm: {
          startDateTime: '',
          endDateTime: '',
        },
        searchFormRules: {
          startDateTime: [
            {validator: validateStartDateTime, trigger: 'blur'}
          ],
          endDateTime: [
            {validator: validateEndDateTime, trigger: 'blur'}
          ],
        },
        maxCountOptions: [{
          value: '5',
          label: '5'
        },{
          value: '10',
          label: '10'
        }, {
          value: '20',
          label: '20'
        }, {
          value: '30',
          label: '30'
        }, {
          value: '50',
          label: '50'
        }, {
          value: '200',
          label: '200'
        }, {
          value: '9999999',
          label: '9999999'
        },],
        maxCount: '9999999',  // 控制列表最大显示数量
        itemList: [
          // {
          //   timestamp: "2019-09-14",
          //   startAnimation: true,
          //   showEdit: true,
          //   columns: [
          //     {
          //       label: 'Label',
          //       content: 'xxx'
          //     },
          //     {
          //       label: 'Label',
          //       content: 'xxx'
          //     },
          //     {
          //       label: 'Label',
          //       content: 'xxx'
          //     },
          //     {
          //       label: 'Label',
          //       content: 'xxx'
          //     },
          //   ]
          // },
          // {
          //   timestamp: "2019-09-14",
          //   startAnimation: true,
          //   showEdit: false,
          //   columns: [
          //     {
          //       label: 'Label',
          //       content: 'xxx'
          //     },
          //     {
          //       label: 'Label',
          //       content: 'xxx'
          //     },
          //     {
          //       label: 'Label',
          //       content: 'xxx'
          //     },
          //     {
          //       label: 'Label',
          //       content: 'xxx'
          //     },
          //   ]
          // },
        ]
      }
    },
    watch: {
      maxCount: {
        handler(newVal, oldVal) {
          const diff = newVal - oldVal
          if (diff < 0) {  // 若当前最大显示数量比之前减小了，那么需要对itemList进行重新整理,去除多余的部分，否则会导致数据错乱
            this.itemList = [...this.itemList.slice(-newVal)] // 截取数组尾部的一部分数据
          }
          // 重置列表区域高度
          this.resetTimeLineListHeight()
        },
        // immediate: true,  //刷新加载 立马触发一次handler
        deep: true  // 可以深度检测到 person 对象的属性值的变化
      },
      // itemList: {
      //   handler(newVal, oldVal) {
      //     if (newVal.length >= oldVal.length) {
      //       // newVal[newVal.length - 1].startAnimation = false
      //       // 定时器中的函数带上括号将只执行一次，否则会循环执行，如果写lambda表达式,则也会循环执行
      //       this.timerComm = setInterval(this.startTimeLineItemAnimation, 200)
      //     }
      //
      //   },
      //   // immediate: true,  //刷新加载 立马触发一次handler
      //   deep: true  // 可以深度检测到 person 对象的属性值的变化
      // }
    },
    methods: {
      resetTimeLineListHeight(){
        // 根据当前最大显示数量和单位高度，设置最适合当前最大显示数量数量的列表区域高度值
        if (this.maxCount < 10) {
          this.timeLineListHeight = this.timeLineListHeightUnit * this.maxCount
        }else { // 最高限制
          this.timeLineListHeight = this.timeLineListHeightUnit * 10
        }

      },

      startTimeLineItemAnimation(){
        if (this.itemList && this.itemList.length > 0) {
          this.itemList[this.itemList.length - 1].startAnimation = true
          clearInterval(this.timerComm)
          this.timerComm = null
          // 滚动到最顶部
          if(this.$refs['timeLineList']){
            this.$refs['timeLineList'].scrollTop = 0
          }
        }
        console.log('timer在执行')
      },

      searchCommit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 验证通过
            this.$emit('passValidateToSearch')

            // // 测试案例
            // this.tmpCount++
            // this.appendTimeLineItems({
            //   timestamp: `2019-09-${this.tmpCount}`,
            //   startAnimation: false,
            //   columns: [
            //     {
            //       label: 'Label',
            //       content: 'xxx'
            //     },
            //     {
            //       label: 'Label',
            //       content: 'xxx'
            //     },
            //     {
            //       label: 'Label',
            //       content: 'xxx'
            //     },
            //     {
            //       label: 'Label',
            //       content: 'xxx'
            //     },
            //   ]
            // })

            // this.refreshTimeLineItems([
            //   {
            //     timestamp: "2019-09-24 00:00:00",
            //     startAnimation: true,
            //     columns: [
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //     ]
            //   },
            //   {
            //     timestamp: "2019-09-12  00:00:00",
            //     startAnimation: true,
            //     columns: [
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //     ]
            //   },
            //   {
            //     timestamp: "2019-09-23  00:00:00",
            //     startAnimation: true,
            //     columns: [
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //     ]
            //   },
            //   {
            //     timestamp: "2019-09-14  00:00:00",
            //     startAnimation: true,
            //     columns: [
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //     ]
            //   },
            //   {
            //     timestamp: "2019-09-27  00:00:00",
            //     startAnimation: true,
            //     columns: [
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //     ]
            //   },
            //   {
            //     timestamp: "2019-09-06  00:00:00",
            //     startAnimation: true,
            //     columns: [
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //     ]
            //   },
            //   {
            //     timestamp: "2019-09-10  00:00:00",
            //     startAnimation: true,
            //     columns: [
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //     ]
            //   },
            //   {
            //     timestamp: "2019-09-01  00:00:00",
            //     startAnimation: true,
            //     columns: [
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //       {
            //         label: 'Label',
            //         content: 'xxx'
            //       },
            //     ]
            //   },
            // ])
          } else {
            return false;
          }
        });
      },

      appendTimeLineItems(item) {
        // 重置列表区域高度
        this.resetTimeLineListHeight()
        // 在尾部追加原因：为了实现卡片插入动画效果，timeline组件设置的倒序显示
        if (this.itemList.length < parseInt(this.maxCount)) { // 小于最大数量，在数组尾部直接追加
          item.startAnimation = true
          this.itemList.push(item)
        } else { // 大于最大数量，移除数组itemList的第一个，再在数组尾部继续追加
          this.itemList.shift() //移除数组第一项
          this.itemList.push(item)
          // 这种情况下UI数量没变，也就不会重新渲染，也就导致动画不会播放
          // 通过延迟定时器，实现对新增加进来的数组进行重新渲染，从而激活动画
          item.startAnimation = false
          if (this.timerComm === null) {
            this.timerComm = setInterval(this.startTimeLineItemAnimation, 200)
          }
        }
      },

      /**
       * 为列表一次性附上要显示的列表项数组
       * （【必须】按这里的【itemList案例】中的规则进行传值，
       * 这里会根据数组中timestamp日期时间进行排序，最早数据排在最后，
       * 并且根据当前的最大显示数量，截取出数组尾部的一部分数据进行显示，
       * 综上所述，即这里根据最大显示数量，显示最早的一部分数据）
       * @param timeLineItems
       */
      refreshTimeLineItems(timeLineItems){
        if (timeLineItems && timeLineItems.length > 0) {
          // 重置列表区域高度
          this.resetTimeLineListHeight()
          // 先根据时间排序，最早的排在最后
          timeLineItems =[...timeLineItems.sort(function(a,b) {
            return Date.parse(a.timestamp.replace(/-/g,"/"))-Date.parse(b.timestamp.replace(/-/g,"/"));
          })]
          // console.log(JSON.stringify(timeLineItems))
          if (timeLineItems.length > this.maxCount) { // 若超出最大显示数量，则窃取尾部时间最早的一批数据进行显示
            this.itemList = [...timeLineItems.slice(-this.maxCount)]
          }else { // 若数量没有超出最大显示数量，则直接显示所有数据
            this.itemList = [...timeLineItems]
          }
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  @import "./style";
  @import "../../styles/animation/fadeIn";
  @import "./titleTab";
</style>
