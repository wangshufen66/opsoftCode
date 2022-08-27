<template>
	<view class="legend-wrapper">
		<view style="display: flex;">
			<view class="color-box" style="background-color: #5AD8A6;"></view>
			<text class="box-text">运行状态</text>
		</view>

		<view style="display: flex;">
			<view class="color-box" style="background-color: #ABABAB;"></view>
			<text class="box-text">离线状态</text>
		</view>

		<view style="display: flex;">
			<view class="color-box" style="background-color: #E8684A;"></view>
			<text class="box-text">故障状态</text>
		</view>

		<view style="display: flex;">
			<view class="color-box" style="background-color: #5B8FF9;"></view>
			<text class="box-text">待机状态</text>
		</view>

		<view style="display: flex;">
			<view class="color-box" style="background-color: #F6BD16;"></view>
			<text class="box-text">调机状态</text>
		</view>

	</view>
</template>

<script>
	export default {

	}
</script>

<style lang="scss" scoped>
	.legend-wrapper {
		margin-bottom: 48rpx;
		width: 750rpx;
		height: 28rpx;
		font-size: 28rpx;
		line-height: 28rpx;
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;

		.color-box {
			width: 16rpx;
			height: 16rpx;
			line-height: 28rpx;
			margin: auto 0;
		}

		.box-text {
			margin-left: 8rpx;
			font-size: 20rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			color: #8c8c8c;
			line-height: 28rpx;
		}
	}
</style>
