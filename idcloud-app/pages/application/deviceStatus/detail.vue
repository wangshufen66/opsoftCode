<template>
	<view>
		<view @click="handleClickTimeSelect" style="color: #759efe" class="time-wrapper">{{timeInfo}}
			<u-icon name="arrow-down" size="16" style="margin-left: 12rpx; color: #759EFE; position: relative; bottom: 4rpx;" />
		</view>
		<view style="margin-left: 32rpx;" class="title-style">设备状态分析</view>
		<view class="box-wrapper">
			<view class="box-style">
				<view v-for="(item,index) in statusSlice" :key="index" :style="{backgroundColor: item.color, width: item.width}"
				 class="box"></view>
			</view>
			<view class="box-x">
				<view>00:00</view>
				<view>06:00</view>
				<view>12:00</view>
				<view>18:00</view>
				<view>24:00</view>
			</view>
		</view>
		<status-legend></status-legend>
		<view style="margin-left: 32rpx;" class="title-style">设备状态占有率</view>
		<view class="box-wrapper">
			<view class="box-style">
				<view :style="{'width': (statusPercentage.a  * 6.86) + 'rpx'}" style="background-color: #F6BD16;" class="box">{{statusPercentage.a}}%</view>
				<view :style="{'width': (statusPercentage.b  * 6.86) + 'rpx'}" style="background-color: #5B8FF9;" class="box">{{statusPercentage.b}}%</view>
				<view :style="{'width': (statusPercentage.c  * 6.86) + 'rpx'}" style="background-color: #E8684A;" class="box">{{statusPercentage.c}}%</view>
				<view :style="{'width': (statusPercentage.d  * 6.86) + 'rpx'}" style="background-color: #ABABAB;" class="box">{{statusPercentage.d}}%</view>
				<view :style="{'width': (statusPercentage.e  * 6.86) + 'rpx'}" style="background-color: #5AD8A6;" class="box">{{statusPercentage.e}}%</view>
			</view>
			<view class="box-x">
				<view>0</view>
				<view>25%</view>
				<view>50%</view>
				<view>75%</view>
				<view>100%</view>
			</view>
		</view>
		<status-legend></status-legend>
		<view style="margin-left: 32rpx;" class="title-style">近一个月产量数据</view>


		<!-- <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
		 :style="{'width':cWidth+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchColumn" @touchmove="moveColumn"
		 @touchend="touchEndColumn"></canvas> -->

		<!-- 		<view v-show="!showCanvas" :style="{'width':cWidth+'px','height':cHeight+'px', 'lineHeight': cHeight+'px', 'textAlign': 'center'}">
			<u-loading size="60" mode="flower" style="margin-right: 12rpx;"></u-loading>重新渲染中...
		</view> -->
		<view style="padding: 32rpx">
			<u-table font-size="22">
				<u-tr>
					<u-th>日期</u-th>
					<u-th>产量数据</u-th>
				</u-tr>
				<u-tr v-for="(item,index) in tableData" :key="index">
					<u-td>{{item.processDate}}</u-td>
					<u-td>{{item.production}}</u-td>
				</u-tr>
			</u-table>
		</view>
		<u-calendar :min-date="minSelectDate" v-model="showCalendar" mode="date" @change="handleCalendarChange"></u-calendar>
	</view>
</template>

