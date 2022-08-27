<template>
  <div class="newslist">
    <div class="pageList-top">
      <el-form mode="topForm" :inline="true">
        <el-col :span="6">
          <el-form-item label="设备代码" @submit.prevent>
            <el-input
              type="text"
              v-model="topForm.containerNumber"
              @keyup.enter="getPageList"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备名称" @submit.prevent>
            <el-input
              type="text"
              v-model="topForm.containerName"
              @keyup.enter="getPageList"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间范围" @submit.prevent>
            <el-date-picker
              v-model="startEndTime.defaultTime2"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @calendarChange="calendarChange"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="getPageList">点击搜索</el-button>
      </el-form>
    </div>
    <el-table :data="pageData.tableData" style="height: 80%" v-loading="tableloading" height="400">
      <el-table-column prop="equipmentNumber" label="设备代码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="equipmentName" label="设备名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="startNum" label="开始计数值"></el-table-column>
      <el-table-column prop="endNum" label="结束计数值"></el-table-column>
      <el-table-column prop="count" label="产量"></el-table-column>
    </el-table>
    <div class="page-nation">
      <el-pagination
        style="margin-top: 20px"
        layout="total,sizes, prev, pager, next"
        :total="total"
        :page-size="pageRequest.pageSize"
        :page-sizes="[10, 20, 50]"
        :current-page.sync="pageRequest.pageIndex"
        @size-change="handleSizeChange"
        @current-change="currentpage"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getCountStatisticsPageList,
  updateNewsInfoById,
  addNewsList,
  getDictionary,
} from '@/api/homeApi/index';
import { ElMessage } from 'element-plus';
import { confirmBox, messageAlert } from '../../utils/utils';

import dayjs from 'dayjs'

const itemIndex = ref<number>(0);

const route = useRoute();

const total = ref<number>(0);

const router = useRouter();
const formTitle = ref<string>('新增消息');

// 是否显示弹框
const visible = ref<boolean>(false);
// 表格loading
const tableloading = ref<boolean>(false);

const addPageRef = ref<any>(null);
// 搜索条件表单
const topForm = reactive({
  "containerNumber": "",
  "containerName": "",
});

let startEndTime = reactive({
  defaultTime2: [
    dayjs(dayjs().format('YYYY-MM-DD') + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss'), dayjs(dayjs().format('YYYY-MM-DD') + ' 23:59:59').format('YYYY-MM-DD HH:mm:ss')
  ]
})

const pageData = reactive({
  tableData: [],
  classifyData: [],
  rankData: [],
});

// 分页器
const pageRequest = reactive({
  pageIndex: 1,
  pageSize: 15,
});

//分页
function handleSizeChange(val) {
  pageRequest.pageSize = val;
  getPageList();
}
function currentpage(val) {
  pageRequest.pageIndex = val;
  getPageList();
}
// 获取模块下的消息数据
const getPageList = () => {

  //时间间隔不能大于三天
  var spanDays = dayjs(startEndTime.defaultTime2[1]).diff(dayjs(startEndTime.defaultTime2[0]), 'days')
  if(spanDays>3)
  {
     messageAlert('error',"天数间隔不得大于3")
     return false
  }

  tableloading.value = true;
  let para = {
    ...topForm,

    "startTime": startEndTime.defaultTime2[0],
    "endTime": startEndTime.defaultTime2[1],


    current_page: pageRequest.pageIndex,
    page_size: pageRequest.pageSize,
  };
  getCountStatisticsPageList(para).then((res: any) => {
    if (res.code == 200) {
      pageData.tableData = res.data.list;
      total.value = res.data.total;
    }
    tableloading.value = false;
  });
};


onMounted(() => {
  getPageList();
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/newslist.scss";
</style>
