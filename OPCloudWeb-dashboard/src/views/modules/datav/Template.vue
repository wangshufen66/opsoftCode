<template>
  <div class="app-main-content">
    <div class="template-list-cont">
      <div class="item-box" style="cursor: pointer" @click="handleCreate">
        <div class="item-box-top">
          <div class="item-box-top-img">
            <i class="el-icon-plus plus-icon" />
          </div>
        </div>
        <div class="item-box-bottom">
          <h4>新建模板</h4>
          <p>添加一个新的模板</p>
        </div>
      </div>
      <div class="item-box" v-for="item in tplList" :key="item.hash">
        <div class="item-box-top">
          <div class="item-box-top-img">
            <el-image style="height: 100%; width: 100%;" :src="item.imgUrl" fit="fill"></el-image>
          </div>
          <div class="item-box-top-icon">
            <i class="el-icon-edit" @click="handleEdit(item.hash)"></i>
            <i class="el-icon-delete" @click="handleDelete(item.hash)"></i>
          </div>
        </div>
        <div class="item-box-bottom">
          <h4 class="template-item-title">{{item.config.title}}</h4>
          <p>
            {{parseTimeStamp(item.timestamp) }}
            <span class="link-type" style="margin-left: 4px">{{ item.config.width + 'X' + item.config.height }}</span>
          </p>
        </div>
      </div>
    </div>

    <!--新建大屏-->
    <el-dialog :title="'新建模板'" :modal-append-to-body="false" :append-to-body="true" :visible.sync="dialogFormVisible">
      <el-form ref="TplForm" :model="dataForm" :rules="createTplRules" label-width="120px">
        <el-form-item :label="'模板名称'" prop="title">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item :label="'模板级别'">
          <el-select v-model="dataForm.level" class="filter-item" placeholder="请选择一个级别">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="dialogStatus===createSubmit()">{{ '创建' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import Charts from '@jiaminghi/charts';
import {
  fetchTemplateList,
  createTemplate,
  deleteTemplate,
} from '@/api/template';
import waves from '@/directive/waves'; // Waves directive
import { parseTimeStamp } from '@/utils/util';
import { getToken, setToken, setUserId, removeToken } from '@/utils/auth';
import Cookies from 'js-cookie';

const levelOptions = [
  { value: 0, text: '隐藏' },
  { value: 1, text: '公开' },
  { value: 2, text: '普通' },
  { value: 3, text: '中级' },
  { value: 4, text: '高级' },
];

const levelTypeKeyValue = levelOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.text;
  return acc;
}, {});

