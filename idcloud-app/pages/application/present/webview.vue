<template>
	<view class="content">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	import kanbanUrl from '@/common/js/kbUrl.js'
	export default {
		data() {
			return {}
		},
		computed: {
			url() {
				return `${kanbanUrl()}/#/login?auth=true&token=${uni.getStorageSync('auth').token}&userId=${uni.getStorageSync('auth').orgId}&hash=${this.$store.state.dashboard.data.hash}&goto=/preview/`
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('landscape-primary');
			plus.navigator.setFullscreen(true);
			// #endif
		},
		onUnload() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary');
			plus.navigator.setFullscreen(false);
			// #endif
		},
		onBackPress(event) {
			this.$scope.$getAppWebview().children()[0].close()
			this.$nextTick(() => {
				uni.navigateTo({
					url: '/pages/application/present/jumper?goto=present'
				})
			})
		},
		methods: {}
	}
</script>
