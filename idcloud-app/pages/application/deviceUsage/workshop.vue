<template>
	<view class="content">
		<view @click="handleClickTimeSelect" class="time-wrapper">{{timeInfo}}</view>
		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">车间设备利用率</view>
		<view style="color: #808080; font-size: 24rpx; margin-left: 32rpx; margin-bottom: 12rpx;">设备运行状态时间/总时间</view>

		<canvas  canvas-id="canvasArcbar" id="canvasArcbar" class="charts" :style="{'width':cWidth+'px','height':cHeightArcbar+'px', 'lineHeight': cHeightArcbar+'px', 'textAlign': 'center'}"></canvas>

		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">各设备利用率</view>
		<canvas  canvas-id="canvasColumn" id="canvasColumn" class="charts" :width="cWidth*pixelRatio"
		 :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchColumn"
		 @touchmove="moveColumn" @touchend="touchEndColumn"></canvas>
		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">设备状态</view>

		<view class="card-wrapper">
			<device-card style="margin-bottom: 24rpx;" v-for="(item, index) in cards" :key="index" :cardId="item.id" :cardTitle="item.title"
			 :cardData="item.data" @handleClickCard="handleClickCard"></device-card>
		</view>
		<u-calendar :min-date="minSelectDate" v-model="showCalendar" mode="range" @change="handleCalendarChange"></u-calendar>
	</view>
