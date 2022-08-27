<template>
	<view class="report">
		<view class="gray-title">
			实际执行时间<text>*</text>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				实际开始时间
			</view>
			<view @click="clickChangeTime('showStartTime')" class="line-child">
				{{validate.workStartTime}}
			</view>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				实际结束时间
			</view>
			<view @click="clickChangeTime('showEndTime')" class="line-child">
				{{validate.workEndTime}}
			</view>
		</view>
		<view v-if="ticketData.downStatus == 1" class="gray-title">
			停机时间<text>*</text>
		</view>
		<view v-if="ticketData.downStatus == 1" class="line-wrapper">
			<view class="line-title">
				停机开始时间
			</view>
			<view @click="clickChangeTime('showStopStart')" class="line-child">
				{{validate.stopTimeStart}}
			</view>
		</view>
		<view v-if="ticketData.downStatus == 1" class="line-wrapper">
			<view class="line-title">
				停机结束时间
			</view>
			<view @click="clickChangeTime('showStopEnd')" class="line-child">
				{{validate.stopTimeEnd}}
			</view>
		</view>
		<view class="gray-title">
			工单执行结果<text>*</text>
		</view>
		<view class="line-wrapper" style="padding-right: 2%;">
			<view class="line-title">
				执行结果
			</view>
			<view class="line-child">
				<u-radio-group width="160rpx" v-model="validate.executionResult" @change="handleExecResultGroupChange">
					<u-radio v-for="(item, index) in execResultList" :key="index" :name="item.key" :active-color="item.color">
						{{item.value}}
					</u-radio>
				</u-radio-group>
			</view>
		</view>
		<view class="gray-title">
			备件领用情况
		</view>
		<view class="textarea-wrapper" style="padding-right: 2%;">
			<view v-if="refreshDOM" class="line-child">
				<view v-for="(i, k) in partList" :key="k" class="minus-wrapper">
					<view>
						<u-icon @click="clickMinus(i)" size="48" color="#FF5151" name="minus-circle-fill"></u-icon><text style="font-size: 16px; position: relative; bottom: 6rpx; left: 10rpx;">{{i.name}}</text>
					</view>
					<view style="padding-right: 5%;">
						<u-number-box v-model="i.selectCount" :input-width="100" :input-height="60"></u-number-box>
					</view>
				</view>
				<view @click="handleClickAddParts" class="add-wrapper">
					<view>
						<u-icon size="48" color="#2776FF" name="plus-circle-fill"></u-icon><text style="font-size: 16px;color: #C8C8C8; position: relative; bottom: 6rpx; left: 10rpx;">添加备件领用情况</text>
					</view>
					<uni-icons type="arrowright" size="16" style="color: gray;"></uni-icons>
				</view>
			</view>
		</view>
		<view class="gray-title">
			描述
		</view>
		<view class="textarea-wrapper" style="margin-bottom: 24rpx;">
			<u-input type="textarea" v-model="validate.content" placeholder="填写汇报内容" />
		</view>
		<u-upload max-count="9" :multiple="false" @on-uploaded="handleAllUploaded" @on-list-change="handleFileListChange"
		 @on-change="uploadFinish" ref="uploader" :auto-upload="false" :action="uploadUrl" :header="uploadHeader"></u-upload>
		<view @click="handleSubmit" class="fixed-bottom">提交</view>
		<u-picker style="margin-bottom: 24rpx;" mode="time" :params="timeParams" v-model="time.showStartTime" @confirm="handleStartTimeConfirm"></u-picker>
		<u-picker style="margin-bottom: 24rpx;" mode="time" :params="timeParams" v-model="time.showEndTime" @confirm="handleEndTimeConfirm"></u-picker>
		<u-picker style="margin-bottom: 24rpx;" mode="time" :params="timeParams" v-model="time.showStopStart" @confirm="handleStopStartTimeConfirm"></u-picker>
		<u-picker style="margin-bottom: 24rpx;" mode="time" :params="timeParams" v-model="time.showStopEnd" @confirm="handleStopEndTimeConfirm"></u-picker>
		<u-toast ref="uToast" />
		<u-toast ref="uToast2" />
	</view>
