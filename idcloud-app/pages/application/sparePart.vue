<template>
	<view>
		<view class="search-wrapper">
			<u-search :disabled="searchDisabled" style="width: 65%;" bg-color="#f5f5f5" search-icon="" :animation="true" shape="square"
			 placeholder="请输入备件名称" v-model="input" :clearabled="true" show-action @search="handleClickSearch" @custom="handleClickSearch"></u-search>
		</view>
		<view class="card-wrapper" style="padding-bottom: 24rpx;">
			<view v-for="(i, k) in dataList" :key="k" class="inner">
				<view class="title-s">{{i.name}}</view>
				<view class="slave-s">物料代码： {{i.number}}</view>
				<view class="slave-k">
					<text>规格型号：{{i.specification || '-'}}</text>
					<view>
						<u-number-box v-model="i.selectCount" :input-width="100" :input-height="60"></u-number-box>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>
<script>
	export default {
		onReady() {
			
		},
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
		onShow() {
			this.dataList = this.getSpareList
			this.input = ''
		},
		data() {
			return {
				input: '',
				dataList: [],
				searchDisabled: false,
				
			};
		},
		methods: {
			handleClickSearch(val) {
				// 去除搜索框焦点， 避免不断弹出键盘
				this.searchDisabled = true
				this.dataList = []
				this.$nextTick(() => {
					this.dataList = this.getSpareList.filter(i => i['name'].indexOf(val) !== -1)
					this.searchDisabled = false
				})
			}
		},
	}
</script>
<style lang="scss">

</style>
<style lang="scss" scoped>
	@import './deviceRepair/style.scss';

	.inner {
		padding: 4rpx 5% 10rpx 5%;
		border-bottom: 1px solid #F7F7F7;
	}

	.title-s {
		color: #222222;
		font-size: 14px;
	}

	.slave-s {
		color: #858585;
		font-size: 12px;
	}

	.slave-k {
		color: #858585;
		font-size: 12px;
		display: flex;
		justify-content: space-between;
	}
</style>
