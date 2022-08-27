<template>
	<view class="container">
		<view class="list-wrapper">

			<view class="list-item">
				<view style="display: flex;">
					<view style="margin-left: 20px;" class="column-center"><text>原生时间选择器</text></view>
				</view>
				<view class="column-center right15">
					<u-switch @change="useNativeTimePickerChange" size="45" v-model="$store.state.config.data.useNativeTimePicker"></u-switch>
				</view>
			</view>
			

		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {};
		},
		methods: {
			useNativeTimePickerChange(n) {
				this.$store.dispatch('setSystemConfig', {
					configName: 'useNativeTimePicker',
					data: n
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	.center {
		display: flex;
		justify-content: center;
	}

	.list-wrapper {
		height: 120px;
		border-top: #f2f2f2 1px solid;

		text {
			font-size: 16px;
			color: #232323;
		}

		.list-item {
			width: 100%;
			height: 60px;
			border-bottom: #f2f2f2 1px solid;
			display: flex;
			justify-content: space-between;

			.inner-image {
				width: 25px;
				height: 25px;
				margin-right: 8px;
				margin-left: 15px;
			}
		}
	}

	.list-space-between {
		display: flex;
		justify-content: space-between;
	}

	.right15 {
		margin-right: 15px;
	}

	.column-center {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.title-wrapper {
		width: 100%;
		text-align: center;

		image {
			width: 72px;
			height: 72px;
			margin-bottom: 4px;
		}

		font-size: 16px;
	}
</style>
