<template>
	<view class="shift_choose">
		<view class="search">
			<u-select @confirm="handleSelectChange" mode="single-column" v-model="search.selectShow" :list="search.searchList"></u-select>
			<view class="search-selector" @click="handleClickSelect">
				<text>{{search.selectLabel}}</text>
				<u-icon  name="arrow-down-fill" color="#666666" size="18"></u-icon>
			</view>
			<u-search style="height: 70rpx;width: 65%;border: 1px solid #ccc;border-radius: 10rpx;" bg-color="#fff" search-icon="" :animation="true" shape="square" placeholder="搜索"
			 v-model="search.input" :clearabled="true" show-action @search="handleClickSearch" @custom="handleClickSearch" :focus="true">
			</u-search>
		</view>
		<view class="shift_box">
			<view class="item" v-for="(item,i) in shiftList" :key="i" >
				<view class="left">
					<view class="title">
						设备名称<i>{{item.name}}</i>
					</view>
					设备代码：{{item.number}}
				</view>
				<view class="right">
					<button type="primary" size="mini" :plain="true" @click="choseShift(item.name,item.id,item.number)">选择</button>
				</view>
			</view>
			<view class="empty" >
				{{empty}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDeviceList,
	} from '@/api/deviceProcess.js'
	export default {
		data() {
			return{
				shiftList:[],// 班次列表
				search: {
					searchList: [{
							value: "number",
							label: "设备代码"
						},
						{
							value: "name",
							label: "设备名称"
						}
					],
					select: 'number',
					selectLabel: '设备代码',
					selectShow: false,
					input: ''
				},
				currentPage:1,
				totalcount:0,
				searchParam:{},
				empty:'没有更多了'
			}
		},
		mounted() {
			this.getShiftList()
		},
		// 触底加载更多
		onReachBottom(){
			let total = 0
			total = this.currentPage*10
		    this.currentPage += 1
			if(total < this.totalcount){
				this.getShiftList()
			}else{
				this.empty = '没有更多了'
				console.log('没有更多了')
			}
		},
		methods: {
			// 获取班次列表
			async getShiftList() {
				try {
					const param = {
						orgId: uni.getStorageSync('auth').orgId,
						current_page: this.currentPage,
						page_size: 10,
						...this.searchParam,
					}
					uni.showLoading()
					this.empty = '正在加载中'
					let res = await Promise.resolve(getDeviceList(param))
					uni.hideLoading()
					this.empty = '没有更多了'
					if(res[1].statusCode == 200){
						this.shiftList.push(...res[1].data.data.records)
						this.totalcount = res[1].data.data.total
						// console.log(this.shiftList)
					}
				} catch (e) {
					uni.hideLoading()
					console.log(e);
				}
			},
		
		    // show选择框
			handleClickSelect(){
				this.search.selectShow = true
			},
			
			
			// 搜索切换
			handleSelectChange(val){
				this.search.select = val[0].value
				this.search.selectLabel = val[0].label
				this.search.input = ''
			},
			// 搜索
			handleClickSearch(){
				this.shiftList = []
				this.searchParam = {}
				this.currentPage = 1
				this.searchParam[this.search.select] = this.search.input
				this.getShiftList()
			},
			
			// 选择
			choseShift(name,id,no){
				var pages = getCurrentPages();//当前页
				var beforePage = pages[pages.length - 2];
				var json = {
					name:name,
					id:id,
					no:no
				};
				this.$globalEvent.emit('newdevice-select', { type: 'device', json });
				// if(beforePage !=undefined){
				// 	if(beforePage.device){//判断是否为小程序，小程序的数据都在data里
				// 		beforePage.device = json;
				// 	}else{
				// 		beforePage.data.device = json;
				// 	}
				// }
				uni.navigateBack();
			}
		}
	};
</script>
<style lang="scss" scoped>
	page{
		background-color: #f8f8f8;
	}
	.shift_choose{
		padding: 30rpx 30rpx 0 30rpx ;
		
		.search{
			display: flex;
			align-items: center;
			height: 100rpx;
			margin-bottom: 30rpx;
			
			.search-selector{
				height: 70rpx;
				line-height: 68rpx;
				padding:0 20rpx;
				border: 1px solid #ccc;
				border-radius: 10rpx;
				background-color: #fff;
				box-sizing: border-box;
				text{
					margin-right: 10rpx;
				}
			}
		}
		.shift_box{
			padding: 0 10rpx;
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10rpx 40rpx;
				background-color: #fff;
				height: 160rpx;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				.left{
					width: 72%;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.title{
					font-size: 34rpx;
					font-weight: 900;
				}
				i {
					font-size: 30rpx;
					font-style: normal;
					margin-left: 10rpx;
				}
				button{
					font-size: 28rpx;
				}
			}
			.empty {
				text-align: center;
			}
		}
	}
</style>
