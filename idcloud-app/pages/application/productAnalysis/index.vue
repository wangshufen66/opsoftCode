<template>
	<view class="content">
		<!-- 微信小程序中canvas层级过高，如果需要使用这种前端组件 则需要先把图表隐藏起来 -->
		<!-- 		<u-dropdown @open="handleOpenDropdown" @close="handleCloseDropdown">
			<u-dropdown-item :height="350" v-model="dropdownValue.factory" :title="dropdownValue.factory[0]" :options="dropdownOptions.factoryOption"></u-dropdown-item>
			<u-dropdown-item :height="350" v-model="dropdownValue.workshop" :title="dropdownValue.workshop[0]" :options="dropdownOptions.workshopOption"></u-dropdown-item>
		</u-dropdown> -->
		<!-- 		<view class="picker-wrapper">
			<view @click="handleClickFactoryPicker" style="width: 375rpx; text-align: center;">{{factoryValue}}</view>
			<view @click="handleClickWorkshopPicker" style="width: 375rpx; text-align: center;">{{workshopValue}}</view>
		</view> -->

		<view class="picker-wrapper">
			<view @click="handleClickShowSelect" style="width: 750rpx; text-align: center; color: #759efe;">{{selectText}}<u-icon name="arrow-down" size="18" style="margin-left: 12rpx; color: #759EFE;"/></view>
		</view>


		<view style="margin:18rpx 32rpx; display: flex; justify-content: space-between; line-height: 70rpx;" class="title-style">成品产量统计
			<u-subsection :list="selectList" :current="activeColumn" @change="selectListChange"></u-subsection>
		</view>
		<canvas v-show="hasFirst" canvas-id="canvasColumn" id="canvasColumn" class="charts" :width="cWidth*pixelRatio"
		 :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchColumn"
		 @touchmove="moveColumn" @touchend="touchEndColumn"></canvas>
		<u-empty style="margin: 24rpx 0;" v-if="!hasFirst"></u-empty>


		<view style="margin-left: 32rpx; margin-top: 12rpx;" class="title-style">成品产量数据分析</view>
		<canvas v-show="hasSecond" canvas-id="canvasColumn2" id="canvasColumn2" class="charts" :width="cWidth*pixelRatio"
		 :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchColumn2"
		 @touchmove="moveColumn2" @touchend="touchEndColumn2"></canvas>
		<u-empty style="margin: 24rpx 0;" v-if="!hasSecond"></u-empty>
		<!-- 		<bar-chart :showCanvas="showCanvas" canvas-id="canvasColumn2" id="canvasColumn2" class="charts" :cWidth="cWidth*pixelRatio"
		 :cHeight="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" :series="s2" :categories="c2" :pixelRatio="pixelRatio"></bar-chart> -->



		<view style="padding: 0 32rpx 32rpx 32rpx">
			<u-subsection :list="selectListX" :current="activeColumnX" @change="selectListChangeX"></u-subsection>
			<u-table font-size="22">
				<u-tr>
					<u-th>物料编号</u-th>
					<u-th>物料名称</u-th>
					<u-th v-show="activeColumnX == 0">今日</u-th>
					<u-th v-show="activeColumnX == 1">最近7天</u-th>
					<u-th v-show="activeColumnX == 2">最近一个月</u-th>
				</u-tr>
				<u-tr v-for="(item,index) in tableData" :key="index">
					<u-td>{{item.materialNumber}}</u-td>
					<u-td>{{item.materialName}}</u-td>
					<u-td v-show="activeColumnX == 0">{{item.actualSum}}</u-td>
					<u-td v-show="activeColumnX == 1">{{item.actualSum}}</u-td>
					<u-td v-show="activeColumnX == 2">{{item.actualSum}}</u-td>
				</u-tr>
			</u-table>
		</view>

		<!-- 		<u-picker @confirm="factoryPickerConfirm" :range="factoryOpts" range-key="label" v-model="showFactoryPicker" mode="selector"></u-picker>
		<u-picker @confirm="workshopPickerConfirm" :range="workshopOpts" range-key="label" v-model="showWorkshopPicker" mode="selector"></u-picker> -->
		<u-select v-model="showPicker" mode="mutil-column-auto" :default-value="selectDefault" :list="selectorObj" @confirm="handlePickerConfirm"></u-select>

	</view>
