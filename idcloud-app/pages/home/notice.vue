<template>
	<view class="scroll-style">
		<scroll-view scroll-y class="d-position-bottom" :style="{ height: this.scrollHeight + 'px' }">
			<view class="notice-type" @click="onMenuClick(item)" v-for="(item, index) in menu">
				<view class="notice-title">{{ item.title }}</view>
				<view class="notice-arrow">
					<text class="notice-num" v-show="item.unread">{{ item.unread }}</text>
					<image class="notice-img" src="../../static/images/icons/icon-right.png" mode="aspectFill"></image>
				</view>
			</view>
			<uni-load-more v-show="hasLoad" status="loading"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
import { getAllNotice, callAck } from '@/api/home.js';
export default {
	data() {
		return {
			list: [],
			//菜单
			menu: null,
			//页面数据列表
			noticeType: null,
			loadingStatus: 'loading',
			hasLoad: true
		};
	},
	onShow() {
		this.initList();
	},
	methods: {
		async initList() {
			try {
				this.hasLoad = true;
				//菜单
				this.menu = [
					{
						title: '设备维修通知',
						unread: 0,
						type: '1',
						name:'repair',
					},
					{
						title: '设备保养通知',
						unread: 0,
						type: '2',
						name:'maintenance',
					},
					{
						title: '设备点检通知',
						unread: 0,
						type: '3',
						name:'check',
					},
					{
						title: '设备加工任务通知',
						unread: 0,
						type: '4',
						name:'process',
					}
				];
				//页面数据列表
				this.noticeType = {
					//设备维修
					repair: [],
					//设备保养
					maintenance: [],
					//设备点检
					check: [],
					//设备加工
					process: []
				};
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					userId: uni.getStorageSync('extraUserInfo').userId
				};
				this.getList(param);
			} catch (e) {}
		},
		async getList(param) {
			try {
				let res = await getAllNotice(param);
				this.hasLoad = false;
				if (res[1].data.code === 200) {
					for (let i = 0; i < res[1].data.data.length; i++) {
						let item = res[1].data.data[i];
						switch (item.type) {
							case 1:
								//设备维修
								this.noticeType.repair.push(item);
								if (!item.isRead) {
									this.menu[0].unread += 1;
								}
								break;
							case 2:
								//设备保养
								this.noticeType.maintenance.push(item);
								if (!item.isRead) {
									this.menu[1].unread += 1;
								}
								break;
							//设备点检
							case 3:
								this.noticeType.check.push(item);
								if (!item.isRead) {
									this.menu[2].unread += 1;
								}
								break;
							//设备加工
							case 4:
								this.noticeType.process.push(item);
								if (!item.isRead) {
									this.menu[3].unread += 1;
								}
								break;
						}
					}
				}
				// return res;
			} catch (e) {
				//TODO handle the exception
			}
		},
		//菜单点击
		onMenuClick(item) {
			if (this.hasLoad) {
				uni.showToast({
					title: '正在加载中,请稍后重试',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: `/pages/home/noticedetil?type=${item.type}`
			});
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
	padding: 10rpx 20rpx 0 20rpx;
}
.notice-type {
	width: 710rpx;
	height: 100rpx;
	line-height: 100rpx;
	background-color: #fff;
	border-radius: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20rpx;
	margin-bottom: 20rpx;
	// /* 阴影 */
	// box-shadow: 2px 2px 1px #f0efed;
	// -moz-box-shadow: 5px 5px 1px #f0efed;
	// -webkit-box-shadow: 5px 5px 1px #f0efed;
}

.notice-title {
	// width: ;
	
}
.notice-arrow {
	display: flex;
	justify-content: center;
	align-items: center;
	.notice-img {
		height: 50rpx;
		width: 50rpx;
	}
	.notice-num {
		background-color: #ff3233;
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 18rpx;
		color: #fff;
		border-radius: 20rpx;
		text-align: center;
	}
}
</style>
