<template>
	<view class="report" :style="containerStyle">
		<view class="gray-title" style="display: flex;">
			{{ticketData.archivesName}}
			<view style="line-height: 80rpx; margin-left: 8rpx;" v-if="ticketData.partName">(</view>{{ticketData.partName}}
			<view style="line-height: 80rpx;" v-if="ticketData.partName">)</view>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				编号
			</view>
			<view class="line-child">
				{{ticketData.number}}
			</view>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				执行结果
			</view>
			<view v-if="detailData.executionResult == 0" class="line-child">
				执行中
			</view>
			<view v-else-if="detailData.executionResult == 1" class="line-child">
				完成
			</view>
			<view v-else class="line-child">-</view>
		</view>

		<view class="line-wrapper">
			<view class="line-title">
				汇报人
			</view>
			<view class="line-child">
				{{detailData.personName}}
			</view>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				维修时间
			</view>
			<view class="line-child">
				{{detailData.createTime}}
			</view>
		</view>
		<view class="gray-title">
			汇报内容
		</view>
		<view class="textarea-wrapper" style="margin-bottom: 24rpx;">
			<u-input disabled type="textarea" v-model="detailData.content" placeholder="" />
		</view>
		<view class="gray-title">
			时间
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				开始时间
			</view>
			<view class="line-child">
				{{detailData.workStartTime}}
			</view>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				结束时间
			</view>
			<view class="line-child">
				{{detailData.workEndTime}}
			</view>
		</view>
		<view class="line-wrapper">
			<view class="line-title">
				执行时长
			</view>
			<view class="line-child">
				{{detailData.workTime}} 分钟
			</view>
		</view>
		<view v-if="ticketData.downStatus == 1" class="line-wrapper">
			<view class="line-title">
				停机开始时间
			</view>
			<view class="line-child">
				{{detailData.stopTimeStart}}
			</view>
		</view>
		<view v-if="ticketData.downStatus == 1" class="line-wrapper">
			<view class="line-title">
				停机结束时间
			</view>
			<view class="line-child">
				{{detailData.stopTimeEnd}}
			</view>
		</view>
		<view v-if="ticketData.downStatus == 1" class="line-wrapper">
			<view class="line-title">
				停机时长
			</view>
			<view class="line-child">
				{{detailData.stopTime}} 分钟
			</view>
		</view>
		<view class="gray-title">
			备件领用
		</view>
		<view v-if="hasEmpty" style="text-align: center;color: gray; font-size: 12px;">- 没有备件 -</view>
		<view v-if="getPartFailed" style="width: 100%;">
			<view style="text-align: center; font-size: 12px; margin-bottom: 12rpx;">内容加载失败</view>
			<view style="display: flex;justify-content: center;">
				<u-button @click="getParts" type="primary" size="mini">重新加载</u-button>
			</view>
		</view>
		<view v-for="(i, k) in partsList" :key="k" class="line-wrapper">
			<view class="line-title">
				{{i.materialName}}
			</view>
			<view class="line-child">
				{{i.num}}
			</view>
		</view>
		<view class="gray-title">
			汇报图片
		</view>
		<view class="pic-wrapper">
			<view v-if="picList.length == 0" style="width: 100%; color: gray; display: flex; justify-content: center; font-size: 12px;">
				<text>- 没有图片 -</text>
			</view>
			<u-image @click="handleClickPic(item, index)" v-for="(item, index) in picList" :key="index" width="250rpx" height="250rpx"
			 :src="item"></u-image>
			<view v-if="picList.length !== 0" style="width: 100%; color: gray; display: flex; justify-content: center; font-size: 12px; margin: 10rpx 0;"><text>已经到底了</text></view>
		</view>
		<view v-if="hasDelete" @click="handleDelete" style="background-color: #E30026;" class="fixed-bottom">删除</view>
	</view>
</template>
<style lang="scss" scoped>
	@import './style.scss';

	.pic-wrapper {
		display: flex;
		flex-wrap: wrap;
	}
</style>
<script>
	import {
		getReportPart
	} from '@/api/deviceRepair.js'
	import {
		deleteReport
	} from '@/api/deviceCheck.js'
	export default {
		onReady() {

		},
		onShow() {
			this.ticketData = this.$store.state.device.data
			this.detailData = this.$store.state.device.detail
			this.picList = this.detailData.imgUrl

			this.hasDelete = this.detailData.executionResult == 0
			this.detailData.executionResult == 0 ? this.containerStyle = "padding-bottom: 100rpx" : this.containerStyle =
				"padding-bottom: 0rpx"
			this.getParts()

		},
		data() {
			return {
				ticketData: '',
				detailData: '',
				picList: [],
				partsList: [],
				hasEmpty: false,
				getPartFailed: false,
				containerStyle: "padding-bottom: 100rpx",
				hasDelete: false,
				loadPartsSuccessfully: false
			};
		},
		methods: {
			async handleDelete() {
				if (!this.loadPartsSuccessfully)
					return
				uni.showLoading({
					title: '删除中...',
					mask: 'true'
				})
				try {
					let param = {
						fdfsIds: this.detailData.fdfsIds,
						partIds: [],
						reportId: this.detailData.id
					}

					this.partsList.forEach(i => {
						param.partIds.push(i.id)
					})

					let res = await Promise.resolve(deleteReport(param))
					uni.hideLoading()
					if (res[1].data.code == 200) {
						uni.showToast({
							mask: true,
							duration: 1500,
							title: '删除成功'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500);
					} else {
						uni.showToast({
							icon: 'none',
							title: '删除失败'
						})
					}
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: '删除失败'
					})
					console.log(e);
				}


			},
			async getParts() {
				try {
					this.loadPartsSuccessfully = false
					this.getPartFailed = false
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						reportId: this.detailData.id
					}
					let res = await Promise.resolve(getReportPart(param))
					this.partsList = res[1].data.data
					this.hasEmpty = this.partsList.length == 0
					if (res[1].data.code === 200)
						this.loadPartsSuccessfully = true
				} catch (e) {
					this.getPartFailed = true
					console.log(e);
				}
			},
			handleClickPic(item, index) {
				uni.previewImage({
					current: index,
					urls: this.picList
				})
			}
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #F7F7F7;
	}
</style>
