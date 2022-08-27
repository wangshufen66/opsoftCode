<template>
	<view class="container">
		<view class="main">
			<view class="title"><text>头像</text></view>
			<view @click="uploadAvatar" class="u-img">
				<view>
					<image :src="defaultAvatar" @error="imgError"></image>
				</view>
				<view class="fa-icon-style">
					<fa-icon type="angle-right" size="20" color="#c2beb7"></fa-icon>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="title"><text>企业编号</text></view>
			<view class="uni-form-item uni-column input"><input class="uni-input" disabled v-model="companyNo" /></view>
		</view>
		<view class="main">
			<view class="title"><text>用户名</text></view>
			<view class="uni-form-item uni-column input"><input class="uni-input" disabled type=" text" v-model="username" /></view>
		</view>
		<view class="main">
			<view class="title"><text>企业名称</text></view>
			<view class="uni-form-item uni-column input"><input class="uni-input" disabled v-model="companyName" /></view>
		</view>
	</view>
</template>

<script>
	import {
		uploadAvatar
	} from '@/api/userInfo.js';
	import {
		getUserInfo
	} from '@/api/auth.js';
	import baseUrl from '@/common/js/baseUrl.js';
	import init from '@/common/js/authInit.js';

	export default {
		onShow() {
			const info = uni.getStorageSync('extraUserInfo');
			const user = uni.getStorageSync('user');
			this.companyName = info.companyName;
			this.defaultAvatar = info.img;
			this.companyNo = user.oc;
			this.username = user.oa;
			this.usernamefull = user.username;
			this.userId = info.userId;
		},
		data() {
			return {
				defaultAvatar: '',
				companyNo: '',
				username: '',
				companyName: '',
				userId: '',
				usernamefull: ''
			};
		},
		watch: {
			defaultAvatar(n) {
				if (n === null || n === '') {
					this.defaultAvatar = '../../static/com/head.png';
				}
			}
		},
		methods: {
			uploadAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: async data => {
						const _token = await init.token();
						uni.showLoading({
							mask: true
						})
						uni.uploadFile({
							url: baseUrl() + '/file/upload',
							filePath: data.tempFiles[0].path,
							name: 'file',
							header: {
								Authorization: 'Bearer ' + _token.token,
								platform: 'mobile'
							},
							success: async res => {
								const r = JSON.parse(res.data);
								const path = r.data.path;
								const id = r.data.id;
								const code = r.code;
								if (code === 200) {
									try {
										await Promise.resolve(uploadAvatar({
											id: this.userId,
											fdfsId: r.data.id
										}));
										this.defaultAvatar = path;
										try {
											let _r = await Promise.resolve(getUserInfo({
												userName: this.usernamefull
											}));
											if (_r[1].data.code === 200) {
												const extraUserInfo = {
													companyName: _r[1].data.data.enterpriseName,
													userId: _r[1].data.data.id,
													img: _r[1].data.data.img
												};
												uni.setStorageSync('extraUserInfo', extraUserInfo);
												console.log(uni.getStorageSync('extraUserInfo'));
											}
										} catch (e) {
											console.log(e);
											uni.showToast({
												title: '请求用户信息失败',
												icon: 'none',
												duration: 2000
											});
										} finally {
											uni.hideLoading()
										}
									} catch (e) {
										uni.showToast({
											icon: 'none',
											title: '上传失败'
										});
									} finally {
										uni.hideLoading()
									}
								}
							},
							fail: res => {
								uni.showToast({
									icon: 'none',
									title: '上传失败'
								});
								uni.hideLoading()
							}
						});
					}
				});
			},
			imgError() {
				this.defaultAvatar = '../../static/com/head.png'
			},
			Back() {
				this.$com.pageBack();
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
		text-align: right;
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
