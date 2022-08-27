<template>
	<view>
		<uni-nav-bar id="navbar" ref="navBar" :status-bar="true" title="环境监测" @clickLeft="Back">
			<view slot="left" style="padding-left: 5px;">
				<fa-icon size="25" type="angle-left" color=""></fa-icon>
			</view>
			<view slot="right" class="position">
				<text @click="showPop" style="color: #2F7FE3;">{{pointName}}</text>
				<fa-icon style="position: relative; top: 1px; left: 6px;" size="22" :type="iconType" color="#2F7FE3"></fa-icon>
			</view>
		</uni-nav-bar>
		<scroll-view :style="{ height: mapHeight }" class="main-container" scroll-y>
			<view class="next-container">
				<view v-for="(item, index) in cardData" :key="index" class="inner-card-wrapper">
					<view class="card-title">
						<text>{{item.pointName}}</text>
						<text :style="{color: item.statusStyle}" :ref="'cardStatus_' + index">·</text>
					</view>
					<view class="card-subtitle">
						<image v-if="item.iconType === '温度'" style="width: 20px;height: 28px;" src="../../static/env/t.png"></image>
						<image v-else-if="item.iconType === '湿度'" style="width: 20px;height: 28px;" src="../../static/env/h.png"></image>
						<image v-else-if="item.iconType === '电量'" style="width: 18px;height: 28px;" src="../../static/env/ele.png"></image>
						<image v-else-if="item.iconType === '水量'" style="width: 24px;height: 28px;" src="../../static/env/w.png"></image>
						<image v-else-if="item.iconType === '气压'" style="width: 24px;height: 24px;" src="../../static/env/ki.png"></image>
						<image v-else-if="item.iconType === '燃气'" style="width: 24px;height: 24px;" src="../../static/env/gas.png"></image>
						<text>{{item.iconType}}</text>
					</view>
					<view class="card-value">
						<text>{{parseFloat(item.pointValue).toFixed(1)}}</text>
						<text v-if="item.iconType === '温度'">℃</text>
						<text v-else-if="item.iconType === '湿度'">%</text>
						<text v-else-if="item.iconType === '电量'">kW·h</text>
						<text v-else-if="item.iconType === '水量'">m³</text>
						<text v-else-if="item.iconType === '气压'">Pa</text>
						<text v-else-if="item.iconType === '燃气'">m³</text>
					</view>
				</view>
			</view>
			<uni-load-more style="margin-bottom: 16px;" v-show="hasLoadMore" :status="loadingStatus" :contentText="loadingText"
			 @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>

		<uni-popup ref="selectPoints" type="bottom" @change="handleShow">
			<view class="popupcontainer">
				<view class="pop-title">
					<text class="pop-title-text">筛选监测点</text>
				</view>
				<view @click="clickPopInner(item)" v-for="(item, index) in array" :key="index" class="pop-inner">
					<view style="display: flex; justify-content: center; height: 40px; line-height: 40px;">
						<image v-if="item.icon!==undefined" class="pop-image" :style="item.style" :src="item.icon"></image>
						<text>{{item.name}}</text>
					</view>
				</view>
				<view style="height: 12px; background-color: #FFFFFF;"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getList
	} from '@/api/envMonitor.js';
	export default {
		data() {
			return {
				// more/loading/nomore
				loadingStatus: 'loading',
				hasLoadMore: true,
				loadingText: {
					contentdown: '点击显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多了'
				},
				isBottom: false,
				array: [{
						name: '全部监测点',
						showName: '全部',
						showType: 1
					}, {
						name: '电量监测',
						showName: '电量',
						showUnit: 'kW·h',
						icon: '/static/env/ele.png',
						showType: 2,
						style: {
							height: '26px',
							top: '-1px'
						}
					},
					{
						name: '水量监测',
						showName: '水量',
						showUnit: 'm³',
						icon: '/static/env/w.png',
						showType: 3,
						style: {
							height: '22px'
						}
					},
					{
						name: '气压监测',
						showName: '气压',
						showUnit: 'Pa',
						icon: '/static/env/ki.png',
						showType: 4,
					}, {
						name: '温度监测',
						showName: '温度',
						icon: '/static/env/t.png',
						showType: 5,
						showUnit: '℃',
						style: {
							height: '26px',
							top: '0'
						}
					}, {
						name: '湿度监测',
						showName: '湿度',
						showUnit: '%',
						icon: '/static/env/h.png',
						showType: 6,
						style: {
							height: '26px',
							top: '0'
						}
					},
					{
						name: '燃气监测',
						showName: '燃气',
						showUnit: 'm³',
						showType: 7,
						icon: '/static/env/gas.png'
					}
				],
				mapHeight: '',
				pointName: '全部',
				pointStyleType: 1,
				iconType: 'angle-down',
				cardData: [],
				page: {
					current: 1,
					size: 20,

				}
			};
		},
		onReady() {
			const query = uni.createSelectorQuery().in(this);
			const windowHeight = uni.getSystemInfoSync().windowHeight;
			query
				.select('#navbar')
				.boundingClientRect(data => {
					this.mapHeight = windowHeight - data.height + 'px';
				})
				.exec();
			this.initList()
		},
		onShow() {},
		methods: {
			async initList() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						current_page: 1,
						page_size: this.page.size
					}
					let res = await this.fetchList(param)
					if (res !== null) {
						this.cardData = res[1].data.data.records
						if (this.cardData.length < this.page.size) {
							this.loadingStatus = 'nomore'
							this.hasLoadMore = false
						} else {
							this.loadingStatus = 'more'
						}
					}

				} catch (e) {
					console.log(e);
				}
			},
			async fetchList(param) {
				try {
					this.loadingStatus = 'loading'
					let res = await Promise.resolve(getList(param))
					if (res[1].data.code === 200) {
						res[1].data.data.records.forEach(i => {
							if (i.onlineStatus === null) {
								i.statusStyle = 'red'
							} else if (parseInt(i.onlineStatus) > 0) {
								i.statusStyle = '#10F000'
							} else {
								i.statusStyle = 'red'
							}
							switch (i.style) {
								case 1:
									i.iconType = '全部'
									break;
								case 2:
									i.iconType = '电量'
									break;
								case 3:
									i.iconType = '水量'
									break;
								case 4:
									i.iconType = '气压'
									break;
								case 5:
									i.iconType = '温度'
									break;
								case 6:
									i.iconType = '湿度'
									break;
								case 7:
									i.iconType = '燃气'
									break;
								default:
									break;
							}
						})
						return res
					} else if (res[1].data.code === 403) {
						uni.showToast({
							title: '权限不足',
							icon: 'none'
						});
						this.hasLoadMore = false
					} else {
						return null
					}

				} catch (e) {
					console.log(e);
				}
			},
			async getMoreData() {
				try {
					let param = {
						orgId: uni.getStorageSync('auth').orgId,
						current_page: this.page.current,
						page_size: this.page.size
					}
					console.log(this);
					switch (this.pointStyleType) {
						case 2:
							param.style = 2
							break;
						case 3:
							param.style = 3
							break;
						case 4:
							param.style = 4
							break;
						case 5:
							param.style = 5
							break;
						case 6:
							param.style = 6
							break;
						case 7:
							param.style = 7
							break;
						default:
							break;
					}
					let res = await this.fetchList(param)
					if (res !== null) {
						this.cardData = [...this.cardData, ...res[1].data.data.records]
						if (res[1].data.data.records.length < this.page.size) {
							this.loadingStatus = 'nomore'
							this.isBottom = true
						} else {
							this.loadingStatus = 'more'
						}
					}

				} catch (e) {
					console.log(e);
				}
			},
			async loadMore() {
				if (!this.isBottom) {
					this.page.current++
					this.getMoreData()
				}

			},
			showPop() {
				this.$nextTick(() => {
					this.$refs['selectPoints'].open()
				})
			},
			handleShow(data) {
				data.show === true ? this.iconType = 'angle-up' : this.iconType = 'angle-down'
			},
			async clickPopInner(item) {
				this.$refs['selectPoints'].close()
				this.pointName = item.showName
				this.pointStyleType = item.showType
				this.hasLoadMore = true
				this.isBottom = false
				this.page.current = 1
				this.cardData = []
				await this.getMoreData()
			},
			Back() {
				this.$com.pageBack();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.card-title {
		padding: 2px 2px 0 12px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 6px;

		text:nth-child(1) {
			font-size: 14px;
			color: #212121;
		}

		text:nth-child(2) {
			font-size: 48px;
			line-height: 20px;
		}
	}

	.card-subtitle {
		display: flex;
		justify-content: center;
		margin-top: 3px;

		image {
			margin-right: 8px;
		}

		text {
			line-height: 24px;
			margin: auto 0;
			color: rgba(0, 0, 0, 0.5);
			;
		}
	}

	.card-value {
		display: flex;
		justify-content: center;
		margin-top: 4px;
		flex-wrap: wrap;

		text {
			font-size: 24px;
			font-weight: 600;
			color: #2b7fe4;
		}

		text:nth-child(1) {
			margin-right: 2px;
		}

		text:nth-child(2) {}
	}

	.main-container {
		width: 100%;
		background-color: #F4F4F4;
	}

	.next-container {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 20px;
	}

	.inner-card-wrapper {
		// height: 120px;
		width: 44%;
		background-color: #FFFFFF;
	}

	.inner-card-wrapper:nth-child(odd) {
		margin: 4% 2% 0 4%;
		// background-color: red;
	}

	.inner-card-wrapper:nth-child(even) {
		margin: 4% 4% 0 2%;
		// background-color: blue;
	}




	.popupcontainer {
		background-color: #FFFFFF;
	}

	.pop-inner {
		height: 40px;
		line-height: 40px;

		image {
			margin: auto 0;
			position: relative;
			top: 0;
		}

		text {
			margin: auto 0 auto 6px;
		}
	}

	.pop-inner:hover {
		background-color: #f6faff;
	}

	// .pop-inner:left{
	// 	background-color: red;
	// }

	.pop-title {
		padding: 12px 20px 0 20px;

		.pop-title-text {
			line-height: 40px;
			font-weight: 600;
			color: #000000;
			font-size: 16px;
		}
	}

	.pop-image {
		width: 20px;
		height: 20px;
	}
</style>