</template>
<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import {
		getContainerTree
	} from '@/api/deviceProcess.js'
	import {
		getPlanActual,
		getYesterdayToday,
		getMaterialTable
	} from '@/api/deviceMonitor/deviceOutput.js'
	import moment from 'moment'
	// import barChart from '@/components/barChart/index.vue'
	var _self;
	var canvaColumn = null;
	var canvaColumn2 = null;
	export default {
		// components: {
		// 	barChart
		// },
		data() {
			return {
				hasFirst: true,
				hasSecond: true,
				selectText: '全部工厂 - 全部车间',
				treeDisabled: false,
				showPicker: false,
				selectDefault: [],
				selectorObj: [],
				searchParam: {},


				activeColumnX: 0,
				selectListX: [{
						name: '今日'
					},
					{
						name: '最近7天'
					},
					{
						name: '最近一个月'
					}
				],

				timeArrValueX: {
					startTime: moment().format('YYYY-MM-DD'),
					endTime: moment().add(1, 'days').format('YYYY-MM-DD')
				},

				tableData: [],



				showCanvas: true,
				// 0/1/2
				activeColumn: 0,
				selectList: [{
						name: '今日'
					},
					{
						name: '本周'
					},
					{
						name: '本月'
					}
				],

				timeArrValue: {
					startTime: moment().format('YYYY-MM-DD'),
					endTime: moment().add(1, 'days').format('YYYY-MM-DD')
				},


				showFactoryPicker: false,
				showWorkshopPicker: false,

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
				c1: '',
				s1: '',
				c2: '',
				s2: '',

				cWidth: '',
				cHeight: '',
				pixelRatio: 1
			}
		},
		async onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getTree()



		},
		onPullDownRefresh() {
			console.log('refresh');
		},
		methods: {
			async getTableData() {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					...this.searchParam,
					...this.timeArrValueX
				}
				let res = await Promise.resolve(getMaterialTable(param))
				if (res[1].data.code == 200) {
					this.tableData = res[1].data.data
				}
			},
			handleClickShowSelect() {
				this.showPicker = !this.showPicker
			},
			handlePickerConfirm(val) {
				this.searchParam = {}
				this.selectText = `${val[0].label} - ${val[1].label}`
				if (val[0].value == -1) {} else {
					if (val[0].value == val[1].value) {
						this.searchParam = {
							id: val[0].value
						}
					} else {
						this.searchParam = {
							id: val[1].value
						}


					}
				}
				this.getColumnData2()
				this.getColumnData()
				this.getTableData()
			},



			handleClickFactoryPicker() {
				this.showFactoryPicker = true
			},
			handleClickWorkshopPicker() {
				this.showWorkshopPicker = true
			},
			factoryPickerConfirm(val) {
				this.factoryValue = this.factoryOpts[val[0]].label
				this.factoryId = this.factoryOpts[val[0]].value
			},
			workshopPickerConfirm(val) {
				this.workshopValue = this.workshopOpts[val[0]].label
				this.workshopId = this.workshopOpts[val[0]].value
			},

			async getColumnData() {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					...this.searchParam,
					...this.timeArrValue
				}
				let res = await Promise.resolve(getPlanActual(param))
				let categories = []
				let series = [{
					name: '计划',
					data: []
				}, {
					name: '实际',
					data: []
				}]
				this.hasFirst = true
				if (res[1].data.code == 200) {
					if (res[1].data.data.length == 0)
						this.hasFirst = false
					res[1].data.data.forEach(i => {
						categories.push(i.materialName)
						series[0].data.push(i.planSum)
						series[1].data.push(i.actualSum)
					})
					// this.c1 = categories
					// this.s1 = series
				}
				_self.showColumn("canvasColumn", {
					categories: categories,
					series: series
				});

			},
			async getColumnData2() {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					...this.searchParam,
					startTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					endTime: moment().add(1, 'days').format('YYYY-MM-DD')
				}
				let res = await Promise.resolve(getYesterdayToday(param))
				let categories = []
				let series = [{
					"name": "昨日",
					"data": []
				}, {
					"name": "今日",
					"data": []
				}]
				this.hasSecond = true
				if (res[1].data.code == 200) {
					if (res[1].data.data['昨日'].length == 0 && res[1].data.data['今日'].length == 0)
						this.hasSecond = false
					const arr = res[1].data.data
					arr['昨日'].forEach(i => {
						if (categories.indexOf(i.materialName) === -1)
							categories.push(i.materialName)
						series[0].data.push(i.actualSum)
					})
					arr['今日'].forEach(i => {
						if (categories.indexOf(i.materialName) === -1)
							categories.push(i.materialName)
						series[1].data.push(i.actualSum)
					})

					// res[1].data.data.forEach(i => {

					// 	categories.push(i.containerName)
					// 	series[0].data.push(i.produceDateNumList[0].num)
					// 	series[1].data.push(i.produceDateNumList[1].num)
					// })
				}

				this.c2 = categories
				this.s2 = series

				_self.showColumn2("canvasColumn2", {
					categories: categories,
					series: series
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
						show: true,
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
					colors: ['#5B8FF9', '#5AD8A6'],
					xAxis: {
						disableGrid: true,
						itemCount: 6,
						labelCount: 3,
						scrollShow: true,
						scrollAlign: 'left',
					},
					yAxis: {
						//disabled:true
						gridType: 'solid',
						splitNumber: 4,
						min: 0,
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
							width: _self.cWidth * _self.pixelRatio * 0.6 / 6
						}
					},
				});

			},

			showColumn2(canvasId, chartData) {
				canvaColumn2 = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					fontSize: 11,
					padding: [20, 15, 15, 15],
					legend: {
						show: true,
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
					colors: ['#5B8FF9', '#5AD8A6'],
					xAxis: {
						disableGrid: true,
						itemCount: 6,
						labelCount: 3,
						scrollShow: true,
						scrollAlign: 'left',
					},
					yAxis: {
						//disabled:true
						gridType: 'solid',
						splitNumber: 4,
						min: 0,
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
							width: _self.cWidth * _self.pixelRatio * 0.6 / 6
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

			touchColumn2(e) {
				canvaColumn2.scrollStart(e);
			},
			moveColumn2(e) {
				canvaColumn2.scroll(e);
			},
			touchEndColumn2(e) {
				canvaColumn2.scrollEnd(e);
				canvaColumn2.touchLegend(e, {
					animation: true,
				});
				canvaColumn2.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			handleOpenDropdown() {
				// this.showCanvas = false
			},
			handleCloseDropdown() {
				// setTimeout(() => {
				// 	this.showCanvas = true
				// }, 200)

			},
			selectListChangeX(val) {
				this.activeColumnX = val
				const timeArr = [{
						startTime: moment().format('YYYY-MM-DD'),
						endTime: moment().add(1, 'days').format('YYYY-MM-DD')
					}, {
						startTime: moment().startOf('week').add(1, 'days').format('YYYY-MM-DD'),
						endTime: moment().add(1, 'days').format('YYYY-MM-DD')
					},
					{
						startTime: moment().startOf('month').format('YYYY-MM-DD'),
						endTime: moment().add(1, 'days').format('YYYY-MM-DD')
					},
				]

				this.timeArrValueX = timeArr[val]
				this.getTableData()
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
					this.selectText = `${this.selectorObj[0].label} - ${this.selectorObj[0].children[0].label}`
					this.searchParam = {
						id: this.selectorObj[0].value
					}
					this.getColumnData()
					this.getColumnData2()
					this.getTableData()

				} catch (e) {
					console.log(e);
				}
			},
			selectListChange(val) {
				this.activeColumn = val
				const timeArr = [{
						startTime: moment().format('YYYY-MM-DD'),
						endTime: moment().add(1, 'days').format('YYYY-MM-DD')
					}, {
						startTime: moment().startOf('week').add(1, 'days').format('YYYY-MM-DD'),
						endTime: moment().add(1, 'days').format('YYYY-MM-DD')
					},
					{
						startTime: moment().startOf('month').format('YYYY-MM-DD'),
						endTime: moment().add(1, 'days').format('YYYY-MM-DD')
					},
				]

				this.timeArrValue = timeArr[val]
				this.getColumnData()
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
