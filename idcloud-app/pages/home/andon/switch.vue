<template>
	<view class="andon-container">
		<view style="height: var(--window-top);"></view>
		<scroll-view :style="{height: scrollHeight + 'px'}" scroll-y>
			<view @click="handleClickSwitch(item)" class="action-container" v-for="(item,index) in listData" :key="index">
				<view class="action-wrapper">
					<text>{{item.number.substr(0,16)}}</text>
					<text v-if="item.number.length > 16">...</text>
				</view>
				<view class="action-wrapper" style="text-align: right;">
					<text>{{item.name.substr(0, 16)}}</text>
					<text v-if="item.name.length > 16">...</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	export default {
		name: "andonSwitch",
		components: {},
		mixins: [],
		props: {},
		data() {
			return {
				headHeight: 0,
				listData: []
			};
		},
		computed: {},
		watch: {},
		onReady() {
			this.listData = this.$store.state.switchPosition.data
		},

		methods: {
			async handleClickSwitch(item) {
				await this.$store.dispatch('setSwitchedPosition', item)
				uni.navigateBack({
					animationType: 'pop-out',
					animationDuration: 200
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.andon-container {
		height: 100%;
		background-image: linear-gradient(#458091, #252984)
	}

	.action-container {
		width: 100%;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		justify-content: space-between;

		text {
			font-size: 15px;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			color: #ffffff;
			line-height: 50px;
		}

		.action-wrapper {
			margin: 0 16px;
			width: 50%;
			white-space: nowrap;
		}
	}
</style>
