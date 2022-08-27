<template>
	<view class="main">
		<view class="logintop"><view class="logo-img"></view></view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="faicon"><view class="fa-img build"></view></view>
				<u-input
					style="margin-left: 12rpx;"
					class="uni-input"
					type="number"
					placeholder="请输入企业编号"
					v-model="form.companyNo"
				/>
			</view>
			<view class="uni-form-item uni-column">
				<view class="faicon"><view class="fa-img user"></view></view>
				<u-input
					style="margin-left: 12rpx;"
					class="uni-input"
					placeholder="请输入登录账号"
					v-model="form.account"
				/>
			</view>
			<view class="uni-form-item uni-column">
				<view class="faicon" style="position: relative; left: 3px;"><view class="fa-img pass"></view></view>
				<u-input
					style="margin-left: 12rpx;"
					class="uni-input"
					placeholder="请输入密码"
					type="password"
					v-model="form.pwd"
				/>
			</view>
			<view style="display: flex;">
				<text style="color: red;margin:0 auto;">{{ form.errorMsg }}</text>
			</view>
		</view>
		<view class="login-config-wrapper">
			<view>
				<checkbox-group @change="handleClickLocalLogin">
					<label>
						<checkbox value="checked" :checked="isLocal" style="transform:scale(0.8); font-size: 16px;" />
						内网登录
					</label>
				</checkbox-group>
			</view>

			<view @click="handleClickNetworkConfig" style="transform:scale(0.8); position: relative; top: 2px;">
				<uni-icons
					style="color: #767676; line-height: 25px; font-size: 20px; position: relative; top: 2px;"
					type="gear"
				></uni-icons>
				<text style="line-height: 25px; font-size: 16px;margin-left: 4px;">网络设置</text>
			</view>
		</view>
		<view><button :loading="button.loading" class="btnLogin" @click="Login">登 录</button></view>
		<view class="uni-bot">
			<view><view class="img"></view></view>
			<view style="font-size: 10px;">版本号: {{ versionNo }}</view>
		</view>
	</view>
</template>
<style lang="scss" scoped>
.login-config-wrapper {
	width: 100%;
	height: 25px;
	position: relative;
	top: 18px;
	display: flex;
	justify-content: space-around;
	color: #767676;
}
</style>

<script>
import { getToken, getUserInfo, bindingCid } from '@/api/auth.js';
import moment from 'moment';
import { getCurrentVersion } from '@/config/version.js';
import { getCurrentAppStage } from '@/config/stage.js';
import baseUrl from '@/common/js/baseUrl.js';
import { appList } from '@/common/js/appListConfig.js';
export default {
	data() {
		return {
			isLocal: false,
			versionNo: '',
			disabled: true,
			form: {
				companyNo: '',
				account: '',
				pwd: '',
				errorMsg: ''
			},
			button: {
				loading: false,
				disabled: false,
				isLoading: false
			}
		};
	},
	onLoad: data => {
		// console.log(data);
	},
	onReady() {
		this.versionNo =
			process.env.NODE_ENV === 'development'
				? getCurrentVersion().dev.version.split('_')[0]
				: getCurrentAppStage() === 'dev'
				? getCurrentVersion().dev.version.split('_')[0]
				: getCurrentVersion().prod.version.split('_')[0];
		console.log(this.versionNo);
		uni.getStorage({
			key: 'user',
			success: data => {
				this.form.companyNo = data.data.oc;
				this.form.account = data.data.oa;
			}
		});
	},
	onShow() {
		if (uni.getStorageSync('isLocalUser')) {
			this.isLocal = true;
		} else {
			this.isLocal = false;
		}
	},
	methods: {
		handleClickLocalLogin(val) {
			val.detail.value.length > 0 ? (this.isLocal = true) : (this.isLocal = false);
			uni.setStorageSync('isLocalUser', this.isLocal);
		},
		handleClickNetworkConfig() {
			uni.navigateTo({
				url: '/pages/login/networkConfig'
			});
		},
		Login: async function(ev) {
			const companyNo = this.form.companyNo.trim();
			const account = this.form.account.trim();
			const pwd = this.form.pwd.trim();

			// 验证form内容是否合法
			if (companyNo == '' || account == '' || pwd == '') {
				uni.showToast({
					title: '输入项不得为空',
					icon: 'none',
					duration: 2000
				});
			} else if (
				this.isLocal &&
				(uni.getStorageSync('networkConfig') == '' ||
					uni.getStorageSync('networkConfig').ipAddr == '' ||
					uni.getStorageSync('networkConfig').port == '')
			) {
				uni.showToast({
					title: '内网用户需首先进行网络设置',
					icon: 'none',
					duration: 2000
				});
			} else {
				this.loginFunc(companyNo, account, pwd);
			}
		},
		async loginFunc(companyNo, account, pwd) {
			this.button.loading = true;
			if (this.button.isLoading === false) {
				const loginData = {
					username: `${account}$$${companyNo}`,
					password: pwd
				};
				this.button.isLoading = true;
				try {
					let response = await Promise.resolve(getToken(loginData));
					try {
						if (response[1].data.code === 200) {
							const auth = {
								token: response[1].data.data.token,
								expire: moment(response[1].data.data.expire_time).valueOf(),
								orgId: response[1].data.data.orgId
							};
							try {
								const s = {
									oa: account,
									oc: companyNo,
									...loginData
								};
								uni.setStorageSync('auth', auth);
								uni.setStorageSync('user', s);
								uni.removeStorageSync('frequentApp');
								uni.removeStorageSync('frequestAppList');
								uni.reLaunch({
									url: '/pages/tabbar/home',
									success: async () => {
										try {
											let r = await Promise.resolve(
												getUserInfo({
													userName: loginData.username
												})
											);
											if (r[1].data.code === 200) {
												const extraUserInfo = {
													companyName: r[1].data.data.enterpriseName,
													userId: r[1].data.data.id,
													img: r[1].data.data.img
												};
												//发送客户端id给服务器
												// #ifdef APP-PLUS
												const clientInfo = plus.push.getClientInfo();
												let pushUser = {
													id: r[1].data.data.id,
													cid: clientInfo.clientid
												};
												let res = await bindingCid(pushUser);
												if (res[1].data.code!==200){
													uni.showToast({
														title: '获取通知信息失败',
														icon: 'none',
														duration: 2000
													});
												}
												// #endif
												uni.setStorageSync('extraUserInfo', extraUserInfo);
											}
										} catch (e) {
											uni.showToast({
												title: '请求用户信息失败',
												icon: 'none',
												duration: 2000
											});
										}
									}
								});
							} catch (e) {
								uni.showToast({
									title: '写入缓存失败',
									icon: 'none',
									duration: 2000
								});
							}
						} else if (response[1].data.code === 401) {
							uni.showToast({
								title: response[1].data.msg || '用户名或密码错误',
								icon: 'none',
								duration: 2000
							});
						} else if (response[1].statusCode === 502) {
							uni.showToast({
								title: 'HTTP 502, 请联系系统管理员',
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: '未知错误',
								icon: 'none',
								duration: 2000
							});
						}
					} catch (e) {
						console.log(e);
						uni.showToast({
							title: this.isLocal
								? `请求服务器失败，请检查网络连接或网络设置`
								: `请求服务器失败，请检查网络连接`,
							icon: 'none',
							duration: 2000
						});
					}
				} catch (e) {
					console.log(e);
				} finally {
					this.button.loading = false;
					this.button.isLoading = false;
				}
			}
		},
	}
};
</script>

<style lang="scss" scoped>
@import url('@/common/css/login.css');

.btnLogin {
	width: 500rpx;
}
</style>
