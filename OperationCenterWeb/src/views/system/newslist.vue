<template>
  <div class="newslist">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form :inline="true" @submit.prevent>
          <el-form-item label="标题">
            <el-input type="text" placeholder="请输入标题" v-model="searchForm.title" clearable></el-input>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select v-model="searchForm.status" clearable>
              <el-option
                v-for="item in allNewsStatus"
                :label="item.name"
                :value="item.code"
                ::key="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="button-wrap">
        <el-button type="primary" @click="onSerach">搜索</el-button>
        <el-button type="primary" @click="addPage">新增消息</el-button>
      </div>
    </div>

    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <!--通知范围  -->
      <template #col_userList="{ data }">
        <span>{{ inituserList(data.userList) }}</span>
      </template>

      <!-- 位置 -->
      <template #col_locationList="{ data }">
        <span>{{ initloactionList(data.locationList) }}</span>
      </template>
      <template #col_createTime="{ data }">
        <span>{{ formatTime(data.createTime) }}</span>
      </template>

      <template #operatColumn>
        <el-table-column label="操作" fixed="left" width="180">
          <template #default="scope">
            <el-button type="primary" plain size="small" @click="pageEdit(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="small" @click="onDelRow(scope.row)">删除</el-button>
            <!-- <el-button type="primary" size="small" @click="pageEdit(scope.row, false)">查看详情</el-button> -->
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <el-dialog v-model="visible" width="10%">
      <template v-slot:title>
        <DialogTitle :dialogTitle="formTitle"></DialogTitle>
      </template>
      <el-form :model="dataForm" ref="addPageRef" :rules="formRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="dataForm.title"
            placeholder="请输入标题"
            maxlength="50"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="dataForm.content"
            type="textarea"
            rows="3"
            placeholder="请输入内容"
            maxlength="1000"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keyWord">
          <el-input
            v-model="dataForm.keyWord"
            placeholder="请输入关键字"
            maxlength="100"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="type">
          <el-select v-model="dataForm.type" placeholder="请输入分类" style="width: 100%">
            <el-option
              v-for="item in allNewsClassification"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-select v-model="dataForm.level" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in allNewsLevel"
              :label="item.name"
              :value="item.code"
              ::key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in allNewsStatus"
              :label="item.name"
              :value="item.code"
              ::key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知范围" prop="selectedList">
          <el-select
            multiple
            v-model="dataForm.selectedList"
            placeholder="请选择公司"
            style="width: 100%;"
          >
            <el-option
              v-for="item in userList"
              :label="item.orgName"
              :key="item.orgId"
              :value="item.orgId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置" prop="locationedList">
          <el-select v-model="dataForm.locationedList" multiple style="width: 100%;">
            <el-option
              v-for="item in allNewsLocation"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间" prop="nextContactTime">
          <el-date-picker
            type="date"
            style="width: 100%;"
            v-model="dataForm.expireTime"
            placeholder="请选择到期时间"
            :disabled-date="disabledDate"
            clearable
          ></el-date-picker>
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
import { reactive, ref, onMounted, nextTick, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import tableColums from '@/config/tableConfig/newsList';
import {
  getNewsList,
  getNewsInfoById,
  delNewsInfoById,
  updateNewsInfoById,
  addNewsList,
  getOrgList,
  getDictionaryInfo
} from '@/api/system';
import { getUserInfo } from '@/api/system'
import { ElMessage } from 'element-plus';
import { confirmBox } from '../../utils/utils';
import DialogTitle from '@/components/dialogTitle/index.vue';
import { messageAlert, deepClone } from "@/utils/utils";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();
// const formTitle = ref<string>('添加消息');

//判断是否为编辑
const isEdit = ref<boolean>(true)
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? '编辑消息' : '新增消息';
});
const addPageRef = ref<any>(null);

// 是否显示弹框
const visible = ref<boolean>(false);
//通知范围下拉
const userList = ref<any>([]);
//列表配置项
const tableOption = reactive({
  tableData: [],
  tableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
  noTableRight: false,
});
const pagination = reactive({
  currentPage: 1,
  pageSize: 15
})

// 搜索条件表单
const searchForm = reactive({
  title: undefined,
  status: undefined,
});

