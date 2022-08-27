<template>
	<view class="finish">
		<view class="pic-container">
			<image src="../../../static/finish.png"></image>
		</view>
		<view v-if="hasCreateTicket" class="text-wrapper">
			<text style="margin-right: 4rpx;">设备点检结果异常，是否</text><text @click="handleClickCreate" style="color: #2F7FE3;"> 创建维修工单</text>
		</view>
		<view class="button-wrapper">
			<u-button @click="clickBack" shape="circle" type="primary" plain>返回首页</u-button>
			<u-button @click="clickDetail" shape="circle" type="primary">查看详情</u-button>
		</view>

	</view>
</template>
<style lang="scss" scoped>
	.pic-container {
		display: flex;
		justify-content: center;
		padding-top: 120rpx;
		margin-bottom: 42rpx;
	}

	.text-wrapper {
		text-align: center;
	}

	.button-wrapper {
		display: flex;
		justify-content: space-evenly;
		padding: 36rpx 24rpx 24rpx 24rpx;
	}

	image {
		width: 300rpx;
		height: 325rpx;
	}
</style>


<script>
	import {
		getReportDetail
	} from '@/api/deviceCheck.js'
	export default {
		onReady() {

		},
		onShow() {
			this.hasCreateTicket = this.$store.state.device.finishInfo.status === 1
		},
		data() {
			return {
				hasCreateTicket: true
			};
		},
		methods: {
			handleClickCreate() {
				uni.navigateTo({
					url: '/pages/application/deviceCheck/createTicket'
				})
			},
			clickBack() {
				uni.navigateBack({
					delta: getCurrentPages().length - 2
				})
			},
			async clickDetail() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						reportId: this.$store.state.device.finishInfo.reportId,
						workOrderId: this.$store.state.device.data.id
					}
					uni.showLoading({
						mask: true,
						title: '跳转中...'
					})
					let res = await Promise.resolve(getReportDetail(param))
					uni.hideLoading()
					await this.$store.dispatch('setReportDetailInfo', res[1].data.data)
					await this.$store.commit('setIsFromFinish', true)
					uni.navigateTo({
						url: "/pages/application/deviceCheck/detail"
					});
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: '跳转失败， 请重试'
					})
					console.log(e);
				}

			}
		}
	};
</script>
