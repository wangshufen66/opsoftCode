<template>
	<view class="container">
		<view class="middle-wrapper">
			<view class="title">
				<image class="imgs" src="../../static/calendar/title.png"></image>
				<view class="input-wrapper"><input style="height: 35px; width: 100%;" placeholder="日程标题" v-model="formData.name" /></view>
			</view>
			<view class="inner">
				<image class="imgs2" src="../../static/calendar/body.png"></image>
				<view class="input-wrapper"><textarea style="width: 100%;" v-model="formData.mark" placeholder="日程内容" /></view>
			</view>
			<view class="level">
				<text>优先级</text>
				<picker mode="selector" @change="bindPickerChange" :value="formData.sort" :range="array">
					<view class="uni-input">{{ array[index] }}</view>
				</picker>
			</view>
			<view class="time">
				<text>提醒时间</text>
				<text style="color: #a3a3a3;"  @click="clickShowPicker">{{date}}</text>
				<u-picker mode="time" :params="timeParams" v-model="showPicker" @confirm="handleStartTimeConfirm"></u-picker>
			</view>
			<button size="default" @click="save" class="btn"><text>保存</text></button>
		</view>
	</view>
</template>

<script>
import moment from 'moment';
import { saveSchedule, updateSchedule } from '@/api/schedule.js';
import KXDateTime from '@/components/kx-datetime/kx-datetime.vue';
import biaofunDatetimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker';
export default {
	components: { KXDateTime, biaofunDatetimePicker },
	data() {
		return {
			array: ['低', '中', '高'],
			index: 0,
			timeIndex: 0,
			type: '',
			formData: {
				id: '',
				mark: '',
				name: '',
				sort: '',
				userId: '',
				warnTime: '',
				time: ''
			},
			date: '请选择提醒时间',
			showPicker: false,
			timeParams: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: true
			}
		};
	},
	onLoad: data => {
		const item = JSON.parse(decodeURIComponent(data.data));
		uni.setStorageSync('calenderTmp', item);
	},
	onReady() {
		let tmp = uni.getStorageSync('calenderTmp');
		uni.removeStorage({
			key: 'calenderTmp'
		});
		this.type = tmp.type;
		this.formData.userId = tmp.userId;
		if (this.type === 'add') {
			uni.setNavigationBarTitle({
				title: '添加日程'
			});
		} else {
			this.formData = tmp.data;
			this.index = this.formData.sort;
			this.date = moment(tmp.data.warnTime).format('YYYY-MM-DD HH:mm')
			this.level = tmp.data.sort;
			uni.setNavigationBarTitle({
				title: '修改日程内容'
			});
		}
	},
	methods: {
		clickShowPicker(){
			if (this.$store.state.config.data.useNativeTimePicker) {
				// #ifdef APP-PLUS
				let d = ''
				let t = ''
				plus.nativeUI.pickDate((val)=>{
					d = moment(val.date).format('YYYY-MM-DD')
					plus.nativeUI.pickTime((vt)=>{
						t = moment(vt.date).format('HH:mm')
						this.date = `${d} ${t}`
					}, (vt)=>{
						t = moment(Date.now()).format('HH:mm')
						this.date = `${d} ${t}`
					})
				},(val)=>{
					
				})
						
				
				// #endif
			} else {
				this.showPicker = !this.showPicker
			}

		},
		handleStartTimeConfirm(val) {
			this.date = `${val.year}-${val.month}-${val.day} ${val.hour}:${val.minute}:${val.second}`
			console.log(this.date);
		},
		afterTimePicked(data) {
			this.date = data.fmt1 + ' ' + data.hh + ':' + data.mm + ':' + '00';
			// console.log(this.date);
		},
		save() {
			if (this.formData.name === '' || this.formData.mark === '') {
				uni.showToast({
					icon: 'none',
					title: '内容不得为空'
				});
			} else {
				if (this.type === 'add') {
					if (this.date === '') {
						uni.showToast({
							icon: 'none',
							title: '请选择时间'
						});
					} else {
						this.addNew();
					}
				} else {
					this.edit();
				}
			}
		},
		async addNew() {
			try {
				let param = {
					...this.formData
				};
				param.warnTime = this.date;
				param.orgId = uni.getStorageSync('auth').orgId;
				delete param.time;
				delete param.id;
				uni.showLoading({
					mask: true
				});
				let res = await Promise.resolve(saveSchedule(param));
				uni.hideLoading();
				if (res[1].data.code === 200) {
					uni.showToast({
						icon: 'none',
						title: '新增成功'
					});
					uni.navigateBack({
						animationType: 'pop-out',
						animationDuration: 200
					});
				}
			} catch (e) {
				console.log(e);
			}
		},
		async edit() {
			try {
				let param = {
					...this.formData
				};
				param.warnTime = this.date;
				param.orgId = uni.getStorageSync('auth').orgId;
				delete param.time;
				uni.showLoading({
					mask: true
				});
				let res = await Promise.resolve(updateSchedule(param));
				uni.hideLoading();
				if (res[1].data.code === 200) {
					uni.showToast({
						icon: 'none',
						title: '编辑成功'
					});
					uni.navigateBack({
						animationType: 'pop-out',
						animationDuration: 200
					});
				}
			} catch (e) {
				console.log(e);
			}
		},
		changeSelectTime(data) {
			this.formData.time = data.target.value;
		},
		changeSelectDate(data) {
			this.date = data.target.value;
		},
		bindPickerChange(data) {
			this.index = data.target.value;
			this.formData.sort = data.target.value;
		}
	}
};
</script>



<style lang="scss" scoped>
::v-deep {
	.level {
		.uni-input {
			font-size: 16px;
			font-weight: 400;
			color: #a3a3a3;
		}
	}
}
.btn {
	height: 40px;
	background: #2f7fe3;
	border-radius: 5px;
	text {
		position: relative;
		bottom: 3px;
		color: white;
	}
}
.date-picker {
	position: relative;
	left: 100rpx;
}
.input-wrapper {
	border: #ededed 1px solid;
	width: 100%;
	padding-left: 8px;
}
.imgs {
	width: 24px;
	height: 24px;
	margin: auto 15px auto 0;
}
.imgs2 {
	width: 24px;
	height: 24px;
	margin: 0 15px 0 0;
}
.container {
	display: flex;
	justify-content: center;
	.middle-wrapper {
		width: 80%;
		margin-top: 30px;
		.title {
			display: flex;
			line-height: 35px;
			margin-bottom: 20px;
		}
		.inner {
			display: flex;
			margin-bottom: 20px;
		}
		.level {
			display: flex;
			justify-content: space-between;
			font-size: 16px;
			color: #212121;
			border-bottom: #f0f0f0 1px solid;
			margin-bottom: 5px;
			text {
				margin: auto 0;
			}
		}
		.time {
			display: flex;
			justify-content: space-between;
			font-size: 16px;
			color: #212121;
			border-bottom: #f0f0f0 1px solid;
			margin-bottom: 40px;
			text {
				margin: auto 0;
			}
		}
	}
}
</style>
