<template>
	<view class="container">
		<view class="accurate-wrapper">
			<view style="margin-bottom: 4px;" class="top">
				<text class="accurate-title">{{ processData.deviceName }}</text>
				<view class="oprate" v-if="status == 1 && ongoingTask.length != 1">
					<button type="primary" size="mini" class="edit" :plain="true" @click="editTask">编辑</button>
					<button type="warn" size="mini" :plain="true" @click="delTask">删除</button>
				</view>
			</view>
			<view style="display: flex;width: 100%;">
				<view class="accurate-inner" style="width: 120rpx; text-align: right;">设备设备代码</view>
				<view class="accurate-input" style="max-width: 569rpx;">{{ processData.deviceNo }}</view>
			</view>
			<view style="display: flex; width: 100%;">
				<view class="accurate-inner" style="width: 120rpx; text-align: right;">加工日期</view>
				<view class="accurate-input" style="max-width: 569rpx;">{{ processData.processTime }}</view>
			</view>
			<view style="display: flex; width: 100%;">
				<view class="accurate-inner" style="width: 120rpx; text-align: right;">班次</view>
				<view class="accurate-input" style="max-width: 569rpx;">{{ processData.teamName }}</view>
			</view>
			<view style="display: flex; width: 100%;">
				<view class="accurate-inner" style="width: 120rpx; text-align: right;">人员</view>
				<view class="accurate-input" style="max-width: 569rpx;">{{ processData.personName }}</view>
			</view>
		</view>

		<view v-if="ongoingTask.length == 1" class="title-line">执行中的任务</view>
		<view v-if="ongoingTask.length == 1" class="line-wrapper">
			<progress-bar barHeight="3px"></progress-bar>
			<view class="card-wrapper-2">
				<view v-for="(item, index) in ongoingTask" :key="index" class="card-item">
					<view class="icon-wrapper"><image src="../../../static/deviceProcess/wlp.png" style="width: 44px;height: 44px;"></image></view>
					<view class="text-wrapper">
						<text class="text-title">{{ item.materialName }}</text>
						<view>
							<text>物料代码：</text>
							<text style="word-break: break-all;">{{ item.materialNumber }}</text>
						</view>
						<view>
							<text>工序名称：</text>
							<text style="word-break: break-all;">{{ item.processName }}</text>
						</view>
						<view>
							<text>任务单编号：</text>
							<text style="word-break: break-all;">{{ item.taskNo }}</text>
						</view>
						<view>
							<text>状态：</text>
							<text style="color: #72D1A3;" v-if="item.status == 0">未开工</text>
							<text style="color: #588EF9;" v-else-if="item.status == 1">执行中</text>
							<text style="color: #474747;" v-else-if="item.status == 2">已完工</text>
							<text v-else>-</text>
						</view>
					</view>
					<view class="arrow-wrapper">
						<u-button
							@click="handleClickFinishWork(item)"
							plain
							hover-class="success-btn-hover"
							:custom-style="{ backgroundColor: 'white !important' }"
							style="width: 90rpx; height: 60rpx;"
							type="primary"
						>
							完工
						</u-button>
					</view>
				</view>
			</view>
			<progress-bar barHeight="3px"></progress-bar>
		</view>

		<view class="title-line" style="display: flex; justify-content: space-between;">
			加工物料信息
			<u-icon @click="handleClickPlus" name="plus-circle" color="#2F7FE3" size="48"></u-icon>
		</view>
		<view class="line-wrapper">
			<view class="card-wrapper-2" style="padding-bottom: 24rpx;">
				<u-empty style="margin-top: 12vh;" v-if="dataList.length == 0 && loading == false" text="加工物料信息为空" mode="list"></u-empty>
				<uni-swipe-action>
					<uni-swipe-action-item
						:disabled="item.status !== 0"
						style="margin-bottom: 24rpx;"
						@change="handleSwipeChange(item)"
						v-for="(item, index) in dataList"
						:key="index"
						:options="swipeOpts"
						@click="handleClickSwipe"
					>
						<view class="card-item" style="height: 320rpx;">
							<view class="icon-wrapper">
								<image :src="item.status == 0 ? '../../../static/deviceProcess/wlg.png' : '../../../static/deviceProcess/wlo.png'" style="width: 44px;height: 44px;"></image>
							</view>
							<view class="text-wrapper">
								<text class="text-title">{{ item.materialName }}</text>
								<view>
									<text>物料代码：</text>
									<text style="word-break: break-all;">{{ item.materialNo }}</text>
								</view>
								<view>
									<text>工序名称：</text>
									<text style="word-break: break-all;">{{ item.processName }}</text>
								</view>
								<view>
									<text>任务单编号：</text>
									<text style="word-break: break-all;">{{ item.taskNo }}</text>
								</view>
								<view>
									<text>状态：</text>
									<text style="color: #72D1A3;" v-if="item.status == 0">未开工</text>
									<text style="color: #588EF9;" v-else-if="item.status == 1">执行中</text>
									<text style="color: #474747;" v-else-if="item.status == 2">已完工</text>
									<text v-else>-</text>
								</view>
								<view v-if="item.status == 2">
									<text>产量：</text>
									<text style="word-break: break-all;">{{ item.num }}</text>
								</view>
							</view>
							<view v-if="item.status == 0" class="arrow-wrapper">
								<u-button
									@click="handleClickStartWork(item)"
									plain
									hover-class="success-btn-hover"
									:custom-style="{ backgroundColor: 'white !important' }"
									style="width: 90rpx; height: 60rpx;"
									type="success"
								>
									开工
								</u-button>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>

		<!-- 开工弹出的模态框 -->
		<view class="model">
			<uni-popup ref="popup">
				<view class="finished">
					<view class="title">完工</view>
					<view class="center">
						产量：
						<input value="" type="number" focus="true" v-model="finishedNo" placeholder="请输入" />
					</view>
					<view class="bottom">
						<button type="primary" size="mini" plain="true" class="cancle" @click="cancle">取消</button>
						<button type="primary" size="mini" @click="sure">确定</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import { getTaskDetail, startWork, finishWork, batchDel, delDeviceTask, editDeviceTask } from '@/api/deviceProcess.js';
