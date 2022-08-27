<template>
	<view class="device-check">
		<view class="top_fixed">
			<view v-if="hasHint" class="hint-wrapper">{{ hintText }}</view>
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
		</view>
		<view class="card-wrapper">
			<view v-if="ticketListFailed" style="width: 100%; margin-top: 20vh;">
				<view style="text-align: center; font-size: 12px; margin-bottom: 12rpx;">内容加载失败</view>
				<view style="display: flex;justify-content: center;"><u-button @click="handleGetList" type="primary" size="mini">重新加载</u-button></view>
			</view>
			<view v-if="loading" style="position:fixed; top: 45vh; display: flex;justify-content: center; width: 100%;"><u-loading size="52" mode="circle"></u-loading></view>
			<u-empty :show="hasEmpty" margin-top="200" text="内容为空" mode="list"></u-empty>
			<view @click="handleClickCard(item)" v-for="(item, index) in dataList" :key="index" class="card-item" @longpress="showProp(item)">
				<view class="icon-wrapper"><image src="../../../static/deviceProcess/jgrw.png" style="width: 44px;height: 44px;"></image></view>
				<view class="text-wrapper">
					<text class="text-title">{{ item.deviceName }}</text>
					<view>
						<text>设备代码：</text>
						<text>{{ item.deviceNo }}</text>
					</view>
					<view>
						<text>班次：</text>
						<text>{{ item.teamName || '-' }}</text>
					</view>
					<view>
						<text>人员：</text>
						<text>{{ item.personName || '-' }}</text>
					</view>
					<view>
						<text>加工日期：</text>
						<text>{{ item.processTime }}</text>
					</view>
				</view>
				<view class="arrow-wrapper"><uni-icons type="arrowright" size="16" style="color: gray;"></uni-icons></view>
			</view>
		</view>
		<u-loadmore @loadmore="clickLoadmore" :status="clickLoadingStatus" />
		<u-select v-model="showPicker" mode="mutil-column-auto" :default-value="selectDefault" :list="selectorObj" @confirm="handlePickerConfirm"></u-select>
		<view class="suspence-view" @click="toNewDevice"><fa-icon type="plus" size="22" color="#fff"></fa-icon></view>
	</view>
</template>

