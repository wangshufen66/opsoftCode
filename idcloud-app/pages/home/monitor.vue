<template>
	<view style="height: 100%;">
		<view class="example-body">
			<sl-filter ref="slFilter" :isTransNav="true" :navHeight="0" :independence="true" :menuList="menuList" @result="result"></sl-filter>
		</view>
		<view class="d-main d-position-bottom" :style="{ height: this.scrollHeight - 45 + 'px' }">
			<!-- refresher-enabled refresher-triggered="refreshTrigger" @refresherrefresh="scrollRefresh" -->
			<scroll-view enable-back-to-top scroll-y class="scroll-style">
				<view class="dm-content">
					<view @click="seeDetail(item)" class="dmc-content" v-for="(item, index) in list" :key="index">
						<view :style="{backgroundColor: item.dataShow.status.color}" class="dmc-title gray" ref="cardTitleDom">{{ item.ctrName }}</view>
						<view class="dmc-info dmc-info-text-gray">
							<view>
								<view class="dmc-info-title">设备编号：</view>
								<view class="dmc-info-text">{{ item.ctrNumber }}</view>
							</view>

							<view>
								<view class="dmc-info-title">运行状态：</view>
								<view ref="statusDom" :style="{color: item.dataShow.status.color}" class="dmc-info-text">{{ item.dataShow.status.describe }}</view>
							</view>
							<view v-for="k in item.dataShow.elseData" :key="k.id">
								<view style="color: #000;" class="dmc-info-title">{{ k.ctrName }}：</view>
								<view style="color: #000;" class="dmc-info-text">
									<text>{{ k.pointValue }}</text>
									<text v-if="k.pointUnit !== null">(</text>
									{{ k.pointUnit }}
									<text v-if="k.pointUnit !== null">)</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more v-show="hasLoadMore" :status="loadingStatus" :contentText="loadingText" @clickLoadMore="scrollToLower"></uni-load-more>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	import {
		getTreeData,
		getContainerList
	} from '@/api/monitor.js';
	export default {
		components: {
			slFilter
		},
		data() {
			return {
				// more/loading/nomore
				loadingStatus: 'loading',
				hasLoadMore: true,
				loadingText: {
					contentdown: '点击显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				noData: true,
				refreshTrigger: true,
				menuList: [{
						title: '工厂',
						isSort: true,
						isMutiple: false,
						key: 'factory',
						reflexTitle: true,
						detailList: [{
							title: '全部工厂',
							value: 'all'
						}]
					},
					{
						title: '车间',
						key: 'workshop',
						isSort: true,
						isMutiple: false,
						reflexTitle: true,
						detailList: []
					},
					{
						title: '设备',
						key: 'device',
						isSort: true,
						isMutiple: false,
						reflexTitle: true,
						detailList: []
					}
				],
				list: [],
				page: {
					total: 0,
					current: 1,
					size: 20
				},
				orgId: 0,
				info: {
					ctrType: 1,
					id: -1,
					previousFactory: -1,
					previousWorkshop: -1,
					isBottom: false
				}
			};
		},
		watch: {
			list(n) {
				n.length === 0 ? (this.noData = true) : (this.noData = false);
			}
		},
		onReady() {
			this.orgId = uni.getStorageSync('auth').orgId;
			this.init();
		},
		methods: {
			init() {
				this.initTree();
				this.initCard();
			},
			seeDetail(data) {
				// console.log(data);
				uni.navigateTo({
					url: '/pages/home/deviceDetail?data=' + encodeURIComponent(JSON.stringify(data))
				});
			},
			async scrollToLower() {
				this.loadingStatus = 'loading';
				if (this.info.isBottom === false) {
					this.page.current++;
					let param = {
						orgId: this.orgId,
						ctrType: this.info.ctrType,
						current_page: this.page.current,
						page_size: this.page.size
					};
					if (this.info.id !== -1) {
						param.id = this.info.id;
					}

					// uni.showLoading({
					// 	mask: true,
					// 	title: '加载中'
					// });
					let res = await this.getCardData(param);
					// uni.hideLoading();
					if (res[1].data.code === 200) {
						if (res[1].data.data.list.length < 20) {
							this.info.isBottom = true;
							this.loadingStatus = 'nomore';
						}
						res[1].data.data.list.forEach(i => {
							this.list.push(i);
						});
					}
				} else {
					this.loadingStatus = 'nomore';
				}
			},
			scrollRefresh() {
				console.log('refresh');
			},
			async getTree(param) {
				try {
					uni.showLoading({
						mask: true,
						title: '加载中'
					});
					let res = await Promise.resolve(getTreeData(param));
					uni.hideLoading();
					return res;
				} catch (e) {
					console.log(e);
				}
			},
			async getCardData(param) {
				try {
					this.loadingStatus = 'loading';
					let res = await Promise.resolve(getContainerList(param));
					if (res[1].data.code === 200) {
						res[1].data.data.list.forEach(i => {
							i.dataShow = {
								// 运行状态
								status: {
									value: '',
									describe: '-'
								},
								elseData: []
							};
							if (i.children.length > 0) {
								i.children.forEach(k => {
									// <!-- 运行状态：
									//     1：运行      绿色    #6BC855
									//     2：待机      蓝色    #2F7FE3
									//     3：调机      橙色    #FAA819
									//     4：故障      红色    #F9605A
									//     0：离线      灰色    #B0B0B0 -->
									if (k.ctrName === '运行状态') {
										i.dataShow.status.value = k.pointValue;
										if (k.pointValue === null) {
											i.dataShow.status.describe = '-';
											i.dataShow.status.color = '#B0B0B0'
										} else {
											switch (parseInt(k.pointValue)) {
												case 0:
													i.dataShow.status.describe = '离线';
													i.dataShow.status.color = '#B0B0B0'
													break;
												case 1:
													i.dataShow.status.describe = '运行';
													i.dataShow.status.color = '#6BC855'
													break;
												case 2:
													i.dataShow.status.describe = '待机';
													i.dataShow.status.color = '#2F7FE3'
													break;
												case 3:
													i.dataShow.status.describe = '调机';
													i.dataShow.status.color = '#FAA819'
													break;
												case 4:
													i.dataShow.status.describe = '故障';
													i.dataShow.status.color = '#F9605A'
													break;
												default:
													i.dataShow.status.describe = '-';
													i.dataShow.status.color = '#000000'
													break;
											}
										}
									} else {
										if (i.dataShow.elseData.length < 3) {
											i.dataShow.elseData.push(k);
										}
									}
								});
							}
						});
					} else {
						uni.showToast({
							title: '请求异常',
							icon: 'none'
						});
					}
					this.loadingStatus = 'more';
					return res;
				} catch (e) {
					console.log(e);
				}
			},
			async initTree() {
				try {
					const param = {
						orgId: this.orgId,
						ctrType: 1
					};
					let res = await this.getTree(param);
					if (res[1].data.code === 200) {
						let tmp = [];
						tmp.push({
							title: '全部工厂',
							value: 'all'
						});
						res[1].data.data.forEach(i => {
							tmp.push({
								title: i.ctrName,
								value: i.id
							});
						});
						this.menuList[0].detailList = tmp;
						this.$refs.slFilter.resetMenuList(this.menuList);
					}
				} catch (e) {
					console.log(e);
				}
			},
			async initCard() {
				try {
					const param = {
						orgId: this.orgId,
						ctrType: 1,
						current_page: 1,
						page_size: this.page.size
					};
					// uni.showLoading({
					// 	mask: true,
					// 	title: '加载中'
					// });
					let res = await this.getCardData(param);
					// uni.hideLoading();
					// console.log(res[1].data.data.list);
					if (res[1].data.code === 200) {
						this.list = res[1].data.data.list;
					}
				} catch (e) {
					//TODO handle the exception
				}
			},
			async fetchOtherCards(param) {
				try {
					this.info.ctrType = param.ctrType;
					param.id === undefined ? (this.info.id = -1) : (this.info.id = param.id);
					// uni.showLoading({
					// 	mask: true,
					// 	title: '加载中'
					// });
					let res = await this.getCardData(param);
					// uni.hideLoading();
					// console.log(res[1].data.data.list);
					if (res[1].data.code === 200) {
						this.list = res[1].data.data.list;
						if (this.list.length < 20) {
							this.loadingStatus = 'nomore'
						}
					}
				} catch (e) {
					//TODO handle the exception
				}
			},
			async result(data) {
				this.hasLoadMore = true;
				// console.log(data);
				this.info.isBottom = false;
				this.loadingStatus = 'loading';
				this.page.current = 1;
				this.list = [];
				const k = Object.keys(data)[0];
				const v = Object.values(data)[0];
				const f = [{
					title: '全部工厂',
					value: 'all'
				}];
				const w = [{
					title: '全部车间',
					value: 'all'
				}];
				const d = [{
					title: '全部设备',
					value: 'all'
				}];
				this.info.id = parseInt(v);
				switch (k) {
					case 'factory':
						this.info.ctrType = 1;
						if (v === 'all') {
							this.info.id = -1;
							this.menuList[1].detailList = [];
							this.menuList[2].detailList = [];
							this.$refs.slFilter.resetMenuList(this.menuList);

							await this.initCard();
						} else {
							this.info.previousFactory = parseInt(v);
							// uni.showLoading({
							// 	mask: true,
							// 	title: '加载中'
							// });
							let res = await this.getTree({
								orgId: this.orgId,
								ctrParent: parseInt(v),
								ctrType: 2
							});
							await this.fetchOtherCards({
								orgId: this.orgId,
								current_page: 1,
								page_size: 20,
								ctrType: 1,
								id: parseInt(v)
							});
							// uni.hideLoading();
							if (res[1].data.code === 200) {
								let tmp = w;
								res[1].data.data.forEach(i => {
									tmp.push({
										title: i.ctrName,
										value: i.id
									});
								});
								this.menuList[1].detailList = tmp;
								this.$refs.slFilter.resetMenuList(this.menuList);
							}
						}
						break;
					case 'workshop':
						this.info.ctrType = 2;
						if (v === 'all') {
							this.info.ctrType = 1;
							this.info.id = -1;
							this.menuList[2].detailList = [];
							this.$refs.slFilter.resetMenuList(this.menuList);
							await this.fetchOtherCards({
								orgId: this.orgId,
								current_page: 1,
								page_size: 20,
								ctrType: 1,
								id: this.info.previousFactory
							});
						} else {
							this.info.previousWorkshop = parseInt(v);
							// uni.showLoading({
							// 	mask: true,
							// 	title: '加载中'
							// });
							let res = await this.getTree({
								orgId: this.orgId,
								ctrParent: parseInt(v),
								ctrType: 3
							});
							await this.fetchOtherCards({
								orgId: this.orgId,
								current_page: 1,
								page_size: 20,
								ctrType: 2,
								id: parseInt(v)
							});
							// uni.hideLoading();
							if (res[1].data.code === 200) {
								let tmp = d;
								res[1].data.data.forEach(i => {
									tmp.push({
										title: i.ctrName,
										value: i.id
									});
								});
								this.menuList[2].detailList = tmp;
								this.$refs.slFilter.resetMenuList(this.menuList);
							}
						}
						break;
					case 'device':
						uni.showLoading({
							mask: true,
							title: '加载中'
						});
						this.hasLoadMore = false;
						this.info.ctrType = 3;
						if (v === 'all') {
							this.info.ctrType = 2;
							this.info.id = -1;
							await this.fetchOtherCards({
								orgId: this.orgId,
								current_page: 1,
								page_size: 20,
								ctrType: 2,
								id: this.info.previousWorkshop
							});
						} else {
							await this.fetchOtherCards({
								orgId: this.orgId,
								current_page: 1,
								page_size: 20,
								ctrType: 3,
								id: parseInt(v)
							});
						}
						uni.hideLoading();

						break;
					default:
						break;
				}
				// if (data.factory === '') {
				// 	let item = {
				// 		title: '车间',
				// 		isSort: true,
				// 		isMutiple: false,
				// 		key: 'workshop',
				// 		defaultSelectedIndex: 0,
				// 		detailList: [
				// 			{
				// 				title: '全部车间',
				// 				value: ''
				// 			}
				// 		]
				// 	};
				// 	this.menuList[1] = item;
				// 	this.$refs.slFilter.resetMenuList(this.menuList);
				// }
			},
			Back() {
				this.$com.pageBack();
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		background-color: #ffffff;
	}

	navi-style {
		margin-top: 25px;
		height: 45px;
	}

	/* ********TabBar******* */
	.tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #ffffff;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}

	.scroll-h {
		width: 750upx;
		height: 80upx;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		/* flex-wrap: nowrap; */
		/* border-color: #cccccc;
      	border-bottom-style: solid;
      	border-bottom-width: 1px; */
	}

	.line-h {
		height: 1upx;
		background-color: #cccccc;
	}

	.uni-tab-view {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		border: 1upx solid #0079fe;
		border-radius: 10upx;
	}

	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 34upx;
		padding-right: 34upx;
		border-right: 1upx solid #0079fe;
	}

	.uni-tab-item:nth-child(1) {
		border-right: 1upx solid #0079fe;
	}

	.uni-tab-item:last-child {
		border-right: 0upx solid #0079fe;
	}

	.uni-tab-item-title {
		color: #0079fe;
		font-size: 30upx;
		height: 70upx;
		line-height: 70upx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-active {
		background-color: #0079fe;
		color: #ffffff;
	}

	.uni-tab-item-title-active {
		color: #ffffff;
	}

	/* ********TabBar**结束***** */
	/* ********设备列表******* */

	.dm-content {
		margin-bottom: 10%;
		display: flex;
		width: 750rpx;
		flex-direction: row;
		flex-flow: wrap;
		padding: 0 20rpx;
	}

	.dmc-content {
		background-color: #ffffff;
		margin: 2%;
		display: flex;
		width: 320rpx;
		min-height: 182px;
		flex-direction: column;
		border-radius: 15upx;
		overflow: hidden;
		padding-left: 2px;
		/* 阴影 */
		box-shadow: 2px 2px 1px #f0efed;
		-moz-box-shadow: 5px 5px 1px #f0efed;
		-webkit-box-shadow: 5px 5px 1px #f0efed;
	}

	.dmc-title {
		font-size: 13px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 15upx 0;
	}

	.blue {
		background-color: #007fe1;
		color: #ffffff;
	}

	.gray {
		background-color: #888580;
		color: #f6f5f4;
	}

	.dmc-info {
		padding: 20upx 15upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.dmc-info view {
		display: flex;
		flex-direction: row;
	}

	.dmc-info-title {
		color: #777570;
		display: flex;
		min-width: 60px;
		justify-content: flex-start;
		align-items: center;
		white-space: nowrap;
	}

	.dmc-info-text {
		display: flex;
		flex: 1.1;
		justify-content: flex-end;
		align-items: center;
	}

	.dmc-info-text-blue {
		color: #148fe5;
	}

	.dmc-info-text-gray {
		color: #a3a3a3;
	}

	/* ********设备列表**结束***** */

	/* 悬浮图标 */
	.levitate-tree {
		z-index: 100;
		position: fixed;
		bottom: 40px;
		right: 20px;
		height: 30px;
		width: 30px;
		border: 1px solid #007aff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 悬浮图标****结束 */

	.example-drawer {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	.uni-cell-title {
		border-bottom: 1px solid #007aff;
		padding: 5px 10px;
		font-size: 14px;
		font-weight: bold;
	}

	.uni-cell-text {
		border-bottom: 1px solid #007aff;
		padding: 5px 10px;
	}

	.example-body {
		height: 51px;
	}

	::v-deep {
		.filter-content-list-item-active[data-v-0a95c349]:after {
			content: '';
		}
	}
</style>
