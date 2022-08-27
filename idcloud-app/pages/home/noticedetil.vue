<template>
	<view class="scroll-style">
		<scroll-view scroll-y class="d-position-bottom" :style="{ height: this.scrollHeight + 'px' }">
			<view style="display: flex; flex-direction: column">
				<view style="display: flex; justify-content: center;">
					<view style="width: 95%;">
						<!-- :class="[item.isactive ? 'p-cover' : '']" -->
						<view class="p-column" v-for="(item, index) in list" :key="index" @click="onCardClick(item)">
							<view class="p-top">
								<view class="p-title">{{ item.name }}</view>
								<view class="p-time">{{ item.createTime }}</view>
								<view :class="item.isRead ? '' : 'p-unread'"></view>
							</view>
							<view class="p-content">
								<view class="p-main">{{ item.mark }}</view>
								<view class="p-sub">{{ item.advise }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more
				v-show="hasLoadMore"
				:status="loadingStatus"
				:contentText="loadingText"
				@clickLoadMore="loadMore"
			></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
// import moment from 'moment';
import { getLogs, callAck } from '@/api/home.js';
// let listData = [
// 	{
// 		title: '日程更新提醒',
// 		time: '5分钟前',
// 		content: '您收到一条 级别的任务安排 , 请尽快达成！',
// 		advise: '在个人日程中心可查看任务详情！',
// 		isactive: false
// 	}
// ];

export default {
	data() {
		return {
			// more/loading/nomore
			loadingStatus: 'loading',
			hasLoadMore: true,
			isBottom: false,
			loadingText: { contentdown: '点击显示更多', contentrefresh: '正在加载...', contentnomore: '没有更多了' },
			list: [],
			page: {
				size: 20,
				current: 1,
				type: ''
				// total: 0
			}
		};
	},
	onLoad(obj) {
		//获取路由中的类型和数据总数
		this.page.type = obj.type;
		// this.page.total =Number(obj.total);
	},
	onShow() {
		this.initList();
	},
	methods: {
		async loadMore() {
			if (!this.isBottom) {
				this.page.current++;
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						userId: uni.getStorageSync('extraUserInfo').userId,
						page_size: this.page.size,
						current_page: this.page.current,
						type: this.page.type
					};
					let res = await this.getList(param);
					if (res[1].data.code === 200) {
						if (res[1].data.data.records.length === 20) {
							this.loadingStatus = 'more';
						} else {
							this.loadingStatus = 'nomore';
						}
						res[1].data.data.records.forEach(i => {
							this.list.push(i);
						});
					}
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		async initList() {
			// if (this.$store.state.notice.data.length) {
			// 	this.list = this.$store.state.notice.data;
			// 	if(this.page.total<20){
			// 		this.loadingStatus = 'nomore';
			// 	}
			// } else {
			this.list = [];
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					userId: uni.getStorageSync('extraUserInfo').userId,
					page_size: this.page.size,
					type: this.page.type,
					current_page: 1
				};
				let res = await this.getList(param);
				this.list = res[1].data.data.records;
				if (this.list.length < 20) {
					this.loadingStatus = 'nomore';
					this.isBottom = true;
				}
				// this.logList = res[1].data.data.records;
				// uni.setStorageSync('closestLog', this.logList[0]);
			} catch (e) {}
			// }
		},
		async getList(param) {
			try {
				this.loadingStatus = 'loading';
				return await getLogs(param);
				// if (res[1].data.code === 200) {
				// }
				// if (res[1].data.code === 200) {
				// 	res[1].data.data.records.forEach(i => {
				// 		if (i.name === '日程任务提醒') {
				// 			switch (i.sort) {
				// 				case 0:
				// 					i.mark = '您收到一条低优先级的任务安排 , 请尽快达成!';
				// 					break;
				// 				case 1:
				// 					i.mark = '您收到一条中优先级的任务安排 , 请尽快达成!';
				// 					break;
				// 				case 2:
				// 					i.mark = '您收到一条高优先级的任务安排 , 请尽快达成!';
				// 					break;
				// 				default:
				// 					break;
				// 			}
				// 			i.advise = '(在日程任务中心可查看任务详情 ! )';
				// 		} else if (i.name === '报警日志提醒') {
				// 			i.mark = '您收到一条报警日志，请尽快处理！';
				// 			i.advise = '(在报警日志中心可查看报错信息详情 ! )';
				// 		}
				// 	});
				// }
			} catch (e) {
				//TODO handle the exception
			}
		},
		//通知点击
		async onCardClick(item) {
			let url = '';
			let res = await callAck({
				orgId: item.orgId,
				userId: item.userId,
				id:item.id
			});
			if (res[1].data.code === 200) {
				switch (item.type) {
					case 1:
						url = `/pages/application/deviceRepair/ticket?jump=1&number=${item.orderNumber}`;
						break;
					case 2:
						url = `/pages/application/deviceMaintenance/ticket?jump=1&number=${item.orderNumber}`;
						break;
					case 3:
						url = `/pages/application/deviceCheck/ticket?jump=1&number=${item.orderNumber}`;
						break;
					case 4:
						url = `/pages/application/deviceProcess/taskInfo?id=${item.userId}&status=${item.orderStatus}`;
						break;
				}
				uni.navigateTo({
					url
				});
			} else {
				uni.showToast({
					title: '网络错误,请稍后重试',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f6f5f4;
}
.page,
.scroll-style {
	background-color: #f6f5f4;
}
.d-position-bottom {
	// padding: 0 20rpx;
}
.page {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60upx;
}

.p-column {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	margin-top: 20px;
	width: 100%;
	border-radius: 20upx;
	overflow: hidden;
	/* 阴影 */
	box-shadow: 2px 2px 1px #f0efed;
	-moz-box-shadow: 5px 5px 1px #f0efed;
	-webkit-box-shadow: 5px 5px 1px #f0efed;
}

.p-top {
	display: flex;
	flex-direction: row;
	padding: 20upx 25upx;
	border-bottom: 1px solid #f2f2f2;
	position: relative;
}

.p-title {
	display: flex;
	flex: 1;
	justify-content: flex-start;
	align-items: center;
	font-size: 13px;
}

.p-time {
	display: flex;
	flex: 1;
	justify-content: flex-end;
	align-items: center;
	font-size: 10px;
}

.p-content {
	display: flex;
	flex-direction: column;
	padding: 30upx 25upx;
}

.p-sub {
	font-size: 25upx;
	color: #808080;
}

.p-cover {
	filter: alpha(opacity=80);
	opacity: 0.6;
}

.p-red {
	background-color: #ff3233;
	color: #ffffff;
}
.p-unread {
	width: 12rpx;
	height: 12rpx;
	background-color: #ff3233;
	border-radius: 6rpx;
	position: absolute;
	right: 10rpx;
	top: 10rpx;
}
</style>
