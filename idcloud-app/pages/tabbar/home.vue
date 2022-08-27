<template>
	<view class="page">
		<view :style="{ height: 'var(--status-bar-height)', backgroundColor: '#fff' }"></view>
		<uni-nav-bar id="nav-bar" @clickRight="clickRight">
			<view slot="left"><image :src="icon" mode="aspectFit" style="width: 80px;height: 40px;margin-left: 30px; position: relative; right: 18px;" /></view>
			<view slot="right" class="position">
				<fa-icon size="19" type="bell-o"></fa-icon>
				<view v-show="showBadge" class="badge"><view class="badge-style"></view></view>
			</view>
		</uni-nav-bar>
		<!-- 轮播图 -->
		<view class="rotation">
			<swiper class="swiper" indicator-dots autoplay="true">
				<swiper-item v-for="(item, index) in swipeList" :key="index">
					<view class="swiper-item"><image :src="item.img" mode="scaleToFill" /></view>
				</swiper-item>
			</swiper>
		</view>
		<scroll-view scroll-y :style="{ height: scrollHeight - 194 + 'px' }">
			<!-- <scroll-view scroll-y :style="{ height: h + 'px' }" style="background-color: #007AFF;"> -->
			<!-- 设备应用 -->
			<view class="main">
				<view class="m-title"><text class="title" decode="true">&nbsp;常用应用</text></view>
				<view class="example-body">
					<uni-grid :column="4" :show-border="false" :square="false">
						<uni-grid-item v-for="(subitem, subindex) in device" :key="subindex">
							<view v-if="subitem.display" class="grid-item-box" @click="pageNavigate(subitem.url)">
								<image class="image" :src="subitem.iconUrl" />
								<text class="text">{{ subitem.text }}</text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
			<!-- 常用应用 -->
			<view>
				<!-- 				<view class="m-title">
					<text class="title" decode="true">常用应用</text>
				</view> -->
				<view class="example-body">
					<uni-grid :column="4" :show-border="false" :square="false">
						<uni-grid-item v-for="(subitem, subindex) in commonList" :key="subindex">
							<view v-if="subitem.display" class="grid-item-box" @click="pageNavigate(subitem.router, subitem.name)">
								<image class="image" :src="subitem.img" />
								<text class="text">{{ subitem.name.substr(0, 8) }}</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box" @click="pageNavigate('../home/manageapply')">
								<image class="image" src="../../static/com/editor.png" />
								<text class="text">应用设置</text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
import init from '../../common/js/authInit.js';
import { checkAppVersion } from '@/common/js/checkVersion.js';
import { getPics, getLogs,getAllNotice } from '@/api/home.js';

