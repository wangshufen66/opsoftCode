<template>
  <div class="newslist">
    <div class="pageList-top">
      <el-form mode="topForm" :inline="true">
        <el-col :span="12">
          <el-form-item label="消息名称" @submit.prevent>
            <el-input type="text" v-model="topForm.title" @keyup.enter="getPageList" clearable></el-input>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select v-model="topForm.status" placeholder="请选择" clearable style="width: 100%">
              <el-option label="未发布" :value="0"></el-option>
              <el-option label="已发布" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="getPageList">点击搜索</el-button>
        <el-button type="primary" @click="addPage">添加消息</el-button>
      </el-form>
    </div>
    <el-table :data="pageData.tableData" style="height: 80%" v-loading="tableloading" height="400">
      <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
      <el-table-column prop="messageContent" label="内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="keywords" label="关键字" show-overflow-tooltip></el-table-column>
      <el-table-column prop="classify" label="分类"></el-table-column>
      <el-table-column prop="rank" label="等级"></el-table-column>
      <el-table-column prop="status" label="消息状态">
        <template v-slot="scope">
          <span>{{ scope.row.status == '0' ? '未发布' : '已发布' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="createBy" label="创建人"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button type="text" size="small" @click="pageEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="onDelRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
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
    
    <el-dialog v-model="visible" destroy-on-close :props="dictionaryItem.defaultProps">
      <template v-slot:title>
        <dialog-title title></dialog-title>
      </template>
      <el-form :model="addPageForm" ref="addPageRef" :rules="formRules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="addPageForm.title"
            placeholder="请输入标题"
            maxlength="50"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="messageContent">
          <el-input
            v-model="addPageForm.messageContent"
            type="textarea"
            rows="3"
            placeholder="请输入内容"
            maxlength="1000"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="addPageForm.keywords"
            placeholder="请输入关键字"
            maxlength="100"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-select v-model="addPageForm.classify" placeholder="请输入分类" style="width: 100%">
            <el-option
              v-for="classify in pageData.classifyData"
              :key="classify"
              :label="classify"
              :value="classify"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="rank">
          <el-select v-model="addPageForm.rank" placeholder="请选择" style="width: 100%">
            <el-option v-for="rank in pageData.rankData" :key="rank" :label="rank" :value="rank"></el-option>
            <!-- <el-option label="中" :value="1"></el-option>
            <el-option label="低" :value="1"></el-option>-->
          </el-select>
          <!-- <el-input type="number" v-model="addPageForm.rank" placeholder="请输入等级"></el-input> -->
        </el-form-item>
        <el-form-item label="消息状态" prop="status">
          <el-select v-model="addPageForm.status" placeholder="请选择" style="width: 100%">
            <el-option label="未发布" :value="0"></el-option>
            <el-option label="已发布" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getNewsList,
  getNewsInfoById,
  delNewsInfoById,
  updateNewsInfoById,
  addNewsList,
  getDictionary,
} from '@/api/homeApi/index';
import { ElMessage } from 'element-plus';
import { confirmBox, messageAlert } from '../../utils/utils';
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
  title: '',
  status: '',
});
const appItem = reactive({
  newsTypeList: [
    {
      newsType: '消息管理',
      id: 1,
    },
    // {
    //   newsType: "文章管理",
    //   id: 2,
    // },
  ],
});

//字典表
const dictionaryItem = reactive({
  dictionaryProp: {
    childList: 'childList',
    name: 'name',
  },
});
//获取字典表字段
// 获取模块下的消息数据
const getdictionaryList = () => {
  let para = {
    code: 'pageMessageClassify',
  };
  getDictionary(para).then((res: any) => {
    if (res.code == 200) {
      pageData.classifyData = res.data;
    }
  });
  let param = {
    code: 'pageMessageRank',
  };
  getDictionary(param).then((res: any) => {
    if (res.code == 200) {
      pageData.rankData = res.data;
    }
  });
};

// tab切换
const tabChange = (item, i) => {
  itemIndex.value = i;
};
// 新增编辑时表单
const addPageForm = reactive({
  title: '',
  messageContent: '',
  keywords: '',
  classify: '',
  status: '',
  rank: '',
  id: undefined,
});
// 新增消息
const addPage = () => {
  formTitle.value = '新增消息';
  visible.value = true;
  addPageForm.title = '';
  addPageForm.messageContent = '';
  addPageForm.keywords = '';
  addPageForm.classify = '';
  addPageForm.status = '';
  addPageForm.rank = '';
  addPageForm.id = undefined;
};
// 编辑消息
const pageEdit = (row) => {
  formTitle.value = '编辑消息';
  visible.value = true;
  addPageForm.title = row.title;
  addPageForm.classify = row.classify;
  addPageForm.status = row.status;
  addPageForm.messageContent = row.messageContent;
  addPageForm.keywords = row.keywords;
  addPageForm.rank = row.rank;
  addPageForm.id = row.id;
};

const formRules = reactive({
  title: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  messageContent: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  classify: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  keywords: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  rank: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  status: [{ required: true, message: '该字段必填', trigger: 'blur' }],
});

const pageData = reactive({
  tableData: [],
  classifyData: [],
  rankData: [],
});

// filters: {//限制文本显示字数,超出部分用...代替
//     ellipsis (value) {
//       if (!value) return ''
//       if (value.length > 25) {
//         return value.slice(0,25) + '...'//0:下标,从第一个字开始显示,50:显示字数,多余用...代替
//       }
//       return value
//     }
//   }
const onSubmitForm = () => {
  addPageRef.value.validate((valid: boolean) => {
    if (valid) {
      let para = Object.assign({}, addPageForm);
      if (para.id) {
        updateNewsInfoById(para).then((res: any) => {
          if (res.code == 200) {
            messageAlert('success', res.msg)
            visible.value = false;
            getPageList();
          }
        });
      } else {
        addNewsList(para).then((res: any) => {
          if (res.code == 200) {
            messageAlert('success', res.msg)
            visible.value = false;
            getPageList();
          }
        });
      }
    } else {
      return false;
    }
  });
};
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
  tableloading.value = true;
  let para = {
    // params: topForm,
    // pageRequest: pageRequest,
    title: topForm.title,
    status: topForm.status,
    current_page: pageRequest.pageIndex,
    page_size: pageRequest.pageSize,
  };
  getNewsList(para).then((res: any) => {
    if (res.code == 200) {
      pageData.tableData = res.data.records;
      total.value = res.data.total;
    }
    tableloading.value = false;
  });
};
// 根据id删除消息
const onDelRow = (row) => {
  let params: any[] = [];
  params.push(row);
  confirmBox('删除数据', async () => {
    const res = await delNewsInfoById(params);
    if (res.code == 200) {
      messageAlert('success', '删除成功');
      getPageList();
    }
  });
};

onMounted(() => {
  getPageList();
  getdictionaryList();
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/newslist.scss";
</style>
