<template>
	<view class="content">
		<!-- 微信小程序中canvas层级过高，如果需要使用这种前端组件 则需要先把图表隐藏起来 -->
		<!-- 		<u-dropdown @open="handleOpenDropdown" @close="handleCloseDropdown" >
			<u-dropdown-item :height="350" v-model="dropdownValue.factory" :title="dropdownValue.factory[0]" :options="dropdownOptions.factoryOption"></u-dropdown-item>
			<u-dropdown-item :height="350" v-model="dropdownValue.workshop" :title="dropdownValue.workshop[0]" :options="dropdownOptions.workshopOption"></u-dropdown-item>
		</u-dropdown> -->
		<view class="picker-wrapper">
			<view @click="handleClickShowSelect" style="width: 750rpx; text-align: center; color: #759EFE;">
				{{ selectText }}
				<u-icon name="arrow-down" size="18" style="margin-left: 12rpx; color: #759EFE; position: relative; bottom: 4rpx;" />
			</view>
		</view>

		<canvas
			canvas-id="canvasPie"
			id="canvasPie"
			class="charts"
			:width="cWidth * pixelRatio"
			:height="cHeight * pixelRatio"
			:style="{ width: cWidth + 'px', height: cHeight + 'px' }"
			@touchstart="touchPie"
		></canvas>
		<!-- 		<view  v-show="!showCanvas" :style="{'width':cWidth+'px','height':cHeight+'px', 'lineHeight': cHeight+'px', 'textAlign': 'center'}">
			<u-loading size="60" mode="flower" style="margin-right: 12rpx;"></u-loading>重新渲染中...
		</view> -->

		<view class="select-wrapper">
			<view class="select-btn" style="background-color: #fff6f6;" :style="{ border: activeBtn == '故障设备' ? '1px solid #e37e60' : '' }" @click="handleClickDevice('故障设备')">
				<view class="flex-col">
					<view class="btn-num" style="color: #e37e60;">{{ buttonValue.e }}</view>
					<view class="btn-text" style="color: #e37e60;">故障设备</view>
				</view>
			</view>
			<view class="select-btn" style="background-color: #f5fff6;" :style="{ border: activeBtn == '运行设备' ? '1px solid #81DDB0' : '' }" @click="handleClickDevice('运行设备')">
				<view class="flex-col">
					<view class="btn-num" style="color: #81DDB0;">{{ buttonValue.b }}</view>
					<view class="btn-text" style="color: #81DDB0;">运行设备</view>
				</view>
			</view>
			<view class="select-btn" style="background-color: #f7f7f7;" :style="{ border: activeBtn == '离线设备' ? '1px solid #B0B0B0' : '' }" @click="handleClickDevice('离线设备')">
				<view class="flex-col">
					<view class="btn-num" style="color: #B0B0B0;">{{ buttonValue.a }}</view>
					<view class="btn-text" style="color: #B0B0B0;">离线设备</view>
				</view>
			</view>
			<view class="select-btn" style="background-color: #fffcf1;" :style="{ border: activeBtn == '调机设备' ? '1px solid #F3C709' : '' }" @click="handleClickDevice('调机设备')">
				<view class="flex-col">
					<view class="btn-num" style="color: #F3C709;">{{ buttonValue.d }}</view>
					<view class="btn-text" style="color: #F3C709;">调机设备</view>
				</view>
			</view>
			<view class="select-btn" style="background-color: #e7f2ff;" :style="{ border: activeBtn == '待机设备' ? '1px solid #759EFE' : '' }" @click="handleClickDevice('待机设备')">
				<view class="flex-col">
					<view class="btn-num" style="color: #759EFE;">{{ buttonValue.c }}</view>
					<view class="btn-text" style="color: #759EFE;">待机设备</view>
				</view>
			</view>
		</view>

		<view class="device-title">{{ activeBtn }}</view>
		<view v-if="loading" style="width: 750rpx; text-align: center; line-height: 60rpx; margin: 40rpx 0;">
			<u-loading show size="32"></u-loading>
			<text style="margin-left: 24rpx; font-size: 32rpx;">加载中</text>
		</view>

		<view v-else class="card-wrapper">
			<device-card
				style="margin-bottom: 24rpx;"
				v-for="(item, index) in cards"
				:key="index"
				:cardId="item.id"
				:cardTitle="item.title"
				:cardData="item.data"
				@handleClickCard="handleClickCard"
			></device-card>
		</view>
		<u-empty v-if="!loading && cards.length == 0">没有设备</u-empty>
		<!-- 		<u-picker @confirm="factoryPickerConfirm" :range="factoryOpts" range-key="label" v-model="showFactoryPicker" mode="selector"></u-picker>
		<u-picker @confirm="workshopPickerConfirm" :range="workshopOpts" range-key="label" v-model="showWorkshopPicker" mode="selector"></u-picker> -->
		<u-select v-model="showPicker" mode="mutil-column-auto" :default-value="selectDefault" :list="selectorObj" @confirm="handlePickerConfirm"></u-select>
	</view>
