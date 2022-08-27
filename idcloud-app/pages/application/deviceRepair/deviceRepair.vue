<template>
	<view class="device-check">
		<view class="search-wrapper">
			<u-select @confirm="handleSelectChange" mode="single-column" v-model="search.selectShow" :list="search.searchList">
			</u-select>
			<view class="search-selector" @click="handleClickSelect">
				<text style="position: relative; right: 10%;">{{search.selectLabel}}</text>
				<view style="width: 1px; height: 32rpx; background-color:#d2d2d2; position: absolute;left: 100%; bottom: 25%;">
					<u-icon style="position: absolute; bottom: 2px; right: 8px;" name="arrow-down-fill" color="#666666" size="18"></u-icon>
				</view>
			</view>
			<u-search style="width: 55%;" bg-color="#f5f5f5" search-icon="" shape="square" placeholder="搜索" v-model="search.input"
			 :clearabled="true" show-action @search="handleClickSearch" @custom="handleClickSearch"></u-search>
			<view @click="handleScan" style="width: 10%; display: flex; justify-content: center;">
				<u-icon name="scan" size="36"></u-icon>
			</view>
		</view>
		<view class="card-wrapper">
			<!-- 			<view class="accurate-wrapper" v-if="hasAccurateSearch">
				<view style="margin-bottom: 4px;">
					<text class="accurate-title">单面板转印机</text>
				</view>
				<view style="display: flex;width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">设备代码</view>
					<view class="accurate-input" style="max-width: 569rpx;">sbdm0003吹啊时间覅偶尔手机哦分十九哦操i二级佛i鄂竞技的呃偶尔叫沉默俄奥二等奖1</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">负责人</view>
					<view class="accurate-input" style="max-width: 569rpx;">Jimmy</view>
				</view>
				<view style="display: flex; width: 100%;">
					<view class="accurate-inner" style="width: 120rpx; text-align: right;">设备类别</view>
					<view class="accurate-input" style="max-width: 569rpx;">检测</view>
				</view>
			</view>
			<view v-if="hasAccurateSearch" style="height: 8px; background-color: #f5f5f5; width: 100%;"></view>
			<view v-if="hasAccurateSearch" style="color: #454545; font-size: 16px; font-weight: 700; padding: 6px 0 6px 5%;">包含该设备的点检工单</view> -->
			<view v-if="ticketListFailed" style="width: 100%; margin-top: 20vh;">
				<view style="text-align: center; font-size: 12px; margin-bottom: 12rpx;">内容加载失败</view>
				<view style="display: flex;justify-content: center;">
					<u-button @click="handleGetTicketList" type="primary" size="mini">重新加载</u-button>
				</view>
			</view>
			<view v-if="loading" style="position:fixed; top: 45vh; display: flex;justify-content: center; width: 100%;">
				<u-loading size="52" mode="circle"></u-loading>
			</view>
			<u-empty :show="hasEmpty" margin-top="200" text="工单为空" mode="list"></u-empty>
			<view @click="handleClickCard(item)" v-for="(item,index) in dataList" :key="index" class="card-item">
				<view class="icon-wrapper">
					<image src="../../../static/ticketReport/weixiu.png" style="width: 44px;height: 44px;"></image>
				</view>
				<view class="text-wrapper">
					<text class="text-title">{{item.archivesName}}</text>
					<view>
						<text>设备代码：</text>
						<text>{{item.archivesNumber}}</text>
					</view>
					<view>
						<text>部件名称：</text>
						<text>{{item.partName || '-'}}</text>
					</view>
					<view>
						<text>工单日期：</text>
						<text>{{item.orderTime}}</text>
					</view>
				</view>
				<view class="arrow-wrapper">
					<uni-icons type="arrowright" size="16" style="color: gray;"></uni-icons>
				</view>
			</view>
			<u-loadmore v-if="!hasEmpty && hasStatus" @loadmore="handleClickNext" style="padding: 16px 0;" :status="loadStatus" />
		</view>
	</view>
</template>



