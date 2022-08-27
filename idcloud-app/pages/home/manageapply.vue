<template>
	<view class="page">
		<scroll-view scroll-y class="d-position-bottom" :style="{ height: this.scrollHeight + 'px' }">
			<!-- 应用图标 -->
			<view class="main" style="padding-top:5px;">
				<view class="m-title"><text class="title" decode="true">&nbsp;常用应用</text></view>
				<view class="example-body">
					<uni-grid :column="4" :show-border="false" :square="false">
						<uni-grid-item v-for="(subitem, subindex) in childrenList" v-if="subitem.isCommon" :key="subindex">
							<view v-if="subitem.display" class="grid-item-box" @click="applySub(subitem)">
								<image class="image" :src="subitem.img" />
								<text class="text">{{ subitem.name.substr(0, 8) }}</text>
								<view class="grid-dot"><view class="grid-dot-img sub"></view></view>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box"><image class="image" src="../../static/com/diastema.png" mode="widthFix" /></view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
			<view class="main" v-for="(item, index) in menuList" :key="index">
				<view class="m-title">
					<text class="title" decode="true">&nbsp;{{ item.industry }}</text>
				</view>
				<view class="example-body">
					<uni-grid :column="4" :show-border="false" :square="false">
						<uni-grid-item v-for="(subitem, subindex) in item.children" :key="subindex">
							<view v-if="subitem.display" class="grid-item-box" @click="applyAdd(subitem)">
								<image class="image" :src="subitem.img" />
								<text class="text">{{ subitem.name.substr(0, 8) }}</text>
								<view class="grid-dot"><view class="grid-dot-img" :class="[subitem.isCommon ? 'success' : 'add']"></view></view>
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
import { appList } from '@/common/js/appListConfig.js';
export default {
	components: {
		uniGrid,
		uniGridItem
	},
	data() {
		return {
			showBadge: true,
			menuList: JSON.parse(JSON.stringify(appList)),
			// list: [],
			childrenList: []
		};
	},
	watch: {
		'$store.state.auth.data': {
			handler(n) {
				if (n.length > 0) {
					const list = uni.getStorageSync('frequestAppList');
					const flag = list === '' || list.length === 0;
					//页面storage中有frequestAppList
					if (!flag) {
						this.menuList = list;
					}
					
					this.refreshCount();
					this.readChildrenList();
					
					n.forEach(i => {
						this.menuList.forEach(k => {
							k.children.forEach(j => {
								if (j.key == i.name) {
									j.display = true;
								}
							});
						});
					});
					
					this.menuList.forEach(i => {
						i.children = i.children.filter(k => k.display);
					});
					//页面storage中没有frequestAppList
					if(flag){
						this.refreshChildrenList()
					}
				}
			},
			immediate: true
		}
	},
	onLoad() {
		// console.log(JSON.parse(JSON.stringify(appList)))
		// console.log(this.menuList, '111');
	},
	methods: {
		Back() {
			this.$com.pageBack();
		},
		readChildrenList() {
			let list = [];
			this.menuList.forEach(i => {
				i.children.forEach(k => {
					list.push(k);
				});
			});
			this.childrenList = list;
		},

		refreshChildrenList() {
			let list = [];
			this.menuList.forEach(i => {
				i.children.forEach(k => {
					list.push(k);
				});
			});
			this.childrenList = list;
			uni.setStorageSync('frequentApp', this.childrenList);
			uni.setStorageSync('frequestAppList', this.menuList);
		},
		refreshCount() {
			let count = 0;
			this.menuList.forEach(i => {
				i.children.forEach(k => {
					if (k.isCommon === true) {
						count++;
					}
				});
			});
		},
		pageNavigate(url) {
			if (url) {
				uni.navigateTo({
					url: url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		applySub(item) {
			this.menuList.forEach(i => {
				i.children.forEach(k => {
					if (k.name === item.name) {
						k.isCommon = false;
					}
				});
			});
			// this.comMenuCount--;
			this.refreshChildrenList();
		},
		applyAdd(item) {
			this.menuList.forEach(i => {
				i.children.forEach(k => {
					if (item.name === k.name && k.isCommon == false) {
						k.isCommon = true;
					}
				});
			});
			this.refreshChildrenList();
		}
	}
};
</script>

<style lang="scss" scoped>
@import url('@/common/css/icon.css');

.page {
	background-color: #f8f9f8;
}

.grid-dot {
	position: absolute;
	top: 5px;
	right: 5px;
}

.grid-dot-img {
	background-repeat: no-repeat;
	background-size: 100%;
	width: 15px;
	height: 15px;
	border-radius: 50%;
}

.sub {
	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAANlBMVEUAAAD/AAD/VVX/UFD/T0//UlL/Tk7/UVH/UFD/UVH/UVH/UVH/UVH/UVH/UVH/ZGT/0ND/4uIktzFxAAAADnRSTlMAAQ82NztLjqnV5PX2/sJXb90AAABpSURBVBjTbZBJCsAwDAPl7Kva/v+z3QJtguc4YCMJAMT4mFvL0RvBi0uVDzXZ14TSOegl3Feu8EexApP6X/Vk4CsnqkfkQkReVUYjt/0Y7BvZNKUcKu+VEEpUsXMhJ1rtC/uN48Zey4QnO80N0dpHw5sAAAAASUVORK5CYII=');
}

.add {
	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAP1BMVEUAAAAAAP8id/8mdv8ldP8ndf8ld/8od/8ndv8odf8od/8md/8ndv8ndv8ndf8ndv8+hf/F2v/G2v/b6P/5+/8G04gKAAAAD3RSTlMAAQ82NztLjqnV1eT19v7O3FwNAAAAf0lEQVQYGQXBiWEEMQwEIEbybf/1xo8CQdJVy3nvzhCstRrcsy/h+3UAc/efzvpWkCCVp7IaVED/Ur0CUiCrqxoA6KoGAKjVpEIs3oxVMACBdT4zj+UApx4AwKt3AYD7WjrAwOzTpgsMuPu1SRLA3L0190mBu/cmSLq6nffuDP8+DjlApN1skwAAAABJRU5ErkJggg==');
}

.success {
	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAhFBMVEUAAAD////d3d3Z2dnV1dXY2Nja2trZ2dnY2NjZ2dnY2NjX19fY2NjZ2dnY2NjY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHj4+Pk5OTn5+fo6Ojq6urr6+vs7Ozu7u7v7+/x8fH09PT29vb39/f5+fn7+/v8/Pz9/f3+/v7///9MnGoXAAAAD3RSTlMAAQ82NztLjqnV5PX19v66OP3BAAAAsklEQVQYGQXBCW5TMRQAwHnLT9pQWnH/M4LUhaLE/jYzgYjKbHOtc28C3dXgnOMkuHQHYM/5UNHHEQBRlsrjCICnH5dhZVUA1NvLjq7MBqhfx79vlZ08uy/i5/X+uchunq7jN7fbeh/oxOd6fo3rq48HqCprH5d46e8vMKqa6Xbp+/sCozKTRx3zzwnmLFHBWH8H2HOWncV+nMAcq+yQAdhzDsW5RII5xyAQUZltrnXuzX8031FAPnqGjQAAAABJRU5ErkJggg==');
}
</style>