<script>
	// var _self;
	// var canvaColumn = null;
	import moment from 'moment'
	import uCharts from '@/components/u-charts/u-charts.js';
	import statusLegend from './components/legend.vue'
	import {
		getDeviceDetail,
		getCount
	} from '@/api/deviceMonitor/deviceStatus.js'

	export default {
		components: {
			statusLegend
		},
		data() {
			return {
				// showCanvas: true,
				statusPercentage: {
					// 调机
					a: 0,
					// 待机
					b: 0,
					// 故障
					c: 0,
					// 离线
					d: 0,
					// 运行
					e: 0
				},
				showCalendar: false,
				timeInfo: '',
				minSelectDate: '',

				cWidth: '',
				cHeight: '',
				pixelRatio: 1,

				extraParam: {},
				searchParam: {},

				statusSlice: [],
				tableData: []
			}
		},
		onLoad(val) {
			// _self = this;
			// this.cWidth = uni.upx2px(750);
			// this.cHeight = uni.upx2px(500);
			// this.getServerData();

			uni.setNavigationBarTitle({
				title: val.name
			});
			this.timeInfo = moment().format('YYYY-MM-DD')
			this.minSelectDate = moment(moment().subtract(180, 'days')._d).format('YYYY-MM-DD')
			this.extraParam = {
				id: val.id,
				time: this.timeInfo + ' 00:00:00'
			}
			this.getSliceData()
			this.getProductionData()

		},
		methods: {
			async getProductionData() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						id: this.extraParam.id
					}
					let res = await Promise.resolve(getCount(param))
					if (res[1].data.code == 200) {
						this.tableData = res[1].data.data
					}
				} catch (e) {
					console.log(e);
				}
			},
			async getSliceData() {

				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						...this.extraParam,
					}
					let res = await Promise.resolve(getDeviceDetail(param))
					if (res[1].data.code == 200) {
						this.statusSlice = []
						this.statusPercentage = {
							a: 0,
							b: 0,
							c: 0,
							d: 0,
							e: 0
						}
						const colorArr = ['#ABABAB', '#5AD8A6', '#5B8FF9', '#F6BD16', '#E8684A']
						res[1].data.data.list.forEach(i => {
							this.statusSlice.push({
								color: colorArr[i.status],
								width: `${686/1440 * i.duration}rpx`
							})
						})
						res[1].data.data.percentList.forEach(i => {
							const percentArr = ['d', 'e', 'b', 'a', 'c']

							this.statusPercentage[percentArr[parseInt(i.name)]] = i.percent
						})
					}
				} catch (e) {
					console.log(e);
				}
			},

			handleClickTimeSelect() {
				this.showCalendar = true
			},
			handleCalendarChange(val) {
				this.timeInfo = val.result
				this.extraParam.time = this.timeInfo + ' 00:00:00'
				this.getSliceData()
			},

			// getServerData() {
			// 	const categories = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00",
			// 		"10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
			// 		"22:00", "23:00", "24:00"
			// 	]
			// 	const series = [{
			// 		"name": "产量",
			// 		"data": [527, 831, 500, 888, 722, 253, 710, 527, 831, 500, 238, 722, 253, 710, 527, 831, 500, 238, 722, 253, 710,
			// 			710, 527, 831, 540
			// 		]
			// 	}]

			// 	_self.showColumn("canvasColumn", {
			// 		categories: categories,
			// 		series: series
			// 	});

			// },
			// showColumn(canvasId, chartData) {
			// 	canvaColumn = new uCharts({
			// 		$this: _self,
			// 		canvasId: canvasId,
			// 		type: 'column',
			// 		fontSize: 11,
			// 		padding: [20, 15, 15, 15],
			// 		legend: {
			// 			show: false,
			// 			position: 'top',
			// 			float: 'center',
			// 			itemGap: 30,
			// 			padding: 5,
			// 			margin: 5,
			// 			//backgroundColor:'rgba(41,198,90,0.2)',
			// 			//borderColor :'rgba(41,198,90,0.5)',
			// 			borderWidth: 1
			// 		},
			// 		dataLabel: true,
			// 		dataPointShape: true,
			// 		background: '#FFFFFF',
			// 		pixelRatio: _self.pixelRatio,
			// 		categories: chartData.categories,
			// 		series: chartData.series,
			// 		animation: true,
			// 		enableScroll: true,
			// 		colors: ['#5B8FF9'],
			// 		xAxis: {
			// 			disableGrid: true,
			// 			itemCount: 6,
			// 			scrollShow: true,
			// 			scrollAlign: 'left',
			// 		},
			// 		yAxis: {
			// 			//disabled:true
			// 			gridType: 'solid',
			// 			splitNumber: 4,
			// 			// min: 10,
			// 			// max: 180,
			// 			format: (val) => {
			// 				return val.toFixed(0)
			// 			} //如不写此方法，Y轴刻度默认保留两位小数
			// 		},
			// 		width: _self.cWidth * _self.pixelRatio,
			// 		height: _self.cHeight * _self.pixelRatio,
			// 		extra: {
			// 			column: {
			// 				type: 'group',
			// 				width: _self.cWidth * _self.pixelRatio * 0.6 / 6
			// 			}
			// 		},
			// 	});

			// },
			// touchColumn(e) {
			// 	canvaColumn.scrollStart(e);
			// },
			// moveColumn(e) {
			// 	canvaColumn.scroll(e);
			// },
			// touchEndColumn(e) {
			// 	canvaColumn.scrollEnd(e);
			// 	canvaColumn.touchLegend(e, {
			// 		animation: true,
			// 	});
			// 	canvaColumn.showToolTip(e, {
			// 		format: function(item, category) {
			// 			return category + ' ' + item.name + ':' + item.data
			// 		}
			// 	});
			// },
		}
	}
</script>

<style lang="scss" scoped>
	.time-wrapper {
		width: 686rpx;
		height: 80rpx;
		font-size: 28rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 40;
		text-align: center;
		color: #181818;
		line-height: 60rpx;
	}

	.title-style {
		height: 50rpx;
		font-size: 36rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		color: #181818;
		line-height: 50rpx;
	}

	.box-wrapper {
		padding: 32rpx 32rpx 8rpx 32rpx;

		.box-style {
			display: flex;
			position: relative;
			border-bottom: 2rpx solid #979797;
			border-left: 2rpx solid #979797;
			height: 150rpx;

			.box {
				transition: all 0.5s;
				position: relative;
				top: 18rpx;
				width: 0rpx;
				height: 130rpx;
				background-color: red;
				color: white;
				line-height: 130rpx;
				text-align: center;
				white-space: nowrap;
				font-size: 20rpx;
			}
		}

		.box-x {
			display: flex;
			justify-content: space-between;
			color: rgba(0, 0, 0, 0.45);
			font-size: 20rpx;
			font-family: Helvetica;
			line-height: 24rpx;
		}

	}
</style>