</template>
<script>
import uCharts from '@/components/u-charts/u-charts.js';
import deviceCard from '@/components/deviceCard/index.vue';
import { getContainerTree } from '@/api/deviceProcess.js';
import { getPieData, getDeviceData } from '@/api/deviceMonitor/deviceStatus.js';
var _self;
var canvaPie = null;
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
			selectorObj: [
				{
					value: -1,
					label: '全部工厂',
					children: [
						{
							value: -1,
							label: '全部车间'
						}
					]
				}
			],
			searchParam: {},

			// showCanvas: true,
			cards: [],

			activeBtn: '全部设备',

			cWidth: '',
			cHeight: '',
			pixelRatio: 1,

			buttonValue: {
				a: 0,
				b: 0,
				c: 0,
				d: 0,
				e: 0
			},
			statusParam: {},
			extraParam: {},
			loading: false
		};
	},
	onLoad() {
		_self = this;
		this.cWidth = uni.upx2px(750);
		this.cHeight = uni.upx2px(500);
		this.getServerData();
	},
	onReady() {
		this.getTree();
		this.getDevice();
	},
	onPullDownRefresh() {
		console.log('refresh');
	},
	methods: {
		handlePickerConfirm(val) {
			this.searchParam = {};
			this.extraParam = {};
			this.selectText = `${val[0].label} - ${val[1].label}`;
			if (val[0].value == val[1].value && val[0].value !== -1) {
				this.extraParam = {
					ctrType: 1,
					id: val[1].value
				};
				this.searchParam = {
					type: 'factory',
					id: val[0].value
				};
			} else if (val[0].value !== val[1].value && val[0].value !== -1) {
				this.extraParam = {
					ctrType: 2,
					id: val[1].value
				};
				this.searchParam = {
					type: 'shop',
					id: val[1].value
				};
			}
			this.getServerData();
			this.getDevice();
		},
		handleClickFactoryPicker() {
			this.showFactoryPicker = true;
		},
		handleClickWorkshopPicker() {
			this.showWorkshopPicker = true;
		},
		factoryPickerConfirm(val) {
			this.factoryValue = this.factoryOpts[val[0]].label;
			this.factoryId = this.factoryOpts[val[0]].value;
		},
		workshopPickerConfirm(val) {
			this.workshopValue = this.workshopOpts[val[0]].label;
			this.workshopId = this.workshopOpts[val[0]].value;
		},
		handleClickCard(id, name) {
			uni.navigateTo({
				url: `./detail?id=${id}&name=${name}`
			});
		},
		handleClickDevice(val) {
			this.statusParam = {};
			this.activeBtn === val ? (this.activeBtn = '全部设备') : (this.activeBtn = val);

			const arr = ['离线设备', '运行设备', '待机设备', '调机设备', '故障设备'];
			arr.forEach((i, index) => {
				if (this.activeBtn == i) {
					this.statusParam = {
						status: index
					};
				}
			});
			this.getDevice();
		},
		async getDevice() {
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					...this.extraParam,
					...this.statusParam
				};
				this.loading = true;
				let res = await Promise.resolve(getDeviceData(param));
				this.loading = false;
				if (res[1].data.code == 200) {
					let arr = [];
					res[1].data.data.forEach((i, index) => {
						if (i.children == null) {
							i.children = [];
						}
						arr.push({
							id: i.id,
							title: {
								name: i.ctrName,
								color: '#3b3b3b'
							},
							data: [
								{
									name: '设备编号',
									value: i.ctrNumber
								},
								{
									name: '设备状态',
									value: '-',
									color: '#3b3b3b'
								}
							]
						});
						i.children.forEach((k, index2) => {
							if (k.ctrName == '运行状态') {
								const ls = [
									{
										name: '离线',
										color: '#ABABAB'
									},
									{
										name: '运行',
										color: '#81DDB0'
									},
									{
										name: '待机',
										color: '#759EFE'
									},
									{
										name: '调机',
										color: '#F3C709'
									},
									{
										name: '故障',
										color: '#E37E60'
									}
								];
								arr[index].data[1].value = ls[k.pointValue].name;
								arr[index].data[1].color = ls[k.pointValue].color;
								arr[index].title.color = ls[k.pointValue].color;
							} else {
								arr[index].data.push({
									name: k.ctrName,
									value: k.pointValue + k.pointUnit
								});
							}
						});
					});
					this.cards = arr;
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
				};
				let res = await Promise.resolve(getPieData(param));
				let series = [
					{
						name: '故障',
						data: 0,
						color: '#E37E60'
						// "format": (val) => `${val}%`
					},
					{
						name: '运行',
						data: 0,
						color: '#81DDB0'
					},
					{
						name: '离线',
						data: 0,
						color: '#ABABAB'
					},
					{
						name: '调机',
						data: 0,
						color: '#F3C709'
					},
					{
						name: '待机',
						data: 0,
						color: '#759EFE'
					}
				];
				this.buttonValue = {
					a: 0,
					b: 0,
					c: 0,
					d: 0,
					e: 0
				};
				if (res[1].data.code == 200 && res[1].data.data.length > 0) {
					res[1].data.data.forEach(i => {
						if (i.x == '0') {
							this.buttonValue.a = i.y;
							series[2].data = i.y;
						}
						if (i.x == '1') {
							this.buttonValue.b = i.y;
							series[1].data = i.y;
						}
						if (i.x == '2') {
							this.buttonValue.c = i.y;
							series[4].data = i.y;
						}
						if (i.x == '3') {
							this.buttonValue.d = i.y;
							series[3].data = i.y;
						}
						if (i.x == '4') {
							this.buttonValue.e = i.y;
							series[0].data = i.y;
						}
					});

					_self.showPie('canvasPie', {
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
				padding: [15, 15, 0, 15],
				legend: {
					show: true,
					padding: 5,
					lineHeight: 11,
					margin: 0
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
				}
			});
		},
		touchPie(e) {
			canvaPie.showToolTip(e, {
				format: function(item) {
					return item.name + ':' + item.data;
				}
			});
			canvaPie.touchLegend(e, {
				animation: true
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
		handleClickShowSelect() {
			this.showPicker = !this.showPicker;
		},
		async getTree() {
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId
				};
				let res = await Promise.resolve(getContainerTree(param));
				const arr1 = res[1].data.data.filter(i => i.ctrType == 1);
				const arr2 = res[1].data.data.filter(i => i.ctrType == 2);
				arr1.forEach(i => {
					this.selectorObj.push({
						value: i.id,
						label: i.ctrName,
						children: [
							{
								value: i.id,
								label: '全部设备'
							}
						]
					});
					arr2.forEach(k => {
						if (i.id == k.ctrParent) {
							this.selectorObj[this.selectorObj.length - 1].children.push({
								value: k.id,
								label: k.ctrName
							});
						}
					});
				});
				this.treeDisabled = false;
			} catch (e) {
				console.log(e);
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.card-wrapper {
	padding: 0 32rpx 32rpx 32rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
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

.select-wrapper {
	display: flex;
	justify-content: space-between;
	padding: 0 32rpx;
	margin: 48rpx 0;

	.select-btn {
		width: 120rpx;
		height: 120rpx;
		border-radius: 4rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		text-align: center;

		.btn-num {
			height: 80rpx;
			font-size: 56rpx;
			font-family: DINAlternate, DINAlternate-Bold;
			font-weight: 600;
		}

		.btn-text {
			height: 50rpx;
			font-size: 20rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
		}
	}
}

.device-title {
	padding-left: 32rpx;
	padding-bottom: 32rpx;
	font-size: 18px;
	font-family: PingFangSC, PingFangSC-Medium;
	font-weight: 500;
	color: #181818;
}

.picker-wrapper {
	width: 750rpx;
	height: 80rpx;
	line-height: 80rpx;
	display: flex;
}
</style>
