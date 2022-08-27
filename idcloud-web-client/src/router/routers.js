/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-10 13:24:46
 * @LastEditTime: 2019-08-10 15:29:19
 * @LastEditors: Please set LastEditors
 */
import Main from "@/components/main";
import Adaptor from "@/view/iot-hub/secondAdaptor/index";

/**
 * IDCLOUD中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *
 *  access: (null) true标识需要验证权限，false表示所有用户都可以访问，不会进行权限检查，父级路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

// ---------  换成懒加载式写法  19-12-16  cc------------

export default [
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Login - 登录",
      access: false,
      hideInMenu: true
    },
    component: resolve => require(["@/view/login/login-reg.vue"], resolve)
  },
  {
    path: "/",
    name: "_home",
    redirect: "/home",
    meta: {
      hideInMenu: true,
      access: false,
      notCache: true
    },
    component: Main,
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          hideInMenu: true,
          access: false,
          title: "首页",
          notCache: true,
          icon: "md-home"
        },
        component: resolve => require(["@/view/home/home.vue"], resolve)
      }
    ]
  },
  /* 用户界面 */
  // 设备监控
  {
    path: "/device_management",
    name: "device_management",
    meta: {
      iconType: "custom",
      icon: "custom-full shebeijiankong",
      access: true,
      title: "设备监测"
    },
    component: Main,
    children: [
      {
        path: "device_monitor",
        name: "device_monitor",
        meta: {
          title: "设备监测",
          access: true
        },
        component: resolve =>
          require(["@/view/device-watch/device/index.vue"], resolve)
      },
      {
        path: "alarm_log",
        name: "alarm_log",
        meta: {
          title: "故障预警",
          access: true
        },
        component: Adaptor,
        children: [
          {
            path: "transfinite_log",
            name: "transfinite_log",
            meta: {
              title: "超限预警",
              access: true
            },
            component: resolve =>
              require(["@/view/device-watch/transfiniteLog.vue"], resolve)
          },
          {
            path: "warning_log",
            name: "warning_log",
            meta: {
              title: "预警日志",
              access: true
            },
            component: resolve =>
              require(["@/view/device-watch/warningLog.vue"], resolve)
          },
          {
            path: "fault_log",
            name: "fault_log",
            meta: {
              title: "故障日志",
              access: true
            },
            component: resolve =>
              require(["@/view/device-watch/faultLog.vue"], resolve)
          }
        ]
      },
      // 设备控制
      {
        path: "/device_control",
        name: "device_control",
        meta: {
          // iconType: 'custom',
          // icon: 'custom-full shebeikongzhi-01',
          access: true,
          title: "设备控制"
        },
        component: Adaptor,
        children: [
          {
            path: "remote_control",
            name: "remote_control",
            meta: {
              title: "远程控制",
              access: true
            },
            component: resolve =>
              require(["@/view/device-control/remoteControl.vue"], resolve)
          },
          {
            path: "event_execute",
            name: "event_execute",
            meta: {
              title: "事件执行",
              access: true
            },
            component: resolve =>
              require(["@/view/device-control/eventExecute.vue"], resolve)
          },
          {
            path: "fault_execute",
            name: "fault_execute",
            meta: {
              title: "故障通知",
              access: true
            },
            component: resolve =>
              require(["@/view/device-control/faultNotice.vue"], resolve)
          }
        ]
      },
      {
        path: "container",
        name: "container",
        meta: {
          title: "容器管理",
          access: true
        },
        component: resolve =>
          require(["@/view/device-watch/container/index.vue"], resolve)
      }
    ]
  },
  // 设备维保
  {
    path: "/equipment_maintenance",
    name: "equipment_maintenance",
    meta: {
      iconType: "custom",
      icon: "custom-full shebeiweibao-01",
      access: true,
      title: "设备维保"
    },
    component: Main,
    children: [
      {
        path: "device_archives",
        name: "device_archives",
        meta: {
          title: "设备档案",
          access: true
        },
        component: resolve =>
          require(["@/view/device_management/deviceArchive.vue"], resolve)
      },
      {
        path: "maintenance_plan",
        name: "maintenance_plan",
        meta: {
          title: "维保方案",
          access: true
        },
        component: resolve =>
          require(["@/view/device_management/maintenancePlan.vue"], resolve)
      },
      {
        path: "device_repair",
        name: "device_repair",
        meta: {
          title: "设备维修",
          access: true
        },
        component: resolve =>
          require(["@/view/device_management/deviceRepair.vue"], resolve)
      },
      {
        path: "device_check",
        name: "device_check",
        meta: {
          title: "设备点检",
          access: true
        },
        component: resolve =>
          require(["@/view/device_management/deviceCheck.vue"], resolve)
      },
      {
        path: "device_maintain",
        name: "device_maintain",
        meta: {
          title: "设备保养",
          access: true
        },
        component: resolve =>
          require(["@/view/device_management/deviceMaintain.vue"], resolve)
      },
      {
        path: "spare_management",
        name: "spare_management",
        meta: {
          title: "备件管理",
          access: true
        },
        component: resolve =>
          require(["@/view/device_management/partManagement.vue"], resolve)
      }
    ]
  },
  // 生产管理
  {
    path: "/production_management",
    name: "production_management",
    meta: {
      iconType: "custom",
      icon: "custom-full shengchanguanli-01",
      access: true,
      title: "生产管理"
    },
    component: Main,
    children: [
      {
        path: "production_plan",
        name: "production_plan",
        meta: {
          title: "生产订单",
          access: true
        },
        component: resolve =>
          require(["@/view/productionManagement/productionPlan.vue"], resolve)
      },
      {
        path: "equipment_process_task",
        name: "equipment_process_task",
        meta: {
          title: "设备加工任务",
          access: true
        },
        component: resolve =>
          require([
            "@/view/productionManagement/equipmentProcessTask.vue"
          ], resolve)
      },
      {
        path: "quality_detect",
        name: "quality_detect",
        meta: {
          title: "质量检测",
          access: true
        },
        component: resolve =>
          require(["@/view/productionManagement/qualityDetect.vue"], resolve)
      },
      {
        path: "device_run",
        name: "device_run",
        meta: {
          title: "设备运行维护",
          access: true
        },
        component: resolve =>
          require(["@/view/productionManagement/deviceRun.vue"], resolve)
      },
      {
        path: "device_error",
        name: "device_error",
        meta: {
          title: "设备故障维护",
          access: true
        },
        component: resolve =>
          require(["@/view/productionManagement/deviceError.vue"], resolve)
      }
    ]
  },
  // 大屏管理
  {
    path: "/dashboard",
    name: "dashboard",
    meta: {
      iconType: "custom",
      icon: "custom-full kanbanguanli-01",
      access: true,
      title: "大屏管理"
    },
    component: Main,
    children: [
      {
        path: "dashboard_main",
        name: "dashboard_main",
        meta: {
          title: "全部大屏",
          access: true
        },
        component: resolve => require(["@/view/dashboard/manage.vue"], resolve)
      },
      {
        path: "dashboard_template",
        name: "dashboard_template",
        meta: {
          title: "模板管理",
          access: true
        },
        component: resolve =>
          require(["@/view/dashboard/template.vue"], resolve)
      }
    ]
  },
  // 数据分析
  {
    path: "/data_analysis",
    name: "data_analysis",
    meta: {
      iconType: "custom",
      icon: "custom-full shebeikongzhi-01",
      title: "数据分析",
      access: true
    },
    component: Main,
    children: [
      {
        path: "data_analysis_device_running",
        name: "data_analysis_device_running",
        meta: {
          title: "设备运行分析",
          access: true
        },
        component: resolve =>
          require([
            "@/view/device-watch/dataAnalysisDeviceRunning.vue"
          ], resolve)
      },
      {
        path: "data_analysis_device_usage",
        name: "data_analysis_device_usage",
        meta: {
          title: "利用率分析",
          access: true
        },
        component: resolve =>
          require(["@/view/device-watch/dataAnalysisDeviceUsage.vue"], resolve)
      },
      {
        path: "data_analysis_material_produce",
        name: "data_analysis_material_produce",
        meta: {
          title: "物料产量分析",
          access: true
        },
        component: resolve =>
          require([
            "@/view/device-watch/dataAnalysisMaterialProduce.vue"
          ], resolve)
      },
      {
        path: "data_analysis_material_capacity",
        name: "data_analysis_material_capacity",
        meta: {
          title: "成品产量分析",
          access: true
        },
        component: resolve =>
          require([
            "@/view/device-watch/dataAnalysisMaterialCapacity.vue"
          ], resolve)
      },
      {
        path: "data_analysis_device_err",
        name: "data_analysis_device_err",
        meta: {
          title: "故障分析",
          access: true
        },
        component: resolve =>
          require(["@/view/device-watch/dataAnalysisDeviceErr.vue"], resolve)
      }
    ]
  },
  // 报表
  {
    path: "/report",
    name: "report",
    meta: {
      icon: "custom-icon icon-baobiaotongji",
      iconType: "custom",
      access: true,
      title: "报表统计"
    },
    component: Main,
    children: [
      {
        path: "runningStatics",
        name: "runningStatics",
        meta: {
          title: "设备运行统计",
          access: true
        },
        component: resolve =>
          require(["@/view/deviceReport/runningStatics.vue"], resolve)
      },
      {
        path: "usageRateStatics",
        name: "usageRateStatics",
        meta: {
          title: "设备利用率统计",
          access: true
        },
        component: resolve =>
          require(["@/view/deviceReport/usageRateStatics.vue"], resolve)
      },
      {
        path: "produceStatics",
        name: "produceStatics",
        meta: {
          title: "设备产量统计",
          access: true
        },
        component: resolve =>
          require(["@/view/deviceReport/produceStatics.vue"], resolve)
      },
      {
        path: "deviceCapacityStatics",
        name: "deviceCapacityStatics",
        meta: {
          title: "生产产能统计",
          access: true
        },
        component: resolve =>
          require(["@/view/deviceReport/deviceCapacityStatics.vue"], resolve)
      },
      {
        path: "deviceSummaryStatics",
        name: "deviceSummaryStatics",
        meta: {
          title: "设备综合统计",
          access: true
        },
        component: resolve =>
          require(["@/view/deviceReport/deviceSummaryStatics.vue"], resolve)
      },
      {
        path: "deviceMaintenanceStatics",
        name: "deviceMaintenanceStatics",
        meta: {
          title: "设备维保统计",
          access: true
        },
        component: resolve =>
          require(["@/view/deviceReport/deviceMaintenanceStatics.vue"], resolve)
      }
    ]
  },
  // IoT-Hub
  {
    path: "/iot_hub",
    name: "iot_hub",
    meta: {
      iconType: "custom",
      icon: "custom-full IOT-01",
      titleLength: "full",
      access: true,
      title: "IoT-Hub"
    },
    component: Main,
    children: [
      {
        path: "/box8302_adapter",
        name: "box8302_adapter",
        meta: {
          access: true,
          title: "云盒C8302"
        },
        component: Adaptor,
        children: [
          {
            path: "box8302_list",
            name: "box8302_list",
            meta: {
              title: "云盒清单",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/x8302boxList.vue"], resolve)
          },
          {
            path: "box8302_infopoints_config",
            name: "box8302_infopoints_config",
            meta: {
              title: "数据点配置",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/x8302boxPointConfig/index.vue"], resolve)
          },
          {
            path: "box8302_brand_type",
            name: "box8302_brand_type",
            meta: {
              title: "品牌型号库",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/x8302boxBrand.vue"], resolve)
          }
        ]
      },
      //新增云盒303
      {
        path: "/box8303_adapter",
        name: "box8303_adapter",
        meta: {
          access: true,
          title: "云盒C8303"
        },
        component: Adaptor,
        children: [
          {
            path: "box8303_list",
            name: "box8303_list",
            meta: {
              title: "云盒清单",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/x8303boxList.vue"], resolve)
          },

          {
            path: "box8303_brand_type",
            name: "box8303_brand_type",
            meta: {
              title: "品牌型号库",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/x8303boxBrand.vue"], resolve)
          }
        ]
      },

      {
        path: "/cnc_adaptor",
        name: "cnc_adaptor",
        meta: {
          access: true,
          title: "CNC适配器"
        },
        component: Adaptor,
        children: [
          {
            path: "cnc_list",
            name: "cnc_list",
            meta: {
              title: "CNC清单",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/cncList.vue"], resolve)
          },
          {
            path: "cnc_infopoints_config",
            name: "cnc_infopoints_config",
            meta: {
              title: "数据点配置",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/cncPointConfig/index.vue"], resolve)
          },
          {
            path: "cnc_brand_type",
            name: "cnc_brand_type",
            meta: {
              title: "品牌型号库",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/cncBrand.vue"], resolve)
          }
        ]
      },
      {
        path: "/mahr_adapter",
        name: "mahr_adapter",
        meta: {
          access: true,
          title: "马尔适配器"
        },
        component: Adaptor,
        children: [
          {
            path: "mahr_list",
            name: "mahr_list",
            meta: {
              title: "量具清单",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/mahrList.vue"], resolve)
          },
          {
            path: "mahr_infopoints_config",
            name: "mahr_infopoints_config",
            meta: {
              title: "数据点配置",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/mahrPointConfig/index.vue"], resolve)
          },
          {
            path: "mahr_brand_type",
            name: "mahr_brand_type",
            meta: {
              title: "品牌型号库",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/mahrBrand.vue"], resolve)
          }
        ]
      },
      {
        path: "/basic_config",
        name: "basic_config",
        meta: {
          access: true,
          title: "基础设置"
        },
        component: Adaptor,
        children: [
          {
            path: "info_points",
            name: "info_points",
            meta: {
              title: "信息点绑定",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/infoPoint.vue"], resolve)
          },
          {
            path: "connect_management",
            name: "connect_management",
            meta: {
              title: "数据通道管理",
              access: true
            },
            component: resolve =>
              require(["@/view/iot-hub/connectionManagement.vue"], resolve)
          }
        ]
      }
    ]
  },
  // 基础资料
  {
    path: "/base_management",
    name: "base_management",
    meta: {
      iconType: "custom",
      icon: "custom-full jichuziliao-01",
      access: true,
      title: "基础资料"
    },
    component: Main,
    children: [
      {
        path: "material",
        name: "material",
        meta: {
          title: "物料",
          access: true
        },
        component: resolve =>
          require(["@/view/factoryModel/material.vue"], resolve)
      },
      {
        path: "work_process",
        name: "work_process",
        meta: {
          title: "工序",
          access: true
        },
        component: resolve =>
          require(["@/view/basicData/prodProcess.vue"], resolve)
      },
      {
        path: "team",
        name: "team",
        meta: {
          title: "班组",
          access: true
        },
        component: resolve => require(["@/view/basicData/team.vue"], resolve)
      },
      {
        path: "department",
        name: "department",
        meta: {
          title: "部门",
          access: true
        },
        component: resolve =>
          require(["@/view/basicData/department.vue"], resolve)
      },
      {
        path: "clerk",
        name: "clerk",
        meta: {
          title: "员工",
          access: true
        },
        component: resolve => require(["@/view/basicData/clerk.vue"], resolve)
      },
      {
        path: "base_currency",
        name: "base_currency",
        meta: {
          title: "币别",
          access: true
        },
        component: resolve =>
          require(["@/view/basicData/currency.vue"], resolve)
      },
      {
        path: "unit",
        name: "unit",
        meta: {
          title: "计量单位",
          access: true
        },
        component: resolve => require(["@/view/basicData/unit.vue"], resolve)
      },
      {
        path: "cause",
        name: "cause",
        meta: {
          title: "不良原因",
          access: true
        },
        component: () => import("@/view/basicData/cause.vue")
      },
      {
        path: "customer",
        name: "customer",
        meta: {
          title: "客户",
          access: true
        },
        component: resolve =>
          require(["@/view/basicData/customer.vue"], resolve)
      },
      {
        path: "supplier",
        name: "supplier",
        meta: {
          title: "供应商",
          access: true
        },
        component: resolve =>
          require(["@/view/basicData/supplier.vue"], resolve)
      },
      {
        path: "warehouse",
        name: "warehouse",
        meta: {
          title: "仓库",
          access: true
        },
        component: resolve =>
          require(["@/view/basicData/warehouse.vue"], resolve)
      },
      {
        path: "warehousePosition",
        name: "warehousePosition",
        meta: {
          title: "仓位",
          access: true
        },
        component: resolve =>
          require(["@/view/basicData/warehousePosition.vue"], resolve)
      },
      {
        path: "additionalInfo",
        name: "additionalInfo",
        meta: {
          title: "辅助资料",
          access: true
        },
        component: resolve =>
          require(["@/view/basicData/additionalInfo.vue"], resolve)
      }
    ]
  },
  // 系统设置
  {
    path: "/system_set_up",
    name: "system_set_up",
    meta: {
      iconType: "custom",
      icon: "custom-full xitongshezhi-01",
      access: true,
      title: "系统设置"
    },
    component: Main,
    children: [
      {
        path: "bill_code_rules",
        name: "bill_code_rules",
        meta: {
          title: "单据编码规则",
          access: true
        },
        component: resolve =>
          require(["@/view/systemConfig/billCodeRules.vue"], resolve)
      },
      {
        path: "system_parameter",
        name: "system_parameter",
        meta: {
          title: "系统参数",
          access: true
        },
        component: resolve =>
          require(["@/view/systemConfig/systemParameter.vue"], resolve)
      },
      {
        path: "appearance_set_up",
        name: "appearance_set_up",
        meta: {
          title: "外观配置",
          access: true
        },
        component: resolve =>
          require(["@/view/systemConfig/appearance.vue"], resolve)
      }
    ]
  },
  // 环境监测
  {
    path: "/environmental_monitoring",
    name: "environmental_monitoring",
    meta: {
      iconType: "custom",
      icon: "custom-full huanjingjiance",
      access: true,
      title: "环境监测"
    },
    component: Main,
    children: [
      {
        path: "temperature_monitoring",
        name: "temperature_monitoring",
        meta: {
          title: "温度监测",
          access: true
        },
        component: resolve =>
          require([
            "@/view/environmentMonitor/temperatureMonitoring/index.vue"
          ], resolve)
      },
      {
        path: "humidity_monitoring",
        name: "humidity_monitoring",
        meta: {
          title: "湿度监测",
          access: true
        },
        component: resolve =>
          require([
            "@/view/environmentMonitor/humidityMonitoring/index.vue"
          ], resolve)
      },
      {
        path: "water",
        name: "water",
        meta: {
          title: "用水监测",
          access: true
        },
        component: Adaptor,
        children: [
          {
            path: "water_monitoring",
            name: "water_monitoring",
            meta: {
              title: "用水分析",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/waterUsageMonitoring/index.vue"
              ], resolve)
          },
          {
            path: "water_count",
            name: "water_count",
            meta: {
              title: "水量统计",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/waterCount/index.vue"
              ], resolve)
          }
        ]
      },
      {
        path: "electricity",
        name: "electricity",
        meta: {
          title: "用电监测",
          access: true
        },
        component: Adaptor,
        children: [
          {
            path: "electricity_monitoring",
            name: "electricity_monitoring",
            meta: {
              title: "电量分析",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/electronicUsageMonitor/index.vue"
              ], resolve)
          },
          {
            path: "electronic_count",
            name: "electronic_count",
            meta: {
              title: "电量统计",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/electronicCount/index.vue"
              ], resolve)
          }
        ]
      },
      {
        path: "air_pressure_monitoring",
        name: "air_pressure_monitoring",
        meta: {
          title: "用气监测",
          access: true
        },
        component: resolve =>
          require([
            "@/view/environmentMonitor/airPressureMonitoring/index.vue"
          ], resolve)
      },
      {
        path: "gas",
        name: "gas",
        meta: {
          title: "燃气监测",
          access: true
        },
        component: Adaptor,
        children: [
          {
            path: "gas_monitoring",
            name: "gas_monitoring",
            meta: {
              title: "燃气分析",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/gasMonitoring/index.vue"
              ], resolve)
          },
          {
            path: "gas_count",
            name: "gas_count",
            meta: {
              title: "燃气统计",
              access: true
            },
            component: resolve =>
              require(["@/view/environmentMonitor/gasCount/index.vue"], resolve)
          }
        ]
      },
      {
        path: "/environment_analysis",
        name: "environment_analysis",
        meta: {
          access: true,
          title: "查询分析"
        },
        component: Adaptor,
        children: [
          {
            path: "monitoring_point_list",
            name: "monitoring_point_list",
            meta: {
              title: "监测点清单",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/environmentAnalysis/list.vue"
              ], resolve)
          },
          {
            path: "monitoring_point_location",
            name: "monitoring_point_location",
            meta: {
              title: "监测点地图",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/environmentAnalysis/location.vue"
              ], resolve)
          },
          {
            path: "monitoring_point_type",
            name: "monitoring_point_type",
            meta: {
              title: "监测类型分析",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/environmentAnalysis/type.vue"
              ], resolve)
          },
          {
            path: "monitoring_point_fee",
            name: "monitoring_point_fee",
            meta: {
              title: "费用分析",
              access: true
            },
            component: resolve =>
              require([
                "@/view/environmentMonitor/environmentAnalysis/fee.vue"
              ], resolve)
          }
        ]
      },
      {
        path: "environment_fee",
        name: "environment_fee",
        meta: {
          title: "收费标准",
          access: true
        },
        component: resolve =>
          require(["@/view/environmentMonitor/environmentFee.vue"], resolve)
      }
    ]
  },
  // DNC
  {
    path: "/dnc",
    name: "dnc",
    meta: {
      iconType: "custom",
      icon: "custom-full DNC-01",
      access: true,
      title: "DNC"
    },
    component: Main,
    children: [
      {
        path: "program_control",
        name: "program_control",
        meta: {
          title: "程序管理",
          access: true
        },
        component: resolve =>
          require(["@/view/DNC/programControl/main.vue"], resolve)
      },
      {
        path: "version_control",
        name: "version_control",
        meta: {
          title: "版本管理",
          access: true
        },
        component: resolve =>
          require(["@/view/DNC/versionControl/main.vue"], resolve)
      },
      {
        path: "client_control",
        name: "client_control",
        meta: {
          title: "终端管理",
          access: true
        },
        component: resolve =>
          require(["@/view/DNC/clientControl/main.vue"], resolve)
      },
      {
        path: "dist_plan",
        name: "dist_plan",
        meta: {
          title: "分发方案",
          access: true
        },
        component: resolve => require(["@/view/DNC/distPlan/main.vue"], resolve)
      }
    ]
  },
  // 工厂建模
  {
    path: "/factory_model",
    name: "factory_model",
    meta: {
      iconType: "custom",
      icon: "custom-full gongchangjianmo-01",
      access: true,
      title: "工厂建模"
    },
    component: Main,
    children: [
      {
        path: "bom",
        name: "bom",
        meta: {
          title: "BOM",
          access: true
        },
        component: resolve => require(["@/view/factoryModel/bom.vue"], resolve)
      },
      {
        path: "resources",
        name: "resources",
        meta: {
          title: "资源",
          access: true
        },
        component: resolve =>
          require(["@/view/factoryModel/resources.vue"], resolve)
      },
      {
        path: "work_center",
        name: "work_center",
        meta: {
          title: "工作中心",
          access: true
        },
        component: resolve =>
          require(["@/view/factoryModel/workCenter.vue"], resolve)
      }
    ]
  },
  // esop
  {
    path: "/esop",
    name: "esop",
    meta: {
      iconType: "custom",
      icon: "custom-full ESOP-01",
      access: true,
      title: "E-SOP"
    },
    component: Main,
    children: [
      {
        path: "document_manager",
        name: "document_manager",
        meta: {
          title: "文档管理",
          access: true
        },
        component: resolve =>
          require(["@/view/esop/documentManger/index.vue"], resolve)
      },
      {
        path: "client_manager",
        name: "client_manager",
        meta: {
          title: "客户端管理",
          access: true
        },
        component: resolve =>
          require(["@/view/esop/clientManager/index.vue"], resolve)
      },
      {
        path: "case_manager",
        name: "case_manager",
        meta: {
          title: "方案管理",
          access: true
        },
        component: resolve =>
          require(["@/view/esop/caseManager/index.vue"], resolve)
      }
    ]
  },
  // Andon
  {
    path: "/andon",
    name: "andon",
    meta: {
      iconType: "custom",
      icon: "custom-full andengxitong-01",
      access: true,
      title: "Andon"
    },
    component: Main,
    children: [
      {
        path: "andon_info",
        name: "andon_info",
        meta: {
          title: "安灯信息",
          access: true
        },
        component: resolve =>
          require(["@/view/Andon/AndonInfo/main.vue"], resolve)
      },
      {
        path: "andon_warning",
        name: "andon_warning",
        meta: {
          title: "安灯预警",
          access: true
        },
        component: resolve =>
          require(["@/view/Andon/AndonAlarm/main.vue"], resolve)
      }
    ]
  },
  // 接口管理
  {
    path: "/interface_managementt",
    name: "interface_managementt",
    meta: {
      iconType: "custom",
      icon: "custom-full xitongjiekouguanli-01",
      access: true,
      title: "管理系统接口"
    },
    component: Main,
    children: [
      {
        path: "ERP",
        name: "ERP",
        meta: {
          title: "ERP接口",
          access: true
        },
        component: resolve =>
          require(["@/view/single-page/custom-page.vue"], resolve)
      },
      {
        path: "MES",
        name: "MES",
        meta: {
          title: "MES接口",
          access: true
        },
        component: resolve =>
          require(["@/view/single-page/custom-page.vue"], resolve)
      },
      {
        path: "universal_interface",
        name: "universal_interface",
        meta: {
          title: "通用接口",
          access: true
        },
        component: resolve =>
          require(["@/view/single-page/custom-page.vue"], resolve)
      }
    ]
  },
  // 系统管理
  {
    path: "/system_management",
    name: "system_management",
    meta: {
      iconType: "custom",
      icon: "custom-full xitongguanli-01",
      access: true,
      title: "系统管理"
    },
    component: Main,
    children: [
      {
        path: "business_management",
        name: "business_management",
        meta: {
          title: "企业管理",
          access: true
        },
        component: resolve =>
          require([
            "@/view/systemManagement/businessManagement/index.vue"
          ], resolve)
      },
      {
        path: "role_management",
        name: "role_management",
        meta: {
          title: "角色管理",
          access: true
        },
        component: resolve =>
          require(["@/view/systemManagement/roleManagement/index.vue"], resolve)
      },
      {
        path: "user_management",
        name: "user_management",
        meta: {
          title: "账户管理",
          access: true
        },
        component: resolve =>
          require(["@/view/systemManagement/userManagement/index.vue"], resolve)
      },
      {
        path: "org_authority_management",
        name: "org_authority_management",
        meta: {
          title: "组织权限管理",
          access: true
        },
        component: resolve =>
          require([
            "@/view/systemManagement/orgAuthorityManagement/index.vue"
          ], resolve)
      },
      {
        path: "department_management",
        name: "department_management",
        meta: {
          title: "部门管理",
          access: true
        },
        component: resolve =>
          require(["@/view/systemManagement/department.vue"], resolve)
      },
      {
        path: "clerk_management",
        name: "clerk_management",
        meta: {
          title: "员工管理",
          access: true
        },
        component: resolve =>
          require(["@/view/systemManagement/clerk.vue"], resolve)
      },
      {
        path: "menu_button_management",
        name: "menu_button_management",
        meta: {
          title: "菜单按钮维护",
          access: true
        },
        component: resolve =>
          require([
            "@/view/systemManagement/menuButtonManagement/index.vue"
          ], resolve)
      },
      {
        path: "system_log",
        name: "system_log",
        meta: {
          title: "系统日志",
          access: true
        },
        component: resolve =>
          require(["@/view/systemManagement/systemLog/index.vue"], resolve)
      }
    ]
  },
  //报错
  {
    path: "/401",
    name: "error_401",
    meta: {
      hideInMenu: true,
      access: false
    },
    component: resolve => require(["@/view/error-page/401.vue"], resolve)
  },
  {
    path: "/500",
    name: "error_500",
    meta: {
      hideInMenu: true,
      access: false
    },
    component: resolve => require(["@/view/error-page/500.vue"], resolve)
  },
  {
    path: "*",
    name: "error_404",
    meta: {
      hideInMenu: true,
      access: false
    },
    component: resolve => require(["@/view/error-page/404.vue"], resolve)
  }
];
