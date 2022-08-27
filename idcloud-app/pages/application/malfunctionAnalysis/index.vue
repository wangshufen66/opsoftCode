<template>
	<view class="content">
		<!-- 微信小程序中canvas层级过高，如果需要使用前端组件 则需要先把图表隐藏起来 -->
		<view class="picker-wrapper">
			<view @click="handleClickShowSelect" style="width: 750rpx; text-align: center; color: #759efe;">{{selectText}} <u-icon name="arrow-down" size="18" style="margin-left: 12rpx; color: #759EFE;"/></view>
		</view>

		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">故障设备占比</view>

		<canvas canvas-id="canvasPie" id="canvasPie" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
		 :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchPie"></canvas>

		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">故障报警次数</view>
		<canvas v-show="hasSecond" canvas-id="canvasColumn" id="canvasColumn" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
		 :style="{'width':cWidth+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchColumn" @touchmove="moveColumn"
		 @touchend="touchEndColumn"></canvas>

		<u-empty style="margin: 24rpx 0;" v-if="!hasSecond"></u-empty>

		<view style="padding: 0 32rpx 32rpx 32rpx">
			<u-subsection :list="selectList" :current="activeColumn" @change="selectListChange"></u-subsection>
			<u-table font-size="22">
				<u-tr>
					<u-th>设备编号</u-th>
					<u-th>设备名称</u-th>
					<u-th v-show="activeColumn == 0">最近24小时</u-th>
					<u-th v-show="activeColumn == 1">最近7天</u-th>
					<u-th v-show="activeColumn == 2">最近一个月</u-th>
				</u-tr>
				<u-tr v-for="(item,index) in tableData" :key="index">
					<u-td>{{item[4]}}</u-td>
					<u-td>{{item[3]}}</u-td>
					<u-td v-show="activeColumn == 0">{{item[0]}}</u-td>
					<u-td v-show="activeColumn == 1">{{item[1]}}</u-td>
					<u-td v-show="activeColumn == 2">{{item[2]}}</u-td>
				</u-tr>
			</u-table>
		</view>
		<u-select v-model="showPicker" mode="mutil-column-auto" :default-value="selectDefault" :list="selectorObj" @confirm="handlePickerConfirm"></u-select>
	</view>
</template>
<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import {
		getContainerTree
	} from '@/api/deviceProcess.js'
	import {
		getErrorList,
		getPieData
	} from '@/api/deviceMonitor/errorAnalysis.js'
	var _self;
	var canvaPie = null;
	var canvaColumn = null;
	export default {
		data() {
			return {
				hasSecond: true,
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

				showCanvas: true,
				// 0/1/2
				activeColumn: 0,
				selectList: [{
						name: '最近24小时'
					},
					{
						name: '最近7天'
					},
					{
						name: '最近一个月'
					}
				],

				tableData: [],

				cWidth: '',
				cHeight: '',
				pixelRatio: 1
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
			this.getColumnData()
		},
		onReady() {
			this.getTree()
		},
		onPullDownRefresh() {
			console.log('refresh');
		},
		methods: {
			handleClickShowSelect() {
				this.showPicker = !this.showPicker
			},
			handlePickerConfirm(val) {
				this.searchParam = {}
				this.selectText = `${val[0].label} - ${val[1].label}`
				if (val[0].value == -1) {
					this.getServerData()
					this.getColumnData()
				} else {
					if (val[0].value == val[1].value) {
						this.searchParam = {
							ctrType: 1,
							id: val[0].value
						}
						this.getServerData();
						this.getColumnData()
					} else {
						this.searchParam = {
							ctrType: 2,
							id: val[1].value
						}
						this.getServerData();
						this.getColumnData()
					}
				}

			},

			async getColumnData() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						...this.searchParam
					}
					this.hasSecond = true
					let res = await Promise.resolve(getErrorList(param))
					if (res[1].data.code == 200 ) {
						if(res[1].data.data.length == 0)
							this.hasSecond = false
						const arr = res[1].data.data
						this.tableData = []
						let categories = []
						let numbers = []
						let series = [{
							"name": "最近24小时",
							"data": []
						}, {
							"name": "最近7天",
							"data": []
						}, {
							"name": "最近30天",
							"data": []
						}]
						let tmp = []
						arr.forEach((i, index) => {
							categories.push(i.deviceName)
							numbers.push(i.deviceNumber)
							series[0].data.push(i.day)
							series[1].data.push(i.week)
							series[2].data.push(i.month)
						})


						series[0].data.forEach((item, index) => {
							series.forEach((k, i) => {
								tmp.push(k.data[index])
								if (i === series.length - 1) {
									this.tableData.push(tmp)
									tmp = []
								}
							})
						})
						categories.forEach((i, index) => {
							this.tableData[index].push(i)
						})
						numbers.forEach((i, index) => {
							this.tableData[index].push(i)
						})

						_self.showColumn("canvasColumn", {
							categories: categories,
							series: series
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			async getServerData() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						...this.searchParam
					}
					let res = await Promise.resolve(getPieData(param))
					if (res[1].data.code == 200) {
						let series = [{
							"name": "故障",
							"data": 0,
							"color": '#EA7D64',
							// "format": () => '故障7台 占比7%'
						}, {
							"name": "其他",
							"data": 0,
							"color": '#7DA6F9',
							// "format": () => '其他93台 占比93%'
						}]
						res[1].data.data.forEach(i => {
							if (i.name == '5') {
								series[1].data = i.percent
							}
							if (i.name == '4') {
								series[0].data = i.percent
							}
						})

						_self.showPie("canvasPie", {
							series: [...series]
						});
					}
				} catch (e) {
					console.log(e);
				}


			},
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					padding: [5, 15, 0, 15],
					legend: {
						show: true,
						// position: 'right',
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							border: false,
							borderColor: '#FFFFFF',
							borderWidth: 0,
							disablePieStroke: true
						}
					},
				});
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data.toFixed(2) + '%'
					}
				});
				canvaPie.touchLegend(e, {
					animation: true
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
						position: 'top',
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
					colors: ['#F7C739', '#EB7E65', '#7DA6F9'],
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
						// min: 10,
						// max: 180,
						format: (val) => {
							return val.toFixed(0)
						} //如不写此方法，Y轴刻度默认保留两位小数
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio / 6
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
			handleOpenDropdown() {
				// this.showCanvas = false
			},
			handleCloseDropdown() {
				// setTimeout(() => {
				// 	this.showCanvas = true
				// }, 200)

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
</style>