let deviceList = [
	// {
	// 	key: 'mobile_device_monitor',
	// 	iconUrl: "../../static/device/monitor.png",
	// 	text: "设备监测",
	// 	url: "../home/monitor",
	// 	display: false
	// },
	// {
	// 	key: 'mobile_env_monitor',
	// 	iconUrl: "../../static/moduleIcons/envMonitor.png",
	// 	text: "环境监测",
	// 	url: "../home/envMonitor",
	// 	display: false
	// },
	// {
	// 	key: 'mobile_device_map',
	// 	iconUrl: "../../static/device/map.png",
	// 	text: "设备地图",
	// 	url: "../home/map-archive",
	// 	display: false
	// },
	// {
	// 	key: 'mobile_error_log',
	// 	iconUrl: "../../static/device/err.png",
	// 	text: "报警日志",
	// 	url: "../home/errmsg",
	// 	display: false
	// }
];
import { appList } from '../../common/js/appListConfig.js';
import { getAuthority } from '@/api/userInfo.js';
export default {
	components: {
		uniGrid,
		uniGridItem
	},
	async onLoad() {
		let retry = 5;

		let rt = this.getAuth();
		while (rt == -1 && retry > 0) {
			retry--;
			rt = this.getAuth();
			if (retry == 0) {
				uni.showToast({
					icon: 'none',
					title: '获取权限失败'
				});
			}
		}
		// this.checkLogs();
	},
	watch: {
		'$store.state.auth.data': {
			handler(n) {
				// if (n.length > 0) {
				// 	const list = n.filter(i => ['mobile_device_monitor', 'mobile_env_monitor', 'mobile_device_map', 'mobile_error_log'].includes(i.name))
				// 	list.forEach(i => {
				// 		this.device.forEach(k => {
				// 			if (k.key == i.name) {
				// 				k.display = true
				// 			}
				// 		})
				// 	})
				// 	this.device = this.device.filter(i => i.display)
				// }
				
				//frequestAppList判断
				// let l = uni.getStorageSync('frequestAppList');
				// if (l) {
				// 	l.forEach(i => {
				// 		i.children.forEach(k => {
				// 			delete k.isCommon;
				// 		});
				// 	});
				// 	const list = JSON.stringify(l);
				// 	const storageList = JSON.stringify(appList);
				// 	if (list !== storageList) {
				// 		// uni.removeStorageSync('frequestAppList')
				// 	}
				// }else{
				// }
				// let list = uni.getStorageSync('frequentApp');
				// if (list === '') {
				// 	list = [];
				// }
				// this.commonList = list.filter(i => {
				// 	return i.isCommon === true;
				// });
			},
			immediate: true
		}
	},
	onReady() {
		this.getSwipePics();
		this.getIcon();

		uni.preloadPage({
			url: '/pages/home/manageapply'
		});
		uni.preloadPage({
			url: '/pages/tabbar/apply'
		});
		uni.preloadPage({
			url: '/pages/tabbar/my'
		});
	},
	async onShow() {
		this.checkPics();
		this.checkIcon();
		this.checkLogs();

		let list = uni.getStorageSync('frequentApp');
		//如果storage中没有frequentApp,说明是刚刚登录
		if (list === '') {
			let arr=[]
			
			for (let i=0,len=appList.length;i<len;i++){
				arr.push(...appList[i].children)
			}
			
			this.commonList=arr.filter(i => {
				return i.isCommon === true;
			});
		}else{
			this.commonList = list.filter(i => {
				return i.isCommon === true;
			});
		}

		

		// #ifdef APP-PLUS
		const isLocalUser = uni.getStorageSync('isLocalUser');
		// if (!isLocalUser) {
		const r = await checkAppVersion();
		const newVersionMsg = `\n更新信息:\n${r.msgArr?r.msgArr.join('\n'):''}\n`;
		if (r.code > 0 && uni.getStorageSync('appInfo').refuseUpdate !== true) {
			uni.showModal({
				title: '发现新版本',
				content: `当前版本: ${r.version}\n新版本: ${r.serverVersion}\n${newVersionMsg}\n是否需要更新应用?`,
				success: ev => {
					if (ev.confirm === true) {
						uni.navigateTo({
							url: '/pages/my/aboutUs'
						});
					}
					if (ev.cancel === true) {
						uni.setStorageSync('appInfo', {
							refuseUpdate: true
						});
					}
				},
				fail: e => {
					console.log(e);
				}
			});
			// }
		}
		// #endif
	},
	data() {
		return {
			logList: [],
			swipeList: [],
			icon: '',
			iconShow: '../../static/demo.png',
			device: deviceList,
			showBadge: false,
			commonList: [],
			h: ''
		};
	},
	methods: {
		async getAuth() {
			try {
				let res = await Promise.resolve(getAuthority({}));
				if (res[1].data.code == 200) {
					let hasAuth = false;
					res[1].data.data.router.forEach(i => {
						if (i.name == 'mobile_app') {
							hasAuth = true;
							if (JSON.stringify(i.children) !== uni.getStorageSync('moduleAuthority')) {
								uni.removeStorageSync('frequentApp');
								uni.removeStorageSync('frequestAppList');
							}

							uni.setStorageSync('moduleAuthority', JSON.stringify(i.children));
							this.$store.commit('setAuthority', i.children);
						}
					});
					if (!hasAuth) {
						uni.removeStorageSync('frequentApp');
						uni.removeStorageSync('frequestAppList');
						uni.setStorageSync('moduleAuthority', JSON.stringify([]));
						this.$store.commit('setAuthority', []);
					}
					return 0;
				} else {
					return -1;
				}
			} catch (e) {
				console.log(e);
				return -1;
			}
		},
		async checkLogs() {
			const param = {
				orgId: uni.getStorageSync('auth').orgId,
				userId: uni.getStorageSync('extraUserInfo').userId
			};
			try {
				let res = await getAllNotice(param);
				if (res[1].data.code === 200) {
					//去除日常任务提醒
					let list=res[1].data.data.filter(item=>item.type!==0)
					//是否每条消息都已经阅读
					this.showBadge=!(list.every(item=>item.isRead===1))
				}else{
					uni.showToast({
						title: '获取消息通知列表失败',
						icon: 'none'
					});
				}
			} catch (e) {
				console.log(e);
			}
		},
		async checkPics() {
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					type: 2
				};
				let list = [];
				try {
					let res = await Promise.resolve(getPics(param));
					// console.log(res);

					list = res[1].data.data?res[1].data.data:[];
				} catch (e) {}
				let change = false;
				if (this.swipeList.length !== list.length) {
					change = true;
				} else {
					this.swipeList.forEach((item, index) => {
						if (item.img !== list[index].img) {
							change = true;
						}
					});
				}
				if (change === true) {
					this.swipeList = list;
					if (this.swipeList.length === 0) {
						this.swipeList = [
							{
								img: '../../static/swiper/swiper01.png'
							}
						];
					}
				}
			} catch (e) {
				console.log(e);
			}
		},
		async checkIcon() {
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					type: 0
				};
				let list = [];
				try {
					let res = await Promise.resolve(getPics(param));
					// console.log(JSON.stringify(res));

					list = res[1].data.data?res[1].data.data:[];
				} catch (e) {}

				let change = false;
				if (list.length === 0) {
					return;
				} else {
					if (this.icon !== list[0].img) {
						change = true;
					}
				}
				if (change === true) {
					this.icon = list[0].img;
				}
			} catch (e) {
				console.log(e);
			}
		},
		async getSwipePics() {
			this.swipeList = [];
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					type: 2
				};
				try {
					let res = await Promise.resolve(getPics(param));
					// console.log(res);

					this.swipeList = res[1].data.data;
				} catch (e) {}

				if (this.swipeList.length === 0) {
					this.swipeList = [
						{
							img: '../../static/swiper/swiper01.png'
						}
					];
				}
			} catch (e) {}
		},
		async getIcon() {
			this.icon = '';
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					type: 0
				};
				let list = [];
				try {
					let res = await Promise.resolve(getPics(param));
					// console.log(res);

					list = res[1].data.data;
				} catch (e) {}

				if (list.length === 0) {
					this.icon = '../../static/demo.png';
					return 'null';
				}
				this.icon = list[0].img;
				if (this.icon === '') {
					this.icon = '../../static/demo.png';
				}
			} catch (e) {}
		},
		pageNavigate(url, name) {
			getApp().globalData.moduleName = name;
			uni.navigateTo({
				url: url,
				animationType: 'zoom-fade-out',
				animationDuration: 200
			});
		},
		clickRight() {
			uni.navigateTo({
				url: '../home/notice',
			});
		}
	}
};
</script>

<style>
@import url('@/common/css/icon.css');

header-bar {
	display: flex;
	flex-direction: row;
}

.rotation {
	/* height: 468.75rpx; */
	height: 150px;
	width: 100%;
}

.swiper,
.swiper-item {
	width: 100%;
	height: 100%;
}

.swiper-item image {
	height: 100%;
	width: 100%;
}

.main {
	margin-top: 10px;
}
</style>
