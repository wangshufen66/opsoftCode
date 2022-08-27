<script>
import Vue from 'vue';
import uniNavBar from 'components/uni-nav-bar/uni-nav-bar.vue';
import faIcon from 'components/fa-icon/fa-icon.vue';
import { getAuthority } from '@/api/userInfo.js';

export default {
	components: {
		faIcon,
		uniNavBar
	},
	async onLaunch() {
		uni.setStorageSync('appInfo', {
			refuseUpdate: false
		});
		uni.getSystemInfo({
			success: function(e) {
				Vue.prototype.statusBar = e.statusBarHeight;
				// #ifndef MP
				if (e.platform == 'android') {
					Vue.prototype.customBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.customBar = e.statusBarHeight + 45;
				}
				// #endif

				// #ifdef MP-WEIXIN
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.customBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif

				// #ifdef MP-ALIPAY
				Vue.prototype.customBar = e.statusBarHeight + e.titleBarHeight;
				// #endif

				Vue.prototype.scrollHeight = uni.getSystemInfoSync().screenHeight - Vue.prototype.customBar - 2;
			}
		});

		if (uni.getStorageSync('auth') === '') {
			uni.reLaunch({
				url: '/pages/login/login'
			});
		}
		// #ifdef APP-PLUS
		if (uni.getStorageSync('systemConfig')) {
			this.$store.commit('setSystemConfig', uni.getStorageSync('systemConfig'));
		}
		this.handlePush();
		// #endif
	},
	methods: {
		/**
		 * 处理推送消息
		 */
		handlePush() {
			// #ifdef APP-PLUS
			let url = '';
			const handleReceive = function(message) {
				url = message.content;
			};

			const handleClick = function(message) {
				// 获取自定义信息
				// let payload = message.payload;
				try {
					let timer = setTimeout(() => {
						// 携带自定义信息跳转应用页面
						uni.navigateTo({
							url: url + '&jump=1'
						});
						clearTimeout(timer);
					}, 500);
				} catch (e) {
					console.log(e, 'errMsg');
				}
			};

			// 事件处理
			plus.push.addEventListener('receive', handleReceive);
			plus.push.addEventListener('click', handleClick);
			// #endif
		}
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uview-ui/index.scss';
@import url('./common/css/uni.css');

page,
.page {
	height: 100%;
}

/* *****固定导航栏***** */
.uni-nav-bar-position {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
}

.d-position-bottom {
	position: absolute;
	bottom: 0;
}

.scroll-style {
	height: 100%;
}

/* *****固定导航栏*结束**** */

/* *****红色角标******* */
.position {
	position: relative;
}

.badge {
	position: absolute;
	top: 0px;
	right: -1px;
}

.badge-style {
	background-color: #dd524d;
	width: 6px;
	height: 6px;
	border-radius: 50%;
}

/* *****红色角标*结束****** */

/* Button */
.btnLogin {
	/* border-radius: 6px; */
	background-color: #007fe1;
	background-size: cover;
	color: #ffffff !important;
	font-weight: bold;
	margin-top: 10%;
}

.btnLogin[disabled] {
	/* border-radius: 6px; */
	background-color: #007fe1;
	background-size: cover;
	color: #ffffff !important;
	font-weight: bold;
	margin-top: 10%;
	filter: alpha(opacity=50);
	opacity: 0.5;
}
</style>
