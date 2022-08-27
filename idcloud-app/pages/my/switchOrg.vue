<template>
	<view class="container">
		<scroll-view scroll-y :style="{ height: this.scrollHeight + 'px', backgroundColor: '#f3f3f3' }">
			<radio-group @change="radioChange">
				<view @click="radioChange({ detail: { value: item.id } }, item)" v-for="(item, index) in list" :key="index" class="inner-element">
					<view class="column-center">
						<view>
							<image src="../../static/department.png"></image>
							<text>{{ item.name }}</text>
						</view>
						<radio disabled :value="item.id + ''" :checked="item.id == selected" />
					</view>
				</view>
			</radio-group>
		</scroll-view>
	</view>
</template>
<style lang="scss" scoped>
	.inner-element {
		width: 100%;
		height: 50px;
		background-color: white;
		border-bottom: #f6f6f6 1px solid;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.column-center {
			display: flex;
			justify-content: space-between;
			padding: 0 14px;
		}

		image {
			width: 20px;
			height: 20px;
			position: relative;
			top: 4px;
			margin-right: 10px;
		}

		text {
			font-size: 16px;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			color: #232323;
		}
	}
</style>

<script>
	import {
		getOrgList
	} from '@/api/userInfo.js';

	export default {
		onLoad: data => {
			uni.setStorageSync('_tmp_', data.id);
		},
		onReady() {
			this.userId = uni.getStorageSync('_tmp_');
			uni.removeStorage({
				key: '_tmp_'
			});
			this.initOrgList();
		},
		onShow() {
			this.selected = uni.getStorageSync('auth').orgId;
			console.log(uni.getStorageSync('auth'));
			console.log(this.selected);
		},
		data() {
			return {
				userId: '',
				list: [],
				selected: ''
			};
		},
		watch: {},
		methods: {
			radioChange(data, item) {
				if (this.selected !== parseInt(data.detail.value)) {
					const id = parseInt(data.detail.value);
					uni.showModal({
						title: '确认',
						content: '确认切换组织吗',
						success: r => {
							if (r.confirm === true) {
								this.selected = parseInt(data.detail.value);
								const _auth = uni.getStorageSync('auth');
								const _extraUserInfo = uni.getStorageSync('extraUserInfo');
								const _s1 = {
									token: _auth.token,
									expire: _auth.expire,
									orgId: id
								};
								const _s2 = {
									companyName: item.name,
									img: _extraUserInfo.img,
									userId: _extraUserInfo.userId
								};
								uni.setStorageSync('auth', _s1);
								uni.setStorageSync('extraUserInfo', _s2);
							}
						}
					});
				}
			},
			async initOrgList() {
				try {
					const param = {
						userId: this.userId
					};
					let res = await this.getList(param);
					uni.hideLoading();
					if (res[1].data.code === 200) {
						this.list = res[1].data.data;
					}
				} catch (e) {
					console.log(e);
				}
			},
			async getList(param) {
				try {
					uni.showLoading({
						mask: true
					});

					return await Promise.resolve(getOrgList(param));
				} catch (e) {
					console.log(e);
				}
			}
		}
	};
</script>
