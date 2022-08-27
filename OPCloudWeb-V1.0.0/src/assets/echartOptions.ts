export default {
    option: {
        // backgroundColor: '#100c2a',
        title: {
            text: '产能分析图',
            left: '10px',
            top: '15px',
            fontSize: '14px',
            textStyle: {
                color: '#000'
            }
        },
        darkMode: true,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['最高产能', '最低产能'],
            top: '15px',
            left: '160px',
            textStyle: {
                color: '#000'
            }
        },
        grid: {
            left: '12%',
            right: '12%',
            top: '28%',
            bottom: '12%',
            containLabel: false,
        },
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: ['6月1日', '6月6日', '6月11日', '6月16日', '6月21日', '6月26日', '7月1日']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} '
            }
        },
        series: [
            {
                name: '最高产能',
                type: 'bar',
                data: [10, 11, 13, 11, 12, 12, 9],
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            },
            {
                name: '最低产能',
                type: 'bar',
                data: [4, 2, 1, 5, 3, 2, 0],
                markPoint: {
                    data: [
                        { name: '周最低', value: 1, xAxis: 1, yAxis: 1 }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' },
                        [{
                            symbol: 'none',
                            x: '90%',
                            yAxis: 'max'
                        }, {
                            symbol: 'circle',
                            label: {
                                position: 'start',
                                formatter: '最大值'
                            },
                            type: 'max',
                            name: '最高点'
                        }]
                    ]
                }
            }
        ]
    },

    option2: {
        // backgroundColor: '#100c2a',
        title: {
            text: '不良原因分布图',
            left: '10px',
            top: '15px',
            fontSize: '14px',
            textStyle: {
                color: '#000'
            }
        },

        tooltip: {
            trigger: 'item'
        },
        grid: {
            left: '12%',
            right: '12%',
            top: '28%',
            bottom: '12%',
            // containLabel: false,
        },
        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [
            {
                name: '不良原因',
                type: 'pie',
                radius: '70%',
                center: ['50%', '60%'],
                data: [
                    { value: 335, name: '缺料' },
                    { value: 310, name: '工装夹具使用错误' },
                    { value: 274, name: '刀具型号不符' },
                    { value: 235, name: '刀具尺寸不符' },
                    { value: 400, name: '工艺参数设置错误' }
                ].sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    // color: 'rgba(255, 255, 255, 0.3)'
                    color: '#000'
                },
                labelLine: {
                    lineStyle: {
                        // color: 'rgba(255, 255, 255, 0.3)'
                        color: '#000'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                },
                itemStyle: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },

                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    },
    option3: {
        // backgroundColor: '#100c2a',
        title: {
            text: '产量趋势图',
            left: '10px',
            top: '15px',
            fontSize: '14px',
            textStyle: {
                color: '#000'
            }

        },
        tooltip: {},
        grid: {
            left: '12%',
            right: '12%',
            top: '28%',
            bottom: '12%',
            containLabel: false,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['6月1日', '6月6日', '6月11日', '6月16日', '6月21日', '6月26日', '7月1日']
        },

        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'graph',
                layout: 'none',
                coordinateSystem: 'cartesian2d',
                symbolSize: 40,
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                data: [712, 822, 631, 1435, 644, 718, 1838],
                links: [
                    {
                        "source": 0,
                        "target": 1
                    },
                    {
                        "source": 1,
                        "target": 2
                    },
                    {
                        "source": 2,
                        "target": 3
                    },
                    {
                        "source": 3,
                        "target": 4
                    },
                    {
                        "source": 4,
                        "target": 5
                    },
                    {
                        "source": 5,
                        "target": 6
                    }
                ],
                lineStyle: {
                    color: '#2f4554'
                }
            }
        ]
    },
    option4: {
        // backgroundColor: '#100c2a',
        title: {
            text: '产量趋势图',
            left: '10px',
            top: '15px',
            fontSize: '14px',
            textStyle: {
                color: '#000'
            }

        },
        tooltip: {},
        grid: {
            left: '12%',
            right: '12%',
            top: '28%',
            bottom: '12%',
            containLabel: false,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['6月1日', '6月6日', '6月11日', '6月16日', '6月21日', '6月26日', '7月1日']
        },

        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: 'line',
                layout: 'none',
                coordinateSystem: 'cartesian2d',
                // symbolSize: 10,
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                data: [712, 822, 631, 1435, 644, 718, 1838],
                links: [
                    {
                        "source": 0,
                        "target": 1
                    },
                    {
                        "source": 1,
                        "target": 2
                    },
                    {
                        "source": 2,
                        "target": 3
                    },
                    {
                        "source": 3,
                        "target": 4
                    },
                    {
                        "source": 4,
                        "target": 5
                    },
                    {
                        "source": 5,
                        "target": 6
                    }
                ],
                lineStyle: {
                    color: '#2f4554'
                }
            }
        ]
    },

}