const expireTimeDiC = ref<string>('')
//获取字典表过期时间
async function getExpireTime(e) {
  const params = {
    dictionaryCode: "expireTime",
    current: 1,
    size: 100,
  };
  const res = await getDictionaryInfo(params);
  if (res.code === 200) {
    expireTimeDiC.value = res.data.records.length > 0 && (res.data.records[0].code || '15');
  }
}
getExpireTime();

// 新增编辑时表单
const dataForm = ref({
  title: '',
  content: '',
  keyWord: '',
  status: '',
  level: '',
  type: '',
  orgId: '',
  newsId: '',
  id: undefined,
  createTime: '',
  locationList: [],//位置
  locationedList: [],
  selectedList: [],//通知范围(所有公司)
  userList: [],
  expireTime: '',//到期时间,默认15天
});


//涉及到下次联系时间的不可选过往时间
function disabledDate(time) {
  return time.getTime() < Date.now()
}
// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize, pageIndex } = options;
  pagination.pageSize = pageSize as number;
  pagination.currentPage = pageIndex as number
  getPageList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex, pageSize } = options;
  pagination.pageSize = pageSize as number;
  pagination.currentPage = pageIndex as number;
  getPageList();
}
const allNewsClassification = ref<[]>([]);
//获取字典表消息分类列表
async function getNewsClassification() {
  const params = {
    dictionaryCode: "newsClassification",
    current: 1,
    size: 100,
  };
  const res = await getDictionaryInfo(params);
  if (res.code === 200) {
    allNewsClassification.value = res.data.records;
  }
}
getNewsClassification();

const allNewsLevel = ref<[]>([]);
//获取字典表消息等级列表
async function getNewsLevel() {
  const params = {
    dictionaryCode: "newsLevel",
    current: 1,
    size: 100,
  };
  const res = await getDictionaryInfo(params);
  if (res.code === 200) {
    allNewsLevel.value = res.data.records;
  }
}
getNewsLevel();

const allNewsStatus = ref<[]>([]);
//获取字典表消息状态列表
async function getNewsStatus() {
  const params = {
    dictionaryCode: "newsStatus",
    current: 1,
    size: 100,
  };
  const res = await getDictionaryInfo(params);
  if (res.code === 200) {
    allNewsStatus.value = res.data.records;
  }
}
getNewsStatus();

const allNewsLocation = ref<[]>([]);
//获取字典表消息位置列表
async function getNewsLocationList() {
  const params = {
    dictionaryCode: "newsLocation",
    current: 1,
    size: 100,
  };
  const res = await getDictionaryInfo(params);
  if (res.code === 200) {
    allNewsLocation.value = res.data.records;
  }
}
getNewsLocationList();

// 新增消息
function addPage() {
  visible.value = true;
  isEdit.value = false;
  dataForm.value.id = undefined;
  dataForm.value.title = '';
  dataForm.value.content = '';
  dataForm.value.status = '';
  dataForm.value.keyWord = '';
  dataForm.value.level = '';
  dataForm.value.type = '';
  dataForm.value.selectedList = ['000'];
  dataForm.value.locationedList = [];
  dataForm.value.expireTime = dayjs().add(+expireTimeDiC.value, 'day').format("YYYY-MM-DD HH:mm:ss");
}

// 编辑消息
function pageEdit(row: any) {
  visible.value = true;
  isEdit.value = true;
  dataForm.value.id = row.id;
  dataForm.value.title = row.title;
  dataForm.value.content = row.content;
  dataForm.value.keyWord = row.keyWord;
  dataForm.value.status = row.status !== null ? row.status + '' : '';
  dataForm.value.level = row.level !== null ? row.level + '' : '';
  dataForm.value.type = row.type !== null ? row.type + '' : '';
  dataForm.value.expireTime = row.expireTime && dayjs(row.expireTime).format("YYYY-MM-DD 00:00:00");
  // val == false ? (formTitle.value = '查看详情信息') : (formTitle.value = '编辑消息')
  //通知范围回显
  if (row.locationList && row.locationList.length > 0) {
    dataForm.value.locationedList = row.locationList.map((item) => {
      return item.locationType + ''
    })
  }

  //角色的回显
  if (row.userList && row.userList.length > 0) {
    dataForm.value.selectedList = row.userList.map((item) => {
      return item.orgId
    })
  }

};

