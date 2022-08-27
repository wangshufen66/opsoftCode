<template>
	<view>
		<canvas v-show="showCanvas" :canvas-id="canvasId" :id="canvasId" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
		 :style="{'width':375+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchColumn" @touchmove="moveColumn"
		 @touchend="touchEndColumn"></canvas>
		<view v-show="!showCanvas" :style="{'width':cWidth+'px','height':cHeight+'px', 'lineHeight': cHeight+'px', 'textAlign': 'center'}">
			<u-loading size="60" mode="flower" style="margin-right: 12rpx;"></u-loading>重新渲染中...
		</view>
	</view>

</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js'
	var canvaColumn44 = null;
	var _self;
	export default {
		props: {
			showCanvas: {
				type: Boolean,
				default () {
					return true
				}
			},
			cWidth: {
				type: Number,
				default () {
					return 0
				}
			},
			cHeight: {
				type: Number,
				default () {
					return 0
				}
			},
			pixelRatio: {
				type: Number,
				default () {
					return 0
				}
			},
			series: {
				type: Array,
				default () {
					return []
				}
			},
			categories: {
				type: Array,
				default () {
					return []
				}
			},
			canvasId: {
				type: String,
				default () {
					return ''
				}
			},
		},
		onLoad() {
			_self = this
		},
		onReady() {
			this.getColumnData()
		},
		methods: {
			getColumnData() {
				const categories = this.categories
				const series = this.series
				this.showColumn(this.canvasId, {
					categories: categories,
					series: series
				});
			},
			showColumn(canvasId, chartData) {
				canvaColumn44 = new uCharts({
					$this: this,
					canvasId: canvasId,
					type: 'column',
					fontSize: 11,
					padding: [20, 15, 15, 15],
					legend: {
						show: true,
						position: 'bottom',
						float: 'center',
						itemGap: 30,
						padding: 5,
						margin: 5,
						//backgroundColor:'rgba(41,198,90,0.2)',
						//borderColor :'rgba(41,198,90,0.5)',
						borderWidth: 1
					},
					dataLabel: true,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					enableScroll: true,
					colors: ['#5B8FF9', '#5AD8A6'],
					xAxis: {
						disableGrid: true,
						itemCount: 6,
						scrollShow: true,
						scrollAlign: 'left',
					},
					yAxis: {
						//disabled:true
						gridType: 'solid',
						splitNumber: 4,
						// min: 10,
						// max: 180,
						format: (val) => {
							return val.toFixed(0)
						} //如不写此方法，Y轴刻度默认保留两位小数
					},
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: this.cWidth * this.pixelRatio * 0.65 / 6
						}
					},
				});


			},
			touchColumn(e) {
				canvaColumn44.scrollStart(e);
			},
			moveColumn(e) {
				canvaColumn44.scroll(e);
			},
			touchEndColumn(e) {
				canvaColumn44.scrollEnd(e);
				canvaColumn44.touchLegend(e, {
					animation: true,
				});
				canvaColumn44.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
		}
	}
</script>

<style>
</style>
