<template>
	<view>
		<view v-if="hasData" class="hint-wrapper">
			<view style="height: 100%; display: flex; flex-direction: column;justify-content: center;"><text>可帮助您看到该设备所监测到的所有信息。</text></view>
		</view>
		<uni-list v-if="hasData" class="showlist">
			<uni-list-item v-for="(item, index) in detailData.children" :key="index" :title="item.ctrName" :rightText="item.pointValue + ' ' + item.pointUnit"
			 :show-arrow="false"></uni-list-item>
		</uni-list>
		<view v-else class="image-wrapper">
			<view class="center-wrapper">
				<image class="noimage" src="@/static/wukefenggao.png"></image>
				<text>暂无监测点信息</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				detailData: {},
				hasData: false
			};
		},
		onLoad: data => {
			const item = JSON.parse(decodeURIComponent(data.data));
			uni.setStorageSync('deviceDetailTmp', item);
		},
		onReady() {
			let tmp = uni.getStorageSync('deviceDetailTmp');
			tmp.children.length === 0 ? (this.hasData = false) : (this.hasData = true);

			tmp.children.forEach(i => {
				if (i.pointValue === null) {
					i.pointValue = '-';
				}
				if (i.pointUnit === null) {
					i.pointUnit = '';
				}

				if (i.ctrName == '预警状态') {
					switch (i.pointValue) {
						case 0:
							i.pointValue = '无预警';
							break;
						case 1:
							i.pointValue = '预警';
							break;
						default:
							i.pointValue = '-';
							break;

					}

				}


			});
			uni.removeStorage({
				key: 'deviceDetailTmp'
			});

			this.detailData = tmp;
			uni.setNavigationBarTitle({
				title: this.detailData.ctrName
			});
		},
		methods: {
			Back() {
				uni.navigateBack({});
			}
		}
	};
</script>

<style lang="scss" scoped>
	::v-deep {
		.uni-list-item__content-title {
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			font-size: 16px;
			color: #212121;
		}

		.uni-list:after {
			height: 0;
			background-color: rgba(0, 0, 0, 0.1);
		}

		.uni-list-item__container:after {
			height: 0;
			background-color: rgba(0, 0, 0, 0.1);
		}

		.uni-list-item__extra-text {
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			font-size: 16px;
			color: #a3a3a3;
		}
	}

	.hint-wrapper {
		width: 100%;
		height: 130rpx;
		background-color: #f5f5f5;

		text {
			color: #7a7a7a;
			font-size: 12px;
			margin-left: 16px;
		}
	}

	.showlist {
		border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
	}

	.image-wrapper {
		height: 750rpx;
		display: flex;
		justify-content: center;

		text {
			color: #404040;
			font-size: 16px;
			margin: 0 auto;
		}

		.center-wrapper {
			display: flex;
			justify-content: center;
			flex-direction: column;
		}
	}

	.noimage {
		height: 355rpx;
		width: 375rpx;
	}
</style>
