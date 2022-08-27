<template>
	<view class="container">
		<view class="title-wrapper center">
			<view>
				<image src="../../static/icon.png" class=""></image>
				<view style="font-size: 16px; font-weight: 400;">ID CLOUD {{version}}</view>
			</view>
		</view>
		<view class="list-wrapper">

			<view class="list-item">
				<view style="display: flex;">
					<view style="margin-left: 20px;" class="column-center"><text>版本号</text></view>
				</view>
				<view class="column-center right15">
					<view style="color: #8d8d8d;">{{detailVersion}}</view>
				</view>
			</view>

			<view @click="handleCheckUpdates" class="list-item">
				<view style="display: flex;">
					<view style="margin-left: 20px;" class="column-center"><text>检查更新</text></view>
				</view>
				<view class="column-center right15">
					<fa-icon size="20" type="angle-right" color=""></fa-icon>
				</view>
			</view>

		</view>

		<view class="fix-bottom-wrapper">
			<text>江苏欧联智能科技有限公司 版权所有</text>
		</view>

		<uni-popup ref="popup" type="dialog" :maskClick="false">
			<view style="width: 100%; background-color: #f8f8f8;">
				<text style="font-size: 14px;"> 正在下载：{{p}}% ({{d}} / {{f}} mb)</text>
				<button @click="abortDownload" style="font-size: 12px;">取消下载</button>
			</view>
		</uni-popup>

	</view>
</template>
<style lang="scss" scoped>
	.fix-bottom-wrapper {
		position: fixed;
		bottom: 10px;
		width: 100%;
		color: #626262;
		font-size: 12px;
		text-align: center;
	}

	.title-wrapper {
		width: 100%;
		padding-top: 45px;
		text-align: center;

		image {
			width: 72px;
			height: 72px;
			margin-bottom: 4px;
		}

		font-size: 16px;
	}
</style>

<script>
	import {
		getCurrentVersion
	} from '@/config/version.js'
	import {
		checkAppVersion
	} from '@/common/js/checkVersion.js'
	export default {
		onShow() {
			const appInfo = process.env.NODE_ENV === 'development' ? getCurrentVersion().dev : getCurrentVersion().prod
			this.detailVersion = appInfo.version
			this.version = this.detailVersion.split('_')[0]
		},
		onHide() {
			try {
				this.abortDownload()
			} catch (e) {
				console.log(e);
			}
		},
		data() {
			return {
				version: '',
				detailVersion: '',
				downloadTask: '',
				p: 0,
				d: 0,
				f: 0
			};
		},
		watch: {},
		methods: {
			abortDownload() {
				this.downloadTask.abort()
				this.$refs.popup.close()
				this.p = 0
				this.d = 0
				this.f = 0
			},
			async handleCheckUpdates() {
				// #ifdef H5
				uni.showToast({
					title: 'H5端无法(无需)更新版本',
					icon: 'none',
					mask: false,
					duration: 1500
				});
				// #endif
				
				// #ifdef APP-PLUS
				try {
					uni.showLoading({
						mask: true
					})
					const r = await checkAppVersion()
					const newVersionMsg = `\n更新信息:\n${r.msgArr.join('\n')}\n`
					console.log(newVersionMsg)
					console.log(`检查版本 ... 当前版本：${r.version},  服务器版本: ${r.serverVersion}, 差值 ${r.code}`);
					uni.hideLoading()
					if (r.code > 0) {
						uni.showModal({
							title: '发现新版本',
							content: `当前版本: ${r.version}\n新版本: ${r.serverVersion}\n${newVersionMsg}\n是否需要更新应用?`,
							success: (ev) => {
								if (ev.confirm === true) {
									const url = r.downloadUrl
									this.downloadTask = uni.downloadFile({
										url: url,
										success: (res) => {
											// console.log(res);
											if (res.statusCode === 200) {
												uni.saveFile({
													tempFilePath: res.tempFilePath,
													success(path) {
														console.log(path);
														plus.runtime.install(path.savedFilePath, {}, {}, (error) => {
															console.log(error);
															uni.showToast({
																title: '安装失败',
																icon: 'none',
																mask: false,
																duration: 1500
															});
														})
													}
												})
												uni.hideToast()
												this.$refs.popup.close()
											} else {
												uni.showToast({
													title: '下载失败',
													icon: "none",
													mask: false,
													duration: 1500
												});
											}
										}
									});
									this.$refs.popup.open()
									this.downloadTask.onProgressUpdate((progress) => {
										this.p = progress.progress
										this.d = (progress.totalBytesWritten / 1024 / 1024).toFixed(2)
										this.f = (progress.totalBytesExpectedToWrite / 1024 / 1024).toFixed(2)
									});
								}
								if (ev.cancel === true) {

								}
							},
							fail: (e) => {
								console.log(e);
							}
						})
					} else {
						uni.showToast({
							icon: "success",
							title: '已是最新版本'
						})
					}
				} catch (e) {
					console.log(e);
				}

				// #endif
			}
		}
	};
</script>
<style lang="scss" scoped>
	.center {
		display: flex;
		justify-content: center;
	}

	.list-wrapper {
		margin-top: 40rpx;
		height: 120px;
		border-top: #f2f2f2 1px solid;

		text {
			font-size: 16px;
			color: #232323;
		}

		.list-item {
			width: 100%;
			height: 60px;
			border-bottom: #f2f2f2 1px solid;
			display: flex;
			justify-content: space-between;

			.inner-image {
				width: 25px;
				height: 25px;
				margin-right: 8px;
				margin-left: 15px;
			}
		}
	}

	.list-space-between {
		display: flex;
		justify-content: space-between;
	}

	.right15 {
		margin-right: 15px;
	}

	.column-center {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
</style>