export default {
  name: 'TemplateManage',
  directives: { waves },
  filters: {
    levelFilter(v) {
      return levelTypeKeyValue[v];
    },
    fullImgUrl(url) {
      return process.env.BASE_API + url;
    },
  },

  data() {
    const validateTplName = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('模板名称不能为空'));
      } else {
        callback();
      }
    };

    return {
      option2: {
        title: {
          text: '剩余油量表00',
          style: {
            fill: '#fff',
          },
        },
        series: [
          {
            type: 'gauge',
            data: [{ name: 'itemA', value: 55 }],
            center: ['50%', '55%'],
            axisLabel: {
              formatter: '{value}%',
              style: {
                fill: '#fff',
              },
            },
            axisTick: {
              style: {
                stroke: '#fff',
              },
            },
            animationCurve: 'easeInOutBack',
          },
        ],
      },

      tableKey: 0,
      tplList: null,
      total: 0,
      tplListLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
      },
      levelOptions,
      dataForm: {},
      dialogFormVisible: false,
      dialogStatus: '',
      createTplRules: {
        name: [{ required: true, trigger: 'blur', validator: validateTplName }],
      },
    };
  },
  computed: {
    option() {
      return {
        series: [
          {
            type: 'pie',
            data: [
              { name: '监控系统', value: 93, radius: ['30%', '33%'] },
              { name: '收费系统', value: 65, radius: ['32%', '35%'] },
              { name: '通信系统', value: 32, radius: ['31%', '37%'] },
              { name: '供配电系统', value: 44, radius: ['31%', '32%'] },
              { name: '其它', value: 52, radius: ['32%', '35%'] },
            ],
            outsideLabel: {
              labelLineEndLength: 20,
              formatter: '{percent}%\n{name}',
              style: {
                fill: '#fff',
              },
            },
          },
          {
            name: 'decoration ring',
            type: 'pie',
            data: [{ value: 10, radius: ['50%', '53%'] }],
            outsideLabel: {
              show: false,
            },
            pieStyle: {
              fill: 'rgba(255, 255, 255, 0.2)',
            },
          },
          {
            name: 'decoration ring',
            type: 'pie',
            data: [{ value: 10, radius: ['45%', '46%'] }],
            outsideLabel: {
              show: false,
            },
            pieStyle: {
              fill: 'rgba(255, 255, 255, 0.2)',
            },
          },
        ],
        color: ['#00c0ff', '#3de7c9', '#fff', '#00c0ff', '#3de7c9', '#fff'],
      };
    },

    config() {
      return {
        radius: '40%',
        activeRadius: '45%',
        data: [
          {
            name: '周口',
            value: 55,
          },
          {
            name: '南阳',
            value: 120,
          },
          {
            name: '西峡',
            value: 78,
          },
          {
            name: '驻马店',
            value: 66,
          },
          {
            name: '新乡',
            value: 80,
          },
        ],
        digitalFlopStyle: {
          fontSize: 30,
        },
        showOriginValue: true,
      };
    },
  },
  // async created() {
  //   await window.addEventListener("message", this.receiveMessage, false);
  //   if (!Cookies.get("User-ID")) {
  //     await parent.postMessage(
  //       {
  //         data: "",
  //         type: "needUserId",
  //       },
  //       "*"
  //     );
  //   }
  // },
  mounted() {
    this.getTemplates();
  },
  methods: {
    async receiveMessage(val) {
      if (val.data.type === 'userId') {
        await this.$store.commit('SET_USER_ID', val.data.userId);
        await setUserId(val.data.userId);
      }
    },
    parseTimeStamp,
    getTemplates() {
      this.tplListLoading = true;
      fetchTemplateList()
        .then((response) => {
          this.tplList = response.data.items;
          this.total = response.data.total || 0;
          this.tplListLoading = false;

          setTimeout(() => {
            this.tplListLoading = false;
          }, 1 * 1000);
        })
        .catch(() => {
          setTimeout(() => {
            this.tplListLoading = false;
          }, 1 * 1000);
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getTemplates();
    },
    resetTemp() {
      this.dataForm = {
        name: '',
        isTemplate: true,
        about: '大屏模板',
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = '新建模板';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['TplForm'].clearValidate();
      });
    },
    createSubmit() {
      this.$refs['TplForm'].validate((valid) => {
        if (valid) {
          createTemplate(this.dataForm).then((response) => {
            // 跳转到编辑页面
            this.handleEdit(response.hash);
          });
        }
      });
    },
    handleDelete: function (hash) {
      deleteTemplate(hash).then((response) => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000,
        });
        // <!-- const index = this.list.indexOf(row) -->
        // <!-- this.list.splice(index, 1) -->
        this.getTemplates();
      });
    },
    handleEdit(hash) {
      this.$router.push({
        path: '/edit/dashboard/' + hash,
        query: {
          redirect: 'template',
        },
      });
    },
  },
};
</script>
<style>
.template-list-cont {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.item-box {
  width: 250px;
  height: 220px;
  margin: 0 20px 20px 0;
  box-sizing: border-box;
  border: 1px solid #eee;
  /*background:#eee;*/
}

.item-box:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.item-box-top {
  width: 100%;
  height: 150px;
  position: relative;
  border-bottom: 1px solid #eee;
}

.item-box-top-img {
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
  z-index: 0;
  background-color: #000;
}

.item-box-top-img img {
  width: 100%;
  height: 100%;
  display: block;
}

.item-box-top-icon {
  position: absolute;
  display: none;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding-top: 30%;
  color: #fff;
  font-size: 26px;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
}

.item-box-top-icon i {
  cursor: pointer;
}

.item-box-top:hover .item-box-top-img img {
  overflow: hidden;
  /*transform: scale(1.1, 1.1);*/
}

.item-box-top:hover .item-box-top-icon {
  display: block;
}

.plus-icon {
  font-size: 50px;
  margin-top: 20%;
  color: #666;
}

.item-box-bottom {
  padding: 0 10px;
}

.item-box-bottom h4 {
  font-size: 15px;
  margin: 15px 0 0 0;
  font-weight: normal;
}

.item-box-bottom p {
  font-size: 14px;
  margin: 6px 0 0 0;
  color: #999;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.template-item-title {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.box-card-component {
  width: 250px;
  margin-left: 8px;

  .box-card-header {
    position: relative;
    height: 150px;
    width: 150px;
    text-align: center;

    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;

      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }

  .box-card-operation {
    position: absolute;
    bottom: 0;
    height: 30px;
    width: 100%;
    // background-color: #999;
    display: none;
    z-index: 1000;
  }

  .box-card-operation i {
    color: #606266;
    margin: 0 7px;
    font-size: 1.5em;
    cursor: pointer;
  }

  .box-card-header:hover .box-card-operation {
    display: block;
  }

  .box-card-bottom {
    margin-top: 13px;
    line-height: 12px;
    font-size: 13px;
    color: #999;
  }
}
</style>