const formRules = reactive({
  title: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  messageContent: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  type: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  keyWord: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  level: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  status: [{ required: true, message: '该字段必填', trigger: 'blur' }],
  locationedList: [{ required: true, message: '请选择位置', trigger: 'blur' }],
  selectedList: [{ required: true, message: '请选择通知范围', trigger: 'blur' }],
});


function onSerach() {
  getPageList();
}
function onSubmitForm() {
  addPageRef.value.validate(async (valid: boolean) => {
    dataForm.value.userList = []
    dataForm.value.locationList = []
    for (let index = 0; index < dataForm.value.selectedList.length; index++) {
      const element = dataForm.value.selectedList[index];
      for (let i = 0; i < userList.value.length; i++) {
        const user = userList.value[i];
        if (element == user.orgId) {
          dataForm.value.userList.push({ orgId: user.orgId, newsId: dataForm.value.id, orgName: user.orgName })
        }
      }
    }
    for (let index = 0; index < dataForm.value.locationedList.length; index++) {
      const element = dataForm.value.locationedList[index];
      dataForm.value.locationList.push({ locationType: +element })
    }
    if (valid) {
      let para = Object.assign({}, dataForm.value);
      const res = para.id ? await updateNewsInfoById(para) : await addNewsList(para)
      if (res.code == 200) {
        ElMessage.success({
          message: res.msg,
          type: 'success',
        });
        visible.value = false;
        getPageList();
      }
    } else {
      return false;
    }
  });
};

//通知范围下拉列表
async function getUserList() {
  const res = await getOrgList();
  for (let index = 0; index < res.data.length; index++) {
    const element = res.data[index];
    element.id = element.id + ''
  }
  userList.value = res.data
}
// 获取消息数据
const getPageList = () => {
  tableOption.tableLoading = true;
  let params: any = { ...pagination, }
  if (searchForm.title) {
    params.title = searchForm.title
  }
  if (searchForm.status) {
    params.status = searchForm.status
  }

  getNewsList(params).then((res: any) => {
    if (res.code == 200) {
      tableOption.tableData = res.data.records.length > 0 && res.data.records.map((item) => {
        return {
          ...item,
          typeName: item.type != null && allNewsClassification.value.length > 0 && allNewsClassification.value.find((ele: any) => ele.code == item.type).name || '',
          levelName: item.level != null && allNewsLevel.value.length > 0 && allNewsLevel.value.find((ele: any) => ele.code == item.level).name || '',
          statusName: item.status != null && allNewsStatus.value.length > 0 && allNewsStatus.value.find((ele: any) => ele.code == item.status).name || '',
          expireTime: item.expireTime && item.expireTime.substring(0, 10)
        }
      })
      tableOption.total = res.data.total;
    }
    tableOption.tableLoading = false
  });
};

// 根据id删除消息
const onDelRow = (row) => {
  let params = {
    id: row.id,
    ...pagination
  };
  confirmBox('删除数据', async () => {
    const res = await delNewsInfoById(params);
    if (res.code == 200) {
      ElMessage.success('删除成功');
      getPageList();

    }

  });
};

//处理通知范围和位置中的数据
function inituserList(obj) {
  let str = ''
  if (obj) {
    for (let index = 0; index < obj.length; index++) {
      const element = obj[index];
      if (element.orgName) {
        str = str + ',' + element.orgName
      }
    }
    return str.substring(1, str.length)
  }

}
function initloactionList(obj) {
  let str = ''
  for (let index = 0; index < obj.length; index++) {
    const element = obj[index];

    if (element.locationType == '0') {
      str += ',' + '登录首页'
    }
    if (element.locationType == '1') {
      str += ',' + '通知中心'
    }
    if (element.locationType == '2') {
      str += ',' + '运营中台首页'
    }
  }
  return str.substring(1, str.length)
}
function formatTime(str) {
  if (!str) return '';
  return dayjs(str).format('YYYY-MM-DD HH:mm')
}

getUserList();

onMounted(() => {
  getPageList();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/system/newslist.scss";
</style>
