export const appList = [{
		industry: '基础应用',
		children: [{
				key: 'mobile_andon_system',
				name: 'Andon系统',
				img: '/static/andon/andon.png',
				router: "/pages/home/andon/main",
				//是否显示首页
				isCommon:false,
				//是否显示在可添加菜单
				display: false
			},
			{
				key: 'mobile_device_control',
				name: '设备控制',
				img: '/static/device/control.png',
				router: "/pages/home/control",
				isCommon:false,
				display: false
			},
			{
				key: 'mobile_device_monitor',
				name: '设备监测',
				img: '/static/device/monitor.png',
				router: "/pages/home/monitor",
				isCommon:false,
				display: false
			},
			{
				key: 'mobile_env_monitor',
				name: '环境监测',
				img: '/static/moduleIcons/envMonitor.png',
				router: "/pages/home/envMonitor",
				isCommon:false,
				display: false
			},
			{
				key: 'mobile_device_map',
				name: '设备地图',
				img: '/static/device/map.png',
				router: "/pages/home/map-archive",
				isCommon:false,
				display: false
			},
			{
				key: 'mobile_error_log',
				name: '报警日志',
				img: '/static/device/err.png',
				router: "/pages/home/errmsg",
				isCommon:false,
				display: false
			},
			{
				key: 'mobile_data_present',
				name: '数据展示',
				img: '/static/moduleIcons/present.png',
				router: "/pages/application/present/index",
				isCommon:true,
				display: true
			},
			{
				key: 'mobile_task',
				name: '设备加工任务',
				img: '/static/moduleIcons/shebeijiagongrenwu.png',
				router: "/pages/application/deviceProcess/index",
				isCommon:true,
				display: true
			}

		]
	},
	{
		industry: '设备监测',
		children: [{
				key: 'mobile_device_status_analysis',
				name: '设备运行分析',
				img: '/static/moduleIcons/shebeizhuangtaifenxi.png',
				router: "/pages/application/deviceStatus/index",
				isCommon:true,
				display: true
			},
			{
				key: 'mobile_device_usage',
				name: '利用率分析',
				img: '/static/moduleIcons/shebeiliyonglv.png',
				router: "/pages/application/deviceUsage/index",
				isCommon:true,
				display: true
			},
			{
				key: 'mobile_device_output',
				name: '设备产量分析',
				img: '/static/moduleIcons/shebeichanliang.png',
				router: "/pages/application/deviceOutput/index",
				isCommon:true,
				display: true
			},
			{
				key: 'mobile_product_analysis',
				name: '成品产量分析',
				img: '/static/moduleIcons/chenpinchanliangfenxi.png',
				router: "/pages/application/productAnalysis/index",
				isCommon:true,
				display: true
			},
			{
				key: 'mobile_malfunction_analysis',
				name: '故障分析',
				img: '/static/moduleIcons/guzhangshujufenxi.png',
				router: "/pages/application/malfunctionAnalysis/index",
				isCommon:true,
				display: true
			},
			{
				key: 'mobile_warning_info',
				name: '预警分析',
				img: '/static/moduleIcons/yujingxinxi.png',
				router: "/pages/application/warningInfoV2/index",
				isCommon:true,
				display: true
			}
		]
	},
	{
		industry: '设备管理',
		children: [{
				key: 'mobile_device_check',
				name: '设备点检',
				img: '/static/moduleIcons/dianjian.png',
				router: "/pages/application/deviceCheck/deviceCheck",
				isCommon:false,
				display: false
			},
			{
				key: 'mobile_device_maintenance',
				name: '设备保养',
				img: '/static/moduleIcons/baoyang.png',
				router: "/pages/application/deviceMaintenance/deviceMaintenance",
				isCommon:false,
				display: false
			},
			{
				key: 'mobile_device_repair',
				name: '设备维修',
				img: '/static/moduleIcons/weixiu.png',
				router: "/pages/application/deviceRepair/deviceRepair",
				isCommon:false,
				display: false
			},
		]
	},



	// {
	// 	industry: '光伏行业',
	// 	children: [{
	// 			name: '能源发电',
	// 			img: '/static/moduleIcons/icon1@3x.png',
	// 			router: "/pages/home/notReady"
	// 		}, {
	// 			name: '逆变控制',
	// 			img: '/static/moduleIcons/icon2@3x.png',
	// 			router: "/pages/home/notReady"
	// 		}, {
	// 			name: '光伏检测',
	// 			img: '/static/moduleIcons/icon3@3x.png',
	// 			router: "/pages/home/notReady"
	// 		},
	// 		{
	// 			name: 'DC转换',
	// 			img: '/static/moduleIcons/icon4@3x.png',
	// 			router: "/pages/home/notReady"
	// 		}, {
	// 			name: '售后服务',
	// 			img: '/static/moduleIcons/icon5@3x.png',
	// 			router: "/pages/home/notReady"
	// 		}
	// 	]
	// },
	// {
	// 	industry: '光通信行业',
	// 	children: [{
	// 		name: '光路传输',
	// 		img: '/static/moduleIcons/icon6@3x.png',
	// 		router: "/pages/home/notReady"
	// 	}, {
	// 		name: '波分复用',
	// 		img: '/static/moduleIcons/icon7@3x.png',
	// 		router: "/pages/home/notReady"
	// 	}, {
	// 		name: '光纤生产',
	// 		img: '/static/moduleIcons/icon8@3x.png',
	// 		router: "/pages/home/notReady"
	// 	}]
	// },
	// {
	// 	industry: '汽车行业',
	// 	children: [{
	// 		name: '零件检修',
	// 		img: '/static/moduleIcons/icon9@3x.png',
	// 		router: "/pages/home/notReady"
	// 	}]
	// },
	// {
	// 	industry: '铸造行业',
	// 	children: [{
	// 		name: '浇注系统',
	// 		img: '/static/moduleIcons/icon10@3x.png',
	// 		router: "/pages/home/notReady"
	// 	}, {
	// 		name: '补缩系统',
	// 		img: '/static/moduleIcons/icon11@3x.png',
	// 		router: "/pages/home/notReady"
	// 	}, {
	// 		name: '激冷系统',
	// 		img: '/static/moduleIcons/icon12@3x.png',
	// 		router: "/pages/home/notReady"
	// 	}]
	// }
]
