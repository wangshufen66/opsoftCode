<template>
	<view class="andon-container">
		<view class="title-placeholder"> </view>
		<view v-if="fullData.length == 0" class="flex-col no-position-wrapper">
			<view class="flex-row no-position">
				<view class="flex-col">
					<image src="../../../static/andon/devvice.png"></image>
					<text>暂无工位绑定信息</text>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="andon-body">
				<view class="body-left">
					<text>工位代码：</text>
					<text style="font-size: 13px;">{{initData.number}}</text>
					<text style="margin-top: 8px;">工位名称：</text>
					<text style="font-size: 13px;">{{initData.name}}</text>
				</view>
				<view class="body-right">
					<image src="../../../static/andon/devvice.png"></image>
				</view>
			</view>
			<view class="button-wrapper">
				<view v-for="(item, index) in initData.list" :key="index" class="button-group">
					<button @click="handleClickButton(item, initData)" :style="{backgroundColor: item.backgroundColor}" type="default">{{item.name}}</button>
				</view>

			</view>
			<view class="action-wrapper">
				<view @click="handleClickHome" style="margin-left: 36px;" class="flex-col">
					<view class="flex-row">
						<image src="../../../static/andon/homepage.png"></image>
					</view>

					<text>主页</text>
				</view>
				<view @click="handleClickList" style="margin-right: 26px;" class="flex-col">
					<view class="flex-row">
						<image src="../../../static/andon/switch.png"></image>
					</view>
					<text>工位列表</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		getList,
		andonControl
	} from '@/api/andon.js'
	export default {
		name: "andon",
		components: {},
		mixins: [],
		props: {},
		data() {
			return {
				fullData: [],
				initData: ''
			};
		},
		computed: {},
		watch: {},
		onReady() {
			this.getData()

		},
		onShow() {
			const position = this.$store.state.switchPosition.switched
			position == '' ? null : this.initData = position
		},
		onUnload() {
			this.$store.dispatch('setSwitchedPosition', '')
		},
		methods: {
			handleClickButton(item, obj) {
				uni.showModal({
					title: '提示',
					content: `触发按钮：${item.name}, 确认操作吗？`,
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					confirmColor: '#007FE1',
					success: async res => {

						if (res.confirm == true) {
							try {
								const param = {
									box8302Id: item.box8302Id,
									andonNumber: obj.number,
									andonName: obj.name,
									andonInfoId: obj.andonInfoId,
									box8302PointId: item.id
								}
								let res = await Promise.resolve(andonControl(param))
								console.log(res);
							} catch (e) {
								console.log(e);
							}
						}
					},
					fail: (e) => {
						console.log('e: ' + JSON.stringify(e));
					},
					complete: () => {}
				});
			},
			handleClickHome() {
				uni.navigateBack({
					animationType: 'zoom-fade-in',
					animationDuration: 200
				});
			},
			handleClickList() {
				uni.navigateTo({
					url: '/pages/home/andon/switch'
				});
				this.$store.dispatch('setPositionList', this.fullData)
			},
			async getData() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId
					};
					uni.showLoading({
						mask: true
					})
					let res = await Promise.resolve(getList(param))
					uni.hideLoading()
					if (res[1].data.code == 200) {
						this.fullData = res[1].data.data
						this.initData = res[1].data.data[0]
						this.fullData.forEach(k => {
							if (k.list !== null) {
								k.list.forEach(i => {
									switch (i.warningColor) {
										case 1:
											i.backgroundColor = '#ffba5a'
											break;
										case 2:
											i.backgroundColor = '#ff6161'
											break;
										case 3:
											i.backgroundColor = '#348df1'
											break;
										case 4:
											i.backgroundColor = '#05b77f'
											break;
										case 5:
											i.backgroundColor = '#FFFFFF'
											break;
										default:
											break;
									}
								})
							}
						})
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.flex-col {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.flex-row {
		display: flex;
		justify-content: center;
	}

	.no-position-wrapper {
		height: 100%;
	}

	.no-position {
		margin-bottom: 20vh;

		image {
			width: 200px;
			height: 100px;
		}

		text {
			margin-top: 20px;
			color: #FFFFFF;
			text-align: center;
		}
	}

	.title-placeholder {
		height: var(--window-top);
	}

	.andon-container {
		height: 100%;
		overflow-y: hidden;
		background-image: linear-gradient(#458091, #252984);
	}

	.andon-title {
		display: flex;
		justify-content: center;
		padding-top: 0;
		color: #FFFFFF;
		font-size: 15px;
	}

	.andon-body {
		display: flex;
		justify-content: space-between;
		padding: 24px;

		.body-left {
			width: 48%;
			display: flex;
			flex-direction: column;
			font-size: 15px;
			color: #FFFFFF;
		}

		.body-right {
			image {
				width: 175px;
				height: 114px;
			}
		}
	}

	.button-wrapper {
		display: flex;
		flex-wrap: wrap;
		margin-top: 8vh;
		width: 100%;

		.button-group {
			width: 50%;
			margin-bottom: 48px;

			button {
				width: 130px;
				height: 60px;
				font-size: 24px;
				border-radius: 30px;
			}
		}
	}

	.action-wrapper {
		width: 100%;
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 10vh;

		image {
			width: 44px;
			height: 44px;
		}

		text {
			margin-top: 12px;
			text-align: center;
			font-size: 18px;
			color: #37d7ff;
		}
	}
</style>
