<template>
	<view class="ticket">
		<view class="card-wrapper">
			<view class="accurate-wrapper">
				<view style="margin-bottom: 4px;">
					<text class="accurate-title">{{ ticketData.archivesName }}（{{ ticketData.archivesNumber }}）</text>
				</view>
				<view style="display: flex;width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">工单代码</view>
					<view class="accurate-input" style="max-width: 569rpx;">{{ ticketData.number }}</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">部位信息</view>
					<view class="accurate-input" style="max-width: 569rpx;">
						{{ ticketData.partName }}
						<text v-if="ticketData.partNumber">(</text>
						{{ ticketData.partNumber }}
						<text v-if="ticketData.partNumber">)</text>
						<text v-else>-</text>
					</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">工单来源</view>
					<view class="accurate-input" style="max-width: 569rpx;">
						<text v-if="ticketData.source == 0" style="color: #007AFF;">点检</text>
						<text v-else-if="ticketData.source == 1">手动添加</text>
						<text v-else-if="ticketData.source == 2" style="color: red;">返工</text>
						<text v-else-if="ticketData.source == 3" style="color: green;">自动生成</text>
						<text v-else-if="ticketData.source == 4" style="color: red;">返工</text>
						<text v-else>-</text>
					</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">工单日期</view>
					<view class="accurate-input" style="max-width: 569rpx;">{{ ticketData.orderTime }}</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">工单状态</view>
					<view class="accurate-input" style="max-width: 569rpx;">
						<text v-if="ticketData.status == 1">未执行</text>
						<text v-else-if="ticketData.status == 2" style="color: green;">执行中</text>
						<text v-else-if="ticketData.status == 3" style="color: #007AFF;">已完成</text>
					</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">工单内容</view>
					<view class="accurate-input" style="max-width: 569rpx;">{{ ticketData.content }}</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">负责人</view>
					<view class="accurate-input" style="max-width: 569rpx;">{{ ticketData.chargePersonName }}</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">是否停机</view>
					<view class="accurate-input" style="max-width: 569rpx;">
						<text v-if="ticketData.downStatus == 0" style="color: green;">否</text>
						<text v-else-if="ticketData.downStatus == 1" style="color: red;">是</text>
					</view>
				</view>
			</view>
			<view style="height: 8px; background-color: #FFFFFF; width: 100%;"></view>
			<view class="switch-wrapper">
				<uni-segmented-control
					class="switch-item"
					:current="current.value"
					:values="current.items"
					@clickItem="handleChangeSwitch"
				></uni-segmented-control>
			</view>
			<view v-if="current.value == 0">
				<view v-if="ticketListFailed" style="width: 100%; margin-top: 20vh;">
					<view style="text-align: center; font-size: 12px; margin-bottom: 12rpx;">内容加载失败</view>
					<view style="display: flex;justify-content: center;">
						<u-button @click="getRecord" type="primary" size="mini">重新加载</u-button>
					</view>
				</view>
				<u-empty :show="hasTicketEmpty" margin-top="160" text="列表为空" mode="list"></u-empty>
				<view @click="handleClickCard(item)" v-for="(item, index) in recordList" :key="index" class="card-item">
					<view class="icon-wrapper">
						<image src="../../../static/ticketReport/baoyang.png" style="width: 44px;height: 44px;"></image>
					</view>
					<view class="text-wrapper">
						<view>
							<text>汇报时间：</text>
							<text>{{ item.createTime }}</text>
						</view>
						<view>
							<!-- 						<text style="color: rgba(0,0,0,0.6);">执行结果：</text>
						<text v-if="item.executionResult == 0" style="color: green;">执行中</text>
						<text v-else-if="item.executionResult == 1" style="color: #007AFF;">完成</text>
						<text v-else style="color: rgba(0,0,0,0.6);">-</text> -->
							<text style="color: rgba(0,0,0,0.6);">汇报人：</text>
							<text style="color: rgba(0,0,0,0.6);">{{ item.personName }}</text>
						</view>
					</view>
					<view class="arrow-wrapper">
						<uni-icons type="arrowright" size="16" style="color: gray;"></uni-icons>
					</view>
				</view>
			</view>
			<view v-else>
				<view v-if="partListFailed" style="width: 100%; margin-top: 20vh;">
					<view style="text-align: center; font-size: 12px; margin-bottom: 12rpx;">内容加载失败</view>
					<view style="display: flex;justify-content: center;">
						<u-button @click="getSparePart" type="primary" size="mini">重新加载</u-button>
					</view>
				</view>
				<u-empty :show="hasPartEmpty" margin-top="160" text="列表为空" mode="list"></u-empty>
				<u-card
					:foot-border-top="false"
					:show-foot="false"
					sub-title-color="#5B5B5B"
					v-for="(k, ki) in sparePartList"
					:key="ki"
					:title="k.materialName"
					:sub-title="`领取数量：${k.num}`"
				>
					<view class="" slot="body">
						<view class="u-body-item u-col-between u-p-t-0">
							<view class="u-body-item-title u-line-2">
								<text>领用人：{{ k.recipientName }}</text>
							</view>
							<view class="u-body-item-title u-line-2">
								<text>领用时间：{{ k.recipientDate }}</text>
							</view>
						</view>
					</view>
				</u-card>
			</view>
		</view>
		<view @click="handleAddNewReport" class="new-report-wrapper">新增汇报</view>
		<view v-if="loading" style="position:fixed; top: 45vh; display: flex;justify-content: center; width: 100%;">
			<u-loading size="52" mode="circle"></u-loading>
		</view>
	</view>
