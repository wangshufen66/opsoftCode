<template>
	<view class="page">
		<view class="p-top">
			<view class="p-top-header position">
				<view class="position"></view>
			</view>
			<view class="p-top-content">
				<view>
					<image :src="avatar" @error="useDefaultImg" class="avatar-style"></image>
				</view>
				<view>
					<view class="text1">{{ username }}</view>
					<image class="small-img" src="../../static/com/edit.png" @click="pageNavigate('../my/myinfo')"></image>
				</view>
				<view>
					<view class="text2">{{ companyName }}</view>
				</view>
			</view>
		</view>
		<view class="list-wrapper">
			<view @click="handleSwitchOrg" class="list-item">
				<view style="display: flex;">
					<view class="column-center">
						<image class="inner-image" :src="pic.switchOrg"></image>
					</view>
					<view class="column-center"><text>切换组织</text></view>
				</view>
				<view class="column-center right15">
					<fa-icon size="20" type="angle-right" color=""></fa-icon>
				</view>
			</view>

			<view @click="handleAboutUs" class="list-item">
				<view style="display: flex;">
					<view class="column-center">
						<image class="inner-image" :src="pic.aboudus"></image>
					</view>
					<view class="column-center"><text>关于我们</text></view>
				</view>
				<view class="column-center right15">
					<fa-icon size="20" type="angle-right" color=""></fa-icon>
				</view>
			</view>

			<!-- #ifdef APP-PLUS -->
			<view @click="handleSysConfig" class="list-item">
				<view style="display: flex;">
					<view class="column-center">
						<image class="inner-image" :src="pic.config"></image>
					</view>
					<view class="column-center"><text>系统设置</text></view>
				</view>
				<view class="column-center right15">
					<fa-icon size="20" type="angle-right" color=""></fa-icon>
				</view>
			</view>
			<!-- #endif -->


			<view @click="handleExit" class="list-item">
				<view style="display: flex;">
					<view class="column-center">
						<image class="inner-image" :src="pic.exit"></image>
					</view>
					<view class="column-center"><text>退出登录</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserInfo
	} from '@/api/auth.js';
	export default {
		data() {
			return {
				showBadge: true,
				avatar: '',
				username: '-',
				companyName: '-',
				pic: {
					switchOrg: '',
					exit: '',
					aboudus: '',
					config: ''
				}
			};
		},
		async onShow() {
			this.pic.switchOrg = '../../static/my/switchorg.png';
			this.pic.exit = '../../static/my/exit.png';
			this.pic.aboudus = '../../static/my/aboudus.png';
			this.pic.config = '../../static/my/config.png'
			const info = uni.getStorageSync('extraUserInfo');
			const user = uni.getStorageSync('user');
			this.companyName = info.companyName;
			this.avatar = info.img;
			this.username = user.oa;
			if (info.img === '' || info.img === null) {
				this.avatar = '../../static/com/head.png';
			} else {
				this.avatar = info.img;
			}

			await this.checkAvatar()


		},
		methods: {
			useDefaultImg() {
				this.avatar = '../../static/com/head.png';
			},
			pageNavigate(url) {
				uni.navigateTo({
					url: url
				});
			},
			async checkAvatar() {
				try {
					let r = await Promise.resolve(getUserInfo({
						userName: uni.getStorageSync('user').username
					}));
					if (r[1].data.code === 200) {
						const imgUpdated = r[1].data.data.img
						const imgNow = uni.getStorageSync('extraUserInfo').img
						if (imgNow !== imgUpdated) {
							const extraUserInfo = {
								companyName: r[1].data.data.enterpriseName,
								userId: r[1].data.data.id,
								img: r[1].data.data.img
							};
							uni.setStorageSync('extraUserInfo', extraUserInfo);
						}
					}
				} catch (e) {
					console.log(e);
				}
			},
			handleAboutUs() {
				uni.navigateTo({
					url: '/pages/my/aboutUs'
				});
			},
			handleSysConfig() {
				uni.navigateTo({
					url: '/pages/my/systemConfig'
				});
			},
			handleExit() {
				uni.showModal({
					title: '确认操作',
					content: '确认退出登录吗？',
					confirmText: '确认',
					success: data => {
						if (data.confirm === true) {
							uni.removeStorageSync('auth');
							uni.reLaunch({
								url: '/pages/login/login'
							});
						}
					}
				});
			},
			handleSwitchOrg() {
				const userId = uni.getStorageSync('extraUserInfo').userId;
				uni.navigateTo({
					url: '/pages/my/switchOrg?id=' + userId
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		width: 100%;
		display: flex;
		flex-direction: column;
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

	.p-top {
		/* position: fixed; */
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 32%;
		background-image: url('data:image/png;base64,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');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.p-top-header {
		padding-top: 45upx;
		padding-right: 50upx;
		height: 10%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.p-top-content {
		display: flex;
		flex-direction: column;
		height: 90%;
	}

	.p-top-content view {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
	}

	/* 头像 */
	.avatar-style {
		height: 140upx;
		width: 140upx;
		border-radius: 50%;
		border: 1upx solid #ffffff;
	}

	/* 姓名 */
	.small-img {
		height: 30upx;
		width: 30upx;
		margin-left: 10px;
	}

	.text1 {
		font-size: 16px;
	}

	.text2 {
		font-size: 10px;
	}
</style>
