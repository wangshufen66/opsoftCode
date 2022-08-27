<template>
	<view class="new_device">
		<view class="device_msg">
			<view class="item">
				<view class="label">加工日期：</view>
				<input type="text" v-model="processTime" @click="ShowTime" value="" placeholder="请选择" :disabled="true" />
				<view class="arrow" @click="ShowTime">></view>
			</view>
			<view class="item">
				<view class="label">班次：</view>
				<input type="text" v-model="shift.name" @click="ChoseShift" value="" placeholder="请选择" :disabled="true" />
				<view class="arrow" @click="ChoseShift">></view>
			</view>
			<view class="item">
				<view class="label">人员：</view>
				<input type="text" v-model="staff.name" @click="ChoseStaff" value="" placeholder="请选择" :disabled="true" />
				<view class="arrow" @click="ChoseStaff">></view>
			</view>
			<view class="item">
				<view class="label">设备：</view>
				<input type="text" v-model="device.name" @click="ChoseDevice" value="" placeholder="请选择" :disabled="true" />
				<view class="arrow" @click="ChoseDevice">></view>
			</view>
		</view>
		<view class="sub_button"><button type="primary" size="mini" :plain="true" @click="submitNewProduction">提交</button></view>

		<!-- 日历弹框 -->
		<uni-calendar ref="calendar" :insert="false" :start-date="startDate" @confirm="confirm"></uni-calendar>
	</view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
import moment from 'moment';
import { addDeviceTask, getTaskDetail, editDeviceTask } from '@/api/deviceProcess.js';
export default {
	data() {
		return {
			processTime: '', // 加工日期
			startDate: null,
			shift: {
				// 班次
				name: '',
				id: ''
			},
			staff: {
				// 人员
				name: '',
				id: ''
			},
			device: {
				name: '', // 设备
				id: '',
				no: ''
			},
			id: null // 编辑任务id
		};
	},
	onShow() {
		// console.log(this.shift,this.staff,this.device)
	},
	mounted() {
		this.startDate = toString(new Date());
	},
	onLoad(options) {
		if (options.id) {
			this.id = options.id;
			this.showData();
		}
		this.$globalEvent.on('newdevice-select', this.onNewdeviceSelect);
	},
	onUnload() {
		this.$globalEvent.off('newdevice-select', this.onNewdeviceSelect);
	},
	methods: {
		onNewdeviceSelect(obj) {
			const { type, json } = obj;
			switch (type) {
				case 'shift':
					this.shift = json;
					break;
				case 'staff':
					this.staff = json;
					break;
				case 'device':
					this.device = json;
					break;
			}
		},
		// 弹出日历
		ShowTime() {
			this.$refs.calendar.open();
		},
		// 选择日期
		confirm(time) {
			// console.log(time)
			this.processTime = time.fulldate;
		},

		// 班次
		ChoseShift() {
			uni.navigateTo({
				url: './shift'
			});
		},

		// 人员
		ChoseStaff() {
			uni.navigateTo({
				url: './staff'
			});
		},

		// 数据回显
		async showData() {
			this.dataList = [];
			this.ongoingTask = [];
			try {
				uni.showLoading();
				let res = await Promise.resolve(getTaskDetail({}, this.id));
				uni.hideLoading();
				if (res[1].data.code != 200) return;
				let data = res[1].data.data;
				// console.log(res)
				this.processTime = data.processTime;
				this.shift.name = data.teamName;
				this.staff.name = data.personName;
				this.device.name = data.deviceName;
				this.device.no = data.deviceNo;
			} catch (e) {
				uni.hideLoading();
				console.log(e);
			}
		},

		// 设备
		ChoseDevice() {
			uni.navigateTo({
				url: './device'
			});
		},

		// 提交
		async submitNewProduction() {
			console.log(this.processTime, this.shift.id, this.staff.id, this.device.id);
			if (this.processTime.length <= 0 || this.shift.name.trim().length <= 0 || this.staff.name.trim().length <= 0 || this.device.name.trim().length <= 0) {
				uni.showToast({
					title: '加工日期/班次/人员/设备不能为空',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (this.id) {
				// 编辑
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					id: this.id,
					process_time: this.processTime,
					team_id: this.shift.id,
					team_name: this.shift.name,
					person_id: this.staff.id,
					device_id: this.device.id,
					device_name: this.device.name,
					device_no: this.device.no
				};
				try {
					let res = await Promise.resolve(editDeviceTask(param));
					console.log(res);
					if (res[1].data.code == 200) {
						uni.showToast({
							title: '修改成功'
						});
						uni.navigateBack();
					} else {
						uni.showToast({
							icon: 'none',
							title: res[1].data.msg || '操作失败'
						});
					}
				} catch (e) {
					console.log(e);
				}
			} else {
				// 新增
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						process_time: this.processTime,
						team_id: this.shift.id,
						team_name: this.shift.name,
						person_id: this.staff.id,
						device_id: this.device.id,
						device_name: this.device.name,
						device_no: this.device.no
					};
					uni.showLoading();
					let res = await Promise.resolve(addDeviceTask(param));
					uni.hideLoading();
					console.log(res);
					if (res[1].statusCode == 200) {
						uni.showToast({
							title: res[1].data.msg,
							duration: 2000
						});
						this.processTime = '';
						this.shift = {};
						this.staff = {};
						this.device = {};
						// 关闭当前页跳到详情
						let id = res[1].data.data.id;
						uni.redirectTo({
							url: `/pages/application/deviceProcess/taskInfo?id=${id}`
						});
					}
				} catch (e) {
					uni.hideLoading();
					console.log(e);
				}
			}
			this.$pageUtil.navigateBack()
		}
	},

	components: { uniCalendar }
};
</script>

<style lang="scss" scoped>
.new_device {
	padding: 40rpx 40rpx 0 40rpx;

	.device_msg {
		margin-bottom: 100rpx;
	}

	.item {
		display: flex;
		align-items: center;
		position: relative;
		height: 110rpx;

		.label {
			width: 180rpx;
			font-size: 30rpx;
		}
		input {
			flex: 1;
			height: 70rpx;
			padding: 0 50rpx 0 10rpx;
			border: 1px solid #ccc;
			border-radius: 10rpx;
			font-size: 28rpx;
		}
		.arrow {
			position: absolute;
			right: 0;
			padding: 0 10rpx;
			font-size: 50rpx;
			color: #999;
		}
	}
	.sub_button {
		display: flex;
		justify-content: center;
		button {
			font-size: 35rpx;
		}
	}
}
</style>
