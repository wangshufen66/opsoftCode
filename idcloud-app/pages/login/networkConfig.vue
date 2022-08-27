<template>
	<view class="container">
		<view class="main">
			<view class="title"><text>网络地址</text></view>
			<view class="uni-form-item uni-column input"><input class="uni-input" type="text" v-model="ipAddr" /></view>
		</view>
		<view class="main">
			<view class="title"><text>端口号</text></view>
			<view class="uni-form-item uni-column input"><input class="uni-input" type="number" v-model="portNum" /></view>
		</view>
		<button @click="handleConfirm" style="width: 85%;background-color: #2f7fe3; color: white; margin-top: 32px; font-size: 14px;font-weight: 700;">确
			定</button>
		<view style="color: #007AFF; text-align: center; position: fixed; bottom: 36rpx; width: 750rpx;"><text  @click="handleCheckUpdates">检查更新</text></view>
	</view>
</template>

<script>
	import {
		checkAppVersion
	} from '@/common/js/checkVersion.js'
	import {
		getCurrentVersion
	} from '@/config/version.js'
	export default {
		onShow() {
			const config = uni.getStorageSync('networkConfig')
			this.ipAddr = config.ipAddr
			this.portNum = config.port
		},
		data() {
			return {
				ipAddr: '',
				portNum: ''
			};
		},
		methods: {
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
			},
			handleConfirm() {
				const res = this.rules()
				if (res !== 0) {
					uni.showToast({
						title: res,
						icon: "none"
					})
				} else {
					uni.setStorageSync('networkConfig', {
						ipAddr: this.ipAddr,
						port: this.portNum
					})
					uni.navigateBack()
				}
			},
			rules() {
				const reg =
					/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
				if (this.ipAddr == '')
					return '网络地址(IP地址)不得为空'
				if (!reg.test(this.ipAddr))
					return 'IP格式不正确'
				if (this.portNum == '')
					return '端口号不得为空'
				if (this.portNum <= 0 || this.portNum > 65535)
					return '端口号不在合法范围内'
				return 0
			}
		}
	};
</script>
<style lang="scss" scoped>
	.log-out {
		position: relative;
		bottom: 20px;
		background-color: red;
		color: #f76260;
	}
</style>
<style>
	page {
		background: #f6f5f4;
	}

	.main {
		background: #ffffff;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #f6f5f4;
		padding: 6px 0;
	}

	.main view {
		display: flex;
		align-items: center;
	}

	.title {
		font-size: 120%;
		flex: 1;
		padding-left: 30upx;
	}

	.input {
		flex: 3;
	}

	.u-img {
		display: flex;
		flex: 3;
		justify-content: flex-end;
	}

	.fa-icon-style {
		margin-right: 35upx;
	}

	input {
		text-align: left;
		width: 90%;
	}

	image {
		width: 85upx;
		height: 85upx;
		/* border-radius: 30upx; */
		margin: 10upx 30upx;
		/* background: url('');
		background-repeat: no-repeat;
		background-size: 100% 100%; */
	}

	.btn {
		width: 90%;
		font-size: 36upx;
	}
</style>
