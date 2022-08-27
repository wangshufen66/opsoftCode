<template>
  <!--特化组件-->
  <el-dropdown transfer placement="bottom">
    <id-button
      class="id-el-dropdown-button"
      styleOne
      text="导入"
      size="small"
      afterIf
      afterClass="el-icon-arrow-down el-icon--right"
    ></id-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item slot="default">
        <a href="#" @click="handleServerExcelTemplateDownload">下载模板</a>
      </el-dropdown-item>
      <el-dropdown-item slot="default">
        <el-upload
          ref="elUploadServerExcelImport"
          class="upload-demo"
          accept=".xlsx"
          multiple
          :action="serverExcelImportUrl"
          :http-request="uploadFunc"
          :show-file-list="false"
          :file-list="serverExcelImportFileList"
          :on-progress="handleOnServerExcelImporting"
          :on-error="handleOnServerExcelImportError"
          :on-success="handleOnServerExcelImportSuccess"
        >
          <a href="#">导入数据</a>
        </el-upload>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<style lang="less" scoped>
  //公司下拉菜单样式1————————————————————————————————
  .id-button {
    padding-right: 2px;
    padding-left: 10px;
    border: 1px solid #1890ff;
  }

  .id-el-dropdown-menu {
    padding: 5px 0 5px 0;
  }

  .id-el-dropdown-item {
    line-height: 28px;
    height: 28px;
    text-align: center;
    color: #1890ff;
  }
  .el-dropdown-menu__item.is-disabled {
    cursor: default;
    color: #bbb;
    pointer-events: none;
  }
  //————————————————————————————————————————————————
</style>
<script>
  import IdButton from "../id-button/index";

  export default {
    name: "id-excel",
    data() {
      return {
        serverExcelImportFileList: [],
      }
    },
    components:{
      IdButton
    },
    props: {
      // <后台Excel导入>的文件上传地址
      serverExcelImportUrl: {
        type: String,
        default() {
          // 此地址是element-ui官方API的案例服务器地址
          return "https://jsonplaceholder.typicode.com/posts/";
        },
      },
      getTemplate: {type: Function, required: true},
      importTemplate: {type: Function, required: true},
      excelName: {type: String, default: ''},
    },
    methods: {
      // 下载后台Excel导入的模板
      async handleServerExcelTemplateDownload() {
        this.$message.success("正在请求下载，请稍等...");
        let res = await Promise.resolve(this.getTemplate());
        if (res.data) {
          const filename = `${this.excelName}模板.xlsx`;
          let blob = new Blob([res.data], {
            type: res.data.type,
          });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrBlob(blob, filename);
          } else {
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, false);
            link.dispatchEvent(evt);
            document.body.removeChild(link);
          }
        } else {
          this.$notifyError("下载失败");
        }
      },
      // 覆盖默认上传方法
      async uploadFunc(ev) {
        const res = await Promise.resolve(
          this.importTemplate(
            ev.file,
            ev.file.name,
            this.$store.state.user.userInfo.orgId
          )
        );
        if (res.data.code !== 200) {
          if (res.data.msg.slice(0, 1) !== "{") {
            this.$notifyError("导入失败", res.data.msg);
            return;
          }
          res.data.msg = res.data.msg.slice(1, res.data.msg.length - 1);
          try {
            let listHTML = "";
            let arr = res.data.msg.split(",");
            const reason = arr[0].split(":")[0];
            arr.forEach((i) => {
              listHTML =
                listHTML + `<div style="width: 48%">${i.split("=")[1]}</div>`;
            });
            this.$notify({
              type: "warning",
              title: "导入异常",
              dangerouslyUseHTMLString: true,
              duration: 0,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                          <span>原因： ${reason}</span>
                          <div style="margin-bottom: 4px;">以下是异常条目：</div>
                          <div style="color: #B1B800; text-align: center; display: flex; flex-direction: row; justify-content: center;  flex-wrap: wrap;">${listHTML}</div>
                      </div>`,
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          this.$message.success("导入成功");
        }
      },
      // 后台Excel导入文件 正在上传 事件
      handleOnServerExcelImporting(event, file, fileList) {
        this.$message.warning("数据导入中，请稍后...");
      },

      // 后台Excel导入文件 上传失败出错 事件
      handleOnServerExcelImportError(err, file, fileList) {
        this.$notifyError("导入失败", "原因：" + err);
      },

      // 后台Excel导入文件 上传成功 事件
      handleOnServerExcelImportSuccess(response, file, fileList) {
        this.$refs["elUploadServerExcelImport"].clearFiles();
        this.$emit('click', 'fresh');
      },
    }
  }
</script>


