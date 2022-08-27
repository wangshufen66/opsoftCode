<template>
	<view class="page">
		<view :style="{ height: 'var(--status-bar-height)', backgroundColor: '#0585f2' }"></view>
		<view>
			<uni-nav-bar backgroundColor="#0585f2" color="#fff">
				<view slot="left">
					<view class="bar-left-title">所有应用</view>
				</view>
				<view slot="right" class="position"></view>
			</uni-nav-bar>
		</view>
		<scroll-view v-if="hasScroll" scroll-y :style="{ height: this.scrollHeight - 44 + 'px' }">
			<!-- 应用图标 -->
			<view class="main" v-for="(item, index) in menuList" :key="index" style="padding-top:5px;">
				<view v-if="item.children.length" class="m-title">
					<text class="title" decode="true">&nbsp;{{ item.industry }}</text>
				</view>
				<view class="example-body">
					<uni-grid :column="4" :show-border="false" :square="false">
						<uni-grid-item v-for="(subitem, subindex) in item.children" :key="subindex">
							<view v-if="subitem.display" class="grid-item-box" @click="pageNavigate(subitem.router, subitem.name)">
								<image class="image" :src="subitem.img" />
								<text class="text">{{ subitem.name.substr(0, 8) }}</text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
	import {
		appList
	} from '@/common/js/appListConfig.js';
	export default {
		components: {
			uniGrid,
			uniGridItem
		},
		watch: {
			'$store.state.auth.data': {
				handler(n) {
					if (n.length > 0) {
						n.forEach(i => {
							this.menuList.forEach(k => {
								k.children.forEach(j => {
									if (j.key == i.name) {
										j.display = true
									}
								})
							})
						})
						this.menuList.forEach(i => {
							i.children = i.children.filter(k => k.display)

						})
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				hasScroll: true,
				showBadge: true,
				menuList: JSON.parse(JSON.stringify(appList))
			};
		},
		methods: {
			pageNavigate(url, name) {
				if (url) {
					getApp().globalData.moduleName = name
					uni.navigateTo({
						animationType: 'zoom-fade-out',
						animationDuration: 200,
						url: url,
						success: res => {},
						fail: (e) => {
							console.log(e);
						},
						complete: () => {}
					});
				}
			}
		}
	};
</script>

<style>
	@import url('@/common/css/icon.css');

	.page {
		background-color: #fff;
	}

	.title {
		font-size: 15px;
		margin-top: 10px;
	}

	.bar-left-title {
		width: 100px;
		font-size: 16px;
		/* 相对偏移 */
		position: relative;
		left: 8px;
	}
</style>
