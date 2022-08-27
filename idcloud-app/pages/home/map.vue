<template>
	<view>
		<!-- 		<picker mode="selector" @change="bindPickerChange" :value="index" :range="array">
			<view class="uni-input">{{ array[index] }}</view>
		</picker> -->
		<view>
			<map
				id="deviceMap"
				ref="deviceMap"
				:latitude="latitude"
				:include-points="map.center"
				:longitude="longitude"
				:markers="covers"
				:style="{ height: mapHeight, width: '750rpx' }"
				:scale="map.scale"
				@markertap="clickMarker"
			></map>
		</view>
	</view>
</template>

<script>
import { getMapData } from '@/api/deviceMap.js';
export default {
	data() {
		return {
			array: ['工厂', '车间', '设备'],
			index: 0,
			mapHeight: 0,
			showBadge: true,
			latitude: 0, //纬度，范围为-90~90，负数表示南纬
			longitude: 0, //经度，范围为-180~180，负数表示西经
			covers: [],
			map: {
				data: [],
				center: [],
				scale: 12
			}
		};
	},
	onReady() {
		// const query = uni.createSelectorQuery().in(this);
		const sysinfo = uni.getSystemInfoSync();
		this.mapHeight = sysinfo.windowHeight;
		// query
		// 	.select('#nav-bar')
		// 	.boundingClientRect(data => {
		// 		this.mapHeight = windowHeight - data.height + 'px';
		// 	})
		// 	.exec();

		this.getMapData();
	},
	onShow() {},
	methods: {
		clickMarker(data) {
			console.log(data);
		},
		async getMapData() {
			this.$refs.deviceMap;
			let dMap = uni.createMapContext('deviceMap', this);
			this.map.data = [];
			try {
				const param = {
					orgId: uni.getStorageSync('auth').orgId,
					ctrType: this.index + 1
				};
				let _res = await Promise.resolve(getMapData(param));
				if (_res[1].data.code !== 200) {
					uni.showToast({
						title: '请求失败 ' + _res[1].data.msg,
						icon: 'none',
						duration: 2000
					});
				} else {
					const res = _res[1].data.data;
					res.forEach(i => {
						if (i.ctrLat !== null && i.ctrLng !== null) {
							this.map.data.push(i);
						}
					});
					if (this.map.data.length === 0) {
						uni.showToast({
							title: '没有符合要求的数据点',
							icon: 'none'
						});
					} else {
						this.covers = [];
						this.map.center = [];
						this.map.data.forEach((i, index) => {
							this.covers.push({
								id: index + 1,
								title: i.ctrName,
								latitude: i.ctrLat,
								longitude: i.ctrLng,
								iconPath: '../../static/map/poi-marker-red.png'
							});
							this.map.center.push({
								latitude: i.ctrLat,
								longitude: i.ctrLng
							});
						});
						this.longitude = this.map.center[0].longitude;
						this.latitude = this.map.center[0].latitude;
						dMap.includePoints({
							points: this.map.center,
							padding: ['150']
						});
						this.map.scale = this.map.scale - 1;
					}
				}
			} catch (e) {}
		},
		bindPickerChange(data) {
			this.index = data.target.value;
			this.getMapData();
		},
		openMap() {
			//点击地图

			uni.openLocation({
				latitude: this.latitude,

				longitude: this.longitude,

				name: '苏州创意产业园',

				address: '苏州创意产业园'
			});
		},
		Back() {
			this.$com.pageBack();
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #ffffff;
}

map {
	width: 100%;
	height: 600px;
}
</style>
