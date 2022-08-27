<template>
	<view class="page">
		<scroll-view scroll-y class="d-position-bottom" :style="{ height: this.scrollHeight + 'px' }">
			<view class="p-list">
				<view v-for="(item, index) in list" :key="index" class="card-wrapper">
					<view class="card-title-wrapper" :class="item.showStatus.titleClass">
						<text>{{ item.deviceName }}</text>
						<text>{{ item.showStatus.description }}</text>
					</view>
					<view class="card-body-wrapper">
						<view class="p-content">
							<view class="p-main">
								<view class="p-main-row">
									<view class="p-row-title">故障代码：</view>
									<view style="min-width: 110px;">{{ item.faultCode }}</view>
								</view>
							</view>
							<view class="p-main">
								<view class="p-main-row">
									<view class="p-row-title">设备编号：</view>
									<view>{{ item.deviceNumber }}</view>
								</view>
							</view>
							<view class="p-main">
								<view class="p-main-row">
									<view class="p-row-title">报警时间：</view>
									<view style="min-width: 110px;">{{ item.time }}</view>
								</view>
							</view>
							<view class="p-main">
								<view class="p-main-row">
									<view class="p-row-title">故障描述：</view>
									<view style="min-width: 110px;">{{ item.description }}</view>
								</view>
							</view>
							<view class="p-main">
								<view class="p-main-row">
									<view class="p-row-title">备注信息：</view>
									<view style="min-width: 110px;">{{ item.mark }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingStatus" :contentText="loadingText" @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';
import { getLogList } from '@/api/alarmLog.js';
export default {
	components: {
		uniCollapse,
		uniCollapseItem
	},
	onReady() {
		this.initList();
	},
	data() {
		return {
			showBadge: true,
			list: [],
			page: {
				current: 1,
				size: 20
			},
			// more/loading/nomore
			loadingStatus: 'loading',
			loadingText: { contentdown: '点击显示更多', contentrefresh: '正在加载...', contentnomore: '没有更多数据了' }
		};
	},
	methods: {
		async loadMore(data) {
			if (data.detail.status === 'more') {
				this.loadingStatus = 'loading';
				this.page.current++;
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					current_page: this.page.current,
					page_size: this.page.size
				};
				let res = await this.getLogList(param);
				if (res.length < 20) {
					this.loadingStatus = 'nomore';
				} else {
					this.loadingStatus = 'more';
				}
				res.forEach(i => {
					this.list.push(i);
				});
			}
		},
		async initList() {
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					current_page: 1,
					page_size: this.page.size
				};
				let res = await this.getLogList(param);
				this.list = res;
				this.loadingStatus = 'more';
				if (this.list.length < 20) {
					this.loadingStatus = 'nomore';
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		async getLogList(param) {
			try {
				let res = await Promise.resolve(getLogList(param));
				if (res[1].data.code === 200) {
					let r = res[1].data.data.records;
					r.forEach(i => {
						i.showStatus = {
							code: i.deviceStatus,
							description: ''
						};
						switch (parseInt(i.deviceStatus)) {
							case -1:
								i.showStatus.description = '无状态';
								i.showStatus.titleClass = 'title-blue';
								break;
							// TODO 添加更多状态
							default:
								break;
						}
					});
					return r;
				} else {
					uni.showToast({
						icon: 'none',
						title: '请求失败'
					});
				}
			} catch (e) {
				console.log(e);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.card-wrapper {
	width: 92%;
	margin: 10rpx 0;
	.card-title-wrapper {
		height: 60rpx;
		width: 100%;
		background-color: #ffffff;
		border-radius: 5px 5px 0 0;
		color: white;
		padding: 2px 0 0 0;
		display: flex;
		justify-content: space-between;
		text {
			padding: 0 8px 0 8px;
			font-size: 14px;
			font-family: PingFangSC, PingFangSC-Medium;
			font-weight: 500;
		}
	}
	.card-body-wrapper {
		background-color: #ffffff;
		padding: 0 10rpx;
		border-left: #f1f1f1 1px solid;
		border-right: #f1f1f1 1px solid;
		border-bottom: #f1f1f1 1px solid;
		border-radius: 4px;
	}
}
.title-blue {
	background-color: #2f7fe3 !important;
	color: #ffffff;
}
page {
	background-color: #f6f5f4;
}
.page {
	width: 100%;
}
.p-list {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 20upx;
}
.p-column {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	margin-top: 30upx;
	width: 93%;
	border-radius: 15upx;
	overflow: hidden;
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
	padding: 20upx 30upx;
}
.p-cover {
	filter: alpha(opacity=80);
	opacity: 0.6;
}
.p-red {
	background-color: #ff5e59;
	color: #ffffff;
}
.p-gray {
	background-color: #bbb7b0;
	color: #ffffff;
}
.p-main,
.p-main-row {
	display: flex;
	flex-direction: row;
	font-size: 10px;
}
.text-pad {
	padding-left: 10upx;
}
.p-row-title {
	color: #9e9b98;
	white-space: nowrap;
}

::v-deep {
	.fa-caret-up:before {
		content: '';
	}

	.uni-collapse-cell__title:active {
		background-color: #ff5e59;
	}
}
</style>