<script>
import { getTaskList, getContainerTree, delDeviceTask, editDeviceTask } from '@/api/deviceProcess.js';
export default {
	components: {},
	onReady() {
		// this.handleGetList();
		this.getTree();
	},
	onShow() {
		this.handleGetList();
	},
	onUnload() {
		this.$globalEvent.off('shift-select', this.onSelectShift);
	},
	data() {
		return {
			hasEmpty: false,
			isLoading: false,
			search: {
				searchList: [
					{
						value: 'deviceNo',
						label: '设备代码'
					},
					{
						value: 'deviceName',
						label: '设备名称'
					},
					{
						value: 'teamName',
						label: '班次'
					},
					{
						value: 'personName',
						label: '人员'
					}
				],
				select: 'deviceNo',
				selectLabel: '设备代码',
				selectShow: false,
				input: ''
			},
			dataList: [],
			retryCount: 0,
			ticketListFailed: false,
			loading: false,

			page: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
				pages: 0
			},

			// 加载前值为loadmore，加载中为loading，没有数据为nomore
			clickLoadingStatus: 'loadmore',
			// 筛选picker
			showPicker: false,
			selectDefault: [],
			selectorObj: [
				{
					value: -1,
					label: '全部工厂',
					children: [
						{
							value: -1,
							label: '全部车间'
						}
					]
				}
			],
			treeDisabled: false,
			searchParam: {},
			extraParam: {},
			hasHint: false,
			hintText: ''
		};
	},
	onNavigationBarButtonTap() {
		if (!this.treeDisabled) {
			this.showPicker = !this.showPicker;
		}
	},
	methods: {
		// 长按弹出框
		showProp(item) {
			let _this = this;
			uni.showActionSheet({
				itemList: ['编辑', '删除'],
				success: function(res) {
					if (res.tapIndex == 0) {
						// 编辑
						_this.editTask(item);
					}
					if (res.tapIndex == 1) {
						// 删除
						_this.delTask(item);
					}
				}
			});
		},

		// 删除任务
		delTask(item) {
			// console.log(item)
			if (item.status == 0) {
				uni.showToast({
					icon: 'none',
					title: '当前任务不可删除'
				});
				return;
			}
			let _this = this;
			uni.showModal({
				title: '温馨提示',
				content: '确定要删除吗?',
				success: async function(res) {
					if (res.confirm) {
						let param = [];
						param.push(item);
						try {
							let res = await Promise.resolve(delDeviceTask(param));
							console.log(res);
							if (res[1].data.code == 200) {
								uni.showToast({
									title: '删除成功'
								});
								_this.handleGetList();
							} else {
								uni.showToast({
									icon: 'none',
									title: res[1].data.msg || '操作失败'
								});
							}
						} catch (e) {
							console.log(e);
						}
					}
				}
			});
		},
		// 编辑任务
		async editTask(item) {
			// console.log(item)
			if (item.status == 0) {
				uni.showToast({
					icon: 'none',
					title: '当前任务不可编辑'
				});
				return;
			}
			uni.navigateTo({
				url: `./newdevice?id=${item.id}`
			});
		},

		toNewDevice() {
			uni.navigateTo({
				url: './newdevice'
			});
		},

		clickLoadmore() {
			this.page.currentPage++;
			this.handleGetList();
		},
		handleClickSearch(val) {
			this.dataList = [];
			this.searchParam = {};
			this.searchParam[this.search.select] = this.search.input;
			this.page.currentPage = 1;
			this.handleGetList();
		},
		handlePickerConfirm(val) {
			this.dataList = [];
			this.extraParam = {};
			this.page.currentPage = 1;
			if (val[1].value !== -1) {
				this.extraParam.containerId = val[1].value;
			}
			this.handleGetList();

			if (val[0].value == -1) {
				this.hasHint = false;
			} else {
				this.hasHint = true;
				this.hintText = `${val[0].label} > ${val[1].label}`;
			}
		},
		async handleGetList() {
			this.ticketListFailed = false;
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					userId:uni.getStorageSync('extraUserInfo').userId,
					current_page: this.page.currentPage,
					page_size: this.page.pageSize,
					...this.searchParam,
					...this.extraParam
				};
				this.loading = true;
				this.clickLoadingStatus = 'loading';
				let res = await Promise.resolve(getTaskList(param));
				// console.log(res)
				// console.log(res[1].data.data.records)
				// this.dataList = []
				this.loading = false;
				if (res[1].data.code === 200) {
					// console.log(res[1].data)
					this.page.total = res[1].data.data.total;
					this.page.pages = res[1].data.data.pages;
					if (this.page.currentPage >= this.page.pages) {
						this.clickLoadingStatus = 'nomore';
					} else {
						this.clickLoadingStatus = 'loadmore';
					}
					this.dataList = [];
					res[1].data.data.records.forEach(i => {
						this.dataList.push(i);
					});
					// let d = res[1].data.data
					// d = d.filter(i => (i.status == 1 || i.status == 2) && i.auditStatus == 1 && i.type == 3)
					// this.dataList = d
					// this.originList = JSON.parse(JSON.stringify(d))
					// this.hasEmpty = this.dataList.length == 0
				} else {
					// this.ticketListFailed = true
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
				}
			} catch (e) {
				this.ticketListFailed = true;
				console.log(e);
			}
		},
		async getTree() {
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId
				};
				let res = await Promise.resolve(getContainerTree(param));
				const arr1 = res[1].data.data.filter(i => i.ctrType == 1);
				const arr2 = res[1].data.data.filter(i => i.ctrType == 2);
				arr1.forEach(i => {
					this.selectorObj.push({
						value: i.id,
						label: i.ctrName,
						children: [
							{
								value: i.id,
								label: '全部设备'
							}
						]
					});
					arr2.forEach(k => {
						if (i.id == k.ctrParent) {
							this.selectorObj[this.selectorObj.length - 1].children.push({
								value: k.id,
								label: k.ctrName
							});
						}
					});
				});
				this.treeDisabled = false;
			} catch (e) {
				console.log(e);
			}
		},
		async handleClickCard(item) {
			await this.$store.commit('setDeviceProcessData', item);
			uni.navigateTo({
				url: `/pages/application/deviceProcess/taskInfo?id=${item.id}&status=${item.status}`
			});
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
.suspence-view {
	position: fixed;
	z-index: 40;
	bottom: 5%;
	right: 10%;
	height: 100upx;
	width: 100upx;
	display: flex;
	justify-content: center;
	align-items: center;
	/* background-color: #0079FE; */
	background-color: rgba(170, 170, 170, 0.5);
	text-align: center;
	border-radius: 50%;
}

.suspence-view:active {
	background-color: rgba(170, 170, 170, 0.3);
	/* background-color:rgba(0,127,225,0.3); */
}

.hint-wrapper {
	height: 80rpx;
	line-height: 80rpx;
	padding: 0 32rpx;
	font-size: 28rpx;
	color: #626262;
}
</style>
