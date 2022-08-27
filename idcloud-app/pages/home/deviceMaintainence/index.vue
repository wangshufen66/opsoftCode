<template>
	<view class="page">
		<scroll-view scroll-y class="d-position-bottom" :style="{ height: this.scrollHeight + 'px' }">
			<view class="switch-wrapper">
				<uni-segmented-control class="switch-item" :current="current.value" :values="current.items" @clickItem="handleChangeSwitch"></uni-segmented-control>
			</view>
			<view v-for="(item, index) in list" @click="handleClickBlock(item)" :key="index" class="scroll-block">
				<view class="icon-wrapper">
					<image style="width: 44px; height: 44px;" :style="item.status == 3 ?'filter: grayscale(100%)':''" :src="item.dataImg"></image>
				</view>
				<view class="content-wrapper">
					<text class="ticket-title">{{item.number}}</text>
					<view class="ticket-brief">
						<text>工单内容：</text>
						<text>{{item.content.substr(0,12)}}</text>
						<text v-if="item.content.length>12">...</text>
					</view>
					<view class="ticket-brief">
						<text>汇报时间：</text>
						<text>{{item.updateTime}}</text>
					</view>
				</view>
				<view class="arrow-wrapper">
					<uni-icons type="arrowright" size="16" style="color: gray;"></uni-icons>
				</view>
			</view>
			<uni-load-more v-if="hasLoadingBar" :status="loadingStatus" :contentText="loadingText" @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getReportTicketList
	} from '@/api/ticketReport.js'
	export default {
		components: {},
		onReady() {
			this.initList(2);
		},
		data() {
			return {
				hasLoadingBar: true,
				list: [],
				page: {
					current: 1,
					size: 20
				},
				current: {
					value: 0,
					items: ['可汇报', '已结案']
				},
				// more/loading/nomore
				loadingStatus: 'loading',
				loadingText: {
					contentdown: '点击显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				isBottom: false,
				orgId: uni.getStorageSync('auth').orgId,
				dataImg: ''
			};
		},
		methods: {
			loadMore() {
				if (!this.isBottom) {
					this.page.current++
					this.getList()
				}
			},
			async getList() {
				try {
					let param = {
						orgId: this.orgId,
						current_page: this.page.current,
						page_size: this.page.size,
						status: this.current.value + 2
					}
					let res = await Promise.resolve(this.fetchData(param))
					if (res) {
						res[1].data.data.records.forEach(i => {
							this.list.push(i)
						})
						if (res[1].data.data.records.length === this.page.size) {
							this.loadingStatus = 'more'
						} else {
							this.loadingStatus = 'nomore'
							this.isBottom = true
						}
					}
				} catch (e) {
					console.log(e);
				}
			},
			// status = 2 执行， status = 3 结案
			async initList() {
				try {
					this.page.current = 1
					let param = {
						orgId: this.orgId,
						current_page: 1,
						page_size: this.page.size,
						status: this.current.value + 2
					}
					let res = await Promise.resolve(this.fetchData(param))
					this.list = res[1].data.data.records
					if (res[1].data.data.total >= this.page.size) {
						this.loadingStatus = 'more'
					} else {
						this.hasLoadingBar = false
						this.isBottom = true
					}
				} catch (e) {
					console.log(e);
				}
			},
			async fetchData(param) {
				try {
					this.isBottom = false
					this.hasLoadingBar = true
					this.loadingStatus = 'loading'
					let res = await Promise.resolve(getReportTicketList(param))
					if (res[1].data.code === 200) {
						res[1].data.data.records.forEach(i => {
							switch (i.type) {
								case 1:
									i.dataImg = '../../../static/ticketReport/weixiu.png'
									break;
								case 2:
									i.dataImg = '../../../static/ticketReport/dianjian.png'
									break;
								case 3:
									i.dataImg = '../../../static/ticketReport/baoyang.png'
									break;
								case 4:
									i.dataImg = '../../../static/ticketReport/runhua.png'
									break;
								default:
									break;
							}
						})
						return res
					} else return null
				} catch (e) {
					console.log(e);
				}
			},
			handleClickBlock(item) {
				this.$store.dispatch('setTicketDetail', item)
				uni.navigateTo({
					url: '/pages/home/deviceMaintainence/ticketDetail'
				})
			},
			handleChangeSwitch(index) {
				this.page.current = 1
				this.current.value = index.currentIndex
				this.initList()
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import url('./style.scss');

	.switch-button-wrapper {
		::v-deep {
			.uni-button:after {
				border-radius: 0;
			}
		}
	}
</style>
