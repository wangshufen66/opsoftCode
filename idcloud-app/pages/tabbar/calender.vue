<template>
	<view class="page">
		<view :style="{ height: 'var(--status-bar-height)', backgroundColor: '#fff' }"></view>
		<view class="tarBar"><text>日程任务</text></view>
		<scroll-view scroll-y :style="{ height: this.scrollHeight - 35 + 'px' }">
			<view>
				<!-- 日历 -->
				<view class="scroll-calendar">
					<zzx-calendar @selected-change="dateChange"></zzx-calendar>
				</view>
				<view class="uni-title">
					<text>{{ dateInfo.m }}月{{ dateInfo.d }}日</text>
					<text>{{ dateInfo.w }}</text>
				</view>
				<view class="uni-event">
					<uni-swipe-action class="swipe-container">
						<!-- val => {
									clickSwipe(val, item);
								} -->
						<uni-swipe-action-item @change="handleSwipeChange(item)" class="swipe-item" v-for="(item, index) in eventList" :key="index"
						 :options="swipeOpts" @click="handleClickSwipe">
							<view class="swipe-wrapper">
								<view class="swipe-title">
									<view style="display: flex;">
										<image class="title-pic" v-if="item.sort == 0" src="../../static/com/err1.png" style="height: 13px; width: 20px;"
										 mode="aspectFit"></image>
										<image class="title-pic" v-else-if="item.sort == 1" src="../../static/com/err2.png" style="height: 13px; width: 20px;"
										 mode="aspectFit"></image>
										<image class="title-pic" v-else-if="item.sort == 2" src="../../static/com/err3.png" style="height: 13px; width: 20px;"
										 mode="aspectFit"></image>
										<view class="title-blue" style="font-size: 14px;">{{ item.name }}</view>
									</view>
									<view style="margin-right: 10px;">
										{{ item.time }}
										<fa-icon style="margin-left: 15rpx;" type="clock-o" size="13" color="#6B6B6B"></fa-icon>
									</view>
								</view>
								<view class="swipe-text">
									<text>{{ item.mark }}</text>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</view>
			<uni-load-more v-show="hasLoadMore" :status="loadingStatus" :contentText="loadingText" @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>

		<!-- 悬浮添加图标 -->
		<view class="suspence-view" @click="noticeAdd">
			<fa-icon type="plus" size="22" color="#fff"></fa-icon>
		</view>
	</view>
</template>

