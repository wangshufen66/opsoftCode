<!-- uniapp目前版本在横竖屏切换后，所有rpx为单位的组件都会出现布局错乱的bug，无解 -->
<!-- 目前使用这个方式，横竖屏切换操作在这个垫片中操作，然后通过redirectTo刷新界面使rpx适配设备尺寸 -->
<!-- 之后接手的小伙伴，请关注uniapp官方是否对这个bug有新的解决方案，有的话可以换掉这个 -->
<template>
	<view class="content">
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad(val) {
			if (val.goto == 'webview') {
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/application/present/webview'
					})
				}, 500); 

			} else {
				setTimeout(() => {
					uni.redirectTo({
						url: "/pages/application/present/index?back=true",
					})
				}, 100);
			}




		},
		onUnload() {},
		methods: {}
	}
</script>
