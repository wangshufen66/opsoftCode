<template>
	<view class="create-ticket">
		<view class="card-wrapper" style="padding-top: 8rpx;">
			<view class="accurate-wrapper">
				<view style="margin-bottom: 4px;">
					<text class="accurate-title">{{ticketData.archivesName}}</text>
				</view>
				<view style="display: flex;width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">设备代码</view>
					<view class="accurate-input" style="max-width: 569rpx;">{{ticketData.archivesNumber}}</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">部位名称</view>
					<view class="accurate-input" style="max-width: 569rpx;">{{ticketData.partName || '-'}}</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">部位代码</view>
					<view class="accurate-input" style="max-width: 569rpx;">{{ticketData.partNumber || '-'}}</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">工单来源</view>
					<view class="accurate-input" style="max-width: 569rpx;">点检</view>
				</view>
			</view>
			<view style="height: 8px; background-color: #f5f5f5; width: 100%;"></view>
			<view style="color: #454545; font-size: 16px; font-weight: 700; padding: 6px 0 6px 5%;">填写内容</view>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				维修日期<text style="color: red; position: relative; top: 8rpx; left: 6rpx;">*</text>
			</view>
			<view @click="clickChangeTime" class="line-child">
				{{validate.orderTime}}
			</view>
		</view>
		<view class="line-wrapper" style="padding-right: 15rpx;">
			<view class="line-title">
				是否停机 <text style="color: red; position: relative; top: 8rpx; left: 6rpx;">*</text>
			</view>
			<view class="line-child">
				<u-radio-group v-model="validate.downStatus" @change="handleCheckResultGroupChange">
					<u-radio style="margin-left: 36rpx;" v-for="(item, index) in offlineList" :key="index" :name="item.key"
					 :active-color="item.color">
						{{item.value}}
					</u-radio>
				</u-radio-group>
			</view>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				负责人
			</view>
			<view @click="showPop" class="line-child">
				{{validate.chargePersonName}}
				<uni-icons type="arrowright" size="14" style="color: gray;"></uni-icons>
			</view>
		</view>
		<view class="textarea-wrapper" style="margin-bottom: 24rpx;">
			<view>
				维修内容及要求<text style="color: red; position: relative; top: 8rpx; left: 6rpx;">*</text>
			</view>
			<u-input :clearable="false" style="height: 320rpx; margin-top: 8rpx;" type="textarea" v-model="validate.content"
			 placeholder="" border />
		</view>

		<view @click="handleSubmit" class="fixed-bottom">提交</view>

		<uni-popup @change="popupChange" style="height: 75vh;" ref="unipop" type="bottom">
			<view class="popupcontainer">
				<view class="pop-title">
					<u-input v-model="searchAdmin" placeholder="搜索负责人" type="text" :border="true" />
				</view>

				<scroll-view scroll-y style="height: 75vh;">
					<view v-if="loading" style="display: flex;justify-content: center; margin-top: 5vh;">
						<u-loading size="48" mode="circle"></u-loading>
					</view>
					<view @click="clickPopInner(item)" v-for="(item, index) in adminList" :key="index" class="pop-inner">
						<view style="display: flex; justify-content: space-between; height: 40px; line-height: 40px; ">
							<text style="margin-left: 45rpx;">{{item.number}}</text>
							<text style="margin-right: 45rpx;">{{item.name}}</text>
						</view>
					</view>
				</scroll-view>

				<view style="height: 12px; background-color: #FFFFFF;"></view>
			</view>
		</uni-popup>
		<u-picker style="margin-bottom: 24rpx;" mode="time" :params="timeParams" v-model="showTime" @confirm="handleChangeTime"></u-picker>
	</view>
</template>