import progressBar from '@/components/progressBar/index.vue';
export default {
	components: { progressBar },
	data() {
		return {
			processData: {},
			dataList: [],
			ongoingTask: [],
			swipeOpts: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			swipeData: {
				trigger: ''
			},
			loading: false,
			id: null, // 当前加工任务id
			status: 1, // 是否显示操作按钮
			finishedNo: '', // 完工数量
			finishedInfo: {} // 完工信息
		};
	},
	onShow() {
		this.dataList = [];
		this.ongoingTask = [];
		this.processData = this.$store.state.deviceProcess.data;
		this.getDetailData();
	},
	onReady() {},
	onLoad(options) {
		// console.log(options)
		this.id = options.id;
		if (options.status) {
			this.status = options.status;
		}
		this.$globalEvent.on('material-select', this.onMaterialSelect);
	},
	methods: {
		onMaterialSelect() {
			this.getDetailData();
		},
		// 编辑任务
		editTask() {
			uni.navigateTo({
				url: `./newdevice?id=${this.id}`
			});
		},

		// 删除任务
		delTask() {
			let _this = this;
			uni.showModal({
				title: '温馨提示',
				content: '确定要删除吗?',
				success: async function(res) {
					if (res.confirm) {
						let param = [];
						param.push(_this.processData);
						try {
							let res = await Promise.resolve(delDeviceTask(param));
							console.log(res);
							if (res[1].data.code == 200) {
								uni.showToast({
									title: res[1].data.msg
								});
								uni.redirectTo({
									url: `/pages/application/deviceProcess/index`
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: res[1].data.msg || '操作失败'
								});
							}
						} catch (e) {
							console.log(e);
						}
					}
				}
			});
		},

		handleClickPlus() {
			uni.navigateTo({
				url: `/pages/application/deviceProcess/material?id=${this.id}`
			});
		},

		// 开工
		async handleClickStartWork(val) {
			// console.log(val)
			if (this.ongoingTask.length >= 1) {
				uni.showToast({
					icon: 'none',
					title: '当前已有执行中任务'
				});
				return;
			}
			try {
				let res = await Promise.resolve(startWork(val));
				if (res[1].data.code == 200) {
					uni.showToast({
						title: res[1].data.msg
					});
					this.getDetailData();
				} else {
					uni.showToast({
						icon: 'none',
						title: res[1].data.msg || '操作失败'
					});
				}
			} catch (e) {
				console.log(e);
			}
		},

		// 完工
		async handleClickFinishWork(val) {
			this.$refs.popup.open();
			this.finishedInfo = val;
		},
		// 取消完工
		cancle() {
			this.$refs.popup.close();
		},
		// 确认完工
		async sure() {
			if (this.finishedNo.trim().length <= 0) {
				uni.showToast({
					title: '产量不能为空',
					icon: 'none'
				});
				return;
			}
			if (this.finishedNo < 0) {
				uni.showToast({
					title: '产量不能负数',
					icon: 'none'
				});
				return;
			}

			this.finishedInfo.num = this.finishedNo;
			console.log(this.finishedInfo);
			try {
				let res = await Promise.resolve(finishWork(this.finishedInfo));
				if (res[1].data.code == 200) {
					uni.showToast({
						title: res[1].data.msg
					});
					this.getDetailData();
					this.$refs.popup.close();
				} else {
					uni.showToast({
						icon: 'none',
						title: res[1].data.msg
					});
				}
			} catch (e) {
				console.log(e);
			}
		},

		//  滑动删除物料
		handleSwipeChange(data) {
			// console.log(data)
			this.swipeData.trigger = data;
		},
		handleClickSwipe(data) {
			console.log(this.swipeData.trigger);
			this.clickSwipe(data, this.swipeData.trigger);
		},
		async clickSwipe(data, trigger) {
				console.log(trigger)
			if (data.index == 0) {
				try {
					let res = await Promise.resolve(batchDel([trigger]));
					if (res[1].data.code == 200) {
						uni.showToast({
							title: res[1].data.msg
						});
						this.getDetailData();
					} else {
						uni.showToast({
							icon: 'none',
							title: res[1].data.msg || '操作失败'
						});
					}
				} catch (e) {
					console.log(e);
				}
			}
		},
		async getDetailData() {
			this.dataList = [];
			this.ongoingTask = [];
			try {
				this.loading = true;
				let res = await Promise.resolve(getTaskDetail({}, this.id));
				if (res[1].data.code != 200) return;
				this.processData = res[1].data.data;
				this.loading = false;
				if (res[1].data.data.taskList.length <= 0) return;
				// 未开工
				const status0 = res[1].data.data.taskList.filter(i => i.status == 0);
				// 进行中
				const status1 = res[1].data.data.taskList.filter(i => i.status == 1);
				// 已完成
				const status2 = res[1].data.data.taskList.filter(i => i.status == 2);
				this.dataList = [...status0, ...status2];
				if (status2.length > 0) this.status = 0;
				this.ongoingTask = [...status1];
			} catch (e) {
				console.log(e);
			}
		}
	}
};
</script>