<script>
	import {
		getTicketList,
		getMaterialList
	} from '@/api/deviceRepair.js'
	export default {
		components: {

		},
		onReady() {
			this.getPartList()
		},
		onShow() {
			this.handleGetTicketList()
		},
		data() {
			return {
				hasEmpty: false,
				hasStatus: true,
				isLoading: false,
				// loadmore	loading  nomore
				loadStatus: 'loadmore',
				page: {
					size: 10,
					total: 0,
					current: 1

				},
				search: {
					searchList: [{
							value: "archivesNumber",
							label: "设备代码"
						},
						{
							value: "archivesName",
							label: "设备名称"
						},
						{
							value: "partNumber",
							label: "部件代码"
						},
						{
							value: "partName",
							label: "部件名称"
						}, {
							value: "chargePersonName",
							label: "负责人"
						}
					],
					select: 'partNumber',
					selectLabel: '部件代码',
					selectShow: false,
					input: ''
				},
				hasAccurateSearch: false,
				dataList: [],
				originList: [],
				retryCount: 0,
				ticketListFailed: false,
				loading: false
			};
		},
		watch: {
			'page.current': {
				handler(n) {
					if (n === this.page.total) {
						this.loadStatus = 'nomore'
					} else {
						this.loadStatus = 'loadmore'
					}
				},
				immediate: true
			}
		},
		methods: {
			handleClickNext() {
				this.page.current++
				if (this.page.current == this.page.total) this.loadStatus = 'nomore'
				this.dataList.push.apply(this.dataList, this.originList.slice(this.page.size * (this.page.current -
					1), this.page.size * this.page.current))
			},
			handleScan() {
				const that = this
				uni.scanCode({
					onlyFromCamera: true,
					success: function(res) {
						// uni.showToast({
						// 	icon: 'none',
						// 	title: `检测到 ${res.scanType} 码`
						// })
						console.log(`检测到 ${res.scanType} 码`);
						that.search.input = res.result
						that.handleClickSearch(res.result)

					},
					fail: function(res) {
						uni.showToast({
							icon: 'none',
							title: '扫码失败'
						})
					}
				});
			},
			async getPartList() {
				this.ticketListFailed = false
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId
					}
					this.loading = true
					let res = await Promise.resolve(getMaterialList(param))

					if (res[1].data.code !== 200) {
						if (this.retryCount < 5) {
							this.retryCount++
							this.getPartList()
						} else {
							uni.showToast({
								icon: 'none',
								title: '获取备件接口访问失败'
							})
						}
					} else {
						let d = res[1].data.data
						d.forEach(i => {
							i.selectCount = 0
						})
						this.$store.dispatch('setSparePartInfo', d)
					}

				} catch (e) {

					console.log(e);
				}
			},
			handleClickSearch(val) {
				if (val == '') {
					this.handleGetTicketList()
					return
				}
				this.dataList = this.originList.filter(i => i[this.search.select] && i[this.search.select].indexOf(val) !== -1)
				this.hasStatus = false
			},
			async handleGetTicketList() {
				this.hasStatus = true
				this.ticketListFailed = false
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						userId:uni.getStorageSync('extraUserInfo').userId,
					}
					this.loading = true
					let res = await Promise.resolve(getTicketList(param))
					this.dataList = []
					this.loading = false
					if (res[1].data.code === 200) {
						let d = res[1].data.data
						d = d.filter(i => (i.status == 1 || i.status == 2) && i.auditStatus == 1 && i.type == 1)

						this.originList = d
						this.page.total = Math.ceil(d.length / this.page.size)
						if (this.page.total == 1) {
							this.loadStatus = 'nomore'
						}
						this.dataList = d.slice(0, this.page.size)
						this.hasEmpty = this.dataList.length == 0
					} else {
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						})
					}


				} catch (e) {
					this.ticketListFailed = true
					console.log(e);
				}
			},
			handleClickCard(item) {
				this.$store.dispatch('setDeviceTicketInfo', item)
				this.search.input = ''
				this.page.current = 1
				uni.navigateTo({
					url: "/pages/application/deviceRepair/ticket?jump=0"
				});
			},
			handleSelectChange(val) {
				this.search.select = val[0].value
				this.search.selectLabel = val[0].label
				this.search.input = ''
			},
			handleClickSelect() {
				this.search.selectShow = true
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import './style.scss';
</style>