<script>
	import {
		getScheduleList,
		deleteSchedule
	} from '@/api/schedule.js';
	import moment from 'moment';
	export default {
		components: {},
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
				showBadge: true,
				currentDate: '',
				dateInfo: {
					m: '',
					d: '',
					w: ''
				},
				signeddates: ['2020-4-9'],
				eventList: [],
				user: {
					id: ''
				},
				time: {
					start: '',
					end: ''
				},
				page: {
					size: 20,
					current: 1
				},
				isBottom: false,
				swipeOpts: [{
						text: '编辑',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				swipeData: {
					trigger: ''
				},
			};
		},
		onReady() {
			const dateObject = new Date(Date.now());
			moment.locale('zh-CN');
			this.dateInfo = {
				m: moment(dateObject).format('M'),
				d: moment(dateObject).format('D'),
				w: moment(dateObject).format('dddd')
			};
			const oz = moment(dateObject).format('YYYY-MM-DD') + ' 00:00:00';
			const arr = this.getStartEnd(moment(oz));
			this.time.start = arr[0];
			this.time.end = arr[1];
			this.user.id = uni.getStorageSync('extraUserInfo').userId;
			this.initList();
		},
		onShow() {
			if (this.time.start !== '') {
				this.user.id = uni.getStorageSync('extraUserInfo').userId;
				this.initList();
			}
		},
		methods: {
			handleSwipeChange(data) {
				this.swipeData.trigger = data
			},
			handleClickSwipe(data) {
				this.clickSwipe(data, this.swipeData.trigger)
			},
			// issue: 组件bug， 直接使用闭包方式添加自定义参数， 使得可以区别点击的是哪一个列表， 在app端可以， 在h5端不行。 所以曲线救国， 使用@change区别列表， 使用@click区别意图。 
			async clickSwipe(data, item) {
				if (data.content.text === '删除') {
					try {
						const param = {
							userId: item.userId,
							id: item.id
						};
						let res = await Promise.resolve(deleteSchedule(param));
						if (res[1].data.code === 200) {
							this.initList();
						}
					} catch (e) {
						console.log(e);
					}
				} else {
					const data = {
						type: 'edit',
						data: item
					};
					uni.navigateTo({
						url: '/pages/home/addEditCalender?data=' + encodeURIComponent(JSON.stringify(data))
					});
				}
			},
			getStartEnd(startDate) {
				const start = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
				const endTimeStamp = startDate.valueOf() + 1000 * 60 * 60 * 24;
				const end = moment(new Date(endTimeStamp)).format('YYYY-MM-DD HH:mm:ss');
				const arr = [start, end];
				return arr;
			},
			async getList(param) {
				try {
					this.loadingStatus = 'loading';
					let res = await Promise.resolve(getScheduleList(param));
					if (res[1].data.code === 200) {
						let r = res[1].data.data.records;
						r.forEach(i => {
							i.time = moment(moment(i.warnTime)).format('HH:mm');
						});
					}
					return res;
				} catch (e) {
					console.log(e);
				}
			},
			async loadMore() {
				if (this.isBottom === false) {
					this.loadingStatus = 'loading';
					this.page.current++;
					try {
						const param = {
							current_page: this.page.current,
							page_size: this.page.size,
							userId: this.user.id,
							warnTimeStart: this.time.start,
							warnTimeEnd: this.time.end
						};
						let res = await this.getList(param);
						if (res[1].data.code === 200) {
							res[1].data.data.records.forEach(i => {
								this.eventList.push(i);
							});
							this.loadingStatus = 'more';
							if (res[1].data.data.records.length < 20) {
								this.loadingText.contentnomore = '没有更多了';
								this.loadingStatus = 'nomore';
								this.isBottom = true;
							}
						}
					} catch (e) {
						console.log(e);
					}
				}
			},
			async initList() {
				try {
					const param = {
						current_page: 1,
						page_size: 20,
						userId: this.user.id,
						warnTimeStart: this.time.start,
						warnTimeEnd: this.time.end
					};
					this.hasLoadMore = true;
					this.loadingStatus = 'loading';
					let res = await this.getList(param);
					if (res[1].data.code === 200) {
						this.eventList = res[1].data.data.records;
						this.loadingStatus = 'more';
						if (res[1].data.data.total < 20) {
							this.hasLoadMore = false;
							this.loadingStatus = 'nomore';
						}
						if (res[1].data.data.total === 0) {
							this.hasLoadMore = true;
							this.loadingStatus = 'nomore';
							this.loadingText.contentnomore = '暂无日程';
						}
					}
				} catch (e) {
					console.log(e);
				}
			},
			async dateChange(e) {
				this.page.current = 1;
				this.hasLoadMore = true;
				this.isBottom = false;
				this.eventList = [];
				const dateObject = e.time;
				const date = e.fullDate;
				moment.locale('zh-CN');
				this.dateInfo = {
					m: moment(dateObject).format('M'),
					d: moment(dateObject).format('D'),
					w: moment(dateObject).format('dddd')
				};

				const arr = this.getStartEnd(dateObject);
				this.time.start = arr[0];
				this.time.end = arr[1];
				try {
					const param = {
						current_page: this.page.current,
						page_size: this.page.size,
						userId: this.user.id,
						warnTimeStart: this.time.start,
						warnTimeEnd: this.time.end
					};
					let res = await this.getList(param);
					if (res[1].data.code === 200) {
						this.eventList = res[1].data.data.records;
						this.loadingStatus = 'more';
						if (res[1].data.data.total < 20) {
							this.hasLoadMore = false;
							this.loadingStatus = 'nomore';
						}
						if (res[1].data.data.total === 0) {
							this.hasLoadMore = true;
							this.loadingStatus = 'nomore';
							this.loadingText.contentnomore = '暂无日程';
						}
					}
				} catch (e) {
					console.log(e);
				}
			},
			noticeAdd() {
				const data = {
					type: 'add',
					userId: uni.getStorageSync('extraUserInfo').userId
				};
				uni.navigateTo({
					url: '/pages/home/addEditCalender?data=' + encodeURIComponent(JSON.stringify(data))
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.swipe-wrapper {
		width: 100%;
		height: 95px;
	}

	.swipe-container {
		width: 90%;
	}

	.swipe-title {
		margin-top: 5px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding-left: 2px;
		padding-bottom: 5px;
		border-bottom: #f0f0f0 1px solid;
	}

	.swipe-text {
		padding-left: 25px;
		padding-top: 20rpx;

		text {
			color: #121212;
			font-size: 12px;
		}
	}

	.swipe-item {
		margin-bottom: 18rpx;
	}

	.title-pic {
		position: relative;
		top: 6px;
		margin-right: 4px;
	}

	::v-deep {
		.uni-swipe_box {
			height: 95px !important;
		}

		.zzx-calendar .is-checked {
			background: #2f7fe3;
			color: white !important;
		}

		.zzx-calendar .date {
			width: 30px;
			height: 30px;
			line-height: 30px;
		}

		.zzx-calendar .is-today {
			color: #2f7fe3;
		}

		.zzx-calendar .mode-change .mode-arrow-top {
			border-bottom: 5px solid #2f7fe3;
		}

		.zzx-calendar .mode-change .mode-arrow-bottom {
			border-top: 5px solid #2f7fe3;
		}
	}

	.tarBar {
		padding-top: 8px;
		background-color: white;

		text {
			font-size: 16px;
			font-weight: 500;
			color: #000000;
			margin-left: 16px;
			margin-top: 8px;
		}
	}

	.scroll-calendar {
		background-color: #ffffff;
		padding-bottom: 4px;
	}

	.page {
		background-color: #f6f5f4;
	}

	.bar-left-title {
		font-size: 16px;
		/* 相对偏移 */
		position: relative;
		left: 8px;
	}

	/*  */
	.uni-title {
		margin-left: 10px;
	}

	.uni-title text {
		padding: 0 10px;
		font-size: 37upx;
		color: #000;
		font-weight: bold;
	}

	.uni-event {
		display: flex;
		justify-content: center;
	}

	/******* 事件布局 *******/
	.uni-event-content {
		background-color: #ffffff;
		margin: 10px;
		padding: 10upx 20upx;
		border-radius: 10px;
	}

	.uni-ec-row {
		display: flex;
		flex-direction: row;
	}

	.uni-ec-row view {
		display: flex;
		align-items: center;
	}

	.uni-ec-row view:nth-child(1) {
		width: 25px;
	}

	.uni-ec-row view:nth-child(2) {
		flex: 1;
		justify-content: flex-start;
	}

	.uni-ec-row view:nth-child(3) {
		flex: 1;
		justify-content: flex-end;
		color: #6b6b6b;
	}

	/**** 事件布局 *****结束**/
	/**** 事件文字样式 *******/
	.title-blue {
		color: #004090;
		font-size: 13px;
	}

	.uni-ec-title {
		border-bottom: 1px solid #f2f2f2;
		padding: 6px 0;
	}

	.uni-ec-errtext {
		padding: 15px 0;
	}

	/**** 事件样式 ***结束*****/
	/**** 悬浮图标 ********/
	.suspence-view {
		position: absolute;
		bottom: 5%;
		right: 10%;
		height: 100upx;
		width: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		/* background-color: #0079FE; */
		background-color: rgba(170, 170, 170, 0.5);
		text-align: center;
		border-radius: 50%;
	}

	.suspence-view:active {
		background-color: rgba(170, 170, 170, 0.3);
		/* background-color:rgba(0,127,225,0.3); */
	}

	/**** 事件样式 ***结束*****/
</style>
