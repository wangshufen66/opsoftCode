<template>
  <div>
    <vue-page-designer :page="config" :widgets="widget" :upload="handleUpload" :upload-option="uploadOption" @save="handleSave" @preview="handlepreview" @quit="handleQuit" />

    <el-dialog title="提示" :visible.sync="dialogVisible" width="300">
      <span>直接退出将不会保存您的修改</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="getBack">直接退出</el-button>
        <el-button type="primary" @click="saveAndQuit">保存并退出</el-button>
      </span>
    </el-dialog>
    <el-dialog title="预览" :visible.sync="previewDialog" width="90%">
      <!-- <div class="yulan"> -->
      <vue-page-preview :page="preactiveElement" :widgets="prewidgets" />
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import vuePagePreview from '@/components/Dashboard/Preview/index';
import { fetchDashboard, updateDashboard } from '@/api/dashboard';
import { fetchTemplate, updateTemplate } from '@/api/template';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';
import { Loading } from 'element-ui';

import vuePageDesigner from '@/components/Dashboard/Designer';
Vue.use(vuePageDesigner);

export default {
  name: 'EditDashboard',
  components: { vuePagePreview },
  data() {
    return {
      hash: this.$route.params.hash,
      details: null,
      config: null,
      widget: null,
      title: '',
      startConfig: null,
      startWidget: null,
      dialogVisible: false,
      previewDialog: false,
      dumpConfig: null, // 退出时用来获取方法 handleSave 的参数

      uploadOption: {
        url: process.env.BASE_API + '/file/upload',
        // url: 'https://jsonplaceholder.typicode.com/photos'
      },
      isTemplate: false,
      pathFrom: '', // 退出时跳转到分组路由
      preactiveElement: null,
      prewidgets: null,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.isTemplate = (route.query && route.query.redirect) !== undefined;
        this.pathFrom = route.query.from;
      },
      immediate: true,
    },
  },

  created() {
    this.$nextTick(() => {
      this.getDashboardConfig();
    });
  },

  methods: {
    handlepreview(config) {
      this.previewDialog = true;
      this.preactiveElement = config.page;
      this.prewidgets = config.widgets;
    },

    handleSave(config) {
      const loadingInstance = Loading.service({
        fullscreen: true,
        text: '正在保存...',
      });

      var dashboard = { ...this.details };
      dashboard['config'] = config.page;
      dashboard['widget'] = config.widgets;

      const that = this;
      // var Painter = document.getElementById('viewport-screen');
      var htmlDom = document.getElementById('viewport-screen');
      html2canvas(htmlDom, {
        allowTaint: false, //允许污染
        taintTest: true, //在渲染前测试图片(没整明白有啥用)
        useCORS: true, //使用跨域(当allowTaint为true时这段代码没什么用,下面解释)
        background: '#fff',
      }).then(function (canvas) {
        let imgData = canvas.toDataURL('image/png', 1.0);
        dashboard['imgData'] = imgData;
        const updateConfig = that.isTemplate ? updateTemplate : updateDashboard;
        updateConfig(dashboard)
          .then((response) => {
            if (response.code === 0) {
              that.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                offset: 50,
                duration: 2000,
              });

              that.startConfig = JSON.stringify(config.page);
              that.startWidget = JSON.stringify(config.widgets);

              if (config.isQuit) {
                that.dialogVisible = false;
                that.getBack();
              }
            }

            that.$nextTick(() => {
              loadingInstance.close();
            });
          })
          .catch(() => {
            this.$notify({
              title: '错误',
              message: '保存失败, 请重试',
              type: 'error',
              offset: 50,
              duration: 2000,
            });

            this.$nextTick(() => {
              loadingInstance.close();
            });
          });
      });
    },

    handleQuit(config) {
      let configStr = JSON.stringify(config.page);
      let widgetStr = JSON.stringify(config.widgets);
      // console.log(this.startConfig, configStr)
      if (configStr !== this.startConfig || widgetStr !== this.startWidget) {
        // console.log('已修改')
        this.dumpConfig = { ...config };
        this.dumpConfig.isQuit = true;

        this.dialogVisible = true;
      } else {
        this.getBack();
      }
    },
    getBack() {
      console.log(this.isTemplate);
      this.$router.push({
        path: '/' + (this.isTemplate ? 'datav/template' : 'datav/project'),
      });
      // this.$router.push({ path: "/datav/template" });
    },
    saveAndQuit() {
      this.handleSave(this.dumpConfig);
    },
    handleUpload(files) {
      return new Promise((resolve) => {
        resolve({
          files: files,
          status: 200,
        });
      });
    },
    getDashboardConfig() {
      const fetchConfig = this.isTemplate ? fetchTemplate : fetchDashboard;
      fetchConfig(this.hash).then((response) => {
        if (response.data) {
          this.details = response.data;

          if (response.data.config) {
            this.config = response.data.config;
            this.widget = response.data.widget;
            this.title = this.config.title + ' - 大屏编辑';

            this.startConfig = JSON.stringify(response.data.config);
            this.startWidget = JSON.stringify(response.data.widget);
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.el-dialog__body {
  padding: 0px 20px;
}
</style>