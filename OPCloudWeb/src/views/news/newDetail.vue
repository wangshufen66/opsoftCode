<template>
  <div class="container">
    <div class="left-newlist">
      <div class="newlist">
        <div class="title">消息通知</div>
        <div :class="activeIndex === index ? 'left-news active' : 'left-news'" v-for="(item, index) in homeItem.newsList" :key="index" :data="homeItem.newList" @click="changeActive(index)">
          <div class="news-text">
            <div class="text-desc">
              {{ item.title }}
            </div>
            <div class="news-date">
              {{ item.createTime }}
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <el-pagination layout="total, prev, pager, next" :total="total" :page-size="pageRequest.pageSize" :page-sizes="[10, 20, 30]" :current-page.sync="pageRequest.pageIndex" @size-change="handleSizeChange" @current-change="currentpage"></el-pagination>
      </div>
    </div>
    <div class="new-right-deatil">
      <div class="new-right-title title">
        {{ newInfo.title }}
      </div>
      <div class="new-right-createtime">发布时间：{{ newInfo.createTime }}</div>
      <div class="new-detail">
        <div class="newcontent">{{ newInfo.messageContent }}</div>
        <div class="prepage">
          <div class="pre-pagebutton">
            <el-button type="text" @click="preButton(activeIndex)" :disabled="activeIndex === 0">
              上一篇
            </el-button>
          </div>
          <div>
            <el-button type="text" @click="nextButton(activeIndex)" :disabled="activeIndex === activeIndex.value - 1">
              下一篇
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  getAppList,
  getNewsPublish,
  getNewsList,
  getNewsInfoById,
} from '@/api/homeApi/index';

const router = useRouter();

const total = ref<number>();

const route = useRoute();

const newInfo = reactive({
  createTime: '',
  title: '',
  id: '',
  messageContent: '',
});
// 分页器
const pageRequest = reactive({
  pageIndex: 1,
  pageSize: 6,
});

function handleSizeChange(val) {
  pageRequest.pageSize = val;
  getNews();
}
function currentpage(val) {
  pageRequest.pageIndex = val;
  getNews();
}

//当前页索引
const activeIndex = ref(0);

const handleCurrentChange = () => {
  getNews();
};

function nextButton(value) {
  if (value == homeItem.newsList.length - 1) return;
  activeIndex.value = value + 1;
  getNewDeatail(homeItem.newsList[activeIndex.value].id);
}
function preButton(value) {
  if (value == 0) return;
  activeIndex.value = value - 1;
  getNewDeatail(homeItem.newsList[activeIndex.value].id);
}
// 页面整体对象
let homeItem = reactive({
  newsList: [],
});

function changeActive(index) {
  activeIndex.value = index;
  getNewDeatail(homeItem.newsList[index].id);
}

const getNewDeatail = (value) => {
  let para = {
    id: value,
  };
  getNewsInfoById(para).then((res: any) => {
    if (res.code == 200) {
      (newInfo.title = res.data.title),
        (newInfo.createTime = res.data.createTime),
        (newInfo.messageContent = res.data.messageContent);
    }
  });
};

// const chartList = ref([]);

const getNews = async () => {
  let para = {
    current_page: pageRequest.pageIndex,
    page_size: pageRequest.pageSize,
  };
  const res = await getNewsPublish(para);

  if (res.code == 200) {
    const { records } = res.data;
    homeItem.newsList = records;
    total.value = res.data.total;
    const id = route.query.id;
    if (id) {
      const index = homeItem.newsList.findIndex((item: any) => {
        return item.id == id;
      });
      activeIndex.value = index;
      console.log(index);
    }
  }
  getNewDeatail(homeItem.newsList[activeIndex.value].id);
};

onMounted(() => {
  getNews();
  // handleCurrentChange();
});
</script>

<style lang="scss" scoped>
@import '@/styles/modules/newsdetail.scss';
</style>