</template>
<script>
	import moment from 'moment'
	import baseUrl from '@/common/js/baseUrl.js';
	import {
		addNewReport,
		addNewParts
	} from '@/api/deviceRepair.js'
	export default {
		computed: {
			getSpareList: {
				get() {
					return this.$store.state.device.partInfo
				},
				set(val) {
					this.$store.commit('setPart', val)
				}
			}
		},
		components: {

		},
		onShow() {
			this.ticketData = this.$store.state.device.data
			this.$nextTick(() => {
				this.refreshDOM = false
				this.$nextTick(() => {
					this.partList = this.getSpareList.filter(i => i.selectCount > 0)
					this.$nextTick(() => {
						this.refreshDOM = true
					})
				})

			})
		},
		onReady() {
			this.uploadHeader = {
				Authorization: 'Bearer ' + uni.getStorageSync('auth').token,
				platform: 'mobile'
			}
			this.uploadUrl = baseUrl() + '/file/upload'
		},
		onUnload() {
			this.everyThingFinishFunc()
		},
		data() {
			return {
				refreshDOM: true,
				partList: [],
				ticketData: {
					downStatus: 0
				},
				fileList: [],
				validate: {
					content: '',
					workStartTime: '请选择开始时间',
					workEndTime: '请选择结束时间',
					stopTimeStart: '请选择停机开始时间',
					stopTimeEnd: '请选择停机结束时间',
					executionResult: 0
				},
				time: {
					showStartTime: false,
					showEndTime: false,
					showStopStart: false,
					showStopEnd: false
				},
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				execResultList: [{
						key: 0,
						value: '执行中',
						color: 'green'
					},
					{
						key: 1,
						value: '已完成',
						color: '#4686f4'
					}
				],
				uploadHeader: {},
				uploadUrl: '',
				fdfsIdList: [],
				successCount: 0
			};
		},
		methods: {
			nativeTime(item){
				// #ifdef APP-PLUS
				let d = ''
				let t = ''
				plus.nativeUI.pickDate((val)=>{
					d = moment(val.date).format('YYYY-MM-DD')
					plus.nativeUI.pickTime((vt)=>{
						t = moment(vt.date).format('HH:mm')
						this.validate[item] = `${d} ${t}:00`
					}, (vt)=>{
						t = moment(Date.now()).format('HH:mm')
						this.validate[item] = `${d} ${t}:00`
					})
				},(val)=>{
					
				})
						
				
				// #endif
			},
			
			clickChangeTime(val) {
				switch (val) {
					case 'showStartTime':
						if (this.$store.state.config.data.useNativeTimePicker) {
							this.nativeTime('workStartTime')
						} else {
							this.time.showStartTime = !this.time.showStartTime
						}
						break;
					case 'showEndTime':
						if (this.$store.state.config.data.useNativeTimePicker) {
							this.nativeTime('workEndTime')
						} else {
							this.time.showEndTime = !this.time.showEndTime
						}
						break;
					case 'showStopStart':
						if (this.$store.state.config.data.useNativeTimePicker) {
							this.nativeTime('stopTimeStart')
						} else {
							this.time.showStopStart = !this.time.showStopStart
						}
						break;
					case 'showStopEnd':
						if (this.$store.state.config.data.useNativeTimePicker) {
							this.nativeTime('stopTimeEnd')
						} else {
							this.time.showStopEnd = !this.time.showStopEnd
						}
						break;
				}
			},
			handleFileListChange(val) {
				this.fileList = val
			},
			clickMinus(val) {
				this.partList.forEach((i, k) => {
					if (i.id === val.id) {
						i.selectCount = 0
						this.partList.splice(k, 1)
						return
					}
				})
			},
			handleClickAddParts() {
				uni.navigateTo({
					url: '/pages/application/sparePart',
					animationType: 'slide-in-bottom'
				})
			},
			uploadFinish(res, index, lists, name) {
				const ret = JSON.parse(res.data)
				if (ret.code == 200) {
					this.$refs.uToast.show({
						title: `上传第${index + 1}张图片成功`,
						type: 'success'
					})
					// 每成功一次， 记一次数
					this.successCount++
					this.fdfsIdList.push(ret.data.id)
					// this.$refs.uToast.show({
					// 	title: '上传成功',
					// 	type: 'success'
					// })
					// 当成功数和文件列表数相同时， 说明全部上传完毕且都成功， 可以提交表单。
					if (this.successCount == this.fileList.length) {
						this.formSubmitFunc(this.fdfsIdList)
					}

				} else {
					this.$refs.uToast.show({
						title: '上传发生错误',
						type: 'error'
					})
				}

			},
			handleAllUploaded() {

			},
			// 如果有图片被上传， 则需要先提交图片返回fdfsid后再上传表单， 但是如果没有图片则直接提交表单
			async formSubmitFunc(fdfsIdList) {
				uni.showLoading({
					mask: true,
					title: '提交中...'
				})
				try {
					let param = {
						orgId: uni.getStorageSync('auth').orgId,
						workOrderId: this.ticketData.id,
						fdfsIds: fdfsIdList,
						...this.validate
					}
					if (this.ticketData.downStatus == 0) {
						delete param.stopTimeStart
						delete param.stopTimeEnd
					}
					let res = await Promise.resolve(addNewReport(param))
					console.log(res[1].data.msg);
					uni.hideLoading()
					if (res[1].data.code === 200) {
						if (this.partList.length > 0) {
							console.log(this.partList);
							const p = []
							this.partList.forEach(i => {
								p.push({
									materialId: i.id,
									orderId: this.ticketData.id,
									number: this.ticketData.number,
									num: i.selectCount,
									orgId: uni.getStorageSync('auth').orgId,
									reportId: res[1].data.data

								})
							})
							let r = await Promise.resolve(addNewParts(p))
							if (r[1].data.code !== 200) {
								this.$refs.uToast2.show({
									title: '汇报失败 \n' + r[1].data.msg,
									type: 'error',
									icon: false
								})
							} else {
								uni.showToast({
									title: res[1].data.msg,
									duration: 1500,
									mask: true
								})
								this.everyThingFinishFunc()
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
							}

						} else {
							uni.showToast({
								title: res[1].data.msg,
								duration: 1500,
								mask: true
							})
							this.everyThingFinishFunc()
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
						}
					} else {
						this.$refs.uToast2.show({
							title: '汇报失败 \n' + res[1].data.msg,
							type: 'error',
							icon: false
						})
					}


				} catch (e) {
					console.log(e);
				}
			},
			handleCheckResultGroupChange(val) {

			},
			handleExecResultGroupChange(val) {

			},
			handleSubmit() {
				if (this.validateFunc() !== 0) {
					uni.showToast({
						title: this.validateFunc(),
						icon: 'none'
					})
					return -1
				}

				if (this.fileList.length == 0) {
					this.formSubmitFunc([])
				} else {
					this.$refs.uploader.upload()
				}

				// uni.navigateTo({
				// 	url: '/pages/application/deviceCheck/finish',
				// 	animationType: 'slide-in-bottom'
				// })
			},
			everyThingFinishFunc() {
				this.validate = {
					content: '',
					workStartTime: '请选择开始时间',
					workEndTime: '请选择结束时间',
					stopTimeStart: '请选择停机开始时间',
					stopTimeEnd: '请选择停机结束时间',
					executionResult: 0
				}
				this.fdfsIdList = []
				this.successCount = 0
				this.fileList = []
				this.partList = []
				this.getSpareList.forEach(i => {
					i.selectCount = 0
				})

				this.$refs.uploader.clear()

			},
			validateFunc() {
				if (this.validate.workStartTime == '请选择开始时间')
					return '开始时间未选择'
				if (this.validate.workEndTime == '请选择结束时间')
					return '结束时间未选择'
				if ((moment(this.validate.workStartTime).valueOf() / 1000) > (moment(this.validate.workEndTime).valueOf() / 1000))
					return '开始时间不得大于结束时间'

				if (this.ticketData.downStatus == 1) {
					if (this.validate.stopTimeStart == '请选择停机开始时间')
						return '停机开始时间未选择'
					if (this.validate.stopTimeEnd == '请选择停机结束时间')
						return '停机结束时间未选择'
					if ((moment(this.validate.stopTimeStart).valueOf() / 1000) > (moment(this.validate.stopTimeEnd).valueOf() / 1000))
						return '开始时间不得大于结束时间'
				}

				return 0

			},
			handleStartTimeConfirm(val) {
				this.validate.workStartTime = `${val.year}-${val.month}-${val.day} ${val.hour}:${val.minute}:${val.second}`
			},
			handleEndTimeConfirm(val) {
				this.validate.workEndTime = `${val.year}-${val.month}-${val.day} ${val.hour}:${val.minute}:${val.second}`
			},
			handleStopStartTimeConfirm(val) {
				this.validate.stopTimeStart = `${val.year}-${val.month}-${val.day} ${val.hour}:${val.minute}:${val.second}`
			},
			handleStopEndTimeConfirm(val) {
				this.validate.stopTimeEnd = `${val.year}-${val.month}-${val.day} ${val.hour}:${val.minute}:${val.second}`
			}
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #F7F7F7;
	}
</style>
<style lang="scss" scoped>
	@import './style.scss';

	.minus-wrapper {
		display: flex;
		justify-content: space-between;
		padding: 12rpx 0;
		border-bottom: 1px solid #F5F5F5;
	}

	.add-wrapper {
		display: flex;
		justify-content: space-between;
		padding: 12rpx 0;
	}
</style>
