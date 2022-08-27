<template>
	<view class="content">
		<!-- <view @click="handleClickTimeSelect" class="time-wrapper">{{timeInfo}}</view> -->
		<view class="picker-wrapper">
			<view @click="handleClickShowSelect" style="width: 750rpx; text-align: center; color: #759efe;">{{selectText}}
				<u-icon name="arrow-down" size="18" style="margin-left: 12rpx; color: #759EFE; position: relative; bottom: 2rpx;" />
			</view>
		</view>

		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">总设备利用率</view>
		<view style="color: #808080; font-size: 24rpx; margin-left: 32rpx; margin-bottom: 12rpx;">设备运行状态时间/总时间</view>

		<canvas canvas-id="canvasArcbar" id="canvasArcbar" class="charts" :style="{'width':cWidth+'px','height':cHeightArcbar+'px', 'lineHeight': cHeightArcbar+'px', 'textAlign': 'center'}"></canvas>

		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">{{subtitle}}</view>
		<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
		 :style="{'width':cWidth+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchColumn" @touchmove="moveColumn"
		 @touchend="touchEndColumn"></canvas>


		<view style="padding: 32rpx">
			<u-subsection :list="selectList" :current="activeColumn" @change="selectListChange"></u-subsection>
			<u-table font-size="22">
				<u-tr>
					<u-th>{{tableTitle}}</u-th>
					<u-th v-show="activeColumn == 0">今日</u-th>
					<u-th v-show="activeColumn == 1">最近7天</u-th>
					<u-th v-show="activeColumn == 2">最近一个月</u-th>
				</u-tr>
				<u-tr v-for="(item,index) in tableData" :key="index">
					<u-td>{{item[3]}}</u-td>
					<u-td v-show="activeColumn == 0">{{item[0]}}</u-td>
					<u-td v-show="activeColumn == 1">{{item[1]}}</u-td>
					<u-td v-show="activeColumn == 2">{{item[2]}}</u-td>
				</u-tr>
			</u-table>
		</view>


		<!-- 		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">车间列表</view>

		<view class="card-wrapper">
			<device-card style="margin-bottom: 24rpx;" v-for="(item, index) in cards" :key="index" :cardId="item.id" :cardTitle="item.title"
			 :cardData="item.data" @handleClickCard="handleClickCard"></device-card>
		</view> -->
		<u-calendar :min-date="minSelectDate" v-model="showCalendar" mode="range" @change="handleCalendarChange"></u-calendar>
		<u-select v-model="showPicker" mode="mutil-column-auto" :default-value="selectDefault" :list="selectorObj" @confirm="handlePickerConfirm"></u-select>

	</view>
</template>
<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import deviceCard from '@/components/deviceCard/index.vue'
	import moment from 'moment'
	import {
		getContainerTree
	} from '@/api/deviceProcess.js'
	import {
		getPie,
		getColumn
	} from '@/api/deviceMonitor/deviceUsage.js'
	var _self;
	var canvaArcbar;
	var canvaColumn = null;
	export default {
		components: {
			deviceCard
		},
		data() {
			return {
				selectText: '全部工厂 - 全部车间',
				treeDisabled: false,
				showPicker: false,
				selectDefault: [],
				selectorObj: [{
					value: -1,
					label: '全部工厂',
					children: [{
						value: -1,
						label: '全部车间'
					}]
				}],
				searchParam: {},

				pieTitle: '全部工厂',
				subtitle: '全部车间设备利用率',
				tableTitle: '车间名称',

				activeColumn: 0,
				selectList: [{
						name: '今日'
					},
					{
						name: '最近7天'
					},
					{
						name: '最近一个月'
					}
				],


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
			this.getTree()
			this.getServerData();
			// this.getColumnData()
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
			handlePickerConfirm(val) {
				console.log(val);
				this.searchParam = {}
				this.selectText = `${val[0].label} - ${val[1].label}`
				this.pieTitle = '全部工厂'
				this.subtitle = '全部车间设备利用率'
				this.tableTitle = '车间名称'
				if (val[0].value == val[1].value && val[0].value !== -1) {
					this.searchParam = {
						ctrType: 1,
						id: val[1].value
					}
					this.pieTitle = '全部工厂'
					this.subtitle = '全部车间设备利用率'
					this.tableTitle = '车间名称'
				} else if (val[0].value !== val[1].value && val[0].value !== -1) {
					this.searchParam = {
						ctrType: 2,
						id: val[1].value
					}
					this.pieTitle = val[1].label
					this.subtitle = '全部设备利用率'
					this.tableTitle = '设备名称'
				}
				this.getServerData();
				// this.getColumnData()

			},

			handleClickTableCol(val) {
				console.log(val);
			},
			handleClickCard(val) {
				console.log(val);
				uni.navigateTo({
					url: './workshop'
				})
			},
			handleClickTimeSelect() {
				this.showCalendar = true
			},
			handleCalendarChange(val) {
				this.timeStart = val.startDate
				this.timeEnd = val.endDate
				this.timeInfo = `${val.startDate} 至 ${val.endDate}`
			},
			getColumnData(val) {
				let categories = []
				let series = [{
					name: "运行",
					data: [],
					format: (val) => val.toFixed(2) + '%'
				}]

				val.forEach(i => {
					categories.push(i.name)
					series[0].data.push(i.percent)
				})

				_self.showColumn("canvasColumn", {
					categories: categories,
					series: series
				});
			},
			async getTableData(param) {
				this.tableData = []
				let res = await Promise.resolve(getColumn(param))
				if (res[1].data.code == 200) {
					// console.log(res[1].data.data);
					res[1].data.data.forEach(i => {
						this.tableData.push([i.today.toFixed(2) + '%', i.week.toFixed(2) + '%', i.month.toFixed(2) + '%', i.containerName])
					})
				}
			},
			async getServerData() {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					...this.searchParam
				}
				let res = await Promise.resolve(getPie(param))
				this.getTableData(param)
				if (res[1].data.code == 200) {
					this.getColumnData(res[1].data.data.list)
					const series = [{
						name: this.pieTitle,
						data: res[1].data.data.percent / 100,
						color: "#73DEB3",
					}]


					_self.showArcbar("canvasArcbar", {
						series: series
					});
				}


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
						labelCount: 3,
						scrollShow: true,
						scrollAlign: 'left',
						// rotateLabel: true,
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
						// return category + ' ' + item.name + ':' + item.data
						let shortName = category.slice(0, 10)
						if (shortName !== category) {
							shortName = shortName + '...'
						}
						return shortName + ' ' + item.name + ':' + item.data
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
			},
			handleClickShowSelect() {
				this.showPicker = !this.showPicker
			},
			async getTree() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId
					}
					let res = await Promise.resolve(getContainerTree(param))
					const arr1 = res[1].data.data.filter(i => i.ctrType == 1)
					const arr2 = res[1].data.data.filter(i => i.ctrType == 2)
					arr1.forEach(i => {
						this.selectorObj.push({
							value: i.id,
							label: i.ctrName,
							children: [{
								value: i.id,
								label: '全部设备'
							}]
						})
						arr2.forEach(k => {
							if (i.id == k.ctrParent) {
								this.selectorObj[this.selectorObj.length - 1].children.push({
									value: k.id,
									label: k.ctrName
								})
							}
						})
					})
					this.treeDisabled = false

				} catch (e) {
					console.log(e);
				}
			},
			selectListChange(val) {
				this.activeColumn = val
			}
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		.u-td {
			white-space: nowrap;
			overflow: scroll;
		}
	}

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