<style>
page {
	background-color: #f5f5f5;
}

.success-btn-hover {
	background-color: #72d1b8 !important;
}
</style>
<style lang="scss" scoped>
@import './style.scss';

.title-line {
	font-size: 32rpx;
	font-family: PingFangSC, PingFangSC-Medium;
	font-weight: 700;
	color: #181818;
	height: 100rpx;
	line-height: 100rpx;
	padding: 0 36rpx;
}

.line-wrapper {
	padding: 0 36rpx;
}

.accurate-wrapper {
	width: 100%;
	background-color: white;
	padding-left: 36rpx;
	padding-bottom: 2%;
	padding-top: 36rpx;
	padding-right: 20rpx;

	.accurate-title {
		font-size: 16px;
		font-weight: 700;
		color: #454545;
	}

	.accurate-inner {
		font-size: 14px;
		font-weight: 400;
		color: #2c2c2c;
		text-align: right;
	}

	.accurate-input {
		margin-left: 24rpx;
		font-size: 14px;
		font-weight: 400;
		color: #7d7d7d;
	}
}
.top {
	display: flex;
	justify-content: space-between;
	.edit {
		margin-right: 10rpx;
	}
}

.finished {
	width: 700rpx;
	height: 30vh;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	.title {
		font-size: 40rpx;
		font-weight: 900;
	}
	.center {
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		height: 15vh;
		font-size: 30rpx;
		color: #666;
		input {
			flex: 1;
			border: 1px solid #ccc;
			padding: 10rpx 15rpx;
			border-radius: 10rpx;
		}
	}
	.bottom {
		float: right;
		.cancle {
			margin-right: 50rpx;
		}
	}
}
</style>
