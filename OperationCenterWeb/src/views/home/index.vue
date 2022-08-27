<template>
    <div class="home">
        <div class="top-centent">
            <div class="scroll-area">
                <div class="scrollNewsList">
                    <div class="news-wrap">
                        <div
                            class="news-item"
                            v-for="(item,index) in scrollNewsListData"
                            :key="index"
                        >
                            <div class="newsicon">
                                <img src="../../assets/images/newicon.svg" />
                            </div>
                            <div class="item-date">{{ item.createTime.substring(0, 10) }}</div>
                            <div class="item-content">{{ item.title }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="link-area">
                <div class="module-wrap">
                    <div class="module-item" v-for="(item, index) in moduleName" :key="index">
                        <div class="svgicon">
                            <img class="svgiconimg" :src="item.imgurl" />
                        </div>
                        <div class="alinktest" v-if="!item.isPop">
                            <a
                                :href="item.site ? item.site : void 0"
                                :class="{ alink: !item.site }"
                                target="_blank"
                            >{{ item.name }}</a>
                        </div>
                        <el-popover v-else trigger="hover">
                            <template #reference>
                                <div style="color: #666;">{{ item.name }}</div>
                            </template>
                            <div>
                                <img
                                    style="width: 100%; height: 100%;"
                                    src="../../assets/images/qrcode.png"
                                />
                            </div>
                        </el-popover>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-content">
            <div class="tenant-statistics" id="tenant-statistics">
                <p>新增账套数统计</p>
            </div>
            <div class="register-statistics" id="register-statistics">
                <p>新注册用户数统计</p>
            </div>
            <!-- <div class="revenue-income" id="revenue-income"> -->
            <!-- <p>营收统计</p> -->
            <!-- </div> -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import echarts from '@/plugins/echarts';
import { getOrgCountList, getUserInfoCount, scrollNewsList } from "@/api/system"
import { getImageUrl } from '@/utils/utils';

// 登录页超链接
const moduleName = [
    {
        name: "云搭正式环境",
        imgurl: getImageUrl('yunda-main.svg'),
        site: "https://www.opcloud.cn/",
        isPop: false,
    },
    {
        name: "交付管理",
        imgurl: getImageUrl('delivery-manage.svg'),
        site: "http://demo.opcloud.com/",
        isPop: false,
    },
    {
        name: "云搭测试环境",
        imgurl: getImageUrl('yunda-test.svg'),
        site: "http://test.opcloud.com/",
        isPop: false,
    },
    {
        name: "云搭开发环境",
        imgurl: getImageUrl('yunda-dev.svg'),
        site: "http://dev.opcloud.com/",
        isPop: false,
    },
    {
        name: "云搭演示环境",
        imgurl: getImageUrl('yunda-demo.svg'),
        site: "https://demo.opsoft.com.cn/",
        isPop: false,
    },
    {
        name: "APP下载",
        imgurl: getImageUrl('app-download.svg'),
        site: "",
        isPop: true,
    },
    {
        name: "知识库",
        imgurl: getImageUrl('knowledge-base.svg'),
        site: "",
        isPop: false,
    },
    {
        name: "云搭看板",
        imgurl: getImageUrl('yunda-dashboard.svg'),
        site: "",
        isPop: false,
    },

];
const scrollNewsListData = ref<any[]>();
async function getscrollNewsList() {
    const res = await scrollNewsList({ currentPage: 1, pageSize: 100 });
    if (res.code == 200) {
        scrollNewsListData.value = res.data.records
    }
}
getscrollNewsList();

//新增账套数统计
const procinceData = ref<any[]>();
const monthAddNumberData = ref<any[]>();
const orgTotalData = ref<any[]>();
async function getOrgCountListData() {
    const res = await getOrgCountList();
    if (res.code == 200) {
        procinceData.value = res.data.map(m => (m.zoneName)).slice(0, 10).reverse();
        monthAddNumberData.value = res.data.map(m => (m.monthAddNumber)).slice(0, 10).reverse();
        orgTotalData.value = res.data.map(m => (m.orgTotal)).slice(0, 10).reverse();
    }
    const option = {
        title: {
            // text: "新增账套数统计",
        },
        tooltip: {},
        itemStyle: {
            // 阴影的大小
            shadowBlur: 200,
            // 阴影水平方向上的偏移
            shadowOffsetX: 0,
            // 阴影垂直方向上的偏移
            shadowOffsetY: 0,
            // 阴影颜色
            shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        color: ['#2B7FE4', '#64D97E'],
        legend: {
            data: ['总人数', '新增'],
            right: 100, //右边距
            top: 5, // 上边距
        },
        yAxis: {
            name: '地区',
            nameTextStyle: {
                padding: [0, 0, 0, 10]    // 四个数字分别为上右下左与原位置距离
            },
            axisLine: {
                lineStyle: {
                    color: '#00a2ff',
                },
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#323232',
                    fontSize: 12,
                },
            },
            data: procinceData.value,
        },
        xAxis: {
            name: '数量',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [60, 0, 0, 0]    // 四个数字分别为上右下左与原位置距离
            },
            nameGap: 20, //--与y轴距离
            // position: 'left',//--位置靠左
            axisLine: {
                lineStyle: {
                    color: '#00a2ff',
                },
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(0,162,255,0.2)',
                    width: 1,
                },
            },
        },
        series: [
            {
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            color: 'black',
                        },
                    },
                },
                name: '总人数',
                barWidth: '35%',
                type: 'bar',
                barGap: '-100%',
                data: orgTotalData.value,
            },
            {
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: 'black',
                        }
                    }
                },
                name: '新增',
                barWidth: '35%',
                type: 'bar',
                data: monthAddNumberData.value,
            },
        ],
    };

    const dom1 = document.getElementById("tenant-statistics");
    const myChart1 = echarts.init(dom1 as HTMLElement);
    if (option && typeof option === 'object') {
        myChart1.setOption(option);
    }
}
getOrgCountListData()
// 新注册用户数统计
const monthData = ref<any[]>();
const dingDingTotalData = ref<any[]>();
const pcTotalData = ref<any[]>();
const addTotalData = ref<any[]>();
async function getUserInfoCountData() {
    const res = await getUserInfoCount();
    if (res.code == 200) {
        monthData.value = res.data.map(m => (m.month)).reverse();
        dingDingTotalData.value = res.data.map(m => (m.dingDingTotal == 0 ? '' : m.dingDingTotal)).reverse();
        pcTotalData.value = res.data.map(m => (m.pcTotal == 0 ? '' : m.pcTotal)).reverse();
        addTotalData.value = res.data.map(m => (m.addTotal == 0 ? '' : m.addTotal)).reverse();
    }
    const labelOption = {
        show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
            name: {},
        },
    };
    const option2 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        color: ['#2B7FE4', '#64D97E', '#F6C638'],
        legend: {
            data: ['总数', '钉钉', 'PC'],
        },

        xAxis: [
            {
                name: '日期',
                type: 'category',
                axisTick: { show: false },
                data: monthData.value,
            },
        ],
        yAxis: [

            {
                name: '数量',
                type: 'value',
            },
        ],
        series: [
            {
                name: '总数',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                emphasis: {
                    focus: 'series',
                },
                data: addTotalData.value,
            },
            {
                name: '钉钉',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series',
                },
                data: dingDingTotalData.value,
            },
            {
                name: 'PC',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series',
                },
                data: pcTotalData.value,
            },
        ],
    };
    const dom2 = document.getElementById("register-statistics");
    const myChart2 = echarts.init(dom2 as HTMLElement);
    if (option2 && typeof option2 === 'object') {
        myChart2.setOption(option2);
    }
}
getUserInfoCountData()

</script>
<style lang="scss" scoped>
.alink {
    color: #000;
    cursor: auto;
}
@import "@/styles/modules/home.scss";
</style>