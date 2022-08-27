<template>
	<view class="bb" v-if="hasItem">
		<view class="container">
			<view v-for="(i,index) in list" :key="index" class="card-wrapper">
				<view @click="handleClickCard(i)" class="card-item">
					<u-image border-radius="6px 6px 0 0" width="357rpx" height="200rpx" mode="scaleToFill" :src="i.imgUrl"></u-image>
					<view class="title-wrapper">
						<text class="title">{{i.config.title.substr(0, 10)}}</text>
						<text v-if="i.config.title.length > 10">...</text>
						<view class="time">{{mm(i.config.timestamp).format('YYYY-MM-DD h:mm:ss')}}</view>
					</view>

				</view>
			</view>
		</view>
		<view class="load">
			<u-loadmore @loadmore="loadmore" :status="status" />
		</view>
	</view>
	<view v-else>
		<u-empty style="margin-top: 25vh;" text="数据为空" mode="list"></u-empty>
	</view>
</template>


<script>
	import {
		fetchList
	} from '@/api/dashboard.js'
	import moment from 'moment'
	export default {
		components: {

		},
		onLoad(val) {
			if(val.back){
				uni.navigateBack()
			}
		},
		onReady() {
			this.getDashboardList()
		},

		data() {
			return {
				hasItem: true,
				page: 1,
				limit: 10,
				total: '',
				list: [],
				// 加载前值为loadmore，加载中为loading，没有数据为nomore
				status: 'loading',
				mm: moment
			}
		},
		methods: {
			async handleClickCard(val) {
				console.log(val);
				await this.$store.commit('setDashboardData', val)
				uni.navigateTo({
					url: '/pages/application/present/jumper?goto=webview'
				});
			},
			loadmore() {
				this.page++
				if (this.page > Math.ceil(this.total / this.limit)) {
					this.status = 'nomore'
				} else {
					this.getDashboardList()
				}
			},
			async getDashboardList() {
				const param = {
					page: this.page,
					limit: this.limit,
					title: undefined,
					status: undefined,
					project: '全部大屏',
					orgId: uni.getStorageSync('auth').orgId
				}
				try {
					let res = await Promise.resolve(fetchList(param))
					const r = res[1].data.data
					this.total = r.total
					if (r.items.length == this.limit) {
						this.status = 'loadmore'
						r.items.forEach(i => {
							this.list.push(i)
						})
					} else if (r.items.length == 0) {
						this.hasItem = false
					} else {
						this.status = 'nomore'
						r.items.forEach(i => {
							this.list.push(i)
						})
					}


				} catch (e) {
					console.log(e);
				}
			}
		}
	};
</script>


<style>
	page {
		background-color: #f8f8f8;
	}
</style>
<style lang="scss" scoped>
	.title-wrapper {
		padding-left: 18rpx;
	}

	.title {
		font-size: 12px;
		font-weight: 400;
		color: #333333;
		line-height: 17px;
	}

	.time {
		font-size: 10px;
		font-weight: 400;
		color: #a3a3a3;
	}

	.load {
		padding: 24rpx 0;
	}

	.container {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		padding-top: 6rpx;
	}

	.card-wrapper {
		width: 50%;
		padding: 6rpx 12rpx 6rpx 6rpx;
		height: 310rpx;

		.card-item {
			width: 100%;
			height: 100%;
			background-color: #FFFFFF;
			border-radius: 6px;
			box-shadow: 1px 1px 1px rgba(#252502, 0.1);
		}
	}

	.card-wrapper:nth-child(odd) {
		padding: 6rpx 6rpx 6rpx 12rpx;
	}
</style>
