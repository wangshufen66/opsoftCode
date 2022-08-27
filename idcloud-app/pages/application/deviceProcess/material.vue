<template>
	<view class="device-check">
		<view class="search-wrapper">
			<u-select @confirm="handleSelectChange" mode="single-column" v-model="search.selectShow" :list="search.searchList"></u-select>
			<view class="search-selector" @click="handleClickSelect">
				<text style="position: relative; right: 10%;">{{ search.selectLabel }}</text>
				<view style="width: 1px; height: 32rpx; background-color:#d2d2d2; position: absolute;left: 100%; bottom: 25%;">
					<u-icon style="position: absolute; bottom: 2px; right: 8px;" name="arrow-down-fill" color="#666666" size="18"></u-icon>
				</view>
			</view>
			<u-search
				style="width: 65%;"
				bg-color="#f5f5f5"
				search-icon=""
				:animation="true"
				shape="square"
				placeholder="搜索"
				v-model="search.input"
				:clearabled="true"
				show-action
				@search="handleClickSearch"
				@custom="handleClickSearch"
			></u-search>
		</view>
		<view class="white-card-wrapper">
			<view v-for="(item, index) in dataList" :key="index" class="white-card">
				<view class="left-wrapper">
					<view class="header-s">物料名称: {{ item.materialName }}</view>
					<view class="text-s">物料代码: {{ item.materialNo }}</view>
					<view class="text-s">工序名称: {{ item.processName }}</view>
					<view class="text-s">任务单编号: {{ item.taskNo }}</view>
					<!-- <view class="text-s"><text>最终工序: </text>
						<u-checkbox class="checkbox-s" v-model="item.isKeyModel"></u-checkbox>
					</view> -->
				</view>
				<view class="button-wrapper"><u-button @click="handleAddNew(item)" size="mini" style="font-size: 30rpx;padding: 30rpx;" type="primary" :plain="true">选择</u-button></view>
			</view>
		</view>
		<u-loadmore @loadmore="clickLoadmore" :status="clickLoadingStatus" />
	</view>
</template>

<script>
import { addNewMaterial, getMaterialList } from '@/api/deviceProcess.js';
export default {
	onReady() {
		this.processData = this.$store.state.deviceProcess.data;
		this.getMaterialData();
	},
	data() {
		return {
			processData: {},
			radioValue: '',
			hasEmpty: false,
			isLoading: false,
			search: {
				searchList: [
					{
						value: 'number',
						label: '物料代码'
					},
					{
						value: 'name',
						label: '物料名称'
					},
					{
						value: 'processName',
						label: '工序名称'
					},
					{
						value: 'taskNo',
						label: '任务单编号'
					}
				],
				select: 'number',
				selectLabel: '物料代码',
				selectShow: false,
				input: ''
			},
			dataList: [],
			retryCount: 0,
			ticketListFailed: false,
			loading: false,

			// page: {
			// 	currentPage: 1,
			// 	pageSize: 10,
			// 	total: 0,
			// 	pages: 0
			// },

			// 加载前值为loadmore，加载中为loading，没有数据为nomore
			clickLoadingStatus: 'loadmore',
			searchParam: {},
			id: null, // 加工任务id
			originList: [] // 搜索用
		};
	},
	onLoad(options) {
		// console.log(options)
		this.id = options.id;
	},
	methods: {
		async handleAddNew(val) {
			// console.log(val)
			uni.showLoading({});
			try {
				const param = {
					productionDeviceId: this.id,
					orgId: uni.getStorageSync('auth').orgId,
					remarks: '',
					materialId: val.materialId,
					materialName: val.materialName,
					materialNo: val.materialNo,
					orderProcessId: val.orderProcessId,
					processId: val.processId,
					processName: val.processName,
					processNo: val.processNo,
					taskNo: val.processNo
				};
				console.log('添加物料参数', param);
				let res = await Promise.resolve(addNewMaterial(param));
				uni.hideLoading();
				console.log('添加物料', res);
				if (res[1].data.code == 200) {
					uni.showToast({
						title: res[1].data.msg
					});
					this.$globalEvent.emit('material-select');
				} else {
					uni.showToast({
						icon: 'none',
						title: res[1].data.msg
					});
				}
				this.$pageUtil.navigateBack();
			} catch (e) {
				uni.hideLoading();
				console.log(e);
			}
		},
		async getMaterialData() {
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					// current_page: this.page.currentPage,
					// page_size: this.page.pageSize,
					...this.searchParam
				};
				this.isLoading = true;
				let res = await Promise.resolve(getMaterialList(param));
				if (res[1].data.data.length <= 0) this.clickLoadingStatus = 'nomore';
				this.isLoading = false;
				// this.page.total = res[1].data.data.total
				// this.page.pages = res[1].data.data.pages
				// if (this.page.currentPage >= this.page.pages) {
				// 	this.clickLoadingStatus = 'nomore'
				// } else {
				// 	this.clickLoadingStatus = 'loadmore'
				// }
				const records = res[1].data.data.records || [];
				this.dataList = records.map(i => {
					return i;
				});
				this.clickLoadingStatus = 'nomore';
				// console.log(this.dataList);
			} catch (e) {
				console.log(e);
			}
		},
		// clickLoadmore() {
		// 	this.page.currentPage++
		// 	this.getMaterialData()
		// },
		handleClickSearch(val) {
			this.dataList = [];
			this.searchParam = {};
			this.searchParam[this.search.select] = this.search.input;
			// this.page.currentPage = 1
			this.getMaterialData();
		},

		handleSelectChange(val) {
			this.search.select = val[0].value;
			this.search.selectLabel = val[0].label;
			this.search.input = '';
		},
		handleClickSelect() {
			this.search.selectShow = true;
		}
	}
};
</script>
<style lang="scss" scoped>
@import './style.scss';

.white-card-wrapper {
	padding: 70rpx 32rpx 24rpx 32rpx;
}

.white-card {
	display: flex;
	justify-content: space-between;
	height: 260rpx;
	border-bottom: 1px solid #e3e3e3;
	padding: 24rpx 0;

	.left-wrapper {
		.header-s {
			font-size: 30rpx;
			font-family: PingFangSC, PingFangSC-Medium;
			font-weight: 500;
			color: #222222;
		}

		.text-s {
			font-size: 30rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			color: #858585;

			.checkbox-s {
				margin-left: 18rpx;
				position: relative;
				bottom: 5rpx;
			}
		}
	}

	.button-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
}
</style>
