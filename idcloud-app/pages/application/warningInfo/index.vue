<template>
	<view class="container">
		<view @click="handleClickTimeSelect" class="time-wrapper">{{timeInfo}}</view>
		<warning-card v-for="(item, index) in cards" :key="index" :cardId="item.id" :cardTitle="item.title"
		 :cardData="item.data" @handleClickCard="handleClickCard"></warning-card>


		<u-calendar :min-date="minSelectDate" v-model="showCalendar" mode="range" @change="handleCalendarChange"></u-calendar>
	</view>
</template>

<script>
	import moment from 'moment'
	import warningCard from '@/components/warningCard/index.vue'
	export default {
		components: {
			warningCard
		},
		onReady() {
			this.timeInfo = `${moment().format('YYYY-MM-DD')} 至 ${moment().format('YYYY-MM-DD')}`
			this.timeStart = this.timeEnd = moment().format('YYYY-MM-DD')
			this.minSelectDate = moment(moment().subtract(180, 'days')._d).format('YYYY-MM-DD')
			
			let count = 6
			while(count > 0){
				count --
				this.cards.push(this.cards[1])
			}
		},
		data() {
			return {
				showCalendar: false,
				timeInfo: '',
				timeStart: '',
				timeEnd: '',
				minSelectDate: '',
				cards: [{
					id: 1,
					title: {
						left: '设备：PH00304',
						right: '未解决',
						color: '#EA7D64'
					},
					data: [{
						name: '故障代码:',
						'value': 'GZ01'
					}, {
						name: '报警时间:',
						value: '2020-11-01 20:02'
					}, {
						name: '报警内容:',
						'value': '因为温度过高导致管道软化，物料无法精确送达造成断纤。'
					}]
				}, {
					id: 2,
					title: {
						left: '设备：PH00304',
						right: '已解决',
						color: '#ABABAB'
					},
					data: [{
						name: '故障代码:',
						'value': 'GZ02'
					}, {
						name: '报警时间:',
						value: '2020-11-01 20:02'
					}, {
						name: '结束时间:',
						'value': '2020-02-01 22:12'
					}, {
						name: '持续时间:',
						'value': '2小时10分钟'
					}, {
						name: '报警内容:',
						'value': '进给倍率超过阀值。'
					}]
				}],
			}
		},
		methods: {
			handleClickCard(val) {
				console.log(val);
			},
			handleClickTimeSelect() {
				this.showCalendar = true
			},
			handleCalendarChange(val) {
				this.timeStart = val.startDate
				this.timeEnd = val.endDate
				this.timeInfo = `${val.startDate} 至 ${val.endDate}`
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding: 0 32rpx;
	}
	.time-wrapper {
		width: 686rpx;
		height: 100rpx;
		font-size: 28rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 40;
		text-align: center;
		color: #181818;
		line-height: 100rpx;
	}
</style>
