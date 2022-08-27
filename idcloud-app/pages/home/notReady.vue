<template>
	<view class="page">
		<view style="text-align: center; width: 100%;height: 300px; ">
			<text style="margin: auto 0; line-height: 300px;">该模块</text>
			<text style="margin: auto 6px; line-height: 300px;color: #007AFF;">{{ moduleName }}</text>
			<text style="margin: auto 0; line-height: 300px;">正在开发中， 敬请期待</text>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	onReady() {
		this.moduleName = getApp().globalData.moduleName;
	},
	data() {
		return {
			moduleName: ''
		};
	},
	methods: {}
};
</script>

<style lang="scss" scoped></style>