<script>
	import {
		addNewRepairTicket,
		getAdminList
	} from '@/api/deviceCheck.js'
	export default {
		watch: {
			searchAdmin(n) {
				const timeout = 500
				if (this.debounceTimeoutId == '') {
					this.debounceTimeoutId = setTimeout(() => {
						this.debounceInput(n)
					}, timeout);
				} else {
					clearTimeout(this.debounceTimeoutId)
					this.debounceTimeoutId = setTimeout(() => {
						this.debounceInput(n)
					}, timeout)
				}
			}
		},
		data() {
			return {
				debounceTimeoutId: '',
				ticketData: '',
				searchAdmin: '',
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				validate: {
					orderTime: '请选择维修时间',
					downStatus: 0,
					chargePersonId: '',
					chargePersonName: '请选择',
					content: ''
				},
				offlineList: [{
						key: 0,
						value: '否',
						color: 'green'
					},
					{
						key: 1,
						value: '是',
						color: 'red'
					}
				],
				loading: false,
				adminList: [],
				showTime: false,
				originList: []
			};
		},
		onReady() {

		},
		onShow() {
			this.ticketData = this.$store.state.device.data

		},
		methods: {
			clickChangeTime() {
				if (this.$store.state.config.data.useNativeTimePicker) {
					let d = ''
					let t = ''
					plus.nativeUI.pickDate((val) => {
						d = moment(val.date).format('YYYY-MM-DD')
						plus.nativeUI.pickTime((vt) => {
							t = moment(vt.date).format('HH:mm')
							this.validate.orderTime = `${d} ${t}:00`
						}, (vt) => {
							t = moment(Date.now()).format('HH:mm')
							this.validate.orderTime = `${d} ${t}:00`
						})
					}, (val) => {

					})
				} else {
					this.showTime = !this.showTime
				}
			},
			popupChange(val) {
				if (val.show == false)
					this.searchAdmin = ''
			},
			debounceInput(n) {
				console.log(n);
				if (n == '') {
					this.adminList = this.originList
					return
				}
				this.adminList = this.originList.filter(i => i.number == n || i.name.indexOf(n) !== -1)
			},
			handleChangeTime(val) {
				this.validate.orderTime = `${val.year}-${val.month}-${val.day} ${val.hour}:${val.minute}:${val.second}`
			},
			async handleSubmit() {
				try {
					if (this.validate.orderTime == '请选择维修时间') {
						uni.showToast({
							title: '请填写维修时间',
							icon: 'none'
						})
						return
					}
					if (this.validate.content == '') {
						uni.showToast({
							title: '请填写维修内容',
							icon: 'none'
						})
						return
					}
					let param = {
						type: 1,
						source: 0,
						...this.validate,
						equipmentId: this.ticketData.equipmentId,
						partId: this.ticketData.partId,
						orgId: uni.getStorageSync('auth').orgId
					}
					if (param.chargePersonId == '') {
						delete param.chargePersonId
						delete param.chargePersonName
					}
					uni.showLoading({
						mask: true,
						title: '提交中...'
					})
					let res = await Promise.resolve(addNewRepairTicket(param))
					uni.hideLoading()
					console.log(res[1].data);
					if (res[1].data.code === 200) {
						const rid = await this.$store.state.device.finishInfo.reportId
						await this.$store.dispatch('setCheckResultStatus', {
							status: 0,
							reportId: rid
						})
						uni.showToast({
							mask: true,
							icon: 'success',
							title: '添加成功',
							duration: 1500
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500);
					} else {
						uni.showToast({
							icon: 'none',
							title: '添加失败'
						})
					}
				} catch (e) {
					console.log(e);
				}



			},
			validateFunc() {
				if (this.validate.orderTime == '请选择维修时间')
					return '维修时间不能为空'
				if (this.validate.content == '')
					return '维修内容及要求不能为空'
				return 0
			},
			clearAll() {
				this.validate = {
					orderTime: '请选择维修时间',
					downStatus: 0,
					chargePersonId: '',
					chargePersonName: '请选择',
					content: ''
				}
			},
			handleCheckResultGroupChange(val) {

			},
			handleExecResultGroupChange(val) {

			},
			async showPop() {
				this.$nextTick(() => {
					this.$refs['unipop'].open()
				})

				if (this.originList.length == 0) {
					this.loading = true
					try {
						const param = {
							orgId: uni.getStorageSync('auth').orgId
						}
						let res = await Promise.resolve(getAdminList(param))
						this.loading = false
						this.originList = res[1].data.data
						this.adminList = res[1].data.data
					} catch (e) {
						console.log(e);
					}
				}
			},
			async clickPopInner(item) {
				this.validate.chargePersonId = item.id
				this.validate.chargePersonName = item.name
				this.$refs['unipop'].close()
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './style.scss';

	.line-wrapper {
		width: 100%;
		height: 80rpx;
		background-color: white;
		padding: 0 5%;
		border-bottom: 1px solid #F5F5F5;
		display: flex;
		justify-content: space-between;



		.line-title {
			line-height: 80rpx;
			font-size: 14px;
			font-weight: 400;
			color: #2c2c2c;
		}

		.line-child {
			line-height: 80rpx;
			font-size: 14px;
			font-weight: 400;
			color: #7d7d7d;
		}

	}

	.textarea-wrapper {
		background-color: white;
		padding: 0 5%;
		border-bottom: 1px solid #F5F5F5;
	}


	.card-title {
		padding: 2px 2px 0 12px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 6px;

		text:nth-child(1) {
			font-size: 14px;
			color: #212121;
		}

		text:nth-child(2) {
			font-size: 48px;
			line-height: 20px;
		}
	}

	.card-subtitle {
		display: flex;
		justify-content: center;
		margin-top: 3px;

		image {
			margin-right: 8px;
		}

		text {
			line-height: 24px;
			margin: auto 0;
			color: rgba(0, 0, 0, 0.5);
			;
		}
	}

	.card-value {
		display: flex;
		justify-content: center;
		margin-top: 4px;
		flex-wrap: wrap;

		text {
			font-size: 24px;
			font-weight: 600;
			color: #2b7fe4;
		}

		text:nth-child(1) {
			margin-right: 2px;
		}

		text:nth-child(2) {}
	}

	.main-container {
		width: 100%;
		background-color: #F4F4F4;
	}

	.next-container {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 20px;
	}

	.inner-card-wrapper {
		// height: 120px;
		width: 44%;
		background-color: #FFFFFF;
	}

	.inner-card-wrapper:nth-child(odd) {
		margin: 4% 2% 0 4%;
		// background-color: red;
	}

	.inner-card-wrapper:nth-child(even) {
		margin: 4% 4% 0 2%;
		// background-color: blue;
	}




	.popupcontainer {
		background-color: #FFFFFF;
	}

	.pop-inner {
		height: 40px;
		line-height: 40px;

		image {
			margin: auto 0;
			position: relative;
			top: 0;
		}

		text {
			margin: auto 0 auto 6px;
		}
	}

	.pop-inner:hover {
		background-color: #f6faff;
	}

	// .pop-inner:left{
	// 	background-color: red;
	// }

	.pop-title {
		padding: 12px 20px 0 20px;

		.pop-title-text {
			line-height: 40px;
			font-weight: 600;
			color: #000000;
			font-size: 16px;
		}
	}

	.pop-image {
		width: 20px;
		height: 20px;
	}
</style>