</template>

<script>
import { getTicketList, getRecordList, getSparePartList } from '@/api/deviceRepair.js';
export default {
	onLoad(options) {
		//通过路由中的jump参数判断是通知栏跳转还是页面跳转
		this.jumpFlag = options.jump === '1';
		//存储页面参数
		this.pageParam = options;
	},
	onShow() {
		if (!this.jumpFlag) {
			this.ticketData = this.$store.state.device.data;
			this.getTicketSelf();
		} else {
			this.getPageData();
		}
		this.getRecord();
		this.getSparePart();
	},
	data() {
		return {
			current: {
				value: 0,
				items: ['保养记录', '备件领用']
			},
			ticketData: '',
			recordList: [],
			sparePartList: [],

			ticketListFailed: false,
			partListFailed: false,
			loading: false,
			hasTicketEmpty: false,
			hasPartEmpty: false,
			//是否从通知栏跳转至此
			jumpFlag: false,
			//页面参数
			pageParam: null
		};
	},
	methods: {
		async getTicketSelf() {
			if (!this.ticketData) return;
			this.getPageData();
		},
		//获取页面数据
		async getPageData() {
			const param = {
				orgId: uni.getStorageSync('auth').orgId,
				number: this.jumpFlag ? this.pageParam.number : this.ticketData.number
			};
			try {
				let res = await getTicketList(param);
				await this.$store.dispatch('setDeviceTicketInfo', res[1].data.data[0]);
				this.ticketData = res[1].data.data[0];
			} catch (e) {
				console.log(e);
			}
		},

		async getRecord() {
			if (!this.ticketData) return;
			try {
				this.loading = true;
				this.ticketListFailed = false;
				const param = {
					workOrderId: this.$store.state.device.data.id
				};
				let res = await getRecordList(param);
				this.loading = false;
				this.recordList = [];
				this.recordList = res[1].data.data;
				this.hasTicketEmpty = this.recordList.length == 0;
			} catch (e) {
				this.ticketListFailed = true;
				console.log(e);
			}
		},
		async getSparePart() {
			if (this.ticketData == '') return;
			try {
				this.loading = true;
				this.partListFailed = false;
				const param = {
					workOrderNumber: this.$store.state.device.data.number
				};
				let res = await getSparePartList(param);
				this.loading = false;
				this.sparePartList = [];
				this.sparePartList = res[1].data.data;
				this.hasPartEmpty = this.sparePartList.length == 0;
			} catch (e) {
				this.partListFailed = true;
				console.log(e);
			}
		},
		handleChangeSwitch(index) {
			this.current.value = index.currentIndex;
		},
		handleAddNewReport() {
			uni.navigateTo({
				url: '/pages/application/deviceMaintenance/report'
			});
		},
		async handleClickCard(item) {
			await this.$store.dispatch('setReportDetailInfo', item);
			uni.navigateTo({
				url: '/pages/application/deviceMaintenance/detail'
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.switch-wrapper {
	padding: 0 0 10px 0;
	display: flex;
	justify-content: center;
	width: 100%;
}

.switch-item {
	width: 90%;
	height: 30px;
}

.search-wrapper {
	z-index: 20;
	display: flex;
	padding: 12rpx 5% 12rpx 5%;
	position: fixed;
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background-color: white;

	.search-selector {
		position: relative;
		top: 1rpx;
		height: 64rpx;
		width: 25%;
		background-color: #f5f5f5;
		color: #666666;
		text-align: center;
		line-height: 64rpx;
	}
}

.card-wrapper {
	padding-top: 12rpx;
	padding-bottom: 80rpx;

	.accurate-wrapper {
		width: 100%;
		background-color: white;
		padding-left: 37rpx;
		padding-bottom: 2%;

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

	.card-item {
		width: 100%;
		height: 65px;
		background-color: #fff;
		border-bottom: 1px solid #efefef;
		display: flex;

		.icon-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			line-height: 65px;
			width: 15%;
			height: 100%;
			padding-left: 5%;
		}

		.text-wrapper {
			width: 80%;
			padding-left: 6%;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.text-title {
				font-size: 16px;
				font-weight: 500;
				color: #474747;
			}

			text {
				font-size: 12px;
				font-weight: 400;
				color: #474747;
			}
		}

		.arrow-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			line-height: 65px;
			width: 10%;
			padding-right: 5%;
		}
	}
}

.new-report-wrapper {
	height: 80rpx;
	background-color: #2f7fe3;
	font-size: 16px;
	text-align: center;
	line-height: 80rpx;
	color: #fff;
	position: fixed;
	bottom: 0;
	z-index: 20;
	width: 100%;
}
</style>
