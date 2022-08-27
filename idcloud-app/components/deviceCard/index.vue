<template>
	<view @click="handleClickCard" class="card-container">
		<view :style="{backgroundColor: cardTitle.color}" class="card-head">
			{{cardTitle.name}}
		</view>
		<view class="card-body">
			<view v-for="(item, index) in cardData" :key="index" class="card-row">
				<view class="first-item">{{item.name}}</view>
				<view :style="{color: item.color? item.color: ''}" class="second-item">{{item.value}}</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			cardTitle: {
				type: Object,
				default () {
					return {
						name: '',
						color: '#e0e0e0'
					}
				}
			},
			cardData: {
				type: Array,
				default () {
					return [];
				},
			},
			cardId: {
				type: String | Number,
				default () {
					return ''
				}
			}
		},
		methods: {
			handleClickCard() {
				this.$emit("handleClickCard", this.cardId, this.cardTitle.name);
			},
		},
	};
</script>
<style lang="scss" scoped>
	.card-container {
		width: 328rpx;
		border-radius: 10rpx;

		.card-body {
			padding: 8rpx 0 18rpx 24rpx;
			border: 1px solid #e8e8e8;
			border-top: 0;
			.card-row{
				display: flex;
			}
			.first-item {
				white-space: nowrap;
				margin-right: 16rpx;
				margin-bottom: 4rpx;
				font-size: 20rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				color: #7b7b7b;
			}

			.second-item {
				margin-bottom: 4rpx;
				font-size: 22rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				color: #181818;
			}

		}

		.card-head {
			padding: 0 18rpx;
			background-color: #779DFF;
			border-radius: 10rpx 10rpx 0 0;
			width: 328rpx;
			height: 60rpx;
			line-height: 60rpx;
			color: white;
			font-size: 26rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			overflow: scroll;
			white-space: nowrap;
		}
	}
</style>
