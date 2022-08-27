<template>
	<view>
		<scroll-view scroll-y class="d-position-bottom" :style="{ height: this.scrollHeight + 'px' }">
			<view class="d-main" v-for="(item, index) in deviceList" :key="index">
				<view class="d-top">
					<view class="d-top-left">
						<image src="../../static/device/group.png" style="height: 40upx; width: 40upx;" mode="aspectFit"></image>
						<!-- <fa-icon size="20" type="shirtsinbulk"></fa-icon> -->
						<view style="padding-left: 5px;">{{ item.name }}</view>
					</view>
					<!-- <view class="d-top-right" v-if="!item.isOpenAll"> -->
					<view class="d-top-right" v-if="false">
						<view></view>
						<view class="example-body">
							<uni-combox fontSize="11" style="width:50px ;height: 22px;  border: 1px solid #007fe1; border-radius:20px;padding-left:10px;color: #007fe1;"
							 :candidates="candidates" emptyTips="全选" @input="ComboxChange($event, index)"></uni-combox>
						</view>
					</view>
					<!-- <view class="d-top-right" v-if="item.isOpenAll"> -->
					<view class="d-top-right" v-if="true">
						<view class="select-all">全选</view>
						<view @click="isCheckAll(index, item)">
							<switch :checked="item.allCheckV" disabled type="switch" color="#007fe1" style="transform:scale(0.6)"></switch>
						</view>
					</view>
				</view>
				<view class="d-content">
					<view class="d-content-right" v-for="(deviceItem, index1) in item.list" :key="index1">
						<view>{{ deviceItem.name }}</view>
						<switch :checked="deviceItem.isOpen" type="switch" color="#007fe1" style="transform:scale(0.55)" @change="switchChange($event, index, index1)"></switch>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import faIcon from '../../components/fa-icon/fa-icon.vue';
	import uniCombox from '@/components/uni-combox/uni-combox.vue';
	import {
		getDeviceList,
		changeControl
	} from '@/api/deviceControl.js'
	export default {
		components: {
			faIcon,
			uniCombox
		},
		data() {
			return {
				showBadge: true,
				deviceList: [],
				candidates: ['ON', 'OFF']
			};
		},
		onReady() {
			this.initListData()
		},
		methods: {
			async initListData() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId
					};
					let res = await this.getListData(param);
					this.deviceList = res[1].data.data;
				} catch (e) {
					console.log(e);
				}
			},
			async getListData(param) {
				try {
					uni.showLoading({
						mask: true
					})
					uni.showLoading({
						mask: true
					})
					let res = await Promise.resolve(getDeviceList(param));
					uni.hideLoading()
					let returnList = res;
					if (res[1].data.code === 200) {
						returnList[1].data.data.forEach(i => {
							i.allCheck = i.allCheck + "";
							i.isOpenAll = false
							if (i.allCheck == '1') {
								i.allCheckV = true
							} else {
								i.allCheckV = false
							}
							if (i.list !== null) {
								i.list.forEach(k => {
									if (k.value == null) {
										k.value = '0';
									}
									if (k.value == '1') {
										k.isOpen = true
									} else {
										k.isOpen = false
									}
								});
							} else {
								i.list = []
							}
						});
						return returnList;
					}
				} catch (e) {
					console.log(e);
				} finally {
					uni.hideLoading()
				}
			},
			clickRight() {
				uni.navigateTo({
					url: 'notice'
				});
			},
			ComboxChange(e, index) {
				switch (e) {
					case 'ON':
						this.deviceList[index].isOpenAll = true;
						break;
					case 'OFF':
						this.deviceList[index].isOpenAll = false;
						break;
				}
			},
			async switchChange(e, index, index1) {
				let openType = e.target.value;
				let mainList = this.deviceList[index];
				let changeItem = mainList.list[index1]
				mainList.list[index1].isOpen = openType;
				//判断是否全选中
				let count = 0;
				mainList.list.forEach((item, index) => {
					if (item.isOpen == true) {
						count++;
					}
				});
				let parent = JSON.parse(JSON.stringify(mainList))
				e.target.value === true ? changeItem.value = '1' : changeItem.value = '0'
					// parent.list = [changeItem]
				if (mainList.list.length == count) {
					mainList.allCheck = true;
				} else {
					mainList.allCheck = false;
				}
				let res = await Promise.resolve(changeControl(mainList))
				await this.initListData()
				if (res[1].data.code === 200) {
					uni.showToast({
						title: res[1].data.msg,
						icon: "success",
						duration: 2000,

					})
				} else {
					uni.showToast({
						title: '控制失败',
						icon: "none",
						duration: 2000
					});
				}

			},
			// 全选/
			isCheckAll(index, d) {
				if (d.list !== null) {
					if (d.list.length > 0) {
						let data = this.deviceList[index];
						var isAll = !Boolean(data.allCheckV);
						let title = '关闭';
						if (isAll) {
							title = '打开';
						}
						if (index >= 0) {
							uni.showModal({
								title: '提示',
								content: '确认要' + title + '该设备的所有开关?',
								showCancel: true,
								cancelText: '取消',
								confirmText: '确定',
								confirmColor: '#007FE1',
								success: async res => {
									if (res.confirm) {
										data.allCheck = isAll;
										data.list.forEach((item, index) => {
											item.isOpen = isAll;
										});
										console.log(isAll);
										d.list.forEach(i => {
											if (isAll) {
												i.value = '1'
											} else {
												i.value = 0
											}
										})
										let r = await Promise.resolve(changeControl(d))
										await this.initListData()
										if (r[1].data.code === 200) {
											uni.showToast({
												title: r[1].data.msg,
												icon: "success",
												duration: 2000,

											})
										} else {
											r.showToast({
												title: '控制失败',
												icon: "none",
												duration: 2000
											});
										}
									} else {
										let isChceked = isAll ? false : true;
										this.$nextTick(function() {
											this.deviceList[index].allCheck = isChceked;
											this.$forceUpdate();
										});
									}
								},
								fail: () => {},
								complete: () => {}
							});
						}
					} else {
						uni.showToast({
							title: '没有控制点',
							icon: 'none'
						})
					}
				} else {
					uni.showToast({
						title: '没有控制点',
						icon: 'none'
					})
				}

			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #ffffff;
	}

	.d-main {
		display: flex;
		flex-direction: column;
		border-bottom: 1upx solid #cccccc;
		padding: 15upx 0;
	}

	.d-main view {
		display: flex;
	}

	.d-position-bottom {
		z-index: 2;
		background-color: white;
	}

	.d-top {
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.d-top view {
		display: flex;
		flex: 1;
	}

	.select-all {
		position: relative;
		left: 20%;
	}

	.d-top-left {
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding-left: 10px;
	}

	.d-top-left view {
		display: flex;
	}

	.d-top-left view:nth-of-type(1) {
		flex: 1;
	}

	.d-top-left view:nth-of-type(2) {
		flex: 5;
	}

	.d-top-right {
		justify-content: flex-end;
		align-items: center;
		width: 50%;
	}

	.d-top-right view {
		display: flex;
		justify-content: flex-end;
	}

	/* ************** */
	.d-content {
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.d-content view {
		display: flex;
		width: 50%;
	}

	.d-content-right {
		justify-content: flex-end;
		align-items: center;
	}

	.d-content-right view {
		display: flex;
		justify-content: flex-end;
	}

	/* ************** */
	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0 10px;
		font-size: 12px;
		background-color: #ffffff;
	}
</style>