</template>
<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import deviceCard from '@/components/deviceCard/index.vue'
	import moment from 'moment'
	var _self;
	var canvaArcbar;
	var canvaColumn = null;
	export default {
		components: {
			deviceCard
		},
		data() {
			return {
				showCanvas: true,

				showFactoryPicker: false,
				showWorkshopPicker: false,

				showCalendar: false,
				timeInfo: '',
				timeStart: '',
				timeEnd: '',
				minSelectDate: '',

				cards: [{
					id: 1,
					title: {
						name: '车间1',
						color: '#779DFF'
					},
					data: [{
						name: '设备数量:',
						'value': '100台',
						'color': '#181818'
					}, {
						name: '运行设备:',
						value: '96台',
						'color': '#97DDAA'
					}, {
						name: '调机设备:',
						'value': '1台',
						'color': '#EEC900'
					}, {
						name: '待机设备:',
						'value': '1台',
						'color': '#799CFF'
					}, {
						name: '离线设备:',
						'value': '1台',
						'color': '#ABABAB'
					}, {
						name: '故障设备:',
						'value': '1台',
						'color': '#D68057'
					}]
				}],

				// factoryValue: '吴江分公司',
				// workshopValue: '模组车间',
				// factoryId: 1,
				// workshopId: 1,
				// factoryOpts: [{
				// 	label: '吴江分公司',
				// 	value: 1
				// }],
				// workshopOpts: [{
				// 	label: '模组车间',
				// 	value: 1
				// }, {
				// 	label: '测试车间',
				// 	value: 2
				// }, {
				// 	label: 'xx车间',
				// 	value: 3
				// }],

				dropdownValue: {
					factory: ['吴江分公司', 1],
					workshop: ['模组车间', 1]
				},
				dropdownOptions: {
					factoryOption: [{
						label: '吴江分公司',
						value: ['吴江分公司', 1]
					}],
					workshopOption: [{
						label: '模组车间',
						value: ['模组车间', 1]
					}, {
						label: '测试车间',
						value: ['测试车间', 2]
					}, {
						label: 'xx车间',
						value: ['xx车间', 3]
					}]
				},

				tableData: [],

				cWidth: '',
				cHeight: '',
				cHeightArcbar: '',
				pixelRatio: 1
			}
		},
		watch: {
			showCalendar(n) {
				if (!n) {
					setTimeout(() => {
						this.showCanvas = !n
					}, 200)
				} else {
					this.showCanvas = !n
				}

			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.cHeightArcbar = uni.upx2px(400)
			this.arcbarWidth = uni.upx2px(48);
			this.getServerData();
			this.getColumnData()
			uni.setNavigationBarTitle({
				title: '车间'
			});
		},
		onReady() {
			this.timeInfo = `${moment().format('YYYY-MM-DD')} 至 ${moment().format('YYYY-MM-DD')}`
			this.timeStart = this.timeEnd = moment().format('YYYY-MM-DD')
			this.minSelectDate = moment(moment().subtract(180, 'days')._d).format('YYYY-MM-DD')
		},
		onPullDownRefresh() {
			console.log('refresh');
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
			},
			getColumnData() {
				const categories = ['车间1', '车间2', '车间3', '车间4', '车间5', '车间6', '车间7', '车间8']
				const series = [{
					"name": "运行",
					"data": [55, 58, 64, 87, 75, 66, 78, 88],
					"format": (val) => val + '%'
				}]

				_self.showColumn("canvasColumn", {
					categories: categories,
					series: series
				});
			},
			getServerData() {
				const series = [{
					"name": "中广核太仓分工厂",
					"data": 0.75,
					"color": "#73DEB3",
				}]


				_self.showArcbar("canvasArcbar", {
					series: series
				});

			},
			showArcbar(canvasId, chartData) {
				canvaArcbar = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'arcbar',
					fontSize: 7,
					legend: false,
					title: {
						name: Math.round(chartData.series[0].data * 100) + '%',
						color: chartData.series[0].color,
						fontSize: 28 * _self.pixelRatio
					},
					subtitle: {
						name: chartData.series[0].name,
						color: '#666666',
						fontSize: 9 * _self.pixelRatio
					},
					extra: {
						arcbar: {
							type: 'circle', //整圆类型进度条图
							width: _self.arcbarWidth * _self.pixelRatio, //圆弧的宽度
							startAngle: 0.5 //整圆类型只需配置起始角度即可
						}
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio * 0.8,
					dataLabel: true,
				});

			},
			showColumn(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					fontSize: 11,
					padding: [20, 15, 15, 15],
					legend: {
						show: false,
						position: 'bottom',
						float: 'center',
						itemGap: 30,
						padding: 5,
						margin: 5,
						//backgroundColor:'rgba(41,198,90,0.2)',
						//borderColor :'rgba(41,198,90,0.5)',
						borderWidth: 1
					},
					dataLabel: true,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					enableScroll: true,
					colors: ['#5AD8A6'],
					xAxis: {
						disableGrid: true,
						itemCount: 6,
						scrollShow: true,
						scrollAlign: 'left',
					},
					yAxis: {
						//disabled:true
						gridType: 'solid',
						splitNumber: 4,
						min: 0,
						max: 100,
						format: (val) => {
							return val.toFixed(0) + '%'
						} //如不写此方法，Y轴刻度默认保留两位小数
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.5 / 6
						}
					},
				});

			},
			touchColumn(e) {
				canvaColumn.scrollStart(e);
			},
			moveColumn(e) {
				canvaColumn.scroll(e);
			},
			touchEndColumn(e) {
				canvaColumn.scrollEnd(e);
				canvaColumn.touchLegend(e, {
					animation: true,
				});
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			handleOpenDropdown() {
				this.showCanvas = false
			},
			handleCloseDropdown() {
				setTimeout(() => {
					this.showCanvas = true
				}, 200)

			},
			selectListChange(val) {
				this.activeColumn = val
			}
		}
	}
</script>
<style lang="scss" scoped>
	.flex-col {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.flex-row {
		display: flex;
		justify-content: center;
	}


	.picker-wrapper {
		width: 750rpx;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
	}

	.title-style {
		height: 50rpx;
		font-size: 36rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		color: #181818;
		line-height: 50rpx;
	}

	.card-wrapper {
		padding: 32rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.time-wrapper {
		width: 750rpx;
		height: 100rpx;
		font-size: 28rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 40;
		text-align: center;
		color: #181818;
		line-height: 100rpx;
	}
</style>
